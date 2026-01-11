const { client } = require('../lib/client');

async function searchByColor(colorHex, tolerance = 50) {
    const targetRgb = hexToRgb(colorHex);

    // NOTE: In a real production environment with millions of products, fetching ALL to filter in JS is bad.
    // Ideally, one would use a vector database or a search engine that supports color distance (like Elasticsearch with a plugin).
    // Or, pre-calculate dominant colors into buckets (Red, Blue, Green) and only fetch those buckets.
    // For this scale, we fetch projected fields.

    const allProducts = await client.fetch(`*[_type == "product"]{
      _id,
      name,
      slug,
      "image_url": image[0].asset->url,
      "colors": variants[].colorHex,
      "ai_colors": ai_metadata.colors,
      price
  }`);

    // Filter by color similarity
    const matches = allProducts.filter(product => {
        // Check explicit variant colors OR AI detected colors
        const productColors = [
            ...(product.colors || []),
            ...(product.ai_colors || [])
        ];

        if (productColors.length === 0) return false;

        // Find if ANY color on the product is close to the target
        return productColors.some(pColor => {
            if (!pColor) return false;
            const pRgb = hexToRgb(pColor);
            if (!pRgb) return false;
            const distance = colorDistance(targetRgb, pRgb);

            // Save the closest distance for scoring
            product.min_distance = Math.min(product.min_distance || 1000, distance);

            return distance <= tolerance;
        });
    });

    // Sort by similarity (min_distance)
    return matches
        .map(product => ({
            ...product,
            color_similarity: 1 - (product.min_distance / 441) // Normalize (Max distance ~441)
        }))
        .sort((a, b) => b.color_similarity - a.color_similarity)
        .slice(0, 20); // Top 20
}

function colorDistance(rgb1, rgb2) {
    return Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

module.exports = { searchByColor };
