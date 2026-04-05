// utils/clearbit.js
// Clearbit Logo API integration for B2B company logos
// FREE tier: 100 requests/month
// Get API key: https://dashboard.hubspot.com/app/clearbit-api-key

const CLEARBIT_API_KEY = process.env.CLEARBIT_API_KEY || process.env.NEXT_PUBLIC_CLEARBIT_API_KEY;

/**
 * Get company logo URL from domain
 * @param {string} domain - Company domain (e.g., 'google.com', 'apple.com')
 * @param {number} size - Logo size in pixels (default: 120)
 * @returns {string|null} Logo URL or null if not found
 */
export const getCompanyLogo = (domain, size = 120) => {
  if (!domain) return null;

  // Clearbit logo API (no auth needed for basic usage)
  return `https://logo.clearbit.com/${domain}?size=${size}`;
};

/**
 * Get company information from domain
 * @param {string} domain - Company domain
 * @returns {Promise<Object|null>} Company information or null
 */
export const getCompanyInfo = async (domain) => {
  if (!domain) return null;

  if (!CLEARBIT_API_KEY) {
    console.warn('Clearbit API key not configured. Company lookup disabled.');
    return null;
  }

  try {
    const response = await fetch(
      `https://company.clearbit.com/v2/companies/find?domain=${domain}`,
      {
        headers: {
          Authorization: `Bearer ${CLEARBIT_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Company not found
      }
      throw new Error(`Clearbit API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      name: data.name || null,
      domain: data.domain || domain,
      logo: data.logo || getCompanyLogo(domain),
      description: data.description || null,
      industry: data.category?.industry || null,
      employees: data.metrics?.employees || null,
      revenue: data.metrics?.estimatedAnnualRevenue || null,
      location: data.location || null,
      founded: data.foundedYear || null
    };
  } catch (error) {
    console.error('Clearbit company lookup failed:', error);
    return null;
  }
};

/**
 * Extract domain from email
 * @param {string} email - Email address
 * @returns {string|null} Domain or null
 */
export const getDomainFromEmail = (email) => {
  if (!email || typeof email !== 'string') return null;

  const match = email.match(/@([^.\s]+(?:\.[^.\s]+)+)/);
  return match ? match[1] : null;
};

/**
 * Extract domain from URL
 * @param {string} url - Full URL
 * @returns {string|null} Domain or null
 */
export const getDomainFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;

  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch (error) {
    // If URL parsing fails, try to extract domain directly
    const match = url.match(/^(?:https?:\/\/)?([^\/\?#]+)/);
    return match ? match[1] : null;
  }
};

/**
 * Preload logo image for faster display
 * @param {string} domain - Company domain
 * @returns {Promise<boolean>} Whether image preloaded successfully
 */
export const preloadLogo = (domain) => {
  if (!domain || typeof window === 'undefined') return Promise.resolve(false);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = getCompanyLogo(domain);
  });
};

/**
 * Check if Clearbit is configured
 * @returns {boolean}
 */
export const isClearbitConfigured = () => {
  return !!CLEARBIT_API_KEY;
};

// Common B2B domains for testing
export const TEST_COMPANIES = [
  { domain: 'google.com', name: 'Google' },
  { domain: 'apple.com', name: 'Apple' },
  { domain: 'microsoft.com', name: 'Microsoft' },
  { domain: 'amazon.com', name: 'Amazon' },
  { domain: 'meta.com', name: 'Meta' }
];
