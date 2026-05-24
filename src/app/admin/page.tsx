import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [total, published, draft, archived, featured, recent] =
    await Promise.all([
      prisma.blueprint.count(),
      prisma.blueprint.count({ where: { status: "PUBLISHED" } }),
      prisma.blueprint.count({ where: { status: "DRAFT" } }),
      prisma.blueprint.count({ where: { status: "ARCHIVED" } }),
      prisma.blueprint.count({ where: { featured: true } }),
      prisma.blueprint.findMany({
        orderBy: { updatedAt: "desc" },
        take: 6,
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
        },
      }),
    ]);

  return (
    <div>
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
          Dashboard
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Blueprint operations
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Stat label="Total" value={total} />
        <Stat label="Published" value={published} />
        <Stat label="Draft" value={draft} />
        <Stat label="Archived" value={archived} />
        <Stat label="Featured" value={featured} />
      </div>
      <section className="mt-6 rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Recently updated</h3>
          <Link
            href="/admin/blueprints"
            className="text-sm font-medium text-green-300 hover:text-green-200"
          >
            Manage all
          </Link>
        </div>
        <div className="mt-4 grid gap-2">
          {recent.map((blueprint) => (
            <Link
              key={blueprint.id}
              href={`/admin/blueprints/${blueprint.id}/edit`}
              className="flex flex-col justify-between gap-2 rounded-xl border border-[#3F3F46]/50 bg-[#09090B]/55 px-3 py-3 text-sm sm:flex-row sm:items-center"
            >
              <span className="font-medium text-zinc-100">{blueprint.title}</span>
              <span className="font-mono text-xs text-zinc-500">
                {blueprint.status} - {blueprint.updatedAt.toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-5">
      <p className="font-mono text-xs uppercase text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-green-300">{value}</p>
    </div>
  );
}
