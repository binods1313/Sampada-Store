# SUPPORT PAGE — READY TO TEST ✅

**Date**: May 9, 2026  
**Status**: ✅ IMPLEMENTATION COMPLETE  
**Next Step**: User testing required

---

## WHAT WAS COMPLETED

### ✅ Hero Section — SpotlightReveal Implementation
- **Component**: SpotlightReveal (same as Stories page)
- **Base Image**: `/images/Kavya/Kav2.jpeg` ✅ (exists)
- **Reveal Image**: `/images/Kavya/Kav3.jpeg` ✅ (exists)
- **Effect**: Cursor-following spotlight reveals Kav3 over Kav2
- **Quote Overlay**: Left side with gold styling
- **Layout**: Full viewport height (100vh)
- **Mobile**: Responsive with quote at bottom

### ✅ Code Changes
- **Removed**: SnowCanvas component (old hero)
- **Removed**: Old hero CSS (.hero, .heroLeft, .heroRight, .heroModel)
- **Added**: SpotlightReveal integration
- **Added**: Quote overlay styles
- **Updated**: Mobile responsive styles

### ✅ Syntax Validation
- **JavaScript**: No syntax errors ✅
- **CSS**: Valid module styles ✅
- **Imports**: All components exist ✅

---

## HOW TO TEST

### 1. **Start Development Server**
```bash
npm run dev
```

### 2. **Visit Support Page**
```
http://localhost:3000/support
```

### 3. **Test Hero Section**
- [ ] Hero displays full viewport height
- [ ] Kav2.jpeg shows as base image (darker/muted)
- [ ] Move cursor over hero → Kav3.jpeg reveals in spotlight
- [ ] Spotlight follows cursor smoothly
- [ ] Quote appears on left side with gold styling
- [ ] "CUSTOMER SUPPORT" label visible
- [ ] Quote text readable with gold accent on "attention"

### 4. **Test Responsive**
- [ ] Desktop (1440px+): Quote on left, full hero
- [ ] Tablet (768px-1024px): Quote on left, full hero
- [ ] Mobile (<768px): Quote at bottom, full viewport hero

### 5. **Test Other Sections**
- [ ] Contact cards display with gold borders
- [ ] Support hours cards display correctly
- [ ] FAQ accordion works (click to expand)
- [ ] Resources cards display with hover effect
- [ ] Ticket CTA section displays

---

## EXPECTED BEHAVIOR

### Hero Section
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [Quote Overlay]              [Kavya Image]            │
│  CUSTOMER SUPPORT             Full viewport            │
│  "Your satisfaction           Kav2.jpeg base           │
│   is our legacy..."           Kav3.jpeg on cursor      │
│                               Spotlight follows mouse   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Cursor Interaction
1. **Default**: Kav2.jpeg visible (darker/muted)
2. **Cursor hover**: 116px spotlight circle follows cursor
3. **Inside spotlight**: Kav3.jpeg revealed (brighter/clearer)
4. **Smooth tracking**: Lerp animation (LERP_FACTOR = 0.08)

---

## COMPARISON: STORIES PAGE vs SUPPORT PAGE

### Stories Page Hero
- SpotlightReveal component ✅
- Full viewport height ✅
- Cursor spotlight effect ✅
- Quote overlays on left/right ✅
- "Meet the Face" / "Kavya" text ✅

### Support Page Hero (NEW)
- SpotlightReveal component ✅
- Full viewport height ✅
- Cursor spotlight effect ✅
- Quote overlay on left ✅
- "CUSTOMER SUPPORT" label ✅
- Support promise quote ✅

**Result**: Both pages now use the same hero style ✅

---

## TROUBLESHOOTING

### If hero doesn't display:
1. Check browser console for errors
2. Verify images exist: `/images/Kavya/Kav2.jpeg`, `/images/Kavya/Kav3.jpeg`
3. Check SpotlightReveal component: `components/spotlight/SpotlightReveal.jsx`
4. Verify CSS module import: `styles/Support.module.css`

### If cursor effect doesn't work:
1. Check browser supports `clip-path` CSS
2. Verify pointer device (fine pointer required for full effect)
3. Check SpotlightReveal component is rendering
4. Open DevTools → Elements → Inspect hero section

### If quote doesn't show:
1. Check z-index: `.heroQuoteOverlay` should be z-index 40
2. Verify CSS module classes are applied
3. Check quote text is not empty
4. Verify left padding: `padding: 0 60px`

---

## FILES MODIFIED

1. **`pages/support.js`**
   - Line 1-7: Updated imports (removed useEffect/useRef)
   - Line 140-152: New hero section with SpotlightReveal
   - Removed: SnowCanvas component (lines 9-90)

2. **`styles/Support.module.css`**
   - Line 14-67: New hero styles (.heroSpotlight, .heroQuoteOverlay)
   - Removed: Old hero styles (.hero, .heroLeft, .heroRight, .heroModel, .snowCanvas)
   - Line 450-470: Updated mobile responsive styles

---

## DOCUMENTATION CREATED

1. **`docs/SUPPORT_PAGE_SPOTLIGHT_HERO_COMPLETE.md`**
   - Full implementation details
   - Code changes
   - Verification checklist

2. **`docs/SUPPORT_HERO_FIX_SUMMARY.md`**
   - Issue summary
   - What was wrong
   - What was fixed

3. **`docs/SUPPORT_PAGE_READY_TO_TEST.md`** (this file)
   - Testing instructions
   - Expected behavior
   - Troubleshooting guide

---

## NEXT STEPS

1. **User Testing**: User needs to test the page and verify hero displays correctly
2. **Feedback**: User should report if hero works as expected
3. **Adjustments**: Make any necessary tweaks based on user feedback

---

**STATUS**: ✅ READY FOR USER TESTING

The Support page hero has been completely rebuilt with SpotlightReveal component. All old code removed, new implementation complete. Syntax validated. Ready for user to test at `http://localhost:3000/support`.
