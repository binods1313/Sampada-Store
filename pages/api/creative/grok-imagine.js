// pages/api/creative/grok-imagine.js
// Grok (xAI) image generation for Sampada Creative Studio

const GROK_IMAGE_URL = 'https://api.x.ai/v1/images/generations';
const ALLOWED_MODELS = new Set(['grok-2-image', 'grok-2-image-1212']);
const ALLOWED_ASPECT_RATIOS = new Set(['1:1', '16:9', '9:16', '4:3']); // kept for validation but not used

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.XAI_API_KEY) {
    return res.status(500).json({ error: 'XAI_API_KEY is not configured' });
  }

  try {
    const { prompt, model = 'grok-2-image', aspectRatio } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const selectedModel = ALLOWED_MODELS.has(model) ? model : 'grok-2-image';
    // Note: Grok's image API may not support aspect_ratio as a direct parameter.
    // The frontend should incorporate aspect ratio into the prompt if needed.
    const selectedAspectRatio = ALLOWED_ASPECT_RATIOS.has(aspectRatio) ? aspectRatio : '1:1';

    if (process.env.NODE_ENV === 'development') {
      console.log('[grok-imagine] XAI_API_KEY prefix:', process.env.XAI_API_KEY?.slice(0, 6));
    }

    const grokResponse = await fetch(GROK_IMAGE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        prompt: prompt.trim(),
        n: 1,
        response_format: 'url',
        // aspect_ratio is not sent; handled in prompt by frontend if needed
      }),
    });

    const rawData = await grokResponse.json();
    console.log('[grok-imagine] Raw Grok API response:', JSON.stringify(rawData, null, 2));

    if (!grokResponse.ok) {
      const message =
        rawData?.error?.message ||
        rawData?.message ||
        `Grok API returned ${grokResponse.status}`;
      return res.status(grokResponse.status).json({
        error: message,
        details: rawData,
      });
    }

    const imageUrl = rawData?.data?.[0]?.url || rawData?.data?.[0]?.b64_json;

    if (!imageUrl) {
      return res.status(500).json({
        error: 'No image returned from Grok API',
        details: rawData,
      });
    }

    return res.status(200).json({
      imageUrl,
      model: selectedModel,
      aspectRatio: selectedAspectRatio,
      prompt: prompt.trim(),
    });
  } catch (err) {
    console.error('Grok image generation error:', err.message);
    return res.status(500).json({
      error: err.message,
      details: err.response?.data || null,
    });
  }
}