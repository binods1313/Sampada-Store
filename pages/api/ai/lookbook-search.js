/**
 * Lookbook RAG — Natural Language Search over Kavya Portfolio
 * POST /api/ai/lookbook-search
 *
 * Accepts a natural language query like "casual looks with earthy tones"
 * Uses Gemini to extract filter criteria that map to the gallery's category/colour system.
 *
 * Body: { query: string }
 * Returns: { success, category, colours[], mood, message, indices[] }
 *
 * Since images have no real metadata (only round-robin categories),
 * Gemini returns a category filter + a descriptive message.
 * The gallery uses the category to filter and shows a contextual message.
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_AI_API_KEY ||
  process.env.GOOGLE_AI_KEY
)

const CATEGORIES = ['Casual', 'Festive', 'Premium', 'Summer', 'Winter', 'Campus']

const PROMPT = `You are a fashion lookbook assistant for Sampada — a premium Indian heritage fashion brand.

The lookbook has 117 images of Kavya organised into these categories: Casual, Festive, Premium, Summer, Winter, Campus.

Given a natural language search query, extract the best matching category and return ONLY valid JSON (no markdown):

{
  "category": "one of: All | Casual | Festive | Premium | Summer | Winter | Campus",
  "message": "A warm 1-sentence response describing what you found (e.g. 'Here are Kavya's festive looks — perfect for celebrations!')",
  "mood": "2-3 word mood description (e.g. 'elegant and festive')"
}

Mapping guide:
- wedding, celebration, diwali, puja, ethnic → Festive
- beach, holiday, hot weather, light → Summer
- college, everyday, relaxed, chill → Casual
- luxury, designer, high-end, formal → Premium
- cozy, warm, layered, cold → Winter
- campus, student, young, trendy → Campus
- earthy, neutral, minimal → Casual
- bold, colourful, vibrant → Festive
- If unclear → All

User query: `

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { query } = req.body
  if (!query?.trim()) {
    return res.status(400).json({ success: false, error: 'query is required' })
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(PROMPT + `"${query.trim()}"`)
    const text = result.response.text().trim()
      .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()

    const parsed = JSON.parse(text)

    // Validate category
    const validCategories = ['All', ...CATEGORIES]
    if (!validCategories.includes(parsed.category)) {
      parsed.category = 'All'
    }

    return res.status(200).json({
      success: true,
      category: parsed.category,
      message: parsed.message || `Showing ${parsed.category === 'All' ? 'all' : parsed.category.toLowerCase()} looks`,
      mood: parsed.mood || '',
    })
  } catch (error) {
    console.error('[lookbook-search]', error)
    // Graceful fallback — don't break the gallery
    return res.status(200).json({
      success: true,
      category: 'All',
      message: `Showing all looks for "${query}"`,
      mood: '',
    })
  }
}
