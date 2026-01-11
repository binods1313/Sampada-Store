const { autoTagProduct } = require('../services/autoTaggingService');
const { writeClient } = require('../lib/client'); // Use Sanity write client

// Single product tagging
async function tagSingleProduct(req, res) {
    try {
        const { product_id, image_url } = req.body;

        if (!product_id || !image_url) {
            return res.status(400).json({ error: 'Missing required fields: product_id, image_url' });
        }

        // Get AI-generated tags
        const tagging = await autoTagProduct(image_url);

        if (!tagging.success) {
            return res.status(500).json({ error: 'Tagging analysis failed', details: tagging.error });
        }

        // Update product in Sanity using writeClient
        // Note: We append new tags to existing ones or create new arrays if they don't exist

        // Construct the tags array to append
        const newTags = [
            ...(tagging.tags.categories || []),
            ...(tagging.tags.style || []),
            ...(tagging.tags.features || []),
            ...(tagging.tags.occasions || [])
        ];

        // Remove duplicates
        const uniqueTags = [...new Set(newTags)];

        await writeClient
            .patch(product_id)
            .setIfMissing({ tags: [], ai_metadata: {} })
            .set({
                ai_description: tagging.suggested_description,
                seo_keywords: tagging.seo_keywords,
                'ai_metadata.confidence': tagging.confidence,
                'ai_metadata.auto_tagged': true,
                'ai_metadata.tagged_at': new Date().toISOString(),
                'ai_metadata.colors': tagging.tags.colors,
                'ai_metadata.patterns': tagging.tags.patterns,
                'ai_metadata.materials': tagging.tags.materials
            })
            // Append tags to the main 'tags' array
            .append('tags', uniqueTags)
            .commit();

        res.json({
            success: true,
            product_id,
            generated_tags: tagging.tags,
            confidence: tagging.confidence,
            description: tagging.suggested_description
        });

    } catch (error) {
        console.error('Tag controller error:', error);
        res.status(500).json({ error: 'Tagging operation failed', details: error.message });
    }
}

// Bulk tagging for entire catalog
async function tagBulkProducts(req, res) {
    try {
        const { product_ids } = req.body; // Array of product IDs

        if (!product_ids || !Array.isArray(product_ids)) {
            return res.status(400).json({ error: "Invalid input: product_ids must be an array" });
        }

        const results = [];
        const errors = [];

        for (const product_id of product_ids) {
            try {
                // Fetch product image URL first
                const product = await writeClient.fetch(`*[_type == "product" && _id == $id][0]{
             _id,
             "image_url": image[0].asset->url
         }`, { id: product_id });

                if (!product || !product.image_url) {
                    errors.push({ product_id, error: 'Product or image not found' });
                    continue;
                }

                const tagging = await autoTagProduct(product.image_url);

                if (tagging.success) {
                    const newTags = [
                        ...(tagging.tags.categories || []),
                        ...(tagging.tags.style || []),
                        ...(tagging.tags.features || [])
                    ];
                    const uniqueTags = [...new Set(newTags)];

                    await writeClient
                        .patch(product_id)
                        .setIfMissing({ tags: [], ai_metadata: {} })
                        .set({
                            'ai_metadata.auto_tagged': true,
                            'ai_metadata.tagged_at': new Date().toISOString()
                        })
                        .append('tags', uniqueTags)
                        .commit();

                    results.push({ product_id, success: true });
                } else {
                    errors.push({ product_id, error: tagging.error });
                }

                // Rate limiting - wait 100ms between requests to avoid hitting limits
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                errors.push({ product_id, error: error.message });
            }
        }

        res.json({
            success: true,
            results,
            errors
        });

    } catch (error) {
        console.error('Bulk tag error:', error);
        res.status(500).json({ error: 'Bulk tagging failed' });
    }
}

module.exports = { tagSingleProduct, tagBulkProducts };
