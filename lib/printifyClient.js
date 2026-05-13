const PRINTIFY_BASE_URL = 'https://api.printify.com/v1';

export const printifyAPI = {
  headers: {
    'Authorization': `Bearer ${process.env.PRINTIFY_API_KEY}`,
    'Content-Type': 'application/json'
  },

  // Fetch catalog products
  getCatalog: async () => {
    const response = await fetch(`${PRINTIFY_BASE_URL}/catalog/blueprints.json`, {
      headers: printifyAPI.headers
    });
    return response.json();
  },

  // Get your shop's products
  getShopProducts: async (shopId) => {
    const response = await fetch(`${PRINTIFY_BASE_URL}/shops/${shopId}/products.json`, {
      headers: printifyAPI.headers
    });
    return response.json();
  },

  // Get single product details
  getProduct: async (shopId, productId) => {
    const response = await fetch(`${PRINTIFY_BASE_URL}/shops/${shopId}/products/${productId}.json`, {
      headers: printifyAPI.headers
    });
    return response.json();
  },

  // Get product variants
  getProductVariants: async (shopId, productId) => {
    const response = await fetch(`${PRINTIFY_BASE_URL}/shops/${shopId}/products/${productId}/variants.json`, {
      headers: printifyAPI.headers
    });
    return response.json();
  },

  // Get shipping info
  getShippingInfo: async (shopId, productId) => {
    const response = await fetch(`${PRINTIFY_BASE_URL}/shops/${shopId}/products/${productId}/shipping.json`, {
      headers: printifyAPI.headers
    });
    return response.json();
  },

  // Create order
  createOrder: async (shopId, orderData) => {
    const response = await fetch(`${PRINTIFY_BASE_URL}/shops/${shopId}/orders.json`, {
      method: 'POST',
      headers: printifyAPI.headers,
      body: JSON.stringify(orderData)
    });
    return response.json();
  },

  // Get order status
  getOrder: async (shopId, orderId) => {
    const response = await fetch(`${PRINTIFY_BASE_URL}/shops/${shopId}/orders/${orderId}.json`, {
      headers: printifyAPI.headers
    });
    return response.json();
  },

  // Sync product data from Printify to Sanity format
  syncProductData: (printifyProduct) => {
    return {
      printifyProductId: printifyProduct.id,
      printifyBlueprintId: printifyProduct.blueprint_id,
      printProviderName: printifyProduct.print_provider?.title || 'Printify',
      printifyVariantId: printifyProduct.variants?.[0]?.id || '',
      printifyMockupUrl: printifyProduct.images?.[0]?.src || '',
      printifyPrice: printifyProduct.variants?.[0]?.price / 100 || 0, // Convert cents to dollars
      printifyShipping: printifyProduct.shipping_info || 'Standard shipping: 5-7 business days'
    };
  }
};
