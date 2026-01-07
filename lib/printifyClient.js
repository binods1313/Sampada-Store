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

  // Create order
  createOrder: async (shopId, orderData) => {
    const response = await fetch(`${PRINTIFY_BASE_URL}/shops/${shopId}/orders.json`, {
      method: 'POST',
      headers: printifyAPI.headers,
      body: JSON.stringify(orderData)
    });
    return response.json();
  }
};