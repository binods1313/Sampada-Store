// pages/api/printify/sync-product.js
import { printifyAPI } from '../../../lib/printifyClient';
import { client } from '../../../lib/client';

/**
 * API endpoint to sync product data from Printify to Sanity
 * 
 * POST /api/printify/sync-product
 * Body: { printifyProductId: string, sanityProductId: string }
 * 
 * Returns: { success: boolean, message: string, data: object }
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { printifyProductId, sanityProductId } = req.body;

    // Validate required fields
    if (!printifyProductId || !sanityProductId) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: printifyProductId and sanityProductId' 
      });
    }

    // Validate environment variables
    const shopId = process.env.PRINTIFY_SHOP_ID;
    const apiKey = process.env.PRINTIFY_API_KEY;

    if (!shopId || !apiKey) {
      return res.status(500).json({ 
        success: false,
        error: 'Printify credentials not configured. Check PRINTIFY_SHOP_ID and PRINTIFY_API_KEY environment variables.' 
      });
    }

    // Fetch product from Printify
    console.log(`Fetching Printify product: ${printifyProductId}`);
    const printifyProduct = await printifyAPI.getProduct(shopId, printifyProductId);

    if (!printifyProduct || !printifyProduct.id) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found in Printify' 
      });
    }

    // Sync data to Sanity format
    const syncedData = printifyAPI.syncProductData(printifyProduct);

    // Update Sanity product with write token
    const writeToken = process.env.SANITY_API_TOKEN;
    if (!writeToken) {
      return res.status(500).json({ 
        success: false,
        error: 'Sanity write token not configured. Check SANITY_API_TOKEN environment variable.' 
      });
    }

    // Create write client
    const writeClient = client.withConfig({ token: writeToken });

    // Update the product
    await writeClient
      .patch(sanityProductId)
      .set({ 
        printifyIntegration: { 
          ...syncedData, 
          isPrintifyProduct: true 
        } 
      })
      .commit();

    console.log(`Successfully synced product ${printifyProductId} to Sanity ${sanityProductId}`);

    res.status(200).json({ 
      success: true, 
      message: 'Product synced successfully',
      data: syncedData,
      printifyProduct: {
        id: printifyProduct.id,
        title: printifyProduct.title,
        description: printifyProduct.description
      }
    });

  } catch (error) {
    console.error('Printify sync error:', error);
    
    // Handle specific error types
    if (error.response) {
      // Printify API error
      return res.status(error.response.status || 500).json({ 
        success: false,
        error: 'Printify API error',
        details: error.response.data || error.message
      });
    }

    // Generic error
    res.status(500).json({ 
      success: false,
      error: 'Failed to sync product',
      details: error.message
    });
  }
}
