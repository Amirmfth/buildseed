"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin";
import {
  communityBlueprintToProjectIdea,
  projectIdeaToCommunityData,
} from "@/lib/blueprints/communityMapper";
import { projectIdeaToDbBlueprint } from "@/lib/blueprints/dbMapper";
import { prisma } from "@/lib/prisma";
import { validateBlueprints } from "@/lib/validateBlueprints";

export async function approveCommunityBlueprint(formData: FormData) {
  const session = await requireAdmin();
  const id = getId(formData);
  await prisma.communityBlueprint.update({
    where: { id },
    data: {
      status: "APPROVED",
      adminNote: optionalString(formData.get("adminNote")),
      reviewedById: session.user.id,
      reviewedAt: new Date(),
    },
  });
  revalidateCommunity();
}

export async function rejectCommunityBlueprint(formData: FormData) {
  const session = await requireAdmin();
  const id = getId(formData);
  await prisma.communityBlueprint.update({
    where: { id },
    data: {
      status: "REJECTED",
      adminNote: optionalString(formData.get("adminNote")) ?? "Rejected by admin.",
      reviewedById: session.user.id,
      reviewedAt: new Date(),
    },
  });
  revalidateCommunity();
}

export async function requestCommunityChanges(formData: FormData) {
  const session = await requireAdmin();
  const id = getId(formData);
  await prisma.communityBlueprint.update({
    where: { id },
    data: {
      status: "NEEDS_CHANGES",
      adminNote:
        optionalString(formData.get("adminNote")) ??
        "Please revise this blueprint and resubmit.",
      reviewedById: session.user.id,
      reviewedAt: new Date(),
    },
  });
  revalidateCommunity();
}

export async function promoteCommunityBlueprint(formData: FormData) {
  const session = await requireAdmin();
  const id = getId(formData);
  const publish = formData.get("publish") === "on";
  const row = await prisma.communityBlueprint.findUnique({
    where: { id },
    include: { author: true },
  });
  if (!row) throw new Error("Community blueprint not found.");

  const idea = communityBlueprintToProjectIdea(row);
  const validation = validateBlueprints([idea]);
  if (!validation.valid) throw new Error(validation.errors.join("\n"));

  const dbData = projectIdeaToDbBlueprint({
    ...idea,
    source: "curated",
    community: false,
  });
  await prisma.blueprint.create({
    data: {
      ...dbData,
      slug: `${dbData.slug}-community-${Date.now()}`,
      source: "CURATED",
      status: publish ? "PUBLISHED" : "DRAFT",
      createdById: session.user.id,
    },
  });
  await prisma.communityBlueprint.update({
    where: { id },
    data: {
      status: "APPROVED",
      adminNote: "Promoted to official blueprint.",
      reviewedById: session.user.id,
      reviewedAt: new Date(),
      ...projectIdeaToCommunityData(idea),
    },
  });
  revalidateCommunity();
}

export async function deleteCommunityBlueprint(formData: FormData) {
  await requireAdmin();
  const id = getId(formData);
  await prisma.communityBlueprint.delete({ where: { id } });
  revalidateCommunity();
  redirect("/admin/community");
}

function getId(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing community blueprint id.");
  return id;
}

function optionalString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || undefined;
}

function revalidateCommunity() {
  revalidatePath("/community");
  revalidatePath("/admin/community");
}
