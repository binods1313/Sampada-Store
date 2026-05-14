/**
 * Gemini Vision — AI Product Description Generator
 * POST /api/ai/describe-product
 *
 * Accepts JSON body:
 *   imageBase64: string  — base64 image data (strip data:image/...;base64, prefix)
 *   mimeType?: string    — e.g. "image/jpeg" (default)
 *   productName?: string
 *   category?: string
 *   priceRange?: string
 *
 * Returns JSON:
 *   { success, title, description, metaDescription, keywords, tags, occasion, colour, category }
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_AI_API_KEY ||
  process.env.GOOGLE_AI_KEY
)

const SYSTEM_PROMPT = `You are an expert fashion e-commerce copywriter for Sampada — a premium Indian heritage fashion brand.

Analyse the product image and generate the following in valid JSON format only (no markdown, no explanation, no code fences):

{
  "title": "Product name — 4-7 words, elegant and specific",
  "description": "2-3 sentence product description — highlight fabric, occasion, style. Warm, premium tone. 60-80 words.",
  "metaDescription": "SEO meta description — 150-160 characters, includes brand name Sampada",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "tags": ["tag1", "tag2", "tag3"],
  "occasion": "one of: Casual / Festive / Premium / Summer / Winter / Campus",
  "colour": "primary colour of the garment",
  "category": "one of: Women's Clothing / Men's Clothing / Ethnic Wear / Western Wear / Accessories"
}

Rules:
- Title must be specific (e.g. "Ivory Embroidered Kurta Set" not "Beautiful Dress")
- Keywords must be relevant to Indian fashion e-commerce
- Tags should be short (1-2 words each)
- Return ONLY the JSON object, nothing else`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { imageBase64, mimeType = 'image/jpeg', productName, category, priceRange } = req.body

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'imageBase64 is required' })
    }

    // Strip data URI prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')

    let contextNote = ''
    if (productName) contextNote += `\nProduct name hint: ${productName}`
    if (category) contextNote += `\nCategory hint: ${category}`
    if (priceRange) contextNote += `\nPrice range: ${priceRange}`

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const result = await model.generateContent([
      SYSTEM_PROMPT + contextNote,
      {
        inlineData: {
          data: base64Data,
          mimeType,
        },
      },
    ])

    const text = result.response.text().trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()

    const parsed = JSON.parse(text)

    return res.status(200).json({ success: true, ...parsed })
  } catch (error) {
    console.error('[describe-product]', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate description',
    })
  }
}
