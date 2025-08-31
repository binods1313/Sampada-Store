// utils/sanityClient.js
import { createClient } from '@sanity/client';

// Export API version to use with useClient
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-05-18';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7lh35oho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion, // Use the exported constant
  useCdn: process.env.NODE_ENV === 'production',
});