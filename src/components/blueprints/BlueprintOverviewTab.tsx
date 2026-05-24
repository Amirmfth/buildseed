import type { ProjectIdea } from "@/lib/types";

export function BlueprintOverviewTab({ blueprint }: { blueprint: ProjectIdea }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-[#3F3F46]/60 bg-[#18181B] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-green-300">
            Project thesis
          </p>
          <h3 className="mt-2 text-xl font-semibold text-zinc-50">
            Why it matters
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {blueprint.whyThisProjectMatters}
          </p>
        </section>
        <section className="rounded-2xl border border-[#3F3F46]/60 bg-[#18181B] p-5">
          <h3 className="text-lg font-semibold text-zinc-50">Inspired by</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {blueprint.inspiredBy.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#3F3F46] bg-[#09090B] px-3 py-1 text-sm text-zinc-300"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-[#3F3F46]/60 bg-[#18181B] p-5">
          <h3 className="text-lg font-semibold text-zinc-50">Time distribution</h3>
          <div className="mt-3 grid gap-3">
            {blueprint.timeDistribution.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between font-mono text-xs text-zinc-500">
                  <span>{item.label}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#27272A]">
                  <div
                    className="h-2 rounded-full bg-green-500 shadow-[0_0_16px_rgba(34,197,94,0.25)]"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <aside className="rounded-2xl border border-[#3F3F46]/60 bg-[#09090B]/60 p-5">
        <h3 className="font-mono text-xs uppercase text-zinc-500">Metadata</h3>
        <dl className="mt-4 grid gap-3 text-sm">
          <Meta label="Difficulty" value={blueprint.difficulty} />
          <Meta label="Time" value={blueprint.estimatedTime} />
          <Meta label="Portfolio" value={`${blueprint.portfolioValue}/10`} />
          <Meta label="Learning" value={`${blueprint.learningValue}/10`} />
          <Meta label="Buildability" value={`${blueprint.buildability}/10`} />
          <Meta label="Market" value={`${blueprint.marketPotential}/10`} />
        </dl>
      </aside>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#3F3F46]/45 bg-[#18181B]/70 p-3">
      <dt className="font-mono text-xs uppercase text-zinc-500">{label}</dt>
      <dd className="mt-1 text-zinc-200">{value}</dd>
    </div>
  );
}
