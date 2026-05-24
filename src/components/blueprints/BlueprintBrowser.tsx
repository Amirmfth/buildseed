"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { CustomizeBlueprintDialog } from "@/components/ai/CustomizeBlueprintDialog";
import { ProjectCard } from "@/components/results/ProjectCard";
import { ProjectDetailDialog } from "@/components/results/ProjectDetailDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  categoryOptions,
  featureOptions,
  goalOptions,
  skillLevelOptions,
  timeOptions,
} from "@/data/surveyOptions";
import { developerFields, techStackOptions } from "@/data/techStacks";
import { buttonClasses, surfaceClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";
import type { ProjectIdea, ProjectMatch } from "@/lib/types";

type SortKey =
  | "relevance"
  | "portfolioValue"
  | "learningValue"
  | "buildability"
  | "uniqueness"
  | "marketPotential"
  | "defaultOrder";

type ScoreSortKey = Exclude<SortKey, "relevance" | "defaultOrder">;

const sortOptions: { label: string; value: SortKey }[] = [
  { label: "Best match / relevance", value: "relevance" },
  { label: "Portfolio value", value: "portfolioValue" },
  { label: "Learning value", value: "learningValue" },
  { label: "Buildability", value: "buildability" },
  { label: "Uniqueness", value: "uniqueness" },
  { label: "Market potential", value: "marketPotential" },
  { label: "Newest / default order", value: "defaultOrder" },
];

const ALL_FILTERS_VALUE = "__all__";
const ROW_BATCH_SIZE = 3;

export function BlueprintBrowser({ blueprints }: { blueprints: ProjectIdea[] }) {
  const [query, setQuery] = useState("");
  const [field, setField] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [time, setTime] = useState("");
  const [goal, setGoal] = useState("");
  const [category, setCategory] = useState("");
  const [stack, setStack] = useState("");
  const [feature, setFeature] = useState("");
  const [sort, setSort] = useState<SortKey>("relevance");
  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null);
  const [customizingIdea, setCustomizingIdea] = useState<ProjectIdea | null>(null);
  const [customizedMatches, setCustomizedMatches] = useState<ProjectMatch[]>([]);
  const [batchSize, setBatchSize] = useState(9);
  const [visibleCount, setVisibleCount] = useState(9);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const allStacks = useMemo(
    () =>
      Array.from(
        new Set([
          ...techStackOptions.map((option) => option.label),
          ...blueprints.flatMap((idea) => idea.stacks),
        ])
      ).sort(),
    [blueprints]
  );

  const filteredIdeas = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return blueprints
      .map((idea, index) => ({
        idea,
        index,
        relevance: getRelevanceScore(idea, normalizedQuery),
      }))
      .filter(({ idea, relevance }) => {
        if (normalizedQuery && relevance === 0) return false;
        if (field && !idea.developerFields.includes(field)) return false;
        if (difficulty && idea.difficulty !== difficulty) return false;
        if (time && idea.estimatedTime !== time) return false;
        if (goal && !idea.goals.includes(goal as never)) return false;
        if (category && !idea.categories.includes(category as never)) return false;
        if (stack && !idea.stacks.includes(stack) && !idea.recommendedStack.includes(stack)) {
          return false;
        }
        if (feature && !idea.features.includes(feature as never)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === "relevance") return b.relevance - a.relevance;
        if (sort === "defaultOrder") return a.index - b.index;
        return b.idea[sort as ScoreSortKey] - a.idea[sort as ScoreSortKey];
      })
      .map(({ idea, relevance }) => ({
        idea,
        score:
          sort === "relevance" || sort === "defaultOrder"
            ? relevance
            : idea[sort],
        percentage: Math.min(96, Math.max(62, 70 + Math.round(relevance / 3))),
        matchReasons: [
          `${field ? "Filtered" : "Available"} for ${getFieldLabels(idea).slice(0, 2).join(", ")}`,
          `${idea.difficulty} scope`,
          `Uses ${idea.recommendedStack.slice(0, 2).join(", ")}`,
        ],
      })) satisfies ProjectMatch[];
  }, [blueprints, category, difficulty, feature, field, goal, query, sort, stack, time]);

  const visibleIdeas = [...customizedMatches, ...filteredIdeas];
  const renderedIdeas = visibleIdeas.slice(0, visibleCount);
  const hasMoreIdeas = visibleCount < visibleIdeas.length;

  useEffect(() => {
    function updateBatchSize() {
      const columns = window.matchMedia("(min-width: 1280px)").matches
        ? 3
        : window.matchMedia("(min-width: 768px)").matches
          ? 2
          : 1;
      const nextBatchSize = columns * ROW_BATCH_SIZE;
      setBatchSize(nextBatchSize);
      setVisibleCount((current) => Math.max(current, nextBatchSize));
    }

    updateBatchSize();
    window.addEventListener("resize", updateBatchSize);

    return () => window.removeEventListener("resize", updateBatchSize);
  }, []);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMoreIdeas) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((current) =>
            Math.min(current + batchSize, visibleIdeas.length)
          );
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [batchSize, hasMoreIdeas, visibleIdeas.length]);

  function clearFilters() {
    setQuery("");
    setField("");
    setDifficulty("");
    setTime("");
    setGoal("");
    setCategory("");
    setStack("");
    setFeature("");
    setSort("relevance");
    setVisibleCount(batchSize);
  }

  function resetVisibleResults() {
    setVisibleCount(batchSize);
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
            Browse Blueprints
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-50">
            Find project blueprints by field, stack, and scope.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Search the full local BuildSeed library without taking the survey.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={clearFilters}
          className={cn("h-11", buttonClasses.outline)}
        >
          <X className="size-4" />
          Clear filters
        </Button>
      </div>

      <div className={cn("rounded-2xl p-4 sm:p-5", surfaceClasses.panel)}>
        <div className="grid gap-3 lg:grid-cols-[1.2fr_repeat(3,0.75fr)]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                resetVisibleResults();
              }}
              placeholder="Search title, stack, category, feature..."
              className="h-11 rounded-xl border-[#3F3F46] bg-[#09090B] pl-9 text-zinc-100 placeholder:text-zinc-600"
            />
          </label>
          <FilterSelect
            label="Developer field"
            value={field}
            onChange={(value) => {
              setField(value);
              resetVisibleResults();
            }}
            options={developerFields.map((item) => ({
              label: item.label,
              value: item.id,
            }))}
          />
          <FilterSelect
            label="Difficulty"
            value={difficulty}
            onChange={(value) => {
              setDifficulty(value);
              resetVisibleResults();
            }}
            options={skillLevelOptions.map((item) => ({
              label: item,
              value: item,
            }))}
          />
          <FilterSelect
            label="Sort"
            value={sort}
            onChange={(value) => {
              setSort(value as SortKey);
              resetVisibleResults();
            }}
            options={sortOptions}
          />
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <FilterSelect
            label="Time"
            value={time}
            onChange={(value) => {
              setTime(value);
              resetVisibleResults();
            }}
            options={timeOptions.map((item) => ({ label: item, value: item }))}
          />
          <FilterSelect
            label="Goal"
            value={goal}
            onChange={(value) => {
              setGoal(value);
              resetVisibleResults();
            }}
            options={goalOptions.map((item) => ({ label: item, value: item }))}
          />
          <FilterSelect
            label="Category"
            value={category}
            onChange={(value) => {
              setCategory(value);
              resetVisibleResults();
            }}
            options={categoryOptions.map((item) => ({
              label: item,
              value: item,
            }))}
          />
          <FilterSelect
            label="Tech stack"
            value={stack}
            onChange={(value) => {
              setStack(value);
              resetVisibleResults();
            }}
            options={allStacks.map((item) => ({ label: item, value: item }))}
          />
          <FilterSelect
            label="Feature"
            value={feature}
            onChange={(value) => {
              setFeature(value);
              resetVisibleResults();
            }}
            options={featureOptions.map((item) => ({ label: item, value: item }))}
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-cyan-300" />
            {visibleIdeas.length} blueprints found
            {visibleIdeas.length > 0 ? (
              <span className="text-zinc-600">
                ({Math.min(visibleCount, visibleIdeas.length)} shown)
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {getActiveFilters({
              field,
              difficulty,
              time,
              goal,
              category,
              stack,
              feature,
              clear: {
                field: () => {
                  setField("");
                  resetVisibleResults();
                },
                difficulty: () => {
                  setDifficulty("");
                  resetVisibleResults();
                },
                time: () => {
                  setTime("");
                  resetVisibleResults();
                },
                goal: () => {
                  setGoal("");
                  resetVisibleResults();
                },
                category: () => {
                  setCategory("");
                  resetVisibleResults();
                },
                stack: () => {
                  setStack("");
                  resetVisibleResults();
                },
                feature: () => {
                  setFeature("");
                  resetVisibleResults();
                },
              },
            }).map((filter) => (
                <button
                  key={`${filter.label}-${filter.value}`}
                  type="button"
                  onClick={filter.clear}
                  className="rounded-full border border-[#3F3F46] bg-[#27272A] px-3 py-1 font-mono text-xs text-zinc-300 hover:text-white"
                >
                  {filter.label}: {filter.value} x
                </button>
              ))}
          </div>
        </div>
      </div>

      {visibleIdeas.length > 0 ? (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {renderedIdeas.map((match) => (
              <ProjectCard
                key={match.idea.id}
                match={match}
                onViewBlueprint={() => setSelectedIdea(match.idea)}
                onCustomizeBlueprint={() => setCustomizingIdea(match.idea)}
              />
            ))}
          </div>
          <div ref={loadMoreRef} className="mt-8 flex justify-center">
            {hasMoreIdeas ? (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setVisibleCount((current) =>
                    Math.min(current + batchSize, visibleIdeas.length)
                  )
                }
                className={cn("h-11", buttonClasses.outline)}
              >
                Load more blueprints
              </Button>
            ) : (
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-600">
                End of results
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-8 text-center">
          <h2 className="text-lg font-semibold text-zinc-50">
            No blueprints found.
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Try removing a filter or searching another technology.
          </p>
        </div>
      )}

      <ProjectDetailDialog
        idea={selectedIdea}
        open={Boolean(selectedIdea)}
        onOpenChange={(open) => {
          if (!open) setSelectedIdea(null);
        }}
        onCustomizeBlueprint={(idea) => setCustomizingIdea(idea)}
      />
      <CustomizeBlueprintDialog
        blueprint={customizingIdea}
        open={Boolean(customizingIdea)}
        onOpenChange={(open) => {
          if (!open) setCustomizingIdea(null);
        }}
        onCustomized={(idea) => {
          const customizedMatch: ProjectMatch = {
            idea,
            score: 100,
            percentage: 100,
            matchType: "ai",
            matchReasons: [
              "Customized from a browsed blueprint",
              "Adjusted from your freeform request",
              "Ready to copy or refine",
            ],
          };
          setCustomizedMatches((current) => [customizedMatch, ...current]);
          setSelectedIdea(idea);
        }}
      />
    </section>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <Select
      value={value || ALL_FILTERS_VALUE}
      onValueChange={(nextValue) =>
        onChange(nextValue === ALL_FILTERS_VALUE ? "" : nextValue)
      }
    >
      <SelectTrigger aria-label={label}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_FILTERS_VALUE}>{label}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function getActiveFilters(input: {
  field: string;
  difficulty: string;
  time: string;
  goal: string;
  category: string;
  stack: string;
  feature: string;
  clear: Record<string, () => void>;
}) {
  return [
    { label: "Field", value: input.field, clear: input.clear.field },
    { label: "Difficulty", value: input.difficulty, clear: input.clear.difficulty },
    { label: "Time", value: input.time, clear: input.clear.time },
    { label: "Goal", value: input.goal, clear: input.clear.goal },
    { label: "Category", value: input.category, clear: input.clear.category },
    { label: "Stack", value: input.stack, clear: input.clear.stack },
    { label: "Feature", value: input.feature, clear: input.clear.feature },
  ].filter((filter) => Boolean(filter.value));
}

function getRelevanceScore(idea: ProjectIdea, query: string) {
  if (!query) return idea.portfolioValue + idea.learningValue + idea.buildability;

  const searchable = [
    idea.title,
    idea.shortDescription,
    idea.longDescription,
    ...idea.developerFields,
    ...getFieldLabels(idea),
    ...idea.stacks,
    ...idea.recommendedStack,
    ...idea.categories,
    ...idea.goals,
    ...idea.features,
    ...idea.learningOutcomes,
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(query) ? 40 + idea.portfolioValue : 0;
}

function getFieldLabels(idea: ProjectIdea) {
  return idea.developerFields.map(
    (id) => developerFields.find((field) => field.id === id)?.label ?? id
  );
}
