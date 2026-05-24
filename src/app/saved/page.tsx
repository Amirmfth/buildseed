import { getSavedBlueprints } from "@/app/actions/savedBlueprints";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { SavedBlueprintsClient } from "@/components/workspace/SavedBlueprintsClient";

export const dynamic = "force-dynamic";

export default async function SavedBlueprintsPage() {
  const saved = await getSavedBlueprints();
  const serializedSaved = saved.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-[#09090B] text-zinc-50">
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
            Saved Blueprints
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Your blueprint library.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Save curated or AI-generated ideas, then start project tracking when you are ready to build.
          </p>
        </div>

        <SavedBlueprintsClient saved={serializedSaved} />
      </section>
      <Footer />
    </main>
  );
}
