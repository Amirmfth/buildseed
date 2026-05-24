export const customizationPresets = [
  { id: "make-easier", label: "Make it easier", instruction: "Reduce complexity, simplify architecture, remove advanced features, keep learning value, and preserve the project identity." },
  { id: "make-harder", label: "Make it harder", instruction: "Increase technical depth with more advanced architecture, edge cases, and implementation challenges while keeping scope realistic." },
  { id: "portfolio-worthy", label: "Make it more portfolio-worthy", instruction: "Strengthen portfolio talking points, add impressive but realistic features, improve architecture, and sharpen resume impact." },
  { id: "startup-ready", label: "Make it startup-ready", instruction: "Reframe the blueprint as a credible MVP with onboarding, analytics, operational workflows, and monetization potential." },
  { id: "beginner-friendly", label: "Make it beginner-friendly", instruction: "Simplify the scope, explain phases more clearly, reduce architecture complexity, and keep core learning outcomes strong." },
  { id: "add-ai", label: "Add AI features", instruction: "Add practical AI-assisted features where useful, including prompt/data flow, safety boundaries, and non-AI fallback behavior." },
  { id: "remove-ai", label: "Remove AI dependency", instruction: "Remove AI requirements and replace them with deterministic, local, or rules-based functionality." },
  { id: "mobile-first", label: "Make it mobile-first", instruction: "Adjust UX, architecture, and stack toward mobile usage with offline/responsive considerations." },
  { id: "backend-heavy", label: "Make it backend-heavy", instruction: "Emphasize APIs, data modeling, queues, observability, security, and backend architecture." },
  { id: "frontend-focused", label: "Make it frontend-focused", instruction: "Emphasize UI systems, interaction quality, state management, accessibility, and visual polish." },
  { id: "cheaper-build", label: "Make it cheaper to build", instruction: "Reduce paid services, prefer free tiers/local tools, and simplify infrastructure." },
  { id: "monetization", label: "Add monetization", instruction: "Add realistic monetization ideas and update scope tiers, architecture, and portfolio talking points accordingly." },
  { id: "weekend-scope", label: "Reduce scope to weekend project", instruction: "Reduce estimated time and features to a weekend-sized version while keeping a useful demo." },
  { id: "production-version", label: "Expand to production version", instruction: "Expand architecture, deployment, testing, security, observability, and team handoff guidance for production readiness." },
  { id: "selected-stack", label: "Use my selected stack", instruction: "Prioritize the user's selected survey stack and custom stack items when updating recommendedStack, phases, and architecture." },
  { id: "replace-stack", label: "Replace stack", instruction: "Replace the stack according to the user's freeform message and make all architecture/build phases consistent with the new stack." },
  { id: "testing-plan", label: "Add testing plan", instruction: "Add a concrete testing plan covering unit, integration, workflow, and deployment checks." },
  { id: "deployment-plan", label: "Add deployment plan", instruction: "Add a concrete deployment plan including environments, hosting, secrets, and release checklist." },
] as const;

export type CustomizationPresetId = (typeof customizationPresets)[number]["id"];

export function getPresetInstructions(ids: string[]) {
  const selected = new Set(ids);
  return customizationPresets
    .filter((preset) => selected.has(preset.id))
    .map((preset) => `- ${preset.label}: ${preset.instruction}`);
}
