import Link from "next/link";
import type { Prisma } from "@prisma/client";

import {
  deleteBlueprint,
  duplicateBlueprint,
  toggleFeatured,
  updateBlueprintStatus,
} from "@/app/admin/blueprints/actions";
import { ConfirmActionForm } from "@/components/admin/ConfirmActionForm";
import { Button } from "@/components/ui/button";
import { developerFields } from "@/data/techStacks";
import { prisma } from "@/lib/prisma";
import { buttonClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";

export default async function AdminBlueprintsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    field?: string;
    difficulty?: string;
    source?: string;
  }>;
}) {
  const params = await searchParams;
  const where: Prisma.BlueprintWhereInput = {};

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { slug: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.status) where.status = params.status as never;
  if (params.source) where.source = params.source as never;
  if (params.difficulty) where.difficulty = params.difficulty;

  const rows = await prisma.blueprint.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });

  const fieldFilter = params.field;
  const blueprints = fieldFilter
    ? rows.filter((row) =>
        Array.isArray(row.developerFields)
          ? row.developerFields.some((field) => field === fieldFilter)
          : false
      )
    : rows;

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
            Blueprints
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Manage project blueprints
          </h2>
        </div>
        <Button asChild className={cn("h-11", buttonClasses.primary)}>
          <Link href="/admin/blueprints/new">New Blueprint</Link>
        </Button>
      </div>

      <form className="mb-5 grid gap-3 rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-4 md:grid-cols-5">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Search title or slug"
          className="h-11 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm outline-none"
        />
        <Select name="status" value={params.status} options={["", "DRAFT", "PUBLISHED", "ARCHIVED"]} />
        <Select name="source" value={params.source} options={["", "CURATED", "AI", "CUSTOMIZED"]} />
        <Select
          name="field"
          value={params.field}
          options={["", ...developerFields.map((field) => field.id)]}
        />
        <Button type="submit" className={cn("h-11", buttonClasses.primary)}>
          Filter
        </Button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-[#3F3F46]/70 bg-[#18181B]">
        <div className="scrollbar-hidden overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-[#3F3F46]/70 bg-[#09090B]/70 font-mono text-xs uppercase text-zinc-500">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Fields</th>
                <th className="p-3">Difficulty</th>
                <th className="p-3">Status</th>
                <th className="p-3">Featured</th>
                <th className="p-3">Source</th>
                <th className="p-3">Updated</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blueprints.map((blueprint) => (
                <tr key={blueprint.id} className="border-b border-[#3F3F46]/40">
                  <td className="p-3">
                    <div className="font-medium text-zinc-100">{blueprint.title}</div>
                    <div className="font-mono text-xs text-zinc-500">{blueprint.slug}</div>
                  </td>
                  <td className="p-3 text-zinc-400">
                    {Array.isArray(blueprint.developerFields)
                      ? blueprint.developerFields.slice(0, 3).join(", ")
                      : ""}
                  </td>
                  <td className="p-3 text-zinc-300">{blueprint.difficulty}</td>
                  <td className="p-3">{blueprint.status}</td>
                  <td className="p-3">{blueprint.featured ? "Yes" : "No"}</td>
                  <td className="p-3">{blueprint.source}</td>
                  <td className="p-3 font-mono text-xs text-zinc-500">
                    {blueprint.updatedAt.toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <SmallLink href={`/admin/blueprints/${blueprint.id}/edit`}>
                        Edit
                      </SmallLink>
                      <SmallLink href={`/blueprints`}>Preview</SmallLink>
                      <InlineAction action={duplicateBlueprint} id={blueprint.id} label="Duplicate" />
                      <InlineAction
                        action={toggleFeatured}
                        id={blueprint.id}
                        label={blueprint.featured ? "Unfeature" : "Feature"}
                        extra={{ featured: String(blueprint.featured) }}
                      />
                      <InlineAction
                        action={updateBlueprintStatus}
                        id={blueprint.id}
                        label={blueprint.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                        extra={{
                          status:
                            blueprint.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
                        }}
                      />
                      <InlineAction
                        action={updateBlueprintStatus}
                        id={blueprint.id}
                        label="Archive"
                        extra={{ status: "ARCHIVED" }}
                      />
                      <ConfirmActionForm
                        action={deleteBlueprint}
                        id={blueprint.id}
                        label="Delete"
                        message={`Permanently delete "${blueprint.title}"? Archive is safer if you only want to hide it.`}
                        destructive
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Select({
  name,
  value,
  options,
}: {
  name: string;
  value?: string;
  options: string[];
}) {
  return (
    <select
      name={name}
      defaultValue={value ?? ""}
      className="h-11 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm outline-none"
    >
      {options.map((option) => (
        <option key={option || "all"} value={option}>
          {option || `All ${name}`}
        </option>
      ))}
    </select>
  );
}

function SmallLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-[#3F3F46] bg-[#09090B] px-2 py-1 text-xs text-zinc-300 hover:text-zinc-50"
    >
      {children}
    </Link>
  );
}

function InlineAction({
  action,
  id,
  label,
  extra,
  destructive,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label: string;
  extra?: Record<string, string>;
  destructive?: boolean;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {Object.entries(extra ?? {}).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <button
        type="submit"
        className={cn(
          "rounded-lg border px-2 py-1 text-xs",
          destructive
            ? "border-red-500/40 bg-red-500/10 text-red-200"
            : "border-[#3F3F46] bg-[#09090B] text-zinc-300 hover:text-zinc-50"
        )}
      >
        {label}
      </button>
    </form>
  );
}
