import type { SurveyAnswers } from "@/lib/types";

export function buildBlueprintPrompt(answers: SurveyAnswers) {
  const skillLevel = answers.skillLevel ?? "Any appropriate difficulty";
  const goal = answers.goal ?? "Any suitable project goal";
  const category = answers.category ?? "Any suitable project category";
  const availableTime = answers.availableTime ?? "Any realistic timeframe";
  const features =
    answers.features.length > 0
      ? answers.features.join(", ")
      : "Any useful implementation features";

  return `Generate one original developer project blueprint as strict JSON only.

The blueprint must exactly follow these survey answers:
- Developer fields: ${answers.developerFields.join(", ")}
- Tech stack: ${answers.stacks.join(", ")}
- Custom stack additions: ${answers.customStacks.join(", ") || "None"}
- Skill level: ${skillLevel}
- Project goal: ${goal}
- Project category: ${category}
- Available time: ${availableTime}
- Features to practice: ${features}

Return JSON with exactly these keys:
title, slug, shortDescription, longDescription, developerFields, categories, goals, stacks, difficulty, estimatedTime, features, portfolioValue, learningValue, buildability, uniqueness, marketPotential, coreFeatures, stretchFeatures, learningOutcomes, recommendedStack.

Rules:
- JSON only. No markdown fences.
- Scores must be numbers from 1 to 10.
- Even when a survey answer says "Any", you must still choose and return one valid concrete value for difficulty and estimatedTime.
- Even when goal/category/features were skipped, you must still return non-empty goals, categories, and features arrays.
- coreFeatures must have at least 4 items.
- stretchFeatures must have at least 3 items.
- learningOutcomes must have at least 3 items.
- Keep scope realistic for the available time.
- Include custom stack additions in stacks or recommendedStack when appropriate.`;
}
