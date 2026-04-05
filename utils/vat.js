// utils/vat.js
// VAT (Value Added Tax) validation utilities for EU B2B sales
// Requires VATlayer API key for validation

const VAT_API_BASE = 'https://apilayer.net/api/validate';

/**
 * Validate EU VAT number
 * @param {string} vatNumber - VAT number to validate (without country code)
 * @param {string} countryCode - 2-letter country code (e.g., 'DE', 'FR', 'GB')
 * @returns {Promise<Object>} Validation result with company details
 */
export const validateVAT = async (vatNumber, countryCode) => {
  const apiKey = process.env.NEXT_PUBLIC_VAT_API_KEY || process.env.VAT_API_KEY;
  
  if (!apiKey) {
    console.warn('VAT API key not configured. VAT validation disabled.');
    return {
      valid: false,
      error: 'VAT validation service not configured',
      company_name: null,
      company_address: null,
      country_code: countryCode,
      vat_number: vatNumber
    };
  }

  try {
    const fullVAT = `${countryCode}${vatNumber}`;
    const url = `${VAT_API_BASE}?access_key=${apiKey}&vat_number=${fullVAT}&format=1`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`VAT API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      valid: data.valid || false,
      company_name: data.company_name || null,
      company_address: data.company_address || null,
      country_code: data.country_code || countryCode,
      vat_number: data.vat_number || vatNumber,
      database: data.database || null,
      format: data.format || null
    };
  } catch (error) {
    console.error('VAT validation error:', error);
    return {
      valid: false,
      error: error.message,
      company_name: null,
      company_address: null,
      country_code: countryCode,
      vat_number: vatNumber
    };
  }
};

/**
 * Get VAT rate for a specific EU country
 * @param {string} countryCode - 2-letter country code
 * @returns {Object|null} VAT rate information
 */
export const getCountryVATRate = (countryCode) => {
  const vatRates = {
    'AT': { standard: 20, reduced: [10, 13] },      // Austria
    'BE': { standard: 21, reduced: [6, 12] },        // Belgium
    'BG': { standard: 20, reduced: [9] },            // Bulgaria
    'HR': { standard: 25, reduced: [5, 13] },        // Croatia
    'CY': { standard: 19, reduced: [5, 9] },         // Cyprus
    'CZ': { standard: 21, reduced: [10, 15] },       // Czech Republic
    'DK': { standard: 25, reduced: [] },             // Denmark
    'EE': { standard: 20, reduced: [9] },            // Estonia
    'FI': { standard: 24, reduced: [10, 14] },       // Finland
    'FR': { standard: 20, reduced: [5.5, 10] },      // France
    'DE': { standard: 19, reduced: [7] },            // Germany
    'GR': { standard: 24, reduced: [6, 13] },        // Greece
    'HU': { standard: 27, reduced: [5, 18] },        // Hungary
    'IE': { standard: 23, reduced: [9, 13.5] },      // Ireland
    'IT': { standard: 22, reduced: [4, 5, 10] },     // Italy
    'LV': { standard: 21, reduced: [5, 12] },        // Latvia
    'LT': { standard: 21, reduced: [5, 9] },         // Lithuania
    'LU': { standard: 17, reduced: [3, 7, 14] },     // Luxembourg
    'MT': { standard: 18, reduced: [5, 7] },         // Malta
    'NL': { standard: 21, reduced: [9] },            // Netherlands
    'PL': { standard: 23, reduced: [5, 8] },         // Poland
    'PT': { standard: 23, reduced: [6, 13] },        // Portugal
    'RO': { standard: 19, reduced: [5, 9] },         // Romania
    'SK': { standard: 20, reduced: [10] },           // Slovakia
    'SI': { standard: 22, reduced: [5, 9.5] },       // Slovenia
    'ES': { standard: 21, reduced: [4, 10] },        // Spain
    'SE': { standard: 25, reduced: [6, 12] },        // Sweden
    'GB': { standard: 20, reduced: [5] }             // United Kingdom
  };

  return vatRates[countryCode.toUpperCase()] || null;
};

/**
 * Calculate VAT amount
 * @param {number} amount - Base amount
 * @param {string} countryCode - Country code for VAT rate
 * @param {boolean} isB2B - Whether this is B2B transaction (VAT exempt with valid VAT number)
 * @returns {Object} VAT calculation details
 */
export const calculateVAT = (amount, countryCode, isB2B = false) => {
  const vatRate = getCountryVATRate(countryCode);
  
  if (!vatRate) {
    return {
      amount: 0,
      rate: 0,
      total: amount,
      isB2BExempt: false
    };
  }

  // B2B with valid VAT is exempt from VAT
  if (isB2B) {
    return {
      amount: 0,
      rate: 0,
      total: amount,
      isB2BExempt: true,
      standardRate: vatRate.standard
    };
  }

  const vatAmount = (amount * vatRate.standard) / 100;
  const total = amount + vatAmount;

  return {
    amount: vatAmount,
    rate: vatRate.standard,
    total: total,
    isB2BExempt: false
  };
};

// EU countries that require VAT collection
export const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
];

// Country names for display
export const COUNTRY_NAMES = {
  'AT': 'Austria',
  'BE': 'Belgium',
  'BG': 'Bulgaria',
  'HR': 'Croatia',
  'CY': 'Cyprus',
  'CZ': 'Czech Republic',
  'DE': 'Germany',
  'DK': 'Denmark',
  'EE': 'Estonia',
  'ES': 'Spain',
  'FI': 'Finland',
  'FR': 'France',
  'GB': 'United Kingdom',
  'GR': 'Greece',
  'HR': 'Croatia',
  'HU': 'Hungary',
  'IE': 'Ireland',
  'IT': 'Italy',
  'LT': 'Lithuania',
  'LU': 'Luxembourg',
  'LV': 'Latvia',
  'MT': 'Malta',
  'NL': 'Netherlands',
  'PL': 'Poland',
  'PT': 'Portugal',
  'RO': 'Romania',
  'SE': 'Sweden',
  'SK': 'Slovakia',
  'SI': 'Slovenia'
};
