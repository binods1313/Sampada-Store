// app/api/health/route.ts
/**
 * Health Check Endpoint
 * Used by Cloud Run and monitoring services to check application health
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    uptime: number;
    checks: {
        database: {
            status: string;
            message: string;
            responseTime?: number;
        };
        memory: {
            used: number;
            total: number;
            percentage: number;
        };
        environment: {
            nodeVersion: string;
            platform: string;
        };
    };
}

async function checkDatabase(): Promise<{ status: string; message: string; responseTime: number }> {
    try {
        const startTime = Date.now();
        // Dynamic import to avoid build-time initialization
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();
        await prisma.$queryRaw`SELECT 1`;
        await prisma.$disconnect();
        return {
            status: 'healthy',
            message: 'Database connection successful',
            responseTime: Date.now() - startTime,
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            message: error instanceof Error ? error.message : 'Database connection failed',
            responseTime: 0,
        };
    }
}

export async function GET() {
    try {
        // Database health check
        const dbHealth = await checkDatabase();

        // Memory usage
        const memUsage = process.memoryUsage();
        const memoryUsed = Math.round(memUsage.heapUsed / 1024 / 1024);
        const memoryTotal = Math.round(memUsage.heapTotal / 1024 / 1024);
        const memoryPercentage = Math.round((memoryUsed / memoryTotal) * 100);

        // Determine overall health status
        let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

        if (dbHealth.status === 'unhealthy') {
            overallStatus = 'unhealthy';
        } else if (memoryPercentage > 90) {
            overallStatus = 'degraded';
        }

        const healthStatus: HealthStatus = {
            status: overallStatus,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            checks: {
                database: dbHealth,
                memory: {
                    used: memoryUsed,
                    total: memoryTotal,
                    percentage: memoryPercentage,
                },
                environment: {
                    nodeVersion: process.version,
                    platform: process.platform,
                },
            },
        };

        const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;

        return NextResponse.json(healthStatus, { status: statusCode });
    } catch (error) {
        return NextResponse.json(
            {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 503 }
        );
    }
}
