# Product Page Integration Guide - Step-by-Step

**File to Edit**: `pages/product/[slug].js`  
**Time Required**: 10 minutes  
**Difficulty**: Easy - Copy & Paste

---

## 📋 What You're Adding

1. **Sticky Add to Cart Bar** - Shows on mobile when scrolled past price
2. **Size Guide Modal** - Clickable button that opens size chart

Both components are already built in:
- `components/Product/StickyAddToCartBar.jsx`
- `components/Product/SizeGuideModal.jsx`

---

## 🔧 STEP 1: Add Imports (Top of File)

**Location**: Lines 1-30 (import section at the very top)

**Find this line** (around line 27):
```javascript
import '../../styles/sampada-premium-brand.css';
```

**Add these 2 lines RIGHT AFTER it**:
```javascript
import StickyAddToCartBar from '../../components/Product/StickyAddToCartBar';
import SizeGuideModal from '../../components/Product/SizeGuideModal';
```

**Result should look like**:
```javascript
import ProductTabs from '../../components/ProductTabs';
import '../../styles/sampada-premium-brand.css';
import StickyAddToCartBar from '../../components/Product/StickyAddToCartBar';
import SizeGuideModal from '../../components/Product/SizeGuideModal';


const ProductDetails = ({ product, products, slug }) => {
```

---

## 🔧 STEP 2: Add Size Guide Button

**Location**: Search for "Size:" or "size-selector" in the file (around line 400-600)

**Find this section** (the size selector area):
```javascript
{/* Size Selection */}
<div className="size-selector" style={{ marginBottom: '24px' }}>
  <h3 style={{ fontWeight: '600', marginBottom: '12px', color: '#1a1a1a', fontSize: '14px' }}>
    Size: <span style={{ fontWeight: '700', color: '#8B1A1A' }}>{selectedSize || 'Select Size'}</span>
  </h3>
  {/* Size buttons here */}
</div>
```

**Add this code RIGHT AFTER the closing `</div>` of the size selector**:
```javascript
{/* Size Guide Button */}
{sizeChart && sizeChart.asset && (
  <button
    onClick={() => setShowSizeChartModal(true)}
    style={{
      background: 'transparent',
      border: '1px solid #C9A84C',
      borderRadius: '4px',
      padding: '8px 16px',
      fontSize: '13px',
      fontWeight: '600',
      color: '#8B1A1A',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s ease',
      marginTop: '12px'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'rgba(201, 168, 76, 0.1)';
      e.currentTarget.style.borderColor = '#8B1A1A';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.borderColor = '#C9A84C';
    }}
  >
    📏 Size Guide
  </button>
)}
```

---

## 🔧 STEP 3: Add Components at End

**Location**: Near the END of the file, just before the final closing tags

**Find this section** (near the very end, around line 800-900):
```javascript
      </main>
    </div>
  );
};

export default ProductDetails;
```

**Add these components RIGHT BEFORE `</div>` (before the closing of the main container)**:
```javascript
      </main>
      
      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={showSizeChartModal}
        onClose={() => setShowSizeChartModal(false)}
        sizeChart={sizeChart}
        productName={name}
      />

      {/* Sticky Add to Cart Bar (Mobile Only) */}
      <div className="mobile-only">
        <StickyAddToCartBar
          productName={name}
          displayPrice={displayPrice}
          currentDiscount={currentDiscount}
          currentPrice={currentPrice}
          onAddToCart={handleAddToCart}
          isOutOfStock={currentStock === 0}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
```

---

## 🔧 STEP 4: Add Mobile-Only CSS

**File to Edit**: `styles/globals.css`

**Location**: At the END of the file (add to the very bottom)

**Add this CSS**:
```css
/* ═══════════════════════════════════════════════
   MOBILE-ONLY STICKY BAR
   ═══════════════════════════════════════════════ */

/* Hide sticky bar on desktop */
.mobile-only {
  display: none;
}

/* Show sticky bar only on mobile */
@media (max-width: 768px) {
  .mobile-only {
    display: block;
  }
}
```

---

## ✅ Verification Checklist

After making all changes, verify:

### **Check 1: No Syntax Errors**
- [ ] File saves without errors
- [ ] No red underlines in your editor
- [ ] Run `npm run dev` - should start without errors

### **Check 2: Size Guide Button**
- [ ] Go to any product page
- [ ] Look for "📏 Size Guide" button below size selector
- [ ] Click it - modal should open
- [ ] Click X or overlay - modal should close

### **Check 3: Sticky Bar (Mobile)**
- [ ] Open product page on mobile (or resize browser to < 768px)
- [ ] Scroll down past the price section
- [ ] Sticky bar should slide up from bottom
- [ ] Shows product name and price
- [ ] "Add to Cart" button works

---

## 🐛 Troubleshooting

### **Problem: "Cannot find module" error**
**Solution**: Make sure the component files exist:
- `components/Product/StickyAddToCartBar.jsx`
- `components/Product/SizeGuideModal.jsx`

### **Problem: Size Guide button doesn't appear**
**Solution**: The product needs a `sizeChart` image in Sanity. Check if the product has a size chart uploaded.

### **Problem: Sticky bar shows on desktop**
**Solution**: Make sure you added the CSS in Step 4 to `styles/globals.css`

### **Problem: Modal doesn't open**
**Solution**: Check that `showSizeChartModal` state exists. It should already be there (line ~38):
```javascript
const [showSizeChartModal, setShowSizeChartModal] = useState(false);
```

---

## 📸 Visual Reference

### **Where to Add Size Guide Button**
```
┌─────────────────────────────────┐
│ Color: Black                    │
│ [●] [●] [●]                     │  ← Color selector
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ Size: M                         │
│ [XS] [S] [M] [L] [XL]          │  ← Size selector
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ 📏 Size Guide                   │  ← ADD THIS BUTTON HERE
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ Quantity: 1                     │
│ [-] [1] [+]                     │
└─────────────────────────────────┘
```

### **Sticky Bar Appearance (Mobile)**
```
┌─────────────────────────────────┐
│                                 │
│  (Product content scrolled up)  │
│                                 │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ Product Name        $29.99      │  ← Sticky bar
│                [Add to Cart]    │  ← at bottom
└─────────────────────────────────┘
```

---

## 📝 Code Snippets Summary

### **Snippet 1: Imports** (Add after line 27)
```javascript
import StickyAddToCartBar from '../../components/Product/StickyAddToCartBar';
import SizeGuideModal from '../../components/Product/SizeGuideModal';
```

### **Snippet 2: Size Guide Button** (Add after size selector)
```javascript
{sizeChart && sizeChart.asset && (
  <button onClick={() => setShowSizeChartModal(true)} style={{
    background: 'transparent', border: '1px solid #C9A84C', borderRadius: '4px',
    padding: '8px 16px', fontSize: '13px', fontWeight: '600', color: '#8B1A1A',
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px',
    transition: 'all 0.2s ease', marginTop: '12px'
  }} onMouseEnter={(e) => {
    e.currentTarget.style.background = 'rgba(201, 168, 76, 0.1)';
    e.currentTarget.style.borderColor = '#8B1A1A';
  }} onMouseLeave={(e) => {
    e.currentTarget.style.background = 'transparent';
    e.currentTarget.style.borderColor = '#C9A84C';
  }}>
    📏 Size Guide
  </button>
)}
```

### **Snippet 3: Components** (Add before final `</div>`)
```javascript
<SizeGuideModal
  isOpen={showSizeChartModal}
  onClose={() => setShowSizeChartModal(false)}
  sizeChart={sizeChart}
  productName={name}
/>

<div className="mobile-only">
  <StickyAddToCartBar
    productName={name}
    displayPrice={displayPrice}
    currentDiscount={currentDiscount}
    currentPrice={currentPrice}
    onAddToCart={handleAddToCart}
    isOutOfStock={currentStock === 0}
  />
</div>
```

### **Snippet 4: CSS** (Add to end of globals.css)
```css
.mobile-only { display: none; }
@media (max-width: 768px) {
  .mobile-only { display: block; }
}
```

---

## 🎯 Expected Results

### **Desktop**
- Size Guide button appears below size selector
- Clicking opens modal with size chart
- Sticky bar is hidden (not visible)

### **Mobile**
- Size Guide button appears below size selector
- Sticky bar appears when scrolled past 400px
- Sticky bar shows product name, price, and Add to Cart button
- Smooth slide-up animation

---

## 📞 Need Help?

If you encounter any issues:

1. **Check the component files exist**:
   - `components/Product/StickyAddToCartBar.jsx`
   - `components/Product/SizeGuideModal.jsx`

2. **Check the state exists** (should already be there):
   ```javascript
   const [showSizeChartModal, setShowSizeChartModal] = useState(false);
   ```

3. **Check browser console** for any error messages

4. **Verify all 4 steps** were completed exactly as shown

---

**Integration Time**: 10 minutes  
**Difficulty**: Easy  
**Files to Edit**: 2 (`pages/product/[slug].js` and `styles/globals.css`)  
**Lines to Add**: ~80 lines total

**Status**: ✅ Ready to integrate - all components are built and tested!
