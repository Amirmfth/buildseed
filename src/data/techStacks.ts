export type DeveloperField = {
  id: string;
  label: string;
  description: string;
};

export type TechStackOption = {
  id: string;
  label: string;
  category: string;
  fields: string[];
  recommended?: boolean;
};

export const developerFields: DeveloperField[] = [
  { id: "frontend", label: "Frontend", description: "Interfaces, component systems, interaction design, and rich web experiences." },
  { id: "backend", label: "Backend", description: "APIs, services, databases, queues, auth, and infrastructure-facing systems." },
  { id: "full-stack", label: "Full-stack", description: "End-to-end products spanning UI, data, backend logic, and deployment." },
  { id: "mobile", label: "Mobile", description: "Native and cross-platform apps for iOS and Android." },
  { id: "game", label: "Game", description: "Gameplay systems, tools, prototypes, level editors, and realtime interaction." },
  { id: "ai-ml", label: "AI / Machine Learning", description: "Models, ML workflows, AI-powered tools, evaluation, and applied intelligence." },
  { id: "data-engineering", label: "Data Engineering", description: "Pipelines, data quality, analytics infrastructure, and data operations." },
  { id: "devops-cloud", label: "DevOps / Cloud", description: "Deployments, observability, automation, cloud systems, and platform tooling." },
  { id: "cybersecurity", label: "Cybersecurity", description: "Security scanners, analysis tools, threat workflows, and safer systems." },
  { id: "blockchain-web3", label: "Blockchain / Web3", description: "Wallets, smart contracts, token systems, DAOs, and on-chain explorers." },
  { id: "desktop", label: "Desktop Apps", description: "Local-first tools, productivity apps, and desktop workflows." },
  { id: "browser-extension", label: "Browser Extensions", description: "Browser automation, page tools, tab workflows, and extension UX." },
  { id: "automation-scripting", label: "Automation / Scripting", description: "Scripts, bots, local automations, CLIs, and repeatable workflows." },
  { id: "embedded-iot", label: "Embedded / IoT", description: "Device data, sensors, MQTT, microcontrollers, and connected hardware." },
  { id: "creative-coding", label: "Creative Coding", description: "Generative art, shaders, particles, audio visuals, and interactive sketches." },
];

export const relatedDeveloperFields: Record<string, string[]> = {
  frontend: ["full-stack", "browser-extension", "creative-coding"],
  backend: ["full-stack", "devops-cloud", "data-engineering"],
  "full-stack": ["frontend", "backend", "mobile"],
  mobile: ["full-stack", "frontend"],
  game: ["creative-coding", "desktop"],
  "ai-ml": ["data-engineering", "backend", "automation-scripting"],
  "data-engineering": ["ai-ml", "backend", "devops-cloud"],
  "devops-cloud": ["backend", "data-engineering", "cybersecurity"],
  cybersecurity: ["backend", "devops-cloud", "automation-scripting"],
  "blockchain-web3": ["backend", "frontend", "cybersecurity"],
  desktop: ["game", "automation-scripting"],
  "browser-extension": ["frontend", "automation-scripting"],
  "automation-scripting": ["backend", "devops-cloud", "data-engineering"],
  "embedded-iot": ["automation-scripting", "data-engineering"],
  "creative-coding": ["frontend", "game", "desktop"],
};

const webFields = ["frontend", "backend", "full-stack"];
const allWeb = ["frontend", "full-stack"];

export const techStackOptions: TechStackOption[] = [
  ...make("Frontend frameworks", ["React", "Next.js", "Vue", "Nuxt", "Svelte", "SvelteKit", "Angular", "SolidJS", "Astro", "Remix", "Qwik"], allWeb, ["React", "Next.js", "Vue"]),
  ...make("Frontend languages", ["TypeScript", "JavaScript", "HTML", "CSS"], ["frontend", "full-stack", "browser-extension"], ["TypeScript"]),
  ...make("Styling", ["Tailwind CSS", "Sass", "CSS Modules", "shadcn/ui", "Radix UI", "Material UI", "Chakra UI"], allWeb, ["Tailwind CSS", "shadcn/ui"]),
  ...make("Motion and visualization", ["Framer Motion", "GSAP", "Three.js", "D3.js"], ["frontend", "creative-coding", "game"], ["Framer Motion"]),
  ...make("Frontend state and tooling", ["TanStack Query", "Zustand", "Redux Toolkit", "Vite", "Storybook"], ["frontend", "full-stack"], ["Vite", "Storybook"]),
  ...make("Backend JavaScript", ["Node.js", "Express", "Fastify", "NestJS", "Hono", "Bun", "Deno"], ["backend", "full-stack", "automation-scripting"], ["Node.js", "Express"]),
  ...make("Backend Python", ["Python", "Django", "Flask", "FastAPI"], ["backend", "full-stack", "ai-ml", "data-engineering", "automation-scripting", "cybersecurity"], ["Python", "FastAPI"]),
  ...make("Backend platforms", ["PHP", "Laravel", "Symfony", "Ruby on Rails", "Go", "Gin", "Fiber", "Java", "Spring Boot", "C#", "ASP.NET Core", "Rust", "Axum", "Actix"], ["backend", "full-stack"], ["Go", "Spring Boot", "ASP.NET Core"]),
  ...make("Databases and APIs", ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Prisma", "Drizzle", "GraphQL", "REST", "gRPC", "WebSockets"], webFields, ["PostgreSQL", "REST"]),
  ...make("Mobile", ["React Native", "Expo", "Flutter", "Dart", "Swift", "SwiftUI", "Kotlin", "Jetpack Compose", "Android SDK", "iOS SDK", "Firebase", "Supabase", "SQLite", "Realm", "WatermelonDB"], ["mobile"], ["React Native", "Expo", "Flutter", "Firebase"]),
  ...make("Game development", ["Unity", "C#", "Unreal Engine", "C++", "Godot", "GDScript", "Bevy", "Rust", "Phaser", "Three.js", "Babylon.js", "Blender", "Aseprite", "FMOD", "WebGL"], ["game"], ["Unity", "Godot", "C#"]),
  ...make("AI / ML", ["Python", "PyTorch", "TensorFlow", "Keras", "scikit-learn", "Pandas", "NumPy", "Jupyter", "Hugging Face", "LangChain", "LlamaIndex", "OpenAI API", "Anthropic API", "Gemini API", "Ollama", "Chroma", "Pinecone", "Qdrant", "Weaviate", "FAISS", "FastAPI", "Streamlit", "Gradio"], ["ai-ml"], ["Python", "PyTorch", "Hugging Face", "FastAPI"]),
  ...make("Data engineering", ["Python", "SQL", "PostgreSQL", "DuckDB", "BigQuery", "Snowflake", "dbt", "Airflow", "Dagster", "Prefect", "Spark", "Kafka", "Pandas", "Polars", "Great Expectations", "Metabase", "Superset"], ["data-engineering"], ["Python", "SQL", "dbt", "Airflow"]),
  ...make("DevOps / Cloud", ["Linux", "Docker", "Docker Compose", "Kubernetes", "Helm", "Terraform", "Ansible", "AWS", "GCP", "Azure", "Cloudflare", "Vercel", "Netlify", "Railway", "Fly.io", "GitHub Actions", "GitLab CI", "Nginx", "Caddy", "Prometheus", "Grafana", "Loki", "OpenTelemetry"], ["devops-cloud"], ["Docker", "GitHub Actions", "AWS", "Grafana"]),
  ...make("Cybersecurity", ["Python", "Bash", "Linux", "OWASP", "Burp Suite", "Nmap", "Wireshark", "Metasploit", "JWT", "OAuth", "WebAuthn", "YARA", "Sigma", "Suricata", "Zeek", "SIEM", "Cryptography", "Go", "Rust"], ["cybersecurity"], ["Python", "Linux", "OWASP"]),
  ...make("Blockchain / Web3", ["Solidity", "Ethereum", "Hardhat", "Foundry", "Ethers.js", "Viem", "Wagmi", "RainbowKit", "IPFS", "The Graph", "Polygon", "Solana", "Rust", "Anchor", "Smart Contracts"], ["blockchain-web3"], ["Solidity", "Hardhat", "Ethers.js"]),
  ...make("Desktop apps", ["Electron", "Tauri", "Rust", "Swift", "SwiftUI", "C#", "WPF", ".NET MAUI", "JavaFX", "Qt", "Python", "PySide", "SQLite"], ["desktop"], ["Electron", "Tauri", "SQLite"]),
  ...make("Browser extensions", ["Chrome Extensions", "Firefox Extensions", "Manifest V3", "JavaScript", "TypeScript", "React", "Plasmo", "WXT", "WebExtension APIs", "IndexedDB"], ["browser-extension"], ["Manifest V3", "TypeScript", "React"]),
  ...make("Automation / Scripting", ["Python", "Bash", "PowerShell", "Node.js", "Playwright", "Puppeteer", "Selenium", "Cron", "GitHub Actions", "Zapier", "n8n"], ["automation-scripting"], ["Python", "Playwright", "GitHub Actions"]),
  ...make("Embedded / IoT", ["Arduino", "ESP32", "Raspberry Pi", "C", "C++", "MicroPython", "PlatformIO", "MQTT", "Node-RED", "Home Assistant", "Sensors", "BLE", "LoRa", "RTOS"], ["embedded-iot"], ["ESP32", "MQTT", "Arduino"]),
  ...make("Creative coding", ["p5.js", "Processing", "TouchDesigner", "Three.js", "WebGL", "GLSL", "Hydra", "Tone.js", "Web Audio API", "Max/MSP", "OpenFrameworks", "Cinder"], ["creative-coding"], ["p5.js", "Three.js", "GLSL"]),
];

export function getRecommendedTechStacksForFields(fieldIds: string[]) {
  return getTechStacksForFields(fieldIds).filter((option) => option.recommended);
}

export function getTechStacksForFields(fieldIds: string[]) {
  if (fieldIds.length === 0) return techStackOptions;
  return techStackOptions.filter((option) =>
    option.fields.some((field) => fieldIds.includes(field))
  );
}

function make(
  category: string,
  labels: string[],
  fields: string[],
  recommendedLabels: string[] = []
): TechStackOption[] {
  return labels.map((label) => ({
    id: slugify(`${category}-${label}`),
    label,
    category,
    fields,
    recommended: recommendedLabels.includes(label),
  }));
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
