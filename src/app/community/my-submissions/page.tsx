import Link from "next/link";

import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { hasCommunityBlueprintModel, prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/user";

export const dynamic = "force-dynamic";

export default async function MyCommunitySubmissionsPage() {
  const session = await requireUser("/community/my-submissions");
  const submissions = hasCommunityBlueprintModel()
    ? await prisma.communityBlueprint.findMany({
        where: { authorId: session.user.id },
        orderBy: { updatedAt: "desc" },
      })
    : [];

  return (
    <main className="min-h-screen bg-[#09090B] text-zinc-50">
      <Navbar />
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
              My Submissions
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Community blueprint submissions.
            </h1>
          </div>
          <Link
            href="/community/submit"
            className="rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-[#09090B]"
          >
            Submit Blueprint
          </Link>
        </div>

        <div className="grid gap-3">
          {submissions.length ? (
            submissions.map((submission) => (
              <article
                key={submission.id}
                className="rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-5"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <span className="rounded-full border border-[#3F3F46] bg-[#09090B] px-2.5 py-1 font-mono text-[10px] uppercase text-zinc-300">
                      {submission.status}
                    </span>
                    <h2 className="mt-3 text-xl font-semibold">
                      {submission.title}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                      {submission.shortDescription}
                    </p>
                    {submission.adminNote ? (
                      <p className="mt-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-100">
                        {submission.adminNote}
                      </p>
                    ) : null}
                  </div>
                  {["NEEDS_CHANGES", "REJECTED"].includes(submission.status) ? (
                    <Link
                      href={`/community/submit?edit=${submission.id}`}
                      className="text-sm text-green-300 hover:text-green-200"
                    >
                      Edit and resubmit
                    </Link>
                  ) : null}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-8 text-center">
              <h2 className="text-xl font-semibold">No submissions yet.</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Submit a blueprint to share it with the BuildSeed community.
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
