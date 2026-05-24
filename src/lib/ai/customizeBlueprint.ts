import {
  normalizeGeneratedBlueprint,
  safeSlug,
  validateGeneratedBlueprint,
} from "@/lib/ai/blueprintSchema";
import type { ProjectIdea, SurveyAnswers } from "@/lib/types";

export function surveyAnswersFromBlueprint(blueprint: ProjectIdea): SurveyAnswers {
  return {
    developerFields: blueprint.developerFields,
    stacks: blueprint.stacks,
    customStacks: [],
    skillLevel: blueprint.difficulty,
    goal: blueprint.goals[0],
    category: blueprint.categories[0],
    availableTime: blueprint.estimatedTime,
    features: blueprint.features,
  };
}

export function normalizeCustomizedBlueprint(input: {
  value: unknown;
  baseBlueprint: ProjectIdea;
  answers?: SurveyAnswers | null;
}) {
  const answers = input.answers ?? surveyAnswersFromBlueprint(input.baseBlueprint);
  const normalized = normalizeGeneratedBlueprint(input.value, answers);
  const parsed = validateGeneratedBlueprint(normalized);
  const slug = safeSlug(parsed.slug || parsed.title);

  return {
    ...parsed,
    id: `ai-custom-${input.baseBlueprint.id}-${slug}`,
    slug,
    generated: true,
    customized: true,
    source: "ai",
    matchType: "ai",
    baseBlueprintId: input.baseBlueprint.id,
  } satisfies ProjectIdea;
}
