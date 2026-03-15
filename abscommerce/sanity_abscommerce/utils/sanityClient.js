// utils/sanityClient.js
import { createClient } from '@sanity/client'

// Define a consistent API version to use throughout the project
export const apiVersion = '2025-05-03'

// Create a preconfigured client factory function
export function createSanityClient(customConfig = {}) {
  return createClient({
    projectId: '7lh35oho',
    dataset: 'production',
    apiVersion,
    useCdn: process.env.NODE_ENV === 'production',
    // Add timeout config to prevent indefinite waiting
    timeout: 60000, // 60 seconds timeout
    // Merge in any custom configuration
    ...customConfig,
  })
}

// Export a singleton client instance for common use
export const sanityClient = createSanityClient()

// Helper hook to use with the current API version
export function useApiVersionedClient(customConfig = {}) {
  return createSanityClient({
    apiVersion,
    ...customConfig,
  })
}