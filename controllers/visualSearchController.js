const { analyzeImage } = require('../services/visualSearchService');
const { findMatchingProducts } = require('../services/productMatchingService');

async function visualSearch(req, res) {
    try {
        const { image, image_url } = req.body;

        if (!image && !image_url) {
            return res.status(400).json({ error: 'Image or image URL required' });
        }

        // Prepare image source
        let imageSource;
        if (image_url) {
            imageSource = { source: { imageUri: image_url } };
        } else {
            // Remove data:image/...;base64, prefix if present
            const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
            const imageBuffer = Buffer.from(base64Data, 'base64');
            imageSource = { content: imageBuffer };
        }

        // Step 1: Analyze image with Vision API
        const analysis = await analyzeImage(imageSource);

        if (!analysis.success) {
            return res.status(500).json({ error: 'Image analysis failed', details: analysis.error });
        }

        // Step 2: Find matching products
        const matches = await findMatchingProducts(analysis);

        // Step 3: Return results
        res.json({
            success: true,
            detected_items: analysis.objects,
            detected_colors: analysis.colors,
            style_tags: analysis.labels.map(l => l.description),
            matching_products: matches,
            total_matches: matches.length
        });

    } catch (error) {
        console.error('Visual search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
}

module.exports = { visualSearch };
