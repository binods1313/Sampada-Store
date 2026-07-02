# HERO IMAGE & SPOTLIGHT SIZE UPDATE ✅

**Date**: May 9, 2026  
**Changes**: 
1. Changed Support page hero background to Kav1.jpeg
2. Reduced spotlight circle size by 50% on both Support and Stories pages

---

## CHANGES MADE

### 1. **Support Page Hero Image**
Changed from Kav2.jpeg to Kav1.jpeg

**File**: `pages/support.js`
```javascript
// BEFORE:
<SpotlightRevealClean
  baseImage="/images/Kavya/Kav2.jpeg"
  revealImage="/images/Kavya/Kav3.jpeg"
/>

// AFTER:
<SpotlightRevealClean
  baseImage="/images/Kavya/Kav1.jpeg"  ← Changed to Kav1.jpeg
  revealImage="/images/Kavya/Kav3.jpeg"
/>
```

**Image Location**: `E:\Sampada-Store\public\images\Kavya\Kav1.jpeg`

---

### 2. **Support Page Spotlight Size**
Reduced by 50% (150px → 75px)

**File**: `components/spotlight/SpotlightRevealClean.jsx`
```javascript
// BEFORE:
const SPOTLIGHT_RADIUS = 150 // Larger spotlight for better visibility

// AFTER:
const SPOTLIGHT_RADIUS = 75 // Reduced by 50% from 150px
```

**Visual Impact**:
- Circle diameter: 300px → 150px
- Circle area: 70,686 px² → 17,671 px² (75% smaller area)
- More focused spotlight effect

---

### 3. **Stories Page Spotlight Size**
Reduced by 50% (116px → 58px)

**File**: `components/spotlight/SpotlightReveal.jsx`
```javascript
// BEFORE:
const SPOTLIGHT_RADIUS = 116 // px — 25% smaller than original 155

// AFTER:
const SPOTLIGHT_RADIUS = 58 // Reduced by 50% from 116px
```

**Visual Impact**:
- Circle diameter: 232px → 116px
- Circle area: 42,282 px² → 10,571 px² (75% smaller area)
- More subtle, focused reveal effect

---

## SPOTLIGHT SIZE COMPARISON

### Support Page (SpotlightRevealClean)
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Radius | 150px | 75px | -50% |
| Diameter | 300px | 150px | -50% |
| Area | 70,686 px² | 17,671 px² | -75% |

### Stories Page (SpotlightReveal)
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Radius | 116px | 58px | -50% |
| Diameter | 232px | 116px | -50% |
| Area | 42,282 px² | 10,571 px² | -75% |

---

## VISUAL EFFECT

### Before (Large Spotlight)
```
┌─────────────────────────────────────┐
│                                     │
│         ╭─────────────╮             │
│        │               │            │
│        │   Large       │            │
│        │   Spotlight   │            │
│        │   Circle      │            │
│         ╰─────────────╯             │
│                                     │
└─────────────────────────────────────┘
```

### After (Smaller Spotlight)
```
┌─────────────────────────────────────┐
│                                     │
│            ╭─────╮                  │
│            │Small│                  │
│            │Spot │                  │
│            ╰─────╯                  │
│                                     │
└─────────────────────────────────────┘
```

---

## FILES CHANGED

1. **`pages/support.js`**
   - Line 142: Changed `baseImage` from Kav2.jpeg to Kav1.jpeg

2. **`components/spotlight/SpotlightRevealClean.jsx`**
   - Line 6: Changed `SPOTLIGHT_RADIUS` from 150 to 75

3. **`components/spotlight/SpotlightReveal.jsx`**
   - Line 6: Changed `SPOTLIGHT_RADIUS` from 116 to 58

---

## VERIFICATION CHECKLIST

### Support Page (`/support`)
- [ ] Hero displays Kav1.jpeg as background (darker/base image)
- [ ] Spotlight circle is smaller (75px radius / 150px diameter)
- [ ] Kav3.jpeg reveals in spotlight on cursor hover
- [ ] Spotlight follows cursor smoothly
- [ ] Quote overlay displays on left

### Stories Page (`/stories`)
- [ ] Spotlight circle is smaller (58px radius / 116px diameter)
- [ ] Spotlight effect more subtle and focused
- [ ] Cursor tracking still smooth
- [ ] All text overlays display correctly

---

## TESTING INSTRUCTIONS

### 1. **Test Support Page**
```
http://localhost:3000/support
```

**Check**:
1. Hero shows Kav1.jpeg (new background image)
2. Spotlight circle is noticeably smaller
3. Move cursor over hero → spotlight follows
4. Kav3.jpeg reveals in small circle
5. Quote overlay on left side

### 2. **Test Stories Page**
```
http://localhost:3000/stories
```

**Check**:
1. Spotlight circle is smaller than before
2. More focused reveal effect
3. Cursor tracking still smooth
4. "Kavya" text and quotes display correctly

### 3. **Compare Sizes**
- Support page spotlight: 150px diameter (75px radius)
- Stories page spotlight: 116px diameter (58px radius)
- Support page spotlight is slightly larger than Stories page

---

## IMAGE DETAILS

### Kav1.jpeg (New Support Page Background)
- **Location**: `public/images/Kavya/Kav1.jpeg`
- **Full Path**: `E:\Sampada-Store\public\images\Kavya\Kav1.jpeg`
- **Usage**: Support page hero base image (darker/default)
- **URL**: `/images/Kavya/Kav1.jpeg`

### Kav3.jpeg (Reveal Image)
- **Location**: `public/images/Kavya/Kav3.jpeg`
- **Usage**: Both Support and Stories pages (reveal on hover)
- **URL**: `/images/Kavya/Kav3.jpeg`

---

## SPOTLIGHT RADIUS CALCULATION

### Formula
```
Diameter = Radius × 2
Area = π × Radius²
```

### Support Page
```
Radius: 75px
Diameter: 75 × 2 = 150px
Area: π × 75² = 17,671 px²
```

### Stories Page
```
Radius: 58px
Diameter: 58 × 2 = 116px
Area: π × 58² = 10,571 px²
```

---

## TROUBLESHOOTING

### If Kav1.jpeg doesn't display:
1. Verify file exists: `public/images/Kavya/Kav1.jpeg`
2. Check file name case: Must be exactly `Kav1.jpeg` (not `kav1.jpeg`)
3. Clear browser cache: Hard refresh (Ctrl+Shift+R)
4. Restart dev server: Stop and run `npm run dev`

### If spotlight seems too small:
1. Increase radius in respective component:
   ```javascript
   // For Support page (SpotlightRevealClean.jsx):
   const SPOTLIGHT_RADIUS = 90 // Increase from 75

   // For Stories page (SpotlightReveal.jsx):
   const SPOTLIGHT_RADIUS = 70 // Increase from 58
   ```

### If spotlight seems too large:
1. Decrease radius further:
   ```javascript
   // For Support page:
   const SPOTLIGHT_RADIUS = 60 // Decrease from 75

   // For Stories page:
   const SPOTLIGHT_RADIUS = 45 // Decrease from 58
   ```

---

## DESIGN RATIONALE

### Why Smaller Spotlight?
1. **More Focused**: Draws attention to specific area under cursor
2. **More Elegant**: Subtle reveal effect, not overwhelming
3. **Better UX**: User explores image by moving cursor
4. **Matches Design**: Aligns with Sampada's refined aesthetic

### Why Kav1.jpeg for Support?
1. **User Request**: Specifically requested by user
2. **Better Fit**: May have better composition for Support page
3. **Variety**: Different image from Stories page
4. **Fresh Look**: New visual for Support page hero

---

## NEXT STEPS

1. **Test both pages**: Verify spotlight size and image display
2. **Get user feedback**: Confirm spotlight size is appropriate
3. **Adjust if needed**: Fine-tune radius based on feedback
4. **Document final values**: Update this file with final settings

---

**STATUS**: ✅ COMPLETE
- Support page now uses Kav1.jpeg as background
- Spotlight size reduced by 50% on both pages
- Ready for testing and user feedback
