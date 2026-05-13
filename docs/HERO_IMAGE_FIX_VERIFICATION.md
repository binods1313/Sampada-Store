# ✅ HERO IMAGE CROP FIX - VERIFICATION GUIDE

## 🔧 What Was Fixed

The hero image was cropping Kavya's face because of incorrect height and positioning settings. Here's what was changed:

### Before (WRONG):
```css
.hero {
  min-height: 60vh;  /* Too short, crops image */
}

.heroImage {
  object-position: center center;  /* Centers crop, cuts off top */
}
```

### After (CORRECT):
```css
.hero {
  min-height: 100vh;  /* Full viewport height */
  width: 100%;
}

.heroImage {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;  /* CRITICAL — anchors face at top */
  z-index: 0;
}
```

### Mobile Fix:
```css
@media (max-width: 768px) {
  .hero {
    min-height: 70vh;  /* Shorter on mobile but still shows face */
  }
  
  .heroImage {
    object-position: top center;  /* Keep face visible on mobile */
  }
}
```

---

## 🧪 How to Verify the Fix

### Step 1: Open the Support Page
Navigate to: **http://localhost:3000/support**

### Step 2: Check Desktop View

**What You Should See:**
- ✅ Kavya's face is fully visible (not cropped from top)
- ✅ Hero section is full viewport height (100vh)
- ✅ Image is anchored at the top (face stays at top)
- ✅ Gradient overlay goes from dark left to transparent right
- ✅ Quote appears in bottom-left quadrant
- ✅ Snow particles falling over the image

**What You Should NOT See:**
- ❌ Face cropped from the top
- ❌ Image centered vertically (cutting off head)
- ❌ Hero section too short (less than full screen)
- ❌ Dark overlay covering the entire face

### Step 3: Check Mobile View

**How to Test:**
1. Open Chrome DevTools (F12)
2. Click the device toolbar icon (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar mobile device
4. Refresh the page

**What You Should See:**
- ✅ Kavya's face still visible on mobile
- ✅ Hero section is 70vh (shorter but still shows face)
- ✅ Image positioned at top center
- ✅ Quote is readable and doesn't overlap face
- ✅ All content stacks in single column below hero

### Step 4: Use DevTools to Verify CSS

**Open DevTools and inspect the hero image:**

1. Right-click on the hero image → "Inspect"
2. Look for the `.heroImage` class in the Styles panel
3. Verify these computed values:

```
Computed Styles:
- object-fit: cover ✅
- object-position: center top ✅
- position: absolute ✅
- top: 0px ✅
- left: 0px ✅
- width: 100% ✅
- height: 100% ✅
- z-index: 0 ✅
```

4. Check the parent `.hero` container:

```
Computed Styles:
- min-height: 100vh ✅ (or larger)
- position: relative ✅
- overflow: hidden ✅
- display: flex ✅
```

---

## 🎯 Z-Index Layer Order

Verify the correct stacking order:

```
Layer 0: .heroImage (z-index: 0) - Background image
Layer 1: .heroOverlay (z-index: 1) - Gradient overlay
Layer 2: .snowCanvas (z-index: 2) - Snow particles
Layer 3: .heroContent (z-index: 3) - Quote text
```

**How to Check:**
1. Open DevTools
2. Click the "Layers" tab (if not visible, click the three dots → More tools → Layers)
3. Verify the stacking order matches above

---

## 🐛 Troubleshooting

### Issue: Face is still cropped from top

**Possible Causes:**
1. Inline styles overriding CSS
2. Parent container has fixed height
3. Browser cache not cleared

**Solutions:**

**A. Check for inline style overrides:**
```javascript
// In DevTools Console, run:
const hero = document.querySelector('.hero');
console.log('Hero inline styles:', hero.style.cssText);
console.log('Hero computed height:', getComputedStyle(hero).minHeight);

const img = document.querySelector('.heroImage');
console.log('Image object-position:', getComputedStyle(img).objectPosition);
```

Expected output:
- Hero min-height: `100vh` or larger
- Image object-position: `center top` or `50% 0%`

**B. Clear browser cache:**
1. Press Ctrl+Shift+Delete
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh the page (Ctrl+F5)

**C. Check Sanity Studio hero styling:**
1. Open Sanity Studio
2. Go to Support Page
3. Scroll to "Hero Section Styling"
4. Check "Hero Height" field
5. If it says "60vh" or "500px", change it to "100vh"
6. Publish the page

### Issue: Image is too zoomed in

**Solution:**
The image might be too small or have wrong aspect ratio. Try:
1. Use a different image from the Kavya folder
2. Recommended: `Kav1.jpeg`, `Kav2.jpeg`, or `Kav3.jpeg`
3. Make sure the image is at least 1920x1080 pixels

### Issue: Face visible on desktop but cropped on mobile

**Solution:**
Check the mobile media query:
```css
@media (max-width: 768px) {
  .heroImage {
    object-position: top center;  /* Must be "top center" not "center" */
  }
}
```

### Issue: Snow particles not visible

**Solution:**
Snow is intentionally subtle. To verify it's working:
1. Open DevTools Console
2. Look for any JavaScript errors
3. Check if canvas element exists: `document.querySelector('.snowCanvas')`
4. If null, the SnowCanvas component isn't rendering

---

## 📐 Technical Details

### Image Positioning Explained

**`object-position: center top`** means:
- **Horizontal**: `center` - Image is centered horizontally
- **Vertical**: `top` - Image is anchored at the top (face stays at top)

This is equivalent to: `object-position: 50% 0%`

**Why this works:**
- When the viewport is wider than the image aspect ratio, the image scales to fill width
- The top of the image (where the face is) stays anchored at the top of the container
- The bottom of the image may be cropped, but the face is always visible

### Alternative: Full-Body Editorial Layout

If you want to show Kavya head-to-toe (no crop at all), use this alternative CSS:

```css
.hero {
  min-height: 100vh;
  background: #0A0A0A;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.heroImageWrap {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 55%;  /* Image takes right 55% of screen */
}

.heroImage {
  width: 100%;
  height: 100%;
  object-fit: contain;  /* Shows full image, no crop */
  object-position: right bottom;
}

/* Fade left edge into dark background */
.heroImageWrap::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, #0A0A0A 0%, transparent 40%);
  z-index: 1;
}
```

This creates an editorial magazine-style layout where:
- Kavya is shown full-body on the right side
- Quote text is on the left side
- Image fades into dark background on the left

---

## ✅ Success Checklist

After the fix, you should be able to check all these boxes:

- [ ] Kavya's face is fully visible (not cropped from top)
- [ ] Hero section is full viewport height (100vh)
- [ ] Image is anchored at top (object-position: center top)
- [ ] Gradient overlay is subtle (doesn't hide face)
- [ ] Quote appears in bottom-left with gold border
- [ ] Snow particles are falling (subtle, not overwhelming)
- [ ] Mobile view: face still visible
- [ ] Mobile view: hero is 70vh (shorter but adequate)
- [ ] No console errors in DevTools
- [ ] Page loads in under 3 seconds

---

## 🎨 Visual Comparison

### BEFORE (Wrong):
```
┌─────────────────────────────────┐
│ [Image cropped - face cut off]  │ ← Face is cut off
│                                  │
│  "Your satisfaction is..."       │
│                                  │
└─────────────────────────────────┘
```

### AFTER (Correct):
```
┌─────────────────────────────────┐
│ [Kavya's face fully visible]    │ ← Face is visible
│                                  │
│                                  │
│                                  │
│  "Your satisfaction is..."       │ ← Quote at bottom
└─────────────────────────────────┘
```

---

## 📝 Files Modified

- ✅ `styles/Support.module.css` - Updated hero image positioning
- ✅ `pages/support.js` - Removed inline height override

---

## 🚀 Next Steps

1. **Test the page** at http://localhost:3000/support
2. **Verify the fix** using the checklist above
3. **Add content in Sanity** if you haven't already
4. **Upload a hero image** from the Kavya folder
5. **Publish and test** on different devices

---

**Status:** ✅ HERO IMAGE CROP FIX APPLIED

The hero image should now display Kavya's face fully without cropping from the top!
