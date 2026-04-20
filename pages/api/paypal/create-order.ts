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
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials are not configured in environment variables.');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to get PayPal access token: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.access_token;
}

interface PayPalItem {
  name: string;
  description?: string;
  quantity: string;
  unit_amount: {
    currency_code: string;
    value: string;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  console.log('\n--- PayPal Create Order Handler Started ---');

  try {
    const { cartItems, totalPrice, currency = 'USD', customerEmail } = req.body;

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ error: 'Invalid total price.' });
    }

    const accessToken = await getPayPalAccessToken();

    // Map cart items to PayPal format
    const items: PayPalItem[] = cartItems.map((item: any) => ({
      name: item.name.substring(0, 127), // PayPal name limit
      quantity: item.quantity.toString(),
      unit_amount: {
        currency_code: currency.toUpperCase(),
        value: item.price.toFixed(2),
      },
    }));

    // Calculate item total to ensure it matches the total price
    const itemTotalValue = cartItems.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // PayPal requires breakdown to match total
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency.toUpperCase(),
            value: totalPrice.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: currency.toUpperCase(),
                value: itemTotalValue.toFixed(2),
              },
            },
          },
          items: items,
        },
      ],
      application_context: {
        brand_name: 'Sampada Store',
        shipping_preference: 'GET_FROM_FILE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      },
    };

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('PayPal Order Creation Error:', errorData);
      throw new Error(`PayPal order creation failed: ${JSON.stringify(errorData)}`);
    }

    const order = await response.json();
    console.log('PayPal order created successfully:', order.id);

    return res.status(200).json({
      id: order.id,
      status: order.status,
    });
  } catch (error: any) {
    console.error('--- PayPal Create Order Error ---');
    console.error(error.message);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
