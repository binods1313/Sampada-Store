import type { NextApiRequest, NextApiResponse } from 'next';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

/**
 * Get PayPal OAuth 2.0 Access Token
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: 'Missing PayPal order ID.' });
  }

  console.log(`\n--- PayPal Capture Order Handler Started for Order: ${orderId} ---`);

  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('PayPal Capture Error:', errorData);
      throw new Error(`PayPal capture failed: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('PayPal order captured successfully:', data.id);

    // Check if the transaction was successful
    if (data.status === 'COMPLETED') {
      return res.status(200).json({
        success: true,
        transactionId: data.purchase_units[0].payments.captures[0].id,
        status: data.status,
      });
    } else {
      return res.status(200).json({
        success: false,
        status: data.status,
      });
    }
  } catch (error: any) {
    console.error('--- PayPal Capture Order Error ---');
    console.error(error.message);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
