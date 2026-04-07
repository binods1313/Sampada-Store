// translations/index.js
// Sampada i18n - English & Hindi translations
// Usage: import { t } from '@/translations'; t('cart.checkout', 'hi')

export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.collections': 'Collections',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.account': 'Account',

    // Cart
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty',
    'cart.checkout': 'Checkout',
    'cart.continue': 'Continue Shopping',
    'cart.subtotal': 'Subtotal',
    'cart.total': 'Total',

    // Product
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    'product.lowStock': 'Only {count} left!',
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.freeShipping': 'Free Shipping ₹999+',
    'product.returns': '30-Day Returns',

    // Trust
    'trust.shipping': 'Fast Delivery',
    'trust.returns': 'Easy Returns',
    'trust.secure': 'Secure Checkout',
    'trust.cod': 'COD Available',

    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.signOut': 'Sign Out',
    'auth.email': 'Email',
    'auth.password': 'Password',

    // Footer
    'footer.follow': 'Follow Us',
    'footer.newsletter': 'Subscribe for updates',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.tryAgain': 'Try Again',
    'common.close': 'Close',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.shop': 'दुकान',
    'nav.collections': 'संग्रह',
    'nav.about': 'हमारे बारे में',
    'nav.contact': 'संपर्क',
    'nav.account': 'खाता',

    // Cart
    'cart.title': 'आपकी कार्ट',
    'cart.empty': 'आपकी कार्ट खाली है',
    'cart.checkout': 'चेकआउट',
    'cart.continue': 'खरीदारी जारी रखें',
    'cart.subtotal': 'उप-योग',
    'cart.total': 'कुल',

    // Product
    'product.inStock': 'स्टॉक में',
    'product.outOfStock': 'स्टॉक खत्म',
    'product.lowStock': 'केवल {count} बचे!',
    'product.addToCart': 'कार्ट में जोड़ें',
    'product.buyNow': 'अभी खरीदें',
    'product.freeShipping': '₹999+ मुफ्त शिपिंग',
    'product.returns': '30 दिन रिटर्न',

    // Trust
    'trust.shipping': 'तेज़ डिलीवरी',
    'trust.returns': 'आसान रिटर्न',
    'trust.secure': 'सुरक्षित चेकआउट',
    'trust.cod': 'COD उपलब्ध',

    // Auth
    'auth.signIn': 'साइन इन',
    'auth.signUp': 'साइन अप',
    'auth.signOut': 'साइन आउट',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',

    // Footer
    'footer.follow': 'हमें फॉलो करें',
    'footer.newsletter': 'अपडेट के लिए सब्सक्राइब करें',

    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'कुछ गलत हो गया',
    'common.tryAgain': 'फिर से कोशिश करें',
    'common.close': 'बंद करें',
  },
};

/**
 * Translation function
 * @param {string} key - Translation key (e.g., 'cart.checkout')
 * @param {string} locale - Language code ('en' or 'hi')
 * @param {Object} params - Optional params for interpolation
 * @returns {string} Translated string
 */
export const t = (key, locale = 'en', params = {}) => {
  const lang = translations[locale] || translations.en;
  let text = lang[key] || translations.en[key] || key;

  // Replace params (e.g., {count} -> actual value)
  Object.entries(params).forEach(([param, value]) => {
    text = text.replace(`{${param}}`, value);
  });

  return text;
};

export default translations;
