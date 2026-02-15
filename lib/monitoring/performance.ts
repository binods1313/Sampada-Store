// lib/monitoring/performance.ts
/**
 * Performance Monitoring Utilities
 * Track API response times, database queries, and page loads
 */

interface PerformanceMetric {
    name: string;
    duration: number;
    timestamp: string;
    type: 'api' | 'database' | 'page' | 'custom';
    metadata?: Record<string, any>;
}

class PerformanceMonitor {
    private metrics: PerformanceMetric[] = [];
    private maxMetrics = 1000;

    /**
     * Start a performance timer
     */
    startTimer(name: string) {
        return {
            name,
            startTime: Date.now(),
            end: (type: PerformanceMetric['type'] = 'custom', metadata?: Record<string, any>) => {
                const duration = Date.now() - Date.now();
                this.recordMetric({
                    name,
                    duration,
                    timestamp: new Date().toISOString(),
                    type,
                    metadata,
                });
                return duration;
            },
        };
    }

    /**
     * Record a performance metric
     */
    recordMetric(metric: PerformanceMetric) {
        this.metrics.push(metric);

        // Keep only last maxMetrics
        if (this.metrics.length > this.maxMetrics) {
            this.metrics = this.metrics.slice(-this.maxMetrics);
        }

        // Log slow operations
        if (metric.duration > 1000) {
            console.warn(`⚠️ Slow operation detected: ${metric.name} took ${metric.duration}ms`);
        }
    }

    /**
     * Get performance statistics
     */
    getStats(type?: PerformanceMetric['type']) {
        const filteredMetrics = type
            ? this.metrics.filter((m) => m.type === type)
            : this.metrics;

        if (filteredMetrics.length === 0) {
            return {
                count: 0,
                avg: 0,
                min: 0,
                max: 0,
                p50: 0,
                p95: 0,
                p99: 0,
            };
        }

        const durations = filteredMetrics.map((m) => m.duration).sort((a, b) => a - b);
        const sum = durations.reduce((a, b) => a + b, 0);

        return {
            count: durations.length,
            avg: Math.round(sum / durations.length),
            min: durations[0],
            max: durations[durations.length - 1],
            p50: durations[Math.floor(durations.length * 0.5)],
            p95: durations[Math.floor(durations.length * 0.95)],
            p99: durations[Math.floor(durations.length * 0.99)],
        };
    }

    /**
     * Get recent slow operations
     */
    getSlowOperations(threshold: number = 1000, limit: number = 10): PerformanceMetric[] {
        return this.metrics
            .filter((m) => m.duration > threshold)
            .sort((a, b) => b.duration - a.duration)
            .slice(0, limit);
    }

    /**
     * Get metrics by type
     */
    getMetricsByType() {
        return {
            api: this.getStats('api'),
            database: this.getStats('database'),
            page: this.getStats('page'),
            custom: this.getStats('custom'),
        };
    }

    /**
     * Clear metrics
     */
    clearMetrics() {
        this.metrics = [];
    }

    /**
     * Get all metrics
     */
    getAllMetrics() {
        return this.metrics;
    }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Decorator for measuring function performance
 */
export function measurePerformance(name: string, type: PerformanceMetric['type'] = 'custom') {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const startTime = Date.now();
            try {
                const result = await originalMethod.apply(this, args);
                const duration = Date.now() - startTime;

                performanceMonitor.recordMetric({
                    name: `${name}.${propertyKey}`,
                    duration,
                    timestamp: new Date().toISOString(),
                    type,
                });

                return result;
            } catch (error) {
                const duration = Date.now() - startTime;
                performanceMonitor.recordMetric({
                    name: `${name}.${propertyKey}`,
                    duration,
                    timestamp: new Date().toISOString(),
                    type,
                    metadata: { error: true },
                });
                throw error;
            }
        };

        return descriptor;
    };
}

/**
 * Wrapper for measuring async function performance
 */
export async function withPerformanceTracking<T>(
    name: string,
    fn: () => Promise<T>,
    type: PerformanceMetric['type'] = 'custom',
    metadata?: Record<string, any>
): Promise<T> {
    const startTime = Date.now();
    try {
        const result = await fn();
        const duration = Date.now() - startTime;

        performanceMonitor.recordMetric({
            name,
            duration,
            timestamp: new Date().toISOString(),
            type,
            metadata,
        });

        return result;
    } catch (error) {
        const duration = Date.now() - startTime;
        performanceMonitor.recordMetric({
            name,
            duration,
            timestamp: new Date().toISOString(),
            type,
            metadata: { ...metadata, error: true },
        });
        throw error;
    }
}
