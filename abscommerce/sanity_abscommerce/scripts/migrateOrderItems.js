// migrateOrderItems.js
// Run this script with: node scripts/migrateOrderItems.js

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '7lh35oho', // <-- Replace with your Sanity project ID
  dataset: 'production',        // <-- Replace with your dataset name if different
  apiVersion: '2024-05-18',     // <-- Use your preferred API version
  token: 'skXEkRklVcmelvXiJAwPWW4ob6odXMOljJHj5PMcmUiduEw9FLQ665HHMugku11WZ8p08C90377YEPML1lYatgc62C5uEkmegvVDeXODbUXRUg8cD7Oa0gu948pcTpWRVCx6Nwpl5QaVZJf73b7FEvmyATPfbHMgRtKOUTgv15jFgPGC00lt',   // <-- Replace with a token with write access
  useCdn: false,
});

async function migrateOrders() {
  // Find all orders with legacy fields and missing orderItems
  const legacyOrders = await client.fetch(
    `*[_type == "order" && defined(items) && !defined(orderItems)]{
      _id, items, quantities, prices
    }`
  );

  console.log(`Found ${legacyOrders.length} legacy orders to migrate.`);

  for (const order of legacyOrders) {
    const { _id, items = [], quantities = [], prices = [] } = order;
    const orderItems = items.map((productRef, idx) => ({
      _type: 'object',
      product: productRef,
      quantity: quantities[idx] || 1,
      pricePerItem: prices[idx] || 0,
    }));

    // Patch the order with the new orderItems array
    await client
      .patch(_id)
      .set({ orderItems })
      .commit();

    console.log(`Migrated order ${_id} with ${orderItems.length} orderItems.`);
  }

  console.log('Migration complete!');
}

migrateOrders().catch((err) => {
  console.error('Migration failed:', err);
});
