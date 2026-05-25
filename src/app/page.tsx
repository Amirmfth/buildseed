import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { PopularIdeas } from "@/components/landing/PopularIdeas";
import { ProjectMatchSurvey } from "@/components/survey/ProjectMatchSurvey";
import Link from "next/link";
import { getPopularBlueprints, getPublishedBlueprints } from "@/lib/blueprints/getBlueprints";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [blueprints, popularBlueprints] = await Promise.all([
    getPublishedBlueprints(),
    getPopularBlueprints(),
  ]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />
      <Hero />
      <section className="px-4 py-8 md:hidden">
        <div className="mx-auto max-w-7xl rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
            Project Match
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Find your own project.
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Open the guided survey in a mobile-first workspace.
          </p>
          <Link
            href="/project-match"
            className="mt-4 inline-flex h-11 items-center rounded-xl bg-green-500 px-4 text-sm font-semibold text-[#09090B]"
          >
            Find your own project
          </Link>
        </div>
      </section>
      <div className="hidden md:block">
        <ProjectMatchSurvey blueprints={blueprints} />
      </div>
      <HowItWorks />
      <PopularIdeas blueprints={popularBlueprints} />
      <Footer />
    </main>
  );
}
