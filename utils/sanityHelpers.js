import React from 'react'
import { useClient } from 'sanity'
import { apiVersion } from '../utils/sanityClient'

/**
 * Custom hook for fetching data from Sanity
 * Properly handles loading states, errors, and cleanup
 */
export function useSanityFetch(query, params = {}, options = {}) {
  const client = useClient({ apiVersion })
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  
  React.useEffect(() => {
    // Store a flag to prevent state updates after unmount
    let isMounted = true
    
    // Set loading at the start of the effect
    setLoading(true)
    setError(null)
    
    const fetchData = async () => {
      try {
        const result = await client.fetch(query, params, options)
        
        // Only update state if component is still mounted
        if (isMounted) {
          setData(result)
          setLoading(false)
        }
      } catch (err) {
        console.error('Error fetching data from Sanity:', err)
        
        // Only update state if component is still mounted
        if (isMounted) {
          setError(err)
          setLoading(false)
        }
      }
    }
    
    fetchData()
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false
    }
  }, [client, query, JSON.stringify(params), JSON.stringify(options)])
  
  return { data, loading, error }
}

/**
 * Example component using the hook
 */
export function SanityDataComponent({ query, params }) {
  const { data, loading, error } = useSanityFetch(query, params)
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data found</div>
  
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}