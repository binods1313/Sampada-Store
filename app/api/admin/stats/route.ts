// app/api/admin/stats/route.ts
// API endpoint for admin dashboard statistics

import { NextResponse } from 'next/server';
import { client as sanityClient } from '@/sanityClient';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const stats = await getDashboardStats();
        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard statistics' },
            { status: 500 }
        );
    }
}

async function getDashboardStats() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Parallel fetch from Prisma and Sanity
    const [prismaStats, sanityStats] = await Promise.all([
        // PRISMA: Transaction data
        Promise.all([
            // Revenue (30 days)
            prisma.customOrder.aggregate({
                _sum: { totalAmount: true },
                _count: true,
                where: {
                    createdAt: { gte: thirtyDaysAgo },
                    paymentStatus: 'completed'
                }
            }),
            // Pending orders
            prisma.customOrder.count({
                where: { paymentStatus: 'pending' }
            }),
            // Designer users by tier
            prisma.designUser.groupBy({
                by: ['designerTier'],
                _count: true
            }),
            // Custom designs stats
            prisma.customDesign.groupBy({
                by: ['status'],
                _count: true
            }),
            // Recent orders (last 10)
            prisma.customOrder.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            email: true,
                            name: true
                        }
                    }
                }
            }),
            // Search queries (7 days)
            prisma.searchLog.count({
                where: { createdAt: { gte: sevenDaysAgo } }
            }),
            // AI personalized products
            prisma.personalizedContent.groupBy({
                by: ['productId'],
                _count: true
            })
        ]).then(([revenue, pending, userTiers, designStats, recents, searches, personalized]) => ({
            revenue: revenue._sum.totalAmount || 0,
            totalOrders: revenue._count,
            pendingOrders: pending,
            designerUsers: userTiers.reduce((sum, tier) => sum + tier._count, 0),
            proUsers: userTiers.find(t => t.designerTier === 'pro')?._count || 0,
            customDesigns: designStats.reduce((sum, stat) => sum + stat._count, 0),
            liveDesigns: designStats.find(s => s.status === 'live')?._count || 0,
            recentOrders: recents,
            searchQueries: searches,
            personalizedProducts: personalized.length
        })),

        // SANITY: Content data
        sanityClient.fetch(`{
      "totalProducts": count(*[_type == "product"]),
      "activeProducts": count(*[_type == "product" && status == "active"]),
      "draftProducts": count(*[_type == "product" && status == "draft"]),
      "lowStockProducts": *[_type == "product" && status == "active" && inventory < 5]{
        _id,
        name,
        inventory,
        image
      },
      "aiCollections": count(*[_type == "collection" && isAiGenerated == true])
    }`)
    ]);

    const lowStockCount = sanityStats.lowStockProducts.length;

    return {
        revenue: prismaStats.revenue,
        revenueTrend: '+12%', // TODO: Calculate actual trend
        totalOrders: prismaStats.totalOrders,
        pendingOrders: prismaStats.pendingOrders,
        totalProducts: sanityStats.activeProducts,
        draftProducts: sanityStats.draftProducts,
        lowStockCount,
        lowStockProducts: sanityStats.lowStockProducts,
        designerUsers: prismaStats.designerUsers,
        proUsers: prismaStats.proUsers,
        customDesigns: prismaStats.customDesigns,
        liveDesigns: prismaStats.liveDesigns,
        recentOrders: prismaStats.recentOrders,
        aiCollections: sanityStats.aiCollections,
        searchQueries: prismaStats.searchQueries,
        personalizedProducts: prismaStats.personalizedProducts
    };
}
