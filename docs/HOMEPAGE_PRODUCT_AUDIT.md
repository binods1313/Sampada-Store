# Homepage & Product Detail Page Audit Report

**Audit Date:** 2026-04-06  
**Auditor:** AI Codebase Analyst  
**Scope:** Homepage (`pages/index.js`), Product Detail Page (`pages/product/[slug].js`), Sanity Integration, Styles

---

## Executive Summary

The Sampada Store is a Next.js e-commerce application backed by Sanity CMS with a premium brand identity (Deep Red `#8B1A1A`, Gold `#C9A84C`). The homepage follows a traditional landing page structure with hero banner, collections, featured products, promo banner, newsletter, and footer. The product detail page is a comprehensive 1,259-line component with variant selection, reviews, related products, and recommendations.

**Key Findings:**
- **Strengths:** Rich Sanity schema with variants, strong brand styling system, good use of Next.js Image optimization, well-structured GROQ queries
- **Critical Issues:** Inline styles everywhere (1,200+ lines in product page), duplicate navbar components (HomeNavbar vs MegaNavbar), console.log statements in production, hardcoded review data
- **Major Gaps:** No server-side footer data fetching on homepage, missing Sanity schema for reviews, no structured data/JSON-LD for SEO, accessibility issues with inline styles
- **Performance Concerns:** `useCdn: false` in Sanity client, no image lazy loading on hero, massive product detail page bundle

---

## 1. Homepage Current State Analysis

### 1.1 Page Structure (`pages/index.js`)

**Layout Pattern:** Vertical stacked sections with no container wrapper

```
SampadaNavbar → HomeHeroBanner → CollectionsSection → WhySampada → 
ProductFilterSection → PromoBanner → NewsletterSection → SampadaFooter
```

**GROQ Queries Used:**

```javascript
// Products - fetches 24 most recent products
*[_type == "product"] {
  _id, _createdAt, name, slug, image, price, discount, details,
  category->{ _id, name, slug },
  inventory, status
} | order(_createdAt desc)[0...24]

// Banner - single banner document
*[_type == "banner"][0]{
  _id, image, logo, buttonText, product, desc, smallText, midText,
  largeText1, largeText2, discount, saleTime
}

// Categories - all categories
*[_type == "category"] { _id, name, slug }
```

**Data Flow:**
- Uses `getServerSideProps` (SSR on every request)
- Three parallel queries via `Promise.all`
- Falls back to empty arrays/objects on error
- Wraps content in `SessionProvider > UIProvider > CartProvider`

**Issues:**
- No footer data fetched server-side (footer must fetch client-side)
- Products query fetches ALL fields for 24 products — no filtering by status
- Missing `status == "active"` filter means draft/archived products may appear
- Debug `console.log` statements left in production code (lines ~100-105)

### 1.2 Navbar Components

**Two competing navbar implementations exist:**

| Component | File | Style Approach | Features |
|-----------|------|---------------|----------|
| `HomeNavbar` | `components/HomePage/HomeNavbar.jsx` | CSS Modules (`HomeNavbar.module.css`) | Mobile menu, login modal, cart integration |
| `MegaNavbar` | `components/HomePage/MegaNavbar.jsx` | **All inline styles** | Mega dropdowns, mobile drawer, hardcoded menu |

**HomeNavbar (`components/HomePage/HomeNavbar.jsx`):**
- Uses CSS modules — good practice
- 7 hardcoded nav links
- Mobile hamburger menu with slide-down
- Login modal integration
- Cart badge with quantity
- **Not currently used** (homepage imports `SampadaNavbar` not `HomeNavbar`)

**MegaNavbar (`components/HomePage/MegaNavbar.jsx`):**
- 500+ lines, entirely inline styles
- Hardcoded `menuItems` object with 5 categories
- Dropdown menus on hover with sectioned links
- Mobile full-screen drawer
- `MoreDropdown` component with "About Us" and "Contact"
- Uses `use client` directive but in Pages Router (unnecessary)
- Sign In links to `/api/auth/signin` directly (no session check)

**Critical Issue:** The homepage imports `SampadaNavbar` (not found in file list — may be missing or aliased). Both `HomeNavbar.jsx` and `MegaNavbar.jsx` exist but it's unclear which is active.

### 1.3 Hero Banner (`components/HomePage/HomeHeroBanner.jsx`)

**Layout:** Two-column flex layout (text left, image right)

```jsx
<section className={styles.hero}>
  <div className={styles.announcementBar}>  {/* Desc ticker */}
  <div className={styles.heroInner}>          {/* Flex row */}
    <div className={styles.heroText}>         {/* Left column */}
    <div className={styles.imageWrapper}>     {/* Right column */}
  <Link> <button className="shop-now-btn">   {/* CTA button */}
</section>
```

**Sanity Data Used:**
- `heroBanner.image` → displayed via `urlFor(image).width(500).height(500)`
- `heroBanner.product` → slug for CTA link
- `heroBanner.midText` → alt text fallback
- `heroBanner.desc` → announcement bar text

**Issues:**
- `priority` prop on Image — blocks LCP if image is large
- No `sizes` attribute — Next.js can't optimize responsive loading
- No responsive breakpoints — same 400x400 on mobile and desktop
- Fallback "No image set" placeholder is unstyled
- CTA defaults to `/collections/mens-tshirts` when no product set
- Hardcoded "Winter Drop 2026" text not from Sanity

### 1.4 Collections Section (`components/HomePage/CollectionsSection.jsx`)

**Layout:** Grid of 4 collection cards (Men, Women, His & Hers, Home & Living)

```jsx
<section className={styles.section}>
  <h2>Explore Our Collections</h2>
  <div className={styles.grid}>  {/* CSS Grid */}
    {collections.map(col => (
      <Link href={col.href}>
        <article className={styles.card}>
          <div className={styles.cardImageContainer}>
            <img src={col.image} loading="lazy" />
            <div className={styles.cardOverlay} />
          </div>
          <div className={styles.cardContent}>
            <h3>{col.label}</h3>
            <button>{col.btnText}</button>
          </div>
        </article>
      </Link>
    ))}
  </div>
</section>
```

**Data Source:** **Hardcoded** — no Sanity fetch. Images from `/images/collections/*.png`

**Issues:**
- Collections not managed in Sanity — requires code deploy to change
- Uses plain `<img>` instead of `next/image` — no optimization
- Has `objectPosition` inline styles — should be in CSS
- `loading="lazy"` is good but no `width`/`height` attributes causes CLS
- No `sizes` attribute for responsive images

### 1.5 Featured Products Section (`components/HomePage/FeaturedProductsSection.jsx`)

**Layout:** Grid of up to 12 `Product` components

```jsx
<section className={styles.section}>
  <h2>Featured Products</h2>
  <p>🌟 Sampada Originals™ ...</p>
  <div className={styles.grid}>
    {displayProducts.map(product => (
      <Product key={product._id} product={product} />
    ))}
  </div>
</section>
```

**Issues:**
- Slices first 24 → 12 products with no sorting/filtering logic
- Uses `Product` component (older) not `ProductCard` (newer, more features)
- No "View All" link to collection page
- Emoji in subheading not accessible to screen readers
- Empty state message "Products are loading from our store…" is vague

### 1.6 Promo Banner (`components/HomePage/PromoBanner.jsx`)

**Layout:** Three-column flex (tagline left, rotating logo center, CTA right)

```jsx
<section className={styles.banner}>
  <div className={styles.inner}>  {/* Flex row */}
    <div className={styles.left}>   {/* Tagline + dates */}
    <div className={styles.center}> {/* Rotating logo/emblem */}
    <div className={styles.right}>  {/* Product info + CTA */}
  </div>
</section>
```

**Sanity Data Used:**
- `bannerData.logo` → displayed via `urlFor(logoImage).width(200).height(200)`
- Falls back to inline SVG emblem (Star of David design)

**Issues:**
- Multiple `console.log` debug statements (lines 17-21)
- Hardcoded date "31 Feb to 31 Mar 2026" (Feb 31 doesn't exist!)
- Hardcoded "WEAR YOUR LEGACY PROSPER IN STYLE" text
- Rotation animation on logo not defined in visible CSS
- SVG emblem is 50+ lines of inline SVG in JSX

### 1.7 Footer (`components/HomePage/SampadaFooter.jsx`)

**Layout:** Multi-column grid (brand + social, product links, company links, support links, legal row)

**Data Source:** Has `getFooterData()` function that fetches from Sanity, but **it's not called** in `pages/index.js`. The footer receives no `footerData` prop and falls back to `get_default_footer_data()`.

**Issues:**
- `getFooterData()` is defined but never invoked on homepage
- Footer always uses hardcoded default data
- Links to unpublished pages (`/blog`, `/careers`, `/features`, `/pricing`)
- Social links default to placeholder URLs (`https://instagram.com`)
- No `footerData` passed from `getServerSideProps`

---

## 2. Product Detail Page Current State Analysis

### 2.1 Page Structure (`pages/product/[slug].js` — 1,259 lines)

```
ProductDetails Component (1,259 lines)
├── Head (SEO meta)
├── Product Detail Container (flex wrap, 2-column)
│   ├── Left: Image Gallery
│   │   ├── Main Image (Next/Image, 600px)
│   │   └── Thumbnails (color swatches or image thumbnails)
│   └── Right: Product Info
│       ├── Title + Reviews summary
│       ├── Details text
│       ├── Price (with discount badge)
│       ├── Trust badge (Printify/Stripe)
│       ├── Color Selection
│       ├── Size Selection
│       ├── Size Chart button
│       ├── Stock status
│       ├── Quantity controls
│       ├── Add to Cart / Buy Now buttons
│       ├── Wishlist button
│       ├── Specifications table
│       └── Product Insights (Specialty, Pros, Cons, Use Cases)
├── ReviewSystem (with empty reviews array)
├── RelatedProductsCarousel
├── ProductRecommendations (client-side fetch)
└── Size Chart Modal
```

**GROQ Queries:**

```javascript
// Current product
*[_type == "product" && slug.current == '${slug}'][0]{
  _id, name, details, price, discount, inventory,
  image[]{ _key, asset->{_id, url} },
  specialty, pros, cons, bestUseCases,
  category->{ _id, _ref, name, "slug": slug.current },
  "variants": variants[]{
    _key, colorName, colorHex, size, variantPrice, variantDiscount,
    variantStock, variantImage{ _key, asset->{_id, url} }
  },
  sizeChart{ _key, asset->{_id, url} },
  specifications[]{ _key, feature, value }
}

// All products (for related products)
*[_type == "product" && defined(slug.current)]{
  _id, name, slug, price, discount,
  image[]{ _key, asset->{_id, url} },
  category
}
```

**Data Flow:**
- Uses `getStaticProps` with `fallback: 'blocking'` — good for SSG
- Revalidates every 60 seconds
- Related products: same category first, fill with others (max 8)
- ProductRecommendations fetches client-side with separate GROQ query

### 2.2 Critical Issues

**Inline Styles Everywhere:**
- 90%+ of the component uses inline `style={{}}` props
- ~600+ inline style objects scattered across 1,259 lines
- Makes maintenance nearly impossible
- Prevents CSS-based responsive design (media queries can't target inline styles)
- Duplicates classes defined in `sampada-premium-brand.css`

**Hardcoded Reviews:**
```jsx
<ReviewSystem productId={_id} reviews={[]} />
```
- Empty array passed — review system is non-functional
- No GROQ query to fetch reviews
- No `review` schema exists in Sanity

**Component Size:**
- 1,259 lines in a single file
- Contains: data fetching, rendering, handlers, variant logic, 4 render functions, modals
- Violates single responsibility principle
- Should be split into 5-8 smaller components

**Duplicate Code:**
- Color selection rendered TWICE (thumbnail area + variant section)
- `uniqueColors` calculated multiple times
- Size sorting logic duplicated in 3 places
- Stock status display duplicated for variants vs non-variants

### 2.3 Performance Concerns

| Issue | Location | Impact |
|-------|----------|--------|
| `useCdn: false` | `lib/client.js` | Every Sanity request hits API directly — slower + higher quota usage |
| All products fetched | `getStaticProps` | Fetches ALL products for related section — unbounded growth |
| No image priority on main image | Product page | LCP delay on product images |
| Client-side recommendations | `ProductRecommendations.jsx` | Additional fetch after page load — content shift |
| RequestAnimationFrame carousel | `RelatedProductsCarousel.jsx` | Continuous JS execution — battery drain on mobile |
| No memoization | ProductDetails | Re-renders on every state change |

### 2.4 Accessibility Issues

| Issue | Location | Severity |
|-------|----------|----------|
| Color swatches use `div` not `button` | Color selector | High — not keyboard accessible |
| No `aria-label` on thumbnail images | Image gallery | Medium |
| Star ratings hardcoded (always 4 stars) | Reviews section | Medium — misleading |
| `role="img"` on SVG without proper labeling | PromoBanner | Low |
| Size chart modal missing focus trap | Modal | High — trap keyboard users |
| No skip navigation link | Product page | Medium |
| Inline styles override focus outlines | Throughout | High |

### 2.5 What's Working Well

- **Variant system:** Comprehensive color/size/price/stock per variant
- **Next/Image usage:** Proper `urlFor` integration with fallbacks
- **Error handling:** `onError` handlers on all images
- **Trust signals:** Printify/Stripe badge, stock status, discount badges
- **SSG with revalidation:** `getStaticProps` with 60s revalidate
- **Related products logic:** Same category priority with fallback
- **Brand consistency:** Deep Red + Gold color scheme throughout

---

## 3. Sanity Schema Inventory

### 3.1 All Schemas (`sanity_abscommerce/schemaTypes/`)

| Schema | File | Purpose | Key Fields |
|--------|------|---------|------------|
| `product` | `product.js` | Product catalog | name, slug, image[], price, discount, variants[], specifications[], category, details, specialty, pros, cons, bestUseCases, sizeChart, inventory, status, printifyIntegration, seoFields |
| `category` | `category.js` | Product categories | name, slug, description, image, seoFields |
| `banner` | `banner.js` | Hero/promo banners | image, logo, buttonText, product, desc, largeText1, largeText2, discount, saleTime, seo |
| `footerSettings` | `footerSettings.js` | Footer configuration | brandName, brandTagline, socialLinks[], productLinks[], companyLinks[], supportLinks[], legalLinks[], copyrightText, poweredByText |
| `navigation` | `navigation.js` | Nav menu items | label, href, order, sections[] |
| `aboutUs` | `aboutUs.js` | About page content | title, heroTitle, heroDescription, heroImage, missionTitle, teamMembers[], storyContent[], stats[], seo |
| `company` | `company.js` | Company page | title, heroImage, companyInfo{}, values[], partners[], seo |
| `support` | `support.js` | Support page | title, heroImage, contactMethods[], faqs[], supportHours{}, helpfulResources[], seo |
| `team` | `team.js` | Team page | (not read) |
| `storiesPage` | `storiesPage.js` | Blog/stories page | (not read) |
| `contactPage` | `contactPage.js` | Contact page | (not read) |
| `contactMessage` | `contactMessage.js` | Contact form submissions | (not read) |
| `order` | `order.js` | Order management | (not read) |
| `user` | `user.js` | User management | (not read) |
| `blockContent` | `blockContent.js` | Rich text blocks | (not read) |
| `newsletterSubscriber` | `newsletterSubscriber.js` | Newsletter signups | (not read) |
| `seoFields` | `seoFields.js` | Reusable SEO fields | metaTitle, metaDescription (reused across schemas) |

### 3.2 Missing Schemas

| Missing Schema | Impact | Priority |
|---------------|--------|----------|
| `review` | Reviews are hardcoded — no CMS management | P0 |
| `collection` | Collections hardcoded in component | P1 |
| `trustStrip` | "Why Sampada" content not in Sanity | P2 |
| `newsletter` | Newsletter section not CMS-driven | P2 |
| `testimonial` | No customer testimonials schema | P2 |

### 3.3 Product Schema Strengths

- **Variants system:** Each variant has colorName, colorHex, size, variantPrice, variantDiscount, variantStock, variantImage
- **Specifications:** Flexible key-value pairs for technical details
- **SEO fields:** Reusable `seoFields` spread into product schema
- **Printify integration:** Optional fields for print-on-demand
- **Status management:** draft/active/archived with radio buttons
- **Size chart:** Dedicated image field per product

---

## 4. Issues by Priority

### P0 — Critical (Fix Immediately)

| # | Issue | Files | Impact | Fix Approach |
|---|-------|-------|--------|-------------|
| 1 | **Footer data not fetched** | `pages/index.js`, `SampadaFooter.jsx` | Footer always shows hardcoded defaults | Add `getFooterData()` call to `getServerSideProps` |
| 2 | **No status filter on products** | `pages/index.js` line 58 | Draft/archived products visible on homepage | Add `status == "active"` to GROQ query |
| 3 | **Console.log in production** | `pages/index.js`, `PromoBanner.jsx` | Leaks debug info, performance hit | Remove all `console.log` statements |
| 4 | **Reviews completely non-functional** | `[slug].js` line 876 | Empty review system displayed | Create review schema + GROQ query |
| 5 | **Product page 1,259 lines** | `[slug].js` | Unmaintainable, slow builds | Split into 5-8 components |
| 6 | **useCdn disabled** | `lib/client.js` line 21 | Slow API calls, high quota usage | Enable `useCdn: true` for production |

### P1 — Important (Fix Soon)

| # | Issue | Files | Impact | Fix Approach |
|---|-------|-------|--------|-------------|
| 7 | **Duplicate navbar components** | `HomeNavbar.jsx`, `MegaNavbar.jsx` | Confusion, maintenance burden | Consolidate into single component |
| 8 | **Inline styles everywhere** | `[slug].js`, `MegaNavbar.jsx` | No responsive design, hard to maintain | Migrate to CSS modules or Tailwind |
| 9 | **Collections hardcoded** | `CollectionsSection.jsx` | Code deploy needed to change collections | Create Sanity `collection` schema |
| 10 | **Color swatches not keyboard accessible** | `[slug].js` lines 576-620 | WCAG violation | Use `<button>` elements with proper ARIA |
| 11 | **All products fetched for related** | `[slug].js` line 1215 | Unbounded data growth | Limit query + use GROQ filtering |
| 12 | **No structured data (JSON-LD)** | `[slug].js`, `index.js` | Poor SEO for products | Add Product schema markup |
| 13 | **Hardcoded dates in PromoBanner** | `PromoBanner.jsx` line 54 | "31 Feb" doesn't exist | Make dates configurable via Sanity |
| 14 | **RequestAnimationFrame carousel** | `RelatedProductsCarousel.jsx` | Battery drain, no pause respect | Use CSS animation or IntersectionObserver |
| 15 | **No image sizes attribute** | `HomeHeroBanner.jsx` | Suboptimal responsive loading | Add `sizes` prop to all Next/Image |

### P2 — Nice to Have

| # | Issue | Files | Impact | Fix Approach |
|---|-------|-------|--------|-------------|
| 16 | **Missing schema for reviews** | Sanity schemas | Cannot manage reviews in CMS | Create `review` schema |
| 17 | **No skeleton loading on product page** | `[slug].js` | Flash of content during SSG revalidation | Add loading skeletons |
| 18 | **No breadcrumb navigation** | `[slug].js` | Poor UX for navigation | Add breadcrumb component |
| 19 | **Missing `sizes` on Next/Image** | Multiple components | Suboptimal image loading | Audit and add `sizes` everywhere |
| 20 | **No image blur placeholders** | `HomeHeroBanner.jsx`, `CollectionsSection.jsx` | Visual jank on load | Use Sanity blurhash metadata |
| 21 | **Duplicate color selection UI** | `[slug].js` | Confusing UX | Consolidate to single selector |
| 22 | **No error boundary** | `[slug].js` | Whole page crashes on error | Add React error boundary |
| 23 | **Missing Open Graph meta** | `[slug].js` Head | Poor social sharing | Add og:title, og:image, og:description |
| 24 | **Hardcoded "Winter Drop 2026"** | `HomeHeroBanner.jsx` | Requires code change to update | Move to Sanity banner schema |

---

## 5. Specific Recommendations by Section

### 5.1 Homepage (`pages/index.js`)

**Add footer data to getServerSideProps:**
```javascript
// Import in pages/index.js
import { getFooterData } from '../components/HomePage/SampadaFooter';

// Add to Promise.all in getServerSideProps:
const [products, bannerData, categories, footerData] = await Promise.all([
  client.fetch(productQuery),
  client.fetch(bannerQuery),
  client.fetch(categoriesQuery),
  getFooterData(),
]);

// Add to props return:
return { props: { products, categories, bannerData, footerData } };
```

**Fix products GROQ query:**
```groq
*[_type == "product" && status == "active"] {
  _id, _createdAt, name, slug, image, price, discount, details,
  category->{ _id, name, slug },
  inventory, status
} | order(_createdAt desc)[0...24]
```

### 5.2 Hero Banner (`HomeHeroBanner.jsx`)

**Add responsive image sizing:**
```jsx
<Image
  src={imageUrl}
  alt={heroBanner?.midText || 'Sampada banner'}
  width={400}
  height={400}
  sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 500px"
  priority
/>
```

**Move hardcoded text to Sanity:**
- "Winter Drop 2026" → add `heroBanner.season` field
- "WEAR YOUR LEGACY" → add `heroBanner.headline1`, `headline2`, `headline3`

### 5.3 Collections Section (`CollectionsSection.jsx`)

**Create Sanity collection schema:**
```javascript
// sanity_abscommerce/schemaTypes/collection.js
{
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug' },
    { name: 'image', title: 'Image', type: 'image' },
    { name: 'ctaText', title: 'CTA Button Text', type: 'string' },
    { name: 'order', title: 'Display Order', type: 'number' },
  ]
}
```

**Replace hardcoded array with GROQ query in homepage:**
```groq
*[_type == "collection"] | order(order asc) {
  name, slug, image, ctaText
}
```

### 5.4 Product Detail Page (`[slug].js`)

**Split into components:**
```
pages/product/[slug].js          (data fetching + layout — ~150 lines)
components/ProductDetail/
├── ProductGallery.jsx           (main image + thumbnails — ~200 lines)
├── ProductInfo.jsx              (title, price, details — ~100 lines)
├── VariantSelector.jsx          (colors + sizes — ~250 lines)
├── ProductActions.jsx           (quantity + cart buttons — ~100 lines)
├── ProductInsights.jsx          (specs, pros, cons, use cases — ~200 lines)
├── SizeChartModal.jsx           (size chart popup — ~80 lines)
└── ProductSections/
    ├── ReviewSection.jsx        (reviews — ~100 lines)
    ├── RelatedCarousel.jsx      (related products wrapper — ~50 lines)
    └── Recommendations.jsx      (recommendations wrapper — ~50 lines)
```

**Fix inline styles:** Extract all `style={{}}` to CSS module classes. The `sampada-premium-brand.css` already has many of these classes defined but they're not being used.

**Add structured data:**
```jsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.image?.[0]?.asset?.url,
      "description": product.details,
      "offers": {
        "@type": "Offer",
        "price": displayPrice,
        "priceCurrency": "USD",
        "availability": currentStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      }
    })
  }}
/>
```

### 5.5 Sanity Client (`lib/client.js`)

**Enable CDN for production:**
```javascript
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production', // Enable CDN in production
});
```

### 5.6 Related Products Carousel (`RelatedProductsCarousel.jsx`)

**Replace JS animation with CSS:**
```css
@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.carousel-track {
  display: flex;
  gap: 16px;
  animation: scroll-left 30s linear infinite;
  width: max-content;
}

.carousel-track:hover {
  animation-play-state: paused;
}
```

This eliminates the `requestAnimationFrame` loop entirely — no JS execution, respects `prefers-reduced-motion` natively.

---

## 6. Style System Analysis

### 6.1 Three Competing Style Approaches

| Approach | Files | Characteristics |
|----------|-------|----------------|
| **CSS Modules** | `HomePage/*.module.css` | Scoped, maintainable, supports media queries |
| **Global CSS** | `globals.css`, `sampada-brand-global.css`, `sampada-premium-brand.css` | Shared utilities, brand tokens, button styles |
| **Inline Styles** | `[slug].js`, `MegaNavbar.jsx`, `ProductCard.jsx` | No media queries, hard to override, verbose |

### 6.2 Brand Token Consistency

**Defined tokens (from `sampada-brand-global.css`):**
- Deep Red: `#8B1A1A`
- Gold: `#C9A84C`
- Black: `#0a0a0a`
- Warm Cream: `#f8f4ef`

**Inconsistencies found:**
| File | Hardcoded Value | Should Be |
|------|----------------|-----------|
| `[slug].js` | `#f02d34` (bright red) | `#8B1A1A` (brand deep red) |
| `Product.jsx` | `#ff4757` (sale price) | `#8B1A1A` |
| `ProductCard.jsx` | `#ef4444` (discount badge) | `#8B1A1A` |
| `RelatedProductsCarousel.jsx` | `#e53935` (discount) | `#8B1A1A` |
| `ReviewSystem.jsx` | Dark theme `#1E1E2E` | Inconsistent with light brand |

### 6.3 Unused CSS Classes

The `sampada-premium-brand.css` file defines many classes that are **not used** in the product page despite being designed for it:
- `.add-to-cart-btn` — product page uses inline styles instead
- `.buy-now-btn` — product page uses inline styles instead
- `.qty-btn` — product page uses inline styles instead
- `.size-btn`, `.size-btn-selected` — product page uses inline styles instead
- `.color-swatch`, `.color-swatch-selected` — product page uses inline styles instead
- `.product-title`, `.product-price-sale` — partially used

---

## 7. GROQ Query Inventory

### 7.1 Homepage Queries

| Query | File | Purpose | Optimization |
|-------|------|---------|-------------|
| Products (24) | `pages/index.js` | Featured products | Add `status == "active"`, select only needed fields |
| Banner (1) | `pages/index.js` | Hero + promo banner | Good — single document |
| Categories (all) | `pages/index.js` | Category list | Good — lightweight |

### 7.2 Product Page Queries

| Query | File | Purpose | Optimization |
|-------|------|---------|-------------|
| Current product | `[slug].js` getStaticProps | Full product detail | Good — well-structured |
| All products | `[slug].js` getStaticProps | Related products | **BAD** — fetches ALL, limit needed |
| Recommendations | `ProductRecommendations.jsx` | Same-category products | Good — filtered by category |

### 7.3 Footer Query

| Query | File | Purpose | Status |
|-------|------|---------|--------|
| Footer settings | `SampadaFooter.jsx` getFooterData | Dynamic footer links | **NOT CALLED** on homepage |
| Company page | `SampadaFooter.jsx` | Dynamic company links | Part of getFooterData |
| Support page | `SampadaFooter.jsx` | Dynamic support links | Part of getFooterData |

---

## 8. Summary Statistics

| Metric | Value |
|--------|-------|
| Homepage components | 8 (Navbar, Hero, Collections, WhySampada, Products, Promo, Newsletter, Footer) |
| Product page lines | 1,259 |
| Inline style objects in product page | ~600+ |
| Sanity schemas | 17 |
| GROQ queries | 9 (3 homepage, 2 product page, 1 recommendations, 3 footer) |
| Missing Sanity schemas | 5 (review, collection, trustStrip, newsletter, testimonial) |
| CSS files | 9 (3 global + 6 CSS modules) |
| Console.log statements | 15+ (across homepage, product page, components) |
| Hardcoded strings that should be in Sanity | 12+ |

---

*Audit completed: 2026-04-06*
