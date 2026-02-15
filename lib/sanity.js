// abscommerce/lib/sanity.js
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const readOnlyClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // Public value
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, // Public value
  apiVersion: '2024-05-18', // Must match Studio version
  useCdn: process.env.NODE_ENV === 'production' // Use CDN in prod
});

// Export original client as well for backward compatibility
export const client = readOnlyClient;

// Image URL builder
const builder = imageUrlBuilder(readOnlyClient);

export function urlFor(source) {
  return builder.image(source);
}