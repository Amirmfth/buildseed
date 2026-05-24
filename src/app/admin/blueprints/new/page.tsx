import { createBlueprint } from "@/app/admin/blueprints/actions";
import { BlueprintEditor } from "@/components/admin/BlueprintEditor";
import { projectIdeas } from "@/data/projectIdeas";
import { enrichBlueprint } from "@/lib/blueprints/enrichBlueprint";

export default function NewBlueprintPage() {
  const template = enrichBlueprint({
    ...projectIdeas[0],
    id: "",
    slug: "new-blueprint",
    title: "New Blueprint",
    shortDescription: "A concise summary of the project blueprint.",
    longDescription:
      "Describe who this project is for, what it teaches, and what the finished build should demonstrate.",
  });

  return (
    <div>
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
          New Blueprint
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Create blueprint
        </h2>
      </div>
      <BlueprintEditor initialBlueprint={template} action={createBlueprint} />
    </div>
  );
}
