import { NextResponse } from "next/server";
import { z } from "zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

const GenerateImageSchema = z.object({
  prompt: z.string().min(1).max(1000).trim(),
  aspectRatio: z.enum(["1:1", "16:9", "4:3", "3:2"]).default("4:3"),
  negativePrompt: z.string().optional(),
  numberOfImages: z.number().min(1).max(4).default(1),
});

const XAI_IMAGE_MODEL = "grok-imagine-image-quality";

async function generateWithGrok(prompt: string, aspectRatio: string, n: number) {
  const apiKey = process.env.XAI_API_KEY; // exact env var name
  if (!apiKey) throw new Error("XAI_API_KEY not configured");

  const res = await fetch("https://api.x.ai/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: XAI_IMAGE_MODEL,
      prompt,
      n, // single batched request for up to 4 images
      aspect_ratio: aspectRatio, // snake_case as required by xAI API
      response_format: "b64_json", // get base64 directly
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`xAI API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const images = data?.data?.map((img: { b64_json: string }) => img.b64_json);
  if (!images?.length) throw new Error("xAI response missing b64_json data");
  return images as string[];
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, aspectRatio, numberOfImages } = GenerateImageSchema.parse(body);

    const images = await generateWithGrok(prompt, aspectRatio, numberOfImages);

    return NextResponse.json(
      {
        images,
        metadata: {
          prompt,
          aspectRatio,
          model: XAI_IMAGE_MODEL,
          generatedAt: new Date().toISOString(),
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.errors },
        { status: 400, headers: corsHeaders }
      );
    }
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("[Grok ImageGen]", error);
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
