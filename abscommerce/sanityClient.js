//abscommerce/sanityClient.js
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,  // e.g., '7lh35oho'
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,        // e.g., 'production'
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-05-18',
  useCdn: process.env.NODE_ENV === 'production',          // Use CDN for fast responses in production
});
