// pages/api/razorpay/create-order.js
// Creates a Razorpay order for Indian customers
// Supports UPI, Net Banking, Cards, Wallets, EMI

import { createRazorpayOrder } from '../../../lib/razorpay';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  console.log('\n--- Razorpay Create Order Handler Started ---');
  console.time('RazorpayCreateOrder');

  try {
    const { amount, currency, customerEmail, customerName, receipt, cartItems } = req.body;

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount. Amount must be greater than 0.',
        code: 'INVALID_AMOUNT',
      });
    }

    if (!currency || typeof currency !== 'string') {
      return res.status(400).json({
        error: 'Currency is required.',
        code: 'MISSING_CURRENCY',
      });
    }

    // Normalize currency
    const normalizedCurrency = currency.toUpperCase();

    // Razorpay primarily supports INR for Indian customers
    // But also supports USD, EUR, GBP, etc. for international
    const supportedCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'AED', 'SAR', 'OMR', 'QAR', 'KWD', 'BHD'];
    if (!supportedCurrencies.includes(normalizedCurrency)) {
      return res.status(400).json({
        error: `Currency ${currency} is not supported by Razorpay.`,
        code: 'UNSUPPORTED_CURRENCY',
        supportedCurrencies,
      });
    }

    // For INR, amount should be in paise (multiply by 100)
    // For other currencies, amount should be in smallest unit (cents, etc.)
    let amountInSmallestUnit;
    if (normalizedCurrency === 'INR') {
      // Amount is expected in INR rupees, convert to paise
      amountInSmallestUnit = Math.round(amount * 100);
    } else {
      // For other currencies, convert to smallest unit
      amountInSmallestUnit = Math.round(amount * 100);
    }

    console.log('Creating Razorpay order:', {
      amountInSmallestUnit,
      currency: normalizedCurrency,
      customerEmail: customerEmail || 'Not provided',
      customerName: customerName || 'Not provided',
      cartItemsCount: cartItems ? cartItems.length : 0,
    });

    // Create the order
    const order = await createRazorpayOrder({
      amount: amountInSmallestUnit,
      currency: normalizedCurrency,
      customerEmail: customerEmail || '',
      customerName: customerName || '',
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    console.log('Razorpay order created successfully:', order.order_id);
    console.timeEnd('RazorpayCreateOrder');

    return res.status(200).json({
      success: true,
      order_id: order.order_id,
      amount: order.amount,
      currency: order.currency,
      key_id: order.key_id,
      receipt: order.receipt,
    });
  } catch (error) {
    console.timeEnd('RazorpayCreateOrder');
    console.error('--- Razorpay Create Order Error ---');
    console.error('Error creating order:', error.message);
    console.error('Stack trace:', error.stack);

    // Determine appropriate HTTP status code
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';

    if (error.message.includes('not properly configured')) {
      statusCode = 503;
      errorCode = 'PAYMENT_SERVICE_UNAVAILABLE';
    } else if (error.message.includes('Missing') || error.message.includes('Invalid')) {
      statusCode = 400;
      errorCode = 'INVALID_REQUEST';
    }

    return res.status(statusCode).json({
      error: error.message || 'Failed to create payment order.',
      code: errorCode,
    });
  } finally {
    console.log('--- Razorpay Create Order Handler Finished ---\n');
  }
}
