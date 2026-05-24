import { prisma } from "@/lib/prisma";
import { dbBlueprintToProjectIdea } from "@/lib/blueprints/dbMapper";
import { projectIdeas } from "@/data/projectIdeas";

export async function getPublishedBlueprints() {
  try {
    const rows = await prisma.blueprint.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    });

    if (rows.length === 0 && process.env.NODE_ENV !== "production") {
      return projectIdeas;
    }

    return rows.map(dbBlueprintToProjectIdea);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Falling back to local blueprints:", error);
      return projectIdeas;
    }

    return [];
  }
}

export async function getPopularBlueprints() {
  const blueprints = await getPublishedBlueprints();
  const featured = blueprints.filter((idea) =>
    [
      "SaaS Analytics Dashboard",
      "Document Q&A Tool",
      "Puzzle Game Level Editor",
      "ETL Pipeline Monitor",
      "Deployment Status Dashboard",
      "Generative Art Playground",
    ].includes(idea.title)
  );

  return featured.length > 0 ? featured : blueprints.slice(0, 6);
}
