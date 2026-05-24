export type AIProvider = "openai" | "groq";

export type AIProviderConfig = {
  provider: AIProvider;
  label: string;
  apiKey: string;
  model: string;
  baseUrl: string;
};

const providerConfig: Record<
  AIProvider,
  {
    label: string;
    keyEnv: string;
    modelEnv: string;
    defaultModel: string;
    baseUrl: string;
  }
> = {
  openai: {
    label: "OpenAI",
    keyEnv: "OPENAI_API_KEY",
    modelEnv: "OPENAI_MODEL",
    defaultModel: "gpt-4o-mini",
    baseUrl: "https://api.openai.com/v1",
  },
  groq: {
    label: "Groq",
    keyEnv: "GROQ_API_KEY",
    modelEnv: "GROQ_MODEL",
    defaultModel: "llama-3.3-70b-versatile",
    baseUrl: "https://api.groq.com/openai/v1",
  },
};

export function getAIProvider(): AIProvider {
  const provider = (process.env.AI_PROVIDER ?? "openai").toLowerCase();

  if (provider === "openai" || provider === "groq") {
    return provider;
  }

  throw new Error(
    `Invalid AI_PROVIDER "${provider}". Use "openai" or "groq".`
  );
}

export function getAIClient(userApiKey?: string): AIProviderConfig {
  const provider = getAIProvider();
  const config = providerConfig[provider];
  const apiKey = userApiKey || process.env[config.keyEnv];

  if (!apiKey) {
    throw new Error(
      `Missing ${config.keyEnv}. Add it to .env.local or provide your own API key.`
    );
  }

  return {
    provider,
    label: config.label,
    apiKey,
    model: getAIModel(provider),
    baseUrl: config.baseUrl,
  };
}

export function getAIModel(provider: AIProvider = getAIProvider()) {
  const config = providerConfig[provider];
  return process.env[config.modelEnv] || config.defaultModel;
}

export function getPublicAIProviderInfo() {
  const provider = getAIProvider();
  const config = providerConfig[provider];

  return {
    provider,
    label: config.label,
    model: getAIModel(provider),
  };
}
