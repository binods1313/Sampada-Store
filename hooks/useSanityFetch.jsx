// hooks/useSanityFetch.jsx
import { useState, useEffect } from 'react';
import { useClient } from 'sanity';
import { apiVersion } from '../utils/sanityClient';

/**
 * Custom hook for fetching data from Sanity
 * Properly handles loading states, errors, and cleanup
 */
export function useSanityFetch(query, params = {}) {
  // Explicitly provide apiVersion to avoid deprecation warning
  const client = useClient({ apiVersion });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Store a flag to prevent state updates after unmount
    let isMounted = true;
    
    // Set loading at the start of the effect
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const result = await client.fetch(query, params);
        
        // Only update state if component is still mounted
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching data from Sanity:', err);
        
        // Only update state if component is still mounted
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [client, query, JSON.stringify(params)]);

  return { data, loading, error };
}