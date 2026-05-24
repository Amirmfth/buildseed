import type { Prisma } from "@prisma/client";

import { dbBlueprintToProjectIdea, getProjectIdeaRichContent } from "@/lib/blueprints/dbMapper";
import type { ProjectIdea } from "@/lib/types";

export type CommunityBlueprintRow = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  developerFields: Prisma.JsonValue;
  categories: Prisma.JsonValue;
  goals: Prisma.JsonValue;
  stacks: Prisma.JsonValue;
  difficulty: string;
  estimatedTime: string;
  features: Prisma.JsonValue;
  recommendedStack: Prisma.JsonValue;
  portfolioValue: number;
  learningValue: number;
  buildability: number;
  uniqueness: number;
  marketPotential: number;
  richContent: Prisma.JsonValue;
  authorId: string;
  author?: {
    name: string | null;
    email: string | null;
  };
};

export function communityBlueprintToProjectIdea(
  row: CommunityBlueprintRow
): ProjectIdea {
  const idea = dbBlueprintToProjectIdea({
    ...row,
    source: "CURATED",
    featured: false,
    generated: false,
    customized: false,
    baseBlueprintId: null,
  });

  return {
    ...idea,
    source: "community",
    community: true,
    communityBlueprintId: row.id,
    authorId: row.authorId,
    authorName: row.author?.name ?? row.author?.email ?? "Community member",
  };
}

export function projectIdeaToCommunityData(idea: ProjectIdea) {
  return {
    slug: idea.slug,
    title: idea.title,
    shortDescription: idea.shortDescription,
    longDescription: idea.longDescription,
    developerFields: idea.developerFields,
    categories: idea.categories,
    goals: idea.goals,
    stacks: idea.stacks,
    difficulty: idea.difficulty,
    estimatedTime: idea.estimatedTime,
    features: idea.features,
    recommendedStack: idea.recommendedStack,
    portfolioValue: idea.portfolioValue,
    learningValue: idea.learningValue,
    buildability: idea.buildability,
    uniqueness: idea.uniqueness,
    marketPotential: idea.marketPotential,
    richContent: getProjectIdeaRichContent(idea),
  };
}
