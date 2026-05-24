"use client";

import { motion } from "framer-motion";

import { SelectableCard } from "@/components/survey/SelectableCard";
import { developerFields } from "@/data/techStacks";

type DeveloperFieldStepProps = {
  selectedValues: string[];
  onChange: (value: string) => void;
};

export function DeveloperFieldStep({
  selectedValues,
  onChange,
}: DeveloperFieldStepProps) {
  return (
    <motion.div
      key="developer-fields"
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
          Step 1 of 7
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
          What kind of developer are you building as?
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Choose one or more fields. The next step will adapt the tech stack
          options to your selection.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {developerFields.map((field) => (
          <div key={field.id} className="rounded-2xl" title={field.description}>
            <SelectableCard
              label={field.label}
              selected={selectedValues.includes(field.id)}
              onToggle={() => onChange(field.id)}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
