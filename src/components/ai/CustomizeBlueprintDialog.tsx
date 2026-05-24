"use client";

import { useEffect, useState } from "react";
import { KeyRound, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { buttonClasses, surfaceClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";
import { customizationPresets } from "@/lib/ai/customizationPresets";
import type { ProjectIdea, SurveyAnswers } from "@/lib/types";

const FREE_LIMIT = 3;
const FREE_COUNT_KEY = "buildseed_free_ai_generations_used";
const USER_KEY_STORAGE = "buildseed_user_ai_api_key";

type ProviderInfo = {
  label: string;
  model: string;
};

type CustomizeBlueprintDialogProps = {
  blueprint: ProjectIdea | null;
  answers?: SurveyAnswers | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomized: (blueprint: ProjectIdea) => void;
};

export function CustomizeBlueprintDialog({
  blueprint,
  answers,
  open,
  onOpenChange,
  onCustomized,
}: CustomizeBlueprintDialogProps) {
  const [request, setRequest] = useState("");
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [userApiKey, setUserApiKey] = useState(() =>
    typeof window === "undefined"
      ? ""
      : localStorage.getItem(USER_KEY_STORAGE) ?? ""
  );
  const [used, setUsed] = useState(() =>
    typeof window === "undefined"
      ? 0
      : Number(localStorage.getItem(FREE_COUNT_KEY) ?? "0")
  );
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProviderInfo() {
      try {
        const response = await fetch("/api/customize-blueprint");
        if (!response.ok) return;
        const payload = (await response.json()) as ProviderInfo;
        if (!cancelled) setProviderInfo(payload);
      } catch {
        if (!cancelled) setProviderInfo(null);
      }
    }

    if (open) loadProviderInfo();

    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!blueprint) return null;

  const freeUsedUp = used >= FREE_LIMIT && !userApiKey;
  const requestTooLong = request.length > 1400;
  const canSubmit = request.trim().length > 0 || selectedPresets.length > 0;

  async function customize() {
    if (!blueprint) return;
    const customizationRequest = request.trim();
    if (!customizationRequest && selectedPresets.length === 0) {
      setError("Choose a preset or describe what you want to change first.");
      return;
    }

    if (customizationRequest.length > 1400) {
      setError("Keep the customization request under 1,400 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/customize-blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blueprint,
          customMessage: customizationRequest,
          selectedPresets,
          answers,
          userApiKey: userApiKey || undefined,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Customization failed.");
      }

      if (!userApiKey) {
        const nextUsed = used + 1;
        setUsed(nextUsed);
        localStorage.setItem(FREE_COUNT_KEY, String(nextUsed));
      } else {
        localStorage.setItem(USER_KEY_STORAGE, userApiKey);
      }

      setRequest("");
      setSelectedPresets([]);
      onCustomized(payload.blueprint);
      onOpenChange(false);
    } catch (customizeError) {
      setError(
        customizeError instanceof Error
          ? customizeError.message
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border border-[#3F3F46] bg-[#09090B] text-zinc-100 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            Customize with AI
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Adapt &quot;{blueprint.title}&quot; with one message. The original blueprint is not changed.
          </DialogDescription>
        </DialogHeader>

        <div className={cn("rounded-2xl p-4", surfaceClasses.panel)}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
              Quick presets
            </p>
            {selectedPresets.length ? (
              <button
                type="button"
                onClick={() => setSelectedPresets([])}
                className="text-xs text-zinc-400 hover:text-zinc-100"
              >
                Clear
              </button>
            ) : null}
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            {customizationPresets.map((preset) => {
              const selected = selectedPresets.includes(preset.id);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() =>
                    setSelectedPresets((current) =>
                      selected
                        ? current.filter((id) => id !== preset.id)
                        : [...current, preset.id]
                    )
                  }
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition",
                    selected
                      ? "border-green-500/50 bg-green-500/15 text-green-200"
                      : "border-[#3F3F46] bg-[#09090B] text-zinc-400 hover:text-zinc-100"
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
            Optional message
          </p>
          <textarea
            value={request}
            onChange={(event) => setRequest(event.target.value)}
            placeholder="Example: Make this mobile-first, remove payments, use Supabase instead of Firebase, make it easier, and add offline support."
            className="mt-3 min-h-36 w-full resize-none rounded-xl border border-[#3F3F46] bg-[#09090B] p-3 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-green-500/70"
          />
          <div className="mt-2 flex justify-between text-xs text-zinc-500">
            <span>Free usage: {Math.min(used, FREE_LIMIT)}/{FREE_LIMIT}</span>
            <span className={requestTooLong ? "text-red-300" : ""}>
              {request.length}/1400
            </span>
          </div>
          {providerInfo ? (
            <p className="mt-2 font-mono text-xs text-zinc-500">
              Powered by {providerInfo.label}
              {providerInfo.model ? ` - ${providerInfo.model}` : ""}
            </p>
          ) : null}
        </div>

        {freeUsedUp ? (
          <div className="rounded-xl border border-[#3F3F46]/70 bg-[#18181B] p-4 text-sm text-zinc-300">
            Free demo generations used. Add your own API key to continue.
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
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
            Clear key
          </Button>
        </div>
        <p className="text-xs leading-5 text-zinc-500">
          Your key is stored locally in this browser and is only used for generation requests.
        </p>

        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={cn("h-11", buttonClasses.outline)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={loading || freeUsedUp || requestTooLong || !canSubmit}
            onClick={customize}
            className={cn("h-11", buttonClasses.primary)}
          >
            <Sparkles className="size-4" />
            {loading ? "Customizing..." : "Customize Blueprint"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
