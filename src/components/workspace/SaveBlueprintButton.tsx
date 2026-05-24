"use client";

import { useState, useTransition } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

import {
  saveBlueprintAction,
  unsaveBlueprintAction,
} from "@/app/actions/savedBlueprints";
import { Button } from "@/components/ui/button";
import { buttonClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";
import type { ProjectIdea } from "@/lib/types";

export function SaveBlueprintButton({
  blueprint,
  savedId,
  initialSaved = false,
  compact = false,
}: {
  blueprint: ProjectIdea;
  savedId?: string;
  initialSaved?: boolean;
  compact?: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          if (saved) {
            await unsaveBlueprintAction({
              savedId,
              blueprintId:
                savedId || blueprint.generated || blueprint.community
                  ? undefined
                  : blueprint.id,
              communityBlueprintId:
                savedId || !blueprint.community
                  ? undefined
                  : blueprint.communityBlueprintId,
            });
            setSaved(false);
            return;
          }

          await saveBlueprintAction({
            blueprintId:
              blueprint.generated || blueprint.community ? undefined : blueprint.id,
            communityBlueprintId: blueprint.communityBlueprintId,
            blueprint,
            callbackUrl: "/saved",
          });
          setSaved(true);
        });
      }}
      className={cn(compact ? "h-10" : "h-11", buttonClasses.outline)}
    >
      {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
      {pending ? "Saving..." : saved ? "Saved" : "Save"}
    </Button>
  );
}
