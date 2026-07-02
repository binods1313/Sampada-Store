import crypto from 'crypto'

/**
 * Mailchimp API Integration
 * 
 * Features:
 * - Subscribe customers to newsletter
 * - Add abandoned cart data to customer profile
 * - Trigger post-purchase email flows
 * 
 * Free tier: Up to 2,000 contacts
 * Get API key: https://mailchimp.com/help/about-api-keys/
 */

const API_KEY = process.env.MAILCHIMP_API_KEY
const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID
const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX || 'us1'

const BASE_URL = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0`

/**
 * Subscribe a user to Mailchimp audience
 * @param {Object} params
 * @param {string} params.email - Customer email
 * @param {string} params.firstName - First name (optional)
 * @param {string} params.lastName - Last name (optional)
 * @param {Object} params.mergeFields - Additional fields (optional)
 * @param {string} params.status - 'subscribed' | 'pending' | 'unsubscribed'
 * @returns {Promise<Object>} Mailchimp API response
 */
export async function subscribeUser({
  email,
  firstName,
  lastName,
  mergeFields = {},
  status = 'subscribed',
  tags = [],
}) {
  if (!API_KEY || !AUDIENCE_ID) {
    console.warn('Mailchimp not configured. Missing API key or Audience ID.')
    return { success: false, error: 'Mailchimp not configured' }
  }

  try {
    const response = await fetch(`${BASE_URL}/lists/${AUDIENCE_ID}/members`, {
      method: 'POST',
      headers: {
        Authorization: `apikey ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: email,
        status,
        merge_fields: {
          FNAME: firstName || '',
          LNAME: lastName || '',
          ...mergeFields
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      // Handle "already subscribed" gracefully
      if (data.title === 'Member Exists') {
        if (tags.length > 0) {
          await addMemberTags(email, tags)
        }
        return { success: true, message: 'Already subscribed', data, discountCode: 'WELCOME10' }
      }
      console.error('Mailchimp subscription error:', data)
      return { success: false, error: data.detail || data.title }
    }

    if (tags.length > 0) {
      await addMemberTags(email, tags)
    }

    return { success: true, data, discountCode: 'WELCOME10' }
  } catch (error) {
    console.error('Mailchimp API error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Update customer with abandoned cart data
 * @param {Object} params
 * @param {string} params.email - Customer email
 * @param {Array} params.cartItems - Cart items
 * @param {number} params.cartTotal - Cart total
 * @param {string} params.cartUrl - URL to restore cart
 * @returns {Promise<Object>}
 */
export async function trackAbandonedCart({ email, cartItems, cartTotal, cartUrl }) {
  if (!API_KEY || !AUDIENCE_ID) {
    return { success: false, error: 'Mailchimp not configured' }
  }

  try {
    // First, ensure user is subscribed
    await subscribeUser({ email, status: 'subscribed' })

    // Then update with cart data
    const response = await fetch(`${BASE_URL}/lists/${AUDIENCE_ID}/members/${hashEmail(email)}`, {
      method: 'PATCH',
      headers: {
        Authorization: `apikey ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        merge_fields: {
          CARTITEMS: JSON.stringify(cartItems),
          CARTTOTAL: cartTotal.toFixed(2),
          CARTURL: cartUrl,
          LASTCARTDATE: new Date().toISOString()
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Mailchimp cart tracking error:', data)
      return { success: false, error: data.detail || data.title }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Mailchimp cart tracking error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Trigger post-purchase email
 * @param {Object} params
 * @param {string} params.email - Customer email
 * @param {string} params.orderId - Order ID
 * @param {number} params.orderTotal - Order total
 * @param {Array} params.items - Order items
 * @returns {Promise<Object>}
 */
export async function triggerPostPurchaseEmail({ email, orderId, orderTotal, items }) {
  if (!API_KEY || !AUDIENCE_ID) {
    return { success: false, error: 'Mailchimp not configured' }
  }

  try {
    // Update customer profile with purchase data
    const response = await fetch(`${BASE_URL}/lists/${AUDIENCE_ID}/members/${hashEmail(email)}`, {
      method: 'PATCH',
      headers: {
        Authorization: `apikey ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        merge_fields: {
          LASTORDERID: orderId,
          LASTORDERTOTAL: orderTotal.toFixed(2),
          LASTORDERDATE: new Date().toISOString(),
          LASTORDERITEMS: JSON.stringify(items)
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Mailchimp post-purchase trigger error:', data)
      return { success: false, error: data.detail || data.title }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Mailchimp post-purchase trigger error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Hash email for Mailchimp subscriber ID
 * @param {string} email
 * @returns {string} MD5 hash
 */
function hashEmail(email) {
  return crypto
    .createHash('md5')
    .update(email.trim().toLowerCase())
    .digest('hex')
}

async function addMemberTags(email, tags) {
  if (!API_KEY || !AUDIENCE_ID || !tags.length) return

  try {
    const subscriberHash = hashEmail(email)
    await fetch(`${BASE_URL}/lists/${AUDIENCE_ID}/members/${subscriberHash}/tags`, {
      method: 'POST',
      headers: {
        Authorization: `apikey ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tags: tags.map((name) => ({ name, status: 'active' })),
      }),
    })
  } catch (error) {
    console.error('Mailchimp tag error (non-fatal):', error.message)
  }
}

/**
 * Get audience stats
 * @returns {Promise<Object>}
 */
export async function getAudienceStats() {
  if (!API_KEY || !AUDIENCE_ID) {
    return { success: false, error: 'Mailchimp not configured' }
  }

  try {
    const response = await fetch(`${BASE_URL}/lists/${AUDIENCE_ID}`, {
      headers: {
        Authorization: `apikey ${API_KEY}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.detail || data.title }
    }

    return {
      success: true,
      data: {
        totalContacts: data.stats.member_count,
        subscribedContacts: data.stats.subscribed_count,
        unsubscribedContacts: data.stats.unsubscribed_count,
        cleanedContacts: data.stats.cleaned_count
      }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get recent subscribers for admin dashboard
 * @param {number} count
 * @returns {Promise<Object>}
 */
export async function getRecentSubscribers(count = 10) {
  if (!API_KEY || !AUDIENCE_ID) {
    return { success: false, error: 'Mailchimp not configured' }
  }

  try {
    const response = await fetch(
      `${BASE_URL}/lists/${AUDIENCE_ID}/members?count=${count}&sort_field=timestamp_signup&sort_dir=DESC`,
      {
        headers: { Authorization: `apikey ${API_KEY}` },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.detail || data.title }
    }

    return {
      success: true,
      data: (data.members || []).map((m) => ({
        email: m.email_address,
        subscribedAt: m.timestamp_signup,
        tags: (m.tags || []).map((t) => t.name),
      })),
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export default {
  subscribeUser,
  trackAbandonedCart,
  triggerPostPurchaseEmail,
  getAudienceStats,
  getRecentSubscribers,
}
