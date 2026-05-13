// scripts/verify-sanity-plugins.js
// Automated verification of Sanity Studio plugin configuration

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_PLUGINS = [
  { name: '@sanity/assist', displayName: 'AI Assist', type: 'dependency' },
  { name: '@sanity/vision', displayName: 'Vision Tool', type: 'dependency' },
  { name: '@sanity/code-input', displayName: 'Code Input', type: 'dependency' },
  { name: 'sanity-plugin-smart-asset-manager', displayName: 'Smart Asset Manager', type: 'dependency' },
  { name: 'sanity-plugin-block-styles', displayName: 'Block Styles', type: 'dependency' },
  { name: 'sanity-plugin-references', displayName: 'References', type: 'dependency' },
  { name: 'sanity-plugin-recursive-hierarchy', displayName: 'Recursive Hierarchy', type: 'dependency' },
  { name: 'sanity-plugin-color-input', displayName: 'Color Input', type: 'dependency' },
  { name: 'sanity-plugin-media', displayName: 'Media Library', type: 'dependency' },
];

const REQUIRED_SCHEMA_FIELDS = {
  product: [
    'printifyIntegration',
    'productTabs',
    'availableColors',
    'variants',
    'specifications'
  ]
};

console.log('\n🔍 Verifying Sanity Studio Plugin Configuration...\n');
console.log('━'.repeat(60));

// Check package.json
console.log('\n📦 CHECKING PACKAGE.JSON\n');
console.log('━'.repeat(60));

const packageJsonPath = path.join(__dirname, '../sanity_abscommerce/package.json');
let packageJson;

try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log('✅ package.json found');
} catch (error) {
  console.error('❌ Could not read package.json:', error.message);
  process.exit(1);
}

let allPluginsInstalled = true;

REQUIRED_PLUGINS.forEach(plugin => {
  const isInstalled = packageJson.dependencies?.[plugin.name] || packageJson.devDependencies?.[plugin.name];
  if (isInstalled) {
    console.log(`✅ ${plugin.displayName}: ${isInstalled}`);
  } else {
    console.log(`❌ ${plugin.displayName}: NOT INSTALLED`);
    allPluginsInstalled = false;
  }
});

// Check sanity.config.js
console.log('\n⚙️  CHECKING SANITY.CONFIG.JS\n');
console.log('━'.repeat(60));

const configPath = path.join(__dirname, '../sanity_abscommerce/sanity.config.js');
let configContent;

try {
  configContent = fs.readFileSync(configPath, 'utf8');
  console.log('✅ sanity.config.js found');
} catch (error) {
  console.error('❌ Could not read sanity.config.js:', error.message);
  process.exit(1);
}

const configChecks = [
  { name: 'assist()', displayName: 'AI Assist' },
  { name: 'smartAssetManager(', displayName: 'Smart Asset Manager' },
  { name: 'blockStyles(', displayName: 'Block Styles' },
  { name: 'references(', displayName: 'References' },
  { name: 'recursiveHierarchy(', displayName: 'Recursive Hierarchy' },
  { name: 'colorInput()', displayName: 'Color Input' },
  { name: 'media()', displayName: 'Media Library' },
  { name: 'visionTool(', displayName: 'Vision Tool' },
  { name: 'codeInput()', displayName: 'Code Input' },
];

let allPluginsConfigured = true;

configChecks.forEach(check => {
  if (configContent.includes(check.name)) {
    console.log(`✅ ${check.displayName} configured`);
  } else {
    console.log(`❌ ${check.displayName} NOT configured`);
    allPluginsConfigured = false;
  }
});

// Check product schema
console.log('\n📋 CHECKING PRODUCT SCHEMA\n');
console.log('━'.repeat(60));

const schemaPath = path.join(__dirname, '../sanity_abscommerce/schemaTypes/product.js');
let schemaContent;

try {
  schemaContent = fs.readFileSync(schemaPath, 'utf8');
  console.log('✅ product.js schema found');
} catch (error) {
  console.error('❌ Could not read product.js:', error.message);
  process.exit(1);
}

let allFieldsPresent = true;

REQUIRED_SCHEMA_FIELDS.product.forEach(field => {
  if (schemaContent.includes(`name: '${field}'`)) {
    console.log(`✅ Field '${field}' present`);
  } else {
    console.log(`❌ Field '${field}' NOT FOUND`);
    allFieldsPresent = false;
  }
});

// Check field groups
console.log('\n📂 CHECKING FIELD GROUPS\n');
console.log('━'.repeat(60));

const requiredGroups = ['printify', 'tabs', 'variants'];
let allGroupsPresent = true;

requiredGroups.forEach(group => {
  if (schemaContent.includes(`name: '${group}'`)) {
    console.log(`✅ Group '${group}' configured`);
  } else {
    console.log(`❌ Group '${group}' NOT FOUND`);
    allGroupsPresent = false;
  }
});

// Summary
console.log('\n📊 VERIFICATION SUMMARY\n');
console.log('━'.repeat(60));

const checks = [
  { name: 'Plugins Installed', passed: allPluginsInstalled },
  { name: 'Plugins Configured', passed: allPluginsConfigured },
  { name: 'Schema Fields Present', passed: allFieldsPresent },
  { name: 'Field Groups Present', passed: allGroupsPresent },
];

checks.forEach(check => {
  console.log(`${check.passed ? '✅' : '❌'} ${check.name}`);
});

const allPassed = checks.every(check => check.passed);

console.log('\n' + '━'.repeat(60));
if (allPassed) {
  console.log('✅ ALL CHECKS PASSED - Ready for Phase 4 Testing!');
  console.log('\nNext Steps:');
  console.log('1. Start Sanity Studio: cd sanity_abscommerce && npm run dev');
  console.log('2. Open: http://localhost:3333');
  console.log('3. Follow: docs/PHASE4_PLUGIN_VERIFICATION_GUIDE.md');
} else {
  console.log('⚠️  SOME CHECKS FAILED - Review issues above');
  console.log('\nRecommended Actions:');
  if (!allPluginsInstalled) {
    console.log('- Run: cd sanity_abscommerce && npm install');
  }
  if (!allPluginsConfigured) {
    console.log('- Check sanity.config.js for missing plugin imports');
  }
  if (!allFieldsPresent || !allGroupsPresent) {
    console.log('- Review product.js schema for missing fields/groups');
  }
}
console.log('━'.repeat(60) + '\n');

process.exit(allPassed ? 0 : 1);
