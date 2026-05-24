"use client";

import { useMemo, useState } from "react";

import { BlueprintDetailDialog } from "@/components/blueprints/BlueprintDetailDialog";
import { ProjectCard } from "@/components/results/ProjectCard";
import { Input } from "@/components/ui/input";
import type { ProjectIdea, ProjectMatch } from "@/lib/types";

type SavedBlueprintItem = {
  id: string;
  blueprintId: string | null;
  createdAt: string;
  idea: ProjectIdea;
};

export function SavedBlueprintsClient({
  saved,
}: {
  saved: SavedBlueprintItem[];
}) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null);

  const difficulties = useMemo(
    () => Array.from(new Set(saved.map((item) => item.idea.difficulty))).sort(),
    [saved]
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return saved.filter(({ idea }) => {
      if (difficulty && idea.difficulty !== difficulty) return false;
      if (!normalizedQuery) return true;

      return [
        idea.title,
        idea.shortDescription,
        idea.longDescription,
        ...idea.developerFields,
        ...idea.categories,
        ...idea.stacks,
        ...idea.features,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [difficulty, query, saved]);

  if (!saved.length) {
    return (
      <div className="rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-8 text-center">
        <h2 className="text-xl font-semibold">No saved blueprints yet.</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Browse blueprints and save the ideas you may want to build.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-center">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search saved blueprints..."
          className="h-11 border-[#3F3F46] bg-[#18181B] text-zinc-100"
        />
        <select
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
          className="h-11 rounded-xl border border-[#3F3F46] bg-[#18181B] px-3 text-sm text-zinc-100 outline-none"
        >
          <option value="">All difficulties</option>
          {difficulties.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
          {filtered.length} saved
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item, index) => {
            const match: ProjectMatch = {
              idea: item.idea,
              score: 100 - index,
              percentage: 95,
              matchReasons: [
                "Saved to your workspace",
                `${item.idea.difficulty} scope`,
                `Uses ${item.idea.recommendedStack.slice(0, 2).join(", ")}`,
              ],
            };

            return (
              <ProjectCard
                key={item.id}
                match={match}
                onViewBlueprint={() => setSelectedIdea(item.idea)}
                savedId={item.id}
                initialSaved
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-8 text-center">
          <h2 className="text-xl font-semibold">No saved blueprints match.</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Try a different title, field, stack, or feature.
          </p>
        </div>
      )}

      {selectedIdea ? (
        <BlueprintDetailDialog
          idea={selectedIdea}
          open={Boolean(selectedIdea)}
          onOpenChange={(open) => {
            if (!open) setSelectedIdea(null);
          }}
        />
      ) : null}
    </>
  );
}
