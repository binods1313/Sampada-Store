/**
 * Style Assistant API
 * POST /api/ai/style-assistant
 *
 * A conversational fashion assistant that recommends real Sampada products.
 * Maintains conversation history, fetches matching products from Sanity,
 * and returns both a natural language response and product cards.
 *
 * Body: { message: string, history?: [{role, content}] }
 * Returns: { success, reply, products[], suggestions[] }
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

const SYSTEM_PROMPT = `You are Kavya's Style Assistant — a warm, knowledgeable fashion advisor for Sampada, a premium Indian heritage fashion brand.

Your personality:
- Warm, elegant, and encouraging — like a stylish friend
- Deep knowledge of Indian fashion, occasions, and styling
- Always recommend specific looks and explain why they work

Your job:
1. Understand what the customer needs (occasion, budget, style preference)
2. Extract 2-3 search keywords from their request
3. Give a warm, helpful response (2-3 sentences max)
4. End with a JSON block for product search (this will be parsed, not shown to user)

ALWAYS end your response with this exact format:
<search>{"keywords":["kw1","kw2"],"occasion":"Casual|Festive|Premium|Summer|Winter|Campus|null","maxPrice":null_or_number}</search>

Example response:
"For a festive evening, I'd suggest something in rich jewel tones — a silk kurta or embroidered set would be perfect. Sampada's festive range has some stunning options that balance tradition with modern elegance. Let me find the best ones for you!
<search>{"keywords":["festive","kurta","silk"],"occasion":"Festive","maxPrice":null}</search>"

Keep responses concise and warm. Never mention the <search> tag to the user.`

async function fetchProductsForSearch(searchParams) {
  const { keywords = [], occasion, maxPrice } = searchParams
  const conditions = [`_type == "product"`, `status in ["published", "active"]`]

  if (maxPrice) conditions.push(`price <= ${maxPrice}`)

  if (keywords.length > 0) {
    const kwConds = keywords.map(kw =>
      `(name match "*${kw}*" || details match "*${kw}*" || "${kw}" in tags)`
    )
    conditions.push(`(${kwConds.join(' || ')})`)
  }

  if (occasion && occasion !== 'null') {
    conditions.push(`("${occasion.toLowerCase()}" in tags || details match "*${occasion}*")`)
  }

  const groq = `*[${conditions.join(' && ')}] | order(_createdAt desc) [0...6] {
    _id, name, "slug": slug.current, price, discount, details, tags,
    "image": image[0].asset->url, "category": category->name
  }`

  try {
    const products = await sanity.fetch(groq)
    if (products.length === 0 && keywords.length > 0) {
      // Fallback: name match only
      const fallback = `*[_type == "product" && status in ["published","active"] && (
        ${keywords.map(kw => `name match "*${kw}*"`).join(' || ')}
      )] | order(_createdAt desc) [0...6] {
        _id, name, "slug": slug.current, price, discount, details, tags,
        "image": image[0].asset->url, "category": category->name
      }`
      return sanity.fetch(fallback)
    }
    return products
  } catch {
    return []
  }
}

function parseSearchBlock(text) {
  const match = text.match(/<search>([\s\S]*?)<\/search>/)
  if (!match) return null
  try {
    return JSON.parse(match[1])
  } catch {
    return null
  }
}

function cleanReply(text) {
  return text.replace(/<search>[\s\S]*?<\/search>/g, '').trim()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { message, history = [] } = req.body
  if (!message?.trim()) {
    return res.status(400).json({ success: false, error: 'message is required' })
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Build conversation history for Gemini
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: "I'm Kavya's Style Assistant! I'm here to help you find the perfect Sampada look. What occasion are you dressing for today?" }] },
        ...history.map(h => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        })),
      ],
    })

    const result = await chat.sendMessage(message)
    const rawReply = result.response.text()

    // Extract search params and clean reply
    const searchParams = parseSearchBlock(rawReply)
    const cleanedReply = cleanReply(rawReply)

    // Fetch matching products
    let products = []
    if (searchParams) {
      products = await fetchProductsForSearch(searchParams)
    }

    // Generate follow-up suggestions
    const suggestions = [
      'Show me something under ₹1000',
      'What about festive wear?',
      'I need something casual',
      'Show me your premium collection',
    ]

    return res.status(200).json({
      success: true,
      reply: cleanedReply,
      products,
      suggestions: suggestions.slice(0, 3),
    })
  } catch (error) {
    console.error('[style-assistant]', error)
    return res.status(500).json({ success: false, error: error.message })
  }
}
