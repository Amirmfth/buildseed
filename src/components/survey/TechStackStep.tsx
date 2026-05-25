"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectableCard } from "@/components/survey/SelectableCard";
import {
  getRecommendedTechStacksForFields,
  getTechStacksForFields,
} from "@/data/techStacks";
import { buttonClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";

type TechStackStepProps = {
  developerFields: string[];
  selectedStacks: string[];
  customStacks: string[];
  onToggleStack: (value: string) => void;
  onAddCustomStack: (value: string) => void;
  onRemoveCustomStack: (value: string) => void;
};

export function TechStackStep({
  developerFields,
  selectedStacks,
  customStacks,
  onToggleStack,
  onAddCustomStack,
  onRemoveCustomStack,
}: TechStackStepProps) {
  const [query, setQuery] = useState("");
  const [customValue, setCustomValue] = useState("");

  const groupedOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const options = getTechStacksForFields(developerFields).filter((option) => {
      if (!normalizedQuery) return true;
      return [option.label, option.category].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      );
    });

    return options.reduce<Record<string, typeof options>>((groups, option) => {
      groups[option.category] = [...(groups[option.category] ?? []), option];
      return groups;
    }, {});
  }, [developerFields, query]);
  const recommendedOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return getRecommendedTechStacksForFields(developerFields).filter((option) => {
      if (!normalizedQuery) return true;
      return [option.label, option.category].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [developerFields, query]);
  const groupCount = Object.keys(groupedOptions).length;
  const optionCount = Object.values(groupedOptions).reduce(
    (total, options) => total + options.length,
    0
  );

  function handleCustomSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = customValue.trim();
    if (!value) return;
    onAddCustomStack(value);
    setCustomValue("");
  }

  return (
    <motion.div
      key="tech-stack"
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
          Step 2 of 7
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
          Choose your tech stack
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Start with recommended technologies for your field, then browse all
          grouped options or add a custom tool.
        </p>
        <p className="mt-3 font-mono text-xs text-zinc-500">
          {selectedStacks.length + customStacks.length} selected · {optionCount} options across {groupCount} groups
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_0.82fr]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tech stack"
            className="h-11 rounded-xl border-[#3F3F46] bg-[#09090B] pl-9 text-zinc-100 placeholder:text-zinc-600"
          />
        </label>

        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <Input
            value={customValue}
            onChange={(event) => setCustomValue(event.target.value)}
            placeholder="Custom technology"
            className="h-11 rounded-xl border-[#3F3F46] bg-[#09090B] text-zinc-100 placeholder:text-zinc-600"
          />
          <Button
            type="submit"
            className={cn("h-11 shrink-0 px-3", buttonClasses.primary)}
            aria-label="Add custom technology"
          >
            <Plus className="size-4" />
          </Button>
        </form>
      </div>

      {customStacks.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {customStacks.map((stack) => (
            <span
              key={stack}
              className="inline-flex items-center gap-2 rounded-full border border-green-500/35 bg-green-500/10 px-3 py-1 font-mono text-xs text-green-200"
            >
              {stack}
              <button
                type="button"
                onClick={() => onRemoveCustomStack(stack)}
                aria-label={`Remove ${stack}`}
                className="rounded-full text-green-200 hover:text-white"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {recommendedOptions.length > 0 ? (
        <section className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/5 p-3">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-green-300">
            Recommended first
          </h3>
          <div className="flex flex-wrap gap-2 sm:grid sm:gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedOptions.map((option) => (
              <SelectableCard
                key={option.id}
                label={option.label}
                selected={selectedStacks.includes(option.label)}
                onToggle={() => onToggleStack(option.label)}
                compact
              />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-6 max-h-[28rem] overflow-y-auto rounded-2xl border border-[#3F3F46]/55 bg-[#09090B]/40 p-3 pr-2">
        <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-zinc-500">
          Browse all technologies
        </h3>
        <div className="grid gap-4">
        {Object.entries(groupedOptions).map(([category, options]) => (
          <section
            key={category}
            className="rounded-xl border border-[#3F3F46]/45 bg-[#18181B]/70 p-3"
          >
            <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-zinc-500">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2 sm:grid sm:gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {options.map((option) => (
                <SelectableCard
                  key={option.id}
                  label={option.label}
                  selected={selectedStacks.includes(option.label)}
                  onToggle={() => onToggleStack(option.label)}
                  compact
                />
              ))}
            </div>
          </section>
        ))}
        </div>
      </div>

      {Object.keys(groupedOptions).length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[#3F3F46]/60 bg-[#09090B]/60 p-5 text-sm text-zinc-400">
          No stack options found. Add a custom technology or try another search.
        </div>
      ) : null}
    </motion.div>
  );
}
