// pages/api/subscriptions/designer/create-checkout.js
// Create Stripe Checkout session for designer subscription
// Handles Pro ($30/month) and Ultra ($300/month) plans

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_DESIGNER_SECRET || process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan, customerEmail, successUrl, cancelUrl } = req.body;

    // Validate plan
    const validPlans = ['pro', 'ultra'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan. Must be "pro" or "ultra"' });
    }

    // Get price ID from env
    const priceId = plan === 'pro'
      ? process.env.STRIPE_DESIGNER_PRO_PRICE_ID
      : process.env.STRIPE_DESIGNER_ULTRA_PRICE_ID;

    if (!priceId) {
      return res.status(500).json({ error: 'Stripe price ID not configured' });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/account?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      metadata: {
        plan,
        customerEmail,
      },
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Subscription checkout error:', error);
    return res.status(500).json({
      error: 'Failed to create checkout session',
      details: error.message,
    });
  }
}
