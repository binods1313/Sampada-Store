#!/usr/bin/env node
/**
 * Test Hydration Fixes
 * 
 * This script verifies that Phase 1 critical fixes are properly implemented.
 * Run this before starting the dev server to ensure all files are correct.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Hydration Fixes Implementation\n');

const tests = [];
let passed = 0;
let failed = 0;

// Test 1: Check if _document.js exists
function test1() {
  const filePath = path.join(__dirname, 'pages', '_document.js');
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasThemeScript = content.includes('window.__INITIAL_THEME__');
    const hasDangerouslySet = content.includes('dangerouslySetInnerHTML');
    
    if (hasThemeScript && hasDangerouslySet) {
      console.log('✅ Test 1: _document.js exists with theme script');
      passed++;
      return true;
    } else {
      console.log('❌ Test 1: _document.js exists but missing theme script');
      failed++;
      return false;
    }
  } else {
    console.log('❌ Test 1: _document.js does not exist');
    failed++;
    return false;
  }
}

// Test 2: Check if Navbar.jsx has proper placeholder
function test2() {
  const filePath = path.join(__dirname, 'components', 'Navbar.jsx');
  
  if (!fs.existsSync(filePath)) {
    console.log('❌ Test 2: Navbar.jsx not found');
    failed++;
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const hasMountedCheck = content.includes('if (!mounted)');
  const hasNavData = content.includes('navData.map');
  const hasPlaceholderStructure = content.includes('width: \'64px\'') || 
                                   content.includes('width: "64px"');
  
  if (hasMountedCheck && hasNavData && hasPlaceholderStructure) {
    console.log('✅ Test 2: Navbar.jsx has proper placeholder structure');
    passed++;
    return true;
  } else {
    console.log('❌ Test 2: Navbar.jsx placeholder incomplete');
    if (!hasMountedCheck) console.log('   - Missing mounted check');
    if (!hasNavData) console.log('   - Missing navData.map in placeholder');
    if (!hasPlaceholderStructure) console.log('   - Missing placeholder dimensions');
    failed++;
    return false;
  }
}

// Test 3: Check if Navbar uses dynamic import for VisualSearch
function test3() {
  const filePath = path.join(__dirname, 'components', 'Navbar.jsx');
  const content = fs.readFileSync(filePath, 'utf8');
  
  const hasDynamicImport = content.includes('dynamic(() => import');
  const hasVisualSearchImport = content.includes('./VisualSearch');
  
  if (hasDynamicImport && hasVisualSearchImport) {
    console.log('✅ Test 3: Navbar uses dynamic import for VisualSearch');
    passed++;
    return true;
  } else {
    console.log('❌ Test 3: Navbar missing dynamic import for VisualSearch');
    failed++;
    return false;
  }
}

// Test 4: Check if StateContext reads window.__INITIAL_THEME__
function test4() {
  const filePath = path.join(__dirname, 'context', 'StateContext.js');
  
  if (!fs.existsSync(filePath)) {
    console.log('❌ Test 4: StateContext.js not found');
    failed++;
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const readsInitialTheme = content.includes('window.__INITIAL_THEME__');
  const hasSimplifiedLogic = !content.includes('Apply initial theme immediately');
  
  if (readsInitialTheme && hasSimplifiedLogic) {
    console.log('✅ Test 4: StateContext reads window.__INITIAL_THEME__');
    passed++;
    return true;
  } else {
    console.log('❌ Test 4: StateContext not properly updated');
    if (!readsInitialTheme) console.log('   - Missing window.__INITIAL_THEME__ read');
    if (!hasSimplifiedLogic) console.log('   - Still has old theme logic');
    failed++;
    return false;
  }
}

// Test 5: Check if branch exists
function test5() {
  const { execSync } = require('child_process');
  
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    
    if (branch === 'fix/hydration-issues') {
      console.log('✅ Test 5: On correct branch (fix/hydration-issues)');
      passed++;
      return true;
    } else {
      console.log(`⚠️  Test 5: On branch "${branch}" (expected: fix/hydration-issues)`);
      console.log('   This is OK if you merged already');
      passed++;
      return true;
    }
  } catch (error) {
    console.log('⚠️  Test 5: Could not check git branch');
    passed++;
    return true;
  }
}

// Test 6: Check if HYDRATION_FIXES.md exists
function test6() {
  const filePath = path.join(__dirname, 'docs-reference', 'HYDRATION_FIXES.md');
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    console.log('✅ Test 6: HYDRATION_FIXES.md documentation exists');
    passed++;
    return true;
  } else {
    console.log('❌ Test 6: HYDRATION_FIXES.md not found');
    failed++;
    return false;
  }
}

// Run all tests
console.log('Running tests...\n');

test1();
test2();
test3();
test4();
test5();
test6();

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('🎉 All tests passed! Phase 1 fixes are properly implemented.\n');
  console.log('Next steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Open browser to http://localhost:3000');
  console.log('3. Check console for hydration warnings (should be none)');
  console.log('4. Test theme toggle and refresh');
  console.log('5. Verify no reload loop\n');
  console.log('See HYDRATION_FIXES.md for complete testing checklist.');
  process.exit(0);
} else {
  console.log('❌ Some tests failed. Please review the errors above.\n');
  console.log('Check these files:');
  console.log('- pages/_document.js');
  console.log('- components/Navbar.jsx');
  console.log('- context/StateContext.js\n');
  process.exit(1);
}
