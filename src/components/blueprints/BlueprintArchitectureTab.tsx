import type { BlueprintArchitecture, ProjectIdea } from "@/lib/types";

const architectureKeys: (keyof BlueprintArchitecture)[] = [
  "frontend",
  "backend",
  "database",
  "infrastructure",
  "integrations",
  "security",
];

export function BlueprintArchitectureTab({ blueprint }: { blueprint: ProjectIdea }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-2xl border border-[#3F3F46]/60 bg-[#18181B] p-4">
        <h3 className="text-lg font-semibold text-zinc-50">Architecture overview</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{blueprint.architecture.overview}</p>
        <div className="mt-4 grid gap-3">
          {architectureKeys.map((key) => {
            const values = blueprint.architecture[key];
            if (!Array.isArray(values)) return null;
            return (
              <div key={key}>
                <h4 className="font-mono text-xs uppercase text-zinc-500">{key}</h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-300">
                  {values.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
      <section className="rounded-2xl border border-[#3F3F46]/60 bg-[#09090B]/70 p-4">
        <h3 className="text-lg font-semibold text-zinc-50">{blueprint.suggestedStructure.label}</h3>
        <pre className="scrollbar-hidden mt-3 overflow-x-auto rounded-xl bg-black/30 p-4 font-mono text-xs leading-6 text-zinc-300">
          {blueprint.suggestedStructure.tree.join("\n")}
        </pre>
      </section>
    </div>
  );
}
