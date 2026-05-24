import type { ProjectIdea } from "@/lib/types";

export function BlueprintPortfolioTab({ blueprint }: { blueprint: ProjectIdea }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <List title="Portfolio talking points" items={blueprint.portfolioTalkingPoints} />
      <List title="Practical skills" items={blueprint.practicalSkills} />
      <List title="Learning outcomes" items={blueprint.learningOutcomes} />
      <section className="rounded-2xl border border-[#3F3F46]/60 bg-[#18181B] p-4">
        <h3 className="text-lg font-semibold text-zinc-50">Resume impact</h3>
        <div className="mt-3 grid gap-3 text-sm text-zinc-300">
          <p><strong>Junior:</strong> {blueprint.resumeImpact.junior}</p>
          <p><strong>Mid:</strong> {blueprint.resumeImpact.mid}</p>
          <p><strong>Senior:</strong> {blueprint.resumeImpact.senior}</p>
        </div>
      </section>
      <section className="rounded-2xl border border-[#3F3F46]/60 bg-[#18181B] p-4 lg:col-span-2">
        <h3 className="text-lg font-semibold text-zinc-50">Recommended learning</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {blueprint.recommendedLearning.map((item) => (
            <div key={item.title} className="rounded-xl border border-[#3F3F46]/50 bg-[#09090B]/60 p-3">
              <p className="font-medium text-zinc-200">{item.title}</p>
              <p className="mt-1 text-sm text-zinc-500">{item.topic}</p>
            </div>
          ))}
        </div>
      </section>
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
