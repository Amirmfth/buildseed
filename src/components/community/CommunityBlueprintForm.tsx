"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { categoryOptions, featureOptions, goalOptions, skillLevelOptions, timeOptions } from "@/data/surveyOptions";
import { developerFields, techStackOptions } from "@/data/techStacks";
import { defaultCommunityRichContent } from "@/lib/blueprints/communityForm";
import { cn } from "@/lib/utils";
import type { ProjectIdea } from "@/lib/types";

export function CommunityBlueprintForm({
  action,
  initialBlueprint,
  submitLabel = "Submit for review",
}: {
  action: (formData: FormData) => void | Promise<void>;
  initialBlueprint?: ProjectIdea;
  submitLabel?: string;
}) {
  const [selectedFields, setSelectedFields] = useState<string[]>(
    initialBlueprint?.developerFields ?? []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialBlueprint?.categories ?? []
  );
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    initialBlueprint?.goals ?? []
  );
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    initialBlueprint?.features ?? []
  );
  const [selectedStacks, setSelectedStacks] = useState<string[]>(
    initialBlueprint?.stacks ?? []
  );
  const [selectedRecommended, setSelectedRecommended] = useState<string[]>(
    initialBlueprint?.recommendedStack ?? []
  );
  const [stackQuery, setStackQuery] = useState("");

  const stackOptions = useMemo(() => {
    const query = stackQuery.trim().toLowerCase();
    const candidates = techStackOptions.map((option) => option.label);
    const unique = Array.from(new Set(candidates));
    if (!query) return unique.slice(0, 120);
    return unique
      .filter((item) => item.toLowerCase().includes(query))
      .slice(0, 80);
  }, [stackQuery]);

  return (
    <form action={action} className="grid gap-5">
      {initialBlueprint ? (
        <input type="hidden" name="id" value={initialBlueprint.id} />
      ) : null}

      <input type="hidden" name="developerFields" value={toJson(selectedFields)} />
      <input type="hidden" name="categories" value={toJson(selectedCategories)} />
      <input type="hidden" name="goals" value={toJson(selectedGoals)} />
      <input type="hidden" name="features" value={toJson(selectedFeatures)} />
      <input type="hidden" name="stacks" value={toJson(selectedStacks)} />
      <input
        type="hidden"
        name="recommendedStack"
        value={toJson(selectedRecommended)}
      />

      <Panel title="Basics">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" name="title" defaultValue={initialBlueprint?.title} />
          <Field label="Slug" name="slug" defaultValue={initialBlueprint?.slug} />
          <Field
            label="Short description"
            name="shortDescription"
            defaultValue={initialBlueprint?.shortDescription}
          />
          <SelectField
            label="Difficulty"
            name="difficulty"
            options={skillLevelOptions}
            defaultValue={initialBlueprint?.difficulty ?? "Intermediate"}
          />
          <SelectField
            label="Estimated time"
            name="estimatedTime"
            options={timeOptions}
            defaultValue={initialBlueprint?.estimatedTime ?? "2-3 weeks"}
          />
        </div>
        <Textarea
          label="Long description"
          name="longDescription"
          defaultValue={initialBlueprint?.longDescription}
        />
      </Panel>

      <Panel title="Blueprint Tags">
        <p className="text-sm text-zinc-400">
          Use the same option sets used across BuildSeed. This keeps submissions reviewable and searchable.
        </p>
        <SelectionGroup
          title="Developer fields"
          options={developerFields.map((field) => field.label)}
          values={selectedFields}
          onChange={setSelectedFields}
        />
        <SelectionGroup
          title="Categories"
          options={categoryOptions}
          values={selectedCategories}
          onChange={setSelectedCategories}
        />
        <SelectionGroup
          title="Goals"
          options={goalOptions}
          values={selectedGoals}
          onChange={setSelectedGoals}
        />
        <SelectionGroup
          title="Features"
          options={featureOptions}
          values={selectedFeatures}
          onChange={setSelectedFeatures}
        />
      </Panel>

      <Panel title="Stack Selection">
        <input
          value={stackQuery}
          onChange={(event) => setStackQuery(event.target.value)}
          placeholder="Search available technologies..."
          className="h-11 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm text-zinc-100 outline-none focus:border-green-500/70"
        />
        <SelectionGroup
          title="Stacks"
          options={stackOptions}
          values={selectedStacks}
          onChange={setSelectedStacks}
        />
        <SelectionGroup
          title="Recommended stack"
          options={stackOptions}
          values={selectedRecommended}
          onChange={setSelectedRecommended}
        />
      </Panel>

      <Panel title="Scores">
        <div className="grid gap-4 md:grid-cols-5">
          <Field label="Portfolio" name="portfolioValue" type="number" defaultValue={String(initialBlueprint?.portfolioValue ?? 7)} />
          <Field label="Learning" name="learningValue" type="number" defaultValue={String(initialBlueprint?.learningValue ?? 8)} />
          <Field label="Buildability" name="buildability" type="number" defaultValue={String(initialBlueprint?.buildability ?? 8)} />
          <Field label="Uniqueness" name="uniqueness" type="number" defaultValue={String(initialBlueprint?.uniqueness ?? 6)} />
          <Field label="Market" name="marketPotential" type="number" defaultValue={String(initialBlueprint?.marketPotential ?? 6)} />
        </div>
      </Panel>

      <Panel title="Rich Content JSON">
        <p className="text-sm text-zinc-400">
          Community submissions are reviewed before publishing. Keep sections specific and practical.
        </p>
        <textarea
          name="richContent"
          defaultValue={
            initialBlueprint
              ? JSON.stringify(extractRichContent(initialBlueprint), null, 2)
              : defaultCommunityRichContent()
          }
          className="min-h-[520px] rounded-xl border border-[#3F3F46] bg-[#09090B] p-4 font-mono text-xs leading-6 text-zinc-100 outline-none focus:border-green-500/70"
        />
      </Panel>

      <div className="flex justify-end">
        <button className="h-11 rounded-xl bg-green-500 px-5 text-sm font-semibold text-[#09090B] transition hover:bg-green-600">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function SelectionGroup({
  title,
  options,
  values,
  onChange,
}: {
  title: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="grid gap-2">
      <p className="font-mono text-xs uppercase text-zinc-500">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() =>
                onChange(
                  selected
                    ? values.filter((item) => item !== option)
                    : [...values, option]
                )
              }
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition",
                selected
                  ? "border-green-500/50 bg-green-500/15 text-green-200"
                  : "border-[#3F3F46] bg-[#09090B] text-zinc-400 hover:text-zinc-100"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  name,
  defaultValue = "",
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-xs uppercase text-zinc-500">{label}</span>
      <input
        name={name}
        type={type}
        min={type === "number" ? 1 : undefined}
        max={type === "number" ? 10 : undefined}
        defaultValue={defaultValue}
        className="h-11 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm text-zinc-100 outline-none focus:border-green-500/70"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: readonly string[];
  defaultValue: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-xs uppercase text-zinc-500">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-11 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm text-zinc-100 outline-none focus:border-green-500/70"
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

function Textarea({
  label,
  name,
  defaultValue = "",
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-xs uppercase text-zinc-500">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        className="min-h-24 rounded-xl border border-[#3F3F46] bg-[#09090B] p-3 text-sm text-zinc-100 outline-none focus:border-green-500/70"
      />
    </label>
  );
}

function extractRichContent(idea: ProjectIdea) {
  return {
    coreFeatures: idea.coreFeatures,
    stretchFeatures: idea.stretchFeatures,
    learningOutcomes: idea.learningOutcomes,
    buildPhases: idea.buildPhases,
    architecture: idea.architecture,
    suggestedStructure: idea.suggestedStructure,
    scopeTiers: idea.scopeTiers,
    realWorldChallenges: idea.realWorldChallenges,
    portfolioTalkingPoints: idea.portfolioTalkingPoints,
    practicalSkills: idea.practicalSkills,
    commonMistakes: idea.commonMistakes,
    recommendedLearning: idea.recommendedLearning,
    inspiredBy: idea.inspiredBy,
    timeDistribution: idea.timeDistribution,
    complexity: idea.complexity,
    teamExpansion: idea.teamExpansion,
    monetizationIdeas: idea.monetizationIdeas,
    resumeImpact: idea.resumeImpact,
    aiBuildSuggestions: idea.aiBuildSuggestions,
    whyThisProjectMatters: idea.whyThisProjectMatters,
    featureFlow: idea.featureFlow,
  };
}

function toJson(values: string[]) {
  return JSON.stringify(values);
}
