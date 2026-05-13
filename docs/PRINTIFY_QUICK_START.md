# Printify Integration - Quick Start Guide

**TL;DR**: Everything you need to continue the Printify integration

---

## ✅ WHAT'S DONE

1. **Schema Extended** - Product + Banner schemas updated
2. **Components Created** - PrintifyBadge + ProductTabs ready
3. **API Enhanced** - Printify client with sync methods
4. **Docs Written** - Complete implementation guide

---

## 📝 WHAT'S NEXT

### Step 1: Test Sanity Studio (5 minutes)

```bash
cd sanity_abscommerce
npm run dev
```

Open http://localhost:3333 and verify:
- [ ] Printify tab visible in product schema
- [ ] Product Tabs tab visible
- [ ] Color picker works
- [ ] Can create test product

### Step 2: Add Printify Badge to Product Page (10 minutes)

**File**: `pages/product/[slug].js`

1. Add imports:
```javascript
import PrintifyBadge from '../../components/PrintifyBadge';
import ProductTabs from '../../components/ProductTabs';
```

2. Update GROQ query (add these fields):
```javascript
printifyIntegration,
productTabs,
```

3. Add badge after price section (~line 600):
```javascript
{product.printifyIntegration?.isPrintifyProduct && (
  <PrintifyBadge 
    printifyIntegration={product.printifyIntegration}
    variant="detailed"
  />
)}
```

4. Add tabs before reviews (~line 1100):
```javascript
{product.productTabs && product.productTabs.length > 0 && (
  <div style={{ marginTop: '50px', padding: '0 20px', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto' }}>
    <ProductTabs tabs={product.productTabs} />
  </div>
)}
```

### Step 3: Add Collection Quotes (15 minutes)

**File**: `pages/collections/[slug].js`

1. Fetch banner data in `getServerSideProps`:
```javascript
const bannerQuery = `*[_type == "banner"][0]{ collectionQuote }`;
const banner = await client.fetch(bannerQuery);
```

2. Add quote after hero section:
```javascript
{banner?.collectionQuote && (
  <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--s-cream)' }}>
    <p style={{ fontFamily: 'var(--s-serif)', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--s-crimson)' }}>
      "Crafted for You, Printed to Perfection."
    </p>
  </div>
)}
```

### Step 4: Update Support Page (10 minutes)

**File**: `pages/support.js`

Add Printify section before final CTA - see full code in `PRINTIFY_INTEGRATION_CODE_CHANGES.md` section 3.C

### Step 5: Test Everything (15 minutes)

```bash
npm run dev
```

Visit:
- [ ] http://localhost:3000/product/[any-product]
- [ ] http://localhost:3000/collections/[any-collection]
- [ ] http://localhost:3000/support
- [ ] http://localhost:3000/stories

---

## 📚 DOCUMENTATION

| Document | Purpose |
|----------|---------|
| `PRINTIFY_INTEGRATION_SUMMARY.md` | Overview and progress |
| `PRINTIFY_INTEGRATION_CODE_CHANGES.md` | **Detailed code snippets** |
| `PRINTIFY_INTEGRATION_IMPLEMENTATION.md` | Full implementation plan |
| `PROJECT_STRUCTURE_REFERENCE.md` | Project structure |
| `QUICK_REFERENCE_FOR_DEVELOPERS.md` | Developer quick start |

---

## 🔧 ENVIRONMENT VARIABLES

Add to `.env`:
```bash
PRINTIFY_API_KEY="your_api_key"
PRINTIFY_SHOP_ID="your_shop_id"
```

---

## ✅ COMPLETED CHECKLIST

- [x] Product schema extended with Printify fields
- [x] Banner schema extended with collection quotes
- [x] Printify client enhanced
- [x] PrintifyBadge component created
- [x] ProductTabs component created
- [x] Documentation written

---

## 📋 TODO CHECKLIST

- [ ] Test Sanity Studio
- [ ] Add Printify badge to product page
- [ ] Add product tabs to product page
- [ ] Add collection quotes
- [ ] Update support page
- [ ] Update stories page
- [ ] Run accessibility scan
- [ ] Deploy

---

## 🚨 CRITICAL NOTES

### Homepage Protection
- ⚠️ **DO NOT MODIFY** `pages/index.js`
- ⚠️ **DO NOT MODIFY** `components/HomePage/*`
- Homepage stays pure Sampada branding

### Brand Colors
- Cream: `#FAF6F0`
- Crimson: `#8B1A1A`
- Gold: `#C9A96E`
- Dark: `#1A0A08`

---

## 💡 QUICK TIPS

1. **Start with product page** - Most visible impact
2. **Test in Sanity Studio first** - Verify fields work
3. **Use code snippets** - All code ready in docs
4. **Check accessibility** - Run Lighthouse audit
5. **Deploy Sanity first** - Then deploy Next.js

---

## 🆘 TROUBLESHOOTING

### Issue: Printify fields not showing in Sanity
**Solution**: Restart Sanity Studio (`npm run dev`)

### Issue: Components not rendering
**Solution**: Check imports and file paths

### Issue: Styles not applying
**Solution**: Verify `sampada-brand.css` is imported

---

## 📞 SUPPORT

For detailed code:
→ See `docs/PRINTIFY_INTEGRATION_CODE_CHANGES.md`

For implementation plan:
→ See `docs/PRINTIFY_INTEGRATION_IMPLEMENTATION.md`

For project structure:
→ See `docs/PROJECT_STRUCTURE_REFERENCE.md`

---

**Estimated Time to Complete**: 1-2 hours  
**Difficulty**: Medium  
**Status**: Ready to implement

**Last Updated**: May 10, 2026
