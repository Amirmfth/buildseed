import type { ProjectIdea, SurveyAnswers } from "@/lib/types";

export function buildCustomizeBlueprintPrompt(input: {
  blueprint: ProjectIdea;
  request: string;
  presetInstructions?: string[];
  answers?: SurveyAnswers | null;
}) {
  return `Customize this BuildSeed project blueprint.

Rules:
- Preserve the useful parts of the original blueprint unless the user asks to change them.
- Apply the user's requested changes exactly where reasonable.
- Keep the scope realistic for the selected difficulty and estimated time.
- Return JSON only. Do not include markdown fences or commentary.
- The JSON must match the full ProjectIdea shape, including all rich planning fields.
- Keep arrays populated with specific, non-generic content.
- Include at least 4 buildPhases with at least 3 tasks each.
- Include all scope tiers: mini, standard, portfolio, production.
- Include at least 4 realWorldChallenges, portfolioTalkingPoints, practicalSkills, commonMistakes, recommendedLearning, aiBuildSuggestions, and featureFlow edges.
- Complexity values must be 1 to 10.
- timeDistribution percentages should total about 100.

User customization request:
${input.request}

Selected preset instructions:
${input.presetInstructions?.length ? input.presetInstructions.join("\n") : "None"}

Survey context, if available:
${JSON.stringify(input.answers ?? null, null, 2)}

Original blueprint:
${JSON.stringify(input.blueprint, null, 2)}
`;
}
