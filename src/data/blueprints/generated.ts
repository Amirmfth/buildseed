import type {
  EstimatedTime,
  Feature,
  ProjectCategory,
  ProjectGoal,
  ProjectIdea,
  SkillLevel,
} from "@/lib/types";

type FieldPack = {
  field: string;
  categories: ProjectCategory[];
  stacks: string[];
  titlePrefix: string;
  topics: string[];
};

const difficulties: SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Portfolio-grade",
  "Startup-style MVP",
];

const times: EstimatedTime[] = [
  "Weekend project",
  "1 week",
  "2-3 weeks",
  "1 month",
  "Long-term project",
];

const goals: ProjectGoal[] = [
  "Portfolio",
  "Job application",
  "Learning a new stack",
  "SaaS idea",
  "Freelance case study",
  "Open-source project",
  "Hackathon",
  "Personal tool",
];

const featureSets: Feature[][] = [
  ["Search/filtering", "Testing", "Deployment"],
  ["Database modeling", "Charts", "Testing"],
  ["API integrations", "Search/filtering", "Deployment"],
  ["Realtime features", "Charts", "Testing"],
  ["File uploads", "Search/filtering", "Deployment"],
  ["Authentication", "Role-based access", "Testing"],
  ["Email notifications", "Charts", "API integrations"],
];

const packs: FieldPack[] = [
  { field: "frontend", titlePrefix: "Frontend", categories: ["Frontend", "Developer tool"], stacks: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Storybook"], topics: ["Responsive Layout Lab", "Accessible Modal Kit", "Dashboard Widget Studio", "Motion Pattern Gallery", "Form Builder Workspace", "Theme Token Explorer", "Data Table Playground", "Interactive Docs Portal", "Chart Component Showcase", "Landing Page Composer", "Microinteraction Library", "Client State Debugger"] },
  { field: "backend", titlePrefix: "Backend", categories: ["Backend", "API/backend project"], stacks: ["Node.js", "FastAPI", "PostgreSQL", "Redis", "Docker"], topics: ["API Gateway Sandbox", "Background Worker Console", "Audit Log Service", "Feature Flag API", "Notification Delivery Service", "Multi-tenant Settings API", "GraphQL Resolver Lab", "gRPC Health Service", "Cache Invalidation Console", "Webhook Replay Engine", "Permission Policy Service", "Data Import API"] },
  { field: "full-stack", titlePrefix: "Full-stack", categories: ["Full-stack", "Dashboard"], stacks: ["Next.js", "PostgreSQL", "Prisma", "Tailwind CSS", "GitHub Actions"], topics: ["Client Portal Starter", "Operations Command Center", "Marketplace Admin MVP", "Subscription Settings Hub", "Customer Feedback Board", "Internal Tools Builder", "Project Intake Workspace", "Team OKR Tracker", "Resource Booking System", "Product Roadmap Portal", "Service Quote Builder", "SaaS Onboarding Flow"] },
  { field: "mobile", titlePrefix: "Mobile", categories: ["Mobile app", "Productivity app"], stacks: ["React Native", "Expo", "SQLite", "Firebase", "Supabase"], topics: ["Offline Journal", "Medication Reminder", "Trip Packing Planner", "Meal Prep Assistant", "Goal Check-in App", "Voice Note Organizer", "Campus Map Companion", "Family Chore Tracker", "Mindfulness Timer", "Pet Care Log", "Field Inspection App", "Event Schedule Companion"] },
  { field: "game", titlePrefix: "Game", categories: ["Game"], stacks: ["Godot", "Unity", "C#", "GDScript", "Blender"], topics: ["Combat Sandbox", "Dialogue Tree Editor", "Quest Tracker Demo", "Roguelike Room Generator", "Physics Toybox", "Save System Prototype", "Enemy AI Arena", "Tile Collision Lab", "Crafting System Demo", "Rhythm Timing Prototype", "Camera Controller Lab", "Achievement System Demo"] },
  { field: "ai-ml", titlePrefix: "AI/ML", categories: ["AI/ML", "AI tool"], stacks: ["Python", "FastAPI", "PyTorch", "Hugging Face", "Jupyter"], topics: ["Model Evaluation Console", "Dataset Labeling Studio", "RAG Citation Inspector", "Embedding Explorer", "LLM Cost Analyzer", "Fine-tuning Run Tracker", "Synthetic Data Generator", "Prompt Regression Suite", "Notebook to API Demo", "Semantic Search Lab", "Model Card Builder", "Inference Queue Dashboard"] },
  { field: "data-engineering", titlePrefix: "Data Engineering", categories: ["Data engineering", "Dashboard"], stacks: ["Python", "SQL", "DuckDB", "dbt", "Airflow"], topics: ["Schema Drift Monitor", "Pipeline SLA Tracker", "Data Catalog Mini", "Warehouse Cost Explorer", "Metric Definition Registry", "CSV Profiling Workbench", "Streaming Event Sampler", "Lineage Map Demo", "Notebook Job Runner", "Reverse ETL Planner", "Anomaly Review Queue", "Dataset Contract Checker"] },
  { field: "devops-cloud", titlePrefix: "DevOps", categories: ["DevOps / Cloud", "Developer tool"], stacks: ["Docker", "Kubernetes", "Terraform", "AWS", "Grafana"], topics: ["Infrastructure Change Review", "Service Health Map", "Incident Timeline Builder", "Secret Rotation Tracker", "Environment Drift Checker", "Release Train Board", "Backup Verification Console", "Container Image Explorer", "SLO Burn Rate Panel", "Cloud Region Comparator", "Runbook Automation Hub", "Feature Environment Launcher"] },
  { field: "cybersecurity", titlePrefix: "Security", categories: ["Cybersecurity", "Developer tool"], stacks: ["Python", "Linux", "OWASP", "Nmap", "JWT"], topics: ["Threat Model Workspace", "Dependency Risk Triage", "API Token Auditor", "Security Checklist Portal", "CVE Watchlist", "Log Anomaly Notebook", "OAuth Flow Visualizer", "WebAuthn Demo Lab", "Secrets Exposure Scanner", "Packet Capture Annotator", "Detection Rule Library", "Access Review Dashboard"] },
  { field: "blockchain-web3", titlePrefix: "Web3", categories: ["Blockchain / Web3", "Dashboard"], stacks: ["Solidity", "Hardhat", "Ethers.js", "Wagmi", "IPFS"], topics: ["On-chain Treasury View", "Gas Fee Simulator", "Contract Event Explorer", "Airdrop Eligibility Tool", "Staking Rewards Dashboard", "Wallet Risk Labels", "Token Allowance Manager", "Governance Vote Simulator", "NFT Trait Analytics", "IPFS Pinning Console", "Escrow Contract Demo", "Cross-chain Activity View"] },
  { field: "desktop", titlePrefix: "Desktop", categories: ["Desktop app", "Productivity app"], stacks: ["Tauri", "Electron", "SQLite", "React", "Rust"], topics: ["Focus Workspace", "Local Bookmark Vault", "Snippet Launcher", "Meeting Notes Recorder", "Screen Capture Organizer", "Offline Kanban Board", "Personal Search Index", "Window Layout Presets", "Local Expense Ledger", "Recipe Archive", "Developer Scratchpad", "Keyboard Macro Studio"] },
  { field: "browser-extension", titlePrefix: "Extension", categories: ["Browser extension", "Productivity app"], stacks: ["Manifest V3", "TypeScript", "React", "IndexedDB", "Plasmo"], topics: ["Inbox Cleaner", "Meeting Link Extractor", "Focus Mode Toggle", "Screenshot Annotator", "Link Health Checker", "Cookie Inspector", "Bookmark Deduper", "Keyboard Shortcut Mapper", "Newsletter Saver", "GitHub PR Helper", "Reading Time Overlay", "Page Metadata Collector"] },
  { field: "automation-scripting", titlePrefix: "Automation", categories: ["Automation tool", "Developer tool"], stacks: ["Python", "Bash", "PowerShell", "Playwright", "GitHub Actions"], topics: ["Repo Maintenance Bot", "Invoice File Sorter", "Screenshot Regression Runner", "Local Cron Monitor", "CLI Release Assistant", "Bulk Markdown Formatter", "Download Folder Cleaner", "Dependency Update Planner", "Website Snapshot Archiver", "Log File Summarizer", "Git Branch Janitor", "Data Entry Replay Script"] },
  { field: "embedded-iot", titlePrefix: "IoT", categories: ["Embedded / IoT", "Dashboard"], stacks: ["ESP32", "Arduino", "MQTT", "Raspberry Pi", "Sensors"], topics: ["Greenhouse Sensor Console", "BLE Device Scanner", "LoRa Message Monitor", "Home Energy Display", "Garage Door Simulator", "Weather Station Logger", "Factory Counter Demo", "Device Provisioning Flow", "Water Leak Alert Panel", "Smart Shelf Prototype", "RTOS Task Visualizer", "Air Quality Monitor"] },
  { field: "creative-coding", titlePrefix: "Creative Coding", categories: ["Creative coding", "Frontend"], stacks: ["p5.js", "Three.js", "WebGL", "GLSL", "Tone.js"], topics: ["Interactive Typography Lab", "Generative Poster Maker", "Music Reactive Canvas", "Shader Preset Browser", "Particle Brush Tool", "Procedural Texture Studio", "Kinetic Logo Explorer", "Web Audio Sketchpad", "TouchDesigner Control Panel", "Fractal Explorer", "Live Coding Gallery", "3D Scene Composer"] },
];

export const generatedBlueprints: ProjectIdea[] = packs.flatMap((pack) =>
  pack.topics.map((topic, index) => makeBlueprint(pack, topic, index))
);

function makeBlueprint(pack: FieldPack, topic: string, index: number): ProjectIdea {
  const title = `${pack.titlePrefix} ${topic}`;
  const difficulty = difficulties[index % difficulties.length];
  const estimatedTime = times[index % times.length];
  const selectedGoals = [goals[index % goals.length], goals[(index + 3) % goals.length]];
  const features = featureSets[index % featureSets.length];
  const slug = slugify(title);

  return {
    id: slug,
    slug,
    title,
    shortDescription: `A ${pack.field.replace("-", " ")} blueprint for building a realistic ${topic.toLowerCase()} with production-minded scope.`,
    longDescription: `${title} is designed as a focused project blueprint for ${pack.field.replace("-", " ")} developers. It gives you a concrete product surface, realistic feature boundaries, and room to practice ${features.join(", ").toLowerCase()} without turning into an unbounded platform.`,
    developerFields: [pack.field],
    categories: pack.categories,
    goals: selectedGoals,
    stacks: pack.stacks,
    difficulty,
    estimatedTime,
    features,
    portfolioValue: score(7, index, 3),
    learningValue: score(8, index, 2),
    buildability: score(7, index, 1),
    uniqueness: score(6, index, 4),
    marketPotential: score(6, index, 5),
    coreFeatures: [
      `${topic} workspace`,
      "Create, edit, and review workflow",
      "Searchable activity or asset list",
      "Detail view with status and metadata",
    ],
    stretchFeatures: [
      "Import/export workflow",
      "Advanced analytics or automation",
      "Team-ready settings and permissions",
    ],
    learningOutcomes: [
      `${pack.titlePrefix} product architecture`,
      "State, data, and workflow modeling",
      "Production polish and deployment tradeoffs",
    ],
    recommendedStack: pack.stacks.slice(0, 5),
    source: "curated",
    blueprintMarkdown: "",
  } as ProjectIdea;
}

function score(base: number, index: number, offset: number) {
  return Math.min(10, base + ((index + offset) % 3));
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
