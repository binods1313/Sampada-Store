// utils/cartRecovery.js
// Cart abandonment recovery utilities
// Tracks abandoned carts and triggers recovery flows

/**
 * Track abandoned cart event
 * Stores cart data in localStorage for recovery
 * @param {Object} cartData - Cart information
 */
export const trackAbandonedCart = (cartData) => {
  if (!cartData || !cartData.items || cartData.items.length === 0) return;

  const abandonmentData = {
    items: cartData.items.map(item => ({
      id: item._id || item.cartUniqueId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image?.[0]?.asset?.url || null,
    })),
    total: cartData.totalPrice,
    currency: cartData.currency || 'USD',
    abandonedAt: new Date().toISOString(),
    email: cartData.customerEmail || null,
    recovered: false,
  };

  try {
    localStorage.setItem('sampada_abandoned_cart', JSON.stringify(abandonmentData));

    // Send to Mailchimp if configured (fire and forget)
    if (cartData.customerEmail) {
      fetch('/api/mailchimp/abandoned-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cartData.customerEmail,
          cartItems: abandonmentData.items,
          cartTotal: abandonmentData.total,
          cartUrl: `${window.location.origin}/cart?recover=true`,
        }),
        keepalive: true,
      }).catch(() => {}); // Silently fail
    }
  } catch (error) {
    console.warn('Failed to track abandoned cart:', error);
  }
};

/**
 * Check if there's an abandoned cart to recover
 * @returns {Object|null} Abandoned cart data or null
 */
export const getAbandonedCart = () => {
  try {
    const data = localStorage.getItem('sampada_abandoned_cart');
    if (!data) return null;

    const cart = JSON.parse(data);
    // Only recover carts abandoned within last 7 days
    const abandonedAt = new Date(cart.abandonedAt);
    const daysSince = (Date.now() - abandonedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > 7) {
      localStorage.removeItem('sampada_abandoned_cart');
      return null;
    }

    return cart;
  } catch {
    return null;
  }
};

/**
 * Clear abandoned cart data
 */
export const clearAbandonedCart = () => {
  try {
    localStorage.removeItem('sampada_abandoned_cart');
  } catch {}
};

/**
 * Show cart recovery banner
 * @returns {Object|null} Recovery banner config or null
 */
export const getRecoveryBannerConfig = () => {
  const cart = getAbandonedCart();
  if (!cart) return null;

  return {
    title: 'Welcome Back! Your Cart is Waiting',
    message: `You have ${cart.items.length} item${cart.items.length > 1 ? 's' : ''} in your cart.`,
    total: cart.total,
    items: cart.items,
    actionText: 'Complete Your Purchase',
  };
};

export default {
  trackAbandonedCart,
  getAbandonedCart,
  clearAbandonedCart,
  getRecoveryBannerConfig,
};
