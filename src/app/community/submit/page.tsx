import {
  resubmitCommunityBlueprint,
  submitCommunityBlueprint,
} from "@/app/community/actions";
import { BlueprintEditor } from "@/components/admin/BlueprintEditor";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { communityBlueprintToProjectIdea } from "@/lib/blueprints/communityMapper";
import { enrichBlueprint } from "@/lib/blueprints/enrichBlueprint";
import { hasCommunityBlueprintModel, prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/user";
import { projectIdeas } from "@/data/projectIdeas";

export const dynamic = "force-dynamic";

export default async function SubmitCommunityBlueprintPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await requireUser("/community/submit");
  const params = await searchParams;
  const submission = params.edit && hasCommunityBlueprintModel()
    ? await prisma.communityBlueprint.findFirst({
        where: {
          id: params.edit,
          authorId: session.user.id,
          status: { in: ["NEEDS_CHANGES", "REJECTED"] },
        },
        include: { author: true },
      })
    : null;
  const initialBlueprint = submission
    ? communityBlueprintToProjectIdea(submission)
    : enrichBlueprint({
        ...projectIdeas[0],
        id: "",
        slug: "community-blueprint",
        title: "Community Blueprint Idea",
        shortDescription:
          "A practical blueprint proposal for the BuildSeed community.",
        longDescription:
          "Describe who this project helps, what should be built, and why it is a useful blueprint for other developers.",
      });

  return (
    <main className="min-h-screen bg-[#09090B] text-zinc-50">
      <Navbar />
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
            Submit Blueprint
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Share a project plan with the community.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Community submissions are reviewed before publishing.
          </p>
        </div>
        <BlueprintEditor
          action={submission ? resubmitCommunityBlueprint : submitCommunityBlueprint}
          initialBlueprint={initialBlueprint}
          mode="community"
          submitLabel={submission ? "Resubmit for review" : "Submit for review"}
        />
      </section>
      <Footer />
    </main>
  );
}
