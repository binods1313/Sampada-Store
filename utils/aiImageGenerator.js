// utils/aiImageGenerator.js
/**
 * AI Product Image Generation
 * 
 * Uses two providers simultaneously for best results:
 * 1. Pollinations.ai — FREE, unlimited, no API key
 *    Endpoint: https://image.pollinations.ai/prompt/{description}
 * 
 * 2. Stability AI — 25 credits/day, high quality
 *    Endpoint: https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image
 * 
 * Usage:
 *   const imageUrl = await generateProductImage('Red leather handbag', 'Luxury Accessories')
 *   // Returns best image URL from either provider
 */

// Stability API configuration
const STABILITY_API_KEY = process.env.STABILITY_API_KEY || process.env.NEXT_PUBLIC_STABILITY_API_KEY
const STABILITY_API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image'

// Fallback Stability API key
const STABILITY_API_KEY_2 = process.env.STABILITY_API_KEY_2

/**
 * Generate a product image using AI
 * @param {string} productName - Name of the product
 * @param {string} category - Product category
 * @param {Object} options - Generation options
 * @returns {Promise<string>} URL of generated image or null if failed
 */
export async function generateProductImage(productName, category, options = {}) {
  if (!productName) return null

  // Build the prompt
  const prompt = buildPrompt(productName, category, options)
  
  // Try both providers in parallel
  const [pollinationsUrl, stabilityResult] = await Promise.allSettled([
    // Pollinations.ai (always succeeds, no auth needed)
    getPollinationsUrl(prompt, options),
    // Stability AI (higher quality, rate limited)
    STABILITY_API_KEY ? generateWithStability(prompt, options) : Promise.resolve(null)
  ])

  // Return Stability result if it succeeded (higher quality)
  if (stabilityResult.status === 'fulfilled' && stabilityResult.value) {
    return stabilityResult.value
  }

  // Fall back to Pollinations (always works)
  if (pollinationsUrl.status === 'fulfilled') {
    return pollinationsUrl.value
  }

  console.error('Both image providers failed:', pollinationsUrl.reason, stabilityResult.reason)
  return null
}

/**
 * Build an optimized prompt for product image generation
 */
function buildPrompt(productName, category, options = {}) {
  const {
    style = 'professional product photography',
    background = 'clean white background',
    lighting = 'studio lighting',
    quality = 'high detail, 4K',
    angle = 'front view'
  } = options

  return `${style} of ${productName}${category ? ` in ${category}` : ''}, ${background}, ${lighting}, ${quality}, ${angle}, commercial grade, sharp focus, no text, no watermark`
}

/**
 * Get Pollinations.ai URL (free, no auth)
 * Pollinations returns a direct image URL — no API call needed
 */
async function getPollinationsUrl(prompt, options = {}) {
  const {
    width = 1024,
    height = 1024,
    seed = Math.floor(Math.random() * 999999),
    model = 'flux' // or 'turbo' for faster generation
  } = options

  // Pollinations returns the image directly — we construct the URL
  const encodedPrompt = encodeURIComponent(prompt)
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true`
}

/**
 * Generate image with Stability AI (higher quality)
 * Returns base64 data URL or null on failure
 */
async function generateWithStability(prompt, options = {}) {
  const {
    width = 1024,
    height = 1024,
    cfgScale = 7,
    steps = 30,
    samples = 1
  } = options

  const keys = [STABILITY_API_KEY, STABILITY_API_KEY_2].filter(Boolean)
  
  for (const key of keys) {
    try {
      const response = await fetch(STABILITY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
          Accept: 'application/json'
        },
        body: JSON.stringify({
          text_prompts: [
            { text: prompt, weight: 1 },
            { text: 'blurry, low quality, text, watermark, logo, deformed', weight: -1 }
          ],
          cfg_scale: cfgScale,
          width,
          height,
          steps,
          samples
        })
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.warn('Stability API error:', error.message || response.status)
        continue // Try next key
      }

      const data = await response.json()
      
      if (data.artifacts && data.artifacts[0]?.base64) {
        return `data:image/png;base64,${data.artifacts[0].base64}`
      }

      return null
    } catch (error) {
      console.warn('Stability API call failed:', error.message)
      continue // Try next key
    }
  }

  return null // All keys failed
}

/**
 * Generate multiple product images (for variants)
 */
export async function generateProductImages(products, options = {}) {
  const results = {}
  
  await Promise.all(
    products.map(async (product) => {
      const url = await generateProductImage(
        product.name,
        product.category,
        options
      )
      results[product._id] = url
    })
  )

  return results
}

/**
 * Check if Stability API is working
 */
export async function testStabilityApi() {
  if (!STABILITY_API_KEY && !STABILITY_API_KEY_2) {
    return { working: false, error: 'No API key configured' }
  }

  try {
    const url = await generateProductImage('test product', 'test', { width: 64, height: 64 })
    return {
      working: !!url,
      provider: url?.includes('pollinations') ? 'Pollinations (fallback)' : 'Stability AI',
      url: url ? url.substring(0, 50) + '...' : null
    }
  } catch (error) {
    return { working: false, error: error.message }
  }
}

/**
 * Get remaining Stability credits (approximate)
 */
export function getStabilityCredits() {
  // Stability AI gives 25 credits/day on free tier
  // Track usage in localStorage for estimation
  if (typeof window === 'undefined') return { remaining: 25, used: 0 }
  
  const today = new Date().toISOString().split('T')[0]
  const usage = JSON.parse(localStorage.getItem('stability-usage') || '{}')
  
  if (usage.date !== today) {
    // Reset for new day
    return { remaining: 25, used: 0, date: today }
  }
  
  return { remaining: Math.max(0, 25 - usage.count), used: usage.count || 0, date: today }
}

/**
 * Track Stability API usage
 */
export function trackStabilityUsage() {
  if (typeof window === 'undefined') return
  
  const today = new Date().toISOString().split('T')[0]
  const usage = JSON.parse(localStorage.getItem('stability-usage') || '{}')
  
  if (usage.date !== today) {
    usage.date = today
    usage.count = 0
  }
  
  usage.count++
  localStorage.setItem('stability-usage', JSON.stringify(usage))
}

export default generateProductImage
