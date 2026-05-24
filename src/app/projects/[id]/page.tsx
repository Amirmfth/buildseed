import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  createCustomTask,
  createNote,
  createResource,
  deleteNote,
  deleteResource,
  deleteTask,
  toggleTaskCompleted,
  updateNote,
  updateProjectLinks,
  updateProjectStatus,
} from "@/app/actions/projects";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  PendingSubmitButton,
  PendingTaskToggle,
  PendingTextButton,
} from "@/components/workspace/ProjectFormControls";
import { SourceBlueprintPanel } from "@/components/workspace/SourceBlueprintPanel";
import { prisma } from "@/lib/prisma";
import { calculateProgress } from "@/lib/projects/progress";
import { cn } from "@/lib/utils";
import { requireUser } from "@/lib/user";

export const dynamic = "force-dynamic";

const projectStatuses = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "PAUSED",
  "COMPLETED",
  "ARCHIVED",
] as const;

const customTaskPhase = "Custom tasks";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireUser("/projects");
  const { id } = await params;
  const project = await prisma.userProject.findFirst({
    where: { id, userId: session.user.id },
    include: {
      tasks: { orderBy: { order: "asc" } },
      notes: { orderBy: { updatedAt: "desc" } },
      resources: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!project) notFound();

  const buildPlanTasks = project.tasks.filter(
    (task) => task.phaseTitle !== customTaskPhase
  );
  const customTasks = project.tasks.filter(
    (task) => task.phaseTitle === customTaskPhase
  );
  const progress = calculateProgress(buildPlanTasks);
  const completedBuildTasks = buildPlanTasks.filter((task) => task.completed).length;
  const groupedBuildPlan = buildPlanTasks.reduce<Record<string, typeof buildPlanTasks>>(
    (groups, task) => {
      const phase = task.phaseTitle ?? "Build Plan";
      groups[phase] = [...(groups[phase] ?? []), task];
      return groups;
    },
    {}
  );

  return (
    <main className="min-h-screen bg-[#09090B] text-zinc-50">
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/projects"
          className="text-sm text-zinc-400 hover:text-zinc-100"
        >
          Back to projects
        </Link>

        <div className="mt-4 rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
                  Project workspace
                </p>
                <span className="rounded-full border border-[#3F3F46] bg-[#09090B] px-2.5 py-1 font-mono text-[10px] uppercase text-zinc-400">
                  {project.selectedScope ?? "standard"}
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                {project.title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                {project.description}
              </p>
            </div>

            <form action={updateProjectStatus} className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <input type="hidden" name="projectId" value={project.id} />
              <Select name="status" defaultValue={project.status}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Project status" />
                </SelectTrigger>
                <SelectContent>
                  {projectStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {formatStatus(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <PendingSubmitButton pendingLabel="Updating...">
                Update
              </PendingSubmitButton>
            </form>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="mb-1 flex justify-between font-mono text-xs text-zinc-500">
                <span>Blueprint progress</span>
                <span>
                  {completedBuildTasks}/{buildPlanTasks.length} tasks / {progress}%
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-[#27272A]">
                <div
                  className="h-2.5 rounded-full bg-green-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Custom tasks do not affect this progress bar.
              </p>
            </div>
            <form
              action={updateProjectLinks}
              className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] lg:grid-cols-1"
            >
              <input type="hidden" name="projectId" value={project.id} />
              <input
                name="repositoryUrl"
                defaultValue={project.repositoryUrl ?? ""}
                placeholder="GitHub repository URL"
                className="h-10 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm outline-none focus:border-green-500/60"
              />
              <input
                name="liveUrl"
                defaultValue={project.liveUrl ?? ""}
                placeholder="Live demo URL"
                className="h-10 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm outline-none focus:border-green-500/60"
              />
              <PendingSubmitButton variant="outline" pendingLabel="Saving...">
                Save links
              </PendingSubmitButton>
            </form>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="grid content-start gap-5">
            <Panel title="Build Plan" compact>
              <div className="grid gap-2">
                {Object.entries(groupedBuildPlan).map(([phase, tasks], index) => (
                  <details
                    key={phase}
                    open={index === 0}
                    className="rounded-xl border border-[#3F3F46]/60 bg-[#09090B]/60"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 [&::-webkit-details-marker]:hidden">
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-cyan-300">
                        {phase}
                      </span>
                      <span className="rounded-full border border-[#3F3F46] px-2 py-0.5 font-mono text-[10px] text-zinc-500">
                        {(tasks ?? []).filter((task) => task.completed).length}/
                        {(tasks ?? []).length}
                      </span>
                    </summary>
                    <div className="grid gap-2 border-t border-[#3F3F46]/50 p-2">
                      {(tasks ?? []).map((task) => (
                        <TaskRow key={task.id} task={task} />
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </Panel>

            <Panel title="Source Blueprint" compact>
              <SourceBlueprintPanel
                snapshot={project.sourceSnapshot}
                selectedScope={project.selectedScope}
              />
            </Panel>
          </aside>

          <section className="rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-4">
            <Tabs defaultValue="notes" className="gap-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold">Workspace</h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Keep project notes, custom work, and useful links in one place.
                  </p>
                </div>
                <TabsList className="border border-[#3F3F46] bg-[#09090B]">
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="notes" className="mt-0">
                <div className="grid gap-4">
                  <div className="grid content-start gap-3">
                    {project.notes.length ? (
                      project.notes.map((note) => (
                        <article
                          key={note.id}
                          className="rounded-xl border border-[#3F3F46]/60 bg-[#09090B]/60 p-3"
                        >
                          <h3 className="font-medium">{note.title}</h3>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                            {note.content}
                          </p>
                          <details className="mt-3 rounded-xl border border-[#3F3F46]/50 bg-[#18181B] p-3">
                            <summary className="cursor-pointer text-xs text-cyan-300">
                              Edit note
                            </summary>
                            <form action={updateNote} className="mt-3 grid gap-2">
                              <input type="hidden" name="noteId" value={note.id} />
                              <input
                                name="title"
                                defaultValue={note.title}
                                className="h-10 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm outline-none"
                              />
                              <textarea
                                name="content"
                                defaultValue={note.content}
                                className="min-h-24 rounded-xl border border-[#3F3F46] bg-[#09090B] p-3 text-sm outline-none"
                              />
                              <PendingSubmitButton
                                className="h-9"
                                pendingLabel="Saving note..."
                              >
                                Save note
                              </PendingSubmitButton>
                            </form>
                          </details>
                          <form action={deleteNote} className="mt-3">
                            <input type="hidden" name="noteId" value={note.id} />
                            <PendingTextButton
                              pendingLabel="Deleting..."
                              className="text-red-300"
                            >
                              Delete note
                            </PendingTextButton>
                          </form>
                        </article>
                      ))
                    ) : (
                      <EmptyState>No notes yet.</EmptyState>
                    )}
                  </div>

                  <form
                    action={createNote}
                    className="grid content-start gap-3 rounded-2xl border border-[#3F3F46]/60 bg-[#09090B]/60 p-4"
                  >
                    <input type="hidden" name="projectId" value={project.id} />
                    <h3 className="font-semibold">New note</h3>
                    <input
                      name="title"
                      placeholder="Note title"
                      className="h-10 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm outline-none focus:border-green-500/60"
                    />
                    <textarea
                      name="content"
                      placeholder="Write a note..."
                      className="min-h-32 rounded-xl border border-[#3F3F46] bg-[#09090B] p-3 text-sm outline-none focus:border-green-500/60"
                    />
                    <PendingSubmitButton pendingLabel="Adding note...">
                      Add note
                    </PendingSubmitButton>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="mt-0">
                <div className="grid gap-4">
                  <div className="grid content-start gap-2">
                    {customTasks.length ? (
                      customTasks.map((task) => (
                        <TaskRow key={task.id} task={task} deletable />
                      ))
                    ) : (
                      <EmptyState>No custom tasks yet.</EmptyState>
                    )}
                  </div>

                  <form
                    action={createCustomTask}
                    className="grid content-start gap-3 rounded-2xl border border-[#3F3F46]/60 bg-[#09090B]/60 p-4"
                  >
                    <input type="hidden" name="projectId" value={project.id} />
                    <h3 className="font-semibold">Add custom task</h3>
                    <input
                      name="title"
                      placeholder="Task title"
                      className="h-10 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm outline-none focus:border-green-500/60"
                    />
                    <textarea
                      name="description"
                      placeholder="Optional description"
                      className="min-h-28 rounded-xl border border-[#3F3F46] bg-[#09090B] p-3 text-sm outline-none focus:border-green-500/60"
                    />
                    <PendingSubmitButton pendingLabel="Adding task...">
                      Add task
                    </PendingSubmitButton>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-0">
                <div className="grid gap-4">
                  <div className="grid content-start gap-2">
                    {project.resources.length ? (
                      project.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="rounded-xl border border-[#3F3F46]/60 bg-[#09090B]/60 p-3"
                        >
                          <a
                            href={resource.url}
                            className="font-medium text-green-300"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {resource.label}
                          </a>
                          {resource.type ? (
                            <p className="mt-1 text-xs text-zinc-500">
                              {resource.type}
                            </p>
                          ) : null}
                          <form action={deleteResource} className="mt-2">
                            <input
                              type="hidden"
                              name="resourceId"
                              value={resource.id}
                            />
                            <PendingTextButton
                              pendingLabel="Deleting..."
                              className="text-red-300"
                            >
                              Delete resource
                            </PendingTextButton>
                          </form>
                        </div>
                      ))
                    ) : (
                      <EmptyState>No resources yet.</EmptyState>
                    )}
                  </div>

                  <form
                    action={createResource}
                    className="grid content-start gap-3 rounded-2xl border border-[#3F3F46]/60 bg-[#09090B]/60 p-4"
                  >
                    <input type="hidden" name="projectId" value={project.id} />
                    <h3 className="font-semibold">Add resource</h3>
                    <input
                      name="label"
                      placeholder="Label"
                      className="h-10 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm outline-none focus:border-green-500/60"
                    />
                    <input
                      name="url"
                      placeholder="https://..."
                      className="h-10 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm outline-none focus:border-green-500/60"
                    />
                    <input
                      name="type"
                      placeholder="Type, e.g. docs"
                      className="h-10 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm outline-none focus:border-green-500/60"
                    />
                    <PendingSubmitButton pendingLabel="Adding resource...">
                      Add resource
                    </PendingSubmitButton>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function TaskRow({
  task,
  deletable = false,
}: {
  task: {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
  };
  deletable?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2.5",
        task.completed
          ? "border-green-500/25 bg-green-500/10 text-zinc-400"
          : "border-[#3F3F46]/60 bg-[#09090B]/60"
      )}
    >
      <div className="flex items-start gap-3">
        <form action={toggleTaskCompleted}>
          <input type="hidden" name="taskId" value={task.id} />
          <input type="hidden" name="completed" value={String(!task.completed)} />
          <PendingTaskToggle completed={task.completed} />
        </form>
        <div className="min-w-0 flex-1">
          <p className={cn("text-sm font-medium", task.completed && "line-through")}>
            {task.title}
          </p>
          {task.description ? (
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              {task.description}
            </p>
          ) : null}
        </div>
        {deletable ? (
          <form action={deleteTask}>
            <input type="hidden" name="taskId" value={task.id} />
            <PendingTextButton pendingLabel="Deleting..." className="text-red-300">
              Delete
            </PendingTextButton>
          </form>
        ) : null}
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
  compact = false,
}: {
  title: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[#3F3F46]/70 bg-[#18181B]",
        compact ? "p-4" : "p-5"
      )}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-[#3F3F46]/60 bg-[#09090B]/60 p-6 text-center text-sm text-zinc-500">
      {children}
    </div>
  );
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
