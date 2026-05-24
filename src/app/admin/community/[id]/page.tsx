import {
  approveCommunityBlueprint,
  deleteCommunityBlueprint,
  promoteCommunityBlueprint,
  rejectCommunityBlueprint,
  requestCommunityChanges,
} from "@/app/admin/community/actions";
import { communityBlueprintToProjectIdea } from "@/lib/blueprints/communityMapper";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { validateBlueprints } from "@/lib/validateBlueprints";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminCommunityReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const row = await prisma.communityBlueprint.findUnique({
    where: { id },
    include: { author: true },
  });
  if (!row) notFound();

  const idea = communityBlueprintToProjectIdea(row);
  const validation = validateBlueprints([idea]);

  return (
    <div className="grid gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
          Review Community Blueprint
        </p>
        <h1 className="mt-3 text-3xl font-semibold">{row.title}</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Submitted by {row.author.name ?? row.author.email ?? "Unknown author"}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-5">
          <h2 className="text-xl font-semibold">Validation</h2>
          {validation.valid ? (
            <p className="mt-3 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-200">
              Blueprint is valid.
            </p>
          ) : (
            <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {validation.errors.join("\n")}
            </pre>
          )}
          <div className="mt-5 rounded-xl border border-[#3F3F46]/60 bg-[#09090B]/60 p-4">
            <h2 className="text-lg font-semibold">{idea.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {idea.longDescription}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {idea.recommendedStack.slice(0, 8).map((stack) => (
                <span key={stack} className="rounded-full border border-[#3F3F46] px-2.5 py-1 font-mono text-[11px] text-zinc-300">
                  {stack}
                </span>
              ))}
            </div>
          </div>
          <pre className="mt-4 max-h-[520px] overflow-auto rounded-xl border border-[#3F3F46] bg-[#09090B] p-4 text-xs text-zinc-300">
            {JSON.stringify(row.richContent, null, 2)}
          </pre>
        </section>

        <aside className="grid content-start gap-3 rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-5">
          <h2 className="text-xl font-semibold">Moderation</h2>
          <NoteAction action={approveCommunityBlueprint} id={row.id} label="Approve" />
          <NoteAction action={requestCommunityChanges} id={row.id} label="Needs changes" />
          <NoteAction action={rejectCommunityBlueprint} id={row.id} label="Reject" />
          <form action={promoteCommunityBlueprint} className="grid gap-3 rounded-xl border border-[#3F3F46]/60 bg-[#09090B]/60 p-3">
            <input type="hidden" name="id" value={row.id} />
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" name="publish" />
              Publish immediately
            </label>
            <button className="rounded-xl bg-green-500 px-3 py-2 text-sm font-semibold text-[#09090B]">
              Promote to official
            </button>
          </form>
          <form action={deleteCommunityBlueprint}>
            <input type="hidden" name="id" value={row.id} />
            <button className="w-full rounded-xl border border-red-500/40 px-3 py-2 text-sm text-red-200">
              Delete submission
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

function NoteAction({
  action,
  id,
  label,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label: string;
}) {
  return (
    <form action={action} className="grid gap-2 rounded-xl border border-[#3F3F46]/60 bg-[#09090B]/60 p-3">
      <input type="hidden" name="id" value={id} />
      <textarea
        name="adminNote"
        placeholder="Optional admin note"
        className="min-h-20 rounded-xl border border-[#3F3F46] bg-[#09090B] p-3 text-sm outline-none"
      />
      <button className="rounded-xl border border-[#3F3F46] px-3 py-2 text-sm text-zinc-100">
        {label}
      </button>
    </form>
  );
}
