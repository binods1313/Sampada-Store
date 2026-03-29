/**
 * Test script for OpenRouter integration
 * Run with: node scripts/test-openrouter.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

async function testOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const apiKey2 = process.env.OPENROUTER_API_KEY_2;
  const apiKey3 = process.env.OPENROUTER_API_KEY_3;

  if (!apiKey) {
    console.error('❌ No OPENROUTER_API_KEY found in .env.local');
    console.log('\n📝 Add this to your .env.local:');
    console.log('OPENROUTER_API_KEY="sk-or-v1-your-key-here"');
    console.log('\nGet your key from: https://openrouter.ai/keys\n');
    process.exit(1);
  }

  console.log('🔍 Testing OpenRouter Integration with Key Rotation...\n');
  console.log('📦 Configured Keys:');
  console.log(`   Key 1 (Primary): ${apiKey.substring(0, 12)}...`);
  if (apiKey2) console.log(`   Key 2 (Backup):  ${apiKey2.substring(0, 12)}...`);
  if (apiKey3) console.log(`   Key 3 (Backup):  ${apiKey3.substring(0, 12)}...`);
  console.log('');

  const testCases = [
    {
      name: 'NVIDIA Nemotron 120B (Free) - RECOMMENDED',
      model: 'nvidia/nemotron-3-super-120b-a12b:free',
      prompt: 'Write a 2-sentence product description for wireless headphones.',
    },
  ];

  // Test with each key
  const keysToTest = [apiKey, apiKey2, apiKey3].filter(Boolean);
  let successCount = 0;

  for (const [keyIndex, testKey] of keysToTest.entries()) {
    console.log(`\n🔑 Testing with Key ${keyIndex + 1}: ${testKey.substring(0, 12)}...\n`);
    
    for (const testCase of testCases) {
      console.log(`   🧪 Model: ${testCase.name}`);
      console.log(`   Prompt: "${testCase.prompt}"`);

      try {
        const startTime = Date.now();
        
        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${testKey}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Sampada-Store Test',
          },
          body: JSON.stringify({
            model: testCase.model,
            messages: [{ role: 'user', content: testCase.prompt }],
            max_tokens: 150,
          }),
        });

        const elapsed = Date.now() - startTime;

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.log(`   ❌ Error ${response.status}: ${errorData.error?.message || 'Unknown'}`);
          continue;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || 'No response';
        
        console.log(`   ✅ Success (${elapsed}ms)`);
        console.log(`   Response: "${content.trim().substring(0, 100)}${content.length > 100 ? '...' : ''}"`);
        console.log(`   Tokens: ${data.usage?.total_tokens || 'N/A'}`);
        successCount++;
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
      }
    }
  }

  console.log(`\n✅ OpenRouter integration test complete!\n`);
  console.log(`📊 Results: ${successCount}/${keysToTest.length} keys working\n`);
  console.log('💡 All keys are configured for automatic rotation in production.\n');
}

// Run the test
testOpenRouter().catch(console.error);
