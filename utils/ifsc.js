// utils/ifsc.js
// IFSC (Indian Financial System Code) validation utilities
// No authentication required - uses Razorpay's free IFSC API

const IFSC_API_BASE = 'https://ifsc.razorpay.com';

/**
 * Validate IFSC code and get bank details
 * @param {string} ifscCode - IFSC code to validate (e.g., 'SBIN0001234')
 * @returns {Promise<Object>} Bank details if valid, error info if invalid
 */
export const validateIFSC = async (ifscCode) => {
  if (!ifscCode || typeof ifscCode !== 'string') {
    return {
      valid: false,
      error: 'IFSC code is required',
      code: ifscCode
    };
  }

  // Basic IFSC format validation: 4 letters + 0 + 6 alphanumeric characters
  const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
  if (!ifscPattern.test(ifscCode.trim())) {
    return {
      valid: false,
      error: 'Invalid IFSC format. Expected format: ABCD0XXXXXX (4 letters + 0 + 6 alphanumeric)',
      code: ifscCode
    };
  }

  try {
    const normalizedCode = ifscCode.trim().toUpperCase();
    const response = await fetch(`${IFSC_API_BASE}/${normalizedCode}`);

    // 404 means invalid IFSC
    if (response.status === 404) {
      return {
        valid: false,
        error: 'IFSC code not found',
        code: ifscCode
      };
    }

    if (!response.ok) {
      throw new Error(`IFSC API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      valid: true,
      bank: data.BANK || null,
      branch: data.BRANCH || null,
      address: data.ADDRESS || null,
      contact: data.CONTACT || null,
      city: data.CITY || null,
      district: data.DISTRICT || null,
      state: data.STATE || null,
      centre: data.CENTRE || null,
      upi: data.UPI || false,
      rtgs: data.RTGS || false,
      neft: data.NEFT || false,
      imps: data.IMPS || false,
      micr: data.MICR || null,
      swift: data.SWIFT || null,
      code: normalizedCode
    };
  } catch (error) {
    console.error('IFSC validation error:', error);
    return {
      valid: false,
      error: error.message,
      code: ifscCode
    };
  }
};

/**
 * Search for bank branches by bank name
 * @param {string} bankName - Bank name to search for
 * @returns {Promise<Array>} List of matching branches
 */
export const searchBankBranches = async (bankName) => {
  if (!bankName) {
    return [];
  }

  try {
    // Note: Razorpay IFSC API doesn't have a search endpoint
    // This would need a different API or local database
    // For now, return empty array
    console.warn('Bank search not available with current IFSC API');
    return [];
  } catch (error) {
    console.error('Bank search error:', error);
    return [];
  }
};

/**
 * Check if payment methods are available for a bank
 * @param {Object} bankDetails - Bank details from validateIFSC
 * @returns {Object} Available payment methods
 */
export const getAvailablePaymentMethods = (bankDetails) => {
  if (!bankDetails || !bankDetails.valid) {
    return {
      upi: false,
      neft: false,
      rtgs: false,
      imps: false
    };
  }

  return {
    upi: bankDetails.upi || false,
    neft: bankDetails.neft || false,
    rtgs: bankDetails.rtgs || false,
    imps: bankDetails.imps || false
  };
};

// Popular Indian banks for quick reference
export const POPULAR_BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Kotak Mahindra Bank',
  'Union Bank of India',
  'Canara Bank',
  'Indian Overseas Bank'
];
