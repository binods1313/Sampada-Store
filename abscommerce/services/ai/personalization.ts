// services/ai/personalization.ts
// AI-Powered Personalization Engine
// Part of STUDIO_FINAL Billionaire Protocol - Innovation #3

import { GoogleGenerativeAI } from '@google/generative-ai';
import { client as sanityClient } from '@/sanityClient';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

/**
 * Generate personalized copy for a product based on user's purchase history
 * @param productId - Sanity product ID
 * @param userId - Prisma user ID
 * @returns Generated tagline
 */
export async function generatePersonalizedCopy(
    productId: string,
    userId: string
): Promise<string | null> {
    try {
        console.log(`🎯 Generating personalized copy for product ${productId}, user ${userId}`);

        // Step 1: Get product from Sanity
        const product = await sanityClient.fetch(
            `*[_id == $id][0]{
        _id,
        name,
        details,
        category->{
          name
        },
        specialty,
        pros,
        bestUseCases
      }`,
            { id: productId }
        );

        if (!product) {
            console.error('Product not found:', productId);
            return null;
        }

        // Step 2: Get user purchase history from Prisma
        const purchases = await prisma.customOrder.findMany({
            where: {
                userId,
                paymentStatus: 'completed'
            },
            include: {
                design: {
                    select: {
                        id: true,
                        canvasData: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5 // Last 5 purchases
        });

        // Step 3: Get product names from Sanity for purchased items
        const purchasedProductIds = purchases
            .map(p => p.sanityProductId)
            .filter(Boolean);

        const purchasedProducts = await sanityClient.fetch(
            `*[_id in $ids]{
        name,
        category->{
          name
        }
      }`,
            { ids: purchasedProductIds }
        );

        // Step 4: Generate personalized tagline with Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
You are a personalization AI for "Sampada" - a cultural clothing and custom design e-commerce platform.

**Current Product:**
- Name: ${product.name}
- Category: ${product.category?.name || 'General'}
- Description: ${product.details || product.specialty || 'No description'}
- Pros: ${Array.isArray(product.pros) ? product.pros.join(', ') : 'N/A'}

**User's Purchase History:**
${purchasedProducts.length > 0
                ? purchasedProducts.map((p: any, idx: number) =>
                    `${idx + 1}. ${p.name} (${p.category?.name || 'Unknown'})`
                ).join('\n')
                : 'No previous purchases'
            }

**Task:**
Create a personalized tagline (maximum 150 characters) explaining why this product is perfect for THIS specific user based on their purchase history.

- Be conversational and warm
- Reference their style preferences if identifiable
- Make it feel personal and relevant
- NO generic marketing speak
- Maximum 150 characters

Return ONLY the tagline text, nothing else.
`;

        const result = await model.generateContent(prompt);
        const tagline = result.response.text().trim();

        console.log(`✨ Generated tagline: "${tagline}"`);

        // Step 5: Write back to Sanity (optional - can be cached)
        try {
            await sanityClient
                .patch(productId)
                .set({
                    [`personalizedTaglines.${userId}`]: {
                        text: tagline,
                        generatedAt: new Date().toISOString()
                    }
                })
                .commit();

            console.log(`✅ Saved personalized tagline to Sanity`);
        } catch (error) {
            console.warn('Could not save to Sanity (field may not exist):', error);
        }

        return tagline;

    } catch (error) {
        console.error('Error generating personalized copy:', error);
        return null;
    }
}

/**
 * Batch generate personalized copy for multiple products for a user
 * @param userId - Prisma user ID
 * @param productIds - Array of Sanity product IDs
 */
export async function batchPersonalizeCopy(
    userId: string,
    productIds: string[]
): Promise<Map<string, string>> {
    const results = new Map<string, string>();

    for (const productId of productIds) {
        try {
            const tagline = await generatePersonalizedCopy(productId, userId);
            if (tagline) {
                results.set(productId, tagline);
            }

            // Rate limit: wait 1 second between API calls
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error(`Failed to personalize product ${productId}:`, error);
        }
    }

    return results;
}

/**
 * Get or generate personalized tagline for a product
 * Caches result to avoid repeated API calls
 */
export async function getPersonalizedTagline(
    productId: string,
    userId: string
): Promise<string | null> {
    try {
        // Try to get cached tagline first
        const cached = await prisma.personalizedContent.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });

        // Return cached if less than 30 days old
        if (cached && cached.generatedAt) {
            const age = Date.now() - cached.generatedAt.getTime();
            const thirtyDays = 30 * 24 * 60 * 60 * 1000;

            if (age < thirtyDays) {
                console.log('📦 Using cached personalized tagline');
                return cached.tagline;
            }
        }

        // Generate new tagline
        const tagline = await generatePersonalizedCopy(productId, userId);

        if (tagline) {
            // Cache in Prisma
            await prisma.personalizedContent.upsert({
                where: {
                    userId_productId: {
                        userId,
                        productId
                    }
                },
                create: {
                    userId,
                    productId,
                    tagline,
                    generatedAt: new Date()
                },
                update: {
                    tagline,
                    generatedAt: new Date()
                }
            });
        }

        return tagline;

    } catch (error) {
        console.error('Error getting personalized tagline:', error);
        return null;
    }
}

export default {
    generatePersonalizedCopy,
    batchPersonalizeCopy,
    getPersonalizedTagline
};
