/**
 * Mailchimp API Endpoint
 * 
 * POST /api/mailchimp/subscribe
 * POST /api/mailchimp/abandoned-cart
 * POST /api/mailchimp/post-purchase
 * GET  /api/mailchimp/stats
 */

import { subscribeUser, trackAbandonedCart, triggerPostPurchaseEmail, getAudienceStats } from '@/lib/mailchimp'

export default async function handler(req, res) {
  const { method } = req

  try {
    // Subscribe to newsletter
    if (method === 'POST' && req.url.includes('/subscribe')) {
      const { email, firstName, lastName, status } = req.body

      if (!email) {
        return res.status(400).json({ error: 'Email is required' })
      }

      const result = await subscribeUser({ email, firstName, lastName, status })
      
      if (!result.success) {
        return res.status(500).json({ error: result.error })
      }

      return res.status(200).json(result)
    }

    // Track abandoned cart
    if (method === 'POST' && req.url.includes('/abandoned-cart')) {
      const { email, cartItems, cartTotal, cartUrl } = req.body

      if (!email || !cartItems || !cartTotal) {
        return res.status(400).json({ error: 'Email, cartItems, and cartTotal are required' })
      }

      const result = await trackAbandonedCart({ email, cartItems, cartTotal, cartUrl })
      
      if (!result.success) {
        return res.status(500).json({ error: result.error })
      }

      return res.status(200).json(result)
    }

    // Trigger post-purchase email
    if (method === 'POST' && req.url.includes('/post-purchase')) {
      const { email, orderId, orderTotal, items } = req.body

      if (!email || !orderId || !orderTotal) {
        return res.status(400).json({ error: 'Email, orderId, and orderTotal are required' })
      }

      const result = await triggerPostPurchaseEmail({ email, orderId, orderTotal, items })
      
      if (!result.success) {
        return res.status(500).json({ error: result.error })
      }

      return res.status(200).json(result)
    }

    // Get audience stats
    if (method === 'GET' && req.url.includes('/stats')) {
      const result = await getAudienceStats()
      
      if (!result.success) {
        return res.status(500).json({ error: result.error })
      }

      return res.status(200).json(result)
    }

    res.setHeader('Allow', ['POST', 'GET'])
    return res.status(405).json({ error: `Method ${method} Not Allowed` })
  } catch (error) {
    console.error('Mailchimp API error:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}
