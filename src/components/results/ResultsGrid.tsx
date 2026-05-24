"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

import { CustomizeBlueprintDialog } from "@/components/ai/CustomizeBlueprintDialog";
import { ProjectCard } from "@/components/results/ProjectCard";
import { ProjectDetailDialog } from "@/components/results/ProjectDetailDialog";
import type { ProjectIdea, ProjectMatch, SurveyAnswers } from "@/lib/types";

type ResultsGridProps = {
  matches: ProjectMatch[];
  answers?: SurveyAnswers;
};

export function ResultsGrid({ matches, answers }: ResultsGridProps) {
  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null);
  const [customizingIdea, setCustomizingIdea] = useState<ProjectIdea | null>(null);
  const [customizedMatches, setCustomizedMatches] = useState<ProjectMatch[]>([]);
  const visibleMatches = [...customizedMatches, ...matches];

  if (visibleMatches.length === 0) {
    return (
      <div className="rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-8 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-300">
          <Search className="size-5" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-zinc-50">
          No matches yet
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
          Adjust your survey answers and BuildSeed will recalculate project
          ideas with a better fit.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleMatches.map((match, index) => (
          <motion.div
            key={match.idea.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.04 }}
          >
            <ProjectCard
              match={match}
              onViewBlueprint={() => setSelectedIdea(match.idea)}
              onCustomizeBlueprint={() => setCustomizingIdea(match.idea)}
            />
          </motion.div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/8 p-5">
        <h3 className="text-lg font-semibold text-zinc-50">
          Want to adapt one of these ideas?
        </h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Pick any matched blueprint and customize it with one message. Curated results stay unchanged.
        </p>
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
        answers={answers}
        open={Boolean(customizingIdea)}
        onOpenChange={(open) => {
          if (!open) setCustomizingIdea(null);
        }}
        onCustomized={(idea) => {
          const customizedMatch: ProjectMatch = {
            idea,
            score: 100,
            percentage: 100,
            matchType: "ai",
            matchReasons: [
              "Customized from a matched blueprint",
              "Adjusted from your freeform request",
              "Preserves the original project plan where useful",
            ],
            selectedCustomStacks: answers?.customStacks,
          };
          setCustomizedMatches((current) => [customizedMatch, ...current]);
          setSelectedIdea(idea);
        }}
      />
    </>
  );
}
