"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { dbBlueprintToProjectIdea } from "@/lib/blueprints/dbMapper";
import { communityBlueprintToProjectIdea } from "@/lib/blueprints/communityMapper";
import { prisma } from "@/lib/prisma";
import type { ProjectIdea } from "@/lib/types";
import { requireUser } from "@/lib/user";

export async function saveBlueprintAction(input: {
  blueprintId?: string;
  communityBlueprintId?: string;
  blueprint?: ProjectIdea;
  callbackUrl?: string;
}) {
  const session = await requireUser(input.callbackUrl ?? "/saved");

  if (input.communityBlueprintId) {
    const communityExists = await prisma.communityBlueprint.findFirst({
      where: { id: input.communityBlueprintId, status: "APPROVED" },
      select: { id: true },
    });

    if (communityExists) {
      const existingSave = await prisma.savedBlueprint.findFirst({
        where: {
          userId: session.user.id,
          communityBlueprintId: input.communityBlueprintId,
        },
      });

      if (!existingSave) {
        await prisma.savedBlueprint.create({
          data: {
            userId: session.user.id,
            communityBlueprintId: input.communityBlueprintId,
            snapshot: input.blueprint ? toJson(input.blueprint) : undefined,
          },
        });
      }
    } else if (input.blueprint) {
      await prisma.savedBlueprint.create({
        data: { userId: session.user.id, snapshot: toJson(input.blueprint) },
      });
    }
  } else if (input.blueprintId) {
    const blueprintExists = await prisma.blueprint.findUnique({
      where: { id: input.blueprintId },
      select: { id: true },
    });

    if (blueprintExists) {
      const existingSave = await prisma.savedBlueprint.findFirst({
        where: {
          userId: session.user.id,
          blueprintId: input.blueprintId,
        },
      });

      if (!existingSave) {
        await prisma.savedBlueprint.create({
          data: {
            userId: session.user.id,
            blueprintId: input.blueprintId,
          },
        });
      }
    } else if (input.blueprint) {
      await prisma.savedBlueprint.create({
        data: {
          userId: session.user.id,
          snapshot: toJson(input.blueprint),
        },
      });
    }
  } else if (input.blueprint) {
    await prisma.savedBlueprint.create({
      data: {
        userId: session.user.id,
        snapshot: toJson(input.blueprint),
      },
    });
  }

  revalidateSaved();
}

export async function unsaveBlueprintAction(input: {
  savedId?: string;
  blueprintId?: string;
  communityBlueprintId?: string;
}) {
  const session = await requireUser("/saved");

  if (input.savedId) {
    await prisma.savedBlueprint.deleteMany({
      where: { id: input.savedId, userId: session.user.id },
    });
  } else if (input.blueprintId) {
    await prisma.savedBlueprint.deleteMany({
      where: { blueprintId: input.blueprintId, userId: session.user.id },
    });
  } else if (input.communityBlueprintId) {
    await prisma.savedBlueprint.deleteMany({
      where: {
        communityBlueprintId: input.communityBlueprintId,
        userId: session.user.id,
      },
    });
  }

  revalidateSaved();
}

export async function getSavedBlueprints() {
  const session = await requireUser("/saved");
  const rows = await prisma.savedBlueprint.findMany({
    where: { userId: session.user.id },
    include: { blueprint: true, communityBlueprint: { include: { author: true } } },
    orderBy: { createdAt: "desc" },
  });

  return rows
    .map((row) => {
      const idea = row.blueprint
        ? dbBlueprintToProjectIdea(row.blueprint)
        : row.communityBlueprint
          ? communityBlueprintToProjectIdea(row.communityBlueprint)
          : (row.snapshot as ProjectIdea | null);

      return idea
        ? {
            id: row.id,
            createdAt: row.createdAt,
            blueprintId: row.blueprintId,
            idea,
          }
        : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export async function isBlueprintSaved(blueprintId: string) {
  const session = await requireUser("/saved");
  return Boolean(
    await prisma.savedBlueprint.findFirst({
      where: { userId: session.user.id, blueprintId },
      select: { id: true },
    })
  );
}

export async function redirectToSignIn(callbackUrl: string) {
  redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
}

function revalidateSaved() {
  revalidatePath("/saved");
  revalidatePath("/");
  revalidatePath("/blueprints");
}

function toJson(value: ProjectIdea) {
  return JSON.parse(JSON.stringify(value));
}
