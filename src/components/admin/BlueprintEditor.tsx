"use client";

import { useRef, useState } from "react";

import { BlueprintDetailDialog } from "@/components/blueprints/BlueprintDetailDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  categoryOptions,
  featureOptions,
  goalOptions,
} from "@/data/surveyOptions";
import { developerFields, techStackOptions } from "@/data/techStacks";
import { enrichBlueprint } from "@/lib/blueprints/enrichBlueprint";
import { buttonClasses, surfaceClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";
import { validateBlueprints } from "@/lib/validateBlueprints";
import type {
  BlueprintArchitecture,
  BuildPhase,
  FeatureFlowEdge,
  ProjectIdea,
  RecommendedLearning,
  ScopeTier,
  TimeDistribution,
} from "@/lib/types";

type BlueprintEditorProps = {
  initialBlueprint: ProjectIdea;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  source?: "CURATED" | "AI" | "CUSTOMIZED";
  featured?: boolean;
  mode?: "admin" | "community";
  submitLabel?: string;
  action: (formData: FormData) => void | Promise<void>;
};

export function BlueprintEditor({
  initialBlueprint,
  status = "DRAFT",
  source = "CURATED",
  featured = false,
  mode = "admin",
  submitLabel = "Submit for review",
  action,
}: BlueprintEditorProps) {
  const isCommunityMode = mode === "community";
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewBlueprint, setPreviewBlueprint] =
    useState<ProjectIdea>(initialBlueprint);
  const [richContent, setRichContent] = useState(() =>
    getInitialRichContent(initialBlueprint)
  );
  const [advancedJson, setAdvancedJson] = useState(() =>
    JSON.stringify(getInitialRichContent(initialBlueprint), null, 2)
  );
  const [activeRichTab, setActiveRichTab] = useState("overview");
  const [aiLoading, setAiLoading] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [developerFieldValues, setDeveloperFieldValues] = useState(
    initialBlueprint.developerFields
  );
  const [categoryValues, setCategoryValues] = useState(
    initialBlueprint.categories.map(String)
  );
  const [goalValues, setGoalValues] = useState(initialBlueprint.goals.map(String));
  const [stackValues, setStackValues] = useState(initialBlueprint.stacks);
  const [featureValues, setFeatureValues] = useState(
    initialBlueprint.features.map(String)
  );
  const [recommendedStackValues, setRecommendedStackValues] = useState(
    initialBlueprint.recommendedStack
  );

  function buildPreview() {
    const form = formRef.current;
    if (!form) return null;
    const formData = new FormData(form);

    return enrichBlueprint({
      id: initialBlueprint.id,
      slug: String(formData.get("slug") ?? initialBlueprint.slug),
      title: String(formData.get("title") ?? initialBlueprint.title),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      longDescription: String(formData.get("longDescription") ?? ""),
      developerFields: parseArray(formData, "developerFields"),
      categories: parseArray(formData, "categories"),
      goals: parseArray(formData, "goals"),
      stacks: parseArray(formData, "stacks"),
      difficulty: String(formData.get("difficulty") ?? ""),
      estimatedTime: String(formData.get("estimatedTime") ?? ""),
      features: parseArray(formData, "features"),
      recommendedStack: parseArray(formData, "recommendedStack"),
      portfolioValue: Number(formData.get("portfolioValue")),
      learningValue: Number(formData.get("learningValue")),
      buildability: Number(formData.get("buildability")),
      uniqueness: Number(formData.get("uniqueness")),
      marketPotential: Number(formData.get("marketPotential")),
      ...richContent,
    } as ProjectIdea);
  }

  function validateForm() {
    try {
      const preview = buildPreview();
      if (!preview) return false;
      const validation = validateBlueprints([preview]);
      if (!validation.valid) {
        setError(validation.errors.join("\n"));
        return false;
      }
      setError("");
      setPreviewBlueprint(preview);
      return true;
    } catch (validationError) {
      setError(
        validationError instanceof Error
          ? validationError.message
          : "Invalid blueprint data."
      );
      return false;
    }
  }

  async function runAiTool(action: string) {
    const preview = buildPreview();
    if (!preview) return;
    const targetField =
      action === "rewrite"
        ? window.prompt("Rewrite for which developer field?")
        : undefined;
    setAiLoading(action);
    setError("");
    setAiOutput("");

    try {
      const response = await fetch("/api/admin/ai-blueprint-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, blueprint: preview, targetField }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "AI tool failed.");
      setAiOutput(JSON.stringify(payload, null, 2));
      if (payload.blueprint) {
        setRichContent(getInitialRichContent(payload.blueprint));
        setAdvancedJson(JSON.stringify(getInitialRichContent(payload.blueprint), null, 2));
        setPreviewBlueprint(payload.blueprint);
      }
    } catch (aiError) {
      setError(aiError instanceof Error ? aiError.message : "AI tool failed.");
    } finally {
      setAiLoading("");
    }
  }

  return (
    <>
      <form
        ref={formRef}
        action={action}
        onSubmit={(event) => {
          if (!validateForm()) event.preventDefault();
        }}
        className="grid gap-5"
      >
        <input type="hidden" name="id" value={initialBlueprint.id} />
        <div className={cn("grid gap-4 rounded-2xl p-5", surfaceClasses.panel)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title" name="title" defaultValue={initialBlueprint.title} />
            <Field label="Slug" name="slug" defaultValue={initialBlueprint.slug} />
            <Field
              label="Short description"
              name="shortDescription"
              defaultValue={initialBlueprint.shortDescription}
            />
            <Field
              label="Difficulty"
              name="difficulty"
              defaultValue={initialBlueprint.difficulty}
            />
            <Field
              label="Estimated time"
              name="estimatedTime"
              defaultValue={initialBlueprint.estimatedTime}
            />
            {!isCommunityMode ? (
              <>
                <SelectField label="Status" name="status" defaultValue={status} />
                <SelectField label="Source" name="source" defaultValue={source} />
                <Field
                  label="Base blueprint id"
                  name="baseBlueprintId"
                  defaultValue={initialBlueprint.baseBlueprintId ?? ""}
                />
              </>
            ) : null}
          </div>
          <label className="grid gap-2">
            <span className="font-mono text-xs uppercase text-zinc-500">
              Long description
            </span>
            <textarea
              name="longDescription"
              defaultValue={initialBlueprint.longDescription}
              className="min-h-28 rounded-xl border border-[#3F3F46] bg-[#09090B] p-3 text-sm text-zinc-100 outline-none focus:border-green-500/70"
            />
          </label>
          {!isCommunityMode ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <Checkbox label="Featured" name="featured" defaultChecked={featured} />
              <Checkbox label="Generated" name="generated" defaultChecked={Boolean(initialBlueprint.generated)} />
              <Checkbox label="Customized" name="customized" defaultChecked={Boolean(initialBlueprint.customized)} />
            </div>
          ) : null}
        </div>

        <div className={cn("grid gap-4 rounded-2xl p-5", surfaceClasses.panel)}>
          <h3 className="text-lg font-semibold">Scores</h3>
          <div className="grid gap-4 md:grid-cols-5">
            {[
              "portfolioValue",
              "learningValue",
              "buildability",
              "uniqueness",
              "marketPotential",
            ].map((name) => (
              <Field
                key={name}
                label={name}
                name={name}
                type="number"
                min={1}
                max={10}
                defaultValue={String(initialBlueprint[name as keyof ProjectIdea])}
              />
            ))}
          </div>
        </div>

        <div className={cn("grid gap-4 rounded-2xl p-5", surfaceClasses.panel)}>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
              Classification
            </p>
            <h3 className="mt-2 text-lg font-semibold">Selectable metadata</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Select known values or add custom entries. These still submit as JSON arrays for the database.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <MultiSelectField
              name="developerFields"
              label="Developer fields"
              values={developerFieldValues}
              options={developerFields.map((field) => ({
                label: field.label,
                value: field.id,
              }))}
              onChange={setDeveloperFieldValues}
            />
            <MultiSelectField
              name="categories"
              label="Categories"
              values={categoryValues}
              options={categoryOptions.map((item) => ({ label: item, value: item }))}
              onChange={setCategoryValues}
            />
            <MultiSelectField
              name="goals"
              label="Goals"
              values={goalValues}
              options={goalOptions.map((item) => ({ label: item, value: item }))}
              onChange={setGoalValues}
            />
            <MultiSelectField
              name="features"
              label="Features"
              values={featureValues}
              options={featureOptions.map((item) => ({ label: item, value: item }))}
              onChange={setFeatureValues}
            />
            <MultiSelectField
              name="stacks"
              label="Tech stacks"
              values={stackValues}
              options={getTechStackSelectOptions()}
              onChange={setStackValues}
            />
            <MultiSelectField
              name="recommendedStack"
              label="Recommended stack"
              values={recommendedStackValues}
              options={getTechStackSelectOptions()}
              onChange={setRecommendedStackValues}
            />
          </div>
        </div>

        <div className={cn("grid gap-4 rounded-2xl p-5", surfaceClasses.panel)}>
          <input
            type="hidden"
            name="richContent"
            value={JSON.stringify(richContent)}
          />
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
              Blueprint plan
            </p>
            <h3 className="mt-2 text-lg font-semibold">
              Structured rich content editor
            </h3>
            <p className="mt-1 text-sm text-zinc-400">
              Edit the sections shown in the public blueprint modal. Advanced JSON remains available for full-schema edits.
            </p>
          </div>
          <Tabs
            value={activeRichTab}
            onValueChange={setActiveRichTab}
            className="grid gap-4"
          >
            <TabsList className="scrollbar-hidden h-auto w-full justify-start overflow-x-auto rounded-xl border border-[#3F3F46]/60 bg-[#09090B] p-1">
              {[
                ["overview", "Overview"],
                ["features", "Features"],
                ["build", "Build Plan"],
                ["architecture", "Architecture"],
                ["portfolio", "Portfolio"],
                ["expansion", "Expansion"],
                ["challenges", "Challenges"],
                ["advanced", "Advanced JSON"],
              ].map(([value, label]) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="shrink-0 rounded-lg px-3 py-2 text-xs data-active:bg-green-500 data-active:text-[#09090B]"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {activeRichTab === "overview" ? (
            <RichSection>
              <TextArea
                label="Why this project matters"
                value={richContent.whyThisProjectMatters}
                onChange={(value) =>
                  setRichContent((current) => ({
                    ...current,
                    whyThisProjectMatters: value,
                  }))
                }
              />
              <ArrayEditor
                label="Inspired by"
                value={richContent.inspiredBy}
                onChange={(value) =>
                  setRichContent((current) => ({ ...current, inspiredBy: value }))
                }
              />
              <TimeDistributionEditor
                value={richContent.timeDistribution}
                onChange={(value) =>
                  setRichContent((current) => ({
                    ...current,
                    timeDistribution: value,
                  }))
                }
              />
            </RichSection>
          ) : null}

          {activeRichTab === "features" ? (
            <RichSection>
              <ArrayEditor
                label="Core features"
                value={richContent.coreFeatures}
                onChange={(value) =>
                  setRichContent((current) => ({ ...current, coreFeatures: value }))
                }
              />
              <ArrayEditor
                label="Stretch features"
                value={richContent.stretchFeatures}
                onChange={(value) =>
                  setRichContent((current) => ({
                    ...current,
                    stretchFeatures: value,
                  }))
                }
              />
              <ArrayEditor
                label="Learning outcomes"
                value={richContent.learningOutcomes}
                onChange={(value) =>
                  setRichContent((current) => ({
                    ...current,
                    learningOutcomes: value,
                  }))
                }
              />
              <FeatureFlowEditor
                value={richContent.featureFlow}
                onChange={(value) =>
                  setRichContent((current) => ({ ...current, featureFlow: value }))
                }
              />
            </RichSection>
          ) : null}

          {activeRichTab === "build" ? (
            <BuildPhasesEditor
              value={richContent.buildPhases}
              onChange={(value) =>
                setRichContent((current) => ({ ...current, buildPhases: value }))
              }
            />
          ) : null}

          {activeRichTab === "architecture" ? (
            <ArchitectureEditor
              architecture={richContent.architecture}
              structure={richContent.suggestedStructure}
              onArchitectureChange={(value) =>
                setRichContent((current) => ({ ...current, architecture: value }))
              }
              onStructureChange={(value) =>
                setRichContent((current) => ({
                  ...current,
                  suggestedStructure: value,
                }))
              }
            />
          ) : null}

          {activeRichTab === "portfolio" ? (
            <RichSection>
              <ArrayEditor
                label="Portfolio talking points"
                value={richContent.portfolioTalkingPoints}
                onChange={(value) =>
                  setRichContent((current) => ({
                    ...current,
                    portfolioTalkingPoints: value,
                  }))
                }
              />
              <ArrayEditor
                label="Practical skills"
                value={richContent.practicalSkills}
                onChange={(value) =>
                  setRichContent((current) => ({
                    ...current,
                    practicalSkills: value,
                  }))
                }
              />
              <RecommendedLearningEditor
                value={richContent.recommendedLearning}
                onChange={(value) =>
                  setRichContent((current) => ({
                    ...current,
                    recommendedLearning: value,
                  }))
                }
              />
              <div className="grid gap-4 md:grid-cols-3">
                {(["junior", "mid", "senior"] as const).map((key) => (
                  <TextArea
                    key={key}
                    label={`Resume impact: ${key}`}
                    value={richContent.resumeImpact[key]}
                    onChange={(value) =>
                      setRichContent((current) => ({
                        ...current,
                        resumeImpact: {
                          ...current.resumeImpact,
                          [key]: value,
                        },
                      }))
                    }
                  />
                ))}
              </div>
            </RichSection>
          ) : null}

          {activeRichTab === "expansion" ? (
            <RichSection>
              <ScopeTiersEditor
                value={richContent.scopeTiers}
                onChange={(value) =>
                  setRichContent((current) => ({ ...current, scopeTiers: value }))
                }
              />
              <div className="grid gap-4 md:grid-cols-3">
                {(["solo", "teamOf2", "teamOf4"] as const).map((key) => (
                  <ArrayEditor
                    key={key}
                    label={`Team expansion: ${key}`}
                    value={richContent.teamExpansion[key]}
                    onChange={(value) =>
                      setRichContent((current) => ({
                        ...current,
                        teamExpansion: {
                          ...current.teamExpansion,
                          [key]: value,
                        },
                      }))
                    }
                  />
                ))}
              </div>
              <ArrayEditor
                label="Monetization ideas"
                value={richContent.monetizationIdeas ?? []}
                onChange={(value) =>
                  setRichContent((current) => ({
                    ...current,
                    monetizationIdeas: value,
                  }))
                }
              />
              <ArrayEditor
                label="AI build suggestions"
                value={richContent.aiBuildSuggestions}
                onChange={(value) =>
                  setRichContent((current) => ({
                    ...current,
                    aiBuildSuggestions: value,
                  }))
                }
              />
            </RichSection>
          ) : null}

          {activeRichTab === "challenges" ? (
            <RichSection>
              <ArrayEditor
                label="Real-world challenges"
                value={richContent.realWorldChallenges}
                onChange={(value) =>
                  setRichContent((current) => ({
                    ...current,
                    realWorldChallenges: value,
                  }))
                }
              />
              <ArrayEditor
                label="Common mistakes"
                value={richContent.commonMistakes}
                onChange={(value) =>
                  setRichContent((current) => ({
                    ...current,
                    commonMistakes: value,
                  }))
                }
              />
              <ComplexityEditor
                value={richContent.complexity}
                onChange={(value) =>
                  setRichContent((current) => ({ ...current, complexity: value }))
                }
              />
            </RichSection>
          ) : null}

          {activeRichTab === "advanced" ? (
            <RichSection>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h4 className="text-base font-semibold">Advanced JSON mode</h4>
                  <p className="mt-1 text-sm text-zinc-400">
                    Paste or edit the full richContent object. Apply JSON before saving.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setAdvancedJson(JSON.stringify(richContent, null, 2))
                    }
                    className={cn("h-10", buttonClasses.outline)}
                  >
                    Sync from structured
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      try {
                        const parsed = JSON.parse(advancedJson);
                        setRichContent(parsed);
                        setError("");
                      } catch {
                        setError("Advanced richContent JSON is invalid.");
                      }
                    }}
                    className={cn("h-10", buttonClasses.primary)}
                  >
                    Apply JSON
                  </Button>
                </div>
              </div>
              <textarea
                value={advancedJson}
                onChange={(event) => setAdvancedJson(event.target.value)}
                className="min-h-[520px] rounded-xl border border-[#3F3F46] bg-[#09090B] p-4 font-mono text-xs leading-6 text-zinc-100 outline-none focus:border-green-500/70"
              />
            </RichSection>
          ) : null}
          {!isCommunityMode ? (
            <Field label="Revision note" name="revisionNote" defaultValue="" />
          ) : null}
        </div>

        {!isCommunityMode ? (
          <div className={cn("grid gap-4 rounded-2xl p-5", surfaceClasses.panel)}>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
                AI Blueprint Tools
              </p>
              <h3 className="mt-2 text-lg font-semibold">
                Admin-assisted editing
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                AI output is applied to rich sections for single-blueprint actions. Review and save manually.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ["improve", "Improve this blueprint"],
                ["missing", "Generate missing sections"],
                ["beginner", "Make beginner-friendly"],
                ["similar", "Create 5 similar"],
                ["rewrite", "Rewrite for field"],
              ].map(([actionId, label]) => (
                <Button
                  key={actionId}
                  type="button"
                  variant="outline"
                  disabled={Boolean(aiLoading)}
                  onClick={() => runAiTool(actionId)}
                  className={cn("h-10", buttonClasses.outline)}
                >
                  {aiLoading === actionId ? "Running..." : label}
                </Button>
              ))}
            </div>
            {aiOutput ? (
              <textarea
                value={aiOutput}
                readOnly
                className="min-h-48 rounded-xl border border-[#3F3F46] bg-[#09090B] p-3 font-mono text-xs text-zinc-300"
              />
            ) : null}
          </div>
        ) : null}

        {error ? (
          <pre className="white-space-pre-wrap rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </pre>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => validateForm()}
            className={cn("h-11", buttonClasses.outline)}
          >
            Validate Blueprint
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (validateForm()) setPreviewOpen(true);
            }}
            className={cn("h-11", buttonClasses.outline)}
          >
            Preview Blueprint
          </Button>
          {!isCommunityMode ? (
            <>
              <Button
                type="submit"
                name="intent"
                value="DRAFT"
                className={cn("h-11", buttonClasses.outline)}
                variant="outline"
              >
                Save Draft
              </Button>
              <Button
                type="submit"
                name="intent"
                value="PUBLISHED"
                className={cn("h-11", buttonClasses.primary)}
              >
                Publish
              </Button>
            </>
          ) : (
            <Button type="submit" className={cn("h-11", buttonClasses.primary)}>
              {submitLabel}
            </Button>
          )}
        </div>
      </form>
      <BlueprintDetailDialog
        idea={previewBlueprint}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  min,
  max,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-xs uppercase text-zinc-500">{label}</span>
      <Input
        name={name}
        type={type}
        min={min}
        max={max}
        defaultValue={defaultValue}
        className="h-11 rounded-xl border-[#3F3F46] bg-[#09090B] text-zinc-100"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  const options =
    name === "status"
      ? ["DRAFT", "PUBLISHED", "ARCHIVED"]
      : ["CURATED", "AI", "CUSTOMIZED"];

  return (
    <label className="grid gap-2">
      <span className="font-mono text-xs uppercase text-zinc-500">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-11 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm text-zinc-100 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-[#3F3F46]/60 bg-[#09090B]/60 px-3 py-2 text-sm text-zinc-300">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}

function MultiSelectField({
  name,
  label,
  values,
  options,
  onChange,
}: {
  name: string;
  label: string;
  values: string[];
  options: { label: string; value: string }[];
  onChange: (values: string[]) => void;
}) {
  const [customValue, setCustomValue] = useState("");
  const selected = new Set(values);
  const mergedOptions = [
    ...options,
    ...values
      .filter((value) => !options.some((option) => option.value === value))
      .map((value) => ({ label: value, value })),
  ];

  function toggle(value: string) {
    onChange(
      selected.has(value)
        ? values.filter((item) => item !== value)
        : [...values, value]
    );
  }

  function addCustom() {
    const value = customValue.trim();
    if (!value || selected.has(value)) return;
    onChange([...values, value]);
    setCustomValue("");
  }

  return (
    <section className="rounded-2xl border border-[#3F3F46]/60 bg-[#09090B]/45 p-4">
      <input type="hidden" name={name} value={JSON.stringify(values)} />
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="font-mono text-xs uppercase text-zinc-500">{label}</h4>
          <p className="mt-1 text-xs text-zinc-500">{values.length} selected</p>
        </div>
        {values.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-200"
          >
            Clear
          </button>
        ) : null}
      </div>
      <div className="mt-3 flex max-h-52 flex-wrap gap-2 overflow-y-auto pr-1 scrollbar-hidden">
        {mergedOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition",
              selected.has(option.value)
                ? "border-green-500/45 bg-green-500/15 text-green-200"
                : "border-[#3F3F46] bg-[#18181B] text-zinc-400 hover:border-cyan-500/35 hover:text-zinc-100"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
        <Input
          value={customValue}
          onChange={(event) => setCustomValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addCustom();
            }
          }}
          placeholder={`Add custom ${label.toLowerCase()}`}
          className="h-10 rounded-xl border-[#3F3F46] bg-[#09090B] text-zinc-100"
        />
        <Button
          type="button"
          variant="outline"
          onClick={addCustom}
          className={cn("h-10", buttonClasses.outline)}
        >
          Add
        </Button>
      </div>
    </section>
  );
}

function getTechStackSelectOptions() {
  return Array.from(
    new Map(
      techStackOptions.map((option) => [
        option.label,
        {
          label: `${option.label} · ${option.category}`,
          value: option.label,
        },
      ])
    ).values()
  ).sort((a, b) => a.value.localeCompare(b.value));
}

function RichSection({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4">{children}</div>;
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-xs uppercase text-zinc-500">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 rounded-xl border border-[#3F3F46] bg-[#09090B] p-3 text-sm leading-6 text-zinc-100 outline-none focus:border-green-500/70"
      />
    </label>
  );
}

function ArrayEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-xs uppercase text-zinc-500">{label}</span>
      <textarea
        value={value.join("\n")}
        onChange={(event) => onChange(linesToArray(event.target.value))}
        className="min-h-32 rounded-xl border border-[#3F3F46] bg-[#09090B] p-3 text-sm leading-6 text-zinc-100 outline-none focus:border-green-500/70"
      />
      <span className="text-xs text-zinc-500">One item per line.</span>
    </label>
  );
}

function BuildPhasesEditor({
  value,
  onChange,
}: {
  value: BuildPhase[];
  onChange: (value: BuildPhase[]) => void;
}) {
  function update(index: number, patch: Partial<BuildPhase>) {
    onChange(value.map((phase, i) => (i === index ? { ...phase, ...patch } : phase)));
  }

  return (
    <RichSection>
      {value.map((phase, index) => (
        <article
          key={`${phase.title}-${index}`}
          className="rounded-2xl border border-[#3F3F46]/60 bg-[#09090B]/60 p-4"
        >
          <p className="font-mono text-xs uppercase text-cyan-300">
            Phase {index + 1}
          </p>
          <div className="mt-3 grid gap-3">
            <FieldLike
              label="Title"
              value={phase.title}
              onChange={(next) => update(index, { title: next })}
            />
            <TextArea
              label="Description"
              value={phase.description}
              onChange={(next) => update(index, { description: next })}
            />
            <ArrayEditor
              label="Tasks"
              value={phase.tasks}
              onChange={(next) => update(index, { tasks: next })}
            />
          </div>
        </article>
      ))}
    </RichSection>
  );
}

function ArchitectureEditor({
  architecture,
  structure,
  onArchitectureChange,
  onStructureChange,
}: {
  architecture: BlueprintArchitecture;
  structure: ProjectIdea["suggestedStructure"];
  onArchitectureChange: (value: BlueprintArchitecture) => void;
  onStructureChange: (value: ProjectIdea["suggestedStructure"]) => void;
}) {
  const keys = [
    "frontend",
    "backend",
    "database",
    "infrastructure",
    "integrations",
    "security",
  ] as const;

  return (
    <RichSection>
      <TextArea
        label="Architecture overview"
        value={architecture.overview}
        onChange={(value) => onArchitectureChange({ ...architecture, overview: value })}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {keys.map((key) => (
          <ArrayEditor
            key={key}
            label={`Architecture: ${key}`}
            value={architecture[key] ?? []}
            onChange={(value) => onArchitectureChange({ ...architecture, [key]: value })}
          />
        ))}
      </div>
      <FieldLike
        label="Structure label"
        value={structure.label}
        onChange={(value) => onStructureChange({ ...structure, label: value })}
      />
      <ArrayEditor
        label="Folder tree"
        value={structure.tree}
        onChange={(value) => onStructureChange({ ...structure, tree: value })}
      />
    </RichSection>
  );
}

function ScopeTiersEditor({
  value,
  onChange,
}: {
  value: ScopeTier[];
  onChange: (value: ScopeTier[]) => void;
}) {
  function update(index: number, patch: Partial<ScopeTier>) {
    onChange(value.map((tier, i) => (i === index ? { ...tier, ...patch } : tier)));
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {value.map((tier, index) => (
        <article
          key={tier.tier}
          className="rounded-2xl border border-[#3F3F46]/60 bg-[#09090B]/60 p-4"
        >
          <p className="font-mono text-xs uppercase text-cyan-300">{tier.tier}</p>
          <div className="mt-3 grid gap-3">
            <FieldLike
              label="Title"
              value={tier.title}
              onChange={(next) => update(index, { title: next })}
            />
            <TextArea
              label="Description"
              value={tier.description}
              onChange={(next) => update(index, { description: next })}
            />
            <ArrayEditor
              label="Features"
              value={tier.features}
              onChange={(next) => update(index, { features: next })}
            />
          </div>
        </article>
      ))}
    </div>
  );
}

function RecommendedLearningEditor({
  value,
  onChange,
}: {
  value: RecommendedLearning[];
  onChange: (value: RecommendedLearning[]) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-xs uppercase text-zinc-500">
        Recommended learning
      </span>
      <textarea
        value={value.map((item) => `${item.title} | ${item.topic}`).join("\n")}
        onChange={(event) =>
          onChange(
            linesToArray(event.target.value).map((line) => {
              const [title, topic] = line.split("|").map((item) => item.trim());
              return { title: title || "Learning item", topic: topic || title || "Topic" };
            })
          )
        }
        className="min-h-32 rounded-xl border border-[#3F3F46] bg-[#09090B] p-3 text-sm leading-6 text-zinc-100 outline-none focus:border-green-500/70"
      />
      <span className="text-xs text-zinc-500">Format: title | topic</span>
    </label>
  );
}

function TimeDistributionEditor({
  value,
  onChange,
}: {
  value: TimeDistribution[];
  onChange: (value: TimeDistribution[]) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-xs uppercase text-zinc-500">
        Time distribution
      </span>
      <textarea
        value={value.map((item) => `${item.label} | ${item.percentage}`).join("\n")}
        onChange={(event) =>
          onChange(
            linesToArray(event.target.value).map((line) => {
              const [label, percentage] = line.split("|").map((item) => item.trim());
              return {
                label: label || "Workstream",
                percentage: Number(percentage) || 0,
              };
            })
          )
        }
        className="min-h-32 rounded-xl border border-[#3F3F46] bg-[#09090B] p-3 text-sm leading-6 text-zinc-100 outline-none focus:border-green-500/70"
      />
      <span className="text-xs text-zinc-500">Format: label | percentage</span>
    </label>
  );
}

function FeatureFlowEditor({
  value,
  onChange,
}: {
  value: FeatureFlowEdge[];
  onChange: (value: FeatureFlowEdge[]) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-xs uppercase text-zinc-500">Feature flow</span>
      <textarea
        value={value.map((edge) => `${edge.from} -> ${edge.to}`).join("\n")}
        onChange={(event) =>
          onChange(
            linesToArray(event.target.value).map((line) => {
              const [from, to] = line.split("->").map((item) => item.trim());
              return { from: from || "Start", to: to || "Next" };
            })
          )
        }
        className="min-h-32 rounded-xl border border-[#3F3F46] bg-[#09090B] p-3 text-sm leading-6 text-zinc-100 outline-none focus:border-green-500/70"
      />
      <span className="text-xs text-zinc-500">Format: from -&gt; to</span>
    </label>
  );
}

function ComplexityEditor({
  value,
  onChange,
}: {
  value: ProjectIdea["complexity"];
  onChange: (value: ProjectIdea["complexity"]) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      {(["frontend", "backend", "architecture", "uiux", "deployment"] as const).map(
        (key) => (
          <label key={key} className="grid gap-2">
            <span className="font-mono text-xs uppercase text-zinc-500">{key}</span>
            <Input
              type="number"
              min={1}
              max={10}
              value={value[key]}
              onChange={(event) =>
                onChange({
                  ...value,
                  [key]: Math.min(10, Math.max(1, Number(event.target.value) || 1)),
                })
              }
              className="h-11 rounded-xl border-[#3F3F46] bg-[#09090B] text-zinc-100"
            />
          </label>
        )
      )}
    </div>
  );
}

function FieldLike({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-xs uppercase text-zinc-500">{label}</span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border-[#3F3F46] bg-[#09090B] text-zinc-100"
      />
    </label>
  );
}

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getInitialRichContent(blueprint: ProjectIdea) {
  return {
    coreFeatures: blueprint.coreFeatures,
    stretchFeatures: blueprint.stretchFeatures,
    learningOutcomes: blueprint.learningOutcomes,
    buildPhases: blueprint.buildPhases,
    architecture: blueprint.architecture,
    suggestedStructure: blueprint.suggestedStructure,
    scopeTiers: blueprint.scopeTiers,
    realWorldChallenges: blueprint.realWorldChallenges,
    portfolioTalkingPoints: blueprint.portfolioTalkingPoints,
    practicalSkills: blueprint.practicalSkills,
    commonMistakes: blueprint.commonMistakes,
    recommendedLearning: blueprint.recommendedLearning,
    inspiredBy: blueprint.inspiredBy,
    timeDistribution: blueprint.timeDistribution,
    complexity: blueprint.complexity,
    teamExpansion: blueprint.teamExpansion,
    monetizationIdeas: blueprint.monetizationIdeas ?? [],
    resumeImpact: blueprint.resumeImpact,
    aiBuildSuggestions: blueprint.aiBuildSuggestions,
    whyThisProjectMatters: blueprint.whyThisProjectMatters,
    featureFlow: blueprint.featureFlow,
  };
}

function parseArray(formData: FormData, key: string) {
  const value = JSON.parse(String(formData.get(key) ?? "[]"));
  if (!Array.isArray(value)) throw new Error(`${key} must be an array.`);
  return value;
}
