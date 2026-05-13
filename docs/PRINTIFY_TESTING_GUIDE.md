# Printify Integration - Complete Testing Guide

**Date**: May 10, 2026  
**Purpose**: Step-by-step testing procedures for all phases

---

## 🧪 TESTING OVERVIEW

This guide provides detailed testing procedures for each phase of the Printify integration, including:
- What to test
- How to test it
- Expected results
- How to verify success
- Troubleshooting steps

---

## PHASE 1 & 2: Schema & Components Testing ✅

### Test 1.1: Product Schema Extensions

**What**: Verify new Printify fields are accessible in Sanity Studio

**How to Test**:
```bash
cd sanity_abscommerce
npm run dev
```

**Steps**:
1. Open http://localhost:3333
2. Navigate to "Product" document type
3. Create or edit a product
4. Look for "🖨️ Printify" tab

**Expected Results**:
- ✅ Printify tab is visible
- ✅ Fields visible when "Is Printify Product" is checked:
  - Printify Product ID
  - Printify Blueprint ID
  - Print Provider Name
  - Printify Variant ID
  - Printify Mockup URL
  - Printify Base Price
  - Printify Shipping Info

**How to Verify**:
- [ ] Can toggle "Is Printify Product" checkbox
- [ ] Fields appear/hide based on checkbox
- [ ] Can enter data in all fields
- [ ] Data saves successfully

**Troubleshooting**:
- **Issue**: Tab not visible
  - **Fix**: Restart Sanity Studio (`Ctrl+C`, then `npm run dev`)
- **Issue**: Fields not showing
  - **Fix**: Check `sanity_abscommerce/schemaTypes/product.js` for syntax errors

---

### Test 1.2: Product Tabs Field

**What**: Verify product tabs can be created

**Steps**:
1. In Sanity Studio, edit a product
2. Go to "📑 Product Tabs" tab
3. Click "Add item"
4. Fill in:
   - Tab Title: "Description"
   - Tab Icon: "📄"
   - Tab Content: Add some rich text

**Expected Results**:
- ✅ Can add multiple tabs
- ✅ Can reorder tabs (drag and drop)
- ✅ Can edit tab content with rich text editor
- ✅ Preview shows tab title and icon

**How to Verify**:
- [ ] Add 3 tabs (Description, Shipping, Returns)
- [ ] Reorder them
- [ ] Add formatted text, lists, links
- [ ] Save and reload - data persists

---

### Test 1.3: Banner Schema - Collection Quotes

**What**: Verify collection quotes are accessible

**Steps**:
1. In Sanity Studio, go to "Banner" document
2. Look for "Collection Quote" section
3. Expand it

**Expected Results**:
- ✅ 5 quote fields visible:
  - Men's Collection Quote
  - Women's Collection Quote
  - His & Hers Collection Quote
  - Support Page Quote
  - Stories Page Quote
- ✅ Default values populated
- ✅ Can edit each quote

**How to Verify**:
- [ ] Edit each quote
- [ ] Save changes
- [ ] Reload page - changes persist

---

### Test 1.4: PrintifyBadge Component

**What**: Verify component renders correctly

**How to Test**:
Create a test page: `pages/test-printify-badge.js`

```javascript
import PrintifyBadge from '../components/PrintifyBadge';

export default function TestPage() {
  const mockData = {
    isPrintifyProduct: true,
    printProviderName: 'Gooten',
    printifyShipping: 'Standard shipping: 5-7 business days'
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Printify Badge Test</h1>
      
      <h2>Inline Variant</h2>
      <PrintifyBadge printifyIntegration={mockData} variant="inline" />
      
      <h2>Default Variant</h2>
      <PrintifyBadge printifyIntegration={mockData} variant="default" />
      
      <h2>Detailed Variant</h2>
      <PrintifyBadge printifyIntegration={mockData} variant="detailed" />
    </div>
  );
}
```

**Steps**:
1. Create the test file
2. Run `npm run dev`
3. Visit http://localhost:3000/test-printify-badge

**Expected Results**:
- ✅ All 3 variants render
- ✅ Inline: Small badge with icon and text
- ✅ Default: Medium badge with icon and two lines
- ✅ Detailed: Large card with header, provider, shipping, note
- ✅ Styled with brand colors (cream/crimson/gold)

**How to Verify**:
- [ ] Visual inspection matches design
- [ ] Responsive on mobile (resize browser)
- [ ] Colors match brand palette
- [ ] Text is readable

---

### Test 1.5: ProductTabs Component

**What**: Verify tabs render and switch correctly

**How to Test**:
Create test page: `pages/test-product-tabs.js`

```javascript
import ProductTabs from '../components/ProductTabs';

export default function TestPage() {
  const mockTabs = [
    {
      _key: '1',
      tabTitle: 'Description',
      tabIcon: '📄',
      tabContent: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'This is the product description.' }]
        }
      ]
    },
    {
      _key: '2',
      tabTitle: 'Shipping',
      tabIcon: '🚚',
      tabContent: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Ships in 5-7 business days.' }]
        }
      ]
    },
    {
      _key: '3',
      tabTitle: 'Returns',
      tabIcon: '↩️',
      tabContent: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: '30-day return policy.' }]
        }
      ]
    }
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Product Tabs Test</h1>
      <ProductTabs tabs={mockTabs} />
    </div>
  );
}
```

**Steps**:
1. Create the test file
2. Visit http://localhost:3000/test-product-tabs
3. Click each tab

**Expected Results**:
- ✅ 3 tabs visible in header
- ✅ First tab active by default
- ✅ Clicking tab switches content
- ✅ Active tab highlighted (crimson border)
- ✅ Content animates in smoothly
- ✅ Icons display correctly

**How to Verify**:
- [ ] Click each tab - content changes
- [ ] Active tab has visual indicator
- [ ] Animation is smooth
- [ ] Responsive on mobile
- [ ] Keyboard navigation works (Tab key)

---

## PHASE 3: Page Integration Testing 🚧

### Test 3.1: Product Detail Page - Printify Badge

**What**: Verify Printify badge shows on product pages

**Prerequisites**:
1. Create a test product in Sanity Studio
2. Enable "Is Printify Product"
3. Fill in Printify fields
4. Publish product

**How to Test**:
```bash
npm run dev
```

**Steps**:
1. Visit http://localhost:3000/product/[your-test-product-slug]
2. Scroll to price section
3. Look for Printify badge below price

**Expected Results**:
- ✅ Detailed Printify badge visible
- ✅ Shows print provider name
- ✅ Shows shipping information
- ✅ Styled correctly with brand colors
- ✅ Responsive on mobile

**How to Verify**:
- [ ] Badge renders without errors
- [ ] Data from Sanity displays correctly
- [ ] Badge only shows for Printify products
- [ ] Non-Printify products don't show badge
- [ ] Mobile layout works

**Troubleshooting**:
- **Issue**: Badge not showing
  - **Fix**: Check browser console for errors
  - **Fix**: Verify product has `printifyIntegration.isPrintifyProduct = true`
- **Issue**: Data not displaying
  - **Fix**: Check GROQ query includes `printifyIntegration`
  - **Fix**: Verify Sanity data is saved

---

### Test 3.2: Product Detail Page - Product Tabs

**What**: Verify product tabs render on product pages

**Prerequisites**:
1. Edit test product in Sanity Studio
2. Go to "Product Tabs" tab
3. Add 3 tabs (Description, Shipping, Returns)
4. Add content to each tab
5. Publish

**Steps**:
1. Visit product page
2. Scroll below product details
3. Look for tabs section

**Expected Results**:
- ✅ Tabs section visible
- ✅ All tabs from Sanity displayed
- ✅ Can click and switch tabs
- ✅ Content renders correctly
- ✅ Rich text formatting preserved

**How to Verify**:
- [ ] Tabs render without errors
- [ ] Content from Sanity displays
- [ ] Tab switching works
- [ ] PortableText renders (bold, lists, links)
- [ ] Responsive on mobile

---

### Test 3.3: Collections Page - Quotes

**What**: Verify collection quotes display

**Prerequisites**:
1. Update banner in Sanity Studio
2. Set collection quotes
3. Publish

**How to Test**:
```bash
npm run dev
```

**Steps**:
1. Visit http://localhost:3000/collections/mens-tshirts
2. Look for quote section after hero

**Expected Results**:
- ✅ Quote section visible
- ✅ Correct quote for collection type
- ✅ Styled with brand typography
- ✅ Centered and readable

**How to Verify**:
- [ ] Men's collection shows men's quote
- [ ] Women's collection shows women's quote
- [ ] Quote is styled correctly
- [ ] Responsive on mobile

---

### Test 3.4: Support Page - Printify Section

**What**: Verify Printify policies section added

**Steps**:
1. Visit http://localhost:3000/support
2. Scroll to Printify section

**Expected Results**:
- ✅ "Print-on-Demand Products" section visible
- ✅ 3 cards: Shipping Times, Returns Policy, Quality Guarantee
- ✅ Styled with brand cards (`.s-card`)
- ✅ Icons display correctly

**How to Verify**:
- [ ] Section renders
- [ ] All 3 cards visible
- [ ] Content is readable
- [ ] Responsive grid layout

---

### Test 3.5: API Sync Endpoint

**What**: Verify Printify sync API works

**Prerequisites**:
1. Set environment variables:
   ```bash
   PRINTIFY_API_KEY="your_test_key"
   PRINTIFY_SHOP_ID="your_shop_id"
   SANITY_API_TOKEN="your_write_token"
   ```

**How to Test**:
Use Postman, Insomnia, or curl:

```bash
curl -X POST http://localhost:3000/api/printify/sync-product \
  -H "Content-Type: application/json" \
  -d '{
    "printifyProductId": "test_product_id",
    "sanityProductId": "your_sanity_product_id"
  }'
```

**Expected Results**:
- ✅ Status 200 response
- ✅ JSON response with success: true
- ✅ Synced data returned
- ✅ Sanity product updated

**How to Verify**:
- [ ] API responds without errors
- [ ] Check Sanity Studio - product updated
- [ ] Printify data populated correctly
- [ ] Error handling works (try invalid IDs)

**Troubleshooting**:
- **Issue**: 500 error
  - **Fix**: Check environment variables
  - **Fix**: Verify Printify API key is valid
- **Issue**: 404 error
  - **Fix**: Check product IDs are correct

---

## PHASE 4: Plugin Configuration Testing 🚧

### Test 4.1: Recursive Hierarchy Plugin

**What**: Verify category hierarchy works

**Steps**:
1. In Sanity Studio, go to Categories
2. Create parent category: "Apparel"
3. Create child category: "T-Shirts"
4. Try to drag "T-Shirts" under "Apparel"

**Expected Results**:
- ✅ Can drag and drop categories
- ✅ Hierarchy visualized
- ✅ Child count shows
- ✅ Can expand/collapse

**How to Verify**:
- [ ] Drag and drop works
- [ ] Hierarchy saves
- [ ] Displays correctly on frontend

---

### Test 4.2: Color Input Plugin

**What**: Verify color picker works

**Steps**:
1. Edit a product
2. Go to "Available Colors" field
3. Click "Add item"
4. Color picker appears

**Expected Results**:
- ✅ Color picker modal opens
- ✅ Can select colors
- ✅ Hex value displays
- ✅ Multiple colors can be added

**How to Verify**:
- [ ] Picker works
- [ ] Colors save
- [ ] Can remove colors

---

### Test 4.3: Media Library Plugin

**What**: Verify enhanced media management

**Steps**:
1. In Sanity Studio, click "Media" tab
2. Upload an image
3. Check image details

**Expected Results**:
- ✅ File size shown
- ✅ Dimensions shown
- ✅ Usage count shown
- ✅ Can bulk delete

**How to Verify**:
- [ ] Media tab accessible
- [ ] Upload works
- [ ] Metadata displays

---

## PHASE 5: Accessibility Testing 🚧

### Test 5.1: Lighthouse Audit

**What**: Verify WCAG 2.2 AA compliance

**How to Test**:
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Accessibility"
4. Run audit

**Steps**:
1. Test product page
2. Test collections page
3. Test support page
4. Test stories page
5. Test company page

**Expected Results**:
- ✅ Score: 90+ (green)
- ✅ No critical issues
- ✅ Contrast ratios pass
- ✅ Alt text present

**How to Verify**:
- [ ] All pages score 90+
- [ ] Fix any issues found
- [ ] Re-test after fixes

---

### Test 5.2: Screen Reader Testing

**What**: Verify screen reader compatibility

**Tools**:
- Windows: NVDA (free)
- Mac: VoiceOver (built-in)

**Steps**:
1. Enable screen reader
2. Navigate product page
3. Tab through elements
4. Listen to announcements

**Expected Results**:
- ✅ All images have alt text
- ✅ Buttons have labels
- ✅ Headings in logical order
- ✅ Forms have labels

**How to Verify**:
- [ ] Can navigate with keyboard only
- [ ] All content is announced
- [ ] No "unlabeled" elements

---

### Test 5.3: Keyboard Navigation

**What**: Verify keyboard-only navigation

**Steps**:
1. Don't use mouse
2. Use Tab, Enter, Arrow keys
3. Navigate entire site

**Expected Results**:
- ✅ Can reach all interactive elements
- ✅ Focus indicator visible
- ✅ Tab order logical
- ✅ Can activate buttons with Enter

**How to Verify**:
- [ ] Tab through product page
- [ ] Can add to cart with keyboard
- [ ] Can switch product tabs
- [ ] Can navigate menu

---

## PHASE 6: End-to-End Testing 🚧

### Test 6.1: Complete Order Flow

**What**: Test full Printify order workflow

**Steps**:
1. Browse to Printify product
2. Select variant
3. Add to cart
4. Checkout
5. Complete payment
6. Verify order created
7. Check Printify order
8. Verify email sent

**Expected Results**:
- ✅ Product displays correctly
- ✅ Variant selection works
- ✅ Cart updates
- ✅ Checkout completes
- ✅ Order saved in Sanity
- ✅ Order sent to Printify
- ✅ Confirmation email received

**How to Verify**:
- [ ] Complete test order
- [ ] Check Sanity for order document
- [ ] Check Printify dashboard for order
- [ ] Verify email received
- [ ] Check order status updates

---

### Test 6.2: Performance Testing

**What**: Verify site performance

**Tools**:
- Lighthouse (Performance)
- WebPageTest
- GTmetrix

**Metrics to Check**:
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Cumulative Layout Shift (CLS): < 0.1

**How to Verify**:
- [ ] Run Lighthouse performance audit
- [ ] All metrics in green
- [ ] Images optimized
- [ ] No render-blocking resources

---

### Test 6.3: Cross-Browser Testing

**What**: Verify compatibility across browsers

**Browsers to Test**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

**What to Check**:
- Layout consistency
- Functionality works
- Styles render correctly
- No console errors

**How to Verify**:
- [ ] Test on each browser
- [ ] Document any issues
- [ ] Fix browser-specific bugs

---

### Test 6.4: Mobile Responsiveness

**What**: Verify mobile experience

**Devices to Test**:
- iPhone (Safari)
- Android (Chrome)
- Tablet (iPad)

**What to Check**:
- Touch targets (48px minimum)
- Text readable without zoom
- No horizontal scroll
- Images scale properly
- Tabs work on touch

**How to Verify**:
- [ ] Test on real devices
- [ ] Use Chrome DevTools device emulation
- [ ] Check all breakpoints

---

## 🎯 TESTING CHECKLIST SUMMARY

### Phase 1 & 2: Foundation ✅
- [x] Product schema extensions
- [x] Banner schema extensions
- [x] Printify client enhanced
- [x] PrintifyBadge component
- [x] ProductTabs component

### Phase 3: Page Integration
- [ ] Product page - Printify badge
- [ ] Product page - Product tabs
- [ ] Collections page - Quotes
- [ ] Support page - Printify section
- [ ] Stories page - Quote
- [ ] Company page - Accessibility
- [ ] API sync endpoint

### Phase 4: Plugins
- [ ] Recursive hierarchy
- [ ] Color input
- [ ] Media library
- [ ] Block styles
- [ ] References

### Phase 5: Accessibility
- [ ] Lighthouse audit (all pages)
- [ ] Screen reader testing
- [ ] Keyboard navigation
- [ ] Alt text verification
- [ ] ARIA labels

### Phase 6: End-to-End
- [ ] Complete order flow
- [ ] Performance testing
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Production deployment

---

## 📊 TEST RESULTS TEMPLATE

Use this template to document test results:

```markdown
## Test: [Test Name]
**Date**: [Date]
**Tester**: [Name]
**Environment**: [Local/Staging/Production]

### Results
- Status: ✅ Pass / ❌ Fail / ⚠️ Partial
- Issues Found: [Number]
- Critical Issues: [Number]

### Details
[Description of what was tested and results]

### Issues
1. [Issue description]
   - Severity: Critical/High/Medium/Low
   - Steps to reproduce
   - Expected vs Actual
   - Fix applied: [Yes/No]

### Screenshots
[Attach screenshots if applicable]

### Next Steps
[What needs to be done next]
```

---

## 🆘 TROUBLESHOOTING GUIDE

### Common Issues

**Issue**: Component not rendering
- Check imports are correct
- Verify file paths
- Check browser console for errors
- Restart dev server

**Issue**: Sanity data not showing
- Verify GROQ query includes new fields
- Check Sanity Studio - data saved?
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

**Issue**: Styles not applying
- Check CSS module imports
- Verify class names match
- Check `sampada-brand.css` is imported
- Clear browser cache

**Issue**: API errors
- Check environment variables
- Verify API keys are valid
- Check network tab in DevTools
- Review server logs

---

## ✅ SIGN-OFF CHECKLIST

Before marking testing complete:

- [ ] All Phase 3 tests pass
- [ ] All Phase 4 tests pass
- [ ] All Phase 5 tests pass
- [ ] All Phase 6 tests pass
- [ ] No critical bugs remain
- [ ] Documentation updated
- [ ] Stakeholders notified
- [ ] Ready for production

---

**Testing Status**: 🚧 IN PROGRESS  
**Last Updated**: May 10, 2026  
**Next Review**: After Phase 3 implementation
