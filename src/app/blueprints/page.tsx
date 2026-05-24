import { BlueprintBrowser } from "@/components/blueprints/BlueprintBrowser";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { getPublishedBlueprints } from "@/lib/blueprints/getBlueprints";

export const dynamic = "force-dynamic";

export default async function BlueprintsPage() {
  const blueprints = await getPublishedBlueprints();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />
      <BlueprintBrowser blueprints={blueprints} />
      <Footer />
    </main>
  );
}
