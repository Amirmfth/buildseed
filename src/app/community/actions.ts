"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseCommunityBlueprintForm } from "@/lib/blueprints/communityForm";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/user";

export async function submitCommunityBlueprint(formData: FormData) {
  const session = await requireUser("/community/submit");
  const { data } = parseCommunityBlueprintForm(formData);
  const existingSlug = await prisma.communityBlueprint.findFirst({
    where: { authorId: session.user.id, slug: data.slug },
    select: { id: true },
  });

  await prisma.communityBlueprint.create({
    data: {
      ...data,
      slug: existingSlug ? `${data.slug}-${Date.now()}` : data.slug,
      authorId: session.user.id,
      status: "PENDING",
    },
  });

  revalidatePath("/community");
  revalidatePath("/community/my-submissions");
  redirect("/community/my-submissions?submitted=1");
}

export async function resubmitCommunityBlueprint(formData: FormData) {
  const session = await requireUser("/community/my-submissions");
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing submission.");

  const submission = await prisma.communityBlueprint.findFirst({
    where: { id, authorId: session.user.id },
  });
  if (!submission) throw new Error("Submission not found.");
  if (!["NEEDS_CHANGES", "REJECTED"].includes(submission.status)) {
    throw new Error("Only rejected or needs-changes submissions can be edited.");
  }

  const { data } = parseCommunityBlueprintForm(formData);
  await prisma.communityBlueprint.update({
    where: { id },
    data: {
      ...data,
      status: "PENDING",
      adminNote: null,
      reviewedAt: null,
      reviewedById: null,
    },
  });

  revalidatePath("/community/my-submissions");
  redirect("/community/my-submissions?resubmitted=1");
}
