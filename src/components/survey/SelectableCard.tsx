"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type SelectableCardProps = {
  label: string;
  selected: boolean;
  onToggle: () => void;
  compact?: boolean;
  disabled?: boolean;
};

export function SelectableCard({
  label,
  selected,
  onToggle,
  compact = false,
  disabled = false,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "group flex min-h-12 items-center justify-between rounded-full border px-4 text-left text-sm font-medium transition duration-200",
        "border-[#3F3F46]/75 bg-[#18181B] text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
        "hover:border-green-500/70 hover:bg-[#27272A] hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/60",
        "disabled:cursor-not-allowed disabled:border-[#3F3F46]/40 disabled:bg-[#18181B]/45 disabled:text-zinc-600",
        selected &&
          "border-green-500 bg-green-500/10 text-white shadow-[0_0_0_1px_rgba(34,197,94,0.26),0_14px_34px_rgba(34,197,94,0.08)]",
        compact ? "min-h-10 px-3 text-xs" : "sm:min-h-14"
      )}
    >
      <span className="font-mono text-[12px] leading-5 tracking-normal sm:text-sm">
        {label}
      </span>
      <span
        className={cn(
          "ml-3 grid size-5 shrink-0 place-items-center rounded-full border border-zinc-700 text-transparent transition",
          "group-hover:border-green-500/70",
          selected && "border-green-500 bg-green-500 text-zinc-950",
          disabled && "border-zinc-800"
        )}
      >
        <Check className="size-3.5" aria-hidden="true" />
      </span>
    </button>
  );
}
