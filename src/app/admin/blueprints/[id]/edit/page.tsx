import { notFound } from "next/navigation";

import { updateBlueprint } from "@/app/admin/blueprints/actions";
import { BlueprintEditor } from "@/components/admin/BlueprintEditor";
import { dbBlueprintToProjectIdea } from "@/lib/blueprints/dbMapper";
import { prisma } from "@/lib/prisma";

export default async function EditBlueprintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await prisma.blueprint.findUnique({ where: { id } });

  if (!row) notFound();

  const blueprint = dbBlueprintToProjectIdea(row);

  return (
    <div>
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
          Edit Blueprint
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          {blueprint.title}
        </h2>
      </div>
      <BlueprintEditor
        initialBlueprint={blueprint}
        status={row.status}
        source={row.source}
        featured={row.featured}
        action={updateBlueprint}
      />
    </div>
  );
}
