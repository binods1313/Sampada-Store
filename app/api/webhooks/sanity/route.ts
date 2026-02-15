// app/api/webhooks/sanity/route.ts
// Sanity Webhook Handler for Product Synchronization
// Part of STUDIO_FINAL Billionaire Protocol Implementation

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Webhook endpoint for Sanity content updates
 * Syncs product data to Prisma productCache for fast lookups
 */
export async function POST(request: NextRequest) {
    try {
        // Verify webhook signature (security)
        const signature = request.headers.get('x-sanity-signature');
        const secret = process.env.SANITY_WEBHOOK_SECRET;

        // TODO: Implement proper signature verification
        // For now, check if secret exists
        if (!secret) {
            console.warn('SANITY_WEBHOOK_SECRET not configured');
        }

        // Parse webhook payload
        const payload = await request.json();

        console.log('Received Sanity webhook:', {
            type: payload._type,
            id: payload._id,
            action: payload._action || 'update'
        });

        // Handle product updates
        if (payload._type === 'product') {
            await handleProductUpdate(payload);
        }

        // Handle product deletions
        if (payload._action === 'delete' && payload._type === 'product') {
            await handleProductDeletion(payload._id);
        }

        return NextResponse.json({
            success: true,
            message: 'Webhook processed successfully'
        });

    } catch (error) {
        console.error('Error processing Sanity webhook:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * Handle product creation/update
 */
async function handleProductUpdate(product: any) {
    try {
        // Cache essential product data in Prisma
        await prisma.productCache.upsert({
            where: {
                sanityId: product._id
            },
            update: {
                name: product.name || 'Untitled Product',
                price: product.price || 0,
                inStock: determineStockStatus(product),
                updatedAt: new Date()
            },
            create: {
                sanityId: product._id,
                name: product.name || 'Untitled Product',
                price: product.price || 0,
                inStock: determineStockStatus(product)
            }
        });

        console.log('Product cache updated:', product._id);

    } catch (error) {
        console.error('Error updating product cache:', error);
        throw error;
    }
}

/**
 * Handle product deletion
 */
async function handleProductDeletion(productId: string) {
    try {
        // Remove from cache
        await prisma.productCache.delete({
            where: {
                sanityId: productId
            }
        });

        console.log('Product cache deleted:', productId);

    } catch (error) {
        console.error('Error deleting product cache:', error);
        // Don't throw - deletion might fail if product doesn't exist in cache
    }
}

/**
 * Determine if product is in stock based on variants
 */
function determineStockStatus(product: any): boolean {
    // If product has variants, check variant stock
    if (Array.isArray(product.variants) && product.variants.length > 0) {
        return product.variants.some((v: any) => v.variantStock > 0);
    }

    // Otherwise check overall inventory
    if (typeof product.inventory === 'number') {
        return product.inventory > 0;
    }

    // Default to true if status is active
    return product.status === 'active';
}

// Allow GET for webhook verification
export async function GET(request: NextRequest) {
    return NextResponse.json({
        message: 'Sanity webhook endpoint active',
        timestamp: new Date().toISOString()
    });
}
