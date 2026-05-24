import type { ComplexityBreakdown, ProjectIdea } from "@/lib/types";

export function BlueprintChallengesTab({ blueprint }: { blueprint: ProjectIdea }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-5">
        <List title="Real-world challenges" items={blueprint.realWorldChallenges} />
        <List title="Common mistakes" items={blueprint.commonMistakes} />
      </div>
      <aside className="rounded-2xl border border-[#3F3F46]/60 bg-[#18181B] p-4">
        <h3 className="text-lg font-semibold text-zinc-50">Complexity</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Use this breakdown to decide where to spend more planning time before implementation.
        </p>
        <div className="mt-4 grid gap-3">
          {Object.entries(blueprint.complexity).map(([label, value]) => (
            <Complexity key={label} label={label as keyof ComplexityBreakdown} value={value} />
          ))}
        </div>
      </aside>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-[#3F3F46]/60 bg-[#18181B] p-4">
      <h3 className="text-lg font-semibold text-zinc-50">{title}</h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

function Complexity({ label, value }: { label: keyof ComplexityBreakdown; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between font-mono text-xs uppercase text-zinc-500">
        <span>{label}</span>
        <span>{value}/10</span>
      </div>
      <div className="h-2 rounded-full bg-[#27272A]">
        <div
          className="h-2 rounded-full bg-green-500 shadow-[0_0_16px_rgba(34,197,94,0.22)]"
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );
}
