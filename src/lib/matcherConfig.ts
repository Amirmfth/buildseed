import type { EstimatedTime, SkillLevel } from "@/lib/types";

export const difficultyRank: Record<SkillLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  "Portfolio-grade": 4,
  "Startup-style MVP": 5,
};

export const timeRank: Record<EstimatedTime, number> = {
  "Weekend project": 1,
  "1 week": 2,
  "2-3 weeks": 3,
  "1 month": 4,
  "Long-term project": 5,
};

export const matcherWeights = {
  maxScore: 150,
  developerFieldPerMatch: 18,
  developerFieldMax: 34,
  stackPerMatch: 10,
  stackMax: 35,
  customStackWeakMatch: 7,
  customStackMax: 18,
  goal: 25,
  category: 22,
  timeMax: 14,
  timePenaltyPerStep: 5,
  featurePerMatch: 5,
  featureMax: 18,
  suitableDifficultyBonus: 6,
  oneLevelStretchPenalty: 4,
  hardStretchPenaltyPerLevel: 12,
  buildabilityBonus: 1.5,
  learningBonus: 1,
  portfolioBonus: 0.8,
};
