// abscommerce/lib/sanity.js
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // Public value
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, // Public value
  apiVersion: '2024-05-18', // Must match Studio version
  token: process.env.SANITY_API_TOKEN, // Server-side only
  useCdn: process.env.NODE_ENV === 'production' // Use CDN in prod
});