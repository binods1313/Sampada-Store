# Printify Integration - Code Changes Required

**Date**: May 10, 2026  
**Purpose**: Detailed code changes for Printify integration

---

## 1. Product Detail Page (`pages/product/[slug].js`)

### A. Add Imports (Top of file)
```javascript
import PrintifyBadge from '../../components/PrintifyBadge';
import ProductTabs from '../../components/ProductTabs';
```

### B. Update GROQ Query (in `getServerSideProps`)

Find the existing product query and add these fields:

```javascript
const productQuery = `*[_type == "product" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  image,
  price,
  discount,
  details,
  category->{
    _id,
    name,
    slug
  },
  variants,
  specifications,
  specialty,
  pros,
  cons,
  bestUseCases,
  inventory,
  sizeChart,
  // ADD THESE NEW FIELDS:
  printifyIntegration,
  productTabs,
  availableColors,
  status
}`;
```

### C. Add Printify Badge (After price section, around line 600)

Find this section:
```javascript
{/* Printify/Stripe Trust Badge */}
<div className="ships-via-banner" style={{...}}>
```

Replace or add after it:
```javascript
{/* Printify Badge */}
{product.printifyIntegration?.isPrintifyProduct && (
  <PrintifyBadge 
    printifyIntegration={product.printifyIntegration}
    variant="detailed"
  />
)}
```

### D. Add Product Tabs (After product insights, before reviews, around line 1100)

Find this section:
```javascript
{/* Review System */}
<div style={{ marginTop: '50px', padding: '0 20px' }}>
  <ReviewSystem
```

Add BEFORE it:
```javascript
{/* Product Tabs */}
{product.productTabs && product.productTabs.length > 0 && (
  <div style={{ 
    marginTop: '50px', 
    padding: '0 20px',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto'
  }}>
    <ProductTabs tabs={product.productTabs} />
  </div>
)}
```

---

## 2. Collections Page (`pages/collections/[slug].js`)

### A. Update GROQ Query

Add `printifyIntegration` to product fields:

```javascript
const collectionQuery = `*[_type == "category" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  description,
  image,
  "products": *[_type == "product" && references(^._id) && status == "active"]{
    _id,
    name,
    slug,
    image,
    price,
    discount,
    category,
    printifyIntegration  // ADD THIS
  }
}`;
```

### B. Fetch Banner Data for Quotes

Add to `getServerSideProps`:

```javascript
const bannerQuery = `*[_type == "banner"][0]{
  collectionQuote
}`;

const banner = await client.fetch(bannerQuery);
```

### C. Add Collection Quote (In JSX, after hero section)

```javascript
{/* Collection Quote */}
{banner?.collectionQuote && (
  <div style={{
    textAlign: 'center',
    padding: '40px 20px',
    background: 'var(--s-cream)',
    borderBottom: '1px solid rgba(139,26,26,0.1)'
  }}>
    <p style={{
      fontFamily: 'var(--s-serif)',
      fontSize: '1.5rem',
      fontStyle: 'italic',
      color: 'var(--s-crimson)',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      "{getCollectionQuote(collection.name, banner.collectionQuote)}"
    </p>
  </div>
)}
```

### D. Add Helper Function

```javascript
const getCollectionQuote = (collectionName, quotes) => {
  const name = collectionName.toLowerCase();
  if (name.includes('men') && !name.includes('women')) {
    return quotes.mensQuote || 'Crafted for You, Printed to Perfection.';
  }
  if (name.includes('women')) {
    return quotes.womensQuote || 'Crafted for You, Printed to Perfection.';
  }
  if (name.includes('his') || name.includes('hers')) {
    return quotes.hisHersQuote || 'Crafted for You, Printed to Perfection.';
  }
  return 'Crafted for You, Printed to Perfection.';
};
```

### E. Add Printify Badge to Product Cards

In the product card rendering:

```javascript
{product.printifyIntegration?.isPrintifyProduct && (
  <PrintifyBadge 
    printifyIntegration={product.printifyIntegration}
    variant="inline"
  />
)}
```

---

## 3. Support Page (`pages/support.js`)

### A. Fetch Banner Data

Add to `getStaticProps`:

```javascript
const bannerQuery = `*[_type == "banner"][0]{
  collectionQuote
}`;

const banner = await client.fetch(bannerQuery);
```

### B. Add Support Quote (After hero section)

```javascript
{/* Support Quote */}
{banner?.collectionQuote?.supportQuote && (
  <section className="section-light s-section">
    <div className="s-container" style={{ textAlign: 'center', maxWidth: '700px' }}>
      <p style={{
        fontFamily: 'var(--s-serif)',
        fontSize: '1.8rem',
        fontStyle: 'italic',
        color: 'var(--s-crimson)',
        lineHeight: '1.4'
      }}>
        "{banner.collectionQuote.supportQuote}"
      </p>
    </div>
  </section>
)}
```

### C. Add Printify Shipping/Returns Section

Add new section before final CTA:

```javascript
{/* Printify Fulfillment Information */}
<section className="section-light s-section">
  <div className="s-container">
    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
      <p className="s-label">FULFILLMENT</p>
      <h2 className="s-heading">Print-on-Demand Products</h2>
      <span className="s-bar" />
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      {/* Shipping */}
      <div className="s-card">
        <div className="s-card-icon">🚚</div>
        <h3 className="s-card-title">Shipping Times</h3>
        <p className="s-card-body">
          Print-on-demand products are made to order. Standard shipping: 5-7 business days for production + 3-5 days for delivery.
        </p>
      </div>

      {/* Returns */}
      <div className="s-card">
        <div className="s-card-icon">↩️</div>
        <h3 className="s-card-title">Returns Policy</h3>
        <p className="s-card-body">
          We accept returns within 30 days for defective or damaged items. Custom printed products cannot be returned unless defective.
        </p>
      </div>

      {/* Quality */}
      <div className="s-card">
        <div className="s-card-icon">✨</div>
        <h3 className="s-card-title">Quality Guarantee</h3>
        <p className="s-card-body">
          Every product is inspected before shipping. We partner with premium print providers to ensure the highest quality.
        </p>
      </div>
    </div>
  </div>
</section>
```

---

## 4. Stories Page (`pages/stories/index.js`)

### A. Fetch Banner Data

Add to `getStaticProps`:

```javascript
const bannerQuery = `*[_type == "banner"][0]{
  collectionQuote
}`;

const banner = await client.fetch(bannerQuery);
```

### B. Add Stories Quote (After hero section)

```javascript
{/* Stories Quote */}
{banner?.collectionQuote?.storiesQuote && (
  <section className="section-light s-section">
    <div className="s-container" style={{ textAlign: 'center', maxWidth: '800px' }}>
      <p style={{
        fontFamily: 'var(--s-serif)',
        fontSize: '1.8rem',
        fontStyle: 'italic',
        color: 'var(--s-crimson)',
        lineHeight: '1.4'
      }}>
        "{banner.collectionQuote.storiesQuote}"
      </p>
    </div>
  </section>
)}
```

### C. Ensure Alt Text for All Images

Find all `<Image>` components and ensure they have proper alt text:

```javascript
<Image
  src={imageUrl}
  alt={story.title || 'Sampada story image'}
  width={600}
  height={400}
/>
```

---

## 5. Company Page (`pages/company.js`)

### A. Ensure Alt Text for All Images

Review all images and add descriptive alt text:

```javascript
<Image
  src={imageUrl}
  alt="Sampada company mission and values"
  width={800}
  height={600}
/>
```

### B. Add ARIA Labels

Ensure all interactive elements have proper ARIA labels:

```javascript
<button
  aria-label="Learn more about our company"
  onClick={handleClick}
>
  Learn More
</button>
```

---

## 6. API Endpoint for Printify Sync

Create new file: `pages/api/printify/sync-product.js`

```javascript
// pages/api/printify/sync-product.js
import { printifyAPI } from '../../../lib/printifyClient';
import { writeClient } from '../../../lib/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { printifyProductId, sanityProductId } = req.body;
    const shopId = process.env.PRINTIFY_SHOP_ID;

    // Fetch product from Printify
    const printifyProduct = await printifyAPI.getProduct(shopId, printifyProductId);

    // Sync data to Sanity format
    const syncedData = printifyAPI.syncProductData(printifyProduct);

    // Update Sanity product
    await writeClient
      .patch(sanityProductId)
      .set({ printifyIntegration: { ...syncedData, isPrintifyProduct: true } })
      .commit();

    res.status(200).json({ 
      success: true, 
      message: 'Product synced successfully',
      data: syncedData
    });
  } catch (error) {
    console.error('Printify sync error:', error);
    res.status(500).json({ 
      error: 'Failed to sync product',
      details: error.message
    });
  }
}
```

---

## 7. Sanity Studio Plugin Verification

### A. Check `sanity_abscommerce/sanity.config.js`

Ensure these plugins are configured:

```javascript
import { recursiveHierarchy } from 'sanity-plugin-recursive-hierarchy'
import { colorInput } from 'sanity-plugin-color-input'

export default defineConfig({
  // ... other config
  plugins: [
    // ... other plugins
    recursiveHierarchy({
      documentType: 'category',
      titleField: 'name',
      childrenField: 'children',
      parentField: 'parent',
      enableDragDrop: true,
      showChildCount: true,
    }),
    colorInput(),
  ],
})
```

### B. Test in Sanity Studio

1. Run `cd sanity_abscommerce && npm run dev`
2. Open http://localhost:3333
3. Create a new product
4. Verify:
   - Printify tab is visible
   - Product Tabs tab is visible
   - Color picker works
   - Category hierarchy works

---

## 8. Testing Checklist

### Frontend Testing
- [ ] Printify badge renders on product pages
- [ ] Product tabs render and switch correctly
- [ ] Collection quotes display correctly
- [ ] Support page shows Printify policies
- [ ] Stories page shows quote
- [ ] All images have alt text
- [ ] Responsive design works on mobile

### Sanity Studio Testing
- [ ] Printify fields are editable
- [ ] Product tabs can be created
- [ ] Color picker works
- [ ] Category hierarchy drag-and-drop works
- [ ] All plugins visible

### API Testing
- [ ] Printify sync endpoint works
- [ ] Product data syncs correctly
- [ ] Error handling works

### Accessibility Testing
- [ ] Run Lighthouse audit
- [ ] Test with screen reader
- [ ] Check keyboard navigation
- [ ] Verify WCAG 2.2 AA compliance

---

## 9. Environment Variables

Ensure these are set in `.env`:

```bash
# Printify
PRINTIFY_API_KEY="your_printify_api_key"
PRINTIFY_SHOP_ID="your_printify_shop_id"

# Sanity (should already be set)
NEXT_PUBLIC_SANITY_PROJECT_ID="7lh35oho"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your_sanity_write_token"
```

---

## 10. Deployment Steps

1. **Test Locally**
   ```bash
   npm run dev
   cd sanity_abscommerce && npm run dev
   ```

2. **Build and Test**
   ```bash
   npm run build
   npm start
   ```

3. **Deploy Sanity Studio**
   ```bash
   cd sanity_abscommerce
   npm run build
   npm run deploy
   ```

4. **Deploy Next.js App**
   ```bash
   # Deploy to your hosting platform
   # (Vercel, Google Cloud Run, etc.)
   ```

---

**Status**: Ready for implementation  
**Last Updated**: May 10, 2026
