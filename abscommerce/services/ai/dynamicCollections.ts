// services/ai/dynamicCollections.ts
// AI-Powered Dynamic Collections Generator
// Part of STUDIO_FINAL Billionaire Protocol - Innovation #1

import { GoogleGenerativeAI } from '@google/generative-ai';
import { client as sanityClient } from '@/sanityClient';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

/**
 * Generate dynamic product collections based on search trends and AI clustering
 * Uses Gemini Pro to analyze user search patterns and automatically create collections
 * 
 * Return type: Array of created collection IDs
 */
export async function generateDynamicCollections(): Promise<string[]> {
    try {
        console.log('🤖 Starting AI-powered dynamic collections generation...');

        // Step 1: Get search trends from last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const searches = await prisma.searchLog.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo }
            },
            select: {
                query: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (searches.length === 0) {
            console.log('No search data available for analysis');
            return [];
        }

        console.log(`Found ${searches.length} search queries to analyze`);

        // Step 2: Get all active products from Sanity
        const products = await sanityClient.fetch(`
      *[_type == "product" && status == "active"] {
        _id,
        name,
        details,
        category->{
          name
        },
        pros,
        bestUseCases,
        specialty
      }
    `);

        console.log(`Retrieved ${products.length} products from Sanity`);

        // Step 3: Prepare data for Gemini
        const searchQueries = searches
            .map(s => s.query)
            .slice(0, 50); // Limit to top 50 searches

        const productSummaries = products.map((p: any) => ({
            id: p._id,
            name: p.name,
            category: p.category?.name || 'Uncategorized',
            description: p.details || p.specialty || '',
            pros: Array.isArray(p.pros) ? p.pros.join(', ') : '',
            bestUseCases: Array.isArray(p.bestUseCases) ? p.bestUseCases.join(', ') : ''
        }));

        // Step 4: Ask Gemini to create collections
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
You are a retail merchandising AI for an e-commerce platform called "Sampada" - a cultural clothing and custom design store.

**Recent Search Trends (last 7 days):**
${searchQueries.join(', ')}

**Available Products:**
${productSummaries.map((p: any, idx: number) =>
            `${idx + 1}. ${p.name} (${p.category}) - ${p.description.substring(0, 100)}`
        ).join('\n')}

**Task:**
Based on the search trends, create 3 compelling product collections that will increase sales.
Each collection should:
1. Have a catchy, creative name
2. Include 4-8 relevant product IDs
3. Have a brief description explaining why these products are grouped together

**Return ONLY valid JSON** in this exact format:
[
  {
    "name": "Collection Name",
    "description": "Why this collection matters",
    "productIds": ["product_id_1", "product_id_2", ...]
  }
]

Return ONLY the JSON array, no additional text.
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Extract JSON from response (may contain markdown code blocks)
        let jsonText = responseText.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
        }

        const collections = JSON.parse(jsonText);
        console.log(`✨ Gemini generated ${collections.length} collections`);

        // Step 5: Create collections in Sanity
        const createdCollectionIds: string[] = [];

        for (const collection of collections) {
            try {
                const doc = await sanityClient.create({
                    _type: 'collection',
                    name: collection.name,
                    description: collection.description,
                    products: collection.productIds.map((id: string) => ({
                        _type: 'reference',
                        _ref: id,
                        _key: id
                    })),
                    isAiGenerated: true,
                    generatedAt: new Date().toISOString(),
                    searchTrends: searchQueries.slice(0, 10) // Store top 10 trends
                });

                createdCollectionIds.push(doc._id);
                console.log(`✅ Created collection: "${collection.name}"`);

            } catch (error) {
                console.error(`❌ Failed to create collection "${collection.name}":`, error);
            }
        }

        return createdCollectionIds;

    } catch (error) {
        console.error('Error generating dynamic collections:', error);
        throw error;
    }
}

/**
 * Schedule daily collection generation
 * This should be called by a cron job or serverless function
 */
export async function scheduleCollectionGeneration() {
    try {
        console.log('🕐 Running scheduled collection generation...');

        // Remove old AI-generated collections (older than 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const oldCollections = await sanityClient.fetch(`
      *[_type == "collection" && isAiGenerated == true && generatedAt < $cutoff]._id
    `, { cutoff: thirtyDaysAgo.toISOString() });

        for (const id of oldCollections) {
            await sanityClient.delete(id);
            console.log(`🗑️ Deleted old collection: ${id}`);
        }

        // Generate new collections
        const newCollections = await generateDynamicCollections();

        console.log(`✅ Scheduled generation complete. Created ${newCollections.length} collections.`);

        return {
            success: true,
            collectionsCreated: newCollections.length,
            collectionsDeleted: oldCollections.length
        };

    } catch (error) {
        console.error('Error in scheduled collection generation:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export default {
    generateDynamicCollections,
    scheduleCollectionGeneration
};
