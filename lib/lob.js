/**
 * Lob.com Address Validation API
 * 
 * Validates and corrects shipping addresses to reduce failed deliveries.
 * Supports 240+ countries.
 * 
 * Pricing: ~$0.01 per validation
 * Free tier: $1 credit on signup
 * Get API key: https://dashboard.lob.com/
 */

const API_KEY = process.env.LOB_API_KEY
const BASE_URL = 'https://api.lob.com/v1'

/**
 * Validate and auto-correct a shipping address
 * @param {Object} address
 * @param {string} address.line1 - Street address
 * @param {string} address.line2 - Apt/suite (optional)
 * @param {string} address.city - City
 * @param {string} address.state - State/province
 * @param {string} address.zip - ZIP/postal code
 * @param {string} address.country - ISO 3166-1 alpha-2 country code (e.g., 'US', 'IN')
 * @returns {Promise<Object>} Validation result
 */
export async function validateAddress(address) {
  if (!API_KEY) {
    console.warn('Lob API key not configured. Address validation disabled.')
    return { valid: true, error: 'Lob not configured', address }
  }

  try {
    const response = await fetch(`${BASE_URL}/us_verifications`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        primary_line: address.line1,
        secondary_line: address.line2 || '',
        city: address.city,
        state: address.state,
        zip_code: address.zip
      }).toString()
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Lob address validation error:', data)
      return {
        valid: false,
        error: data.error?.message || 'Validation failed',
        address
      }
    }

    // Check if address is deliverable
    const deliverable = data.deliverability === 'deliverable'
    
    return {
      valid: deliverable,
      original: address,
      corrected: deliverable ? {
        line1: data.primary_line,
        line2: data.secondary_line || null,
        city: data.city,
        state: data.state,
        zip: data.zip_code,
        country: address.country
      } : null,
      deliverability: data.deliverability,
      changes: data.changes // Shows what was corrected
    }
  } catch (error) {
    console.error('Lob API error:', error)
    return { valid: true, error: error.message, address }
  }
}

/**
 * Validate international address
 * @param {Object} address
 * @returns {Promise<Object>}
 */
export async function validateInternationalAddress(address) {
  if (!API_KEY) {
    return { valid: true, error: 'Lob not configured', address }
  }

  try {
    const response = await fetch(`${BASE_URL}/intl_verifications`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        address_line1: address.line1,
        address_line2: address.line2 || '',
        address_city: address.city,
        address_state: address.state,
        address_zip: address.zip,
        address_country: address.country
      }).toString()
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        valid: false,
        error: data.error?.message || 'Validation failed',
        address
      }
    }

    const deliverable = data.deliverability === 'deliverable'
    
    return {
      valid: deliverable,
      original: address,
      corrected: deliverable ? {
        line1: data.address_line1,
        line2: data.address_line2 || null,
        city: data.address_city,
        state: data.address_state,
        zip: data.address_zip,
        country: data.address_country
      } : null,
      deliverability: data.deliverability
    }
  } catch (error) {
    return { valid: true, error: error.message, address }
  }
}

/**
 * Validate address based on country (auto-detects US vs international)
 * @param {Object} address
 * @returns {Promise<Object>}
 */
export async function validateAddressAuto(address) {
  const country = (address.country || 'US').toUpperCase()
  
  if (country === 'US') {
    return validateAddress(address)
  } else {
    return validateInternationalAddress(address)
  }
}

/**
 * Format address for display
 * @param {Object} address
 * @returns {string}
 */
export function formatAddress(address) {
  const parts = [
    address.line1,
    address.line2,
    `${address.city}, ${address.state} ${address.zip}`,
    address.country
  ].filter(Boolean)

  return parts.join(', ')
}

export default {
  validateAddress,
  validateInternationalAddress,
  validateAddressAuto,
  formatAddress
}
