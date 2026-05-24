"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { buttonClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";

export function PendingSubmitButton({
  children,
  pendingLabel = "Saving...",
  className,
  variant,
}: {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
  variant?: "outline";
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      variant={variant}
      className={cn(
        "h-10",
        variant === "outline" ? buttonClasses.outline : buttonClasses.primary,
        className
      )}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}

export function PendingTextButton({
  children,
  pendingLabel = "Working...",
  className,
}: {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "text-xs transition disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function PendingTaskToggle({
  completed,
}: {
  completed: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-label={completed ? "Mark task incomplete" : "Mark task complete"}
      disabled={pending}
      className={cn(
        "mt-0.5 grid size-5 place-items-center rounded-md border text-[9px] transition disabled:cursor-not-allowed disabled:opacity-70",
        completed
          ? "border-green-500 bg-green-500 text-[#09090B]"
          : "border-[#3F3F46]"
      )}
    >
      {pending ? "..." : completed ? "OK" : ""}
    </button>
  );
}
