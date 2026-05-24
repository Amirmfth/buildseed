"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { dbBlueprintToProjectIdea, type BlueprintRow } from "@/lib/blueprints/dbMapper";
import { prisma } from "@/lib/prisma";
import { validateBlueprints } from "@/lib/validateBlueprints";
import type { ProjectIdea } from "@/lib/types";

const blueprintSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().min(2),
  shortDescription: z.string().min(8),
  longDescription: z.string().min(16),
  difficulty: z.string().min(1),
  estimatedTime: z.string().min(1),
  portfolioValue: z.coerce.number().int().min(1).max(10),
  learningValue: z.coerce.number().int().min(1).max(10),
  buildability: z.coerce.number().int().min(1).max(10),
  uniqueness: z.coerce.number().int().min(1).max(10),
  marketPotential: z.coerce.number().int().min(1).max(10),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  source: z.enum(["CURATED", "AI", "CUSTOMIZED"]),
  featured: z.boolean(),
  generated: z.boolean(),
  customized: z.boolean(),
  baseBlueprintId: z.string().optional(),
  developerFields: z.array(z.string()).min(1),
  categories: z.array(z.string()).min(1),
  goals: z.array(z.string()).min(1),
  stacks: z.array(z.string()).min(1),
  features: z.array(z.string()).min(1),
  recommendedStack: z.array(z.string()).min(1),
  richContent: z.record(z.string(), z.unknown()),
  revisionNote: z.string().optional(),
});

export async function createBlueprint(formData: FormData) {
  const session = await requireAdmin();
  const parsed = parseBlueprintForm(formData);
  assertValidBlueprint(parsed);

  const blueprint = await prisma.blueprint.create({
    data: {
      ...toPrismaData(parsed),
      createdById: session.user.id,
    },
  });

  revalidateBlueprints();
  redirect(`/admin/blueprints/${blueprint.id}/edit`);
}

export async function updateBlueprint(formData: FormData) {
  const session = await requireAdmin();
  const parsed = parseBlueprintForm(formData);

  if (!parsed.id) {
    throw new Error("Missing blueprint id.");
  }

  assertValidBlueprint(parsed);

  const previous = await prisma.blueprint.findUnique({
    where: { id: parsed.id },
  });

  if (!previous) {
    throw new Error("Blueprint not found.");
  }

  await prisma.blueprintRevision.create({
    data: {
      blueprintId: previous.id,
      snapshot: previous as unknown as Prisma.InputJsonValue,
      createdById: session.user.id,
      note: parsed.revisionNote || "Updated from admin panel",
    },
  });

  await prisma.blueprint.update({
    where: { id: parsed.id },
    data: toPrismaData(parsed),
  });

  revalidateBlueprints();
}

export async function deleteBlueprint(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing blueprint id.");

  await prisma.blueprint.delete({ where: { id } });
  revalidateBlueprints();
}

export async function duplicateBlueprint(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing blueprint id.");

  const blueprint = await prisma.blueprint.findUnique({ where: { id } });
  if (!blueprint) throw new Error("Blueprint not found.");

  const copy = await prisma.blueprint.create({
    data: {
      slug: `${blueprint.slug}-copy-${Date.now()}`,
      title: `${blueprint.title} Copy`,
      shortDescription: blueprint.shortDescription,
      longDescription: blueprint.longDescription,
      developerFields: blueprint.developerFields ?? [],
      categories: blueprint.categories ?? [],
      goals: blueprint.goals ?? [],
      stacks: blueprint.stacks ?? [],
      difficulty: blueprint.difficulty,
      estimatedTime: blueprint.estimatedTime,
      features: blueprint.features ?? [],
      recommendedStack: blueprint.recommendedStack ?? [],
      portfolioValue: blueprint.portfolioValue,
      learningValue: blueprint.learningValue,
      buildability: blueprint.buildability,
      uniqueness: blueprint.uniqueness,
      marketPotential: blueprint.marketPotential,
      richContent: blueprint.richContent ?? {},
      source: blueprint.source,
      status: "DRAFT",
      featured: false,
      generated: blueprint.generated,
      customized: blueprint.customized,
      baseBlueprintId: blueprint.baseBlueprintId,
      createdById: session.user.id,
    },
  });

  revalidateBlueprints();
  redirect(`/admin/blueprints/${copy.id}/edit`);
}

export async function updateBlueprintStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
    throw new Error("Invalid status update.");
  }

  await prisma.blueprint.update({
    where: { id },
    data: { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" },
  });
  revalidateBlueprints();
}

export async function toggleFeatured(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const featured = String(formData.get("featured") ?? "") === "true";
  if (!id) throw new Error("Missing blueprint id.");

  await prisma.blueprint.update({
    where: { id },
    data: { featured: !featured },
  });
  revalidateBlueprints();
}

function parseBlueprintForm(formData: FormData) {
  return blueprintSchema.parse({
    id: optionalString(formData.get("id")),
    title: String(formData.get("title") ?? ""),
    slug: slugify(String(formData.get("slug") || formData.get("title") || "")),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    longDescription: String(formData.get("longDescription") ?? ""),
    difficulty: String(formData.get("difficulty") ?? ""),
    estimatedTime: String(formData.get("estimatedTime") ?? ""),
    portfolioValue: formData.get("portfolioValue"),
    learningValue: formData.get("learningValue"),
    buildability: formData.get("buildability"),
    uniqueness: formData.get("uniqueness"),
    marketPotential: formData.get("marketPotential"),
    status: String(formData.get("intent") ?? formData.get("status") ?? "DRAFT"),
    source: String(formData.get("source") ?? "CURATED"),
    featured: formData.get("featured") === "on",
    generated: formData.get("generated") === "on",
    customized: formData.get("customized") === "on",
    baseBlueprintId: optionalString(formData.get("baseBlueprintId")),
    developerFields: parseJsonArray(formData, "developerFields"),
    categories: parseJsonArray(formData, "categories"),
    goals: parseJsonArray(formData, "goals"),
    stacks: parseJsonArray(formData, "stacks"),
    features: parseJsonArray(formData, "features"),
    recommendedStack: parseJsonArray(formData, "recommendedStack"),
    richContent: parseJsonObject(formData, "richContent"),
    revisionNote: optionalString(formData.get("revisionNote")),
  });
}

function assertValidBlueprint(value: z.infer<typeof blueprintSchema>) {
  const idea = dbBlueprintToProjectIdea({
    ...value,
    id: value.id || value.slug,
    baseBlueprintId: value.baseBlueprintId ?? null,
  } as BlueprintRow);
  const validation = validateBlueprints([idea as ProjectIdea]);

  if (!validation.valid) {
    throw new Error(validation.errors.join("\n"));
  }
}

function toPrismaData(value: z.infer<typeof blueprintSchema>) {
  return {
    slug: value.slug,
    title: value.title,
    shortDescription: value.shortDescription,
    longDescription: value.longDescription,
    developerFields: value.developerFields,
    categories: value.categories,
    goals: value.goals,
    stacks: value.stacks,
    difficulty: value.difficulty,
    estimatedTime: value.estimatedTime,
    features: value.features,
    recommendedStack: value.recommendedStack,
    portfolioValue: value.portfolioValue,
    learningValue: value.learningValue,
    buildability: value.buildability,
    uniqueness: value.uniqueness,
    marketPotential: value.marketPotential,
    richContent: value.richContent as Prisma.InputJsonValue,
    source: value.source,
    status: value.status,
    featured: value.featured,
    generated: value.generated,
    customized: value.customized,
    baseBlueprintId: value.baseBlueprintId || null,
  };
}

function parseJsonArray(formData: FormData, key: string) {
  const value = JSON.parse(String(formData.get(key) ?? "[]"));
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${key} must be a JSON array of strings.`);
  }
  return value;
}

function parseJsonObject(formData: FormData, key: string) {
  const value = JSON.parse(String(formData.get(key) ?? "{}"));
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${key} must be a JSON object.`);
  }
  return value as Record<string, unknown>;
}

function optionalString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || undefined;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function revalidateBlueprints() {
  revalidatePath("/");
  revalidatePath("/blueprints");
  revalidatePath("/admin");
  revalidatePath("/admin/blueprints");
}
