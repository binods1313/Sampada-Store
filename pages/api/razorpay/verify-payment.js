// pages/api/razorpay/verify-payment.js
// Verifies Razorpay payment signature and confirms payment
// Security: Never expose RAZORPAY_KEY_SECRET in frontend code

import { verifyPayment } from '../../../lib/razorpay';
import { writeClient } from '../../../lib/client';

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
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, cartItems, customerEmail, customerName } = req.body;

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

    // Fulfillment: Mark order as paid in Sanity
    try {
      const orderData = {
        _type: 'order',
        _id: razorpay_order_id, // Use razorpay_order_id as the order ID
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        customerEmail: customerEmail || 'N/A',
        customerName: customerName || 'Customer',
        status: 'paid',
        paidAt: new Date().toISOString(),
        paymentMethod: verificationResult.method || 'razorpay',
        totalAmount: verificationResult.amount / 100, // Convert from paise to rupees
        currency: verificationResult.currency || 'INR',
      };

      // Add cart items if provided
      if (cartItems && cartItems.length > 0) {
        orderData.orderItems = cartItems.map((item, index) => ({
          _key: item.id || `item-${index}`,
          _type: 'object',
          quantity: item.quantity || 1,
          pricePerItem: item.price || 0,
          productName: item.name || 'Product',
          productSlug: item.slug || '',
        }));
      }

      // Create or replace the order in Sanity
      await writeClient.createOrReplace(orderData);
      console.log(`Order ${razorpay_order_id} marked as paid in Sanity`);
    } catch (sanityError) {
      // Log but don't fail the payment verification if Sanity update fails
      console.error('Error updating order in Sanity:', sanityError.message);
    }

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