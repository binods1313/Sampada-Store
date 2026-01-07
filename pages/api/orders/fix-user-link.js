// pages/api/orders/fix-user-link.js
// Script to link existing orders to the correct user account
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

    const { userEmail } = req.body;
    
    if (!userEmail) {
      return res.status(400).json({ error: 'User email required' });
    }

    console.log(`🔄 Fixing orders for user email: ${userEmail}`);

    // Get the current user's Sanity profile
    const currentUser = await writeClient.fetch(
      `*[_type == "user" && providerId == $authUserId][0]`,
      { authUserId: session.user.id }
    );

    if (!currentUser) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    console.log(`Current user found: ${currentUser._id}`);

    // Find orders that belong to the email but are linked to different users or no users
    const ordersToFix = await writeClient.fetch(
      `*[_type == "order" && customerEmail == $email && (!defined(user) || user._ref != $currentUserId)]`,
      { 
        email: userEmail,
        currentUserId: currentUser._id 
      }
    );

    console.log(`Found ${ordersToFix.length} orders to fix`);

    if (ordersToFix.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'No orders found that need fixing',
        ordersFixed: 0 
      });
    }

    // Update each order to link to the current user
    const updatePromises = ordersToFix.map(order => 
      writeClient
        .patch(order._id)
        .set({ 
          user: { _type: 'reference', _ref: currentUser._id }
        })
        .commit()
        .then(updatedOrder => {
          console.log(`✅ Fixed order: ${updatedOrder._id}`);
          return updatedOrder;
        })
        .catch(error => {
          console.error(`❌ Failed to fix order ${order._id}:`, error);
          throw error;
        })
    );

    const fixedOrders = await Promise.all(updatePromises);

    console.log(`✅ Successfully fixed ${fixedOrders.length} orders`);

    return res.status(200).json({ 
      success: true, 
      message: `Successfully linked ${fixedOrders.length} orders to your account`,
      ordersFixed: fixedOrders.length,
      orderIds: fixedOrders.map(o => o._id)
    });

  } catch (error) {
    console.error('Error fixing order links:', error);
    return res.status(500).json({ 
      error: 'Failed to fix order links',
      details: error.message 
    });
  }
}