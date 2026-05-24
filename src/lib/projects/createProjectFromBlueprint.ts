import type { Prisma } from "@prisma/client";

import type { ProjectIdea } from "@/lib/types";

export function buildProjectCreateData(input: {
  userId: string;
  blueprint: ProjectIdea;
  selectedScope: string;
  blueprintId?: string | null;
  communityBlueprintId?: string | null;
}) {
  return {
    userId: input.userId,
    blueprintId: input.blueprintId ?? null,
    communityBlueprintId: input.communityBlueprintId ?? null,
    title: input.blueprint.title,
    description: input.blueprint.shortDescription,
    stack: input.blueprint.recommendedStack,
    selectedScope: input.selectedScope,
    sourceSnapshot: toJson(input.blueprint),
  };
}

export function buildProjectTasks(
  blueprint: ProjectIdea,
  selectedScope: string
) {
  const scopeTier = blueprint.scopeTiers.find(
    (tier) => tier.tier === selectedScope
  );
  return buildTasks(blueprint, scopeTier?.features ?? []);
}

function buildTasks(blueprint: ProjectIdea, scopeFeatures: string[]) {
  const seen = new Set<string>();
  const tasks: {
    phaseTitle?: string;
    title: string;
    description?: string;
    order: number;
  }[] = [];

  function push(phaseTitle: string | undefined, title: string, description?: string) {
    const key = `${phaseTitle ?? "General"}:${title}`.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    tasks.push({ phaseTitle, title, description, order: tasks.length });
  }

  for (const feature of scopeFeatures) {
    push("Selected scope", feature, "Scope-specific feature selected when starting the project.");
  }

  for (const phase of blueprint.buildPhases) {
    for (const task of phase.tasks) {
      push(phase.title, task, phase.description);
    }
  }

  for (const feature of blueprint.coreFeatures) {
    push("Core features", feature, "Core feature from the source blueprint.");
  }

  return tasks.slice(0, 80);
}

function toJson(value: ProjectIdea): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
