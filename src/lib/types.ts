export type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Portfolio-grade"
  | "Startup-style MVP";

export type ProjectGoal =
  | "Portfolio"
  | "Job application"
  | "Learning a new stack"
  | "SaaS idea"
  | "Freelance case study"
  | "Open-source project"
  | "Hackathon"
  | "Personal tool";

export type ProjectCategory =
  | "Frontend"
  | "Backend"
  | "Full-stack"
  | "AI tool"
  | "Dashboard"
  | "Automation tool"
  | "Social app"
  | "E-commerce"
  | "Finance tracker"
  | "Music/media app"
  | "Productivity app"
  | "Developer tool"
  | "Education app"
  | "API/backend project"
  | "Data visualization app"
  | "Mobile app"
  | "Game"
  | "AI/ML"
  | "Data engineering"
  | "DevOps / Cloud"
  | "Cybersecurity"
  | "Blockchain / Web3"
  | "Desktop app"
  | "Browser extension"
  | "Embedded / IoT"
  | "Creative coding";

export type EstimatedTime =
  | "Weekend project"
  | "1 week"
  | "2-3 weeks"
  | "1 month"
  | "Long-term project";

export type Feature =
  | "Authentication"
  | "Database modeling"
  | "Admin panel"
  | "File uploads"
  | "Payments"
  | "AI integration"
  | "Realtime features"
  | "Email notifications"
  | "Charts"
  | "Search/filtering"
  | "Role-based access"
  | "API integrations"
  | "Testing"
  | "Deployment";

export type SurveyAnswers = {
  developerFields: string[];
  stacks: string[];
  customStacks: string[];
  skillLevel?: SkillLevel;
  goal?: ProjectGoal;
  category?: ProjectCategory;
  availableTime?: EstimatedTime;
  features: Feature[];
};

export type SurveyStepKey = keyof SurveyAnswers;

export type ProjectScores = {
  portfolioValue: number;
  learningValue: number;
  buildability: number;
  uniqueness: number;
  marketPotential: number;
};

export type BuildPhase = {
  title: string;
  description: string;
  tasks: string[];
};

export type BlueprintArchitecture = {
  overview: string;
  frontend?: string[];
  backend?: string[];
  database?: string[];
  infrastructure?: string[];
  integrations?: string[];
  security?: string[];
};

export type ScopeTier = {
  tier: "mini" | "standard" | "portfolio" | "production";
  title: string;
  description: string;
  features: string[];
};

export type RecommendedLearning = {
  title: string;
  topic: string;
};

export type TimeDistribution = {
  label: string;
  percentage: number;
};

export type ComplexityBreakdown = {
  frontend: number;
  backend: number;
  architecture: number;
  uiux: number;
  deployment: number;
};

export type TeamExpansion = {
  solo: string[];
  teamOf2: string[];
  teamOf4: string[];
};

export type ResumeImpact = {
  junior: string;
  mid: string;
  senior: string;
};

export type FeatureFlowEdge = {
  from: string;
  to: string;
};

export type ProjectIdea = ProjectScores & {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  developerFields: string[];
  categories: ProjectCategory[];
  goals: ProjectGoal[];
  stacks: string[];
  difficulty: SkillLevel;
  estimatedTime: EstimatedTime;
  features: Feature[];
  coreFeatures: string[];
  stretchFeatures: string[];
  learningOutcomes: string[];
  recommendedStack: string[];
  buildPhases: BuildPhase[];
  architecture: BlueprintArchitecture;
  suggestedStructure: {
    label: string;
    tree: string[];
  };
  scopeTiers: ScopeTier[];
  realWorldChallenges: string[];
  portfolioTalkingPoints: string[];
  practicalSkills: string[];
  commonMistakes: string[];
  recommendedLearning: RecommendedLearning[];
  inspiredBy: string[];
  timeDistribution: TimeDistribution[];
  complexity: ComplexityBreakdown;
  teamExpansion: TeamExpansion;
  monetizationIdeas?: string[];
  resumeImpact: ResumeImpact;
  aiBuildSuggestions: string[];
  whyThisProjectMatters: string;
  featureFlow: FeatureFlowEdge[];
  blueprintMarkdown?: string;
  generated?: boolean;
  matchType?: "strong" | "related" | "discovery" | "ai";
  source?: "curated" | "ai" | "customized" | "community";
  customized?: boolean;
  baseBlueprintId?: string;
  community?: boolean;
  communityBlueprintId?: string;
  authorName?: string;
  authorId?: string;
};

export type ProjectMatch = {
  idea: ProjectIdea;
  score: number;
  percentage: number;
  matchReasons: string[];
  selectedCustomStacks?: string[];
  matchType?: "strong" | "related" | "discovery" | "ai";
};
