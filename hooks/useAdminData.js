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

export default useAdminData
