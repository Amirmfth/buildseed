import type { ProjectIdea } from "@/lib/types";

export function BlueprintBuildPlanTab({ blueprint }: { blueprint: ProjectIdea }) {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4">
        {blueprint.buildPhases.map((phase, index) => (
          <article
            key={phase.title}
            className="grid gap-4 rounded-2xl border border-[#3F3F46]/60 bg-[#18181B] p-4 sm:grid-cols-[72px_1fr]"
          >
            <div className="grid size-14 place-items-center rounded-2xl border border-green-500/30 bg-green-500/10 font-mono text-sm font-semibold text-green-300">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-cyan-300">
                Phase {index + 1}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-zinc-50">
                {phase.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {phase.description}
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-zinc-300">
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
      <section className="rounded-2xl border border-[#3F3F46]/60 bg-[#18181B] p-5">
        <h3 className="text-lg font-semibold text-zinc-50">Feature flow</h3>
        <div className="scrollbar-hidden mt-3 flex gap-2 overflow-x-auto pb-2">
          {blueprint.featureFlow.map((edge) => (
            <div
              key={`${edge.from}-${edge.to}`}
              className="min-w-52 rounded-xl border border-[#3F3F46]/60 bg-[#09090B]/60 p-3 text-sm text-zinc-300"
            >
              {edge.from} <span className="text-green-400">-&gt;</span> {edge.to}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
