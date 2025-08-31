// sanity_abscommerce/env.js
// This file loads environment variables for the Sanity Studio

// For Vite, environment variables are exposed on import.meta.env
export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2023-05-03'

// Log for debugging purposes
console.log("Loading Sanity environment variables:")
console.log("- Project ID:", projectId)
console.log("- Dataset:", dataset)
console.log("- API Version:", apiVersion)

// Validate required environment variables
if (!projectId) {
  console.error("ERROR: Missing VITE_SANITY_PROJECT_ID environment variable")
}