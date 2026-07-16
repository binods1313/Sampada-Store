import { NextResponse } from "next/server";
import { z } from "zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

const GenerateImageSchema = z.object({
  prompt: z.string().min(1).max(2000).trim(),
  aspectRatio: z.enum(["1:1", "16:9", "4:3", "3:2", "9:16"]).default("4:3"),
  negativePrompt: z.string().optional(),
  numberOfImages: z.number().min(1).max(4).default(1),
  referenceImage: z.string().optional(),
  referenceImages: z.array(z.string()).max(3).optional(),
});

const XAI_IMAGE_MODEL = "grok-imagine-image-quality";
const XAI_GEN_URL = "https://api.x.ai/v1/images/generations";
const XAI_EDIT_URL = "https://api.x.ai/v1/images/edits";

function normalizeDataUri(input: string): string | null {
  const trimmed = input.trim();
  if (trimmed.startsWith("data:image/")) return trimmed;
  if (/^[A-Za-z0-9+/=\s]+$/.test(trimmed) && trimmed.length > 64) {
    return `data:image/png;base64,${trimmed.replace(/\s/g, "")}`;
  }
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return null;
}

function extractImages(data: any): string[] {
  const list = data?.data || [];
  return list
    .map((item: { b64_json?: string; url?: string }) => item.b64_json || item.url)
    .filter(Boolean);
}

function toBareBase64(img: string): string {
  if (img.startsWith("data:")) {
    const i = img.indexOf("base64,");
    return i >= 0 ? img.slice(i + 7) : img;
  }
  return img;
}

async function callXai(url: string, body: object, apiKey: string) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.error?.message ||
      data?.message ||
      (typeof data?.error === "string" ? data.error : null) ||
      `xAI API error (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) throw new Error("XAI_API_KEY not configured");

    const body = await request.json();
    const parsed = GenerateImageSchema.parse(body);
    const { prompt, aspectRatio, numberOfImages, negativePrompt } = parsed;

    const rawRefs = [
      ...(parsed.referenceImages || []),
      ...(parsed.referenceImage ? [parsed.referenceImage] : []),
    ];
    const refs = rawRefs.map(normalizeDataUri).filter(Boolean).slice(0, 3) as string[];

    let fullPrompt = prompt;
    if (negativePrompt?.trim()) {
      fullPrompt += `. Avoid: ${negativePrompt.trim()}`;
    }

    let data: any;
    if (refs.length > 0) {
      data = await callXai(
        XAI_EDIT_URL,
        {
          model: XAI_IMAGE_MODEL,
          prompt: fullPrompt,
          n: numberOfImages,
          response_format: "b64_json",
          aspect_ratio: aspectRatio,
          image:
            refs.length === 1
              ? { url: refs[0], type: "image_url" }
              : refs.map((url) => ({ url, type: "image_url" })),
        },
        apiKey
      );
    } else {
      data = await callXai(
        XAI_GEN_URL,
        {
          model: XAI_IMAGE_MODEL,
          prompt: fullPrompt,
          n: numberOfImages,
          response_format: "b64_json",
          aspect_ratio: aspectRatio,
        },
        apiKey
      );
    }

    const images = extractImages(data).map(toBareBase64);
    if (!images.length) throw new Error("xAI response missing image data");

    return NextResponse.json(
      {
        images,
        metadata: {
          prompt,
          aspectRatio,
          model: XAI_IMAGE_MODEL,
          mode: refs.length ? "edit" : "generate",
          referenceCount: refs.length,
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
