/**
 * Navigation Data Seed Script
 * 
 * This script populates the Sanity CMS with navigation menu data.
 * Run once to create all 5 navigation documents automatically.
 * 
 * Usage: node scripts/seed-navigation.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

// Initialize Sanity write client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-18',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

// Navigation data to seed
const navigationData = [
  {
    _id: 'navigation-mens',
    label: "Men's Clothing",
    href: '/collections/mens-tshirts',
    order: 1,
    sections: [
      {
        sectionTitle: 'SHOP BY PRODUCT',
        items: [
          { label: 'T-shirts', href: '/collections/mens-tshirts' },
          { label: 'Hoodies', href: '/collections/mens-hoodies' },
          { label: 'Sweatshirts', href: '/collections/mens-sweatshirts' },
          { label: 'Long Sleeves', href: '/collections/mens-long-sleeves' },
          { label: 'Tank Tops', href: '/collections/mens-tank-tops' },
          { label: 'Sportswear', href: '/collections/mens-sportswear' },
          { label: 'Bottoms', href: '/collections/mens-bottoms' },
          { label: 'Swimwear', href: '/collections/mens-swimwear' },
          { label: 'Shoes', href: '/collections/mens-shoes' },
          { label: 'Outerwear', href: '/collections/mens-outerwear' },
        ]
      }
    ]
  },
  {
    _id: 'navigation-womens',
    label: "Women's Clothing",
    href: '/collections/womens-tshirts',
    order: 2,
    sections: [
      {
        sectionTitle: 'SHOP BY PRODUCT',
        items: [
          { label: 'T-shirts', href: '/collections/womens-tshirts' },
          { label: 'Hoodies', href: '/collections/womens-hoodies' },
          { label: 'Sweatshirts', href: '/collections/womens-sweatshirts' },
          { label: 'Long Sleeves', href: '/collections/womens-long-sleeves' },
          { label: 'Tank Tops', href: '/collections/womens-tank-tops' },
          { label: 'Skirts & Dresses', href: '/collections/womens-skirts-dresses' },
          { label: 'Sportswear', href: '/collections/womens-sportswear' },
          { label: 'Bottoms', href: '/collections/womens-bottoms' },
          { label: 'Swimwear', href: '/collections/womens-swimwear' },
          { label: 'Shoes', href: '/collections/womens-shoes' },
          { label: 'Outerwear', href: '/collections/womens-outerwear' },
        ]
      }
    ]
  },
  {
    _id: 'navigation-his-hers',
    label: 'His & Hers',
    href: '/collections/his-hers',
    order: 3,
    sections: [
      {
        sectionTitle: 'SHOP BY PRODUCT',
        items: [
          { label: 'Matching Sets', href: '/collections/matching-sets' },
          { label: 'Couples T-shirts', href: '/collections/couples-tshirts' },
          { label: 'Hoodies', href: '/collections/his-hers-hoodies' },
          { label: 'Sweatshirts', href: '/collections/his-hers-sweatshirts' },
          { label: 'Bottoms', href: '/collections/his-hers-bottoms' },
          { label: 'Accessories', href: '/collections/his-hers-accessories' },
        ]
      }
    ]
  },
  {
    _id: 'navigation-accessories',
    label: 'Accessories',
    href: '/category/accessories',
    order: 4,
    sections: [
      {
        sectionTitle: 'SHOP BY PRODUCT',
        items: [
          { label: 'Jewelry', href: '/collections/jewelry' },
          { label: 'Phone Cases', href: '/collections/phone-cases' },
          { label: 'Bags', href: '/collections/bags' },
          { label: 'Socks', href: '/collections/socks' },
          { label: 'Hats', href: '/collections/hats' },
          { label: 'Underwear', href: '/collections/underwear' },
          { label: 'Baby Accessories', href: '/collections/baby-accessories' },
          { label: 'Mouse Pads', href: '/collections/mouse-pads' },
        ]
      },
      {
        sectionTitle: 'MORE',
        items: [
          { label: 'Tech Accessories', href: '/collections/tech-accessories' },
          { label: 'Travel Accessories', href: '/collections/travel-accessories' },
          { label: 'Stationery', href: '/collections/stationery' },
          { label: 'Sports & Games', href: '/collections/sports-games' },
          { label: 'Face Masks', href: '/collections/face-masks' },
          { label: 'Kitchen Accessories', href: '/collections/kitchen-accessories' },
          { label: 'Car Accessories', href: '/collections/car-accessories' },
          { label: 'Other', href: '/collections/other-accessories' },
        ]
      }
    ]
  },
  {
    _id: 'navigation-home-living',
    label: 'Home & Living',
    href: '/collections/home-living',
    order: 5,
    sections: [
      {
        sectionTitle: 'SHOP BY PRODUCT',
        items: [
          { label: 'Mugs', href: '/collections/mugs' },
          { label: 'Candles', href: '/collections/candles' },
          { label: 'Posters', href: '/collections/posters' },
          { label: 'Canvas', href: '/collections/canvas' },
          { label: 'Blankets', href: '/collections/blankets' },
          { label: 'Pillows & Covers', href: '/collections/pillows-covers' },
          { label: 'Towels', href: '/collections/towels' },
          { label: 'Journals & Notebooks', href: '/collections/journals-notebooks' },
        ]
      },
      {
        sectionTitle: 'MORE',
        items: [
          { label: 'Home Decor', href: '/collections/home-decor' },
          { label: 'Glassware', href: '/collections/glassware' },
          { label: 'Bottles & Tumblers', href: '/collections/bottles-tumblers' },
          { label: 'Rugs & Mats', href: '/collections/rugs-mats' },
          { label: 'Bedding', href: '/collections/bedding' },
          { label: 'Bathroom', href: '/collections/bathroom' },
          { label: 'Seasonal Decorations', href: '/collections/seasonal-decorations' },
          { label: 'Food - Health - Beauty', href: '/collections/food-health-beauty' },
        ]
      }
    ]
  }
];

async function seedNavigation() {
  console.log(' Starting navigation data seed...\n');

  try {
    // Check if data already exists
    const existing = await client.fetch('*[_type == "navigation"]');
    
    if (existing.length > 0) {
      console.log('⚠️  Navigation documents already exist!');
      console.log(`   Found ${existing.length} existing document(s)\n`);
      
      const response = await new Promise(resolve => {
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        readline.question('Do you want to DELETE existing data and re-seed? (y/N): ', answer => {
          readline.close();
          resolve(answer.toLowerCase().trim());
        });
      });
      
      if (response === 'y' || response === 'yes') {
        console.log('\n🗑️  Deleting existing navigation documents...\n');
        
        // Delete all existing navigation documents
        for (const doc of existing) {
          await client.delete(doc._id);
          console.log(`   Deleted: ${doc._id}`);
        }
        console.log('\n');
      } else {
        console.log('❌ Seed cancelled. Existing data preserved.\n');
        process.exit(0);
      }
    }

    // Create new navigation documents
    console.log('📝 Creating navigation documents...\n');
    
    for (const nav of navigationData) {
      const doc = {
        _type: 'navigation',
        _id: nav._id,
        label: nav.label,
        href: nav.href,
        order: nav.order,
        sections: nav.sections.map(section => ({
          sectionTitle: section.sectionTitle,
          items: section.items.map(item => ({
            label: item.label,
            href: item.href
          }))
        }))
      };

      await client.createIfNotExists(doc);
      console.log(`   ✅ Created: "${nav.label}" (order: ${nav.order})`);
    }

    console.log('\n✅ Navigation data seeded successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Created: ${navigationData.length} navigation documents`);
    console.log(`   - Total sections: ${navigationData.reduce((acc, nav) => acc + nav.sections.length, 0)}`);
    console.log(`   - Total items: ${navigationData.reduce((acc, nav) => 
      acc + nav.sections.reduce((sAcc, s) => sAcc + s.items.length, 0), 0)}`);
    console.log('\n🌐 Visit your Sanity Studio to verify: http://localhost:3333\n');
    
  } catch (error) {
    console.error('\n❌ Error seeding navigation data:\n');
    console.error(error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check that .env.local exists with SANITY_API_WRITE_TOKEN');
    console.error('   2. Verify projectId and dataset in .env.local');
    console.error('   3. Ensure the navigation schema is registered in Sanity\n');
    process.exit(1);
  }
}

// Run the seed function
seedNavigation();
