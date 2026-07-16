// pages/api/generate-image.js
// Grok (xAI) image generation + edit for Sanity Studio / Creative Studio
// Supports text-to-image and up to 3 reference images (image edits).

const XAI_IMAGE_MODEL = 'grok-imagine-image-quality';
const XAI_GEN_URL = 'https://api.x.ai/v1/images/generations';
const XAI_EDIT_URL = 'https://api.x.ai/v1/images/edits';

const ALLOWED_RATIOS = new Set(['1:1', '16:9', '4:3', '3:2', '9:16']);

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Max-Age', '86400');
}

function normalizeDataUri(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (trimmed.startsWith('data:image/')) return trimmed;
  // bare base64 → assume png
  if (/^[A-Za-z0-9+/=\s]+$/.test(trimmed) && trimmed.length > 64) {
    return `data:image/png;base64,${trimmed.replace(/\s/g, '')}`;
  }
  // public https URL is also accepted by xAI edits
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return null;
}

async function callXai(url, body, apiKey) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.error?.message ||
      data?.message ||
      (typeof data?.error === 'string' ? data.error : null) ||
      `xAI API error (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.details = data;
    throw err;
  }
  return data;
}

function extractImages(data) {
  const list = data?.data || [];
  return list
    .map((item) => item.b64_json || item.url)
    .filter(Boolean);
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'XAI_API_KEY is not configured' });
  }

  try {
    const {
      prompt,
      aspectRatio = '4:3',
      numberOfImages = 1,
      negativePrompt,
      referenceImages, // string[] data URIs or https URLs
      referenceImage, // single string (legacy)
    } = req.body || {};

    const trimmed = typeof prompt === 'string' ? prompt.trim() : '';
    if (!trimmed) {
      return res.status(400).json({ error: 'prompt is required' });
    }
    if (trimmed.length > 2000) {
      return res.status(400).json({ error: 'prompt max length is 2000 characters' });
    }

    const ratio = ALLOWED_RATIOS.has(aspectRatio) ? aspectRatio : '4:3';
    const n = Math.min(4, Math.max(1, Number(numberOfImages) || 1));

    // Collect up to 3 reference images (Grok multi-image edit limit)
    const rawRefs = [];
    if (Array.isArray(referenceImages)) rawRefs.push(...referenceImages);
    if (referenceImage) rawRefs.push(referenceImage);
    const refs = rawRefs
      .map(normalizeDataUri)
      .filter(Boolean)
      .slice(0, 3);

    let fullPrompt = trimmed;
    if (negativePrompt && String(negativePrompt).trim()) {
      fullPrompt += `. Avoid: ${String(negativePrompt).trim()}`;
    }

    let data;
    if (refs.length > 0) {
      // Image edit / reference-guided generation
      // Primary image + optional extras (multi-image when supported)
      const body = {
        model: XAI_IMAGE_MODEL,
        prompt: fullPrompt,
        n,
        response_format: 'b64_json',
        aspect_ratio: ratio,
        image:
          refs.length === 1
            ? { url: refs[0], type: 'image_url' }
            : refs.map((url) => ({ url, type: 'image_url' })),
      };
      data = await callXai(XAI_EDIT_URL, body, apiKey);
    } else {
      // Text-to-image
      data = await callXai(
        XAI_GEN_URL,
        {
          model: XAI_IMAGE_MODEL,
          prompt: fullPrompt,
          n,
          response_format: 'b64_json',
          aspect_ratio: ratio,
        },
        apiKey
      );
    }

    const images = extractImages(data);
    if (!images.length) {
      return res.status(500).json({
        error: 'No images returned from Grok',
        details: data,
      });
    }

    // Normalize to bare base64 for Studio plugin (it prefixes data: URI)
    const normalized = images.map((img) => {
      if (typeof img === 'string' && img.startsWith('data:')) {
        const i = img.indexOf('base64,');
        return i >= 0 ? img.slice(i + 7) : img;
      }
      return img;
    });

    return res.status(200).json({
      images: normalized,
      metadata: {
        prompt: trimmed,
        aspectRatio: ratio,
        model: XAI_IMAGE_MODEL,
        mode: refs.length ? 'edit' : 'generate',
        referenceCount: refs.length,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[generate-image]', error);
    const status = error.status && error.status >= 400 && error.status < 600 ? error.status : 500;
    return res.status(status).json({
      error: error.message || 'Internal server error',
      details: error.details || undefined,
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb', // reference images as base64
    },
  },
};
