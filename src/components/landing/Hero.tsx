"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Clock, Code2, Layers3, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const heroStats = [
  ["250+", "blueprints"],
  ["15", "developer fields"],
  ["180+", "technologies"],
  ["Local-first", "matching"],
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#3F3F46]/35">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_0%,rgba(34,197,94,0.15),transparent_30%),radial-gradient(circle_at_85%_22%,rgba(6,182,212,0.08),transparent_28%),linear-gradient(180deg,rgba(9,9,11,0),#09090B_90%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.88fr_1fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#3F3F46]/70 bg-[#18181B]/80 px-3 py-1 text-sm text-zinc-300 shadow-[0_10px_30px_rgba(0,0,0,0.24)]">
            <Sparkles className="size-4 text-green-400" />
            Grow better project ideas.
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
            Find your next project.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
            BuildSeed matches developers across web, mobile, AI, data, cloud,
            game development, security, and more with realistic project
            blueprints based on their stack, goals, and available time.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-xl bg-green-500 px-5 text-zinc-950 hover:bg-green-600"
            >
              <a href="#project-match">
                Start Project Match
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-xl border-zinc-700 bg-zinc-900/80 px-5 text-zinc-100 hover:bg-zinc-800"
            >
              <a href="/blueprints">Browse Blueprints</a>
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {heroStats.map(([value, label], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 + index * 0.06 }}
                className="rounded-2xl border border-[#3F3F46]/55 bg-[#18181B]/70 p-3"
              >
                <p className="text-xl font-semibold text-zinc-50">{value}</p>
                <p className="mt-1 font-mono text-[11px] uppercase text-zinc-500">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-2xl border border-[#3F3F46]/65 bg-[#18181B] shadow-[0_28px_90px_rgba(0,0,0,0.42)]">
            <Image
              src="/buildseed_hero.png"
              alt="BuildSeed project matching dashboard preview"
              width={1100}
              height={760}
              className="h-auto w-full border-b border-[#3F3F46]/45 object-cover"
              priority
            />
          </div>

          <div className="mx-auto -mt-8 w-[92%] rounded-2xl border border-[#3F3F46]/70 bg-[#18181B]/95 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.42)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase text-zinc-500">
                  Current match
                </p>
                <h2 className="mt-1 text-lg font-semibold text-zinc-50">
                  Cross-field blueprint library
                </h2>
              </div>
              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-lg font-semibold text-green-400">
                94%
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["Mobile", "AI / ML", "Cloud", "Game", "Security"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#3F3F46] bg-[#27272A] px-3 py-1 font-mono text-xs text-zinc-300"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>

            <div className="mt-6 grid gap-3">
              <HeroMetric
                icon={<Code2 className="size-4" />}
                label="Goal"
                value="Portfolio-grade project blueprint"
              />
              <HeroMetric
                icon={<Clock className="size-4" />}
                label="Scope"
                value="Weekend to long-term project paths"
              />
              <HeroMetric
                icon={<Layers3 className="size-4" />}
                label="Practice"
                value="Stacks, features, and field-specific workflows"
              />
            </div>

            <div className="mt-6 grid grid-cols-4 gap-2 text-center font-mono text-[11px] text-zinc-500">
              {["Stack", "Goal", "Scope", "Blueprint"].map((item, index) => (
                <motion.div
                  key={item}
                  animate={{ opacity: [0.55, 1, 0.55] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    delay: index * 0.28,
                  }}
                  className="rounded-full border border-[#3F3F46]/60 bg-[#09090B]/60 px-2 py-1"
                >
                  {item}
                </motion.div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
              <p className="font-mono text-xs uppercase text-cyan-300">
                Blueprint preview
              </p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li>1. Pick your developer field.</li>
                <li>2. Choose contextual stack options.</li>
                <li>3. Open a buildable project blueprint.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#3F3F46]/60 bg-[#27272A]/70 p-3">
      <div className="grid size-9 place-items-center rounded-xl bg-[#18181B] text-cyan-300">
        {icon}
      </div>
      <div>
        <p className="font-mono text-[11px] uppercase text-zinc-500">{label}</p>
        <p className="text-sm font-medium text-zinc-200">{value}</p>
      </div>
    </div>
  );
}
