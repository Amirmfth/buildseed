import { Boxes, Route, WandSparkles } from "lucide-react";

const steps = [
  {
    icon: Boxes,
    title: "Choose your stack",
    description:
      "Select the frameworks, databases, and UI tools you want to use.",
  },
  {
    icon: Route,
    title: "Define your goal",
    description:
      "Tell BuildSeed whether this is for a portfolio, job search, MVP, or learning path.",
  },
  {
    icon: WandSparkles,
    title: "Get buildable ideas",
    description:
      "Receive scoped project matches with blueprints, features, and learning outcomes.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
          How it works
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">
          From vague idea to realistic scope.
        </h2>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
          >
            <div className="grid size-11 place-items-center rounded-xl border border-green-500/30 bg-green-500/10 text-green-400">
              <step.icon className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-zinc-50">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
