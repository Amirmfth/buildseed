import { config } from "dotenv";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

import { projectIdeas } from "../src/data/projectIdeas";
import { projectIdeaToDbBlueprint } from "../src/lib/blueprints/dbMapper";

config({ path: ".env.local" });
config();

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL ?? "", {});
const prisma = new PrismaClient({ adapter });

async function main() {
  let count = 0;

  for (const idea of projectIdeas) {
    const data = projectIdeaToDbBlueprint(idea);

    await prisma.blueprint.upsert({
      where: { slug: data.slug },
      create: {
        ...data,
        source: "CURATED",
        status: "PUBLISHED",
        featured: [
          "saas-analytics-dashboard",
          "document-q-a-tool",
          "puzzle-game-level-editor",
          "etl-pipeline-monitor",
          "deployment-status-dashboard",
          "generative-art-playground",
        ].includes(data.slug),
      },
      update: {
        ...data,
        source: "CURATED",
        status: "PUBLISHED",
      },
    });

    count += 1;
  }

  console.log(`Seeded or updated ${count} BuildSeed blueprints.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
