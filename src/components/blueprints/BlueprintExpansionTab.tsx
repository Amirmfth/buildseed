import type { ProjectIdea } from "@/lib/types";

export function BlueprintExpansionTab({ blueprint }: { blueprint: ProjectIdea }) {
  return (
    <div className="grid gap-5">
      <section className="grid gap-3 md:grid-cols-2">
        {blueprint.scopeTiers.map((tier) => (
          <article key={tier.tier} className="rounded-2xl border border-[#3F3F46]/60 bg-[#18181B] p-4">
            <p className="font-mono text-xs uppercase text-cyan-300">{tier.tier}</p>
            <h3 className="mt-2 text-lg font-semibold text-zinc-50">{tier.title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{tier.description}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-300">
              {tier.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          </article>
        ))}
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        <Team title="Solo" items={blueprint.teamExpansion.solo} />
        <Team title="Team of 2" items={blueprint.teamExpansion.teamOf2} />
        <Team title="Team of 4" items={blueprint.teamExpansion.teamOf4} />
      </section>
      <section className="grid gap-3 md:grid-cols-2">
        <List title="AI build suggestions" items={blueprint.aiBuildSuggestions} />
        {blueprint.monetizationIdeas ? <List title="Monetization ideas" items={blueprint.monetizationIdeas} /> : null}
      </section>
    </div>
  );
}

function Team({ title, items }: { title: string; items: string[] }) {
  return <List title={title} items={items} />;
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-2xl border border-[#3F3F46]/60 bg-[#18181B] p-4">
      <h3 className="text-lg font-semibold text-zinc-50">{title}</h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
  );
}
