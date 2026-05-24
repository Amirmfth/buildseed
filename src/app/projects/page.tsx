import Link from "next/link";
import { UserProjectStatus } from "@prisma/client";

import { archiveProject } from "@/app/actions/projects";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { calculateProgress } from "@/lib/projects/progress";
import { buttonClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";
import { requireUser } from "@/lib/user";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; sort?: string }>;
}) {
  const session = await requireUser("/projects");
  const params = await searchParams;
  const status =
    params.status && isUserProjectStatus(params.status) ? params.status : undefined;
  const projects = await prisma.userProject.findMany({
    where: {
      userId: session.user.id,
      ...(status ? { status } : {}),
      ...(params.q
        ? {
            OR: [
              { title: { contains: params.q, mode: "insensitive" } },
              { description: { contains: params.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { tasks: true },
    orderBy:
      params.sort === "title"
        ? { title: "asc" }
        : params.sort === "progress"
          ? { updatedAt: "desc" }
          : { updatedAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#09090B] text-zinc-50">
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
              My Projects
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Track what you are building.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Turn saved blueprints into real projects with task progress, notes, and links.
            </p>
          </div>
          <Button asChild className={cn("h-11", buttonClasses.primary)}>
            <Link href="/blueprints">Start from a blueprint</Link>
          </Button>
        </div>

        <form className="mb-5 grid gap-3 rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-4 md:grid-cols-4">
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search projects"
            className="h-11 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm outline-none"
          />
          <select
            name="status"
            defaultValue={params.status ?? ""}
            className="h-11 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm outline-none"
          >
            <option value="">All statuses</option>
            {["NOT_STARTED", "IN_PROGRESS", "PAUSED", "COMPLETED", "ARCHIVED"].map(
              (status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              )
            )}
          </select>
          <select
            name="sort"
            defaultValue={params.sort ?? "updatedAt"}
            className="h-11 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm outline-none"
          >
            <option value="updatedAt">Updated</option>
            <option value="title">Title</option>
            <option value="progress">Progress</option>
          </select>
          <Button type="submit" className={cn("h-11", buttonClasses.primary)}>
            Filter
          </Button>
        </form>

        {projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const progress = calculateProgress(project.tasks);
              const completed = project.tasks.filter((task) => task.completed).length;

              return (
                <article
                  key={project.id}
                  className="rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 font-mono text-[10px] uppercase text-green-300">
                        {project.status}
                      </span>
                      <h2 className="mt-3 text-xl font-semibold">{project.title}</h2>
                    </div>
                    <span className="font-mono text-xs text-zinc-500">
                      {project.selectedScope ?? "standard"}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">
                    {project.description}
                  </p>
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between font-mono text-xs text-zinc-500">
                      <span>{completed}/{project.tasks.length} tasks</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#27272A]">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {jsonStringArray(project.stack).slice(0, 4).map((stack) => (
                      <span
                        key={stack}
                        className="rounded-full border border-[#3F3F46] bg-[#09090B] px-2.5 py-1 font-mono text-[11px] text-zinc-300"
                      >
                        {stack}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    <Button asChild className={cn("h-10", buttonClasses.primary)}>
                      <Link href={`/projects/${project.id}`}>Open</Link>
                    </Button>
                    <form action={archiveProject}>
                      <input type="hidden" name="projectId" value={project.id} />
                      <Button
                        type="submit"
                        variant="outline"
                        className={cn("h-10 w-full", buttonClasses.outline)}
                      >
                        Archive
                      </Button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-8 text-center">
            <h2 className="text-xl font-semibold">No projects yet.</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Start from a blueprint to create your first tracked project.
            </p>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}

function jsonStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function isUserProjectStatus(value: string): value is UserProjectStatus {
  return Object.values(UserProjectStatus).includes(value as UserProjectStatus);
}
