import Stripe from 'stripe';
import { printifyAPI } from '../../../lib/printifyClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // You'll need to set this in your environment

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;

      if (session.payment_status === 'paid') {
        try {
          // Get the line items for the session to determine which items are Printify products
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

          // Filter for items that are Printify products
          const printifyItems = lineItems.data.filter(item => {
            // This assumes you've stored printify-specific data in the product metadata
            const isPrintify = item.price.product.metadata?.isPrintifyProduct === 'true';
            return isPrintify;
          });

          if (printifyItems.length > 0) {
            // Prepare printify order data
            const printifyOrderData = {
              external_id: session.id,
              line_items: printifyItems.map(item => ({
                product_id: item.price.product.metadata?.printifyProductId,
                variant_id: item.price.product.metadata?.printifyVariantId,
                quantity: item.quantity
              })),
              shipping_method: 1,
              send_shipping_notification: true,
              address_to: {
                first_name: session.customer_details.name?.split(' ')[0] || 'Customer',
                last_name: session.customer_details.name?.split(' ').slice(1).join(' ') || '',
                email: session.customer_details.email,
                phone: session.customer_details.phone || '',
                country: session.shipping_details?.address?.country || '',
                region: session.shipping_details?.address?.state || '',
                address1: session.shipping_details?.address?.line1 || '',
                address2: session.shipping_details?.address?.line2 || '',
                city: session.shipping_details?.address?.city || '',
                zip: session.shipping_details?.address?.postal_code || ''
              }
            };

            // Submit order to Printify
            await printifyAPI.createOrder(
              process.env.PRINTIFY_SHOP_ID,
              printifyOrderData
            );
          }
        } catch (error) {
          console.error('Error processing Printify order:', error.message);
          // Log the error but don't return an error status as Stripe will retry
        }
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}

export const config = {
  api: {
    bodyParser: false, // Use Node.js built-in body parser for webhooks
  },
};