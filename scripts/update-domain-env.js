#!/usr/bin/env node
/**
 * Domain Migration Script
 * Updates environment variables for new domain: sampadaoriginals.in
 * 
 * Usage: node scripts/update-domain-env.js
 */

const fs = require('fs');
const path = require('path');

const NEW_DOMAIN = 'sampadaoriginals.in';
const NEW_DOMAIN_URL = `https://${NEW_DOMAIN}`;

const ENV_FILES = [
  '.env.production',
  '.env.local'
];

const REPLACEMENTS = [
  {
    pattern: /NEXT_PUBLIC_BASE_URL=.*/g,
    replacement: `NEXT_PUBLIC_BASE_URL="${NEW_DOMAIN_URL}"`
  },
  {
    pattern: /NEXT_PUBLIC_API_URL=.*/g,
    replacement: `NEXT_PUBLIC_API_URL="${NEW_DOMAIN_URL}"`
  },
  {
    pattern: /NEXTAUTH_URL=.*/g,
    replacement: `NEXTAUTH_URL="${NEW_DOMAIN_URL}"`
  },
  {
    pattern: /SENDGRID_FROM_EMAIL="noreply@.*/g,
    replacement: `SENDGRID_FROM_EMAIL="noreply@${NEW_DOMAIN}"`
  }
];

console.log('🚀 Domain Migration Script\n');
console.log(`New Domain: ${NEW_DOMAIN}\n`);

ENV_FILES.forEach(fileName => {
  const filePath = path.join(process.cwd(), fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${fileName} not found, skipping...`);
    return;
  }

  console.log(`📝 Updating ${fileName}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  REPLACEMENTS.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      updated = true;
    }
  });

  if (updated) {
    // Create backup
    const backupPath = `${filePath}.backup-${Date.now()}`;
    fs.writeFileSync(backupPath, fs.readFileSync(filePath));
    console.log(`   ✅ Backup created: ${path.basename(backupPath)}`);

    // Write updated content
    fs.writeFileSync(filePath, content);
    console.log(`   ✅ Updated successfully`);
  } else {
    console.log(`   ℹ️  No changes needed`);
  }
  
  console.log('');
});

console.log('✅ Domain migration script completed!\n');
console.log('📋 Next Steps:');
console.log('   1. Review the updated .env files');
console.log('   2. Update environment variables in Vercel Dashboard');
console.log('   3. Configure DNS records at your domain registrar');
console.log('   4. Redeploy your application');
console.log('\n📖 See DOMAIN_MIGRATION_GUIDE.md for detailed instructions\n');
