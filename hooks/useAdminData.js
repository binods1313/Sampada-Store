import { useState, useEffect } from 'react'
import { client } from '@/utils/sanityClient'

/**
 * Hook for fetching admin data from Sanity
 * Handles loading states, errors, and revalidation
 */
export function useAdminData(query, params = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await client.fetch(query, params)
        if (mounted) {
          setData(result)
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to fetch data')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [query, JSON.stringify(params)])

  return { data, loading, error }
}

/**
 * Hook for dashboard stats
 */
export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    categories: 0,
    lowStock: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [totalQuery, activeQuery, categoriesQuery, lowStockQuery] = await Promise.all([
          client.fetch('count(*[_type == "product"])'),
          client.fetch('count(*[_type == "product" && status == "active"])'),
          client.fetch('count(*[_type == "category"])'),
          client.fetch('count(*[_type == "product" && defined(variants) && count(variants[variantStock < 10]) > 0])')
        ])

        setStats({
          totalProducts: totalQuery,
          activeProducts: activeQuery,
          categories: categoriesQuery,
          lowStock: lowStockQuery
        })
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
}

/**
 * Hook for recent products
 */
export function useRecentProducts(limit = 10) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const query = `*[_type == "product"] | order(_createdAt desc) [0...${limit}] {
      _id,
      name,
      "slug": slug.current,
      status,
      price,
      discount,
      "image": image[0],
      inventory,
      variants[] {
        variantStock,
        colorName,
        size
      },
      _createdAt
    }`

    client.fetch(query)
      .then(data => {
        setProducts(data)
      })
      .catch(error => {
        console.error('Failed to fetch recent products:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [limit])

  return { products, loading }
}

/**
 * Hook for KPI data - fetches all 6 stats in parallel with Promise.allSettled
 */
export function useKPIData() {
  const [kpiData, setKpiData] = useState({
    totalOrders: { value: null, trend: null, loading: true },
    revenueToday: { value: null, trend: null, loading: true },
    totalProducts: { value: null, trend: null, loading: true },
    activeCollections: { value: null, trend: null, loading: true },
    aiCallsToday: { value: null, trend: null, loading: true },
    grokCredits: { value: '$5.00', trend: null, loading: false }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchKPIs = async () => {
      try {
        const results = await Promise.allSettled([
          // Total Orders - fetch from orders API
          fetch('/api/user/orders').then(r => r.json()).then(data => {
            const orders = data.orders || []
            const total = orders.length
            const today = new Date().toDateString()
            const yesterday = new Date(Date.now() - 86400000).toDateString()
            const todayCount = orders.filter(o => new Date(o.paidAt).toDateString() === today).length
            const yesterdayCount = orders.filter(o => new Date(o.paidAt).toDateString() === yesterday).length
            const trend = yesterdayCount > 0 ? ((todayCount - yesterdayCount) / yesterdayCount) * 100 : 0
            return { value: total, trend }
          }),
          // Revenue Today - sum of today's order amounts
          fetch('/api/user/orders').then(r => r.json()).then(data => {
            const orders = data.orders || []
            const today = new Date().toDateString()
            const todayOrders = orders.filter(o => new Date(o.paidAt).toDateString() === today)
            const revenue = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
            const yesterday = new Date(Date.now() - 86400000).toDateString()
            const yesterdayOrders = orders.filter(o => new Date(o.paidAt).toDateString() === yesterday)
            const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
            const trend = yesterdayRevenue > 0 ? ((revenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0
            return { value: revenue, trend }
          }),
          // Total Products - from Sanity
          client.fetch('count(*[_type == "product"])').then(count => {
            return { value: count, trend: 0 }
          }),
          // Active Collections - from Sanity
          client.fetch('count(*[_type == "category"])').then(count => {
            return { value: count, trend: 0 }
          }),
          // AI Calls Today - from usage tracking API
          fetch('/api/admin/ai-usage', { credentials: 'same-origin' })
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Unauthorized'))))
            .then((data) => ({ value: data.todayTotal ?? 0, trend: null })),
          // Grok Credits - hardcoded
          Promise.resolve({ value: '$5.00', trend: null })
        ])

        if (mounted) {
          const keys = ['totalOrders', 'revenueToday', 'totalProducts', 'activeCollections', 'aiCallsToday', 'grokCredits']
          const newKpiData = {}
          results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
              newKpiData[keys[index]] = { ...result.value, loading: false }
            } else {
              newKpiData[keys[index]] = { value: '—', trend: null, loading: false, error: true }
            }
          })
          setKpiData(newKpiData)
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch KPI data:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchKPIs()

    const timer = setInterval(fetchKPIs, 5 * 60 * 1000) // 5 minutes

    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  return { kpiData, loading }
}

/**
 * Hook for alert data - fetches pending orders, low stock, missing images, drafts
 */
export function useAlertData() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchAlerts = async () => {
      try {
        const results = await Promise.allSettled([
          // Pending orders
          fetch('/api/user/orders').then(r => r.json()).then(data => {
            const orders = data.orders || []
            const count = orders.filter(o => o.status === 'pending' || o.status === 'processing').length
            return count > 0 ? {
              icon: '📦',
              title: `${count} orders awaiting processing`,
              subtitle: 'Pending or processing status',
              href: '/admin/orders'
            } : null
          }),
          // Low stock (< 3)
          client.fetch('count(*[_type == "product" && defined(variants) && count(variants[variantStock < 3]) > 0])').then(count => {
            return count > 0 ? {
              icon: '⚠️',
              title: `${count} products near out-of-stock`,
              subtitle: 'Stock level below 3 units',
              href: '/admin/products?filter=low-stock'
            } : null
          }),
          // Missing images
          client.fetch('count(*[_type == "product" && !defined(image[0].asset)])').then(count => {
            return count > 0 ? {
              icon: '🖼',
              title: `${count} products missing images`,
              subtitle: 'No product image uploaded',
              href: '/admin/products?filter=no-image'
            } : null
          }),
          // Draft products
          client.fetch('count(*[_type == "product" && status == "draft"])').then(count => {
            return count > 0 ? {
              icon: '📝',
              title: `${count} draft products`,
              subtitle: 'Not published to storefront',
              href: '/admin/products?filter=draft'
            } : null
          })
        ])

        if (mounted) {
          const alertList = results
            .filter(r => r.status === 'fulfilled' && r.value)
            .map(r => r.value)
          setAlerts(alertList)
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch alerts:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchAlerts()

    const timer = setInterval(fetchAlerts, 2 * 60 * 1000) // 2 minutes

    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  return { alerts, loading }
}

/**
 * Hook for activity feed - combines orders, products, AI activity
 */
export function useActivityFeed() {
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    let mounted = true

    const fetchFeed = async () => {
      try {
        const results = await Promise.allSettled([
          // Recent orders
          fetch('/api/user/orders').then(r => r.json()).then(data => {
            const orders = data.orders || []
            return orders.slice(0, 10).map(order => ({
              type: 'order',
              timestamp: order.paidAt,
              text: `New order #${order._id?.slice(-4)} placed — ₹${order.totalAmount?.toLocaleString('en-IN') || '0'}`,
              href: `/admin/orders/${order._id}`,
              color: 'var(--sampada-crimson, #8B1A1A)'
            }))
          }),
          // Recent products
          client.fetch(`*[_type == "product"] | order(_createdAt desc) [0...10] {
            _id, name, _createdAt
          }`).then(products => {
            return products.map(product => ({
              type: 'product',
              timestamp: product._createdAt,
              text: `Product '${product.name}' added to catalog`,
              href: `/admin/products/edit/${product._id}`,
              color: 'var(--sampada-gold, #C9A84C)'
            }))
          }),
          // AI activity (mock for now)
          Promise.resolve([
            {
              type: 'ai',
              timestamp: new Date(Date.now() - 300000).toISOString(),
              text: 'Grok generated 4 images for Creative Studio',
              href: '/admin/ai-hub',
              color: '#6366F1'
            },
            {
              type: 'ai',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              text: 'Style assistant responded to customer query',
              href: '/admin/ai-tools',
              color: '#6366F1'
            }
          ])
        ])

        if (mounted) {
          const allItems = results
            .filter(r => r.status === 'fulfilled')
            .flatMap(r => r.value)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 20)
          setFeed(allItems)
          setLoading(false)
          setRefreshing(false)
        }
      } catch (error) {
        console.error('Failed to fetch activity feed:', error)
        if (mounted) {
          setLoading(false)
          setRefreshing(false)
        }
      }
    }

    fetchFeed()

    const timer = setInterval(() => {
      setRefreshing(true)
      fetchFeed()
    }, 60 * 1000) // 1 minute

    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  return { feed, loading, refreshing }
}

export default useAdminData
