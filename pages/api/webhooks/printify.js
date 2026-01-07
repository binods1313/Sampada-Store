export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { event, resource, topic } = req.body;

  switch (event) {
    case 'order:created':
      // Update order status in Sanity
      console.log('Printify order created:', resource);
      // Here you would typically update your Sanity order document
      break;
    case 'order:sent-to-production':
      // Notify customer
      console.log('Printify order sent to production:', resource);
      break;
    case 'order:shipment:created':
      // Send tracking info
      console.log('Printify shipment created:', resource);
      // Send tracking information to customer
      break;
    case 'order:shipment:delivered':
      // Mark as completed
      console.log('Printify order delivered:', resource);
      break;
    default:
      console.log(`Unhandled Printify webhook event: ${event}`, { topic, resource });
  }

  res.status(200).json({ received: true });
}