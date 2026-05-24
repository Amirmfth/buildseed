"use client";

import { useTransition } from "react";

import { cn } from "@/lib/utils";

export function ConfirmActionForm({
  action,
  id,
  label,
  message,
  destructive,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label: string;
  message: string;
  destructive?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        if (!window.confirm(message)) return;
        startTransition(() => {
          void action(formData);
        });
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className={cn(
          "rounded-lg border px-2 py-1 text-xs disabled:opacity-50",
          destructive
            ? "border-red-500/40 bg-red-500/10 text-red-200"
            : "border-[#3F3F46] bg-[#09090B] text-zinc-300 hover:text-zinc-50"
        )}
      >
        {pending ? "Working..." : label}
      </button>
    </form>
  );
}
