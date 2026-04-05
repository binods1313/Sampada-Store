/**
 * Klarna Payment API Endpoint
 *
 * POST /api/klarna/create-session
 * Creates a Klarna payment session and returns checkout URL
 */

import { createKlarnaSession } from '@/lib/klarna';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { items, total, currency, customerEmail, billingAddress } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Cart items are required'
      });
    }

    if (!total || total <= 0) {
      return res.status(400).json({
        error: 'Valid total amount is required'
      });
    }

    if (!customerEmail) {
      return res.status(400).json({
        error: 'Customer email is required'
      });
    }

    // Create Klarna session
    const result = await createKlarnaSession({
      items,
      total,
      currency: currency || 'USD',
      customerEmail,
      billingAddress
    });

    if (!result.success) {
      return res.status(500).json({
        error: result.error || 'Failed to create Klarna session'
      });
    }

    // Return session data with redirect URL
    return res.status(200).json({
      success: true,
      sessionId: result.sessionId,
      clientToken: result.clientToken,
      redirectUrl: result.redirectUrl
    });
  } catch (error) {
    console.error('Klarna API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
