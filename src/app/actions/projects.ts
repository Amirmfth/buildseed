"use server";

import { UserProjectStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { dbBlueprintToProjectIdea } from "@/lib/blueprints/dbMapper";
import { communityBlueprintToProjectIdea } from "@/lib/blueprints/communityMapper";
import {
  buildProjectCreateData,
  buildProjectTasks,
} from "@/lib/projects/createProjectFromBlueprint";
import { prisma } from "@/lib/prisma";
import type { ProjectIdea } from "@/lib/types";
import { requireUser } from "@/lib/user";

export async function createProjectFromBlueprintAction(input: {
  blueprintId?: string | null;
  communityBlueprintId?: string | null;
  blueprint?: ProjectIdea;
  selectedScope: string;
  callbackUrl?: string;
}) {
  const session = await requireUser(input.callbackUrl ?? "/projects");
  let blueprint = input.blueprint;
  let blueprintId = input.blueprintId ?? null;
  let communityBlueprintId = input.communityBlueprintId ?? null;

  if (!blueprint && input.communityBlueprintId) {
    const row = await prisma.communityBlueprint.findFirst({
      where: { id: input.communityBlueprintId, status: "APPROVED" },
      include: { author: true },
    });
    if (!row) throw new Error("Community blueprint not found.");
    blueprint = communityBlueprintToProjectIdea(row);
  } else if (!blueprint && input.blueprintId) {
    const row = await prisma.blueprint.findUnique({
      where: { id: input.blueprintId },
    });
    if (!row) throw new Error("Blueprint not found.");
    blueprint = dbBlueprintToProjectIdea(row);
  } else if (blueprint && input.blueprintId) {
    const row = await prisma.blueprint.findUnique({
      where: { id: input.blueprintId },
      select: { id: true },
    });
    if (!row) blueprintId = null;
  }

  if (blueprint && input.communityBlueprintId) {
    const row = await prisma.communityBlueprint.findFirst({
      where: { id: input.communityBlueprintId, status: "APPROVED" },
      select: { id: true },
    });
    if (!row) communityBlueprintId = null;
  }

  if (!blueprint) throw new Error("Missing blueprint.");

  const project = await prisma.userProject.create({
    data: buildProjectCreateData({
      userId: session.user.id,
      blueprint,
      selectedScope: input.selectedScope,
      blueprintId,
      communityBlueprintId,
    }),
  });
  const tasks = buildProjectTasks(blueprint, input.selectedScope);

  for (const task of tasks) {
    await prisma.projectTask.create({
      data: {
        ...task,
        projectId: project.id,
      },
    });
  }

  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function updateProjectStatus(formData: FormData) {
  const { userId, projectId } = await requireProjectOwner(formData);
  const status = String(formData.get("status") ?? "NOT_STARTED");
  if (!isUserProjectStatus(status)) throw new Error("Invalid project status.");

  await prisma.userProject.update({
    where: { id: projectId, userId },
    data: { status },
  });
  revalidateProject(projectId);
}

export async function updateProjectLinks(formData: FormData) {
  const { userId, projectId } = await requireProjectOwner(formData);

  await prisma.userProject.update({
    where: { id: projectId, userId },
    data: {
      repositoryUrl: optionalString(formData.get("repositoryUrl")),
      liveUrl: optionalString(formData.get("liveUrl")),
    },
  });
  revalidateProject(projectId);
}

export async function toggleTaskCompleted(formData: FormData) {
  const session = await requireUser();
  const taskId = String(formData.get("taskId") ?? "");
  const completed = String(formData.get("completed") ?? "") === "true";
  if (!taskId) throw new Error("Missing task.");

  const task = await prisma.projectTask.findFirst({
    where: { id: taskId, project: { userId: session.user.id } },
  });
  if (!task) throw new Error("Task not found.");

  await prisma.projectTask.update({
    where: { id: task.id },
    data: {
      completed,
      completedAt: completed ? new Date() : null,
    },
  });
  revalidateProject(task.projectId);
}

export async function createCustomTask(formData: FormData) {
  const { projectId } = await requireProjectOwner(formData);
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const lastTask = await prisma.projectTask.findFirst({
    where: { projectId },
    orderBy: { order: "desc" },
  });

  await prisma.projectTask.create({
    data: {
      projectId,
      title,
      description: optionalString(formData.get("description")),
      phaseTitle: optionalString(formData.get("phaseTitle")) ?? "Custom tasks",
      order: (lastTask?.order ?? 0) + 1,
    },
  });
  revalidateProject(projectId);
}

export async function updateTask(formData: FormData) {
  const session = await requireUser();
  const taskId = String(formData.get("taskId") ?? "");
  if (!taskId) throw new Error("Missing task.");

  const task = await prisma.projectTask.findFirst({
    where: { id: taskId, project: { userId: session.user.id } },
  });
  if (!task) throw new Error("Task not found.");

  await prisma.projectTask.update({
    where: { id: task.id },
    data: {
      title: String(formData.get("title") ?? task.title),
      description: optionalString(formData.get("description")),
    },
  });
  revalidateProject(task.projectId);
}

export async function deleteTask(formData: FormData) {
  const session = await requireUser();
  const taskId = String(formData.get("taskId") ?? "");
  const task = await prisma.projectTask.findFirst({
    where: { id: taskId, project: { userId: session.user.id } },
  });
  if (!task) return;
  await prisma.projectTask.delete({ where: { id: task.id } });
  revalidateProject(task.projectId);
}

export async function createNote(formData: FormData) {
  const { projectId } = await requireProjectOwner(formData);
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!title || !content) return;

  await prisma.projectNote.create({ data: { projectId, title, content } });
  revalidateProject(projectId);
}

export async function updateNote(formData: FormData) {
  const session = await requireUser();
  const noteId = String(formData.get("noteId") ?? "");
  const note = await prisma.projectNote.findFirst({
    where: { id: noteId, project: { userId: session.user.id } },
  });
  if (!note) throw new Error("Note not found.");

  await prisma.projectNote.update({
    where: { id: note.id },
    data: {
      title: String(formData.get("title") ?? note.title),
      content: String(formData.get("content") ?? note.content),
    },
  });
  revalidateProject(note.projectId);
}

export async function deleteNote(formData: FormData) {
  const session = await requireUser();
  const noteId = String(formData.get("noteId") ?? "");
  const note = await prisma.projectNote.findFirst({
    where: { id: noteId, project: { userId: session.user.id } },
  });
  if (!note) return;
  await prisma.projectNote.delete({ where: { id: note.id } });
  revalidateProject(note.projectId);
}

export async function createResource(formData: FormData) {
  const { projectId } = await requireProjectOwner(formData);
  const label = String(formData.get("label") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  if (!label || !url) return;

  await prisma.projectResource.create({
    data: {
      projectId,
      label,
      url,
      type: optionalString(formData.get("type")),
    },
  });
  revalidateProject(projectId);
}

export async function deleteResource(formData: FormData) {
  const session = await requireUser();
  const resourceId = String(formData.get("resourceId") ?? "");
  const resource = await prisma.projectResource.findFirst({
    where: { id: resourceId, project: { userId: session.user.id } },
  });
  if (!resource) return;
  await prisma.projectResource.delete({ where: { id: resource.id } });
  revalidateProject(resource.projectId);
}

export async function archiveProject(formData: FormData) {
  const { userId, projectId } = await requireProjectOwner(formData);
  await prisma.userProject.update({
    where: { id: projectId, userId },
    data: { status: "ARCHIVED" },
  });
  revalidatePath("/projects");
}

export async function deleteProject(formData: FormData) {
  const { userId, projectId } = await requireProjectOwner(formData);
  await prisma.userProject.delete({
    where: { id: projectId, userId },
  });
  revalidatePath("/projects");
  redirect("/projects");
}

async function requireProjectOwner(formData: FormData) {
  const session = await requireUser();
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) throw new Error("Missing project.");

  const project = await prisma.userProject.findFirst({
    where: { id: projectId, userId: session.user.id },
    select: { id: true },
  });
  if (!project) throw new Error("Project not found.");

  return { userId: session.user.id, projectId };
}

function optionalString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

function revalidateProject(projectId: string) {
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
}

function isUserProjectStatus(value: string): value is UserProjectStatus {
  return Object.values(UserProjectStatus).includes(value as UserProjectStatus);
}
