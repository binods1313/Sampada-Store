// test-currency-and-ifsc.js
// Test script for Currency API and IFSC API

async function testCurrencyAPI() {
  console.log('\n🌍 Testing Currency API...');
  console.log('─'.repeat(50));
  
  try {
    // Test with the NEW CDN-based endpoint
    console.log('📡 Fetching available currencies...');
    const currenciesRes = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json');
    
    if (!currenciesRes.ok) {
      // Try fallback
      console.log('⚠️  Primary failed, trying fallback...');
      const fallbackRes = await fetch('https://latest.currency-api.pages.dev/v1/currencies.json');
      if (!fallbackRes.ok) {
        throw new Error('Both endpoints failed');
      }
      var currencies = await fallbackRes.json();
    } else {
      var currencies = await currenciesRes.json();
    }
    
    console.log(`✅ Available currencies: ${Object.keys(currencies).length}`);
    
    // Test 2: Convert USD to INR
    console.log('\n📡 Converting 100 USD to INR...');
    const usdRes = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
    const usdData = await usdRes.json();
    const inrRate = usdData.usd.inr;
    const converted = (100 * inrRate).toFixed(2);
    console.log(`✅ 100 USD = ₹${converted} (Rate: ${inrRate})`);
    
    // Test 3: Convert USD to EUR
    console.log('\n📡 Converting 100 USD to EUR...');
    const eurRate = usdData.usd.eur;
    const convertedEUR = (100 * eurRate).toFixed(2);
    console.log(`✅ 100 USD = €${convertedEUR} (Rate: ${eurRate})`);
    
    console.log('\n✅ Currency API is working perfectly!');
    return true;
  } catch (error) {
    console.error('❌ Currency API test failed:', error.message);
    return false;
  }
}

async function testIFSCAPI() {
  console.log('\n🇮🇳 Testing IFSC API...');
  console.log('─'.repeat(50));
  
  const testCodes = [
    'SBIN0001234', // State Bank of India
    'HDFC0000001', // HDFC Bank
    'ICIC0000001'  // ICICI Bank
  ];
  
  for (const ifscCode of testCodes) {
    console.log(`\n📡 Testing IFSC: ${ifscCode}`);
    
    try {
      const response = await fetch(`https://ifsc.razorpay.com/${ifscCode}`);
      
      if (response.status === 404) {
        console.log(`   ❌ Invalid IFSC code`);
        continue;
      }
      
      if (!response.ok) {
        console.log(`   ❌ API Error: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`   ✅ Valid IFSC`);
      console.log(`   Bank: ${data.BANK}`);
      console.log(`   Branch: ${data.BRANCH}`);
      console.log(`   City: ${data.CITY}, ${data.STATE}`);
      console.log(`   Payment Methods: ${[
        data.UPI ? 'UPI' : null,
        data.NEFT ? 'NEFT' : null,
        data.RTGS ? 'RTGS' : null,
        data.IMPS ? 'IMPS' : null
      ].filter(Boolean).join(', ')}`);
      
      console.log('\n✅ IFSC API is working perfectly!');
      return true;
    } catch (error) {
      console.error(`   ❌ Request failed: ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  return false;
}

async function runTests() {
  console.log('\n🧪 Public APIs Integration Test');
  console.log('═'.repeat(50));
  
  const currencyOK = await testCurrencyAPI();
  const ifscOK = await testIFSCAPI();
  
  console.log('\n' + '═'.repeat(50));
  console.log('📊 Test Summary:');
  console.log(`   Currency API: ${currencyOK ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   IFSC API:     ${ifscOK ? '✅ PASS' : '❌ FAIL'}`);
  console.log('═'.repeat(50));
  
  if (currencyOK && ifscOK) {
    console.log('\n🎉 All APIs are working! You can now use them in your app.');
  } else {
    console.log('\n⚠️  Some APIs failed. Check the errors above.');
  }
}

runTests();
