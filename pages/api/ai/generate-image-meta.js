// pages/api/ai/generate-image-meta.js
// Generates SEO-friendly alt text + caption for product images (Sanity Studio)
// Uses xAI when available; falls back to template copy from product fields.

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')
}

function stripJsonFence(text) {
  if (!text) return text
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

function templateFallback({ productName, category, details }) {
  const name = (productName || 'Product').trim()
  const cat = (category || '').trim()
  const alt = cat
    ? `${name} — ${cat} from Sampada Originals`
    : `${name} product image from Sampada Originals`
  const detailSnippet = (details || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120)
  const caption = detailSnippet
    ? `${name}. ${detailSnippet}${detailSnippet.length >= 120 ? '…' : ''}`
    : `${name} — premium piece from Sampada Originals. Wear your legacy.`
  return {
    alt: alt.slice(0, 125),
    caption: caption.slice(0, 200),
  }
}

async function generateWithXai({ productName, category, details, price, imageUrl }) {
  const apiKey = process.env.XAI_API_KEY
  if (!apiKey) return null

  const system = `You write accessibility alt text and short captions for Sampada Originals, a premium Indian heritage fashion e-commerce brand.
Return ONLY valid JSON (no markdown):
{"alt":"...","caption":"..."}

Rules:
- alt: concise, factual, for screen readers & SEO, max 125 characters. Include product name when known. No keyword stuffing.
- caption: elegant marketing line, 1 sentence, max 160 characters. Warm premium tone. Optional brand nod to Sampada.
- Do not invent fabric/specs not implied by the data or image.
- No quotation marks wrapping the whole string beyond JSON.`

  const textParts = [
    `Product name: ${productName || 'Unknown'}`,
    category ? `Category: ${category}` : null,
    price != null && price !== '' ? `Price: ${price}` : null,
    details ? `Details: ${String(details).slice(0, 500)}` : null,
    'Write alt and caption for this product image.',
  ]
    .filter(Boolean)
    .join('\n')

  const userContent = imageUrl
    ? [
        { type: 'text', text: textParts },
        { type: 'image_url', image_url: { url: imageUrl } },
      ]
    : textParts

  // Prefer vision-capable chat models when an image is provided
  const model = imageUrl
    ? process.env.XAI_VISION_MODEL || 'grok-2-vision-1212'
    : process.env.XAI_TEXT_MODEL || 'grok-3-mini'

  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 250,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userContent },
      ],
    }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data?.error?.message || data?.message || `xAI error ${res.status}`
    throw new Error(msg)
  }

  const raw = data?.choices?.[0]?.message?.content || ''
  const parsed = JSON.parse(stripJsonFence(raw))
  if (!parsed?.alt || !parsed?.caption) {
    throw new Error('Invalid AI response shape')
  }
  return {
    alt: String(parsed.alt).trim().slice(0, 125),
    caption: String(parsed.caption).trim().slice(0, 200),
    model,
  }
}

export default async function handler(req, res) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      productName,
      category,
      details,
      price,
      imageUrl,
    } = req.body || {}

    if (!productName && !imageUrl && !details) {
      return res.status(400).json({
        error: 'Need at least productName, details, or imageUrl',
      })
    }

    let result
    let source = 'template'

    try {
      result = await generateWithXai({
        productName,
        category,
        details,
        price,
        imageUrl,
      })
      if (result) source = 'xai'
    } catch (aiErr) {
      console.warn('[generate-image-meta] AI failed, using template:', aiErr.message)
      result = null
    }

    if (!result) {
      result = templateFallback({ productName, category, details })
    }

    return res.status(200).json({
      alt: result.alt,
      caption: result.caption,
      source,
      model: result.model || null,
    })
  } catch (error) {
    console.error('[generate-image-meta]', error)
    return res.status(500).json({
      error: error.message || 'Failed to generate alt/caption',
    })
  }
}
