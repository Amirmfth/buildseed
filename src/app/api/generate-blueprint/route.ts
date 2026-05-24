import { NextResponse } from "next/server";

import { buildBlueprintPrompt } from "@/lib/ai/blueprintPrompt";
import {
  normalizeGeneratedBlueprint,
  safeSlug,
  validateGeneratedBlueprint,
} from "@/lib/ai/blueprintSchema";
import { getAIClient, getPublicAIProviderInfo } from "@/lib/ai/providers";
import type { SurveyAnswers } from "@/lib/types";

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
      answers?: SurveyAnswers;
      userApiKey?: string;
    };

    if (!body.answers) {
      return NextResponse.json({ error: "Missing survey answers." }, { status: 400 });
    }

    const client = getAIClient(body.userApiKey);

    const response = await fetch(`${client.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${client.apiKey}`,
      },
      body: JSON.stringify({
        model: client.model,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You generate concise, realistic software project blueprints. Return valid JSON only.",
          },
          { role: "user", content: buildBlueprintPrompt(body.answers) },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `AI request failed with ${client.label}. Check the API key and model, then try again.`,
        },
        { status: response.status }
      );
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "AI returned an empty response. Try again." },
        { status: 502 }
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON. Try generating again." },
        { status: 502 }
      );
    }

    const normalized = normalizeGeneratedBlueprint(parsedJson, body.answers);
    const parsed = validateGeneratedBlueprint(normalized);
    const slug = safeSlug(parsed.slug || parsed.title);

    return NextResponse.json({
      blueprint: {
        ...parsed,
        id: `ai-${slug}`,
        slug,
        generated: true,
        source: "ai",
        matchType: "ai",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not generate a valid blueprint. Try again.",
      },
      { status: 400 }
    );
  }
}
