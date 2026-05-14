/**
 * Gemini Vision — AI Product Description Generator
 * POST /api/ai/describe-product
 *
 * Accepts multipart/form-data:
 *   image: File  (jpg/png/webp, max 10MB)
 *   productName?: string
 *   category?: string
 *   priceRange?: string
 *
 * Returns JSON:
 *   { success, title, description, metaDescription, keywords, tags, occasion, colour, category }
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import formidable from 'formidable'
import fs from 'fs'

// Disable Next.js body parser — formidable handles the stream directly
export const config = { api: { bodyParser: false } }

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

// Parse multipart form using formidable v3
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
      filter: ({ mimetype }) => mimetype && mimetype.startsWith('image/'),
    })
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  let tempFilePath = null

  try {
    const { fields, files } = await parseForm(req)

    // formidable v3 returns arrays for all values
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image
    if (!imageFile) {
      return res.status(400).json({ success: false, error: 'No image file provided' })
    }

    tempFilePath = imageFile.filepath

    // Read image as base64 for Gemini inlineData
    const imageBuffer = fs.readFileSync(tempFilePath)
    const base64Image = imageBuffer.toString('base64')
    const mimeType = imageFile.mimetype || 'image/jpeg'

    // Extract optional context fields (formidable v3 returns arrays)
    const get = (key) => {
      const v = fields[key]
      return Array.isArray(v) ? v[0] : v
    }
    const productName = get('productName')
    const category = get('category')
    const priceRange = get('priceRange')

    let contextNote = ''
    if (productName) contextNote += `\nProduct name hint: ${productName}`
    if (category) contextNote += `\nCategory hint: ${category}`
    if (priceRange) contextNote += `\nPrice range: ${priceRange}`

    // Call Gemini Vision (gemini-1.5-flash — fast + multimodal)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const result = await model.generateContent([
      SYSTEM_PROMPT + contextNote,
      {
        inlineData: {
          data: base64Image,
          mimeType,
        },
      },
    ])

    const text = result.response.text().trim()

    // Strip any accidental markdown fences
    const jsonText = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()

    const parsed = JSON.parse(jsonText)

    return res.status(200).json({ success: true, ...parsed })

  } catch (error) {
    console.error('[describe-product]', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate description',
    })
  } finally {
    // Always clean up temp file
    if (tempFilePath) {
      try { fs.unlinkSync(tempFilePath) } catch (_) {}
    }
  }
}
