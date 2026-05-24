import type {
  EstimatedTime,
  Feature,
  ProjectCategory,
  ProjectGoal,
  ProjectIdea,
  SkillLevel,
} from "@/lib/types";
import { generatedBlueprints } from "@/data/blueprints";
import { enrichBlueprint } from "@/lib/blueprints/enrichBlueprint";
import { validateBlueprints } from "@/lib/validateBlueprints";

type IdeaInput = {
  title: string;
  shortDescription: string;
  longDescription?: string;
  developerFields: string[];
  categories: ProjectCategory[];
  goals: ProjectGoal[];
  stacks: string[];
  difficulty: SkillLevel;
  estimatedTime: EstimatedTime;
  features: Feature[];
  scores?: Partial<
    Pick<
      ProjectIdea,
      | "portfolioValue"
      | "learningValue"
      | "buildability"
      | "uniqueness"
      | "marketPotential"
    >
  >;
  coreFeatures?: string[];
  stretchFeatures?: string[];
  learningOutcomes?: string[];
  recommendedStack?: string[];
};

const defaultScores = {
  portfolioValue: 8,
  learningValue: 8,
  buildability: 7,
  uniqueness: 7,
  marketPotential: 6,
};

const defaultPhases = [
  "Create the app shell, design tokens, navigation, and reusable UI primitives.",
  "Model the main entities and define validation rules for create/edit flows.",
  "Build the primary screens with responsive states, filters, and empty views.",
  "Implement the core workflow with realistic local or persisted data.",
  "Add loading states, accessibility checks, copy states, and edge cases.",
  "Run lint/build, prepare deployment notes, and write a demo-ready README.",
];

function createIdea(input: IdeaInput): ProjectIdea {
  const slug = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const idea = {
    id: slug,
    slug,
    title: input.title,
    shortDescription: input.shortDescription,
    longDescription:
      input.longDescription ??
      `${input.title} is a scoped project blueprint for practicing ${input.features
        .slice(0, 3)
        .join(", ")
        .toLowerCase()} with a realistic product workflow.`,
    developerFields: input.developerFields,
    categories: input.categories,
    goals: input.goals,
    stacks: input.stacks,
    difficulty: input.difficulty,
    estimatedTime: input.estimatedTime,
    features: input.features,
    ...defaultScores,
    ...input.scores,
    coreFeatures:
      input.coreFeatures ??
      ["Primary workspace", "Create and edit flow", "Search and filtering", "Detail view"],
    stretchFeatures:
      input.stretchFeatures ??
      ["Import/export workflow", "Advanced analytics", "Team-ready settings"],
    learningOutcomes:
      input.learningOutcomes ??
      ["Product scoping", "Data modeling", "Stateful UI design", "Practical deployment"],
    recommendedStack: input.recommendedStack ?? input.stacks.slice(0, 5),
  } as ProjectIdea;

  return {
    ...enrichBlueprint(idea),
    blueprintMarkdown: generateBlueprintMarkdown(idea),
  };
}

function generateBlueprintMarkdown(idea: ProjectIdea) {
  return `# ${idea.title}

## Description
${idea.longDescription}

## Developer fields
${idea.developerFields.map((item) => `- ${item}`).join("\n")}

## Recommended stack
${idea.recommendedStack.map((item) => `- ${item}`).join("\n")}

## Difficulty
${idea.difficulty}

## Estimated time
${idea.estimatedTime}

## Core features
${idea.coreFeatures.map((item) => `- ${item}`).join("\n")}

## Stretch features
${idea.stretchFeatures.map((item) => `- ${item}`).join("\n")}

## Learning outcomes
${idea.learningOutcomes.map((item) => `- ${item}`).join("\n")}

## Suggested build phases
${defaultPhases.map((phase, index) => `${index + 1}. ${phase}`).join("\n")}`;
}

const baseProjectIdeas: ProjectIdea[] = [
  createIdea({ title: "Component Library Builder", shortDescription: "Build reusable, documented UI primitives with variants and usage examples.", developerFields: ["frontend"], categories: ["Frontend", "Developer tool"], goals: ["Portfolio", "Job application"], stacks: ["React", "Tailwind CSS", "shadcn/ui"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["Testing", "Deployment", "Search/filtering"], scores: { portfolioValue: 9, buildability: 8 } }),
  createIdea({ title: "Animation Showcase Site", shortDescription: "Create a polished gallery of scroll, hover, and page transition patterns.", developerFields: ["frontend", "creative-coding"], categories: ["Frontend", "Creative coding"], goals: ["Portfolio", "Learning a new stack"], stacks: ["React", "Next.js", "Tailwind CSS"], difficulty: "Intermediate", estimatedTime: "1 week", features: ["Deployment", "Testing"], scores: { uniqueness: 8 } }),
  createIdea({ title: "Design System Playground", shortDescription: "Experiment with tokens, components, themes, and responsive UI states.", developerFields: ["frontend"], categories: ["Frontend", "Developer tool"], goals: ["Portfolio", "Job application"], stacks: ["Next.js", "React", "Tailwind CSS", "shadcn/ui"], difficulty: "Portfolio-grade", estimatedTime: "1 month", features: ["Testing", "Admin panel", "Deployment"], scores: { portfolioValue: 10 } }),
  createIdea({ title: "Interactive Pricing Page Builder", shortDescription: "Build pricing cards, toggles, add-ons, and comparison tables from structured data.", developerFields: ["frontend", "full-stack"], categories: ["Frontend", "Dashboard"], goals: ["Freelance case study", "Portfolio"], stacks: ["Next.js", "React", "Tailwind CSS"], difficulty: "Intermediate", estimatedTime: "1 week", features: ["Search/filtering", "Deployment"] }),
  createIdea({ title: "Job Queue Dashboard", shortDescription: "Inspect queued jobs, retries, failures, and worker throughput.", developerFields: ["backend", "devops-cloud"], categories: ["Backend", "Dashboard"], goals: ["Portfolio", "Open-source project"], stacks: ["Node.js", "PostgreSQL", "Docker"], difficulty: "Advanced", estimatedTime: "1 month", features: ["Charts", "Testing", "API integrations"], scores: { learningValue: 9, portfolioValue: 9 } }),
  createIdea({ title: "API Rate Limiter Service", shortDescription: "Design a rate-limiting service with quotas, keys, logs, and dashboards.", developerFields: ["backend"], categories: ["Backend", "API/backend project"], goals: ["Portfolio", "Open-source project"], stacks: ["Node.js", "Redis", "PostgreSQL", "Docker"], difficulty: "Advanced", estimatedTime: "2-3 weeks", features: ["API integrations", "Testing", "Charts"] }),
  createIdea({ title: "Webhook Testing Service", shortDescription: "Capture, replay, inspect, and debug incoming webhook payloads.", developerFields: ["backend", "full-stack"], categories: ["Developer tool", "API/backend project"], goals: ["SaaS idea", "Portfolio"], stacks: ["Next.js", "Node.js", "PostgreSQL"], difficulty: "Portfolio-grade", estimatedTime: "1 month", features: ["Realtime features", "API integrations", "Testing"] }),
  createIdea({ title: "Auth Service Playground", shortDescription: "Explore sessions, roles, tokens, password resets, and protected resources.", developerFields: ["backend", "full-stack", "cybersecurity"], categories: ["Backend", "Cybersecurity"], goals: ["Learning a new stack", "Portfolio"], stacks: ["Node.js", "PostgreSQL", "JWT", "Docker"], difficulty: "Advanced", estimatedTime: "2-3 weeks", features: ["Authentication", "Role-based access", "Testing"] }),
  createIdea({ title: "Freelance Invoice Dashboard", shortDescription: "Track clients, invoices, payment status, and monthly revenue.", developerFields: ["full-stack"], categories: ["Dashboard", "Finance tracker"], goals: ["Freelance case study", "Portfolio", "SaaS idea"], stacks: ["Next.js", "PostgreSQL", "Prisma", "Tailwind CSS", "shadcn/ui"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["Database modeling", "Charts", "Email notifications"], scores: { portfolioValue: 9, marketPotential: 8 } }),
  createIdea({ title: "Personal CRM", shortDescription: "Track contacts, follow-ups, notes, tags, and relationship context.", developerFields: ["full-stack"], categories: ["Productivity app", "Dashboard"], goals: ["Personal tool", "Portfolio"], stacks: ["Next.js", "Supabase", "PostgreSQL", "Tailwind CSS"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["Authentication", "Search/filtering", "Database modeling"] }),
  createIdea({ title: "SaaS Analytics Dashboard", shortDescription: "Visualize signups, activation, churn signals, cohorts, and feature usage.", developerFields: ["full-stack", "data-engineering"], categories: ["Dashboard", "Data visualization app"], goals: ["SaaS idea", "Portfolio"], stacks: ["Next.js", "PostgreSQL", "Drizzle", "shadcn/ui"], difficulty: "Portfolio-grade", estimatedTime: "1 month", features: ["Charts", "Database modeling", "Role-based access"], scores: { portfolioValue: 10, marketPotential: 9 } }),
  createIdea({ title: "Developer Portfolio CMS", shortDescription: "Manage projects, case studies, skills, and publishing states.", developerFields: ["full-stack", "frontend"], categories: ["Developer tool", "Dashboard"], goals: ["Portfolio", "Job application"], stacks: ["Next.js", "PostgreSQL", "Prisma", "Tailwind CSS"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["Admin panel", "Database modeling", "Deployment"], scores: { portfolioValue: 10 } }),
  createIdea({ title: "Team Knowledge Base", shortDescription: "Create searchable team docs with owners, categories, and freshness signals.", developerFields: ["full-stack"], categories: ["Productivity app", "Developer tool"], goals: ["SaaS idea", "Open-source project"], stacks: ["Next.js", "PostgreSQL", "Prisma"], difficulty: "Advanced", estimatedTime: "1 month", features: ["Authentication", "Role-based access", "Search/filtering"] }),
  createIdea({ title: "Offline Habit Tracker", shortDescription: "Track habits offline with sync-ready local storage and streak history.", developerFields: ["mobile"], categories: ["Mobile app", "Productivity app"], goals: ["Personal tool", "Portfolio"], stacks: ["React Native", "Expo", "SQLite"], difficulty: "Beginner", estimatedTime: "1 week", features: ["Database modeling", "Charts", "Deployment"], scores: { buildability: 10 } }),
  createIdea({ title: "Fitness Routine App", shortDescription: "Plan workouts, log sets, and review weekly training progress.", developerFields: ["mobile"], categories: ["Mobile app", "Productivity app"], goals: ["Portfolio", "Personal tool"], stacks: ["Flutter", "Firebase", "SQLite"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["Authentication", "Charts", "Database modeling"] }),
  createIdea({ title: "Expense Tracker Mobile App", shortDescription: "Capture spending, categorize purchases, and view budget trends.", developerFields: ["mobile"], categories: ["Mobile app", "Finance tracker"], goals: ["Portfolio", "Personal tool"], stacks: ["React Native", "Expo", "Supabase", "SQLite"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["File uploads", "Charts", "Search/filtering"] }),
  createIdea({ title: "Location-Based Notes App", shortDescription: "Attach notes to places and surface reminders near saved locations.", developerFields: ["mobile"], categories: ["Mobile app", "Productivity app"], goals: ["Portfolio", "Learning a new stack"], stacks: ["Swift", "Firebase", "SQLite"], difficulty: "Advanced", estimatedTime: "1 month", features: ["API integrations", "Database modeling", "Realtime features"] }),
  createIdea({ title: "Language Flashcard App", shortDescription: "Build mobile decks, review sessions, streaks, and pronunciation notes.", developerFields: ["mobile"], categories: ["Mobile app", "Education app"], goals: ["Portfolio", "Personal tool"], stacks: ["Kotlin", "Firebase", "SQLite"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["Charts", "Search/filtering", "Deployment"] }),
  createIdea({ title: "2D Platformer Prototype", shortDescription: "Prototype movement, hazards, checkpoints, and collectible systems.", developerFields: ["game"], categories: ["Game"], goals: ["Portfolio", "Learning a new stack"], stacks: ["Godot", "GDScript"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["Testing", "Deployment"] }),
  createIdea({ title: "Puzzle Game Level Editor", shortDescription: "Create grid-based puzzle levels, validation rules, and playable previews.", developerFields: ["game"], categories: ["Game", "Developer tool"], goals: ["Portfolio", "Open-source project"], stacks: ["Unity", "C#"], difficulty: "Advanced", estimatedTime: "1 month", features: ["File uploads", "Testing", "Search/filtering"], scores: { uniqueness: 9 } }),
  createIdea({ title: "Inventory System Demo", shortDescription: "Build item slots, drag/drop, rarity, equipment, and persistence.", developerFields: ["game"], categories: ["Game"], goals: ["Portfolio", "Learning a new stack"], stacks: ["Unity", "C#"], difficulty: "Intermediate", estimatedTime: "1 week", features: ["Database modeling", "Testing"] }),
  createIdea({ title: "Multiplayer Lobby Prototype", shortDescription: "Prototype rooms, player readiness, chat, and match start states.", developerFields: ["game"], categories: ["Game", "Social app"], goals: ["Portfolio", "Hackathon"], stacks: ["Godot", "Node.js", "WebSocket"], difficulty: "Advanced", estimatedTime: "1 month", features: ["Realtime features", "Authentication", "Testing"] }),
  createIdea({ title: "Procedural Map Generator", shortDescription: "Generate tile maps with seeds, biomes, paths, and exportable layouts.", developerFields: ["game", "creative-coding"], categories: ["Game", "Creative coding"], goals: ["Portfolio", "Learning a new stack"], stacks: ["C++", "Godot", "GDScript"], difficulty: "Advanced", estimatedTime: "2-3 weeks", features: ["Testing", "File uploads"], scores: { uniqueness: 9 } }),
  createIdea({ title: "AI Study Planner", shortDescription: "Plan learning goals, weekly study blocks, reviews, and progress dashboards.", developerFields: ["ai-ml", "full-stack"], categories: ["AI tool", "Education app"], goals: ["Portfolio", "Learning a new stack"], stacks: ["Next.js", "Python", "FastAPI", "PostgreSQL"], difficulty: "Portfolio-grade", estimatedTime: "1 month", features: ["AI integration", "Charts", "Database modeling"] }),
  createIdea({ title: "Document Q&A Tool", shortDescription: "Upload documents, index chunks, and answer questions with citations.", developerFields: ["ai-ml"], categories: ["AI tool", "Developer tool"], goals: ["Portfolio", "SaaS idea"], stacks: ["Python", "LangChain", "Vector DB", "FastAPI"], difficulty: "Portfolio-grade", estimatedTime: "1 month", features: ["AI integration", "File uploads", "Search/filtering"], scores: { marketPotential: 8 } }),
  createIdea({ title: "Image Classifier Dashboard", shortDescription: "Train or evaluate image classifiers with metrics and sample galleries.", developerFields: ["ai-ml"], categories: ["AI/ML", "Dashboard"], goals: ["Portfolio", "Learning a new stack"], stacks: ["Python", "PyTorch", "Jupyter", "FastAPI"], difficulty: "Advanced", estimatedTime: "2-3 weeks", features: ["File uploads", "Charts", "Testing"] }),
  createIdea({ title: "Recommendation Engine Demo", shortDescription: "Recommend products, movies, or articles from user-item interactions.", developerFields: ["ai-ml", "data-engineering"], categories: ["AI/ML", "Data engineering"], goals: ["Portfolio", "Learning a new stack"], stacks: ["Python", "scikit-learn", "Pandas", "PostgreSQL"], difficulty: "Advanced", estimatedTime: "2-3 weeks", features: ["Charts", "Database modeling", "Testing"] }),
  createIdea({ title: "AI Flashcard Generator", shortDescription: "Turn notes into decks, quizzes, review sessions, and mastery tracking.", developerFields: ["ai-ml", "full-stack"], categories: ["AI tool", "Education app"], goals: ["Portfolio", "Hackathon"], stacks: ["Next.js", "FastAPI", "OpenAI API", "PostgreSQL"], difficulty: "Portfolio-grade", estimatedTime: "2-3 weeks", features: ["AI integration", "File uploads", "Charts"] }),
  createIdea({ title: "Prompt Testing Playground", shortDescription: "Compare prompt versions, inputs, outputs, scoring notes, and regressions.", developerFields: ["ai-ml"], categories: ["AI tool", "Developer tool"], goals: ["Personal tool", "Portfolio"], stacks: ["Next.js", "OpenAI API", "PostgreSQL"], difficulty: "Intermediate", estimatedTime: "1 week", features: ["AI integration", "Testing", "Search/filtering"] }),
  createIdea({ title: "ETL Pipeline Monitor", shortDescription: "Track pipeline runs, failures, duration, row counts, and retries.", developerFields: ["data-engineering"], categories: ["Data engineering", "Dashboard"], goals: ["Portfolio", "Job application"], stacks: ["Python", "Airflow", "PostgreSQL", "Docker"], difficulty: "Advanced", estimatedTime: "1 month", features: ["Charts", "Testing", "Email notifications"] }),
  createIdea({ title: "Data Quality Dashboard", shortDescription: "Monitor freshness, schema changes, null rates, and validation failures.", developerFields: ["data-engineering"], categories: ["Data engineering", "Dashboard"], goals: ["Portfolio", "Open-source project"], stacks: ["Python", "dbt", "PostgreSQL", "Grafana"], difficulty: "Advanced", estimatedTime: "2-3 weeks", features: ["Charts", "Testing", "Search/filtering"] }),
  createIdea({ title: "CSV Cleaning Tool", shortDescription: "Clean messy CSVs with previews, transformations, and export history.", developerFields: ["data-engineering", "automation-scripting"], categories: ["Data engineering", "Productivity app"], goals: ["Personal tool", "Portfolio"], stacks: ["Python", "Pandas", "DuckDB"], difficulty: "Beginner", estimatedTime: "1 week", features: ["File uploads", "Search/filtering", "Testing"], scores: { buildability: 9 } }),
  createIdea({ title: "Analytics Event Explorer", shortDescription: "Inspect event payloads, users, funnels, and schema drift over time.", developerFields: ["data-engineering", "full-stack"], categories: ["Data visualization app", "Data engineering"], goals: ["Portfolio", "SaaS idea"], stacks: ["Next.js", "PostgreSQL", "Pandas"], difficulty: "Advanced", estimatedTime: "1 month", features: ["Charts", "Search/filtering", "Database modeling"] }),
  createIdea({ title: "Mini Data Warehouse Demo", shortDescription: "Model raw, staged, and mart tables with lineage and quality checks.", developerFields: ["data-engineering"], categories: ["Data engineering"], goals: ["Job application", "Learning a new stack"], stacks: ["DuckDB", "dbt", "Python"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["Testing", "Charts", "Deployment"] }),
  createIdea({ title: "Deployment Status Dashboard", shortDescription: "Track environments, versions, deploy history, and rollback readiness.", developerFields: ["devops-cloud"], categories: ["DevOps / Cloud", "Dashboard"], goals: ["Portfolio", "Open-source project"], stacks: ["Docker", "GitHub Actions", "Next.js"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["API integrations", "Charts", "Deployment"] }),
  createIdea({ title: "Docker Environment Manager", shortDescription: "Organize local compose files, ports, health checks, and service logs.", developerFields: ["devops-cloud", "automation-scripting"], categories: ["DevOps / Cloud", "Developer tool"], goals: ["Personal tool", "Open-source project"], stacks: ["Docker", "Node.js", "Linux"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["Testing", "Search/filtering", "Deployment"] }),
  createIdea({ title: "CI/CD Pipeline Monitor", shortDescription: "Summarize workflow runs, failures, durations, and flaky jobs.", developerFields: ["devops-cloud"], categories: ["DevOps / Cloud", "Dashboard"], goals: ["Portfolio", "Open-source project"], stacks: ["GitHub Actions", "Next.js", "PostgreSQL"], difficulty: "Advanced", estimatedTime: "2-3 weeks", features: ["API integrations", "Charts", "Testing"] }),
  createIdea({ title: "Cloud Cost Tracker", shortDescription: "Track cloud spend by service, team, environment, and anomaly notes.", developerFields: ["devops-cloud", "data-engineering"], categories: ["DevOps / Cloud", "Finance tracker"], goals: ["SaaS idea", "Portfolio"], stacks: ["AWS", "GCP", "PostgreSQL", "Grafana"], difficulty: "Advanced", estimatedTime: "1 month", features: ["Charts", "API integrations", "Email notifications"], scores: { marketPotential: 9 } }),
  createIdea({ title: "Log Viewer Dashboard", shortDescription: "Search logs, save filters, inspect traces, and group recurring errors.", developerFields: ["devops-cloud"], categories: ["DevOps / Cloud", "Developer tool"], goals: ["Portfolio", "Personal tool"], stacks: ["Linux", "Nginx", "Next.js"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["Search/filtering", "Charts", "Testing"] }),
  createIdea({ title: "Uptime Monitoring Tool", shortDescription: "Monitor endpoints, latency, uptime history, and incident notes.", developerFields: ["devops-cloud", "backend"], categories: ["DevOps / Cloud", "Developer tool"], goals: ["SaaS idea", "Portfolio"], stacks: ["Node.js", "PostgreSQL", "Prometheus"], difficulty: "Advanced", estimatedTime: "1 month", features: ["Charts", "Email notifications", "API integrations"] }),
  createIdea({ title: "Password Strength Analyzer", shortDescription: "Score passwords, explain risk factors, and teach safer patterns.", developerFields: ["cybersecurity"], categories: ["Cybersecurity", "Developer tool"], goals: ["Portfolio", "Learning a new stack"], stacks: ["React", "TypeScript", "OWASP ZAP"], difficulty: "Beginner", estimatedTime: "Weekend project", features: ["Testing", "Deployment"] }),
  createIdea({ title: "Security Header Scanner", shortDescription: "Scan URLs for security headers and explain missing protections.", developerFields: ["cybersecurity", "backend"], categories: ["Cybersecurity", "Developer tool"], goals: ["Open-source project", "Portfolio"], stacks: ["Node.js", "Nmap", "Next.js"], difficulty: "Intermediate", estimatedTime: "1 week", features: ["API integrations", "Testing", "Search/filtering"] }),
  createIdea({ title: "Phishing URL Detector", shortDescription: "Analyze URL signals, domain patterns, and suspicious redirects.", developerFields: ["cybersecurity", "ai-ml"], categories: ["Cybersecurity", "AI/ML"], goals: ["Portfolio", "Learning a new stack"], stacks: ["Python", "scikit-learn", "FastAPI"], difficulty: "Advanced", estimatedTime: "2-3 weeks", features: ["AI integration", "Testing", "Charts"] }),
  createIdea({ title: "Vulnerability Notes Tracker", shortDescription: "Organize findings, severity, remediation status, and evidence.", developerFields: ["cybersecurity"], categories: ["Cybersecurity", "Productivity app"], goals: ["Personal tool", "Portfolio"], stacks: ["Next.js", "PostgreSQL", "Tailwind CSS"], difficulty: "Intermediate", estimatedTime: "1 week", features: ["Search/filtering", "File uploads", "Database modeling"] }),
  createIdea({ title: "JWT Debugger", shortDescription: "Decode tokens, inspect claims, explain expiry, and validate examples locally.", developerFields: ["cybersecurity", "backend"], categories: ["Cybersecurity", "Developer tool"], goals: ["Open-source project", "Portfolio"], stacks: ["React", "Node.js", "JWT"], difficulty: "Beginner", estimatedTime: "Weekend project", features: ["Testing", "Deployment"] }),
  createIdea({ title: "Wallet Transaction Dashboard", shortDescription: "Track wallet activity, token movements, and transaction categories.", developerFields: ["blockchain-web3"], categories: ["Blockchain / Web3", "Dashboard"], goals: ["Portfolio", "SaaS idea"], stacks: ["Next.js", "ethers.js", "wagmi"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["API integrations", "Charts", "Search/filtering"] }),
  createIdea({ title: "NFT Collection Explorer", shortDescription: "Browse collection metadata, traits, owners, and market activity.", developerFields: ["blockchain-web3", "frontend"], categories: ["Blockchain / Web3", "Dashboard"], goals: ["Portfolio", "Hackathon"], stacks: ["Next.js", "ethers.js", "Tailwind CSS"], difficulty: "Intermediate", estimatedTime: "1 week", features: ["API integrations", "Search/filtering", "Charts"] }),
  createIdea({ title: "Smart Contract Voting Demo", shortDescription: "Build proposals, voting states, contract reads, and result views.", developerFields: ["blockchain-web3"], categories: ["Blockchain / Web3"], goals: ["Learning a new stack", "Portfolio"], stacks: ["Solidity", "Hardhat", "ethers.js"], difficulty: "Advanced", estimatedTime: "2-3 weeks", features: ["Testing", "Authentication", "Deployment"] }),
  createIdea({ title: "Token Vesting Dashboard", shortDescription: "Visualize vesting schedules, unlocks, claims, and beneficiary states.", developerFields: ["blockchain-web3"], categories: ["Blockchain / Web3", "Finance tracker"], goals: ["Portfolio", "SaaS idea"], stacks: ["Solidity", "Hardhat", "Next.js", "wagmi"], difficulty: "Portfolio-grade", estimatedTime: "1 month", features: ["Charts", "Testing", "Role-based access"] }),
  createIdea({ title: "DAO Proposal Tracker", shortDescription: "Track proposals, votes, quorum, deadlines, and discussion links.", developerFields: ["blockchain-web3"], categories: ["Blockchain / Web3", "Dashboard"], goals: ["Open-source project", "Portfolio"], stacks: ["Next.js", "ethers.js", "PostgreSQL"], difficulty: "Advanced", estimatedTime: "2-3 weeks", features: ["API integrations", "Search/filtering", "Charts"] }),
  createIdea({ title: "Markdown Notes App", shortDescription: "Create local markdown notes with tags, preview, and fuzzy search.", developerFields: ["desktop"], categories: ["Desktop app", "Productivity app"], goals: ["Personal tool", "Portfolio"], stacks: ["Tauri", "React", "SQLite"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["Search/filtering", "File uploads", "Deployment"] }),
  createIdea({ title: "Clipboard Manager", shortDescription: "Store clipboard history, pin snippets, and search recent copied text.", developerFields: ["desktop"], categories: ["Desktop app", "Productivity app"], goals: ["Personal tool", "Open-source project"], stacks: ["Electron", "SQLite", "React"], difficulty: "Intermediate", estimatedTime: "1 week", features: ["Search/filtering", "Testing", "Deployment"] }),
  createIdea({ title: "Local File Organizer", shortDescription: "Sort local files by type, rules, duplicates, and cleanup suggestions.", developerFields: ["desktop", "automation-scripting"], categories: ["Desktop app", "Automation tool"], goals: ["Personal tool", "Portfolio"], stacks: ["Tauri", "Rust", "SQLite"], difficulty: "Advanced", estimatedTime: "2-3 weeks", features: ["File uploads", "Search/filtering", "Testing"] }),
  createIdea({ title: "Pomodoro Desktop Timer", shortDescription: "Build sessions, breaks, task labels, notifications, and daily stats.", developerFields: ["desktop"], categories: ["Desktop app", "Productivity app"], goals: ["Learning a new stack", "Personal tool"], stacks: ["Electron", "React", "SQLite"], difficulty: "Beginner", estimatedTime: "Weekend project", features: ["Charts", "Deployment", "Testing"] }),
  createIdea({ title: "Tab Manager Extension", shortDescription: "Group, search, suspend, and restore browser tabs by workspace.", developerFields: ["browser-extension"], categories: ["Browser extension", "Productivity app"], goals: ["Personal tool", "Open-source project"], stacks: ["Chrome Extension APIs", "React", "WebExtensions"], difficulty: "Intermediate", estimatedTime: "1 week", features: ["Search/filtering", "Deployment", "Testing"] }),
  createIdea({ title: "Reading List Extension", shortDescription: "Save pages, tag links, add notes, and resurface unread articles.", developerFields: ["browser-extension"], categories: ["Browser extension", "Productivity app"], goals: ["Personal tool", "Portfolio"], stacks: ["Chrome Extension APIs", "React", "SQLite"], difficulty: "Beginner", estimatedTime: "1 week", features: ["Search/filtering", "Deployment"] }),
  createIdea({ title: "Page Annotation Tool", shortDescription: "Annotate pages, store highlights, and organize notes by URL.", developerFields: ["browser-extension"], categories: ["Browser extension", "Productivity app"], goals: ["Portfolio", "Personal tool"], stacks: ["WebExtensions", "React", "Tailwind CSS"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["File uploads", "Search/filtering", "Testing"] }),
  createIdea({ title: "CSS Inspector Extension", shortDescription: "Inspect colors, spacing, fonts, and component styles on any page.", developerFields: ["browser-extension", "frontend"], categories: ["Browser extension", "Developer tool"], goals: ["Open-source project", "Portfolio"], stacks: ["Chrome Extension APIs", "React", "Tailwind CSS"], difficulty: "Intermediate", estimatedTime: "1 week", features: ["Search/filtering", "Deployment", "Testing"] }),
  createIdea({ title: "Bulk Image Renamer", shortDescription: "Rename batches of images from metadata, date patterns, and templates.", developerFields: ["automation-scripting"], categories: ["Automation tool", "Productivity app"], goals: ["Personal tool", "Learning a new stack"], stacks: ["Python", "Bash"], difficulty: "Beginner", estimatedTime: "Weekend project", features: ["File uploads", "Testing"] }),
  createIdea({ title: "Local Backup Script Dashboard", shortDescription: "Configure backup jobs, folders, schedules, logs, and retention rules.", developerFields: ["automation-scripting", "devops-cloud"], categories: ["Automation tool", "Dashboard"], goals: ["Personal tool", "Portfolio"], stacks: ["Python", "Linux", "SQLite"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["Charts", "Testing", "Email notifications"] }),
  createIdea({ title: "File Cleanup Automation Tool", shortDescription: "Find old downloads, duplicate files, and cleanup candidates safely.", developerFields: ["automation-scripting", "desktop"], categories: ["Automation tool", "Desktop app"], goals: ["Personal tool", "Open-source project"], stacks: ["Python", "PowerShell", "SQLite"], difficulty: "Intermediate", estimatedTime: "1 week", features: ["File uploads", "Testing", "Search/filtering"] }),
  createIdea({ title: "Website Change Tracker", shortDescription: "Watch pages for text changes, snapshots, and notification rules.", developerFields: ["automation-scripting"], categories: ["Automation tool", "Developer tool"], goals: ["Personal tool", "Portfolio"], stacks: ["Playwright", "Node.js", "SQLite"], difficulty: "Intermediate", estimatedTime: "1 week", features: ["Email notifications", "Testing", "Search/filtering"] }),
  createIdea({ title: "Sensor Dashboard", shortDescription: "Display sensor readings, trends, thresholds, and device health.", developerFields: ["embedded-iot"], categories: ["Embedded / IoT", "Dashboard"], goals: ["Portfolio", "Learning a new stack"], stacks: ["Arduino", "MQTT", "Grafana"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["Realtime features", "Charts", "Deployment"] }),
  createIdea({ title: "Smart Home Device Simulator", shortDescription: "Simulate lights, switches, sensors, and automation rules.", developerFields: ["embedded-iot"], categories: ["Embedded / IoT", "Automation tool"], goals: ["Portfolio", "Hackathon"], stacks: ["Raspberry Pi", "MQTT", "Node.js"], difficulty: "Intermediate", estimatedTime: "1 week", features: ["Realtime features", "Testing", "API integrations"] }),
  createIdea({ title: "MQTT Monitor", shortDescription: "Subscribe to topics, inspect payloads, retain messages, and chart traffic.", developerFields: ["embedded-iot", "devops-cloud"], categories: ["Embedded / IoT", "Developer tool"], goals: ["Open-source project", "Portfolio"], stacks: ["MQTT", "Node.js", "React"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["Realtime features", "Charts", "Search/filtering"] }),
  createIdea({ title: "Arduino Data Logger", shortDescription: "Log device readings, export CSVs, and visualize trends locally.", developerFields: ["embedded-iot"], categories: ["Embedded / IoT", "Data visualization app"], goals: ["Learning a new stack", "Portfolio"], stacks: ["Arduino", "C++", "SQLite"], difficulty: "Intermediate", estimatedTime: "2-3 weeks", features: ["File uploads", "Charts", "Testing"] }),
  createIdea({ title: "Generative Art Playground", shortDescription: "Create parameterized sketches with presets, random seeds, and exports.", developerFields: ["creative-coding"], categories: ["Creative coding", "Frontend"], goals: ["Portfolio", "Learning a new stack"], stacks: ["p5.js", "React", "WebGL"], difficulty: "Intermediate", estimatedTime: "1 week", features: ["File uploads", "Deployment"], scores: { uniqueness: 9 } }),
  createIdea({ title: "Audio Visualizer", shortDescription: "Render realtime visuals from audio input, frequencies, and beat detection.", developerFields: ["creative-coding"], categories: ["Creative coding", "Music/media app"], goals: ["Portfolio", "Hackathon"], stacks: ["Tone.js", "WebGL", "Three.js"], difficulty: "Advanced", estimatedTime: "2-3 weeks", features: ["Realtime features", "File uploads", "Deployment"], scores: { uniqueness: 9 } }),
  createIdea({ title: "Shader Gallery", shortDescription: "Build a gallery of GLSL shaders with controls, presets, and code views.", developerFields: ["creative-coding"], categories: ["Creative coding", "Developer tool"], goals: ["Portfolio", "Open-source project"], stacks: ["GLSL", "WebGL", "Three.js"], difficulty: "Advanced", estimatedTime: "2-3 weeks", features: ["Search/filtering", "Deployment", "Testing"] }),
  createIdea({ title: "Interactive Particle System", shortDescription: "Create particles with forces, presets, gestures, and performance controls.", developerFields: ["creative-coding", "game"], categories: ["Creative coding", "Game"], goals: ["Portfolio", "Learning a new stack"], stacks: ["Three.js", "WebGL", "React"], difficulty: "Intermediate", estimatedTime: "1 week", features: ["Testing", "Deployment"], scores: { uniqueness: 8 } }),
];

export const projectIdeas: ProjectIdea[] = [
  ...baseProjectIdeas,
  ...generatedBlueprints.map((idea) => ({
    ...enrichBlueprint(idea),
    blueprintMarkdown: generateBlueprintMarkdown(idea),
  })),
];

if (process.env.NODE_ENV === "development") {
  const validation = validateBlueprints(projectIdeas);
  if (!validation.valid) {
    console.warn("BuildSeed blueprint validation failed", validation.errors);
  }
}

export const popularIdeas = projectIdeas.filter((idea) =>
  [
    "SaaS Analytics Dashboard",
    "Document Q&A Tool",
    "Puzzle Game Level Editor",
    "ETL Pipeline Monitor",
    "Deployment Status Dashboard",
    "Generative Art Playground",
  ].includes(idea.title)
);
