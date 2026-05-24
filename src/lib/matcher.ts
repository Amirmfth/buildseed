import type {
  ProjectIdea,
  ProjectMatch,
  SurveyAnswers,
} from "@/lib/types";
import { difficultyRank, matcherWeights, timeRank } from "@/lib/matcherConfig";
import { relatedDeveloperFields } from "@/data/techStacks";

export function matchProjects(
  answers: SurveyAnswers,
  ideas: ProjectIdea[],
  limit = 6
): ProjectMatch[] {
  const scored = ideas
    .map((idea) => scoreProject(idea, answers))
    .sort((a, b) => b.score - a.score);

  return pickStagedMatches(scored, answers, limit);
}

function scoreProject(idea: ProjectIdea, answers: SurveyAnswers): ProjectMatch {
  let score = 0;
  const matchReasons: string[] = [];

  const fieldMatches = getMatches(idea.developerFields, answers.developerFields);
  if (fieldMatches.length > 0) {
    score += cappedScore(
      fieldMatches.length,
      matcherWeights.developerFieldPerMatch,
      matcherWeights.developerFieldMax
    );
    matchReasons.push(`Fits your ${fieldMatches.slice(0, 2).join(", ")} focus`);
  }

  const stackMatches = getMatches(idea.stacks, answers.stacks);
  if (stackMatches.length > 0) {
    score += cappedScore(
      stackMatches.length,
      matcherWeights.stackPerMatch,
      matcherWeights.stackMax
    );
    matchReasons.push(
      `Uses ${stackMatches.slice(0, 3).join(", ")} from your stack`
    );
  }

  const customMatches = getCustomStackMatches(idea, answers.customStacks);
  if (customMatches.length > 0) {
    score += cappedScore(
      customMatches.length,
      matcherWeights.customStackWeakMatch,
      matcherWeights.customStackMax
    );
    matchReasons.push(
      `Also relates to ${customMatches.slice(0, 2).join(", ")}`
    );
  }

  if (answers.goal && idea.goals.includes(answers.goal)) {
    score += matcherWeights.goal;
    matchReasons.push(`Strong fit for ${answers.goal.toLowerCase()}`);
  }

  if (answers.category && idea.categories.includes(answers.category)) {
    score += matcherWeights.category;
    matchReasons.push(`Matches ${answers.category.toLowerCase()}`);
  }

  if (answers.availableTime) {
    const delta = Math.abs(
      timeRank[idea.estimatedTime] - timeRank[answers.availableTime]
    );
    score += Math.max(
      0,
      matcherWeights.timeMax - delta * matcherWeights.timePenaltyPerStep
    );
    if (delta === 0) {
      matchReasons.push(`Fits your ${answers.availableTime.toLowerCase()}`);
    }
  }

  const featureMatches = getMatches(idea.features, answers.features);
  if (featureMatches.length > 0) {
    score += cappedScore(
      featureMatches.length,
      matcherWeights.featurePerMatch,
      matcherWeights.featureMax
    );
    matchReasons.push(
      `Practices ${featureMatches.slice(0, 3).join(", ").toLowerCase()}`
    );
  }

  score += difficultyAdjustment(idea, answers, matchReasons);
  score += idea.buildability * matcherWeights.buildabilityBonus;
  score += idea.learningValue * matcherWeights.learningBonus;
  score += idea.portfolioValue * matcherWeights.portfolioBonus;

  const finalScore = Math.max(0, Math.round(score));

  return {
    idea,
    score: finalScore,
    percentage: scoreToPercentage(finalScore),
    matchReasons: matchReasons.slice(0, 4),
    selectedCustomStacks: answers.customStacks,
    matchType: getMatchType(idea, answers, finalScore),
  };
}

function pickStagedMatches(
  scored: ProjectMatch[],
  answers: SurveyAnswers,
  limit: number
) {
  const selected: ProjectMatch[] = [];
  const seen = new Set<string>();

  const stages = [
    (match: ProjectMatch) =>
      hasExactField(match.idea, answers) &&
      (matchesGoal(match.idea, answers) || matchesCategory(match.idea, answers)),
    (match: ProjectMatch) =>
      hasExactField(match.idea, answers) &&
      (matchesDifficulty(match.idea, answers) || matchesTime(match.idea, answers)),
    (match: ProjectMatch) => hasRelatedField(match.idea, answers),
    (match: ProjectMatch) =>
      matchesGoal(match.idea, answers) || matchesCategory(match.idea, answers),
    (match: ProjectMatch) => match.idea.portfolioValue >= 8 || match.idea.buildability >= 8,
  ];

  for (const stage of stages) {
    for (const match of scored.filter(stage)) {
      if (selected.length >= limit) return selected;
      if (!seen.has(match.idea.id)) {
        selected.push(match);
        seen.add(match.idea.id);
      }
    }
  }

  for (const match of scored) {
    if (selected.length >= limit) return selected;
    if (!seen.has(match.idea.id)) {
      selected.push(match);
      seen.add(match.idea.id);
    }
  }

  return selected;
}

function getMatchType(
  idea: ProjectIdea,
  answers: SurveyAnswers,
  score: number
): ProjectMatch["matchType"] {
  if (hasExactField(idea, answers) && score >= 70) return "strong";
  if (hasExactField(idea, answers) || hasRelatedField(idea, answers)) return "related";
  return "discovery";
}

function hasExactField(idea: ProjectIdea, answers: SurveyAnswers) {
  return answers.developerFields.some((field) => idea.developerFields.includes(field));
}

function hasRelatedField(idea: ProjectIdea, answers: SurveyAnswers) {
  const related = new Set(
    answers.developerFields.flatMap((field) => relatedDeveloperFields[field] ?? [])
  );
  return idea.developerFields.some((field) => related.has(field));
}

function matchesGoal(idea: ProjectIdea, answers: SurveyAnswers) {
  return Boolean(answers.goal && idea.goals.includes(answers.goal));
}

function matchesCategory(idea: ProjectIdea, answers: SurveyAnswers) {
  return Boolean(answers.category && idea.categories.includes(answers.category));
}

function matchesDifficulty(idea: ProjectIdea, answers: SurveyAnswers) {
  return Boolean(answers.skillLevel && idea.difficulty === answers.skillLevel);
}

function matchesTime(idea: ProjectIdea, answers: SurveyAnswers) {
  return Boolean(answers.availableTime && idea.estimatedTime === answers.availableTime);
}

function difficultyAdjustment(
  idea: ProjectIdea,
  answers: SurveyAnswers,
  matchReasons: string[]
) {
  if (!answers.skillLevel) return 0;

  const gap = difficultyRank[idea.difficulty] - difficultyRank[answers.skillLevel];

  if (gap <= 0) return matcherWeights.suitableDifficultyBonus;

  // A one-level stretch can be useful, but larger gaps usually hurt completion.
  if (gap === 1) {
    matchReasons.push("Slight stretch for your current level");
    return -matcherWeights.oneLevelStretchPenalty;
  }

  return -(gap * matcherWeights.hardStretchPenaltyPerLevel);
}

function getMatches<T>(projectValues: T[], selectedValues: T[]) {
  return projectValues.filter((value) => selectedValues.includes(value));
}

function getCustomStackMatches(idea: ProjectIdea, customStacks: string[]) {
  const searchableText = [
    ...idea.stacks,
    ...idea.recommendedStack,
    ...idea.features,
    ...idea.categories,
    idea.title,
    idea.shortDescription,
  ]
    .join(" ")
    .toLowerCase();

  return customStacks.filter((stack) => {
    const value = stack.trim().toLowerCase();
    return value.length > 1 && searchableText.includes(value);
  });
}

function cappedScore(matchCount: number, perMatch: number, max: number) {
  return Math.min(matchCount * perMatch, max);
}

function scoreToPercentage(score: number) {
  return Math.min(
    98,
    Math.max(42, Math.round((score / matcherWeights.maxScore) * 100))
  );
}

export function generateBlueprint(idea: ProjectIdea, customStacks: string[] = []) {
  const customStackSection =
    customStacks.length > 0
      ? `\n\n## Your custom stack additions\n${customStacks
          .map((item) => `- ${item}`)
          .join("\n")}`
      : "";

  return `# ${idea.title}

## Description
${idea.longDescription}

## Why this project matters
${idea.whyThisProjectMatters}

## Metadata
- Developer fields: ${idea.developerFields.join(", ")}
- Difficulty: ${idea.difficulty}
- Estimated time: ${idea.estimatedTime}
- Categories: ${idea.categories.join(", ")}
- Goals: ${idea.goals.join(", ")}

## Recommended stack
${idea.recommendedStack.map((item) => `- ${item}`).join("\n")}
${customStackSection}

## Scores
- Portfolio value: ${idea.portfolioValue}/10
- Learning value: ${idea.learningValue}/10
- Buildability: ${idea.buildability}/10
- Uniqueness: ${idea.uniqueness}/10
- Market potential: ${idea.marketPotential}/10

## Core features
${idea.coreFeatures.map((item) => `- ${item}`).join("\n")}

## Stretch features
${idea.stretchFeatures.map((item) => `- ${item}`).join("\n")}

## Build phases
${idea.buildPhases
  .map(
    (phase, index) => `### ${index + 1}. ${phase.title}
${phase.description}

${phase.tasks.map((task) => `- ${task}`).join("\n")}`
  )
  .join("\n\n")}

## Architecture
${idea.architecture.overview}

${formatArchitectureSection("Frontend", idea.architecture.frontend)}
${formatArchitectureSection("Backend", idea.architecture.backend)}
${formatArchitectureSection("Database", idea.architecture.database)}
${formatArchitectureSection("Infrastructure", idea.architecture.infrastructure)}
${formatArchitectureSection("Integrations", idea.architecture.integrations)}
${formatArchitectureSection("Security", idea.architecture.security)}

## Scope tiers
${idea.scopeTiers
  .map(
    (tier) => `### ${tier.title}
${tier.description}

${tier.features.map((feature) => `- ${feature}`).join("\n")}`
  )
  .join("\n\n")}

## Portfolio talking points
${idea.portfolioTalkingPoints.map((item) => `- ${item}`).join("\n")}

## Practical skills
${idea.practicalSkills.map((item) => `- ${item}`).join("\n")}

## Learning outcomes
${idea.learningOutcomes.map((item) => `- ${item}`).join("\n")}

## Real-world challenges
${idea.realWorldChallenges.map((item) => `- ${item}`).join("\n")}

## Common mistakes
${idea.commonMistakes.map((item) => `- ${item}`).join("\n")}

## Suggested folder structure
\`\`\`
${idea.suggestedStructure.tree.join("\n")}
\`\`\`

## Resume impact
- Junior: ${idea.resumeImpact.junior}
- Mid: ${idea.resumeImpact.mid}
- Senior: ${idea.resumeImpact.senior}

## Team expansion
### Solo
${idea.teamExpansion.solo.map((item) => `- ${item}`).join("\n")}

### Team of 2
${idea.teamExpansion.teamOf2.map((item) => `- ${item}`).join("\n")}

### Team of 4
${idea.teamExpansion.teamOf4.map((item) => `- ${item}`).join("\n")}

${idea.monetizationIdeas?.length ? `## Monetization ideas\n${idea.monetizationIdeas.map((item) => `- ${item}`).join("\n")}` : ""}`;
}

function formatArchitectureSection(label: string, items?: string[]) {
  if (!items?.length) return "";
  return `### ${label}\n${items.map((item) => `- ${item}`).join("\n")}\n`;
}
