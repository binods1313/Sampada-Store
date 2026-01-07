// pages/api/orders/fix-email-mismatch.js
// API endpoint to fix orders that have the wrong email due to user input errors during checkout
import { writeClient } from '../../../lib/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { orderEmail, correctEmail } = req.body;
    
    if (!orderEmail || !correctEmail) {
      return res.status(400).json({ error: 'Both orderEmail and correctEmail are required' });
    }

    console.log(`🔄 Fixing orders: ${orderEmail} -> ${correctEmail}`);

    // Get the user's Sanity profile
    const currentUser = await writeClient.fetch(
      `*[_type == "user" && providerId == $authUserId][0]`,
      { authUserId: session.user.id }
    );

    if (!currentUser) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Verify the correct email matches the logged-in user
    if (currentUser.email !== correctEmail) {
      return res.status(403).json({ 
        error: 'Correct email must match your logged-in account email',
        userEmail: currentUser.email
      });
    }

    // Find orders with the wrong email that should belong to this user
    const ordersToFix = await writeClient.fetch(
      `*[_type == "order" && customerEmail == $orderEmail]`,
      { orderEmail }
    );

    if (ordersToFix.length === 0) {
      return res.status(404).json({ 
        message: 'No orders found with the specified email',
        orderEmail 
      });
    }

    console.log(`Found ${ordersToFix.length} orders to fix`);

    // Update each order to link to the correct user and update email
    const updatePromises = ordersToFix.map(order => 
      writeClient
        .patch(order._id)
        .set({
          customerEmail: correctEmail,
          user: { _type: 'reference', _ref: currentUser._id }
        })
        .commit()
    );

    const results = await Promise.all(updatePromises);

    console.log(`✅ Fixed ${results.length} orders`);

    return res.status(200).json({
      success: true,
      message: `Fixed ${results.length} orders`,
      fixedOrders: results.map(r => r._id),
      userLinked: currentUser._id
    });

  } catch (error) {
    console.error('Error fixing email mismatch:', error);
    return res.status(500).json({ 
      error: 'Failed to fix email mismatch', 
      details: error.message 
    });
  }
}