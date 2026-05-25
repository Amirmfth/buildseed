"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Clipboard,
  Code2,
  FileText,
  GitBranch,
  Layers3,
  Rocket,
  ShieldAlert,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

import { BlueprintArchitectureTab } from "@/components/blueprints/BlueprintArchitectureTab";
import { BlueprintBuildPlanTab } from "@/components/blueprints/BlueprintBuildPlanTab";
import { BlueprintChallengesTab } from "@/components/blueprints/BlueprintChallengesTab";
import { BlueprintExpansionTab } from "@/components/blueprints/BlueprintExpansionTab";
import { BlueprintOverviewTab } from "@/components/blueprints/BlueprintOverviewTab";
import { BlueprintPortfolioTab } from "@/components/blueprints/BlueprintPortfolioTab";
import { Button } from "@/components/ui/button";
import { SaveBlueprintButton } from "@/components/workspace/SaveBlueprintButton";
import { StartProjectDialog } from "@/components/workspace/StartProjectDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateBlueprint } from "@/lib/matcher";
import { buttonClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";
import type { ProjectIdea } from "@/lib/types";

const tabs = [
  { value: "overview", label: "Overview", icon: FileText },
  { value: "build", label: "Build Plan", icon: GitBranch },
  { value: "architecture", label: "Architecture", icon: Code2 },
  { value: "portfolio", label: "Portfolio", icon: Trophy },
  { value: "expansion", label: "Expansion", icon: Rocket },
  { value: "challenges", label: "Challenges", icon: ShieldAlert },
] as const;

type TabValue = (typeof tabs)[number]["value"];

type BlueprintDetailDialogProps = {
  idea: ProjectIdea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomizeBlueprint?: (idea: ProjectIdea) => void;
};

export function BlueprintDetailDialog({
  idea,
  open,
  onOpenChange,
  onCustomizeBlueprint,
}: BlueprintDetailDialogProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("overview");
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClosingMobile, setIsClosingMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const mobileVisible = open || isClosingMobile;

  useEffect(() => {
    if (!isMobile) return;
    if (mobileVisible) {
      document.body.style.overflow = "hidden";
      return;
    }
    document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, mobileVisible]);

  if (!idea) return null;
  const activeIdea = idea;

  async function copyBlueprint() {
    try {
      await navigator.clipboard.writeText(generateBlueprint(activeIdea));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  if (isMobile) {
    const handleClose = () => {
      setIsClosingMobile(true);
      window.setTimeout(() => {
        onOpenChange(false);
        setIsClosingMobile(false);
      }, 220);
    };

    return (
      <AnimatePresence>
        {mobileVisible ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosingMobile ? 0 : 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60"
            onClick={handleClose}
          >
            <motion.div
              initial={{ y: 120, opacity: 0.8 }}
              animate={isClosingMobile ? { y: 120, opacity: 0.6 } : { y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0.6 }}
              transition={{ duration: 0.24 }}
              className="absolute inset-x-0 bottom-0 mx-auto flex h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-[#3F3F46] bg-[#09090B]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 z-20 border-b border-[#3F3F46] bg-[#09090B]/95 px-4 py-3 backdrop-blur">
                <div className="flex items-center justify-between gap-2">
                  <div className="scrollbar-hidden flex max-w-[85%] items-center gap-1 overflow-x-auto rounded-full border border-[#3F3F46] bg-[#18181B] p-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.value}
                        type="button"
                        onClick={() => setActiveTab(tab.value)}
                        className={cn(
                          "rounded-full p-2 text-zinc-300 transition",
                          activeTab === tab.value && "bg-green-500 text-[#09090B]"
                        )}
                        aria-label={tab.label}
                      >
                        <tab.icon className="size-4" />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-xl border border-[#3F3F46] bg-[#18181B] p-2 text-zinc-300"
                    aria-label="Close blueprint"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <h2 className="mt-3 line-clamp-2 text-lg font-semibold text-zinc-50">
                  {activeIdea.title}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {tabs.find((tab) => tab.value === activeTab)?.label}
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <RenderTab idea={activeIdea} activeTab={activeTab} />
              </div>

              <div className="sticky bottom-0 z-20 border-t border-[#3F3F46] bg-[#09090B]/95 p-3 backdrop-blur">
                <div className="grid grid-cols-2 gap-2">
                  <SaveBlueprintButton blueprint={activeIdea} compact />
                  <StartProjectDialog blueprint={activeIdea} compact />
                  {onCustomizeBlueprint ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onCustomizeBlueprint(activeIdea)}
                      className={cn("h-10", buttonClasses.outline)}
                    >
                      <Sparkles className="size-4" />
                      AI
                    </Button>
                  ) : (
                    <div />
                  )}
                  <Button
                    type="button"
                    onClick={copyBlueprint}
                    className={cn("h-10", buttonClasses.primary)}
                  >
                    {copied ? (
                      <Check className="size-4" />
                    ) : (
                      <Clipboard className="size-4" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[96dvh] max-h-[96dvh] w-[calc(100vw-0.75rem)] max-w-none flex-col overflow-hidden border border-[#3F3F46] bg-[#09090B] p-0 text-zinc-100 sm:w-[calc(100vw-2rem)] lg:h-[92vh] lg:max-h-[92vh] lg:w-[min(calc(100vw-3rem),96rem)] xl:w-[min(calc(100vw-5rem),104rem)]">
        <div className="relative overflow-hidden border-b border-[#3F3F46]/55 bg-[#18181B] p-5 sm:p-6">
          <div className="pointer-events-none absolute right-0 top-0 size-72 -translate-y-1/2 translate-x-1/3 rounded-full bg-green-500/10 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_300px]">
            <div>
              <DialogHeader>
                <div className="mb-3 flex flex-wrap gap-2">
                  {activeIdea.customized ? (
                    <Badge tone="green">AI customized</Badge>
                  ) : activeIdea.generated ? (
                    <Badge tone="cyan">AI generated</Badge>
                  ) : (
                    <Badge tone="green">Curated blueprint</Badge>
                  )}
                  {activeIdea.developerFields.slice(0, 3).map((field) => (
                    <Badge key={field}>{field}</Badge>
                  ))}
                </div>
                <DialogTitle className="max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
                  {activeIdea.title}
                </DialogTitle>
                <DialogDescription className="max-w-3xl text-sm leading-6 text-zinc-400">
                  {activeIdea.longDescription}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 flex flex-wrap gap-2">
                {activeIdea.recommendedStack.slice(0, 8).map((stack) => (
                  <span
                    key={stack}
                    className="rounded-full border border-[#3F3F46] bg-[#09090B] px-3 py-1 font-mono text-xs text-zinc-300"
                  >
                    {stack}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <SaveBlueprintButton blueprint={activeIdea} compact />
                <StartProjectDialog blueprint={activeIdea} compact />
                {onCustomizeBlueprint ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onCustomizeBlueprint(activeIdea)}
                    className={cn("h-10", buttonClasses.outline)}
                  >
                    <Sparkles className="size-4" />
                    Customize with AI
                  </Button>
                ) : null}
                <Button
                  type="button"
                  onClick={copyBlueprint}
                  className={cn("h-10", buttonClasses.primary)}
                >
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Clipboard className="size-4" />
                  )}
                  {copied ? "Copied" : "Copy/export"}
                </Button>
              </div>
            </div>

            <aside className="grid gap-3 rounded-2xl border border-[#3F3F46]/60 bg-[#09090B]/65 p-4">
              <div className="flex items-center gap-2 font-mono text-xs uppercase text-zinc-500">
                <Layers3 className="size-4 text-green-400" />
                Blueprint snapshot
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Snapshot label="Difficulty" value={activeIdea.difficulty} />
                <Snapshot label="Time" value={activeIdea.estimatedTime} />
                <Snapshot label="Portfolio" value={`${activeIdea.portfolioValue}/10`} />
                <Snapshot label="Learning" value={`${activeIdea.learningValue}/10`} />
              </div>
            </aside>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabValue)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="sticky top-0 z-10 border-b border-[#3F3F46]/55 bg-[#09090B]/95 px-4 py-3 backdrop-blur sm:px-6">
            <TabsList className="scrollbar-hidden h-auto w-full justify-start overflow-x-auto rounded-xl border border-[#3F3F46]/60 bg-[#18181B] p-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="shrink-0 rounded-lg px-3 py-2 text-xs data-active:bg-green-500 data-active:text-[#09090B]"
                >
                  <tab.icon className="size-3.5" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <RenderTab idea={activeIdea} activeTab={activeTab} />
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function RenderTab({
  idea,
  activeTab,
}: {
  idea: ProjectIdea;
  activeTab: TabValue;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18 }}
      >
        {activeTab === "overview" ? <BlueprintOverviewTab blueprint={idea} /> : null}
        {activeTab === "build" ? <BlueprintBuildPlanTab blueprint={idea} /> : null}
        {activeTab === "architecture" ? (
          <BlueprintArchitectureTab blueprint={idea} />
        ) : null}
        {activeTab === "portfolio" ? <BlueprintPortfolioTab blueprint={idea} /> : null}
        {activeTab === "expansion" ? <BlueprintExpansionTab blueprint={idea} /> : null}
        {activeTab === "challenges" ? <BlueprintChallengesTab blueprint={idea} /> : null}
      </motion.div>
    </AnimatePresence>
  );
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: string;
  tone?: "neutral" | "green" | "cyan";
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase",
        tone === "green" &&
          "border-green-500/30 bg-green-500/10 text-green-300",
        tone === "cyan" &&
          "border-cyan-500/25 bg-cyan-500/10 text-cyan-200",
        tone === "neutral" && "border-[#3F3F46] bg-[#27272A]/70 text-zinc-300"
      )}
    >
      {children}
    </span>
  );
}

function Snapshot({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#3F3F46]/50 bg-[#18181B]/70 p-3">
      <p className="font-mono text-[10px] uppercase text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-zinc-100">{value}</p>
    </div>
  );
}
