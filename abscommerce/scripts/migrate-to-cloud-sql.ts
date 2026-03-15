#!/usr/bin/env ts-node
/**
 * Cloud SQL Migration Script
 * 
 * Migrates database schema and data to Google Cloud SQL
 * 
 * Usage:
 *   npx ts-node scripts/migrate-to-cloud-sql.ts
 * 
 * Prerequisites:
 *   1. Cloud SQL instance created
 *   2. Database 'sampada' created
 *   3. CLOUD_SQL_DATABASE_URL set in environment or .env.production
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

async function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...\n');
  
  const errors: string[] = [];
  
  // Check DATABASE_URL
  const dbUrl = process.env.CLOUD_SQL_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    errors.push('DATABASE_URL or CLOUD_SQL_DATABASE_URL not set');
  } else {
    console.log('✅ Database URL configured');
    console.log(`   ${dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}\n`);
  }
  
  // Check Prisma schema
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    errors.push('Prisma schema not found at prisma/schema.prisma');
  } else {
    console.log('✅ Prisma schema found');
  }
  
  // Check Prisma client generated
  try {
    await execAsync('npx prisma generate');
    console.log('✅ Prisma client generated\n');
  } catch (error) {
    errors.push('Prisma client not generated - run "npx prisma generate"');
  }
  
  if (errors.length > 0) {
    console.error('❌ Prerequisites check failed:\n');
    errors.forEach(err => console.error(`   - ${err}`));
    console.error('\nPlease fix these issues before running migration.\n');
    process.exit(1);
  }
  
  console.log('✅ All prerequisites met\n');
}

async function testConnection() {
  console.log('🔌 Testing database connection...\n');
  
  try {
    // Import prisma dynamically to use current DATABASE_URL
    const { prisma } = await import('../lib/db');
    
    await prisma.$connect();
    console.log('✅ Database connection successful\n');
    
    // Test query
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('📊 Database version:');
    console.log(`   ${JSON.stringify(result, null, 2)}\n`);
    
    await prisma.$disconnect();
    return true;
  } catch (error: any) {
    console.error('❌ Database connection failed:');
    console.error(`   ${error.message}\n`);
    console.error('Check your DATABASE_URL and ensure Cloud SQL is accessible.\n');
    return false;
  }
}

async function runMigrations() {
  console.log('🔧 Running Prisma migrations...\n');
  
  try {
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.CLOUD_SQL_DATABASE_URL || process.env.DATABASE_URL!,
      },
    });
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('✅ Migrations applied successfully\n');
    return true;
  } catch (error: any) {
    console.error('❌ Migration failed:');
    console.error(`   ${error.message}\n`);
    
    if (error.stdout) console.error('Output:', error.stdout);
    if (error.stderr) console.error('Errors:', error.stderr);
    
    return false;
  }
}

async function seedDatabase() {
  console.log('🌱 Seeding database (optional)...\n');
  
  const seedScript = path.join(process.cwd(), 'prisma', 'seed.ts');
  if (!fs.existsSync(seedScript)) {
    console.log('ℹ️  No seed script found - skipping seeding\n');
    return true;
  }
  
  try {
    const { stdout, stderr } = await execAsync('npx prisma db seed', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.CLOUD_SQL_DATABASE_URL || process.env.DATABASE_URL!,
      },
    });
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('✅ Database seeded successfully\n');
    return true;
  } catch (error: any) {
    console.error('⚠️  Seeding failed (non-critical):');
    console.error(`   ${error.message}\n`);
    return false;
  }
}

async function verifyMigration() {
  console.log('✅ Verifying migration...\n');
  
  try {
    const { prisma } = await import('../lib/db');
    await prisma.$connect();
    
    // Count records in each table
    const tables = [
      'designUser',
      'customDesign',
      'customOrder',
      'designTemplate',
      'designUsageLog',
      'productCache',
      'searchLog',
      'personalizedContent',
    ];
    
    console.log('📊 Record counts:');
    for (const table of tables) {
      try {
        // @ts-ignore - Dynamic table access
        const count = await prisma[table].count();
        console.log(`   ✓ ${table}: ${count.toLocaleString()} records`);
      } catch {
        console.log(`   - ${table}: (table may not exist yet)`);
      }
    }
    
    await prisma.$disconnect();
    console.log('\n✅ Migration verification complete\n');
    return true;
  } catch (error: any) {
    console.error('❌ Verification failed:');
    console.error(`   ${error.message}\n`);
    return false;
  }
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║     Cloud SQL Migration - Sampada                        ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  const startTime = Date.now();
  
  // Step 1: Check prerequisites
  await checkPrerequisites();
  
  // Step 2: Test connection
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.error('❌ Migration aborted: Cannot connect to database\n');
    process.exit(1);
  }
  
  // Step 3: Run migrations
  const migrationsOk = await runMigrations();
  if (!migrationsOk) {
    console.error('❌ Migration aborted: Migrations failed\n');
    process.exit(1);
  }
  
  // Step 4: Seed database (optional)
  await seedDatabase();
  
  // Step 5: Verify migration
  await verifyMigration();
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log(`║  ✅ Migration Complete! (Duration: ${duration}s)                    ║`);
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  console.log('📝 Next steps:');
  console.log('   1. Update .env.production with CLOUD_SQL_DATABASE_URL');
  console.log('   2. Configure Cloud SQL Auth Proxy for Cloud Run');
  console.log('   3. Deploy to Cloud Run with database connection\n');
}

// Run migration
main().catch((error) => {
  console.error('╔═══════════════════════════════════════════════════════════╗');
  console.error('║  ❌ Migration Failed                                      ║');
  console.error('╚═══════════════════════════════════════════════════════════╝\n');
  console.error(error);
  process.exit(1);
});
