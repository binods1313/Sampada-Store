import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Configuration for Production
 * 
 * Features:
 * - Connection pooling for serverless (Cloud Run)
 * - Graceful shutdown
 * - Environment-aware logging
 * - Singleton pattern to prevent multiple instances
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with production optimizations
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  // Logging configuration
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
  
  // Datasource configuration
  datasources: {
    db: {
      // Use DATABASE_URL from environment
      // For Cloud SQL: postgresql://user:pass@/dbname?host=/cloudsql/project:region:instance
      url: process.env.DATABASE_URL,
    },
  },
  
  // Connection pool settings for serverless
  // These help manage connections in Cloud Run
});

// Singleton pattern - reuse instance in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown handler
 * Ensures database connections are properly closed
 */
async function gracefulShutdown() {
  console.log('Shutting down Prisma client...');
  await prisma.$disconnect();
  console.log('Prisma client disconnected');
}

// Register shutdown handlers
process.on('beforeExit', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('exit', (code) => {
  if (code !== 0) {
    console.log(`Process exiting with code ${code}`);
  }
});

/**
 * Health check function
 * Use this in your /api/health endpoint
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

/**
 * Get database connection info
 * Useful for debugging and health endpoints
 */
export async function getDatabaseInfo() {
  try {
    const [version, connectedDb] = await Promise.all([
      prisma.$queryRaw`SELECT version()`,
      prisma.$queryRaw`SELECT current_database()`,
    ]);
    
    return {
      connected: true,
      version: (version as any[])?.[0]?.version || 'Unknown',
      database: (connectedDb as any[])?.[0]?.current_database || 'Unknown',
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export default prisma;
