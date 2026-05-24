"use client";

import { BlueprintDetailDialog } from "@/components/blueprints/BlueprintDetailDialog";
import type { ProjectIdea } from "@/lib/types";

type ProjectDetailDialogProps = {
  idea: ProjectIdea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomizeBlueprint?: (idea: ProjectIdea) => void;
};

export function ProjectDetailDialog(props: ProjectDetailDialogProps) {
  return <BlueprintDetailDialog {...props} />;
}
