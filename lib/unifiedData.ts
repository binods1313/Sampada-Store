// lib/unifiedData.ts
// Unified Data Layer: Bridges Sanity (Content) and Prisma (Database)
// Part of STUDIO_FINAL Billionaire Protocol Implementation

import { client as sanityClient } from '@/sanityClient';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get product with related orders from both Sanity and Prisma
 * @param slug - Product slug from Sanity
 * @returns Combined product data with order history
 */
export async function getProductWithOrders(slug: string) {
    try {
        // Step 1: Fetch product content from Sanity
        const product = await sanityClient.fetch(
            `*[_type == "product" && slug.current == $slug][0]{
        _id,
        name,
        slug,
        image,
        price,
        discount,
        category->{
          name,
          slug
        },
        details,
        specifications,
        variants,
        sizeChart,
        specialty,
        pros,
        cons,
        bestUseCases,
        inventory,
        printifyIntegration,
        status,
        personalizedTagline,
        stylingTips
      }`,
            { slug }
        );

        if (!product) {
            return null;
        }

        // Step 2: Fetch related orders from Prisma
        const orders = await prisma.customOrder.findMany({
            where: {
                sanityProductId: product._id
            },
            select: {
                id: true,
                userId: true,
                quantity: true,
                paymentStatus: true,
                totalAmount: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10 // Last 10 orders
        });

        // Step 3: Calculate total sales and stock
        const totalSales = orders.reduce((sum, order) =>
            sum + (order.quantity || 0), 0
        );

        const totalRevenue = orders.reduce((sum, order) =>
            sum + (order.totalAmount || 0), 0
        );

        // Step 4: Combine data
        return {
            ...product,
            orderStats: {
                totalOrders: orders.length,
                totalSales,
                totalRevenue,
                recentOrders: orders
            }
        };

    } catch (error) {
        console.error('Error fetching product with orders:', error);
        throw error;
    }
}

/**
 * Get order with related product details
 * @param orderId - Order ID from Prisma
 * @returns Combined order data with product details
 */
export async function getOrderWithProduct(orderId: string) {
    try {
        // Step 1: Fetch order from Prisma
        const order = await prisma.customOrder.findUnique({
            where: { id: orderId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        designerTier: true
                    }
                },
                design: {
                    select: {
                        id: true,
                        canvasData: true,
                        thumbnail: true
                    }
                }
            }
        });

        if (!order) {
            return null;
        }

        // Step 2: Fetch product details from Sanity
        const product = await sanityClient.fetch(
            `*[_id == $id][0]{
        _id,
        name,
        slug,
        image,
        price,
        discount,
        category->{
          name
        }
      }`,
            { id: order.sanityProductId }
        );

        // Step 3: Combine data
        return {
            ...order,
            product,
            // Calculate final price
            finalPrice: product ?
                product.price * (1 - (product.discount || 0) / 100) :
                order.totalAmount
        };

    } catch (error) {
        console.error('Error fetching order with product:', error);
        throw error;
    }
}

/**
 * Get all products with their inventory status
 * Used for unified admin dashboard
 */
export async function getAllProductsWithInventory() {
    try {
        // Fetch all products from Sanity
        const products = await sanityClient.fetch(
            `*[_type == "product" && status == "active"]{
        _id,
        name,
        slug,
        image,
        price,
        discount,
        inventory,
        variants,
        category->{
          name
        }
      }`
        );

        // Fetch order counts for each product
        const productsWithStats = await Promise.all(
            products.map(async (product: any) => {
                const orderCount = await prisma.customOrder.count({
                    where: {
                        sanityProductId: product._id,
                        paymentStatus: 'completed'
                    }
                });

                const totalRevenue = await prisma.customOrder.aggregate({
                    where: {
                        sanityProductId: product._id,
                        paymentStatus: 'completed'
                    },
                    _sum: {
                        totalAmount: true
                    }
                });

                return {
                    ...product,
                    statistics: {
                        ordersCount: orderCount,
                        revenue: totalRevenue._sum.totalAmount || 0
                    }
                };
            })
        );

        return productsWithStats;

    } catch (error) {
        console.error('Error fetching products with inventory:', error);
        throw error;
    }
}

/**
 * Get user's personalized recommendations
 * Combines Sanity products with Prisma purchase history
 */
export async function getPersonalizedRecommendations(userId: string) {
    try {
        // Fetch user's purchase history
        const userOrders = await prisma.customOrder.findMany({
            where: {
                userId,
                paymentStatus: 'completed'
            },
            select: {
                sanityProductId: true
            },
            distinct: ['sanityProductId']
        });

        const purchasedProductIds = userOrders.map(o => o.sanityProductId);

        // Fetch similar products from Sanity
        // Exclude already purchased products
        const recommendations = await sanityClient.fetch(
            `*[_type == "product" && status == "active" && !(_id in $excludeIds)][0...6]{
        _id,
        name,
        slug,
        image,
        price,
        discount,
        category->{
          name
        },
        personalizedTagline
      }`,
            { excludeIds: purchasedProductIds }
        );

        return recommendations;

    } catch (error) {
        console.error('Error fetching personalized recommendations:', error);
        throw error;
    }
}

export default {
    getProductWithOrders,
    getOrderWithProduct,
    getAllProductsWithInventory,
    getPersonalizedRecommendations
};
