import type { ProjectIdea, SurveyAnswers } from "@/lib/types";
import { enrichBlueprint } from "@/lib/blueprints/enrichBlueprint";

const requiredStringFields = [
  "title",
  "slug",
  "shortDescription",
  "longDescription",
] as const;

const requiredArrayFields = [
  "developerFields",
  "categories",
  "goals",
  "stacks",
  "features",
  "coreFeatures",
  "stretchFeatures",
  "learningOutcomes",
  "recommendedStack",
] as const;

export function validateGeneratedBlueprint(value: unknown): ProjectIdea {
  if (!value || typeof value !== "object") {
    throw new Error("AI returned an invalid blueprint.");
  }

  const blueprint = value as Record<string, unknown>;

  for (const field of requiredStringFields) {
    if (typeof blueprint[field] !== "string" || !blueprint[field]) {
      throw new Error(`AI blueprint is missing ${field}.`);
    }
  }

  for (const field of requiredArrayFields) {
    if (!Array.isArray(blueprint[field]) || blueprint[field].length === 0) {
      throw new Error(`AI blueprint is missing ${field}.`);
    }
  }

  for (const field of [
    "portfolioValue",
    "learningValue",
    "buildability",
    "uniqueness",
    "marketPotential",
  ]) {
    if (typeof blueprint[field] !== "number") {
      throw new Error(`AI blueprint is missing numeric ${field}.`);
    }
  }

  if (typeof blueprint.difficulty !== "string") {
    throw new Error("AI blueprint is missing difficulty.");
  }

  if (typeof blueprint.estimatedTime !== "string") {
    throw new Error("AI blueprint is missing estimated time.");
  }

  return blueprint as ProjectIdea;
}

export function normalizeGeneratedBlueprint(
  value: unknown,
  answers: SurveyAnswers
): unknown {
  const blueprint =
    value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const title =
    typeof blueprint.title === "string" && blueprint.title.trim()
      ? blueprint.title
      : "Custom Project Blueprint";
  const stacks = normalizeArray(blueprint.stacks, [
    ...answers.stacks,
    ...answers.customStacks,
  ]);
  const recommendedStack = normalizeArray(blueprint.recommendedStack, stacks);

  return enrichBlueprint({
    ...blueprint,
    title,
    slug:
      typeof blueprint.slug === "string" && blueprint.slug.trim()
        ? safeSlug(blueprint.slug)
        : safeSlug(title),
    shortDescription:
      typeof blueprint.shortDescription === "string" &&
      blueprint.shortDescription.trim()
        ? blueprint.shortDescription
        : "A custom project blueprint generated from your BuildSeed survey answers.",
    longDescription:
      typeof blueprint.longDescription === "string" &&
      blueprint.longDescription.trim()
        ? blueprint.longDescription
        : "This blueprint is scoped around your selected developer fields, stack, and optional preferences.",
    developerFields: normalizeArray(blueprint.developerFields, answers.developerFields),
    categories: normalizeArray(
      blueprint.categories,
      answers.category ? [answers.category] : ["Developer tool"]
    ),
    goals: normalizeArray(
      blueprint.goals,
      answers.goal ? [answers.goal] : ["Portfolio"]
    ),
    stacks,
    difficulty:
      typeof blueprint.difficulty === "string" && blueprint.difficulty.trim()
        ? blueprint.difficulty
        : answers.skillLevel ?? "Intermediate",
    estimatedTime:
      typeof blueprint.estimatedTime === "string" &&
      blueprint.estimatedTime.trim()
        ? blueprint.estimatedTime
        : answers.availableTime ?? "2-3 weeks",
    features: normalizeArray(
      blueprint.features,
      answers.features.length > 0
        ? answers.features
        : ["Search/filtering", "Testing", "Deployment"]
    ),
    portfolioValue: normalizeScore(blueprint.portfolioValue, 8),
    learningValue: normalizeScore(blueprint.learningValue, 8),
    buildability: normalizeScore(blueprint.buildability, 7),
    uniqueness: normalizeScore(blueprint.uniqueness, 7),
    marketPotential: normalizeScore(blueprint.marketPotential, 6),
    coreFeatures: padArray(normalizeArray(blueprint.coreFeatures, []), [
      "Primary workspace",
      "Create and edit flow",
      "Search and filtering",
      "Detail view",
    ]),
    stretchFeatures: padArray(normalizeArray(blueprint.stretchFeatures, []), [
      "Import/export workflow",
      "Advanced analytics",
      "Deployment polish",
    ]),
    learningOutcomes: padArray(
      normalizeArray(blueprint.learningOutcomes, []),
      ["Project scoping", "State and data modeling", "Production polish"]
    ),
    recommendedStack,
    source: "ai",
    generated: true,
  } as ProjectIdea, answers);
}

export function safeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeArray(value: unknown, fallback: string[]) {
  if (Array.isArray(value)) {
    const items = value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);

    if (items.length > 0) return Array.from(new Set(items));
  }

  return fallback;
}

function normalizeScore(value: unknown, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.min(10, Math.max(1, Math.round(value)));
}

function padArray(items: string[], fallback: string[]) {
  const merged = [...items];

  for (const item of fallback) {
    if (merged.length >= fallback.length) break;
    if (!merged.includes(item)) merged.push(item);
  }

  return merged;
}
