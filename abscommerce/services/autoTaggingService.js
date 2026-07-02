const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

// Ensure color-name-list is loaded dynamically
let colorNameList = [];
(async () => {
    try {
        const mod = await import('color-name-list');
        colorNameList = mod.default || mod;
    } catch (e) {
        console.warn('Failed to load color-name-list', e);
    }
})();

async function autoTagProduct(imageUrl) {
    try {
        const [result] = await client.annotateImage({
            image: { source: { imageUri: imageUrl } },
            features: [
                { type: 'LABEL_DETECTION', maxResults: 30 },
                { type: 'IMAGE_PROPERTIES' },
                { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
                { type: 'TEXT_DETECTION' } // For reading labels/tags in image
            ]
        });

        // Process all detection results
        const tags = {
            categories: extractCategories(result),
            style: extractStyles(result.labelAnnotations),
            features: extractFeatures(result.labelAnnotations),
            occasions: extractOccasions(result.labelAnnotations),
            colors: extractColors(result.imagePropertiesAnnotation),
            patterns: extractPatterns(result.labelAnnotations),
            materials: extractMaterials(result.textAnnotations) // Corrected from textDetections
        };

        const confidence = calculateOverallConfidence(result);

        return {
            success: true,
            tags,
            confidence,
            suggested_description: generateDescription(tags),
            seo_keywords: generateSEOKeywords(tags)
        };

    } catch (error) {
        console.error('Auto-tagging error:', error);
        return { success: false, error: error.message };
    }
}

function extractCategories(result) {
    const categoryKeywords = [
        'dress', 'tunic', 'top', 'shirt', 'blouse', 'kurta',
        'pants', 'jeans', 'skirt', 'shorts', 'jacket', 'coat',
        'shoe', 'sneaker', 'sandal', 'boot'
    ];

    const categories = [];

    // From objects
    if (result.localizedObjectAnnotations) {
        result.localizedObjectAnnotations.forEach(obj => {
            const name = obj.name.toLowerCase();
            if (categoryKeywords.some(kw => name.includes(kw))) {
                categories.push(name);
            }
        });
    }

    // From labels
    if (result.labelAnnotations) {
        result.labelAnnotations
            .filter(label => label.score > 0.75)
            .forEach(label => {
                const desc = label.description.toLowerCase();
                if (categoryKeywords.some(kw => desc.includes(kw))) {
                    categories.push(desc);
                }
            });
    }

    return [...new Set(categories)];
}

function extractStyles(labels) {
    if (!labels) return [];
    const styleKeywords = {
        'bohemian': ['bohemian', 'boho', 'hippie', 'folk'],
        'casual': ['casual', 'everyday', 'relaxed', 'streetwear'],
        'formal': ['formal', 'elegant', 'sophisticated', 'gown'],
        'ethnic': ['ethnic', 'traditional', 'cultural'],
        'modern': ['modern', 'contemporary', 'trendy'],
        'vintage': ['vintage', 'retro', 'classic'],
        'minimalist': ['minimalist', 'simple', 'clean']
    };

    const styles = [];

    labels.filter(l => l.score > 0.7).forEach(label => {
        const desc = label.description.toLowerCase();
        Object.entries(styleKeywords).forEach(([style, keywords]) => {
            if (keywords.some(kw => desc.includes(kw))) {
                styles.push(style);
            }
        });
    });

    return [...new Set(styles)];
}

function extractFeatures(labels) {
    if (!labels) return [];
    const featureKeywords = [
        'embroidered', 'printed', 'sequined', 'ruffled',
        'pleated', 'belted', 'buttoned', 'zippered',
        'long sleeve', 'short sleeve', 'sleeveless',
        'v-neck', 'round neck', 'collar', 'hood', 'leather', 'denim'
    ];

    const features = [];

    labels.filter(l => l.score > 0.65).forEach(label => {
        const desc = label.description.toLowerCase();
        featureKeywords.forEach(feature => {
            if (desc.includes(feature) || desc.includes(feature.replace(' ', ''))) {
                features.push(feature);
            }
        });
    });

    return [...new Set(features)];
}

function extractOccasions(labels) {
    if (!labels) return [];
    const occasionMap = {
        'beach': ['beach', 'resort', 'vacation', 'tropical'],
        'casual': ['casual', 'everyday', 'weekend'],
        'party': ['party', 'celebration', 'festive', 'cocktail'],
        'formal': ['formal', 'business', 'office', 'professional'],
        'wedding': ['wedding', 'bridal', 'ceremony'],
        'summer': ['summer', 'warm', 'sunny'],
        'winter': ['winter', 'cold', 'warm']
    };

    const occasions = [];

    labels.filter(l => l.score > 0.6).forEach(label => {
        const desc = label.description.toLowerCase();
        Object.entries(occasionMap).forEach(([occasion, keywords]) => {
            if (keywords.some(kw => desc.includes(kw))) {
                occasions.push(occasion);
            }
        });
    });

    return [...new Set(occasions)];
}

function extractColors(imageProperties) {
    if (!imageProperties?.dominantColors?.colors) return [];

    // Helper for hex
    const rgbToHex = (color) => {
        const r = Math.round(color.red || 0).toString(16).padStart(2, '0');
        const g = Math.round(color.green || 0).toString(16).padStart(2, '0');
        const b = Math.round(color.blue || 0).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    };

    return imageProperties.dominantColors.colors
        .slice(0, 3)
        .map(colorInfo => {
            const hex = rgbToHex(colorInfo.color);
            const nearest = colorNameList.find(c => c.hex === hex); // Exact match check first
            // Note: A full nearest-color implementation would be better but simple exact match or return hex is fallback
            return nearest ? nearest.name.toLowerCase() : hex;
        });
}

function extractPatterns(labels) {
    if (!labels) return [];
    const patternKeywords = [
        'floral', 'geometric', 'striped', 'dotted', 'checked',
        'plaid', 'paisley', 'animal print', 'solid', 'embroidered'
    ];

    const patterns = [];

    labels.filter(l => l.score > 0.65).forEach(label => {
        const desc = label.description.toLowerCase();
        patternKeywords.forEach(pattern => {
            if (desc.includes(pattern)) {
                patterns.push(pattern);
            }
        });
    });

    return [...new Set(patterns)];
}

function extractMaterials(textAnnotations) {
    if (!textAnnotations || textAnnotations.length === 0) return [];
    const materialKeywords = [
        'cotton', 'silk', 'polyester', 'linen', 'wool',
        'rayon', 'viscose', 'chiffon', 'georgette', 'voile',
        'leather', 'denim', 'suede'
    ];

    const materials = [];
    const fullText = textAnnotations[0]?.description?.toLowerCase() || '';

    materialKeywords.forEach(material => {
        if (fullText.includes(material)) {
            materials.push(material);
        }
    });

    return materials;
}

function calculateOverallConfidence(result) {
    if (!result.labelAnnotations || result.labelAnnotations.length === 0) {
        return 0;
    }
    const topScores = result.labelAnnotations
        .slice(0, 5)
        .map(l => l.score);
    return topScores.reduce((a, b) => a + b, 0) / topScores.length;
}

function generateDescription(tags) {
    const parts = [];

    if (tags.style.length > 0) parts.push(`${tags.style[0]} style`);
    if (tags.colors.length > 0) parts.push(`in ${tags.colors[0]}`);
    if (tags.categories.length > 0) parts.push(tags.categories[0]);
    if (tags.features.length > 0) parts.push(`featuring ${tags.features.slice(0, 2).join(' and ')}`);
    if (tags.occasions.length > 0) parts.push(`perfect for ${tags.occasions[0]} wear`);
    if (tags.patterns.length > 0) parts.push(`with ${tags.patterns[0]} pattern`);

    if (parts.length === 0) return "Fashionable item.";
    return `Elegant ${parts.join(' ')}.`;
}

function generateSEOKeywords(tags) {
    const keywords = [];

    // Combine style + category
    tags.style.forEach(style => {
        tags.categories.forEach(cat => {
            keywords.push(`${style} ${cat}`);
        });
    });

    // Combine color + category
    tags.colors.forEach(color => {
        tags.categories.forEach(cat => {
            keywords.push(`${color} ${cat}`);
        });
    });

    // Add features
    tags.features.forEach(feature => {
        keywords.push(feature);
    });

    return keywords.slice(0, 10); // Top 10 keywords
}

module.exports = { autoTagProduct };
