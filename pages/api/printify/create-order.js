import { printifyAPI } from '../../../lib/printifyClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { orderItems, shippingAddress, email } = req.body;

    // Transform your order format to Printify's format
    const printifyOrder = {
      external_id: `ORDER-${Date.now()}`,
      line_items: orderItems.map(item => ({
        product_id: item.printifyProductId,
        variant_id: item.printifyVariantId,
        quantity: item.quantity
      })),
      shipping_method: 1,
      send_shipping_notification: true,
      address_to: {
        first_name: shippingAddress.firstName,
        last_name: shippingAddress.lastName,
        email: email,
        phone: shippingAddress.phone,
        country: shippingAddress.country,
        region: shippingAddress.state,
        address1: shippingAddress.address1,
        address2: shippingAddress.address2,
        city: shippingAddress.city,
        zip: shippingAddress.zip
      }
    };

    const order = await printifyAPI.createOrder(
      process.env.PRINTIFY_SHOP_ID,
      printifyOrder
    );

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}