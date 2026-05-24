import { ArrowRight, Sprout } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buttonClasses, surfaceClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t border-[#3F3F46]/45">
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className={cn("rounded-2xl p-6 sm:p-8", surfaceClasses.elevated)}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-50">
                Stop collecting random ideas. Start building the right one.
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                BuildSeed keeps project discovery practical, scoped, and stack-aware.
              </p>
            </div>
            <Button
              asChild
              className={cn("h-12 px-5", buttonClasses.primary)}
            >
              <a href="#project-match">
                Find My Project
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-zinc-900 pt-6 text-sm text-zinc-500 sm:flex-row">
          <div className="flex items-center gap-2 text-zinc-300">
            <Sprout className="size-4 text-green-400" />
            BuildSeed
          </div>
          <p>Grow better project ideas.</p>
        </div>
      </section>
    </footer>
  );
}
