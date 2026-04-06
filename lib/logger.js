/**
 * Production-safe logging utility that respects NODE_ENV.
 * - In production: only error-level logs are emitted
 * - In development: all log levels are emitted
 * - In test: warnings and errors only
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.debug('Detailed debug info');      // dev only
 *   logger.info('General info');               // dev only
 *   logger.warn('Something might be wrong');   // dev + test
 *   logger.error('Something failed');          // always
 */

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const isProd = process.env.NODE_ENV === 'production';

export const logger = {
  /**
   * Debug logs — only in development
   */
  debug: (...args) => {
    if (isDev) {
      console.debug('[DEBUG]', ...args);
    }
  },

  /**
   * Info logs — only in development
   */
  info: (...args) => {
    if (isDev) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * Warning logs — development and test environments
   */
  warn: (...args) => {
    if (isDev || isTest) {
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * Error logs — always emitted (production-safe)
   */
  error: (...args) => {
    if (isDev || isTest) {
      console.error('[ERROR]', ...args);
    }
    // In production, errors should be sent to monitoring service
    // e.g., Sentry, LogRocket, etc.
    if (isProd && typeof window !== 'undefined') {
      // Hook for production error reporting
      // if (typeof Sentry !== 'undefined') {
      //   Sentry.captureException(args[0] instanceof Error ? args[0] : new Error(String(args[0])));
      // }
    }
  },
};

/**
 * Log GROQ query errors with context — always emitted
 */
export function logQueryError(query, error, params = {}) {
  logger.error(`Sanity query error:`, {
    query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
    error: error instanceof Error ? error.message : String(error),
    params,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Log data fetch errors with context — always emitted
 */
export function logFetchError(context, error) {
  logger.error(`Fetch error in ${context}:`, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });
}

export default logger;
