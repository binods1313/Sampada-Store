// pages/api/ai/generate-image.js
/**
 * AI Product Image Generation API
 * 
 * Server-side endpoint to generate product images using:
 * 1. Pollinations.ai (free, unlimited, no key)
 * 2. Stability AI (25 credits/day, higher quality)
 * 
 * Usage:
 * POST /api/ai/generate-image
 * {
 *   "productName": "Red Leather Handbag",
 *   "category": "Luxury Accessories",
 *   "style": "professional product photography" // optional
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "imageUrl": "https://image.pollinations.ai/prompt/...",
 *   "provider": "Pollinations.ai",
 *   "creditsRemaining": 25
 * }
 */

import { generateProductImage, getStabilityCredits, trackStabilityUsage } from '@/utils/aiImageGenerator'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { productName, category, style, background, quality } = req.body

    if (!productName) {
      return res.status(400).json({
        success: false,
        error: 'productName is required'
      })
    }

    // Generate image
    const imageUrl = await generateProductImage(productName, category || '', {
      style: style || 'professional product photography',
      background: background || 'clean white background',
      quality: quality || 'high detail, 4K'
    })

    if (!imageUrl) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate image'
      })
    }

    // Track Stability usage if used
    const provider = imageUrl.includes('pollinations') ? 'Pollinations.ai' : 'Stability AI'
    if (provider === 'Stability AI') {
      trackStabilityUsage()
    }

    res.status(200).json({
      success: true,
      imageUrl,
      provider,
      creditsRemaining: getStabilityCredits().remaining
    })
  } catch (error) {
    console.error('Image generation error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    })
  }
}

// Disable body size limit for image responses
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}
