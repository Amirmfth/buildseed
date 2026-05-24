"use client";

import { useMemo, useState } from "react";

import { BlueprintDetailDialog } from "@/components/blueprints/BlueprintDetailDialog";
import { Button } from "@/components/ui/button";
import { buttonClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";
import type { ProjectIdea } from "@/lib/types";

export function SourceBlueprintPanel({
  snapshot,
  selectedScope,
}: {
  snapshot: unknown;
  selectedScope: string | null;
}) {
  const [open, setOpen] = useState(false);
  const blueprint = useMemo(() => parseBlueprint(snapshot), [snapshot]);

  return (
    <div className="grid gap-3">
      <p className="text-sm leading-6 text-zinc-400">
        This project was started from the {selectedScope ?? "standard"} scope.
      </p>
      {blueprint ? (
        <>
          <div className="rounded-xl border border-[#3F3F46]/60 bg-[#09090B]/60 p-3">
            <h3 className="font-medium text-zinc-100">{blueprint.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-400">
              {blueprint.shortDescription}
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setOpen(true)}
            className={cn("h-10", buttonClasses.outline)}
            variant="outline"
          >
            Open source blueprint
          </Button>
          <BlueprintDetailDialog
            idea={blueprint}
            open={open}
            onOpenChange={setOpen}
          />
        </>
      ) : null}
    </div>
  );
}

function parseBlueprint(value: unknown): ProjectIdea | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<ProjectIdea>;
  return typeof candidate.id === "string" && typeof candidate.title === "string"
    ? (candidate as ProjectIdea)
    : null;
}
