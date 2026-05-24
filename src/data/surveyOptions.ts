import type { EstimatedTime, Feature, ProjectCategory, ProjectGoal, SkillLevel } from "@/lib/types";

export const skillLevelOptions: SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Portfolio-grade",
  "Startup-style MVP",
];

export const goalOptions: ProjectGoal[] = [
  "Portfolio",
  "Job application",
  "Learning a new stack",
  "SaaS idea",
  "Freelance case study",
  "Open-source project",
  "Hackathon",
  "Personal tool",
];

export const categoryOptions: ProjectCategory[] = [
  "Frontend",
  "Backend",
  "Full-stack",
  "AI tool",
  "Dashboard",
  "Automation tool",
  "Social app",
  "E-commerce",
  "Finance tracker",
  "Music/media app",
  "Productivity app",
  "Developer tool",
  "Education app",
  "API/backend project",
  "Data visualization app",
  "Mobile app",
  "Game",
  "AI/ML",
  "Data engineering",
  "DevOps / Cloud",
  "Cybersecurity",
  "Blockchain / Web3",
  "Desktop app",
  "Browser extension",
  "Embedded / IoT",
  "Creative coding",
];

export const timeOptions: EstimatedTime[] = [
  "Weekend project",
  "1 week",
  "2-3 weeks",
  "1 month",
  "Long-term project",
];

export const featureOptions: Feature[] = [
  "Authentication",
  "Database modeling",
  "Admin panel",
  "File uploads",
  "Payments",
  "AI integration",
  "Realtime features",
  "Email notifications",
  "Charts",
  "Search/filtering",
  "Role-based access",
  "API integrations",
  "Testing",
  "Deployment",
];

export const surveySteps = [
  {
    key: "developerFields",
    eyebrow: "Step 1 of 7",
    title: "What kind of developer are you building as?",
    shortTitle: "Field",
    description:
      "Choose one or more developer fields so BuildSeed can tailor stacks and project ideas.",
    multiple: true,
  },
  {
    key: "stacks",
    eyebrow: "Step 2 of 7",
    title: "Choose your tech stack",
    shortTitle: "Stack",
    description: "Select tools you want the project to use or help you practice.",
    multiple: true,
  },
  {
    key: "skillLevel",
    eyebrow: "Step 3 of 7",
    title: "Pick your current level",
    shortTitle: "Level",
    description:
      "This helps BuildSeed avoid ideas that are too small or too unrealistic.",
    options: skillLevelOptions,
    skippable: true,
  },
  {
    key: "goal",
    eyebrow: "Step 4 of 7",
    title: "Define the project goal",
    shortTitle: "Goal",
    description:
      "Choose the main reason this idea needs to exist in your roadmap.",
    options: goalOptions,
    skippable: true,
  },
  {
    key: "category",
    eyebrow: "Step 5 of 7",
    title: "Choose a project category",
    shortTitle: "Category",
    description:
      "Pick the product surface you would be most motivated to design and build.",
    options: categoryOptions,
    skippable: true,
  },
  {
    key: "availableTime",
    eyebrow: "Step 6 of 7",
    title: "How much time can you spend?",
    shortTitle: "Time",
    description:
      "Match scope to your real calendar so the idea can actually ship.",
    options: timeOptions,
    skippable: true,
  },
  {
    key: "features",
    eyebrow: "Step 7 of 7",
    title: "Choose features to practice",
    shortTitle: "Features",
    description:
      "Select the implementation skills you want this build to strengthen.",
    options: featureOptions,
    multiple: true,
    skippable: true,
  },
] as const;
