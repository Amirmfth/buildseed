import Image from "next/image";
import { ArrowRight, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buttonClasses, surfaceClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";

const links = [
  { href: "/project-match", label: "Project Match" },
  { href: "/blueprints", label: "Browse Blueprints" },
  { href: "/community", label: "Community" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#3F3F46]/45 bg-[#09090B]">
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className={cn("rounded-2xl p-6 sm:p-8", surfaceClasses.elevated)}>
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#3F3F46]/70 bg-[#18181B] px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-cyan-300">
                <Compass className="size-3.5" />
                BuildSeed
              </div>
              <h2 className="mt-4 max-w-3xl text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
                Stop collecting random ideas. Start building the right one.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                BuildSeed helps you discover project blueprints with realistic scope, strong learning outcomes, and practical stack fit.
              </p>
            </div>
            <Button asChild className={cn("h-11 px-5", buttonClasses.primary)}>
              <a href="/project-match">
                Find My Project
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 border-t border-[#3F3F46]/45 pt-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex items-center gap-2 text-zinc-300">
            <Image
              src="/buildseed_logo.png"
              alt=""
              width={20}
              height={20}
              className="size-5 rounded-md"
            />
            <span className="font-medium">BuildSeed</span>
            <span className="text-zinc-500">Grow better developer project ideas.</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-zinc-100">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </footer>
  );
}
