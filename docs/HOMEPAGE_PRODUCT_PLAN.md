# Homepage & Product Page Refinement - Execution Plan

**Created:** 2026-04-06  
**Goal:** Transform homepage and product pages into premium, brand-consistent experiences

---

## Phase 1: Homepage Refinement

### 1.1 Hero Banner Polish
- Files: `components/HomePage/HomeHeroBanner.jsx`
- Apply Emil Kowalski design principles
- Add subtle animations (enter/exit)
- Ensure responsive scaling
- Add trust badges near CTA

### 1.2 Collections Section
- Files: `components/HomePage/CollectionsSection.jsx`
- Fetch from Sanity category schema dynamically
- Add distinct logos/icons per category
- Center-align and responsive grid
- Hover animations with proper easing

### 1.3 Featured Products Section
- Files: `components/HomePage/FeaturedProductsSection.jsx`
- Dynamic Sanity fetch with status filter (published only)
- Add loading skeletons
- Proper pagination/infinite scroll

### 1.4 Trust Badges
- New: `components/TrustBadges.jsx`
- Safe Checkout, Returns, Delivery badges
- SVG icons (no emoji)
- Place near CTAs on homepage and product page

### 1.5 Footer Enhancement
- Files: `components/HomePage/SampadaFooter.jsx`
- Fetch from Sanity footerSettings schema
- Dynamic social links
- Brand consistency

---

## Phase 2: Product Detail Page

### 2.1 Split Monolith into Components
- Current: `pages/product/[slug].js` (1,259 lines)
- Split into:
  - `components/product/ProductGallery.jsx` - Image carousel
  - `components/product/ProductInfo.jsx` - Title, price, CTA
  - `components/product/ProductVariants.jsx` - Color/size selection
  - `components/product/ProductAccordions.jsx` - Collapsible sections
  - `components/product/ProductTrustBadges.jsx` - Trust signals
  - `components/product/ProductReviews.jsx` - Reviews section
  - `components/product/ProductActions.jsx` - Share, wishlist

### 2.2 Clear Visual Hierarchy
- Order: Image → Title → Price → CTA → Trust → Details
- Balanced spacing with design tokens
- Responsive scaling

### 2.3 Accordion Sections
- Collapse: Pros/Cons, Best Use Cases, Specifications
- Animate with @starting-style or CSS transitions
- Keyboard accessible
- ARIA attributes

### 2.4 Reviews Section
- Move higher on page (after product details)
- Star rating display
- "Write a Review" button
- Dynamic fetch from Sanity review schema

### 2.5 Related Products
- Dynamic GROQ query by category
- Consistent styling with homepage
- Proper lazy loading

### 2.6 Image Scaling
- Responsive thumbnails
- No cropping on any viewport
- Aspect ratio preservation
- srcset for optimal loading

---

## Phase 3: Sanity Integration

### 3.1 Enable Sanity CDN
- Update `lib/client.js` to use CDN
- Add proper caching headers
- Enable preview mode for drafts

### 3.2 GROQ Queries
- Homepage banners: `*[_type == "banner" && active == true]`
- Categories: `*[_type == "category" && defined(slug.current)]`
- Featured products: `*[_type == "product" && featured == true && status == "published"]`
- Related products: `*[_type == "product" && references(^.category._ref) && _id != ^.product._id]`
- Footer settings: `*[_type == "footerSettings"][0]`
- SEO fields: `*[_type == "seoFields" && slug.current == $slug][0]`

### 3.3 Schema Validation
- Ensure all schemas in `schemas/schemaTypes` are registered
- Validate product.js, category.js, banner.js, footerSettings.js, seoFields.js, order.js, user.js

---

## Phase 4: Performance & Accessibility

### 4.1 Performance Optimization
- Apply Vercel React best practices
- Component composition patterns
- Lazy load below-fold content
- Optimize images (WebP/AVIF, srcset)
- Remove console.log from production
- Code splitting for heavy components

### 4.2 Accessibility Audit
- WCAG 2.1 AA compliance
- Alt text on all images
- Keyboard navigation for all interactive elements
- Contrast ratios (4.5:1 minimum)
- ARIA labels on icon buttons
- Focus states visible
- Screen reader testing

### 4.3 Code Quality
- Run code-reviewer agent
- Fix all P0 and P1 issues
- Add TypeScript types where possible
- DRY principles
- Clear naming conventions

---

## Phase 5: Verification

### 5.1 Goal Verification
- Homepage premium and photorealistic?
- Product page conversion-optimized?
- Sanity fully integrated and dynamic?
- Accessible and performant?

### 5.2 Performance Benchmarks
- Load times < 2 seconds
- CLS < 0.1
- LCP < 2.5 seconds
- FID < 100ms

### 5.3 Final Review
- Code review with code-reviewer
- Performance benchmark with performance-benchmarker
- Visual QA on mobile, tablet, desktop

---

## Execution Order

1. ✅ Audit complete
2. ⏳ Split product page into components (1-2 hours)
3. ⏳ Polish homepage sections (1 hour)
4. ⏳ Add trust badges (30 min)
5. ⏳ Enable Sanity CDN (15 min)
6. ⏳ Update GROQ queries (30 min)
7. ⏳ Add accessibility fixes (1 hour)
8. ⏳ Performance optimization (1 hour)
9. ⏳ Code review and verification (30 min)

**Total Estimated Time:** 5-7 hours

---

## Success Criteria

- ✅ Homepage loads in < 2 seconds
- ✅ Product page has clear visual hierarchy
- ✅ All Sanity schemas dynamically synced
- ✅ WCAG 2.1 AA compliant
- ✅ Mobile, tablet, desktop responsive
- ✅ Zero console.log in production
- ✅ No draft products visible on frontend
- ✅ Reviews section functional
- ✅ Related products dynamically fetched
- ✅ Trust badges visible near CTAs
