// pages/api/creative/grok-video.js
// Grok (xAI) video generation placeholder for Sampada Creative Studio

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.XAI_API_KEY) {
    return res.status(500).json({ error: 'XAI_API_KEY is not configured' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Video generation endpoint wiring can be added when xAI video API is available.
    return res.status(501).json({
      error: 'Grok video generation is not yet implemented',
      message: 'XAI_API_KEY is configured and ready for video integration.',
    });
  } catch (err) {
    console.error('Grok video generation error:', err.message);
    return res.status(500).json({
      error: err.message,
      details: err.response?.data || null,
    });
  }
}