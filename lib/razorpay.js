// lib/razorpay.js
// Razorpay payment gateway integration for Indian customers
// Supports UPI, Net Banking, Cards, Wallets, EMI

import Razorpay from 'razorpay';

/**
 * Initialize Razorpay instance with key ID and secret
 * @returns {Razorpay|null} Razorpay instance or null if not configured
 */
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('Razorpay credentials not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.');
    return null;
  }

  try {
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  } catch (error) {
    console.error('Failed to initialize Razorpay:', error.message);
    return null;
  }
};

/**
 * Create a Razorpay order
 * @param {Object} params - Order parameters
 * @param {number} params.amount - Amount in the smallest currency unit (e.g., paise for INR)
 * @param {string} params.currency - Currency code (default: 'INR')
 * @param {string} params.customerEmail - Customer email address
 * @param {string} params.customerName - Customer name
 * @param {string} [params.receipt] - Optional receipt ID
 * @returns {Promise<Object>} Razorpay order object
 */
export const createRazorpayOrder = async ({ amount, currency = 'INR', customerEmail, customerName, receipt }) => {
  const razorpay = getRazorpayInstance();
  if (!razorpay) {
    throw new Error('Razorpay is not properly configured. Please contact support.');
  }

  try {
    // Generate a unique receipt ID if not provided
    const orderReceipt = receipt || `rcpt_${Date.now()}`;

    const orderOptions = {
      amount: Math.round(amount), // Amount in smallest currency unit (paise for INR)
      currency: currency.toUpperCase(),
      receipt: orderReceipt,
      notes: {
        customer_email: customerEmail || '',
        customer_name: customerName || '',
      },
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(orderOptions);

    return {
      success: true,
      order_id: order.id,
      currency: order.currency,
      amount: order.amount,
      key_id: process.env.RAZORPAY_KEY_ID,
      receipt: order.receipt,
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);

    // Provide user-friendly error messages
    let errorMessage = 'Failed to create payment order. Please try again.';
    if (error.error?.description) {
      errorMessage = error.error.description;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Verify Razorpay payment signature
 * @param {Object} params - Payment verification parameters
 * @param {string} params.razorpay_payment_id - Razorpay payment ID
 * @param {string} params.razorpay_order_id - Razorpay order ID
 * @param {string} params.razorpay_signature - Razorpay payment signature
 * @returns {Promise<Object>} Verification result
 */
export const verifyPayment = async ({ razorpay_payment_id, razorpay_order_id, razorpay_signature }) => {
  const razorpay = getRazorpayInstance();
  if (!razorpay) {
    throw new Error('Razorpay is not properly configured. Please contact support.');
  }

  try {
    // Validate required parameters
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      throw new Error('Missing payment verification parameters.');
    }

    // Generate expected signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Compare signatures
    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      console.error('Payment signature mismatch. Potential fraud attempt.');
      throw new Error('Payment verification failed. Signature mismatch.');
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    return {
      success: true,
      payment_id: payment.id,
      order_id: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
    };
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);

    let errorMessage = 'Payment verification failed. Please contact support.';
    if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Get available Razorpay payment methods for Indian customers
 * @returns {Array<Object>} Array of payment method objects
 */
export const getRazorpayPaymentMethods = () => {
  return [
    {
      id: 'upi',
      name: 'UPI',
      description: 'Google Pay, PhonePe, Paytm, BHIM',
      icon: '📱',
      enabled: true,
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major Indian banks',
      icon: '🏦',
      enabled: true,
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, RuPay, Amex',
      icon: '💳',
      enabled: true,
    },
    {
      id: 'wallet',
      name: 'Wallets',
      description: 'Paytm, Mobikwik, Freecharge, Airtel Money',
      icon: '👛',
      enabled: true,
    },
    {
      id: 'emi',
      name: 'EMI',
      description: 'Convert to easy monthly installments',
      icon: '📅',
      enabled: true,
      minAmount: 300000, // Minimum 3000 INR in paise
    },
  ];
};

/**
 * Create order from cart items (helper function for API endpoints)
 * @param {Array} cartItems - Cart items array
 * @param {number} totalPrice - Total price in USD
 * @param {string} currency - Target currency code
 * @param {Object} currencyConversion - Currency conversion utilities
 * @returns {Promise<number>} Amount in smallest currency unit (paise)
 */
export const calculateAmountInSmallestUnit = async (totalPrice, currency = 'INR') => {
  // For INR, we need to convert USD to INR and then to paise
  // For other currencies, convert accordingly
  const currencyLower = currency.toLowerCase();

  // Razorpay expects amount in smallest unit (paise for INR, cents for USD, etc.)
  // For INR: multiply by 100 to get paise
  // For USD: multiply by 100 to get cents

  if (currencyLower === 'inr') {
    // If totalPrice is in USD, convert to INR
    // We assume the amount passed is already in INR if currency is INR
    return Math.round(totalPrice * 100); // Convert to paise
  }

  // For other currencies supported by Razorpay
  return Math.round(totalPrice * 100);
};

export default {
  createRazorpayOrder,
  verifyPayment,
  getRazorpayPaymentMethods,
  calculateAmountInSmallestUnit,
};
