import Link from "next/link";

import { CommunityBlueprintsClient } from "@/components/community/CommunityBlueprintsClient";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { communityBlueprintToProjectIdea } from "@/lib/blueprints/communityMapper";
import { hasCommunityBlueprintModel, prisma } from "@/lib/prisma";
import { buttonClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const rows = hasCommunityBlueprintModel()
    ? await prisma.communityBlueprint.findMany({
        where: { status: "APPROVED" },
        include: { author: true },
        orderBy: { updatedAt: "desc" },
      })
    : [];
  const blueprints = rows.map(communityBlueprintToProjectIdea);

  return (
    <main className="min-h-screen bg-[#09090B] text-zinc-50">
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
              Community Blueprints
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Developer-submitted project plans.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Explore project plans submitted by developers and approved by BuildSeed.
            </p>
          </div>
          <Button asChild className={cn("h-11", buttonClasses.primary)}>
            <Link href="/community/submit">Submit Blueprint</Link>
          </Button>
        </div>
        <CommunityBlueprintsClient blueprints={blueprints} />
      </section>
      <Footer />
    </main>
  );
}
