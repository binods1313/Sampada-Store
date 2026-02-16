// components/Cart/config.js
// Static configuration and styles - extracted to prevent recreation

export const CART_CONFIG = {
  // Image dimensions
  cartImageWidth: 120,
  cartImageHeight: 160,
  imageWidth: 300,
  
  // API endpoints
  stripeApiEndpoint: '/api/stripe',
  
  // Stripe
  country: 'US',
  currency: 'usd',
  
  // Placeholder
  placeholderImage: '/asset/placeholder-image.jpg',
  
  // Blur data URL for image placeholder
  blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChECCwkICRAFBAcQEAwABgcBBANTBQcUDgcJBQ0IEhMKFBcPGRESFBIFDhcWGBwYFBgRGA=='
};

// Inline styles extracted to prevent recreation
export const CART_STYLES = {
  cartProductImageContainer: {
    width: '120px',
    height: '160px',
    flexShrink: 0,
    borderRadius: '8px',
    overflow: 'hidden',
    background: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  cartProductImage: {
    objectFit: 'contain',
    borderRadius: '8px'
  }
};

// Toast messages
export const TOAST_MESSAGES = {
  emptyCart: 'Your cart is empty!',
  preparingCheckout: 'Preparing checkout...',
  redirecting: 'Redirecting to checkout...',
  stockLimit: (stock) => `Only ${stock} of this item are in stock.`,
  checkoutError: 'An error occurred during checkout.',
  stripeError: 'Could not initialize Stripe. Please check if the Stripe key is configured.',
  stripeNotLoaded: 'Stripe.js not properly loaded - redirectToCheckout method unavailable.',
  invalidSession: 'Invalid session data received from server.'
};
