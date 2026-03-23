/**
 * Sampada Designer - Setup Verification Script
 * 
 * Run this script to check if your environment is properly configured:
 * node scripts/verify-setup.js
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 SAMPADA DESIGNER - SETUP VERIFICATION\n');
console.log('='.repeat(50));

// Check required environment variables
const requiredEnvVars = [
    { name: 'DATABASE_URL', description: 'PostgreSQL connection string' },
    { name: 'GOOGLE_CLOUD_PROJECT_ID', description: 'Google Cloud project ID' },
    { name: 'GCS_BUCKET_NAME', description: 'Google Cloud Storage bucket' },
    { name: 'STRIPE_DESIGNER_SECRET', description: 'Stripe secret key' },
    { name: 'NEXTAUTH_SECRET', description: 'NextAuth secret' },
    { name: 'NEXTAUTH_URL', description: 'NextAuth URL' },
];

const optionalEnvVars = [
    { name: 'GCS_KEY_FILE', description: 'Path to GCS service account key' },
    { name: 'STRIPE_DESIGNER_PRO_PRICE_ID', description: 'Stripe Pro plan price ID' },
    { name: 'STRIPE_DESIGNER_ULTRA_PRICE_ID', description: 'Stripe Ultra plan price ID' },
    { name: 'STRIPE_DESIGNER_WEBHOOK_SECRET', description: 'Stripe webhook secret' },
];

console.log('\n📋 REQUIRED ENVIRONMENT VARIABLES:\n');

let missingRequired = [];
requiredEnvVars.forEach(({ name, description }) => {
    const value = process.env[name];
    const status = value ? '✅' : '❌';
    const displayValue = value
        ? (name.includes('SECRET') || name.includes('KEY') || name.includes('URL')
            ? `${value.substring(0, 15)}...`
            : value)
        : 'NOT SET';

    console.log(`${status} ${name}`);
    console.log(`   ${description}`);
    console.log(`   Value: ${displayValue}\n`);

    if (!value) missingRequired.push(name);
});

console.log('\n📋 OPTIONAL ENVIRONMENT VARIABLES:\n');

let missingOptional = [];
optionalEnvVars.forEach(({ name, description }) => {
    const value = process.env[name];
    const status = value ? '✅' : '⚠️';
    const displayValue = value
        ? (name.includes('SECRET') || name.includes('KEY')
            ? `${value.substring(0, 15)}...`
            : value)
        : 'NOT SET';

    console.log(`${status} ${name}`);
    console.log(`   ${description}`);
    console.log(`   Value: ${displayValue}\n`);

    if (!value) missingOptional.push(name);
});

// Check files
console.log('\n📁 FILE CHECKS:\n');

const filesToCheck = [
    { path: 'prisma/schema.prisma', description: 'Prisma schema' },
    { path: 'lib/db.ts', description: 'Database client' },
    { path: 'lib/gcs.ts', description: 'Google Cloud Storage client' },
    { path: 'lib/stripe.ts', description: 'Stripe client' },
    { path: 'components/designer/Canvas.tsx', description: 'Designer canvas' },
];

filesToCheck.forEach(({ path: filePath, description }) => {
    const fullPath = path.join(process.cwd(), filePath);
    const exists = fs.existsSync(fullPath);
    const status = exists ? '✅' : '❌';
    console.log(`${status} ${filePath} - ${description}`);
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 SUMMARY:\n');

if (missingRequired.length === 0) {
    console.log('✅ All required environment variables are set!');
} else {
    console.log(`❌ Missing ${missingRequired.length} required variable(s):`);
    missingRequired.forEach(name => console.log(`   - ${name}`));
}

if (missingOptional.length > 0) {
    console.log(`\n⚠️  Missing ${missingOptional.length} optional variable(s):`);
    missingOptional.forEach(name => console.log(`   - ${name}`));
}

console.log('\n' + '='.repeat(50));

// Instructions if missing
if (missingRequired.length > 0) {
    console.log('\n📝 NEXT STEPS:\n');
    console.log('Add the missing variables to your .env.local file:\n');

    if (missingRequired.includes('DATABASE_URL')) {
        console.log('# For local PostgreSQL:');
        console.log('DATABASE_URL="postgresql://postgres:password@localhost:5432/sampada"\n');
        console.log('# For Google Cloud SQL:');
        console.log('DATABASE_URL="postgresql://user:password@IP_ADDRESS:5432/sampada"\n');
    }

    if (missingRequired.includes('GOOGLE_CLOUD_PROJECT_ID')) {
        console.log('GOOGLE_CLOUD_PROJECT_ID=sampada-store-87848430');
    }

    if (missingRequired.includes('GCS_BUCKET_NAME')) {
        console.log('GCS_BUCKET_NAME=sampada-storage-87848430');
    }
}

console.log('\n');
