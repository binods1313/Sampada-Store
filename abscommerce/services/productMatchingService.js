const { client } = require('../lib/client'); // Import sanity client

async function findMatchingProducts(analysisResult, limit = 20) {
    const { labels, colors, objects } = analysisResult;

    // Build search query metadata
    const searchCriteria = {
        categories: extractCategories(objects, labels),
        colors: colors.map(c => c.hex),
        styles: extractStyles(labels),
        minScore: 0.6
    };

    // Fetch all products to filter in memory (or use a smarter query if possible)
    // For now, fetching fields needed for matching
    const products = await client.fetch(`
    *[_type == "product"] {
      _id,
      name,
      "category": category->name,
      "colors": variants[].colorName,
      "colorHexes": variants[].colorHex,
      "tags": tags,
      "description": details,
      "image": image[0].asset->url,
      price,
      slug
    }
  `);

    // Calculate similarity scores
    const scoredProducts = products.map(product => ({
        product_id: product._id,
        name: product.name,
        image_url: product.image,
        price: product.price,
        category: product.category,
        colors: product.colorHexes || [], // Use hexes for comparison
        tags: product.tags,
        description: product.description,
        similarity_score: calculateSimilarity(product, searchCriteria),
        match_reasons: getMatchReasons(product, searchCriteria)
    }));

    // Sort by similarity and return top results
    return scoredProducts
        .sort((a, b) => b.similarity_score - a.similarity_score)
        .slice(0, limit);
}

function extractCategories(objects, labels) {
    const clothingTypes = ['dress', 'tunic', 'shirt', 'pants', 'skirt', 'top', 'jacket', 'coat', 'shoe', 'accessory'];
    const categories = [];

    // From objects
    objects.forEach(obj => {
        if (clothingTypes.some(type => obj.name.includes(type))) {
            categories.push(obj.name);
        }
    });

    // From labels
    labels.forEach(label => {
        if (clothingTypes.some(type => label.description.includes(type))) {
            categories.push(label.description);
        }
    });

    return [...new Set(categories)]; // Remove duplicates
}

function extractStyles(labels) {
    const styleKeywords = [
        'bohemian', 'casual', 'formal', 'vintage', 'modern',
        'ethnic', 'western', 'traditional', 'contemporary', 'summer', 'winter'
    ];

    return labels
        .filter(label =>
            styleKeywords.some(style => label.description.includes(style))
        )
        .map(label => label.description);
}

function calculateSimilarity(product, criteria) {
    let score = 0;
    let maxScore = 0;

    // Category match (40% weight)
    maxScore += 40;
    if (criteria.categories.some(cat =>
        product.category?.toLowerCase().includes(cat) ||
        product.name?.toLowerCase().includes(cat)
    )) {
        score += 40;
    }

    // Color match (30% weight)
    maxScore += 30;
    if (product.colors && criteria.colors.length > 0) {
        const colorMatch = criteria.colors.some(searchColor =>
            product.colors.some(productColor =>
                colorDistance(searchColor, productColor) < 100 // Threshold for distance
            )
        );
        if (colorMatch) {
            score += 30;
        }
    }

    // Style match (30% weight)
    maxScore += 30;
    const styleMatch = criteria.styles.some(style =>
        product.tags?.includes(style) || product.description?.toLowerCase().includes(style)
    );
    if (styleMatch) {
        score += 30;
    }

    return maxScore > 0 ? score / maxScore : 0;
}

function colorDistance(hex1, hex2) {
    if (!hex1 || !hex2) return 1000;
    // Simple RGB distance calculation
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    if (!rgb1 || !rgb2) return 1000;

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

function getMatchReasons(product, criteria) {
    const reasons = [];

    if (criteria.categories.some(cat => product.category?.toLowerCase().includes(cat) || product.name.toLowerCase().includes(cat))) {
        reasons.push('Similar item type');
    }

    // Rough check for color matching in description or explicit colors
    if (criteria.colors.length > 0 && product.colors?.length > 0) {
        reasons.push('Matching colors');
    }

    if (criteria.styles.some(s => product.tags?.includes(s))) {
        reasons.push('Same style');
    }

    return reasons;
}

module.exports = { findMatchingProducts };
