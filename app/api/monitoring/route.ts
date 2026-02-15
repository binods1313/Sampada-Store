// app/api/monitoring/route.ts
/**
 * Monitoring Dashboard API
 * Provides metrics, errors, and performance data
 */

import { NextResponse } from 'next/server';
import { errorTracker } from '@/lib/monitoring/errorTracking';
import { performanceMonitor } from '@/lib/monitoring/performance';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    try {
        const data: any = {
            timestamp: new Date().toISOString(),
        };

        if (type === 'all' || type === 'errors') {
            data.errors = {
                recent: errorTracker.getRecentErrors(20),
                stats: errorTracker.getErrorStats(),
            };
        }

        if (type === 'all' || type === 'performance') {
            data.performance = {
                byType: performanceMonitor.getMetricsByType(),
                slowOperations: performanceMonitor.getSlowOperations(500, 10),
            };
        }

        if (type === 'all' || type === 'system') {
            const memUsage = process.memoryUsage();
            data.system = {
                uptime: process.uptime(),
                memory: {
                    used: Math.round(memUsage.heapUsed / 1024 / 1024),
                    total: Math.round(memUsage.heapTotal / 1024 / 1024),
                    external: Math.round(memUsage.external / 1024 / 1024),
                },
                cpu: process.cpuUsage(),
                platform: process.platform,
                nodeVersion: process.version,
            };
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to fetch monitoring data',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// Clear metrics endpoint (admin only)
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    try {
        if (type === 'errors' || !type) {
            errorTracker.clearErrors();
        }

        if (type === 'performance' || !type) {
            performanceMonitor.clearMetrics();
        }

        return NextResponse.json({
            success: true,
            message: `Cleared ${type || 'all'} metrics`,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to clear metrics',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
