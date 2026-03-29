/**
 * Test script for OpenRouter integration with ALL free models
 * Run with: node scripts/test-openrouter.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// All free models to test
const MODELS_TO_TEST = [
  {
    id: 'nvidia/nemotron-3-super-120b-a12b:free',
    name: 'NVIDIA Nemotron 120B',
    tier: 1,
    prompt: 'Write a 2-sentence product description for wireless headphones.',
  },
  {
    id: 'deepseek/deepseek-r1-distill-llama-70b:free',
    name: 'DeepSeek R1',
    tier: 2,
    prompt: 'What is 2 + 2? Answer in one word.',
  },
  {
    id: 'qwen/qwen-2.5-72b-instruct:free',
    name: 'Qwen 2.5 72B',
    tier: 2,
    prompt: 'Translate "Hello, how are you?" to Spanish.',
  },
  {
    id: 'meta-llama/llama-3-1-8b-instruct:free',
    name: 'Llama 3.1 8B',
    tier: 3,
    prompt: 'What is the capital of France? One word answer.',
  },
  {
    id: 'google/gemma-2-9b-it:free',
    name: 'Gemma 2 9B',
    tier: 3,
    prompt: 'Write a haiku about coffee.',
  },
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B',
    tier: 3,
    prompt: 'Summarize: The quick brown fox jumps over the lazy dog.',
  },
  {
    id: 'meta-llama/llama-3-2-1b-instruct:free',
    name: 'Llama 3.2 1B',
    tier: 4,
    prompt: 'Is 5 greater than 3? Answer yes or no.',
  },
  {
    id: 'qwen/qwen-2.5-3b-instruct:free',
    name: 'Qwen 2.5 3B',
    tier: 4,
    prompt: 'What color is grass? One word.',
  },
];

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

  console.log('🔍 Testing OpenRouter Integration - All Free Models\n');
  console.log('📦 Configured API Keys:');
  console.log(`   Key 1 (Primary): ${apiKey.substring(0, 12)}...`);
  if (apiKey2) console.log(`   Key 2 (Backup):  ${apiKey2.substring(0, 12)}...`);
  if (apiKey3) console.log(`   Key 3 (Backup):  ${apiKey3.substring(0, 12)}...`);
  console.log('');

  const results = {
    working: [],
    failed: [],
  };

  // Test each model
  for (const model of MODELS_TO_TEST) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`🧪 Testing: ${model.name} (Tier ${model.tier})`);
    console.log(`   Model ID: ${model.id}`);
    console.log(`   Prompt: "${model.prompt}"`);

    try {
      const startTime = Date.now();
      
      const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Sampada-Store Test',
        },
        body: JSON.stringify({
          model: model.id,
          messages: [{ role: 'user', content: model.prompt }],
          max_tokens: 150,
        }),
      });

      const elapsed = Date.now() - startTime;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log(`   ❌ Error ${response.status}: ${errorData.error?.message || 'Unknown'}`);
        results.failed.push({ ...model, error: errorData.error?.message || `Status ${response.status}` });
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'No response';
      
      console.log(`   ✅ Success (${elapsed}ms)`);
      console.log(`   Response: "${content.trim().substring(0, 80)}${content.length > 80 ? '...' : ''}"`);
      console.log(`   Tokens: ${data.usage?.total_tokens || 'N/A'}`);
      results.working.push({ ...model, responseTime: elapsed });
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      results.failed.push({ ...model, error: error.message });
    }
  }

  // Summary
  console.log(`\n${'═'.repeat(60)}`);
  console.log('✅ OpenRouter Model Test Complete!\n');
  console.log(`📊 Results: ${results.working.length}/${MODELS_TO_TEST.length} models working\n`);

  if (results.working.length > 0) {
    console.log('✅ Working Models:');
    results.working.forEach(m => {
      console.log(`   • ${m.name} (Tier ${m.tier}) - ${m.responseTime}ms`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed Models:');
    results.failed.forEach(m => {
      console.log(`   • ${m.name} (Tier ${m.tier}): ${m.error}`);
    });
  }

  console.log('\n💡 Recommendation: Use Tier 1 models for best quality');
  console.log('   Falls back to lower tiers automatically if unavailable\n');

  // Save results to file
  const fs = require('fs');
  const resultsPath = path.join(__dirname, '..', 'model-test-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    results,
  }, null, 2));
  console.log(`📄 Results saved to: ${resultsPath}\n`);
}

// Run the test
testOpenRouter().catch(console.error);
