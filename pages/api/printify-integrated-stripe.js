import Stripe from 'stripe';
import { printifyAPI } from '../../lib/printifyClient';
// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { cartItems, success_url, cancel_url, customerEmail, paymentMethodId, shippingAddress } = req.body;

    console.log('Printify-integrated stripe request payload:', {
      cartItems: cartItems ? JSON.stringify(cartItems).substring(0, 500) + '...' : 'Not provided',
      success_url,
      cancel_url,
      customerEmail: customerEmail || 'Not provided',
      paymentMethodId: paymentMethodId ? paymentMethodId.substring(0, 10) + '...' : 'Not provided'
    });

    // Handle Google Pay payment method
    if (paymentMethodId) {
      // This is a Google Pay payment
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(req.body.totalPrice * 100),
          currency: 'usd',
          payment_method: req.body.paymentMethodId,
          confirm: true,
          metadata: {
            userEmail: req.body.userEmail,
            orderItems: JSON.stringify(req.body.cartItems),
          },
        });

        // After successful payment, submit Printify items if any
        const printifyItems = req.body.cartItems?.filter(item => item.isPrintifyProduct) || [];

        if (printifyItems.length > 0 && shippingAddress) {
          const printifyOrderData = {
            external_id: `GPAY-${Date.now()}`,
            line_items: printifyItems.map(item => ({
              product_id: item.printifyProductId,
              variant_id: item.printifyVariantId,
              quantity: item.quantity
            })),
            shipping_method: 1,
            send_shipping_notification: true,
            address_to: {
              first_name: shippingAddress.firstName || 'Customer',
              last_name: shippingAddress.lastName || '',
              email: req.body.userEmail || customerEmail || '',
              phone: shippingAddress.phone || '',
              country: shippingAddress.country || '',
              region: shippingAddress.state || '',
              address1: shippingAddress.address1 || '',
              address2: shippingAddress.address2 || '',
              city: shippingAddress.city || '',
              zip: shippingAddress.zip || ''
            }
          };

          try {
            await printifyAPI.createOrder(
              process.env.PRINTIFY_SHOP_ID,
              printifyOrderData
            );
            console.log('Successfully submitted order to Printify');
          } catch (printifyError) {
            console.error('Error submitting to Printify:', printifyError);
            // Note: This doesn't fail the payment, but should be logged for investigation
          }
        }

        return res.status(200).json({
          clientSecret: paymentIntent.client_secret
        });
      } catch (error) {
        console.error('Google Pay payment intent error:', error);
        return res.status(500).json({ error: error.message });
      }
    }

    // Validate input for regular checkout
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      console.error('Validation Error: Invalid cart items provided (empty or not an array).');
      return res.status(400).json({ error: 'Invalid cart items provided' });
    }

    // IMPORTANT: Your client-side `Cart.jsx` already structures `cartItems`
    // into the exact format Stripe expects for `line_items` (i.e., each item
    // has `price_data` and `quantity` at its root).
    // So, we can directly use the received `cartItems` as `line_items`.
    const lineItemsForStripe = cartItems;

    console.log('Successfully prepared line items for Stripe.');

    // Base URL fallback
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    console.log('Attempting to create Stripe Checkout Session...');
    console.time('StripeSessionCreation'); // Timer for the actual Stripe API call

    const sessionParams = {
      payment_method_types: ['card', 'google_pay', 'apple_pay'], // Add Google Pay and Apple Pay support
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: [
          'US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE',
          'AT', 'CH', 'SE', 'DK', 'NO', 'FI', 'PT', 'IE', 'GR', 'PL',
          'CZ', 'SK', 'HU', 'RO', 'BG', 'HR', 'SI', 'LT', 'LV', 'EE',
          'JP', 'CN', 'KR', 'SG', 'IN', 'MY', 'TH', 'ID', 'PH', 'VN',
          'NZ', 'BR', 'MX', 'AR', 'CL', 'CO', 'PE', 'AE', 'SA', 'ZA'
        ],
      },
      line_items: lineItemsForStripe, // Directly use the prepared array from client
      mode: 'payment',
      success_url: success_url || `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${baseUrl}/?canceled=true`,
    };

    // Pre-fill customer email if provided (logged-in user)
    if (customerEmail) {
      console.log(`Pre-filling customer email: ${customerEmail}`);
      sessionParams.customer_email = customerEmail;
    }

    // Only add shipping options if shipping rates are configured
    // Ensure these environment variables are correctly set in .env.local/.env
    if (process.env.STRIPE_SHIPPING_RATE_STANDARD && process.env.STRIPE_SHIPPING_RATE_EXPRESS) {
      sessionParams.shipping_options = [
        { shipping_rate: process.env.STRIPE_SHIPPING_RATE_STANDARD },
        { shipping_rate: process.env.STRIPE_SHIPPING_RATE_EXPRESS },
      ];
      console.log('Including shipping options.');
    } else {
      console.warn('Stripe shipping rates env vars are not fully set. Shipping options will not be included.');
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.timeEnd('StripeSessionCreation'); // End timer for Stripe API call
    console.log('Stripe session created successfully (ID:', session.id, ')');
    res.status(200).json({ id: session.id });

  } catch (error) {
    console.error('--- Printify-integrated Stripe API Error Caught ---');
    console.error('Error creating checkout session:', error.message);
    if (error.raw) { // Log raw error for Stripe specific details
      console.error('Stripe raw error:', error.raw);
    }
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      error: 'Error creating checkout session',
      details: error.message,
      stripeErrorCode: error.code, // Include Stripe's error code if available
    });
  }
}
