import type { EstimatedTime, ProjectIdea, SkillLevel } from "@/lib/types";

const validDifficulties: SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Portfolio-grade",
  "Startup-style MVP",
];

const validTimes: EstimatedTime[] = [
  "Weekend project",
  "1 week",
  "2-3 weeks",
  "1 month",
  "Long-term project",
];

const requiredScopeTiers = [
  "mini",
  "standard",
  "portfolio",
  "production",
] as const;

export function validateBlueprints(blueprints: ProjectIdea[]) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const blueprint of blueprints) {
    if (ids.has(blueprint.id)) errors.push(`Duplicate id: ${blueprint.id}`);
    if (slugs.has(blueprint.slug)) errors.push(`Duplicate slug: ${blueprint.slug}`);
    ids.add(blueprint.id);
    slugs.add(blueprint.slug);

    for (const key of ["id", "slug", "title", "shortDescription", "longDescription"] as const) {
      if (!blueprint[key]) errors.push(`${blueprint.id || "unknown"} missing ${key}`);
    }

    if (!validDifficulties.includes(blueprint.difficulty)) {
      errors.push(`${blueprint.id} has invalid difficulty`);
    }

    if (!validTimes.includes(blueprint.estimatedTime)) {
      errors.push(`${blueprint.id} has invalid estimated time`);
    }

    if (blueprint.developerFields.length < 1) {
      errors.push(`${blueprint.id} needs at least one developer field`);
    }

    if (blueprint.stacks.length < 1) {
      errors.push(`${blueprint.id} needs at least one stack`);
    }

    if (blueprint.coreFeatures.length < 3) {
      errors.push(`${blueprint.id} needs at least three core features`);
    }

    if (blueprint.learningOutcomes.length < 2) {
      errors.push(`${blueprint.id} needs at least two learning outcomes`);
    }

    if (blueprint.buildPhases.length < 4) {
      errors.push(`${blueprint.id} needs at least four build phases`);
    }

    for (const phase of blueprint.buildPhases) {
      if (phase.tasks.length < 3) {
        errors.push(`${blueprint.id} phase "${phase.title}" needs at least three tasks`);
      }
    }

    const tiers = new Set(blueprint.scopeTiers.map((tier) => tier.tier));
    for (const tier of requiredScopeTiers) {
      if (!tiers.has(tier)) errors.push(`${blueprint.id} missing ${tier} scope tier`);
    }

    for (const [key, value] of Object.entries(blueprint.complexity)) {
      if (value < 1 || value > 10) {
        errors.push(`${blueprint.id} complexity ${key} must be 1-10`);
      }
    }

    const timeTotal = blueprint.timeDistribution.reduce(
      (total, item) => total + item.percentage,
      0
    );
    if (timeTotal < 95 || timeTotal > 105) {
      errors.push(`${blueprint.id} time distribution should total near 100`);
    }

    if (!["curated", "ai", undefined].includes(blueprint.source)) {
      errors.push(`${blueprint.id} has invalid source`);
    }

    const richChecks: [keyof ProjectIdea, number][] = [
      ["realWorldChallenges", 4],
      ["portfolioTalkingPoints", 4],
      ["practicalSkills", 4],
      ["commonMistakes", 4],
      ["recommendedLearning", 4],
      ["inspiredBy", 2],
      ["timeDistribution", 4],
      ["aiBuildSuggestions", 4],
      ["featureFlow", 4],
    ];

    for (const [key, minimum] of richChecks) {
      const value = blueprint[key];
      if (!Array.isArray(value) || value.length < minimum) {
        errors.push(`${blueprint.id} ${key} needs at least ${minimum} items`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
