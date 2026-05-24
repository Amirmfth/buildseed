"use client";

import { useState } from "react";

import { CustomizeBlueprintDialog } from "@/components/ai/CustomizeBlueprintDialog";
import { ProjectCard } from "@/components/results/ProjectCard";
import { ProjectDetailDialog } from "@/components/results/ProjectDetailDialog";
import type { ProjectIdea, ProjectMatch } from "@/lib/types";

function toPopularMatches(ideas: ProjectIdea[]): ProjectMatch[] {
  return ideas.map((idea, index) => ({
  idea,
  score: 90 - index * 3,
  percentage: 92 - index * 4,
  matchReasons: [
    "Curated for realistic scope",
    `Strong ${idea.goals[0].toLowerCase()} fit`,
    `Practices ${idea.features.slice(0, 2).join(", ").toLowerCase()}`,
  ],
  }));
}

export function PopularIdeas({ blueprints }: { blueprints: ProjectIdea[] }) {
  const popularMatches = toPopularMatches(blueprints);
  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null);
  const [customizingIdea, setCustomizingIdea] = useState<ProjectIdea | null>(null);
  const [customizedMatches, setCustomizedMatches] = useState<ProjectMatch[]>([]);
  const visibleMatches = [...customizedMatches, ...popularMatches];

  return (
    <section id="popular-ideas" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
            Browse Blueprints
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">
            Curated across many developer fields.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-zinc-400">
          Explore web, mobile, AI, data, cloud, game, security, and creative coding blueprints.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleMatches.map((match) => (
          <ProjectCard
            key={match.idea.id}
            match={match}
            onViewBlueprint={() => setSelectedIdea(match.idea)}
            onCustomizeBlueprint={() => setCustomizingIdea(match.idea)}
          />
        ))}
      </div>
      <ProjectDetailDialog
        idea={selectedIdea}
        open={Boolean(selectedIdea)}
        onOpenChange={(open) => {
          if (!open) setSelectedIdea(null);
        }}
        onCustomizeBlueprint={(idea) => setCustomizingIdea(idea)}
      />
      <CustomizeBlueprintDialog
        blueprint={customizingIdea}
        open={Boolean(customizingIdea)}
        onOpenChange={(open) => {
          if (!open) setCustomizingIdea(null);
        }}
        onCustomized={(idea) => {
          setCustomizedMatches((current) => [
            {
              idea,
              score: 100,
              percentage: 100,
              matchType: "ai",
              matchReasons: [
                "Customized from a curated blueprint",
                "Adjusted from your freeform request",
                "Ready to copy or refine",
              ],
            },
            ...current,
          ]);
          setSelectedIdea(idea);
        }}
      />
    </section>
  );
}
