"use client";

import { useMemo, useState } from "react";

import { CustomizeBlueprintDialog } from "@/components/ai/CustomizeBlueprintDialog";
import { BlueprintDetailDialog } from "@/components/blueprints/BlueprintDetailDialog";
import { ProjectCard } from "@/components/results/ProjectCard";
import { Input } from "@/components/ui/input";
import type { ProjectIdea, ProjectMatch } from "@/lib/types";

export function CommunityBlueprintsClient({
  blueprints,
}: {
  blueprints: ProjectIdea[];
}) {
  const [query, setQuery] = useState("");
  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null);
  const [customizingIdea, setCustomizingIdea] = useState<ProjectIdea | null>(null);
  const [items, setItems] = useState(blueprints);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((idea) =>
      [
        idea.title,
        idea.shortDescription,
        idea.longDescription,
        idea.authorName,
        ...idea.developerFields,
        ...idea.stacks,
        ...idea.categories,
        ...idea.features,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [items, query]);

  return (
    <>
      <div className="mb-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search community blueprints..."
          className="h-11 border-[#3F3F46] bg-[#18181B] text-zinc-100"
        />
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
          {filtered.length} approved
        </p>
      </div>

      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((idea, index) => {
            const match: ProjectMatch = {
              idea,
              score: 100 - index,
              percentage: 92,
              matchReasons: [
                `Submitted by ${idea.authorName ?? "community"}`,
                `${idea.difficulty} scope`,
                `Uses ${idea.recommendedStack.slice(0, 2).join(", ")}`,
              ],
            };

            return (
              <ProjectCard
                key={idea.id}
                match={match}
                onViewBlueprint={() => setSelectedIdea(idea)}
                onCustomizeBlueprint={() => setCustomizingIdea(idea)}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-8 text-center">
          <h2 className="text-xl font-semibold">No community blueprints found.</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Try searching another field, stack, or feature.
          </p>
        </div>
      )}

      <BlueprintDetailDialog
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
        onCustomized={(idea) => setItems((current) => [idea, ...current])}
      />
    </>
  );
}
