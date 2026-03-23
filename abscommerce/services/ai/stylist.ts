// services/ai/stylist.ts
// AI Virtual Stylist - Styling Tips Generator
// Part of STUDIO_FINAL Billionaire Protocol - Innovation #4

import { GoogleGenerativeAI } from '@google/generative-ai';
import { client as sanityClient } from '@/sanityClient';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

/**
 * Generate professional styling tips for a product
 * @param productId - Sanity product ID
 * @returns Array of styling tips
 */
export async function generateStylingTips(productId: string): Promise<string[]> {
    try {
        console.log(`👗 Generating styling tips for product ${productId}`);

        // Step 1: Get product from Sanity
        const product = await sanityClient.fetch(
            `*[_id == $id][0]{
        _id,
        name,
        details,
        category->{
          name
        },
        specifications,
        pros,
        bestUseCases,
        specialty
      }`,
            { id: productId }
        );

        if (!product) {
            console.error('Product not found:', productId);
            return [];
        }

        // Step 2: Extract fabric/material info from specifications
        const fabricInfo = Array.isArray(product.specifications)
            ? product.specifications
                .filter((spec: any) =>
                    spec.feature?.toLowerCase().includes('fabric') ||
                    spec.feature?.toLowerCase().includes('material')
                )
                .map((spec: any) => `${spec.feature}: ${spec.value}`)
                .join(', ')
            : 'Not specified';

        // Step 3: Generate styling tips with Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
You are a professional fashion stylist for "Sampada" - a cultural clothing and custom design e-commerce platform.

**Product Information:**
- Name: ${product.name}
- Category: ${product.category?.name || 'General Clothing'}
- Description: ${product.details || product.specialty || 'No description'}
- Materials: ${fabricInfo}
- Best Use Cases: ${Array.isArray(product.bestUseCases) ? product.bestUseCases.join(', ') : 'N/A'}
- Pros: ${Array.isArray(product.pros) ? product.pros.join(', ') : 'N/A'}

**Task:**
Generate exactly 3 professional styling tips for this product. Each tip should be:
- Practical and actionable
- Specific to this product
- Cultural and fashion-forward
- Maximum 100 characters each

Return ONLY a JSON array of 3 strings, like: ["Tip 1", "Tip 2", "Tip 3"]
No additional text, no markdown, just the JSON array.
`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim();

        // Clean up response
        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (responseText.startsWith('```')) {
            responseText = responseText.replace(/```\n?/, '').replace(/\n?```$/, '');
        }

        const tips = JSON.parse(responseText);

        if (!Array.isArray(tips) || tips.length === 0) {
            throw new Error('Invalid response format from AI');
        }

        console.log(`✨ Generated ${tips.length} styling tips`);

        // Step 4: Write back to Sanity
        await sanityClient
            .patch(productId)
            .set({
                stylingTips: tips,
                stylingTipsGeneratedAt: new Date().toISOString()
            })
            .commit();

        console.log(`✅ Saved styling tips to Sanity`);

        return tips;

    } catch (error) {
        console.error('Error generating styling tips:', error);
        return [];
    }
}

/**
 * Generate styling tips for all products that don't have them
 * This can be run as a batch job
 */
export async function batchGenerateStylingTips(): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
}> {
    try {
        console.log('🔄 Starting batch styling tips generation...');

        // Get products without styling tips
        const products = await sanityClient.fetch(`
      *[_type == "product" && status == "active" && !defined(stylingTips)]{
        _id,
        name
      }
    `);

        console.log(`Found ${products.length} products needing styling tips`);

        let succeeded = 0;
        let failed = 0;

        for (const product of products) {
            try {
                await generateStylingTips(product._id);
                succeeded++;

                // Rate limit: wait 2 seconds between API calls
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                console.error(`Failed for product ${product.name}:`, error);
                failed++;
            }
        }

        const result = {
            processed: products.length,
            succeeded,
            failed
        };

        console.log(`✅ Batch complete:`, result);
        return result;

    } catch (error) {
        console.error('Error in batch generation:', error);
        return {
            processed: 0,
            succeeded: 0,
            failed: 0
        };
    }
}

/**
 * Regenerate styling tips for a product
 * Useful when product details change
 */
export async function regenerateStylingTips(productId: string): Promise<boolean> {
    try {
        // Clear existing tips
        await sanityClient
            .patch(productId)
            .unset(['stylingTips', 'stylingTipsGeneratedAt'])
            .commit();

        // Generate new tips
        const tips = await generateStylingTips(productId);

        return tips.length > 0;

    } catch (error) {
        console.error('Error regenerating styling tips:', error);
        return false;
    }
}

export default {
    generateStylingTips,
    batchGenerateStylingTips,
    regenerateStylingTips
};
