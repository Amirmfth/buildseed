"use client";

import { useState, useTransition } from "react";
import { Rocket } from "lucide-react";

import { createProjectFromBlueprintAction } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buttonClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";
import type { ProjectIdea } from "@/lib/types";

const scopeLabels = {
  mini: "Mini",
  standard: "Standard",
  portfolio: "Portfolio",
  production: "Production",
};

export function StartProjectDialog({
  blueprint,
  compact = false,
  iconOnly = false,
}: {
  blueprint: ProjectIdea;
  compact?: boolean;
  iconOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pendingScope, setPendingScope] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(compact ? "h-10" : "h-11", buttonClasses.primary)}
      >
        <Rocket className="size-4" />
        {!iconOnly ? "Start Project" : null}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border border-[#3F3F46] bg-[#09090B] text-zinc-100 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Choose project scope
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Start {blueprint.title} as a tracked project in your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            {blueprint.scopeTiers.map((tier) => (
              <button
                key={tier.tier}
                type="button"
                disabled={pending}
                onClick={() => {
                  setPendingScope(tier.tier);
                  startTransition(async () => {
                    await createProjectFromBlueprintAction({
                      blueprintId:
                        blueprint.generated || blueprint.community ? undefined : blueprint.id,
                      communityBlueprintId: blueprint.communityBlueprintId,
                      blueprint,
                      selectedScope: tier.tier,
                      callbackUrl: "/projects",
                    });
                  });
                }}
                className="rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-4 text-left transition hover:border-green-500/45 hover:bg-[#27272A]"
              >
                <p className="font-mono text-xs uppercase text-green-300">
                  {scopeLabels[tier.tier]}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{tier.title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  {tier.description}
                </p>
                {pending && pendingScope === tier.tier ? (
                  <p className="mt-3 font-mono text-xs uppercase text-cyan-300">
                    Creating project...
                  </p>
                ) : null}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
