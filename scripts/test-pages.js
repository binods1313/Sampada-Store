// scripts/test-pages.js
// Quick script to test if all pages load without errors

const pages = [
  { name: 'Homepage', url: 'http://localhost:3000/' },
  { name: 'Shop', url: 'http://localhost:3000/shop' },
  { name: 'Collections - Mens', url: 'http://localhost:3000/collections/mens-tshirts' },
  { name: 'Collections - Womens', url: 'http://localhost:3000/collections/womens-tshirts' },
  { name: 'Support', url: 'http://localhost:3000/support' },
  { name: 'Stories', url: 'http://localhost:3000/stories' },
  { name: 'Company', url: 'http://localhost:3000/company' },
  { name: 'Team', url: 'http://localhost:3000/team' },
  { name: 'About', url: 'http://localhost:3000/about' },
  { name: 'Contact', url: 'http://localhost:3000/contact' },
];

console.log('\n🔍 Testing Page Load Status...\n');
console.log('━'.repeat(60));
console.log('\n⚠️  Make sure dev server is running: npm run dev\n');
console.log('━'.repeat(60));

async function testPage(page) {
  try {
    const response = await fetch(page.url);
    const status = response.status;
    const ok = response.ok;
    
    if (ok) {
      console.log(`✅ ${page.name.padEnd(25)} - ${status} OK`);
      return true;
    } else {
      console.log(`❌ ${page.name.padEnd(25)} - ${status} ERROR`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${page.name.padEnd(25)} - ${error.message}`);
    return false;
  }
}

async function testAllPages() {
  const results = [];
  
  for (const page of pages) {
    const result = await testPage(page);
    results.push(result);
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n' + '━'.repeat(60));
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  if (passed === total) {
    console.log(`✅ ALL PAGES WORKING (${passed}/${total})`);
  } else {
    console.log(`⚠️  SOME PAGES FAILED (${passed}/${total} working)`);
  }
  console.log('━'.repeat(60) + '\n');
  
  process.exit(passed === total ? 0 : 1);
}

testAllPages();
