// Environment Variable Validation with Zod
// This file validates all required environment variables at startup
// Location: lib/env.ts

import { z } from 'zod';

const envSchema = z.object({
  // Database (required for production, optional for development)
  DATABASE_URL: z.string().url().startsWith('postgresql://').optional(),
  
  // Stripe (Test or Production)
  // Accepts both test keys (sk_test_/pk_test_) and live keys (sk_live_/pk_live_)
  STRIPE_SECRET_KEY: z.string().refine(
    (val) => !val || val.startsWith('sk_test_') || val.startsWith('sk_live_'),
    { message: 'Must start with sk_test_ or sk_live_' }
  ).optional(),
  NEXT_PUBLIC_STRIPE_DESIGNER_KEY: z.string().refine(
    (val) => !val || val.startsWith('pk_test_') || val.startsWith('pk_live_'),
    { message: 'Must start with pk_test_ or pk_live_' }
  ).optional(),
  STRIPE_DESIGNER_PRO_PRICE_ID: z.string().startsWith('price_').optional(),
  STRIPE_DESIGNER_ULTRA_PRICE_ID: z.string().startsWith('price_').optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').optional(),
  
  // Google Cloud
  GOOGLE_CLOUD_PROJECT_ID: z.string().min(1).optional(),
  GCS_BUCKET_NAME: z.string().min(1).optional(),
  
  // Google AI
  GOOGLE_AI_API_KEY: z.string().startsWith('AIza').optional(),
  
  // SendGrid
  SENDGRID_API_KEY: z.string().startsWith('SG.').optional(),
  SENDGRID_FROM_EMAIL: z.string().email().optional(),
  
  // Printify
  PRINTIFY_API_KEY: z.string().min(1).optional(),
  PRINTIFY_SHOP_ID: z.string().min(1).optional(),
  
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
  NEXT_PUBLIC_BASE_URL: z.string().url().optional().default('http://localhost:3000'),
  NEXT_PUBLIC_API_URL: z.string().url().optional().default('http://localhost:3000'),
  
  // NextAuth
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables at application startup
 * Call this function in your root layout or middleware
 */
export function validateEnv(): Env {
  try {
    const result = envSchema.safeParse(process.env);
    
    if (!result.success) {
      console.error('❌ Invalid or missing environment variables:');
      result.error.errors.forEach(err => {
        const path = err.path.join('.');
        console.error(`  - ${path}: ${err.message}`);
      });
      
      console.error('\n📝 Copy .env.example to .env.local and fill in all values');
      console.error('📍 Example file: .env.example\n');
      
      // In production, exit to prevent running with invalid config
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
      
      // In development, throw for immediate feedback
      throw new Error('Environment validation failed');
    }
    
    console.log('✅ Environment validation passed');
    return result.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Already handled above
      throw error;
    }
    throw error;
  }
}

/**
 * Validated environment object
 * Import and use this instead of process.env
 */
export const env = validateEnv();

/**
 * Check if running in production
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Check if running in development
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Check if running in test environment
 */
export const isTest = env.NODE_ENV === 'test';

/**
 * Get the base URL for the application
 */
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  return env.NEXT_PUBLIC_BASE_URL;
};

/**
 * Get the API URL
 */
export const getApiUrl = () => {
  return env.NEXT_PUBLIC_API_URL || getBaseUrl();
};
