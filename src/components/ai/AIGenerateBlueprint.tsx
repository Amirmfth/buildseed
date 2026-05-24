"use client";

import { useEffect, useState } from "react";
import { KeyRound, Sparkles, Trash2 } from "lucide-react";

import { CustomizeBlueprintDialog } from "@/components/ai/CustomizeBlueprintDialog";
import { ProjectCard } from "@/components/results/ProjectCard";
import { ProjectDetailDialog } from "@/components/results/ProjectDetailDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buttonClasses, surfaceClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";
import type { ProjectIdea, ProjectMatch, SurveyAnswers } from "@/lib/types";

const FREE_LIMIT = 3;
const FREE_COUNT_KEY = "buildseed_free_ai_generations_used";
const USER_KEY_STORAGE = "buildseed_user_ai_api_key";

type AIGenerateBlueprintProps = {
  answers: SurveyAnswers;
};

type ProviderInfo = {
  label: string;
  model: string;
};

export function AIGenerateBlueprint({ answers }: AIGenerateBlueprintProps) {
  const [used, setUsed] = useState(() =>
    typeof window === "undefined"
      ? 0
      : Number(localStorage.getItem(FREE_COUNT_KEY) ?? "0")
  );
  const [userApiKey, setUserApiKey] = useState(() =>
    typeof window === "undefined"
      ? ""
      : localStorage.getItem(USER_KEY_STORAGE) ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [blueprint, setBlueprint] = useState<ProjectIdea | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);

  const freeUsedUp = used >= FREE_LIMIT && !userApiKey;

  useEffect(() => {
    let cancelled = false;

    async function loadProviderInfo() {
      try {
        const response = await fetch("/api/generate-blueprint");
        if (!response.ok) return;
        const payload = (await response.json()) as ProviderInfo;
        if (!cancelled) setProviderInfo(payload);
      } catch {
        if (!cancelled) setProviderInfo(null);
      }
    }

    loadProviderInfo();

    return () => {
      cancelled = true;
    };
  }, []);

  async function generate() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          userApiKey: userApiKey || undefined,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Generation failed.");
      }

      setBlueprint(payload.blueprint);

      if (!userApiKey) {
        const nextUsed = used + 1;
        setUsed(nextUsed);
        localStorage.setItem(FREE_COUNT_KEY, String(nextUsed));
      }

      if (userApiKey) {
        localStorage.setItem(USER_KEY_STORAGE, userApiKey);
      }
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Network error. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function clearSavedKey() {
    localStorage.removeItem(USER_KEY_STORAGE);
    setUserApiKey("");
  }

  const generatedMatch: ProjectMatch | null = blueprint
    ? {
        idea: blueprint,
        score: 100,
        percentage: 100,
        matchType: "ai",
        matchReasons: [
          "Generated from your survey answers",
          "Uses your selected stack and custom tools",
          "Scoped to your selected time and difficulty",
        ],
      }
    : null;

  return (
    <section className={cn("mt-10 rounded-2xl p-5", surfaceClasses.panel)}>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
            Optional AI generation
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            Want a custom blueprint?
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Curated matches stay the default. AI generation creates one extra
            blueprint from your exact survey answers.
          </p>
          <p className="mt-2 font-mono text-xs text-zinc-500">
            Free demo generations used: {Math.min(used, FREE_LIMIT)}/{FREE_LIMIT}
          </p>
          {providerInfo ? (
            <p className="mt-2 font-mono text-xs text-zinc-500">
              Powered by {providerInfo.label}
              {providerInfo.model ? ` · ${providerInfo.model}` : ""}
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          disabled={loading || freeUsedUp}
          onClick={generate}
          className={cn("h-11 px-5", buttonClasses.primary)}
        >
          <Sparkles className="size-4" />
          {loading ? "Generating..." : blueprint ? "Regenerate" : "Generate with AI"}
        </Button>
      </div>

      {freeUsedUp ? (
        <div className="mt-5 rounded-xl border border-[#3F3F46]/70 bg-[#09090B]/70 p-4">
          <p className="text-sm text-zinc-300">
            Free demo generations used. Add your own API key to continue.
          </p>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            type="password"
            value={userApiKey}
            onChange={(event) => setUserApiKey(event.target.value)}
            placeholder="Optional user API key"
            className="h-11 rounded-xl border-[#3F3F46] bg-[#09090B] pl-9 text-zinc-100 placeholder:text-zinc-600"
          />
        </label>
        <Button
          type="button"
          variant="outline"
          onClick={clearSavedKey}
          className={cn("h-11", buttonClasses.outline)}
        >
          <Trash2 className="size-4" />
          Clear saved key
        </Button>
      </div>
      <p className="mt-2 text-xs leading-5 text-zinc-500">
        Your key is stored locally in this browser and is only used for
        generation requests.
      </p>

      {error ? (
        <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {generatedMatch ? (
        <div className="mt-6 max-w-xl">
          <ProjectCard
            match={generatedMatch}
            onViewBlueprint={() => setDialogOpen(true)}
            onCustomizeBlueprint={() => setCustomizeOpen(true)}
          />
          <ProjectDetailDialog
            idea={blueprint}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onCustomizeBlueprint={() => setCustomizeOpen(true)}
          />
          <CustomizeBlueprintDialog
            blueprint={blueprint}
            answers={answers}
            open={customizeOpen}
            onOpenChange={setCustomizeOpen}
            onCustomized={(idea) => {
              setBlueprint(idea);
              setDialogOpen(true);
            }}
          />
        </div>
      ) : null}
    </section>
  );
}
