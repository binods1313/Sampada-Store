// lib/monitoring/errorTracking.ts
/**
 * Error Tracking and Logging Utilities
 * Centralized error handling and logging
 */

interface ErrorLog {
    timestamp: string;
    level: 'error' | 'warn' | 'info';
    message: string;
    stack?: string;
    context?: Record<string, any>;
    userId?: string;
    url?: string;
}

class ErrorTracker {
    private errors: ErrorLog[] = [];
    private maxErrors = 100; // Keep last 100 errors in memory

    /**
     * Log an error
     */
    logError(error: Error, context?: Record<string, any>) {
        const errorLog: ErrorLog = {
            timestamp: new Date().toISOString(),
            level: 'error',
            message: error.message,
            stack: error.stack,
            context,
        };

        this.errors.push(errorLog);

        // Keep only last maxErrors
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(-this.maxErrors);
        }

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('🔴 Error:', errorLog);
        }

        // In production, you could send to external service (Sentry, LogRocket, etc.)
        if (process.env.NODE_ENV === 'production') {
            this.sendToExternalService(errorLog);
        }
    }

    /**
     * Log a warning
     */
    logWarning(message: string, context?: Record<string, any>) {
        const warningLog: ErrorLog = {
            timestamp: new Date().toISOString(),
            level: 'warn',
            message,
            context,
        };

        this.errors.push(warningLog);

        if (process.env.NODE_ENV === 'development') {
            console.warn('🟡 Warning:', warningLog);
        }
    }

    /**
     * Log info
     */
    logInfo(message: string, context?: Record<string, any>) {
        const infoLog: ErrorLog = {
            timestamp: new Date().toISOString(),
            level: 'info',
            message,
            context,
        };

        if (process.env.NODE_ENV === 'development') {
            console.info('🔵 Info:', infoLog);
        }
    }

    /**
     * Get recent errors
     */
    getRecentErrors(count: number = 10): ErrorLog[] {
        return this.errors.slice(-count);
    }

    /**
     * Get error statistics
     */
    getErrorStats() {
        const now = Date.now();
        const oneHourAgo = now - 60 * 60 * 1000;
        const oneDayAgo = now - 24 * 60 * 60 * 1000;

        const recentErrors = this.errors.filter(
            (e) => new Date(e.timestamp).getTime() > oneHourAgo
        );
        const dailyErrors = this.errors.filter(
            (e) => new Date(e.timestamp).getTime() > oneDayAgo
        );

        return {
            total: this.errors.length,
            lastHour: recentErrors.length,
            last24Hours: dailyErrors.length,
            byLevel: {
                error: this.errors.filter((e) => e.level === 'error').length,
                warn: this.errors.filter((e) => e.level === 'warn').length,
                info: this.errors.filter((e) => e.level === 'info').length,
            },
        };
    }

    /**
     * Clear errors
     */
    clearErrors() {
        this.errors = [];
    }

    /**
     * Send to external monitoring service
     * Placeholder for integration with Sentry, LogRocket, etc.
     */
    private sendToExternalService(errorLog: ErrorLog) {
        // TODO: Integrate with external service
        // Example: Sentry.captureException(errorLog);
        // For now, just log to console
        console.error('Production Error:', errorLog);
    }
}

// Singleton instance
export const errorTracker = new ErrorTracker();

/**
 * Error boundary wrapper for API routes
 */
export function withErrorTracking<T>(
    handler: (...args: any[]) => Promise<T>,
    context?: Record<string, any>
) {
    return async (...args: any[]): Promise<T> => {
        try {
            return await handler(...args);
        } catch (error) {
            errorTracker.logError(
                error instanceof Error ? error : new Error(String(error)),
                context
            );
            throw error;
        }
    };
}
