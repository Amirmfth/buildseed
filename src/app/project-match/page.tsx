import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { ProjectMatchSurvey } from "@/components/survey/ProjectMatchSurvey";
import { getPublishedBlueprints } from "@/lib/blueprints/getBlueprints";

export const dynamic = "force-dynamic";

export default async function ProjectMatchPage() {
  const blueprints = await getPublishedBlueprints();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />
      <ProjectMatchSurvey blueprints={blueprints} mobileStandalone />
      <Footer />
    </main>
  );
}
