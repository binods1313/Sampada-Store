// utils/currency.js
// Currency conversion utilities using free Currency API
// No authentication required, 150+ currencies, real-time rates

// Primary and fallback endpoints (per migration guide)
const CURRENCY_API_PRIMARY = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1';
const CURRENCY_API_FALLBACK = 'https://latest.currency-api.pages.dev/v1';

// Cache for exchange rates to avoid unnecessary API calls
const rateCache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache

/**
 * Fetch with fallback logic
 */
const fetchWithFallback = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  } catch (error) {
    // Try fallback endpoint
    const fallbackUrl = url.replace(CURRENCY_API_PRIMARY, CURRENCY_API_FALLBACK);
    const fallbackResponse = await fetch(fallbackUrl);
    if (!fallbackResponse.ok) {
      throw new Error(`Both primary and fallback endpoints failed`);
    }
    return fallbackResponse;
  }
};

/**
 * Fetch exchange rate from base currency to target currency
 * @param {string} from - Base currency code (e.g., 'USD', 'EUR')
 * @param {string} to - Target currency code (e.g., 'INR', 'GBP')
 * @returns {Promise<number>} Exchange rate
 */
export const getExchangeRate = async (from = 'USD', to = 'INR') => {
  try {
    const fromLower = from.toLowerCase();
    const toLower = to.toLowerCase();
    const cacheKey = `${fromLower}-${toLower}`;

    // Check cache first
    const cached = rateCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.rate;
    }

    const response = await fetchWithFallback(
      `${CURRENCY_API_PRIMARY}/currencies/${fromLower}.json`
    );

    const data = await response.json();
    const rate = data[fromLower]?.[toLower];

    if (!rate) {
      console.warn(`Exchange rate not found for ${from} to ${to}`);
      return 1; // Fallback to 1:1 rate
    }

    // Cache the rate
    rateCache.set(cacheKey, {
      rate,
      timestamp: Date.now()
    });

    return rate;
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    return 1; // Fallback to 1:1 rate on error
  }
};

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} from - Source currency code
 * @param {string} to - Target currency code
 * @returns {Promise<number>} Converted amount
 */
export const convertPrice = async (amount, from = 'USD', to = 'INR') => {
  if (from === to) return amount;
  
  const rate = await getExchangeRate(from, to);
  return parseFloat((amount * rate).toFixed(2));
};

/**
 * Format currency amount with symbol
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF ',
    CNY: '¥',
    SEK: 'kr',
    NZD: 'NZ$'
  };

  const symbol = currencySymbols[currency] || currency + ' ';
  
  return `${symbol}${amount.toFixed(2)}`;
};

/**
 * Get all available currency codes
 * @returns {Promise<string[]>} Array of currency codes
 */
export const getAvailableCurrencies = async () => {
  try {
    const response = await fetchWithFallback(
      `${CURRENCY_API_PRIMARY}/currencies.json`
    );

    const data = await response.json();
    return Object.keys(data);
  } catch (error) {
    console.error('Failed to fetch available currencies:', error);
    return ['USD', 'EUR', 'GBP', 'INR']; // Fallback to common currencies
  }
};

/**
 * Batch convert prices for multiple currencies
 * @param {number} amount - Amount to convert
 * @param {string} from - Source currency
 * @param {string[]} toCurrencies - Array of target currencies
 * @returns {Promise<Object>} Object with currency codes as keys and converted amounts as values
 */
export const batchConvert = async (amount, from = 'USD', toCurrencies = ['INR', 'EUR', 'GBP']) => {
  const conversions = {};
  
  await Promise.all(
    toCurrencies.map(async (currency) => {
      try {
        conversions[currency] = await convertPrice(amount, from, currency);
      } catch (error) {
        console.error(`Failed to convert to ${currency}:`, error);
        conversions[currency] = amount; // Fallback
      }
    })
  );

  return conversions;
};

// Clear cache (useful for manual refresh)
export const clearCurrencyCache = () => {
  rateCache.clear();
};

// Common currency options for selector
export const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' }
];
