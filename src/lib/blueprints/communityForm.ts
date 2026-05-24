import { z } from "zod";

import { enrichBlueprint } from "@/lib/blueprints/enrichBlueprint";
import { getProjectIdeaRichContent } from "@/lib/blueprints/dbMapper";
import type { ProjectIdea } from "@/lib/types";
import { validateBlueprints } from "@/lib/validateBlueprints";

const communityFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().min(2),
  shortDescription: z.string().min(8),
  longDescription: z.string().min(16),
  developerFields: z.array(z.string()).min(1),
  categories: z.array(z.string()).min(1),
  goals: z.array(z.string()).min(1),
  stacks: z.array(z.string()).min(1),
  difficulty: z.string().min(1),
  estimatedTime: z.string().min(1),
  features: z.array(z.string()).min(1),
  recommendedStack: z.array(z.string()).min(1),
  portfolioValue: z.coerce.number().int().min(1).max(10),
  learningValue: z.coerce.number().int().min(1).max(10),
  buildability: z.coerce.number().int().min(1).max(10),
  uniqueness: z.coerce.number().int().min(1).max(10),
  marketPotential: z.coerce.number().int().min(1).max(10),
  richContent: z.record(z.string(), z.unknown()),
});

export function parseCommunityBlueprintForm(formData: FormData) {
  const parsed = communityFormSchema.parse({
    id: optionalString(formData.get("id")),
    title: String(formData.get("title") ?? ""),
    slug: slugify(String(formData.get("slug") || formData.get("title") || "")),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    longDescription: String(formData.get("longDescription") ?? ""),
    developerFields: parseTagList(formData.get("developerFields")),
    categories: parseTagList(formData.get("categories")),
    goals: parseTagList(formData.get("goals")),
    stacks: parseTagList(formData.get("stacks")),
    difficulty: String(formData.get("difficulty") ?? ""),
    estimatedTime: String(formData.get("estimatedTime") ?? ""),
    features: parseTagList(formData.get("features")),
    recommendedStack: parseTagList(formData.get("recommendedStack")),
    portfolioValue: formData.get("portfolioValue"),
    learningValue: formData.get("learningValue"),
    buildability: formData.get("buildability"),
    uniqueness: formData.get("uniqueness"),
    marketPotential: formData.get("marketPotential"),
    richContent: parseJsonObject(formData.get("richContent")),
  });

  const base = withRequiredBlueprintArrays({
    id: parsed.id || parsed.slug,
    ...parsed,
    ...parsed.richContent,
  });
  const idea = enrichBlueprint(base as unknown as ProjectIdea);
  const validation = validateBlueprints([idea]);
  if (!validation.valid) throw new Error(validation.errors.join("\n"));

  return {
    parsed,
    idea,
    data: {
      slug: parsed.slug,
      title: parsed.title,
      shortDescription: parsed.shortDescription,
      longDescription: parsed.longDescription,
      developerFields: parsed.developerFields,
      categories: parsed.categories,
      goals: parsed.goals,
      stacks: parsed.stacks,
      difficulty: parsed.difficulty,
      estimatedTime: parsed.estimatedTime,
      features: parsed.features,
      recommendedStack: parsed.recommendedStack,
      portfolioValue: parsed.portfolioValue,
      learningValue: parsed.learningValue,
      buildability: parsed.buildability,
      uniqueness: parsed.uniqueness,
      marketPotential: parsed.marketPotential,
      richContent: getProjectIdeaRichContent(idea),
    },
  };
}

export function defaultCommunityRichContent() {
  return JSON.stringify(
    getProjectIdeaRichContent(
      enrichBlueprint({
        id: "community-blueprint",
        slug: "community-blueprint",
        title: "Community Blueprint",
        shortDescription: "A practical project blueprint submitted by the community.",
        longDescription:
          "A practical project blueprint submitted by the community and reviewed before publishing.",
        developerFields: ["fullstack"],
        categories: ["Full-stack"],
        goals: ["Portfolio"],
        stacks: ["Next.js", "PostgreSQL", "Tailwind CSS"],
        difficulty: "Intermediate",
        estimatedTime: "2-3 weeks",
        features: ["Database modeling", "Search/filtering", "Deployment"],
        recommendedStack: ["Next.js", "PostgreSQL", "Tailwind CSS"],
        coreFeatures: [
          "Submission workflow",
          "Blueprint detail view",
          "Search and filtering",
          "Save and start project actions",
        ],
        stretchFeatures: [
          "Preset AI customization",
          "Advanced moderation insights",
          "Community ranking",
        ],
        learningOutcomes: [
          "Model rich project plans",
          "Write realistic build phases",
          "Scope by time and difficulty",
        ],
        portfolioValue: 7,
        learningValue: 8,
        buildability: 8,
        uniqueness: 6,
        marketPotential: 6,
      } as ProjectIdea)
    ),
    null,
    2
  );
}

function parseTagList(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return [];
  if (raw.startsWith("[")) {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("Tag fields must be string arrays.");
    }
    return parsed
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return raw
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseJsonObject(value: FormDataEntryValue | null) {
  const text = String(value ?? "{}").trim() || "{}";
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("richContent must be a JSON object.");
  }
  return parsed as Record<string, unknown>;
}

function optionalString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || undefined;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function withRequiredBlueprintArrays(value: Record<string, unknown>) {
  const coreFeatures = toStringArray(value.coreFeatures, [
    "Core workflow",
    "Data model",
    "Project detail view",
    "Deployment-ready basics",
  ]);
  const stretchFeatures = toStringArray(value.stretchFeatures, [
    "Analytics view",
    "Team collaboration",
    "Advanced quality checks",
  ]);
  const learningOutcomes = toStringArray(value.learningOutcomes, [
    "Ship a scoped project blueprint",
    "Design practical build phases",
    "Communicate architecture choices",
  ]);

  return {
    ...value,
    coreFeatures,
    stretchFeatures,
    learningOutcomes,
  };
}

function toStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const items = value.filter((item): item is string => typeof item === "string");
  return items.length > 0 ? items : fallback;
}
