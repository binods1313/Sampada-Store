import { printifyAPI } from '../../../lib/printifyClient';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID; // Must be set in dashboard
const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

/**
 * Verify PayPal Webhook Signature
 * In a real production environment, you should use PayPal's signature verification API.
 * For this implementation, we'll implement the basic listener logic.
 */
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  return data.access_token;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const event = req.body;
  console.log(`\n--- PayPal Webhook Received: ${event.event_type} ---`);

  // Note: PayPal Webhook verification would happen here in a real production flow
  // using event headers and the PAYPAL_WEBHOOK_ID.

  try {
    switch (event.event_type) {
      case 'CHECKOUT.ORDER.APPROVED':
        // Order approved, but not yet captured (unless intent was CAPTURE)
        console.log(`Order ${event.resource.id} approved by user.`);
        break;

      case 'PAYMENT.CAPTURE.COMPLETED':
        const capture = event.resource;
        const orderId = capture.supplementary_data?.related_ids?.order_id || capture.id;
        
        console.log(`Payment captured for Order: ${orderId}`);

        // Logic similar to Stripe webhook: handle Printify orders
        // Note: PayPal captures don't automatically contain full line item details
        // like Stripe sessions do. We might need to fetch the full order details.
        
        const accessToken = await getPayPalAccessToken();
        const orderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        const orderDetails = await orderResponse.json();
        
        // Check for Printify items in the order metadata/description
        // This assumes we stored info in purchase_units
        const purchaseUnit = orderDetails.purchase_units?.[0];
        const printifyItems = purchaseUnit?.items?.filter((item: any) => {
            // Check if we can identify this as a Printify item
            // This is harder with PayPal as metadata is limited compared to Stripe
            // We usually rely on the SKU or name if mapped correctly
            return item.sku?.startsWith('PF-') || item.description?.includes('Printify');
        }) || [];

        if (printifyItems.length > 0) {
            console.log('Detected Printify products in PayPal order. Submitting...');
            
            const shipping = purchaseUnit.shipping?.address;
            const printifyOrderData = {
              external_id: orderId,
              line_items: printifyItems.map((item: any) => ({
                product_id: item.sku?.split('-')[1], // Assumes SKU format PF-PRODUCTID-VARIANTID
                variant_id: item.sku?.split('-')[2],
                quantity: parseInt(item.quantity)
              })),
              shipping_method: 1,
              send_shipping_notification: true,
              address_to: {
                first_name: purchaseUnit.shipping?.name?.full_name?.split(' ')[0] || 'Customer',
                last_name: purchaseUnit.shipping?.name?.full_name?.split(' ').slice(1).join(' ') || '',
                email: orderDetails.payer?.email_address || '',
                phone: '',
                country: shipping?.country_code || '',
                region: shipping?.admin_area_1 || '',
                address1: shipping?.address_line_1 || '',
                address2: shipping?.address_line_2 || '',
                city: shipping?.admin_area_2 || '',
                zip: shipping?.postal_code || ''
              }
            };

            await printifyAPI.createOrder(
              process.env.PRINTIFY_SHOP_ID,
              printifyOrderData
            );
            console.log('Successfully submitted PayPal order to Printify');
        }
        break;

      case 'PAYMENT.CAPTURE.REFUNDED':
        console.log(`Refund processed for Capture: ${event.resource.id}`);
        // Handle refund logic (e.g., update Sanity order status)
        break;

      default:
        console.log(`Unhandled PayPal event type: ${event.event_type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('--- PayPal Webhook Error ---');
    console.error(error.message);
    // Don't return 500 so PayPal doesn't keep retrying if it's a known non-critical error
    return res.status(200).json({ error: error.message });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
