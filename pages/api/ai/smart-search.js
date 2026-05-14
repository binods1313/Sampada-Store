/**
 * Gemini Smart Search
 * POST /api/ai/smart-search
 *
 * Accepts a natural language query like "festive outfit under ₹1500"
 * Uses Gemini to extract intent (category, occasion, maxPrice, colour, keywords)
 * Then runs a GROQ query against Sanity and returns matching products.
 *
 * Body: { query: string }
 * Returns: { success, products[], intent, message }
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@sanity/client'

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_AI_API_KEY ||
  process.env.GOOGLE_AI_KEY
)

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7lh35oho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-18',
  useCdn: true,
})

const INTENT_PROMPT = `You are a fashion search assistant for Sampada — a premium Indian heritage fashion brand.

Extract search intent from the user's query and return ONLY valid JSON (no markdown):

{
  "keywords": ["word1", "word2"],
  "category": "Women's Clothing | Men's Clothing | Ethnic Wear | Western Wear | Accessories | null",
  "occasion": "Casual | Festive | Premium | Summer | Winter | Campus | null",
  "maxPrice": number_or_null,
  "colour": "colour_name_or_null",
  "message": "A warm 1-sentence response acknowledging the search"
}

Examples:
- "festive outfit under ₹1500" → keywords:["festive","outfit"], occasion:"Festive", maxPrice:1500
- "something for a beach holiday" → keywords:["beach","summer"], occasion:"Summer"
- "red kurta for wedding" → keywords:["kurta","wedding"], colour:"red", occasion:"Festive"
- "casual tshirt for college" → keywords:["tshirt","casual"], occasion:"Campus"

User query: `

async function extractIntent(query) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const result = await model.generateContent(INTENT_PROMPT + `"${query}"`)
  const text = result.response.text().trim()
    .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()
  return JSON.parse(text)
}

async function searchProducts(intent) {
  const conditions = [`_type == "product"`, `status in ["published", "active"]`]

  // Price filter
  if (intent.maxPrice) {
    conditions.push(`price <= ${intent.maxPrice}`)
  }

  // Keyword filter — search name, details, tags
  if (intent.keywords?.length > 0) {
    const kwConditions = intent.keywords.map(kw =>
      `(name match "*${kw}*" || details match "*${kw}*" || "${kw}" in tags)`
    )
    conditions.push(`(${kwConditions.join(' || ')})`)
  }

  // Occasion filter via tags
  if (intent.occasion) {
    conditions.push(
      `(lower(intent.occasion) in tags || details match "*${intent.occasion}*")`
        .replace('intent.occasion', `"${intent.occasion.toLowerCase()}"`)
    )
  }

  // Colour filter
  if (intent.colour) {
    conditions.push(
      `(details match "*${intent.colour}*" || "${intent.colour}" in tags)`
    )
  }

  const groq = `*[${conditions.join(' && ')}] | order(_createdAt desc) [0...12] {
    _id,
    name,
    "slug": slug.current,
    price,
    discount,
    details,
    tags,
    "image": image[0].asset->url,
    "category": category->name
  }`

  const products = await sanity.fetch(groq)

  // Fallback: if no results with all filters, relax to keyword-only
  if (products.length === 0 && intent.keywords?.length > 0) {
    const fallbackGroq = `*[_type == "product" && status in ["published", "active"] && (
      ${intent.keywords.map(kw => `name match "*${kw}*"`).join(' || ')}
    )] | order(_createdAt desc) [0...8] {
      _id, name, "slug": slug.current, price, discount, details, tags,
      "image": image[0].asset->url, "category": category->name
    }`
    return sanity.fetch(fallbackGroq)
  }

  return products
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { query } = req.body
  if (!query?.trim()) {
    return res.status(400).json({ success: false, error: 'query is required' })
  }

  try {
    // Extract intent with Gemini
    const intent = await extractIntent(query.trim())

    // Search Sanity with extracted intent
    const products = await searchProducts(intent)

    return res.status(200).json({
      success: true,
      intent,
      products,
      message: intent.message || `Here are some looks for "${query}"`,
      total: products.length,
    })
  } catch (error) {
    console.error('[smart-search]', error)
    return res.status(500).json({ success: false, error: error.message })
  }
}
