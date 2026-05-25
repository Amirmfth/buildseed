import type { ProjectIdea } from "@/lib/types";

export function BlueprintBuildPlanTab({ blueprint }: { blueprint: ProjectIdea }) {
  return (
    <div className="grid min-w-0 gap-6 overflow-x-hidden">
      <section className="grid gap-4">
        {blueprint.buildPhases.map((phase, index) => (
          <article
            key={phase.title}
            className="grid gap-3 rounded-2xl border border-[#3F3F46]/60 bg-[#18181B] p-3 sm:gap-4 sm:p-4 sm:grid-cols-[72px_1fr]"
          >
            <div className="grid size-12 place-items-center rounded-xl border border-green-500/30 bg-green-500/10 font-mono text-xs font-semibold text-green-300 sm:size-14 sm:rounded-2xl sm:text-sm">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-cyan-300">
                Phase {index + 1}
              </p>
              <h3 className="mt-1.5 text-base font-semibold text-zinc-50 sm:mt-2 sm:text-lg">
                {phase.title}
              </h3>
              <p className="mt-1.5 break-words text-sm leading-6 text-zinc-400 sm:mt-2">
                {phase.description}
              </p>
              <ul className="mt-3 grid gap-2 text-sm text-zinc-300 sm:mt-4">
                {phase.tasks.map((task) => (
                  <li
                    key={task}
                    className="rounded-xl border border-[#3F3F46]/50 bg-[#09090B]/60 px-3 py-2"
                  >
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
      <section className="min-w-0 rounded-2xl border border-[#3F3F46]/60 bg-[#18181B] p-4 sm:p-5">
        <h3 className="text-lg font-semibold text-zinc-50">Feature flow</h3>
        <div className="scrollbar-hidden mt-3 flex w-full gap-2 overflow-x-auto pb-2">
          {blueprint.featureFlow.map((edge) => (
            <div
              key={`${edge.from}-${edge.to}`}
              className="min-w-[13rem] max-w-[14rem] shrink-0 rounded-xl border border-[#3F3F46]/60 bg-[#09090B]/60 p-3 text-sm text-zinc-300"
            >
              {edge.from} <span className="text-green-400">-&gt;</span> {edge.to}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
