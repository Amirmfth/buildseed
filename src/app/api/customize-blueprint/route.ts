import { NextResponse } from "next/server";

import { buildCustomizeBlueprintPrompt } from "@/lib/ai/customizeBlueprintPrompt";
import { normalizeCustomizedBlueprint } from "@/lib/ai/customizeBlueprint";
import { getPresetInstructions } from "@/lib/ai/customizationPresets";
import { getAIClient, getPublicAIProviderInfo } from "@/lib/ai/providers";
import type { ProjectIdea, SurveyAnswers } from "@/lib/types";

const MAX_REQUEST_LENGTH = 1400;

export async function GET() {
  try {
    return NextResponse.json(getPublicAIProviderInfo());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Invalid AI provider configuration.",
      },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      blueprint?: ProjectIdea;
      customizationRequest?: string;
      selectedPresets?: string[];
      customMessage?: string;
      answers?: SurveyAnswers | null;
      userApiKey?: string;
    };

    if (!body.blueprint) {
      return NextResponse.json({ error: "Missing blueprint to customize." }, { status: 400 });
    }

    const customMessage =
      body.customMessage?.trim() ?? body.customizationRequest?.trim() ?? "";
    const selectedPresets = Array.isArray(body.selectedPresets)
      ? body.selectedPresets
      : [];
    const presetInstructions = getPresetInstructions(selectedPresets);
    const customizationRequest = customMessage || "Apply the selected preset changes.";

    if (!customMessage && presetInstructions.length === 0) {
      return NextResponse.json({ error: "Choose a preset or describe what you want to change first." }, { status: 400 });
    }

    if (customMessage.length > MAX_REQUEST_LENGTH) {
      return NextResponse.json(
        { error: "Customization request is too long. Keep it under 1,400 characters." },
        { status: 400 }
      );
    }

    const client = getAIClient(body.userApiKey);

    const parsedBlueprint = await requestCustomizedBlueprint({
      client,
      blueprint: body.blueprint,
      customizationRequest,
      presetInstructions,
      answers: body.answers,
    });

    const blueprint = normalizeCustomizedBlueprint({
      value: parsedBlueprint,
      baseBlueprint: body.blueprint,
      answers: body.answers,
    });

    return NextResponse.json({ blueprint });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not customize this blueprint. Try again.",
      },
      { status: 400 }
    );
  }
}

async function requestCustomizedBlueprint(input: {
  client: ReturnType<typeof getAIClient>;
  blueprint: ProjectIdea;
  customizationRequest: string;
  presetInstructions: string[];
  answers?: SurveyAnswers | null;
}) {
  let lastJsonError = false;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch(`${input.client.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${input.client.apiKey}`,
      },
      body: JSON.stringify({
        model: input.client.model,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You customize realistic software project blueprints. Return valid JSON only.",
          },
          {
            role: "user",
            content: buildCustomizeBlueprintPrompt({
              blueprint: input.blueprint,
              request: input.customizationRequest,
              presetInstructions: input.presetInstructions,
              answers: input.answers,
            }),
          },
        ],
        temperature: 0.65,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `AI customization failed with ${input.client.label}. Check the API key and model, then try again.`
      );
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("AI returned an empty response. Try customizing again.");
    }

    try {
      return parseAIJson(content);
    } catch {
      lastJsonError = true;
    }
  }

  if (lastJsonError) {
    throw new Error("AI returned invalid JSON. Try customizing again.");
  }

  throw new Error("Could not customize this blueprint. Try again.");
}

function parseAIJson(content: string) {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}
