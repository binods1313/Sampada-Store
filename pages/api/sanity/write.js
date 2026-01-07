// pages/api/sanity/write.js
import { client } from '../../../lib/sanity';
import { RateLimiter } from 'async-sema';

// Limit to 5 requests per second per IP
const limiter = RateLimiter(5);

export default async function handler(req, res) {
  try {
    // 1. Apply rate limiting first
    await limiter();
  } catch {
    return res.status(429).json({ message: 'Too many requests - try again later' });
  }

  // 2. Validate request method
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 3. Validate required fields
  const { documentId, updates } = req.body;
  if (!documentId || !updates) {
    return res.status(400).json({ 
      message: 'Missing required fields: documentId or updates'
    });
  }

  try {
    // 4. Execute Sanity write operation
    const result = await client
      .patch(documentId)
      .set(updates)
      .commit();

    // 5. Return success response
    return res.status(200).json(result);
  } catch (error) {
    // 6. Handle errors
    console.error('[API] Write error:', error);
    return res.status(500).json({
      message: error.message,
      details: error.details || null
    });
  }
}