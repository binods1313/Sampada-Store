---
name: xai-image-gen-design
description: Design spec for integrating xAI Grok image generation into Sanity Studio
metadata:
  type: reference
---

# Design Spec – AI‑Generated Product Images (xAI Grok)

**Goal**: Add an “AI Generate” button to the product image field in Sanity Studio that calls a Next.js API route, which in turn talks to xAI Grok and returns base‑64‑encoded images. Images are stored as draft assets (no auto‑publish).

---

## 1. Install plugin
```bash
npm install sanity-plugin-image-gen
```
The plugin supplies a UI button that can be wired to a custom API endpoint.

---

## 2. Studio configuration
**File**: `E:\Sampada-Store\sanity_abscommerce\sanity.config.js`
```ts
import { defineConfig } from 'sanity';
import { visionTool } from '@sanity/vision';
import { structureTool } from 'sanity/structure';
import { codeInput } from '@sanity/code-input';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure';
import { BulkEditTool } from './plugins/bulk-edit/BulkEditTool';
import { BulkPriceUpdate } from './plugins/bulk-edit/BulkPriceUpdate';
import { assist } from '@sanity/assist';
import { smartAssetManager } from 'sanity-plugin-smart-asset-manager';
import { blockStyles } from 'sanity-plugin-block-styles';
import { references } from 'sanity-plugin-references';
import { media } from 'sanity-plugin-media';
import { documentInternationalization } from '@sanity/document-internationalization';
import { recursiveHierarchyPlugin as recursiveHierarchy } from 'sanity-plugin-recursive-hierarchy';
import { customColorPicker as colorInput } from 'sanity-plugin-color-input';
import { imageGen } from 'sanity-plugin-image-gen'; // <-- new import

const apiVersion = '2024-05-18';

export default defineConfig({
  name: 'default',
  title: 'abscommerce',
  projectId: '7lh35oho',
  dataset: 'production',
  apiVersion,
  plugins: [
    // … existing plugins …
    imageGen({
      apiEndpoint: 'http://localhost:3000/api/generate-image', // dev endpoint – will be switched to production before deploy
    }),
  ],
  schema: { types: schemaTypes },
});
```
**Note**: The endpoint will be changed to `https://sampadaoriginals.in/api/generate-image` after successful local verification.

---

## 3. Next.js API route (App Router)
**File**: `E:\Sampada-Store\app\api\generate-image\route.ts`
```ts
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
```
**Key implementation notes**:
- The request body sent to xAI uses **`aspect_ratio`** (snake_case) and **`response_format: "b64_json"`**.
- The **`n`** parameter performs a **single batched request** for up to four images; we do **not** loop over the API.
- Errors are returned with proper HTTP status codes.

---

## 4. Verification steps (Step 5)
1. Run `npm run dev`.
2. **cURL test** against `http://localhost:3000/api/generate-image` – expect a JSON payload with a non‑empty `images` array of base64 strings.
3. Open Sanity Studio, locate a product document, open the image field, and confirm the “AI Generate” option appears in the asset source menu.
4. Generate an image; verify the preview appears and a draft asset with correct hotspot/crop metadata is created.
5. Ensure no existing product data or other fields are altered.
6. After local success, edit `sanity.config.js` to point `apiEndpoint` to the production URL `https://sampadaoriginals.in/api/generate-image`.
7. Commit the changes (excluding `.env`) and deploy.
8. Confirm the button works in the hosted Studio (`binod-tech-ventures.sanity.studio`).

---

## 5. Safety & Guardrails
- **Never** commit `.env` or the `XAI_API_KEY`.
- No changes to existing image schema types.
- Generated assets remain drafts until manually published.
- No modifications to pricing, variant logic, or unrelated schemas.

---

**Next step**: Self‑review this spec for placeholders or contradictions, then generate the implementation plan using the `writing-plans` skill.