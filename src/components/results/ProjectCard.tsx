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
  Layers3,
  GraduationCap,
  SignalHigh,
  Sparkles,
  Target,
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
        "group relative flex h-full flex-col overflow-hidden rounded-2xl p-5",
        surfaceClasses.panel
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/55 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap gap-2">
            {matchType ? <MatchBadge matchType={matchType} customized={idea.customized} /> : null}
            {idea.categories.slice(0, 2).map((category) => (
              <Pill key={category} tone="cyan">
                {category}
              </Pill>
            ))}
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-zinc-50">
              {idea.title}
            </h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">
              {idea.shortDescription}
            </p>
          </div>
        </div>
        <div className="shrink-0 rounded-2xl border border-green-500/30 bg-[#09090B]/70 p-2 shadow-[0_0_28px_rgba(34,197,94,0.08)]">
          <div className="grid size-16 place-items-center rounded-xl bg-green-500/10">
            <div className="text-center">
              <span className="block text-xl font-semibold tabular-nums text-green-400">
                {match.percentage}%
              </span>
              <span className="font-mono text-[9px] uppercase text-green-300/70">
                Match
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-zinc-500">
          <Layers3 className="size-3.5 text-cyan-300" />
          Recommended stack
        </div>
        <div className="flex flex-wrap gap-2">
          {idea.recommendedStack.slice(0, 6).map((stack) => (
            <Pill key={stack}>{stack}</Pill>
          ))}
          {idea.recommendedStack.length > 6 ? (
            <Pill>+{idea.recommendedStack.length - 6} more</Pill>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "mt-5 grid gap-2 rounded-2xl p-3 text-sm text-zinc-400",
          surfaceClasses.inset
        )}
      >
        {match.matchReasons.map((reason) => (
          <div key={reason} className="flex gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-green-400" />
            <span>{reason}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-2">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-zinc-500">
          <Target className="size-3.5 text-green-400" />
          Core build focus
        </div>
        <div className="grid gap-2">
          {idea.coreFeatures.slice(0, 2).map((feature) => (
            <div
              key={feature}
              className="rounded-xl border border-[#3F3F46]/45 bg-[#09090B]/45 px-3 py-2 text-sm text-zinc-300"
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#3F3F46]/45 pt-5 text-sm">
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
        />
        <Metric
          icon={<GraduationCap />}
          label="Learning"
          value={`${idea.learningValue}/10`}
        />
      </div>

      <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2">
        <Button
          type="button"
          onClick={onViewBlueprint}
          className={cn("h-10 sm:col-span-2", buttonClasses.primary)}
        >
          <ExternalLink className="size-4" />
          View blueprint
        </Button>
        {onCustomizeBlueprint ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCustomizeBlueprint}
            className={cn("h-10", buttonClasses.outline)}
          >
            <Sparkles className="size-4" />
            Customize
          </Button>
        ) : null}
        <SaveBlueprintButton
          blueprint={idea}
          savedId={savedId}
          initialSaved={initialSaved}
          compact
        />
        <StartProjectDialog blueprint={idea} compact />
        <Button
          type="button"
          variant="outline"
          onClick={copyBlueprint}
          className={cn("h-10", buttonClasses.outline)}
        >
          {copied ? (
            <Check className="size-4" />
          ) : (
            <Clipboard className="size-4" />
          )}
          {copied ? "Copied blueprint" : "Copy blueprint"}
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
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className={cn("rounded-xl p-3", surfaceClasses.inset)}>
      <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase text-zinc-500">
        <span className="[&_svg]:size-3">{icon}</span>
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-zinc-200">{value}</p>
    </div>
  );
}
