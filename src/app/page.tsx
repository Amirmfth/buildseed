import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { PopularIdeas } from "@/components/landing/PopularIdeas";
import { ProjectMatchSurvey } from "@/components/survey/ProjectMatchSurvey";
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
      <ProjectMatchSurvey blueprints={blueprints} />
      <HowItWorks />
      <PopularIdeas blueprints={popularBlueprints} />
      <Footer />
    </main>
  );
}
