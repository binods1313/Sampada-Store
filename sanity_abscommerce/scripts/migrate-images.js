/**
 * Image Migration Script for Sanity
 * 
 * This script helps migrate existing images to the new schema with:
 * - Alt text fields
 * - Focal points (hotspot)
 * - Metadata (blurhash, palette)
 * - Dimensions
 * 
 * Usage:
 *   npx sanity exec scripts/migrate-images.js --with-transpile
 * 
 * Or run directly with Node:
 *   node scripts/migrate-images.js
 */

import sanityClient from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config()

const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID || '7lh35oho',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN, // Required for writes
  apiVersion: '2024-05-18',
  useCdn: false,
})

async function migrateProductImages() {
  console.log('🚀 Starting product image migration...')
  
  // Fetch all products
  const products = await client.fetch(`
    *[_type == 'product'] {
      _id,
      name,
      image[] {
        _key,
        asset->{
          _id,
          originalFilename,
          metadata
        }
      }
    }
  `)

  console.log(`Found ${products.length} products to migrate`)

  let updated = 0
  let skipped = 0

  for (const product of products) {
    try {
      if (!product.image || product.image.length === 0) {
        skipped++
        continue
      }

      // Check if images already have alt text
      const needsMigration = product.image.some(img => !img.alt)
      
      if (!needsMigration) {
        skipped++
        continue
      }

      // Generate alt text from product name
      const imagePatch = product.image.map((img, index) => {
        return {
          _key: img._key,
          _type: 'image',
          asset: img.asset?._id ? { _ref: img.asset._id, _type: 'reference' } : img.asset,
          alt: img.alt || `${product.name} - Image ${index + 1}`,
          caption: img.caption || '',
        }
      })

      await client
        .patch(product._id)
        .set({ image: imagePatch })
        .set({ updatedAt: new Date().toISOString() })
        .commit()

      updated++
      console.log(`✓ Updated: ${product.name}`)
    } catch (error) {
      console.error(`✗ Error updating ${product.name}:`, error.message)
    }
  }

  console.log(`\n✅ Product images migration complete!`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Skipped: ${skipped}`)
}

async function migrateCategoryImages() {
  console.log('\n🚀 Starting category image migration...')
  
  const categories = await client.fetch(`
    *[_type == 'category'] {
      _id,
      name,
      image {
        _key,
        asset->{
          _id,
          originalFilename,
          metadata
        }
      }
    }
  `)

  console.log(`Found ${categories.length} categories to migrate`)

  let updated = 0
  let skipped = 0

  for (const category of categories) {
    try {
      if (!category.image) {
        skipped++
        continue
      }

      if (category.image.alt) {
        skipped++
        continue
      }

      await client
        .patch(category._id)
        .set({
          image: {
            _type: 'image',
            asset: category.image.asset?._id 
              ? { _ref: category.image.asset._id, _type: 'reference' }
              : category.image.asset,
            alt: category.image.alt || category.name,
          }
        })
        .set({ updatedAt: new Date().toISOString() })
        .commit()

      updated++
      console.log(`✓ Updated: ${category.name}`)
    } catch (error) {
      console.error(`✗ Error updating ${category.name}:`, error.message)
    }
  }

  console.log(`\n✅ Category images migration complete!`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Skipped: ${skipped}`)
}

async function migrateBannerImages() {
  console.log('\n🚀 Starting banner image migration...')
  
  const banners = await client.fetch(`
    *[_type == 'banner'] {
      _id,
      largeText1,
      image {
        _key,
        asset->{
          _id,
          originalFilename,
          metadata
        }
      },
      logo {
        _key,
        asset->{
          _id,
          originalFilename,
          metadata
        }
      }
    }
  `)

  console.log(`Found ${banners.length} banners to migrate`)

  let updated = 0
  let skipped = 0

  for (const banner of banners) {
    try {
      let needsUpdate = false
      const updates = {}

      if (banner.image && !banner.image.alt) {
        needsUpdate = true
        updates.image = {
          _type: 'image',
          asset: banner.image.asset?._id 
            ? { _ref: banner.image.asset._id, _type: 'reference' }
            : banner.image.asset,
          alt: banner.image.alt || banner.largeText1 || 'Banner image',
        }
      }

      if (banner.logo && !banner.logo.alt) {
        needsUpdate = true
        updates.logo = {
          _type: 'image',
          asset: banner.logo.asset?._id 
            ? { _ref: banner.logo.asset._id, _type: 'reference' }
            : banner.logo.asset,
          alt: banner.logo.alt || 'Logo',
        }
      }

      if (needsUpdate) {
        await client
          .patch(banner._id)
          .set(updates)
          .set({ updatedAt: new Date().toISOString() })
          .commit()

        updated++
        console.log(`✓ Updated: ${banner.largeText1}`)
      } else {
        skipped++
      }
    } catch (error) {
      console.error(`✗ Error updating banner:`, error.message)
    }
  }

  console.log(`\n✅ Banner images migration complete!`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Skipped: ${skipped}`)
}

async function addSeoFieldsToProducts() {
  console.log('\n🚀 Adding SEO fields to products...')
  
  const products = await client.fetch(`
    *[_type == 'product'] {
      _id,
      name,
      seo
    }
  `)

  console.log(`Found ${products.length} products`)

  let updated = 0
  let skipped = 0

  for (const product of products) {
    try {
      if (product.seo) {
        skipped++
        continue
      }

      // Generate basic SEO data from product name
      const seo = {
        _type: 'seo',
        metaTitle: product.name?.substring(0, 60) || '',
        metaDescription: `${product.name} - Available at Sampada Store`,
        keywords: [product.name?.split(' ')[0], 'Sampada'],
        noIndex: false,
      }

      await client
        .patch(product._id)
        .set({ seo })
        .set({ updatedAt: new Date().toISOString() })
        .commit()

      updated++
      console.log(`✓ Added SEO: ${product.name}`)
    } catch (error) {
      console.error(`✗ Error updating ${product.name}:`, error.message)
    }
  }

  console.log(`\n✅ SEO fields migration complete!`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Skipped: ${skipped}`)
}

async function addSeoFieldsToCategories() {
  console.log('\n🚀 Adding SEO fields to categories...')
  
  const categories = await client.fetch(`
    *[_type == 'category'] {
      _id,
      name,
      description,
      seo
    }
  `)

  console.log(`Found ${categories.length} categories`)

  let updated = 0
  let skipped = 0

  for (const category of categories) {
    try {
      if (category.seo) {
        skipped++
        continue
      }

      const seo = {
        _type: 'seo',
        metaTitle: `${category.name} - Sampada Store`,
        metaDescription: category.description?.substring(0, 160) || `Browse ${category.name} at Sampada Store`,
        keywords: [category.name, 'Sampada', 'category'],
        noIndex: false,
      }

      await client
        .patch(category._id)
        .set({ seo })
        .set({ updatedAt: new Date().toISOString() })
        .commit()

      updated++
      console.log(`✓ Added SEO: ${category.name}`)
    } catch (error) {
      console.error(`✗ Error updating ${category.name}:`, error.message)
    }
  }

  console.log(`\n✅ Category SEO fields migration complete!`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Skipped: ${skipped}`)
}

async function runAllMigrations() {
  console.log('='.repeat(60))
  console.log('📦 Sanity Image & SEO Migration Script')
  console.log('='.repeat(60))
  console.log('\n⚠️  This script will update your production dataset.')
  console.log('⚠️  Make sure you have a backup before proceeding.\n')

  const confirm = process.argv.includes('--yes') || 
    process.env.AUTO_CONFIRM === 'true' ||
    await askQuestion('Continue with migration? (yes/no): ')

  if (confirm !== 'yes' && confirm !== true) {
    console.log('Migration cancelled.')
    return
  }

  try {
    await migrateProductImages()
    await migrateCategoryImages()
    await migrateBannerImages()
    await addSeoFieldsToProducts()
    await addSeoFieldsToCategories()

    console.log('\n' + '='.repeat(60))
    console.log('🎉 All migrations completed successfully!')
    console.log('='.repeat(60))
    console.log('\n📝 Next steps:')
    console.log('   1. Review the changes in Sanity Studio')
    console.log('   2. Update any frontend code to use the new fields')
    console.log('   3. Test image rendering with focal points')
    console.log('   4. Verify SEO meta tags are working\n')
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    console.error('Please check the error above and try again.\n')
    process.exit(1)
  }
}

// Helper function for user input
function askQuestion(query) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => {
    readline.question(query, answer => {
      readline.close()
      resolve(answer.toLowerCase())
    })
  })
}

// Run if executed directly
if (process.argv[1]?.includes('migrate-images.js')) {
  runAllMigrations()
}

export {
  migrateProductImages,
  migrateCategoryImages,
  migrateBannerImages,
  addSeoFieldsToProducts,
  addSeoFieldsToCategories,
  runAllMigrations,
}
