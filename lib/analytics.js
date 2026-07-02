/**
 * Google Analytics 4 (GA4) Integration
 * 
 * Tracks e-commerce events:
 * - view_item (product page views)
 * - add_to_cart (cart additions)
 * - begin_checkout (checkout started)
 * - purchase (completed orders)
 * - search (product searches)
 * 
 * Setup:
 * 1. Create GA4 property at https://analytics.google.com/
 * 2. Get Measurement ID (format: G-XXXXXXXXXX)
 * 3. Add to .env.local: NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 */

// Initialize GA4
export const initGA = (measurementId) => {
  if (!measurementId) {
    console.warn('GA4 Measurement ID not provided. Analytics disabled.')
    return
  }

  // Load gtag script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', measurementId, {
    send_page_view: true,
    debug_mode: process.env.NODE_ENV === 'development'
  })

  console.log('GA4 initialized:', measurementId)
}

// Track product view
export const trackViewItem = (item) => {
  if (!window.gtag) return
  
  window.gtag('event', 'view_item', {
    currency: item.currency || 'USD',
    value: item.price || 0,
    items: [{
      item_id: item.id || item._id,
      item_name: item.name,
      item_category: item.category,
      price: item.price || 0,
      quantity: 1
    }]
  })
}

// Track add to cart
export const trackAddToCart = (items) => {
  if (!window.gtag) return
  
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  window.gtag('event', 'add_to_cart', {
    currency: items[0]?.currency || 'USD',
    value: totalValue,
    items: items.map(item => ({
      item_id: item.id || item._id,
      item_name: item.name,
      item_category: item.category,
      price: item.price || 0,
      quantity: item.quantity || 1
    }))
  })
}

// Track checkout started
export const trackBeginCheckout = (items, total) => {
  if (!window.gtag) return
  
  window.gtag('event', 'begin_checkout', {
    currency: items[0]?.currency || 'USD',
    value: total,
    items: items.map(item => ({
      item_id: item.id || item._id,
      item_name: item.name,
      item_category: item.category,
      price: item.price || 0,
      quantity: item.quantity || 1
    }))
  })
}

// Track purchase
export const trackPurchase = (order) => {
  if (!window.gtag) return
  
  window.gtag('event', 'purchase', {
    transaction_id: order.id || order._id,
    value: order.total || 0,
    tax: order.tax || 0,
    shipping: order.shipping || 0,
    currency: order.currency || 'USD',
    coupon: order.coupon || '(none)',
    items: (order.items || []).map(item => ({
      item_id: item.id || item._id,
      item_name: item.name,
      item_category: item.category,
      price: item.price || 0,
      quantity: item.quantity || 1
    }))
  })
}

// Track search
export const trackSearch = (searchTerm, results) => {
  if (!window.gtag) return
  
  window.gtag('event', 'search', {
    search_term: searchTerm,
    results_count: results?.length || 0
  })
}

// Track custom event
export const trackEvent = (eventName, params = {}) => {
  if (!window.gtag) return
  
  window.gtag('event', eventName, params)
}

export default {
  initGA,
  trackViewItem,
  trackAddToCart,
  trackBeginCheckout,
  trackPurchase,
  trackSearch,
  trackEvent
}
