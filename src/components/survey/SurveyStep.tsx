"use client";

import { motion } from "framer-motion";

import { SelectableCard } from "@/components/survey/SelectableCard";

type SurveyStepProps = {
  eyebrow: string;
  title: string;
  description: string;
  options: string[];
  selectedValues: string[];
  multiple?: boolean;
  layout?: "wrap" | "full";
  mobileLabelMap?: Record<string, string>;
  onChange: (value: string) => void;
};

export function SurveyStep({
  eyebrow,
  title,
  description,
  options,
  selectedValues,
  multiple = false,
  layout = "wrap",
  mobileLabelMap,
  onChange,
}: SurveyStepProps) {
  return (
    <motion.div
      key={eyebrow}
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          {description}
        </p>
        {multiple ? (
          <p className="mt-3 font-mono text-xs text-zinc-500">
            {selectedValues.length} selected
          </p>
        ) : null}
      </div>

      <div
        className={
          layout === "full"
            ? "grid gap-2"
            : "flex flex-wrap gap-2 sm:grid sm:gap-3 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {options.map((option) => (
          <SelectableCard
            key={option}
            label={option}
            mobileLabel={mobileLabelMap?.[option]}
            selected={selectedValues.includes(option)}
            onToggle={() => onChange(option)}
            compact={!multiple}
            fullWidth={layout === "full"}
          />
        ))}
      </div>
    </motion.div>
  );
}
