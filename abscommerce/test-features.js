/**
 * Test script to verify Try On and Visual Search features
 */
require('dotenv').config({ path: '.env' });

console.log('='.repeat(60));
console.log('FEATURE VERIFICATION TEST');
console.log('='.repeat(60));

// Check environment variables
console.log('\n1. ENVIRONMENT VARIABLES:');
console.log('   NEXT_PUBLIC_FEATURE_ENHANCED_TRYON:', process.env.NEXT_PUBLIC_FEATURE_ENHANCED_TRYON);
console.log('   NEXT_PUBLIC_FEATURE_VISUAL_SEARCH:', process.env.NEXT_PUBLIC_FEATURE_VISUAL_SEARCH);
console.log('   GOOGLE_AI_API_KEY:', process.env.GOOGLE_AI_API_KEY ? '✓ Set' : '✗ Missing');
console.log('   GOOGLE_CLOUD_PROJECT_ID:', process.env.GOOGLE_CLOUD_PROJECT_ID ? '✓ Set' : '✗ Missing');

// Check required dependencies
console.log('\n2. DEPENDENCIES:');
try {
    require('@google/generative-ai');
    console.log('   @google/generative-ai: ✓ Installed');
} catch (e) {
    console.log('   @google/generative-ai: ✗ Missing');
}

try {
    require('@google-cloud/vision');
    console.log('   @google-cloud/vision: ✓ Installed');
} catch (e) {
    console.log('   @google-cloud/vision: ✗ Missing');
}

// Check component files
console.log('\n3. COMPONENT FILES:');
const fs = require('fs');
const componentsToCheck = [
    'components/EnhancedTryOn.jsx',
    'components/VisualSearch.jsx',
    'services/visualSearchService.js',
    'services/faceDetectionService.js',
    'services/tryonService.js',
    'services/productMatchingService.js',
    'controllers/visualSearchController.js',
    'controllers/tryonController.js',
    'pages/api/search/visual.js',
    'pages/api/virtual-tryon/enhanced.js'
];

componentsToCheck.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`   ${file}: ${exists ? '✓' : '✗'}`);
});

// Check Navbar integration
console.log('\n4. NAVBAR INTEGRATION:');
const navbarContent = fs.readFileSync('components/Navbar.jsx', 'utf8');
const hasVisualSearch = navbarContent.includes('VisualSearch');
const hasFeatureFlag = navbarContent.includes('NEXT_PUBLIC_FEATURE_VISUAL_SEARCH');
console.log('   VisualSearch imported:', hasVisualSearch ? '✓' : '✗');
console.log('   Feature flag check:', hasFeatureFlag ? '✓' : '✗');

// Check Product page integration
console.log('\n5. PRODUCT PAGE INTEGRATION:');
const productPageContent = fs.readFileSync('pages/product/[slug].js', 'utf8');
const hasTryOn = productPageContent.includes('EnhancedTryOn');
const hasTryOnFlag = productPageContent.includes('NEXT_PUBLIC_FEATURE_ENHANCED_TRYON');
console.log('   EnhancedTryOn imported:', hasTryOn ? '✓' : '✗');
console.log('   Feature flag check:', hasTryOnFlag ? '✓' : '✗');

console.log('\n' + '='.repeat(60));
console.log('SUMMARY:');
console.log('='.repeat(60));

const tryOnEnabled = process.env.NEXT_PUBLIC_FEATURE_ENHANCED_TRYON === 'true';
const visualSearchEnabled = process.env.NEXT_PUBLIC_FEATURE_VISUAL_SEARCH === 'true';

console.log('\n✓ Try On Feature:', tryOnEnabled ? 'ENABLED' : 'DISABLED');
console.log('✓ Visual Search Feature:', visualSearchEnabled ? 'ENABLED' : 'DISABLED');

if (tryOnEnabled && visualSearchEnabled) {
    console.log('\n🎉 Both features are ENABLED and ready to use!');
} else {
    console.log('\n⚠️  One or more features are disabled.');
    console.log('   To enable, set the following in your .env file:');
    if (!tryOnEnabled) {
        console.log('   NEXT_PUBLIC_FEATURE_ENHANCED_TRYON=true');
    }
    if (!visualSearchEnabled) {
        console.log('   NEXT_PUBLIC_FEATURE_VISUAL_SEARCH=true');
    }
}

console.log('\n' + '='.repeat(60));
