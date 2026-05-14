/**
 * Gemini Vision Auto-Tagger
 * POST /api/products/gemini-auto-tag
 *
 * Fetches a product from Sanity by ID, downloads its first image,
 * runs Gemini Vision analysis, and writes tags/SEO/occasion/colour
 * back to the Sanity document.
 *
 * Body: { productId: string, imageUrl?: string }
 * Returns: { success, productId, applied: { tags, occasion, colour, seo } }
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@sanity/client'

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_AI_API_KEY ||
  process.env.GOOGLE_AI_KEY
)

// Read client — for fetching product data
const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7lh35oho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-18',
  useCdn: false,
})

// Write client — for patching product data back
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7lh35oho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-18',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const GEMINI_PROMPT = `You are an expert fashion e-commerce tagger for Sampada — a premium Indian heritage fashion brand.

Analyse this product image and return ONLY a valid JSON object (no markdown, no explanation):

{
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "occasion": "one of: Casual / Festive / Premium / Summer / Winter / Campus",
  "colour": "primary colour name",
  "colourHex": "#hexcode",
  "metaTitle": "SEO title 50-60 chars including Sampada",
  "metaDescription": "SEO meta description 150-160 chars",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "details": "2-3 sentence product description, warm premium tone, 50-70 words"
}

Rules:
- Tags: short (1-2 words), relevant to Indian fashion (e.g. "ethnic", "kurta", "festive wear")
- Colour: use common colour names (ivory, mustard, navy, coral, etc.)
- Return ONLY the JSON, nothing else`

async function fetchImageAsBase64(imageUrl) {
  const res = await fetch(imageUrl)
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`)
  const buffer = await res.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  const contentType = res.headers.get('content-type') || 'image/jpeg'
  return { base64, mimeType: contentType }
}

async function analyseWithGemini(imageUrl) {
  const { base64, mimeType } = await fetchImageAsBase64(imageUrl)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const result = await model.generateContent([
    GEMINI_PROMPT,
    { inlineData: { data: base64, mimeType } },
  ])

  const text = result.response.text().trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  return JSON.parse(text)
}

async function getProductImageUrl(productId) {
  const product = await readClient.fetch(
    `*[_id == $id][0]{ image[0]{ asset->{ url } }, name }`,
    { id: productId }
  )
  if (!product) throw new Error(`Product ${productId} not found`)
  const url = product.image?.[0]?.asset?.url
  if (!url) throw new Error(`Product ${productId} has no image`)
  return { url, name: product.name }
}

async function applyTagsToSanity(productId, geminiResult) {
  const { tags, occasion, colour, colourHex, metaTitle, metaDescription, keywords, details } = geminiResult

  await writeClient
    .patch(productId)
    .setIfMissing({ tags: [], seo: {} })
    .set({
      // SEO fields
      'seo.metaTitle': metaTitle || '',
      'seo.metaDescription': metaDescription || '',
      'seo.keywords': keywords || [],
      // Details (only if empty)
    })
    .commit()

  // Set details only if not already filled
  const existing = await readClient.fetch(`*[_id == $id][0]{ details }`, { id: productId })
  if (!existing?.details) {
    await writeClient.patch(productId).set({ details }).commit()
  }

  // Append tags (avoid duplicates)
  const existingTags = await readClient.fetch(`*[_id == $id][0]{ tags }`, { id: productId })
  const currentTags = existingTags?.tags || []
  const newTags = [...new Set([...currentTags, ...(tags || [])])]
  await writeClient.patch(productId).set({ tags: newTags }).commit()

  return { tags: newTags, occasion, colour, colourHex, metaTitle, metaDescription, keywords }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { productId, imageUrl } = req.body

  if (!productId) {
    return res.status(400).json({ success: false, error: 'productId is required' })
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return res.status(500).json({
      success: false,
      error: 'SANITY_API_WRITE_TOKEN not configured. Add it to .env from sanity.io → API → Tokens.',
    })
  }

  try {
    // Get image URL from Sanity if not provided
    let finalImageUrl = imageUrl
    let productName = ''
    if (!finalImageUrl) {
      const { url, name } = await getProductImageUrl(productId)
      finalImageUrl = url
      productName = name
    }

    // Run Gemini Vision analysis
    const geminiResult = await analyseWithGemini(finalImageUrl)

    // Write results back to Sanity
    const applied = await applyTagsToSanity(productId, geminiResult)

    return res.status(200).json({
      success: true,
      productId,
      productName,
      applied,
    })
  } catch (error) {
    console.error('[gemini-auto-tag]', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Auto-tagging failed',
    })
  }
}
