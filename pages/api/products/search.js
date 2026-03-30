/**
 * Product Search API
 * 
 * Search products by keyword/query
 * Used by Voice Assistant and other search features
 */

import { client } from '../../../lib/sanity/client';

// Common product fields projection
const PRODUCT_FIELDS = `
  _id,
  _key,
  name,
  slug,
  description,
  price,
  "imageUrl": image.asset->url,
  category,
  keywords,
  features,
  inventory,
  isActive
`;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q } = req.query;

  if (!q || !q.trim()) {
    return res.status(400).json({ error: 'Search query (q) is required' });
  }

  // Validate query length
  if (q.length > 100) {
    return res.status(400).json({ error: 'Search query too long (max 100 characters)' });
  }

  try {
    // Escape special GROQ characters
    const escapedQuery = q.replace(/["*()]/g, '\\$&');
    
    // Use GROQ with indexof for case-insensitive search
    const query = `*[_type == "product" && isActive == true && (
      indexof(lower(name), lower($query)) >= 0 ||
      indexof(lower(description), lower($query)) >= 0 ||
      indexof(lower(category), lower($query)) >= 0 ||
      keywords[@ != null && indexof(lower(@), lower($query)) >= 0] ||
      features[@ != null && indexof(lower(@), lower($query)) >= 0]
    )] | order(name asc) [0...20] {${PRODUCT_FIELDS}}`;

    const products = await client.fetch(query, { query: escapedQuery.toLowerCase() });

    // Fallback: If no results, try broader search
    if (!products || products.length === 0) {
      const fallbackQuery = `*[_type == "product" && isActive == true] [0...100] {${PRODUCT_FIELDS}}`;
      
      const allProducts = await client.fetch(fallbackQuery);
      
      // Filter client-side for partial matches
      const searchTerm = escapedQuery.toLowerCase();
      const filteredProducts = allProducts
        .filter(product => {
          const nameMatch = product.name?.toLowerCase().includes(searchTerm);
          const descMatch = product.description?.toLowerCase().includes(searchTerm);
          const categoryMatch = product.category?.toLowerCase().includes(searchTerm);
          const keywordMatch = Array.isArray(product.keywords) && 
            product.keywords.some(k => k?.toLowerCase().includes(searchTerm));
          const featureMatch = Array.isArray(product.features) && 
            product.features.some(f => f?.toLowerCase().includes(searchTerm));
          
          return nameMatch || descMatch || categoryMatch || keywordMatch || featureMatch;
        })
        .slice(0, 20);

      return res.status(200).json({
        success: true,
        products: filteredProducts,
        query: q,
        total: filteredProducts.length,
      });
    }

    return res.status(200).json({
      success: true,
      products,
      query: q,
      total: products.length,
    });
  } catch (error) {
    console.error('Product search error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search products',
    });
  }
}
