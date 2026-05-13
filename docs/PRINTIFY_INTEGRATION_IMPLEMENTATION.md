# Printify Integration Implementation Plan

**Date**: May 10, 2026  
**Status**: 🚧 IN PROGRESS  
**Objective**: Integrate Printify workflow with Sanity CMS while preserving homepage branding

---

## ✅ COMPLETED TASKS

### Phase 1: Schema Extensions ✅

1. **Product Schema Extended** (`sanity_abscommerce/schemaTypes/product.js`)
   - ✅ Added `printifyVariantId` field
   - ✅ Added `printifyMockupUrl` field
   - ✅ Added `printifyPrice` field
   - ✅ Added `printifyShipping` field
   - ✅ Added `productTabs` array for tab block content
   - ✅ Created new field groups: `tabs` and `printify`
   - ✅ Assigned fields to appropriate groups

2. **Banner Schema Extended** (`sanity_abscommerce/schemaTypes/banner.js`)
   - ✅ Added `collectionQuote` object with:
     - Men's Collection Quote: "Crafted for You, Printed to Perfection."
     - Women's Collection Quote: "Crafted for You, Printed to Perfection."
     - His & Hers Quote: "Crafted for You, Printed to Perfection."
     - Support Quote: "Your satisfaction is our legacy."
     - Stories Quote: "Every design tells a story of heritage and innovation."

3. **Printify Client Enhanced** (`lib/printifyClient.js`)
   - ✅ Added `getProduct()` method
   - ✅ Added `getProductVariants()` method
   - ✅ Added `getShippingInfo()` method
   - ✅ Added `getOrder()` method
   - ✅ Added `syncProductData()` helper for Sanity sync

### Phase 2: Components Created ✅

1. **PrintifyBadge Component** (`components/PrintifyBadge.jsx`)
   - ✅ Three variants: `inline`, `default`, `detailed`
   - ✅ Shows print provider name
   - ✅ Shows shipping information
   - ✅ Styled with brand colors (cream/crimson/gold)

2. **ProductTabs Component** (`components/ProductTabs.jsx`)
   - ✅ Tab navigation with icons
   - ✅ PortableText rendering for rich content
   - ✅ Animated tab switching
   - ✅ Responsive design
   - ✅ Accessible (ARIA roles)

---

## 🚧 IN PROGRESS TASKS

### Phase 3: Page Integration

#### 1. Product Detail Page (`pages/product/[slug].js`)
- [ ] Import PrintifyBadge and ProductTabs components
- [ ] Add Printify badge after price section
- [ ] Add ProductTabs after product insights section
- [ ] Update GROQ query to fetch `printifyIntegration` and `productTabs`
- [ ] Ensure accessibility alt text for Printify images

#### 2. Collections Page (`pages/collections/[slug].js`)
- [ ] Add collection-specific quotes from banner schema
- [ ] Add Printify product preview blocks
- [ ] Update GROQ query to fetch `printifyIntegration`
- [ ] Add "Printed by Printify" badge to product cards

#### 3. Support Page (`pages/support.js`)
- [ ] Add Printify shipping/returns policies section
- [ ] Add support quote: "Your satisfaction is our legacy."
- [ ] Add Printify fulfillment FAQ
- [ ] Ensure accessibility compliance

#### 4. Stories Page (`pages/stories/index.js`)
- [ ] Add stories quote: "Every design tells a story of heritage and innovation."
- [ ] Ensure accessibility alt text for all images

#### 5. Company Page (`pages/company.js`)
- [ ] Run accessibility scan
- [ ] Add alt text for all images
- [ ] Ensure WCAG 2.2 AA compliance

---

## 📋 PENDING TASKS

### Phase 4: Sanity Plugin Configuration

1. **Recursive Hierarchy Plugin**
   - [ ] Verify active on `category.js`
   - [ ] Test drag-and-drop in Sanity Studio
   - [ ] Ensure used in collections and shop pages

2. **Tab Block Plugin**
   - [ ] Verify `productTabs` field renders correctly
   - [ ] Test tab creation in Sanity Studio
   - [ ] Ensure tabs render on product detail pages

3. **Color Input Plugin**
   - [ ] Verify `availableColors` field is active
   - [ ] Test color picker in Sanity Studio
   - [ ] Ensure color swatches render in ProductCard/ProductCarousel

4. **Accessibility Scanner**
   - [ ] Run sitewide scan
   - [ ] Focus on: support.js, stories/index.js, company.js
   - [ ] Generate compliance report
   - [ ] Fix any WCAG 2.2 AA violations

5. **Slack Publisher (Future)**
   - [ ] Prepare hooks for rapid publishing
   - [ ] Document integration steps
   - [ ] Wait for npm package availability

### Phase 5: Testing & Validation

1. **Sanity Studio Testing**
   - [ ] Run `npm run dev` in `sanity_abscommerce`
   - [ ] Verify all plugins visible
   - [ ] Test product creation with Printify fields
   - [ ] Test tab block creation
   - [ ] Test color picker
   - [ ] Test category hierarchy drag-and-drop

2. **Frontend Testing**
   - [ ] Test Printify badge rendering
   - [ ] Test product tabs rendering
   - [ ] Test collection quotes
   - [ ] Test responsive design
   - [ ] Test accessibility with screen reader

3. **API Testing**
   - [ ] Mock Printify API calls with test credentials
   - [ ] Test product sync from Printify
   - [ ] Test order creation flow
   - [ ] Test webhook handling

4. **End-to-End Testing**
   - [ ] Test complete order flow:
     - Add Printify product to cart
     - Checkout
     - Create order in Sanity
     - Send to Printify API
     - Email confirmation
   - [ ] Verify order tracking
   - [ ] Verify fulfillment status updates

### Phase 6: Documentation

1. **API Documentation**
   - [ ] Document Printify API integration
   - [ ] Document sync workflow
   - [ ] Document webhook setup

2. **User Guide**
   - [ ] How to add Printify products in Sanity
   - [ ] How to create product tabs
   - [ ] How to manage collection quotes

3. **Developer Guide**
   - [ ] Component usage examples
   - [ ] API endpoint documentation
   - [ ] Testing procedures

---

## 🎯 BRAND QUOTES IMPLEMENTATION

### Homepage (PROTECTED - NO CHANGES)
- ✅ Quote: "Wear Your Legacy, Prosper in Style"
- ✅ Pure Sampada branding maintained
- ✅ No Printify mention

### Collections Pages
- 📝 Men's: "Crafted for You, Printed to Perfection."
- 📝 Women's: "Crafted for You, Printed to Perfection."
- 📝 His & Hers: "Crafted for You, Printed to Perfection."

### Support Page
- 📝 Quote: "Your satisfaction is our legacy."

### Stories Page
- 📝 Quote: "Every design tells a story of heritage and innovation."

---

## 🔧 TECHNICAL REQUIREMENTS

### Environment Variables
```bash
PRINTIFY_API_KEY="..."
PRINTIFY_SHOP_ID="..."
```

### Dependencies (Already Installed)
- `@portabletext/react` - For tab content rendering
- `@sanity/client` - For Sanity API calls
- `next-sanity` - For Next.js + Sanity integration

---

## 📊 SUCCESS CRITERIA

- [ ] All Printify fields accessible in Sanity Studio
- [ ] Product tabs render correctly on product pages
- [ ] Printify badge shows on applicable products
- [ ] Collection quotes display correctly
- [ ] All plugins functional in Sanity Studio
- [ ] Accessibility scan passes WCAG 2.2 AA
- [ ] Homepage remains unchanged
- [ ] End-to-end order flow works
- [ ] Documentation complete

---

## 🚨 CRITICAL NOTES

### Homepage Protection
- ⚠️ **DO NOT MODIFY**: `pages/index.js`
- ⚠️ **DO NOT MODIFY**: `components/HomePage/*`
- ⚠️ **DO NOT MODIFY**: Homepage quotes or hero banner
- ✅ Homepage remains pure Sampada branding

### Brand Consistency
- ✅ Use `sampada-brand.css` classes throughout
- ✅ Colors: cream (#FAF6F0), crimson (#8B1A1A), gold (#C9A96E), dark (#1A0A08)
- ✅ Typography: Cormorant Garamond (headings), Inter (body)

---

## 📅 TIMELINE

- **Phase 1-2**: ✅ COMPLETE (Schema + Components)
- **Phase 3**: 🚧 IN PROGRESS (Page Integration)
- **Phase 4**: 📋 PENDING (Plugin Configuration)
- **Phase 5**: 📋 PENDING (Testing)
- **Phase 6**: 📋 PENDING (Documentation)

---

**Next Steps**: Continue with Phase 3 - Page Integration

**Last Updated**: May 10, 2026
