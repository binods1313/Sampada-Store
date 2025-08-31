// pages/api/user/orders.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { writeClient } from '../../../lib/client'; // Correctly importing writeClient

// Helper function for delay
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get Sanity user document from auth provider ID
async function getSanityUser(authUserId) {
  try {
    // Use writeClient here too for immediate consistency in finding the user
    return await writeClient.fetch(
      `*[_type == "user" && providerId == $authUserId][0]`,
      { authUserId }
    );
  } catch (error) {
    console.error('Error fetching Sanity user in API:', error);
    return null;
  }
}

export default async function handler(req, res) {
  // CRITICAL FIX: Add Cache-Control headers IMMEDIATELY at the start of the handler
  // This ensures all responses (success or error) tell the client not to cache.
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache'); // Older HTTP/1.0 compatible
  res.setHeader('Expires', '0');       // Older HTTP/1.0 compatible

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Get matching Sanity user document
  const sanityUser = await getSanityUser(session.user.id);
  if (!sanityUser?._id) {
    // For a missing user profile, you might want to return an empty array instead of 404
    // to avoid an error state for a valid user who just hasn't created a Sanity profile yet.
    console.warn(`[API] User profile not found for auth ID: ${session.user.id}. Returning empty orders.`);
    return res.status(200).json({ orders: [] }); // Return empty array if user profile not found
  }

  // Updated query to fetch new variant fields
  const ordersQuery = `*[
    _type == "order" &&
    user._ref == $userRef
  ] | order(paidAt desc){
    _id,
    paidAt,
    totalAmount,
    status,
    orderItems[]{
      _key,
      quantity,
      pricePerItem, // Fetch the price per item paid (should be variant price if applicable)
      variantColorName, // Fetch new field
      variantSize,    // Fetch new field
      variantKey,     // Fetch new field
      variantImage{ // Fetch image asset details for the variant
        asset->{
          _id,
          url
        }
      },
      product->{ // Fetch base product details for fallback display
        name, // Use 'name' from product schema
        price, // Base price from product schema
        image // Default images array from product schema
      }
    }
  }`;

  // Retry configuration (kept as per your original code)
  const maxRetries = 5;
  const baseDelay = 1500;
  let orders = [];
  let attempt = 0;
  let lastError = null;

  while (attempt < maxRetries) {
    try {
      orders = await writeClient.fetch(ordersQuery, {
         userRef: sanityUser._id
       });

       console.log(`[API] Fetched ${orders.length} orders for ${sanityUser._id} (Attempt ${attempt + 1})`);

       if (orders.length > 0) {
         // Optionally, if the latest order is detected, break early.
         // This can be complex to implement reliably without knowing the 'latest order ID' etc.
         // For now, let the retry loop complete or until orders.length > 0 is consistently met.
         break; // Break if orders are found
       }

       if (attempt === maxRetries - 1) {
         console.log('[API] Final attempt - checking system for recent orders...');
         const recentOrders = await writeClient.fetch(
           `*[_type == "order" && dateTime(paidAt) > dateTime(now()) - 60*60*24]|
           order(paidAt desc){_id, user->{_id, providerId}, paidAt}`
         );
         console.log(`[API] Recent system orders: ${recentOrders.length}`);
       }

       const delay = baseDelay * Math.pow(2, attempt);
       console.log(`[API] Retrying in ${delay}ms...`);
       await wait(delay);
     } catch (error) {
       console.error(`[API] Attempt ${attempt + 1} error:`, error);
       lastError = error;
     }
     attempt++;
   }

  if (lastError && orders.length === 0) {
    // Error response will also have Cache-Control headers applied from the top
    return res.status(500).json({
       message: 'Order fetch failed after retries',
       error: lastError.message,
       userId: session.user.id,
       sanityUserId: sanityUser._id
     });
  }
  // Success response will also have Cache-Control headers applied from the top
  return res.status(200).json({ orders });
}