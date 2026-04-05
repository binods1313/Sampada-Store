/**
 * Klarna Buy Now Pay Later (BNPL) Integration
 *
 * Features:
 * - Pay in 4 interest-free installments
 * - Pay in 30 days (try before you buy)
 * - Financing options (6-36 months)
 *
 * Pricing: 2.99% + ₹3 per transaction
 * Expected Impact: +20% average order value
 *
 * Setup:
 * 1. Register at https://www.klarna.com/international/
 * 2. Complete business verification
 * 3. Get API credentials
 * 4. Add to .env.local
 *
 * Docs: https://docs.klarna.com/klarna-payments/api/
 */

const KLARNA_ENV = process.env.KLARNA_ENVIRONMENT || 'playground';
const KLARNA_API_USER = process.env.KLARNA_API_USER;
const KLARNA_API_PASSWORD = process.env.KLARNA_API_PASSWORD;
const KLARNA_STORE_ID = process.env.KLARNA_STORE_ID;

// Klarna API endpoints
const KLARNA_API_URLS = {
  playground: 'https://api-na.playground.klarna.com',
  production: 'https://api.klarna.com'
};

const BASE_URL = KLARNA_API_URLS[KLARNA_ENV];

/**
 * Create Klarna payment session
 * @param {Object} params
 * @param {Array} params.items - Cart items
 * @param {number} params.total - Total amount in cents
 * @param {string} params.currency - Currency code (USD, EUR, etc.)
 * @param {string} params.customerEmail - Customer email
 * @param {Object} params.billingAddress - Billing address
 * @returns {Promise<Object>} Klarna session data
 */
export async function createKlarnaSession({
  items,
  total,
  currency = 'USD',
  customerEmail,
  billingAddress
}) {
  if (!KLARNA_API_USER || !KLARNA_API_PASSWORD) {
    console.warn('Klarna not configured. Missing API credentials.');
    return {
      success: false,
      error: 'Klarna payment not configured. Please contact support.'
    };
  }

  try {
    // Convert total from dollars to cents
    const totalCents = Math.round(total * 100);

    // Build order lines
    const orderLines = items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unit_price: Math.round(item.price * 100),
      total_amount: Math.round(item.price * item.quantity * 100),
      total_discount_amount: 0,
      total_tax_amount: 0,
      tax_rate: 0
    }));

    // Create Klarna order
    const response = await fetch(`${BASE_URL}/payments/v1/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${KLARNA_API_USER}:${KLARNA_API_PASSWORD}`
        ).toString('base64')}`
      },
      body: JSON.stringify({
        purchase_country: billingAddress?.country || 'US',
        purchase_currency: currency.toLowerCase(),
        locale: `${(billingAddress?.country || 'US').toLowerCase()}-${currency.toLowerCase()}`,
        order_amount: totalCents,
        order_tax_amount: 0,
        order_lines: orderLines,
        merchant_urls: {
          confirmation: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
          checkout: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
          terms: `${process.env.NEXT_PUBLIC_BASE_URL}/terms`,
          authorization: `${process.env.NEXT_PUBLIC_BASE_URL}/api/klarna/authorization`,
          validation: `${process.env.NEXT_PUBLIC_BASE_URL}/api/klarna/validation`
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Klarna session creation error:', data);
      return {
        success: false,
        error: data.error_message || 'Failed to create Klarna session'
      };
    }

    return {
      success: true,
      sessionId: data.session_id,
      clientToken: data.client_token,
      returnUrl: data.return_url
    };
  } catch (error) {
    console.error('Klarna API error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get Klarna payment methods available for region
 * @param {string} country - Country code
 * @param {string} currency - Currency code
 * @returns {Promise<Array>} Available payment methods
 */
export async function getAvailablePaymentMethods(country = 'US', currency = 'USD') {
  // Klarna offers different payment methods based on region:
  // - US: Pay in 4, Pay in 30 days, Monthly financing
  // - EU: Slice it, Pay later, Pay now
  // - UK: Pay in 3, Pay in 30 days, Financing

  const methods = {
    US: [
      {
        id: 'pay_in_4',
        name: 'Pay in 4',
        description: '4 interest-free payments',
        icon: '💳'
      },
      {
        id: 'pay_in_30',
        name: 'Pay in 30 days',
        description: 'Try before you buy',
        icon: '📅'
      },
      {
        id: 'financing',
        name: 'Monthly financing',
        description: '6-36 month financing options',
        icon: '💰'
      }
    ],
    EU: [
      {
        id: 'slice_it',
        name: 'Slice it',
        description: 'Pay in installments',
        icon: '💳'
      },
      {
        id: 'pay_later',
        name: 'Pay later',
        description: 'Pay within 30 days',
        icon: '📅'
      }
    ],
    UK: [
      {
        id: 'pay_in_3',
        name: 'Pay in 3',
        description: '3 interest-free payments',
        icon: '💳'
      },
      {
        id: 'pay_in_30',
        name: 'Pay in 30 days',
        description: 'Try before you buy',
        icon: '📅'
      }
    ]
  };

  return methods[country] || methods.US;
}

/**
 * Calculate installment amount
 * @param {number} total - Total amount
 * @param {number} installments - Number of installments
 * @returns {number} Installment amount
 */
export function calculateInstallment(total, installments) {
  return (total / installments).toFixed(2);
}

/**
 * Get Klarna widget script URL
 * @returns {string} Script URL
 */
export function getKlarnaWidgetScriptUrl() {
  return KLARNA_ENV === 'production'
    ? 'https://x.klarnacdn.net/kp-lib/main.iife.js'
    : 'https://x.klarnacdn.net/kp-lib/playground.iife.js';
}

/**
 * Check if Klarna is configured
 * @returns {boolean}
 */
export function isKlarnaConfigured() {
  return !!(KLARNA_API_USER && KLARNA_API_PASSWORD && KLARNA_STORE_ID);
}

export default {
  createKlarnaSession,
  getAvailablePaymentMethods,
  calculateInstallment,
  getKlarnaWidgetScriptUrl,
  isKlarnaConfigured
};
