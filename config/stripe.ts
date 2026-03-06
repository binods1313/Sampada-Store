// Stripe Configuration for Production
// This file exports configuration constants used across the application

/**
 * Stripe Price IDs for Designer Subscription Tiers
 * 
 * Current Status: TEST MODE (Live Account)
 * Account: Binod Tech Ventures (acct_1RHrXyBwS3cUKJNr)
 * 
 * TODO: After business verification, create these products in live dashboard:
 * 1. Go to https://dashboard.stripe.com/products
 * 2. Create "Sampada Pro" - $30/month recurring
 * 3. Create "Sampada Ultra" - $300/month recurring
 * 4. Copy the Price IDs (start with "price_") to .env.production
 */
export const STRIPE_DESIGNER_PRO_PRICE_ID = process.env.STRIPE_DESIGNER_PRO_PRICE_ID;
export const STRIPE_DESIGNER_ULTRA_PRICE_ID = process.env.STRIPE_DESIGNER_ULTRA_PRICE_ID;

/**
 * Stripe API Keys
 * 
 * Current: Test mode keys from live account
 * After verification: Replace with sk_live_... and pk_live_...
 * 
 * Get from: https://dashboard.stripe.com/apikeys
 */
export const STRIPE_DESIGNER_SECRET = process.env.STRIPE_SECRET_KEY;
export const NEXT_PUBLIC_STRIPE_DESIGNER_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

/**
 * Stripe Webhook Secret
 * 
 * Current webhook: https://dashboard.stripe.com/webhooks/we_1T7vUFBwS3cUKJNr1eorpMrW
 * Endpoint: /api/subscriptions/designer/webhook
 * Events: customer.subscription.created, updated, deleted
 */
export const STRIPE_DESIGNER_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Subscription Tier Configuration
 * Maps Stripe Price IDs to application tiers and limits
 */
export const DESIGNER_TIER_MAP = {
  [STRIPE_DESIGNER_PRO_PRICE_ID!]: {
    tier: 'pro' as const,
    limit: 50,
    price: 3000, // $30.00 in cents
    features: {
      aiAssistant: false,
      aiImageGen: false,
      multiProductPreview: true,
      customBranding: false,
    }
  },
  [STRIPE_DESIGNER_ULTRA_PRICE_ID!]: {
    tier: 'ultra' as const,
    limit: null, // Unlimited
    price: 30000, // $300.00 in cents
    features: {
      aiAssistant: true,
      aiImageGen: true,
      multiProductPreview: true,
      customBranding: true,
    }
  }
};

/**
 * Free Tier Configuration (default)
 */
export const FREE_TIER = {
  tier: 'free' as const,
  limit: 2,
  price: 0,
  features: {
    aiAssistant: false,
    aiImageGen: false,
    multiProductPreview: false,
    customBranding: false,
  }
};
