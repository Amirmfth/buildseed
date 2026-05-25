"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Check,
  Clipboard,
  Clock3,
  ExternalLink,
  GraduationCap,
  SignalHigh,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SaveBlueprintButton } from "@/components/workspace/SaveBlueprintButton";
import { StartProjectDialog } from "@/components/workspace/StartProjectDialog";
import { generateBlueprint } from "@/lib/matcher";
import { buttonClasses, surfaceClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";
import type { ProjectMatch } from "@/lib/types";

type ProjectCardProps = {
  match: ProjectMatch;
  onViewBlueprint: () => void;
  onCustomizeBlueprint?: () => void;
  initialSaved?: boolean;
  savedId?: string;
};

export function ProjectCard({
  match,
  onViewBlueprint,
  onCustomizeBlueprint,
  initialSaved = false,
  savedId,
}: ProjectCardProps) {
  const [copied, setCopied] = useState(false);
  const { idea } = match;
  const matchType = idea.matchType ?? match.matchType;
  const categories = idea.categories ?? [];
  const recommendedStack = idea.recommendedStack ?? [];
  const secondaryActionCount = onCustomizeBlueprint ? 3 : 2;

  async function copyBlueprint() {
    try {
      await navigator.clipboard.writeText(
        generateBlueprint(idea, match.selectedCustomStacks)
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl p-4 sm:p-5",
        surfaceClasses.panel
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/55 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0 space-y-2 sm:space-y-3">
          <div className="flex flex-wrap gap-2">
            {matchType ? (
              <MatchBadge matchType={matchType} customized={idea.customized} />
            ) : null}
            {categories.slice(0, 1).map((category) => (
              <Pill key={category} tone="cyan">
                {category}
              </Pill>
            ))}
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-zinc-50 sm:text-xl">
              {idea.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400 sm:line-clamp-3">
              {idea.shortDescription}
            </p>
          </div>
        </div>
        <div className="shrink-0 rounded-2xl border border-green-500/30 bg-[#09090B]/70 p-1.5 shadow-[0_0_28px_rgba(34,197,94,0.08)] sm:p-2">
          <div className="grid size-14 place-items-center rounded-xl bg-green-500/10 sm:size-16">
            <div className="text-center">
              <span className="block text-lg font-semibold tabular-nums text-green-400 sm:text-xl">
                {match.percentage}%
              </span>
              <span className="font-mono text-[9px] uppercase text-green-300/70">
                Match
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:mt-5">
        <div className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-zinc-500 sm:flex">
          Stack
        </div>
        <div className="flex flex-wrap gap-2">
          {recommendedStack.slice(0, 4).map((stackItem) => (
            <Pill key={stackItem}>{stackItem}</Pill>
          ))}
          {recommendedStack.length > 4 ? (
            <Pill>+{recommendedStack.length - 4} more</Pill>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#3F3F46]/45 pt-4 text-sm sm:mt-5 sm:pt-5">
        <Metric
          icon={<SignalHigh />}
          label="Difficulty"
          value={idea.difficulty}
        />
        <Metric icon={<Clock3 />} label="Time" value={idea.estimatedTime} />
        <Metric
          icon={<BarChart3 />}
          label="Portfolio"
          value={`${idea.portfolioValue}/10`}
          mobileHidden
        />
        <Metric
          icon={<GraduationCap />}
          label="Learning"
          value={`${idea.learningValue}/10`}
          mobileHidden
        />
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-4 sm:gap-2.5 sm:pt-5">
        <Button
          type="button"
          onClick={onViewBlueprint}
          className={cn("h-10", buttonClasses.primary)}
        >
          <ExternalLink className="size-4" />
          View blueprint
        </Button>
        <StartProjectDialog blueprint={idea} compact />
      </div>

      <div
        className="mt-2 grid gap-2 sm:gap-2.5"
        style={{ gridTemplateColumns: `repeat(${secondaryActionCount}, minmax(0, 1fr))` }}
      >
        {onCustomizeBlueprint ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCustomizeBlueprint}
            className={cn("h-10", buttonClasses.outline)}
            aria-label="Customize blueprint"
          >
            <Sparkles className="size-4" />
          </Button>
        ) : null}
        <SaveBlueprintButton
          blueprint={idea}
          savedId={savedId}
          initialSaved={initialSaved}
          compact
          iconOnly
        />
        <Button
          type="button"
          variant="outline"
          onClick={copyBlueprint}
          className={cn("h-10", buttonClasses.outline)}
          aria-label={copied ? "Blueprint copied" : "Copy blueprint"}
        >
          {copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}
        </Button>
      </div>
    </motion.article>
  );
}

function MatchBadge({
  matchType,
  customized,
}: {
  matchType: NonNullable<ProjectMatch["matchType"]>;
  customized?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase",
        matchType === "strong" &&
          "border-green-500/30 bg-green-500/10 text-green-300",
        matchType === "related" &&
          "border-cyan-500/25 bg-cyan-500/10 text-cyan-200",
        matchType === "discovery" &&
          "border-[#3F3F46] bg-[#27272A] text-zinc-300",
        matchType === "ai" &&
          "border-cyan-500/30 bg-cyan-500/10 text-cyan-200"
      )}
    >
      {matchType === "strong"
        ? "Strong match"
        : matchType === "related"
          ? "Related match"
          : matchType === "ai"
            ? customized
              ? "AI customized"
              : "AI generated"
            : "Discovery pick"}
    </span>
  );
}

function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "cyan";
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 font-mono text-[11px]",
        tone === "cyan"
          ? "border-cyan-500/20 bg-cyan-500/8 text-cyan-200"
          : "border-[#3F3F46] bg-[#09090B] text-zinc-300"
      )}
    >
      {children}
    </span>
  );
}

function Metric({
  icon,
  label,
  value,
  mobileHidden = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  mobileHidden?: boolean;
}) {
  return (
    <div className={cn("rounded-xl p-3", surfaceClasses.inset, mobileHidden && "hidden sm:block")}>
      <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase text-zinc-500 sm:mb-1">
        <span className="[&_svg]:size-3">{icon}</span>
        <span className="hidden sm:inline">{label}</span>
        <span className="text-sm font-medium normal-case text-zinc-200 sm:hidden">{value}</span>
      </div>
      <p className="hidden text-sm font-medium text-zinc-200 sm:block">{value}</p>
    </div>
  );
}
