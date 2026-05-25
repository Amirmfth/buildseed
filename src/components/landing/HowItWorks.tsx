"use client";

import { motion } from "framer-motion";
import { Bot, Compass, FolderKanban, Users } from "lucide-react";

const steps = [
  {
    icon: Compass,
    title: "Match your direction",
    description:
      "Pick your developer field, stack, goals, and available time to get scoped blueprint matches.",
  },
  {
    icon: Bot,
    title: "Refine with AI",
    description:
      "Generate or customize a blueprint with presets and freeform edits while keeping the core plan realistic.",
  },
  {
    icon: FolderKanban,
    title: "Track in workspace",
    description:
      "Start projects from blueprints, track task progress, and manage notes and resources in one workspace.",
  },
  {
    icon: Users,
    title: "Share with community",
    description:
      "Submit your own blueprint and publish it after moderation so others can discover and build it.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
          How it works
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">
          Discover, adapt, and ship with less guesswork.
        </h2>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <motion.article
            key={step.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.26, delay: index * 0.05 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
          >
            <div className="grid size-11 place-items-center rounded-xl border border-green-500/30 bg-green-500/10 text-green-400">
              <step.icon className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-zinc-50">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {step.description}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
