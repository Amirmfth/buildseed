import Link from "next/link";

import {
  approveCommunityBlueprint,
  rejectCommunityBlueprint,
  requestCommunityChanges,
} from "@/app/admin/community/actions";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const rows = await prisma.communityBlueprint.findMany({
    where: {
      ...(params.status ? { status: params.status as never } : {}),
      ...(params.q
        ? {
            OR: [
              { title: { contains: params.q, mode: "insensitive" } },
              { slug: { contains: params.q, mode: "insensitive" } },
              { author: { email: { contains: params.q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grid gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
          Community Reviews
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Moderate submissions</h1>
      </div>

      <form className="grid gap-3 rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-4 md:grid-cols-[1fr_220px_auto]">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Search title, slug, author"
          className="h-11 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm outline-none"
        />
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="h-11 rounded-xl border border-[#3F3F46] bg-[#09090B] px-3 text-sm outline-none"
        >
          <option value="">All statuses</option>
          {["PENDING", "APPROVED", "REJECTED", "NEEDS_CHANGES"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button className="h-11 rounded-xl bg-green-500 px-4 text-sm font-semibold text-[#09090B]">
          Filter
        </button>
      </form>

      <div className="grid gap-3">
        {rows.map((row) => (
          <article
            key={row.id}
            className="rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-5"
          >
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
              <div>
                <span className="rounded-full border border-[#3F3F46] bg-[#09090B] px-2.5 py-1 font-mono text-[10px] uppercase text-zinc-300">
                  {row.status}
                </span>
                <h2 className="mt-3 text-xl font-semibold">{row.title}</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {row.author.name ?? row.author.email ?? "Unknown author"} ·{" "}
                  {row.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/community/${row.id}`}
                  className="rounded-xl border border-[#3F3F46] px-3 py-2 text-sm text-zinc-100 hover:bg-[#27272A]"
                >
                  Review
                </Link>
                <form action={approveCommunityBlueprint}>
                  <input type="hidden" name="id" value={row.id} />
                  <button className="rounded-xl bg-green-500 px-3 py-2 text-sm font-semibold text-[#09090B]">
                    Approve
                  </button>
                </form>
                <form action={requestCommunityChanges}>
                  <input type="hidden" name="id" value={row.id} />
                  <button className="rounded-xl border border-yellow-500/40 px-3 py-2 text-sm text-yellow-200">
                    Needs changes
                  </button>
                </form>
                <form action={rejectCommunityBlueprint}>
                  <input type="hidden" name="id" value={row.id} />
                  <button className="rounded-xl border border-red-500/40 px-3 py-2 text-sm text-red-200">
                    Reject
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
