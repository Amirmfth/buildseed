import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { getAIClient } from "@/lib/ai/providers";
import type { ProjectIdea } from "@/lib/types";

const actionInstructions: Record<string, string> = {
  improve:
    "Improve this blueprint's specificity, architecture, build phases, risks, and portfolio value while preserving its identity.",
  missing:
    "Generate or improve any missing or weak rich blueprint sections. Keep existing good content.",
  beginner:
    "Rewrite this blueprint to be beginner-friendly while keeping a useful learning path.",
  similar:
    "Create 5 similar but meaningfully distinct blueprint JSON objects as an array.",
  rewrite:
    "Rewrite this blueprint for the requested target developer field while keeping the original idea recognizable.",
};

export async function POST(request: Request) {
  await requireAdmin();
  const body = (await request.json()) as {
    action?: string;
    blueprint?: ProjectIdea;
    targetField?: string;
  };

  if (!body.action || !actionInstructions[body.action]) {
    return NextResponse.json({ error: "Invalid AI tool action." }, { status: 400 });
  }
  if (!body.blueprint) {
    return NextResponse.json({ error: "Missing blueprint." }, { status: 400 });
  }

  const client = getAIClient();
  const prompt = `You are an admin assistant for BuildSeed blueprint editing.
Return valid JSON only. For similar, return {"blueprints":[...]}. For all other actions, return {"blueprint":{...}}.
Every returned blueprint must match the full ProjectIdea schema with rich planning fields.

Action:
${actionInstructions[body.action]}

Target field if provided:
${body.targetField || "None"}

Blueprint:
${JSON.stringify(body.blueprint, null, 2)}
`;

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
            "You edit developer project blueprints for an admin. Return JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.55,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `AI request failed with ${client.label}.` },
      { status: 400 }
    );
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    return NextResponse.json({ error: "AI returned an empty response." }, { status: 400 });
  }

  try {
    return NextResponse.json(JSON.parse(cleanJson(content)));
  } catch {
    return NextResponse.json({ error: "AI returned invalid JSON." }, { status: 400 });
  }
}

function cleanJson(content: string) {
  return content
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
}
