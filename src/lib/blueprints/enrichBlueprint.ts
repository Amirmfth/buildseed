import type {
  BuildPhase,
  ProjectIdea,
  ScopeTier,
  SurveyAnswers,
} from "@/lib/types";

type PartialBlueprint = Omit<
  ProjectIdea,
  | "buildPhases"
  | "architecture"
  | "suggestedStructure"
  | "scopeTiers"
  | "realWorldChallenges"
  | "portfolioTalkingPoints"
  | "practicalSkills"
  | "commonMistakes"
  | "recommendedLearning"
  | "inspiredBy"
  | "timeDistribution"
  | "complexity"
  | "teamExpansion"
  | "resumeImpact"
  | "aiBuildSuggestions"
  | "whyThisProjectMatters"
  | "featureFlow"
> &
  Partial<
    Pick<
      ProjectIdea,
      | "buildPhases"
      | "architecture"
      | "suggestedStructure"
      | "scopeTiers"
      | "realWorldChallenges"
      | "portfolioTalkingPoints"
      | "practicalSkills"
      | "commonMistakes"
      | "recommendedLearning"
      | "inspiredBy"
      | "timeDistribution"
      | "complexity"
      | "teamExpansion"
      | "resumeImpact"
      | "aiBuildSuggestions"
      | "whyThisProjectMatters"
      | "featureFlow"
    >
  >;

const fieldProfiles: Record<
  string,
  {
    system: string;
    structure: string[];
    challenges: string[];
    mistakes: string[];
    skills: string[];
    learning: string[];
    inspiredBy: string[];
  }
> = {
  frontend: profile("interface system", ["src/components", "src/app", "src/lib/state", "src/styles"], ["Responsive states", "Accessibility coverage", "Interaction performance", "Design token consistency"], ["Skipping keyboard states", "Hardcoding one viewport", "Overusing animation", "Ignoring loading states"], ["Component architecture", "Accessibility", "Responsive layout", "State management"], ["ARIA patterns", "Design systems", "Animation performance", "Visual regression testing"], ["Linear", "Vercel dashboard"]),
  backend: profile("service architecture", ["src/routes", "src/services", "src/jobs", "src/db"], ["Data consistency", "Rate limits", "Error recovery", "Observability"], ["Thin validation", "No retry policy", "Leaky abstractions", "Unbounded queries"], ["API design", "Data modeling", "Testing", "Operational logging"], ["API design", "Queue patterns", "Database indexes", "Service monitoring"], ["Stripe API", "GitHub API"]),
  "full-stack": profile("end-to-end product", ["src/app", "src/components", "src/server", "src/db"], ["Cross-layer state", "Auth boundaries", "Query performance", "Product scope creep"], ["Mixing UI and data logic", "No empty states", "Weak access rules", "Skipping deployment checks"], ["Product architecture", "Database modeling", "UI systems", "Deployment"], ["Full-stack patterns", "Database design", "Product analytics", "Deployment hardening"], ["Notion", "Linear"]),
  mobile: profile("mobile workflow", ["app/screens", "app/components", "app/storage", "app/services"], ["Offline states", "Small-screen ergonomics", "Battery/network cost", "Platform permissions"], ["Desktop-first navigation", "No offline fallback", "Ignoring permissions", "Large touch targets missing"], ["Mobile UX", "Local storage", "Navigation", "Device APIs"], ["Offline-first apps", "Mobile navigation", "App store polish", "Push notifications"], ["Duolingo", "Strava"]),
  game: profile("gameplay system", ["Scenes", "Scripts", "Assets", "Systems"], ["Game feel", "Save state", "Performance budget", "Tooling for iteration"], ["Building too much content", "No debug tools", "Ignoring frame time", "Weak controls"], ["Gameplay loops", "State machines", "Level design", "Performance tuning"], ["Game loops", "Input systems", "Level tools", "Asset pipelines"], ["Celeste", "Hades"]),
  "ai-ml": profile("AI workflow", ["app/api", "notebooks", "models", "evals"], ["Evaluation quality", "Data privacy", "Latency/cost", "Hallucination control"], ["No eval set", "Prompt-only thinking", "Ignoring failures", "No traceability"], ["Prompting", "Evaluation", "Data processing", "Model integration"], ["RAG design", "Model evaluation", "Embeddings", "AI UX"], ["Perplexity", "Hugging Face Spaces"]),
  "data-engineering": profile("data pipeline", ["pipelines", "models", "checks", "dashboards"], ["Schema drift", "Data freshness", "Lineage", "Backfills"], ["No contracts", "Manual fixes", "Ignoring nulls", "No run history"], ["Pipeline design", "SQL modeling", "Data quality", "Observability"], ["dbt modeling", "Airflow patterns", "Data contracts", "Warehouse design"], ["dbt Cloud", "Airflow UI"]),
  "devops-cloud": profile("platform tool", ["infra", "dashboards", "scripts", "runbooks"], ["Secrets", "Rollback safety", "Noisy alerts", "Cloud cost"], ["Manual-only deploys", "No health checks", "Weak logging", "Overbroad permissions"], ["Infrastructure as code", "Observability", "Automation", "Incident response"], ["SRE basics", "Terraform modules", "Kubernetes operations", "Monitoring design"], ["Grafana", "Vercel"]),
  cybersecurity: profile("security workflow", ["scanners", "rules", "reports", "evidence"], ["False positives", "Safe testing", "Evidence quality", "Threat modeling"], ["Scary UI without guidance", "No severity model", "Logging secrets", "Unclear remediation"], ["Threat modeling", "Secure coding", "Risk scoring", "Reporting"], ["OWASP Top 10", "Detection engineering", "Auth security", "Secure defaults"], ["Snyk", "Burp Suite"]),
  "blockchain-web3": profile("on-chain product", ["contracts", "app", "scripts", "subgraph"], ["Wallet UX", "Gas costs", "Contract safety", "Network failures"], ["Trusting client state", "No testnet plan", "Ignoring failed txs", "Weak contract tests"], ["Smart contracts", "Wallet integrations", "Event indexing", "Security review"], ["Solidity testing", "Wallet UX", "Indexing", "Contract audits"], ["Uniswap", "Snapshot"]),
  desktop: profile("local-first app", ["src/ui", "src/native", "src/storage", "src/services"], ["File permissions", "Local persistence", "OS integration", "Packaging"], ["Ignoring platform conventions", "No backup path", "Blocking UI", "Weak update flow"], ["Local-first design", "Desktop shell APIs", "Persistence", "Packaging"], ["Tauri/Electron patterns", "SQLite local apps", "Desktop UX", "Auto-update flows"], ["Raycast", "Obsidian"]),
  "browser-extension": profile("browser extension", ["src/background", "src/content", "src/popup", "src/storage"], ["Manifest limits", "Page isolation", "Permissions", "Storage sync"], ["Over-requesting permissions", "Fragile DOM selectors", "No content-script errors", "Poor popup UX"], ["Extension architecture", "Browser APIs", "Content scripts", "Permission design"], ["Manifest V3", "Extension storage", "Content scripts", "Browser security"], ["Grammarly", "uBlock Origin"]),
  "automation-scripting": profile("automation workflow", ["scripts", "config", "logs", "reports"], ["Idempotency", "Dry runs", "Error recovery", "Safe file handling"], ["No preview mode", "Hardcoded paths", "Silent failures", "No logs"], ["Scripting", "CLI UX", "File safety", "Scheduling"], ["CLI design", "Cron patterns", "Playwright automation", "Shell safety"], ["GitHub Actions", "Zapier"]),
  "embedded-iot": profile("device system", ["firmware", "gateway", "dashboard", "telemetry"], ["Connectivity gaps", "Noisy sensors", "Power limits", "Firmware updates"], ["No calibration", "Ignoring reconnects", "Blocking loops", "No telemetry history"], ["Device protocols", "Telemetry", "Firmware loops", "Dashboards"], ["MQTT", "Sensor calibration", "RTOS basics", "Edge dashboards"], ["Home Assistant", "Arduino Cloud"]),
  "creative-coding": profile("creative system", ["sketches", "shaders", "presets", "exports"], ["Performance", "Parameter design", "Export quality", "Input responsiveness"], ["Unbounded effects", "No presets", "Ignoring frame rate", "No fallback rendering"], ["Generative systems", "Shaders", "Audio/visual mapping", "Performance"], ["Creative coding patterns", "GLSL", "Web Audio", "Interactive graphics"], ["p5.js gallery", "TouchDesigner"]),
};

export function enrichBlueprint(
  blueprint: PartialBlueprint,
  survey?: SurveyAnswers | null
): ProjectIdea {
  const primaryField = blueprint.developerFields[0] ?? "full-stack";
  const profileData = fieldProfiles[primaryField] ?? fieldProfiles["full-stack"];
  const stack = Array.from(
    new Set([...blueprint.recommendedStack, ...blueprint.stacks, ...(survey?.customStacks ?? [])])
  ).slice(0, 7);

  const enriched: ProjectIdea = {
    ...blueprint,
    recommendedStack: stack.length > 0 ? stack : blueprint.recommendedStack,
    buildPhases: blueprint.buildPhases ?? buildPhases(blueprint, profileData.system),
    architecture:
      blueprint.architecture ?? architecture(blueprint, profileData.system),
    suggestedStructure:
      blueprint.suggestedStructure ?? {
        label: `${blueprint.title} structure`,
        tree: profileData.structure.map((item) => `${item}/`),
      },
    scopeTiers: blueprint.scopeTiers ?? scopeTiers(blueprint),
    realWorldChallenges:
      blueprint.realWorldChallenges ??
      profileData.challenges.map((item) => `${item} in ${blueprint.title}`),
    portfolioTalkingPoints:
      blueprint.portfolioTalkingPoints ??
      [
        `Explains ${profileData.system} tradeoffs clearly`,
        `Shows realistic ${blueprint.difficulty.toLowerCase()} scope`,
        `Demonstrates ${blueprint.recommendedStack.slice(0, 3).join(", ")}`,
        `Connects product value to implementation details`,
      ],
    practicalSkills: blueprint.practicalSkills ?? profileData.skills,
    commonMistakes:
      blueprint.commonMistakes ??
      profileData.mistakes.map((item) => `${item} while building ${blueprint.title}`),
    recommendedLearning:
      blueprint.recommendedLearning ??
      profileData.learning.map((topic) => ({ title: `Study ${topic}`, topic })),
    inspiredBy: blueprint.inspiredBy ?? profileData.inspiredBy,
    timeDistribution:
      blueprint.timeDistribution ??
      [
        { label: "Planning", percentage: 15 },
        { label: "Core build", percentage: 45 },
        { label: "Testing", percentage: 20 },
        { label: "Polish", percentage: 20 },
      ],
    complexity:
      blueprint.complexity ??
      {
        frontend: scoreFrom(blueprint.portfolioValue),
        backend: scoreFrom(blueprint.learningValue),
        architecture: scoreFrom(blueprint.uniqueness),
        uiux: scoreFrom(blueprint.buildability),
        deployment: scoreFrom(blueprint.marketPotential),
      },
    teamExpansion:
      blueprint.teamExpansion ??
      {
        solo: ["Build the happy path", "Keep scope tight", "Document decisions"],
        teamOf2: ["Split UI and core logic", "Review data contracts", "Pair on polish"],
        teamOf4: ["Add QA ownership", "Assign platform work", "Create review rituals"],
      },
    monetizationIdeas:
      blueprint.monetizationIdeas ??
      ["Paid templates", "Team workspace", "Hosted version"],
    resumeImpact:
      blueprint.resumeImpact ??
      {
        junior: `Shows you can ship a complete ${primaryField} project.`,
        mid: `Shows product judgment, architecture, and implementation tradeoffs.`,
        senior: `Shows how you scope systems, reduce risk, and communicate impact.`,
      },
    aiBuildSuggestions:
      blueprint.aiBuildSuggestions ??
      [
        "Ask AI to critique the data model before coding.",
        "Generate edge-case test cases for the core workflow.",
        "Use AI to draft empty-state and error-state copy.",
        "Ask AI to review the README for clarity and scope.",
      ],
    whyThisProjectMatters:
      blueprint.whyThisProjectMatters ??
      `${blueprint.title} matters because it turns ${primaryField.replace("-", " ")} practice into a realistic, explainable product surface instead of another toy demo.`,
    featureFlow:
      blueprint.featureFlow ??
      featureFlow([
        ...blueprint.coreFeatures.slice(0, 3),
        ...blueprint.stretchFeatures.slice(0, 2),
      ]),
  };

  return enriched;
}

function profile(
  system: string,
  structure: string[],
  challenges: string[],
  mistakes: string[],
  skills: string[],
  learning: string[],
  inspiredBy: string[]
) {
  return { system, structure, challenges, mistakes, skills, learning, inspiredBy };
}

function buildPhases(blueprint: PartialBlueprint, system: string): BuildPhase[] {
  return [
    {
      title: "Scope and foundations",
      description: `Define the ${system}, success criteria, and smallest useful version.`,
      tasks: ["Write user stories", "Choose data boundaries", "Create layout skeleton"],
    },
    {
      title: "Core workflow",
      description: `Build the main ${blueprint.title} workflow end to end.`,
      tasks: blueprint.coreFeatures.slice(0, 3),
    },
    {
      title: "Operational quality",
      description: "Add validation, edge states, observability, and test coverage.",
      tasks: ["Add error states", "Test critical flows", "Document tradeoffs"],
    },
    {
      title: "Portfolio polish",
      description: "Prepare the demo, README, deployment, and talking points.",
      tasks: ["Polish interactions", "Write case study notes", "Prepare deployment checklist"],
    },
  ];
}

function architecture(blueprint: PartialBlueprint, system: string) {
  return {
    overview: `${blueprint.title} should be organized as a ${system} with clear boundaries between interface, workflow logic, data, and deployment concerns.`,
    frontend: ["Responsive screens", "Stateful workflow components", "Accessible controls"],
    backend: blueprint.features.includes("API integrations") ? ["API client layer", "Request validation", "Retry and error handling"] : ["Local service layer", "Validation utilities"],
    database: blueprint.features.includes("Database modeling") ? ["Core entities", "Indexes for common filters", "Seed/demo records"] : ["Local JSON or fixture data"],
    infrastructure: ["Environment configuration", "Build checks", "Deployment notes"],
    integrations: blueprint.features.includes("API integrations") ? ["Provider adapter", "Rate-limit handling", "Mock integration mode"] : ["Optional integration adapter"],
    security: ["Input validation", "Safe defaults", "No secrets in client code"],
  };
}

function scopeTiers(blueprint: PartialBlueprint): ScopeTier[] {
  return [
    { tier: "mini", title: "Mini", description: "Small proof of concept.", features: blueprint.coreFeatures.slice(0, 3) },
    { tier: "standard", title: "Standard", description: "Complete practical version.", features: blueprint.coreFeatures },
    { tier: "portfolio", title: "Portfolio", description: "Demo-ready with polish and metrics.", features: [...blueprint.coreFeatures, ...blueprint.stretchFeatures.slice(0, 2)] },
    { tier: "production", title: "Production", description: "Operationalized version with team-ready details.", features: [...blueprint.coreFeatures, ...blueprint.stretchFeatures] },
  ];
}

function featureFlow(items: string[]) {
  const values = items.length >= 5 ? items : ["Input", "Process", "Review", "Export", "Improve"];
  return values.slice(0, 5).map((item, index) => ({
    from: item,
    to: values[(index + 1) % values.length],
  }));
}

function scoreFrom(value: number) {
  return Math.min(10, Math.max(1, value));
}
