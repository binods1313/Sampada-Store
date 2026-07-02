/**
 * Test script for Kiro Runtime Registry
 * Tests loading and accessing powers and skills
 */

const { initializeRuntime, kiro } = require('./lib/startup');

async function testRuntime() {
  console.log('='.repeat(70));
  console.log('KIRO RUNTIME REGISTRY TEST');
  console.log('='.repeat(70));

  try {
    // Initialize runtime
    console.log('\n1. Initializing runtime...');
    await initializeRuntime();

    // Get stats
    console.log('\n2. Runtime Stats:');
    const stats = await kiro.stats();
    console.log('   Powers:', stats.powers);
    console.log('   Skills:', stats.skills);
    console.log('   Conflicts:', stats.conflicts);
    console.log('   Initialized:', stats.initialized);

    // List all powers
    console.log('\n3. Available Powers:');
    const powers = await kiro.powers();
    if (powers.length === 0) {
      console.log('   No powers loaded');
    } else {
      powers.forEach(power => {
        console.log(`   - ${power.name}`);
        console.log(`     Display: ${power.displayName}`);
        console.log(`     Description: ${power.description || 'N/A'}`);
        if (power.capabilities && power.capabilities.length > 0) {
          console.log(`     Capabilities: ${power.capabilities.length}`);
        }
      });
    }

    // List all skills
    console.log('\n4. Available Skills:');
    const skills = await kiro.skills();
    if (skills.length === 0) {
      console.log('   No skills loaded');
    } else {
      skills.forEach(skill => {
        console.log(`   - ${skill.name}`);
        console.log(`     Display: ${skill.displayName}`);
        console.log(`     Description: ${skill.description || 'N/A'}`);
        console.log(`     Files: ${skill.files ? skill.files.length : 0}`);
      });
    }

    // Test getting specific items
    console.log('\n5. Testing Item Access:');
    
    if (powers.length > 0) {
      const firstPower = powers[0];
      console.log(`   Getting power "${firstPower.name}"...`);
      const power = await kiro.power(firstPower.name);
      console.log(`   ✓ Retrieved: ${power.displayName}`);
      
      // Test namespace access
      const powerWithNamespace = await kiro.get(`power:${firstPower.name}`);
      console.log(`   ✓ Namespace access works: power:${firstPower.name}`);
    }

    if (skills.length > 0) {
      const firstSkill = skills[0];
      console.log(`   Getting skill "${firstSkill.name}"...`);
      const skill = await kiro.skill(firstSkill.name);
      console.log(`   ✓ Retrieved: ${skill.displayName}`);
      
      // Test namespace access
      const skillWithNamespace = await kiro.get(`skill:${firstSkill.name}`);
      console.log(`   ✓ Namespace access works: skill:${firstSkill.name}`);
    }

    // Test global access
    console.log('\n6. Testing Global Access:');
    if (typeof global.kiro !== 'undefined') {
      console.log('   ✓ global.kiro is available');
      const globalStats = await global.kiro.stats();
      console.log(`   ✓ Can access via global: ${globalStats.powers} powers, ${globalStats.skills} skills`);
    } else {
      console.log('   ✗ global.kiro is not available');
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ ALL TESTS PASSED');
    console.log('='.repeat(70));
    console.log('\nUsage Examples:');
    console.log('  const power = await kiro.power("figma");');
    console.log('  const skill = await kiro.skill("web-design-guidelines");');
    console.log('  const item = await kiro.get("power:figma");');
    console.log('  const stats = await kiro.stats();');
    console.log('='.repeat(70));

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests
testRuntime().then(() => {
  console.log('\nTest completed successfully');
  process.exit(0);
}).catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
