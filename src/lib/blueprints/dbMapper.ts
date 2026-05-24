import type { Prisma } from "@prisma/client";

import { enrichBlueprint } from "@/lib/blueprints/enrichBlueprint";
import type { ProjectIdea } from "@/lib/types";

export type BlueprintRow = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  developerFields: Prisma.JsonValue;
  categories: Prisma.JsonValue;
  goals: Prisma.JsonValue;
  stacks: Prisma.JsonValue;
  difficulty: string;
  estimatedTime: string;
  features: Prisma.JsonValue;
  recommendedStack: Prisma.JsonValue;
  portfolioValue: number;
  learningValue: number;
  buildability: number;
  uniqueness: number;
  marketPotential: number;
  richContent: Prisma.JsonValue;
  source: string;
  featured: boolean;
  generated: boolean;
  customized: boolean;
  baseBlueprintId: string | null;
};

export const richKeys = [
  "coreFeatures",
  "stretchFeatures",
  "learningOutcomes",
  "buildPhases",
  "architecture",
  "suggestedStructure",
  "scopeTiers",
  "realWorldChallenges",
  "portfolioTalkingPoints",
  "practicalSkills",
  "commonMistakes",
  "recommendedLearning",
  "inspiredBy",
  "timeDistribution",
  "complexity",
  "teamExpansion",
  "monetizationIdeas",
  "resumeImpact",
  "aiBuildSuggestions",
  "whyThisProjectMatters",
  "featureFlow",
] as const;

export function dbBlueprintToProjectIdea(row: BlueprintRow): ProjectIdea {
  const richContent = isRecord(row.richContent) ? row.richContent : {};

  return enrichBlueprint({
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.shortDescription,
    longDescription: row.longDescription,
    developerFields: toStringArray(row.developerFields),
    categories: toStringArray(row.categories),
    goals: toStringArray(row.goals),
    stacks: toStringArray(row.stacks),
    difficulty: row.difficulty,
    estimatedTime: row.estimatedTime,
    features: toStringArray(row.features),
    recommendedStack: toStringArray(row.recommendedStack),
    coreFeatures: toStringArrayOrFallback(richContent.coreFeatures, [
      "Primary workspace",
      "Create and edit flow",
      "Search and filtering",
      "Detail view",
    ]),
    stretchFeatures: toStringArrayOrFallback(richContent.stretchFeatures, [
      "Import/export workflow",
      "Advanced analytics",
      "Deployment polish",
    ]),
    learningOutcomes: toStringArrayOrFallback(richContent.learningOutcomes, [
      "Project scoping",
      "State and data modeling",
      "Production polish",
    ]),
    portfolioValue: row.portfolioValue,
    learningValue: row.learningValue,
    buildability: row.buildability,
    uniqueness: row.uniqueness,
    marketPotential: row.marketPotential,
    ...richContent,
    generated: row.generated,
    customized: row.customized,
    source: row.source === "CURATED" ? "curated" : "ai",
    baseBlueprintId: row.baseBlueprintId ?? undefined,
  } as ProjectIdea);
}

export function projectIdeaToDbBlueprint(idea: ProjectIdea) {
  const richContent = getProjectIdeaRichContent(idea);

  return {
    slug: idea.slug,
    title: idea.title,
    shortDescription: idea.shortDescription,
    longDescription: idea.longDescription,
    developerFields: idea.developerFields,
    categories: idea.categories,
    goals: idea.goals,
    stacks: idea.stacks,
    difficulty: idea.difficulty,
    estimatedTime: idea.estimatedTime,
    features: idea.features,
    recommendedStack: idea.recommendedStack,
    portfolioValue: idea.portfolioValue,
    learningValue: idea.learningValue,
    buildability: idea.buildability,
    uniqueness: idea.uniqueness,
    marketPotential: idea.marketPotential,
    richContent,
    source: idea.customized ? "CUSTOMIZED" : idea.generated ? "AI" : "CURATED",
    generated: Boolean(idea.generated),
    customized: Boolean(idea.customized),
    baseBlueprintId: idea.baseBlueprintId ?? null,
  };
}

export function getProjectIdeaRichContent(idea: ProjectIdea) {
  return Object.fromEntries(richKeys.map((key) => [key, idea[key]]));
}

function toStringArray(value: Prisma.JsonValue) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toStringArrayOrFallback(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const items = value.filter((item): item is string => typeof item === "string");
  return items.length > 0 ? items : fallback;
}

function isRecord(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
