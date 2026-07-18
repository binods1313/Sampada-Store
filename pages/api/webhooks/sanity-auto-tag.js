/**
 * Sanity Webhook — Auto-Tag on Product Create/Update (legacy product-only)
 * POST /api/webhooks/sanity-auto-tag
 *
 * Preferred production setup (one plan webhook slot):
 *   POST /api/webhooks/sanity  — routes post → ISR, product → auto-tag
 *
 * This route remains for backward compatibility / manual product-only hooks.
 *
 * Setup (legacy):
 *   URL: https://sampadaoriginals.in/api/webhooks/sanity-auto-tag
 *   Filter: _type == "product"
 *   Secret: SANITY_WEBHOOK_SECRET
 */

import crypto from 'crypto'

export const config = { api: { bodyParser: true } }

function verifySignature(body, signature, secret) {
  if (!secret) return true // Skip verification in dev if no secret set
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(JSON.stringify(body))
  const expected = hmac.digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(signature || '', 'hex'),
    Buffer.from(expected, 'hex')
  )
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Verify Sanity webhook signature
  const signature = req.headers['sanity-webhook-signature'] || ''
  const secret = process.env.SANITY_WEBHOOK_SECRET

  if (secret && !verifySignature(req.body, signature, secret)) {
    console.warn('[sanity-webhook] Invalid signature')
    return res.status(401).json({ error: 'Invalid webhook signature' })
  }

  const { _id, _type, _rev } = req.body

  // Only process product documents
  if (_type !== 'product') {
    return res.status(200).json({ skipped: true, reason: 'Not a product document' })
  }

  if (!_id) {
    return res.status(400).json({ error: 'Missing document _id' })
  }

  console.log(`[sanity-webhook] Auto-tagging product: ${_id} (rev: ${_rev})`)

  try {
    // Call the Gemini auto-tagger — fire and forget, respond immediately
    // to avoid Sanity webhook timeout (30s limit)
    const baseUrl = (
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      'http://localhost:3000'
    ).replace(/\/$/, '')

    // Respond to Sanity immediately
    res.status(200).json({ received: true, productId: _id })

    // Then trigger tagging asynchronously
    fetch(`${baseUrl}/api/products/gemini-auto-tag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: _id }),
    }).then(async (r) => {
      const data = await r.json()
      if (data.success) {
        console.log(`[sanity-webhook] Tagged product ${_id}:`, data.applied?.tags)
      } else {
        console.error(`[sanity-webhook] Tagging failed for ${_id}:`, data.error)
      }
    }).catch((err) => {
      console.error(`[sanity-webhook] Fetch error for ${_id}:`, err.message)
    })

  } catch (error) {
    console.error('[sanity-webhook] Error:', error)
    return res.status(500).json({ error: error.message })
  }
}
