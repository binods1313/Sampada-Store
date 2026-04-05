// pages/api/razorpay/verify-payment.js
// Verifies Razorpay payment signature and confirms payment
// Security: Never expose RAZORPAY_KEY_SECRET in frontend code

import { verifyPayment } from '../../../lib/razorpay';

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

  console.log('\n--- Razorpay Verify Payment Handler Started ---');
  console.time('RazorpayVerifyPayment');

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, cartItems, customerEmail } = req.body;

    // Validate required parameters
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        error: 'Missing required payment verification parameters.',
        code: 'MISSING_PARAMETERS',
        required: ['razorpay_payment_id', 'razorpay_order_id', 'razorpay_signature'],
      });
    }

    console.log('Verifying payment:', {
      razorpay_payment_id,
      razorpay_order_id,
      customerEmail: customerEmail || 'Not provided',
      cartItemsCount: cartItems ? cartItems.length : 0,
    });

    // Verify the payment signature
    const verificationResult = await verifyPayment({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    console.log('Payment verified successfully:', verificationResult.payment_id);
    console.timeEnd('RazorpayVerifyPayment');

    // TODO: Here you can add additional logic like:
    // - Update order status in database
    // - Send confirmation email
    // - Trigger Printify fulfillment (similar to Stripe webhook)
    // - Update inventory

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      payment_id: verificationResult.payment_id,
      order_id: verificationResult.order_id,
      amount: verificationResult.amount,
      currency: verificationResult.currency,
      status: verificationResult.status,
      method: verificationResult.method,
    });
  } catch (error) {
    console.timeEnd('RazorpayVerifyPayment');
    console.error('--- Razorpay Verify Payment Error ---');
    console.error('Error verifying payment:', error.message);
    console.error('Stack trace:', error.stack);

    // Determine appropriate HTTP status code
    let statusCode = 500;
    let errorCode = 'VERIFICATION_FAILED';

    if (error.message.includes('signature mismatch') || error.message.includes('Potential fraud')) {
      statusCode = 400;
      errorCode = 'SIGNATURE_MISMATCH';
    } else if (error.message.includes('not properly configured')) {
      statusCode = 503;
      errorCode = 'PAYMENT_SERVICE_UNAVAILABLE';
    } else if (error.message.includes('Missing')) {
      statusCode = 400;
      errorCode = 'INVALID_REQUEST';
    }

    return res.status(statusCode).json({
      error: error.message || 'Payment verification failed.',
      code: errorCode,
    });
  } finally {
    console.log('--- Razorpay Verify Payment Handler Finished ---\n');
  }
}
