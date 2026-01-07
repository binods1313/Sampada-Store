// lib/getStripe.js (CORRECTED VERSION)
import { loadStripe } from '@stripe/stripe-js';

let stripeInstanceCache = null; // This will store the resolved Stripe instance

const getStripe = async () => {
  console.log('--- getStripe() called ---');

  // If the Stripe instance is already cached, return it directly
  if (stripeInstanceCache) {
    console.log('Stripe instance found in cache, returning it.');
    return stripeInstanceCache;
  }

  // Retrieve the publishable key
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  console.log('Attempting to load Stripe with key:', key ? key.substring(0, 10) + '...' : 'Key not found'); // Log partial key for security

  if (!key) {
    console.error('ERROR: Stripe publishable key is not set in environment variables! Cannot load Stripe.');
    return null;
  }
  
  try {
    console.log('Calling loadStripe(key)...');
    // loadStripe returns a promise that resolves to the Stripe instance
    const stripeLoadPromise = loadStripe(key); 
    
    // Await the promise to get the actual Stripe instance
    stripeInstanceCache = await stripeLoadPromise; 
    
    console.log('loadStripe(key) resolved. Result (stripeInstanceCache):', stripeInstanceCache);

    if (!stripeInstanceCache) {
      console.error('ERROR: Failed to initialize Stripe. loadStripe(key) returned null or undefined.');
      return null;
    }
    
    // CORRECTED: Proper validation - only check for redirectToCheckout method
    if (!stripeInstanceCache.redirectToCheckout || typeof stripeInstanceCache.redirectToCheckout !== 'function') {
      console.error('WARNING: Resolved Stripe object is missing redirectToCheckout method:', stripeInstanceCache);
      // Still return the instance - let Cart.jsx handle the final validation
    } else {
      console.log('Stripe instance successfully loaded and appears valid.');
    }

  } catch (error) {
    console.error('FATAL ERROR: Exception caught during Stripe initialization:', error);
    stripeInstanceCache = null; // Reset cache on error
    return null;
  }
  
  console.log('--- getStripe() finished, returning instance ---');
  return stripeInstanceCache;
};

export default getStripe;