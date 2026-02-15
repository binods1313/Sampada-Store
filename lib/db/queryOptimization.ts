// lib/db/queryOptimization.ts
/**
 * Database Query Optimization Utilities
 * Provides optimized queries and caching strategies for Prisma
 */

import { PrismaClient } from '@prisma/client';

// Singleton Prisma Client with lazy initialization
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function getPrismaClient(): PrismaClient {
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });
    }
    return globalForPrisma.prisma;
}

// Export a getter that returns the actual PrismaClient
export const prisma = new Proxy({} as PrismaClient, {
    get(_, prop) {
        return (getPrismaClient() as any)[prop];
    }
});

// Query optimization helpers
export const queryOptimizations = {
    /**
     * Get products with optimized includes
     * Only fetch what's needed
     */
    async getProductsOptimized(options: {
        take?: number;
        skip?: number;
        where?: any;
        includeOrders?: boolean;
    }) {
        const { take = 20, skip = 0, where = {}, includeOrders = false } = options;

        return prisma.customOrder.findMany({
            take,
            skip,
            where,
            select: {
                id: true,
                sanityProductId: true,
                userId: true,
                status: true,
                totalAmount: true,
                createdAt: true,
                // Only include orders if explicitly requested
                ...(includeOrders && {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                }),
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    },

    /**
     * Get product cache with pagination
     */
    async getProductCacheOptimized(options: {
        take?: number;
        skip?: number;
        search?: string;
    }) {
        const { take = 20, skip = 0, search } = options;

        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' as const } },
                    { sanityId: { contains: search, mode: 'insensitive' as const } },
                ],
            }
            : {};

        return prisma.productCache.findMany({
            take,
            skip,
            where,
            orderBy: {
                updatedAt: 'desc',
            },
        });
    },

    /**
     * Batch operations for better performance
     */
    async batchUpdateProductCache(products: Array<{ sanityId: string; data: any }>) {
        const operations = products.map((product) =>
            prisma.productCache.upsert({
                where: { sanityId: product.sanityId },
                update: product.data,
                create: { sanityId: product.sanityId, ...product.data },
            })
        );

        return prisma.$transaction(operations);
    },

    /**
     * Get analytics with aggregation
     */
    async getAnalytics(dateFrom?: Date, dateTo?: Date) {
        const where = {
            ...(dateFrom && dateTo && {
                createdAt: {
                    gte: dateFrom,
                    lte: dateTo,
                },
            }),
        };

        const [totalOrders, totalRevenue, avgOrderValue] = await Promise.all([
            prisma.customOrder.count({ where }),
            prisma.customOrder.aggregate({
                where,
                _sum: {
                    totalAmount: true,
                },
            }),
            prisma.customOrder.aggregate({
                where,
                _avg: {
                    totalAmount: true,
                },
            }),
        ]);

        return {
            totalOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            avgOrderValue: avgOrderValue._avg.totalAmount || 0,
        };
    },
};

// Connection management
export async function disconnectPrisma() {
    await prisma.$disconnect();
}

// Health check
export async function checkDatabaseConnection() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return { status: 'healthy', message: 'Database connection successful' };
    } catch (error) {
        return { status: 'unhealthy', message: 'Database connection failed', error };
    }
}
