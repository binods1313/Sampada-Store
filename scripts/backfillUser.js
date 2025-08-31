// backfillUser.js - CommonJS version
require('dotenv').config();

// Create a new client specifically for this script
const { createClient } = require('@sanity/client');

// Read environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-04-25';
const token = process.env.SANITY_API_WRITE_TOKEN;

// Validate essential environment variables
if (!projectId) {
  console.error("Error: Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable.");
  process.exit(1);
}
if (!dataset) {
  console.error("Error: Missing NEXT_PUBLIC_SANITY_DATASET environment variable.");
  process.exit(1);
}
if (!token) {
  console.error("Error: Missing SANITY_API_WRITE_TOKEN environment variable.");
  process.exit(1);
}

// Create write client
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

writeClient
  .patch('user.cf83cef3-e55e-4373-b642-0469c9c641e6') // Your Sanity user _id
  .set({ providerId: '195906447' })
  .commit()
  .then((updatedUser) => {
    console.log('User updated:', updatedUser);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Update failed:', err.message);
    process.exit(1);
  });