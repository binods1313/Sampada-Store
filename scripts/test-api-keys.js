// scripts/test-api-keys.js
// Quick script to test API key configuration

require('dotenv').config();

const testGoogleAI = async () => {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_KEY;
  
  if (!apiKey) {
    console.error('❌ GOOGLE_AI_API_KEY not found in .env');
    return false;
  }

  console.log('✅ Google AI API Key found:', apiKey.substring(0, 20) + '...');

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say hello' }] }]
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Google AI API is working!');
      console.log('   Response:', data.candidates?.[0]?.content?.parts?.[0]?.text?.substring(0, 50) + '...');
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Google AI API error:', response.status, error);
      return false;
    }
  } catch (error) {
    console.error('❌ Google AI API test failed:', error.message);
    return false;
  }
};

const testPrintify = async () => {
  const apiKey = process.env.PRINTIFY_API_KEY;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!apiKey || !shopId) {
    console.error('❌ PRINTIFY_API_KEY or PRINTIFY_SHOP_ID not found in .env');
    return false;
  }

  console.log('✅ Printify API Key found');
  console.log('✅ Printify Shop ID:', shopId);

  try {
    const response = await fetch(
      `https://api.printify.com/v1/shops/${shopId}/products.json`,
      {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Printify API is working!');
      console.log(`   Found ${data.data?.length || 0} products in shop`);
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Printify API error:', response.status, error);
      return false;
    }
  } catch (error) {
    console.error('❌ Printify API test failed:', error.message);
    return false;
  }
};

const testSanity = () => {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    console.error('❌ Sanity configuration not found in .env');
    return false;
  }

  console.log('✅ Sanity Project ID:', projectId);
  console.log('✅ Sanity Dataset:', dataset);
  return true;
};

const main = async () => {
  console.log('\n🔍 Testing API Keys Configuration...\n');
  console.log('━'.repeat(50));
  
  console.log('\n📊 SANITY CMS');
  console.log('━'.repeat(50));
  const sanityOk = testSanity();

  console.log('\n🤖 GOOGLE AI API');
  console.log('━'.repeat(50));
  const googleOk = await testGoogleAI();

  console.log('\n🖨️  PRINTIFY API');
  console.log('━'.repeat(50));
  const printifyOk = await testPrintify();

  console.log('\n📋 SUMMARY');
  console.log('━'.repeat(50));
  console.log(`Sanity CMS:    ${sanityOk ? '✅ OK' : '❌ FAILED'}`);
  console.log(`Google AI API: ${googleOk ? '✅ OK' : '❌ FAILED'}`);
  console.log(`Printify API:  ${printifyOk ? '✅ OK' : '❌ FAILED'}`);
  
  const allOk = sanityOk && googleOk && printifyOk;
  console.log('\n' + '━'.repeat(50));
  console.log(allOk ? '✅ All API keys are working!' : '⚠️  Some API keys need attention');
  console.log('━'.repeat(50) + '\n');

  process.exit(allOk ? 0 : 1);
};

main();
