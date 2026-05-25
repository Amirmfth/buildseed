"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookText, ClipboardCheck, FileText, LayoutGrid } from "lucide-react";
import type { ReactNode } from "react";

import {
  createCustomTask,
  createNote,
  createResource,
  deleteNote,
  deleteResource,
  deleteTask,
  toggleTaskCompleted,
  updateNote,
} from "@/app/actions/projects";
import {
  PendingSubmitButton,
  PendingTaskToggle,
  PendingTextButton,
} from "@/components/workspace/ProjectFormControls";
import { SourceBlueprintPanel } from "@/components/workspace/SourceBlueprintPanel";
import { cn } from "@/lib/utils";

type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  phaseTitle: string | null;
};

type Note = {
  id: string;
  title: string;
  content: string;
};

type Resource = {
  id: string;
  label: string;
  url: string;
  type: string | null;
};

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "tasks", label: "Tasks", icon: ClipboardCheck },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "resources", label: "Resources", icon: BookText },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function MobileProjectWorkspace({
  projectId,
  title,
  description,
  buildPlanTasks,
  customTasks,
  notes,
  resources,
  sourceSnapshot,
  selectedScope,
  progress,
  completedBuildTasks,
  totalBuildTasks,
}: {
  projectId: string;
  title: string;
  description: string;
  buildPlanTasks: Task[];
  customTasks: Task[];
  notes: Note[];
  resources: Resource[];
  sourceSnapshot: unknown;
  selectedScope: string | null;
  progress: number;
  completedBuildTasks: number;
  totalBuildTasks: number;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const groupedBuildPlan = useMemo(
    () =>
      buildPlanTasks.reduce<Record<string, Task[]>>((groups, task) => {
        const phase = task.phaseTitle ?? "Build Plan";
        groups[phase] = [...(groups[phase] ?? []), task];
        return groups;
      }, {}),
    [buildPlanTasks]
  );

  return (
    <section className="md:hidden">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
      >
        {activeTab === "overview" ? (
          <div className="grid gap-4">
            <Panel title="Project workspace">
              <p className="text-base font-semibold text-zinc-100">{title}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#3F3F46] bg-[#09090B] px-2.5 py-1 font-mono text-[10px] uppercase text-zinc-400">
                  {selectedScope ?? "standard"}
                </span>
                <span className="rounded-full border border-green-500/35 bg-green-500/10 px-2.5 py-1 font-mono text-[10px] uppercase text-green-200">
                  {completedBuildTasks}/{totalBuildTasks} tasks
                </span>
                <span className="rounded-full border border-cyan-500/35 bg-cyan-500/10 px-2.5 py-1 font-mono text-[10px] uppercase text-cyan-200">
                  {progress}%
                </span>
              </div>
            </Panel>

            <Panel title="Build Plan">
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

            <Panel title="Source Blueprint">
              <SourceBlueprintPanel
                snapshot={sourceSnapshot}
                selectedScope={selectedScope}
              />
            </Panel>
          </div>
        ) : null}

        {activeTab === "tasks" ? (
          <Panel title="Tasks">
            <div className="grid gap-4">
              <div className="grid content-start gap-2">
                {customTasks.length ? (
                  customTasks.map((task) => (
                    <TaskRow key={task.id} task={task} deletable />
                  ))
                ) : (
                  <EmptyState>No tasks yet.</EmptyState>
                )}
              </div>

              <form
                action={createCustomTask}
                className="grid content-start gap-3"
              >
                <input type="hidden" name="projectId" value={projectId} />
                <h3 className="font-semibold">New task</h3>
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
          </Panel>
        ) : null}

        {activeTab === "notes" ? (
          <Panel title="Notes">
            <div className="grid gap-4">
              <div className="grid content-start gap-3">
                {notes.length ? (
                  notes.map((note) => (
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
                className="grid content-start gap-3"
              >
                <input type="hidden" name="projectId" value={projectId} />
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
          </Panel>
        ) : null}

        {activeTab === "resources" ? (
          <Panel title="Resources">
            <div className="grid gap-4">
              <div className="grid content-start gap-2">
                {resources.length ? (
                  resources.map((resource) => (
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
                        <p className="mt-1 text-xs text-zinc-500">{resource.type}</p>
                      ) : null}
                      <form action={deleteResource} className="mt-2">
                        <input type="hidden" name="resourceId" value={resource.id} />
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
                className="grid content-start gap-3"
              >
                <input type="hidden" name="projectId" value={projectId} />
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
          </Panel>
        ) : null}
      </motion.div>

      <nav className="fixed inset-x-0 bottom-4 z-40 mx-auto w-[18.25rem]">
        <div className="flex w-full items-center justify-between gap-1 rounded-full border border-[#3F3F46] bg-[#18181B]/95 p-1 shadow-2xl backdrop-blur">
          {tabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "rounded-full px-2 py-1.5 text-zinc-300 transition",
                  isActive ? "text-[#09090B]" : "hover:bg-[#27272A]"
                )}
              >
                <motion.span
                  layout
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2 py-2",
                    isActive ? "bg-green-500" : "bg-transparent"
                  )}
                >
                  <Icon className="size-4" />
                  {isActive ? (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      className="overflow-hidden text-xs font-medium"
                    >
                      {item.label}
                    </motion.span>
                  ) : null}
                </motion.span>
              </button>
            );
          })}
        </div>
      </nav>
    </section>
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
            <p className="mt-1 text-xs leading-5 text-zinc-500">{task.description}</p>
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

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-4">
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
