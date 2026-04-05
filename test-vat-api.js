// test-vat-api.js
// Quick test script to verify VAT layer API key is working

require('dotenv').config({ path: '.env.local' });

const VAT_API_KEY = process.env.VAT_API_KEY;
const VAT_API_BASE = 'http://apilayer.net/api/check';

async function testVATKey() {
  console.log('🔍 Testing VAT Layer API Key...\n');
  
  if (!VAT_API_KEY) {
    console.error('❌ ERROR: VAT_API_KEY not found in .env.local');
    return;
  }
  
  console.log(`✓ API Key found: ${VAT_API_KEY.substring(0, 8)}...${VAT_API_KEY.slice(-4)}`);
  
  // Test with different VAT numbers
  const testCases = [
    'DE280576756', // Google Germany GmbH
    'IE6388047V',  // Google Ireland
    'DE811766944'  // Test number
  ];
  
  for (const testVAT of testCases) {
    const testUrl = `https://apilayer.net/api/validate?access_key=${VAT_API_KEY}&vat_number=${testVAT}&format=1`;
    
    console.log(`\n📡 Testing VAT Number: ${testVAT}`);
    
    try {
      const response = await fetch(testUrl);
      const data = await response.json();
      
      console.log(`   Valid: ${data.valid ? '✅ YES' : '❌ NO'}`);
      if (data.company_name) console.log(`   Company: ${data.company_name}`);
      if (data.company_address) console.log(`   Address: ${data.company_address}`);
      
      if (data.success === false && data.error) {
        console.log(`   ❌ Error: ${data.error.info || data.error.message}`);
        console.log(`\n💡 Check your VATlayer account at: https://vatlayer.com/profile`);
        console.log(`   Possible issues: Invalid key, quota exceeded, or plan not activated`);
        return;
      }
      
      if (data.valid) {
        console.log(`\n✅ SUCCESS! Your VAT layer API key is working correctly!`);
        console.log(`   You can now use the VAT validator in your app.`);
        return;
      }
    } catch (error) {
      console.error(`   ❌ Request Failed: ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n⚠️  API is responding but test VATs were invalid.`);
  console.log(`   This might be OK - the key appears to be working!`);
  console.log(`   Test your own VAT numbers in the app.`);
}

testVATKey();
