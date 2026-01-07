// pages/api/orders/create-manual.js
// Fallback order creation when webhooks fail
import Stripe from 'stripe';
import { writeClient } from '../../../lib/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    console.log(`🔄 Manual order creation for session: ${sessionId}`);

    // Check if order already exists
    const existingOrder = await writeClient.fetch(
      `*[_type == "order" && _id == $sessionId][0]`,
      { sessionId }
    );

    if (existingOrder) {
      console.log(`Order ${sessionId} already exists`);
      return res.status(200).json({ success: true, orderId: existingOrder._id });
    }

    // Get session info from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'shipping', 'shipping_details', 'customer_details']
    });

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Get line items
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      expand: ['data.price.product']
    });

    if (!lineItems?.data || lineItems.data.length === 0) {
      return res.status(400).json({ error: 'No line items found' });
    }

    // Process line items
    const processedOrderItems = [];
    
    for (const item of lineItems.data) {
      const stripeProduct = item.price?.product;
      const quantity = item.quantity;
      const pricePerItem = item.price?.unit_amount / 100;
      
      if (!stripeProduct || !quantity || pricePerItem === undefined) {
        console.warn(`Skipping invalid line item`);
        continue;
      }

      // Try to find Sanity product by name
      const productName = stripeProduct.name?.split('(')[0].trim();
      let sanityProduct = null;
      
      try {
        sanityProduct = await writeClient.fetch(
          `*[_type == "product" && name == $name][0]`,
          { name: productName }
        );
      } catch (error) {
        console.error(`Error finding product ${productName}:`, error);
      }

      const orderItem = {
        _key: item.id,
        _type: 'object',
        quantity: quantity,
        pricePerItem: pricePerItem,
      };

      if (sanityProduct) {
        orderItem.product = { _type: 'reference', _ref: sanityProduct._id };
      }

      // Extract variant info from product name
      const variantMatch = stripeProduct.name?.match(/\((.*?)\)/);
      if (variantMatch && variantMatch[1]) {
        const parts = variantMatch[1].split(' / ').map(p => p.trim());
        if (parts.length === 2) {
          orderItem.variantColorName = parts[0];
          orderItem.variantSize = parts[1];
        } else if (parts.length === 1) {
          orderItem.variantColorName = parts[0];
        }
      }

      processedOrderItems.push(orderItem);
    }

    if (processedOrderItems.length === 0) {
      return res.status(400).json({ error: 'No valid order items processed' });
    }

    // Get or create user
    const customerEmail = session.customer_details?.email;
    let userReference = null;

    if (customerEmail) {
      // Try to find existing user
      try {
        let existingUser = await writeClient.fetch(
          `*[_type == "user" && (email == $email || providerId == $email)][0]`,
          { email: customerEmail }
        );

        if (existingUser) {
          userReference = { _type: 'reference', _ref: existingUser._id };
        }
      } catch (error) {
        console.error('Error finding user:', error);
      }
    }

    // Create order
    const orderData = {
      _type: 'order',
      _id: sessionId,
      stripeSessionId: sessionId,
      customerName: session.shipping?.name || session.customer_details?.name || 'Customer',
      customerEmail: customerEmail || 'N/A',
      shippingAddress: {
        _type: 'object',
        line1: session.shipping?.address?.line1 || session.customer_details?.address?.line1 || '',
        line2: session.shipping?.address?.line2 || session.customer_details?.address?.line2 || '',
        city: session.shipping?.address?.city || session.customer_details?.address?.city || '',
        state: session.shipping?.address?.state || session.customer_details?.address?.state || '',
        postal_code: session.shipping?.address?.postal_code || session.customer_details?.address?.postal_code || '',
        country: session.shipping?.address?.country || session.customer_details?.address?.country || '',
      },
      orderItems: processedOrderItems,
      totalAmount: session.amount_total / 100,
      status: 'paid',
      paidAt: new Date(session.created * 1000).toISOString(),
      ...(userReference && { user: userReference })
    };

    console.log('Creating manual order:', JSON.stringify(orderData, null, 2));

    await writeClient.createOrReplace(orderData);
    
    console.log(`✅ Manual order created: ${sessionId}`);

    return res.status(200).json({ 
      success: true, 
      orderId: sessionId,
      message: 'Order created successfully' 
    });

  } catch (error) {
    console.error('Error creating manual order:', error);
    return res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message 
    });
  }
}