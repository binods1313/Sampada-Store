# ✅ SUPPORT PAGE — FINAL PRE-DELIVERY CHECKLIST

## 🎯 DO NOT SHIP UNTIL ALL CHECKED

### Hero Section — Kavya Full Body Display

**Desktop (1440px):**
- [ ] Kavya's full face visible (not cropped from top)
- [ ] Kavya's full body visible (feet at bottom, head at top)
- [ ] 50/50 split layout (left: quote, right: image)
- [ ] Snow particles falling subtly (look carefully)
- [ ] Gradient fade from left dark to right transparent
- [ ] Quote has gold left border (3px solid #C9A96E)
- [ ] "CUSTOMER SUPPORT" label in gold uppercase

**Desktop (1280px):**
- [ ] Kavya's full face visible
- [ ] Kavya's full body visible
- [ ] Same 50/50 split layout
- [ ] All elements properly sized

**Tablet (768px):**
- [ ] Kavya's full face visible
- [ ] Kavya's full body visible
- [ ] Hero still uses 50/50 split (not stacked yet)

**Mobile (375px):**
- [ ] Hero stacks vertically (image top, quote bottom)
- [ ] Kavya's full face visible
- [ ] Kavya's full body visible
- [ ] Image height: 60vw (min 320px)
- [ ] Quote readable on dark background

---

### All Cards — Gold Border + Hover Lift

**Contact Cards (4):**
- [ ] Visible gold border: `rgba(201,169,110,0.22)`
- [ ] Background: `#0f0f16` (solid, not transparent)
- [ ] Border radius: 10px
- [ ] Padding: 1.5rem (24px)
- [ ] Grid: 2×2 on desktop, 1 column on mobile
- [ ] Gap: 14px
- [ ] **Hover:** Border changes to `rgba(201,169,110,0.6)`
- [ ] **Hover:** Card lifts 4px (`translateY(-4px)`)
- [ ] **Hover:** Shadow appears: `0 8px 24px rgba(0,0,0,0.4)`

**Business Hours Cards (3):**
- [ ] Same card style as Contact Cards
- [ ] Grid: 3 columns on desktop, 1 column on mobile
- [ ] Gap: 14px
- [ ] Holiday notice below with red left border

**Resource Cards (6):**
- [ ] Same card style as Contact Cards
- [ ] Grid: 3 columns on desktop, 2 on tablet, 1 on mobile
- [ ] Gap: 14px
- [ ] Gold arrow (→) appears on hover at bottom-right
- [ ] Arrow opacity: 0 → 1 on hover

---

### FAQ Items — Bordered Cards (NOT Flat Rows)

- [ ] Each FAQ is a bordered card (NOT a flat row with divider)
- [ ] Red left accent bar: 3px solid #8B1A1A
- [ ] Gradient background visible
- [ ] Border: `rgba(201,169,110,0.15)`
- [ ] Gap between cards: 10px
- [ ] Max-width: 740px, centered
- [ ] **Click:** Smooth expand/collapse animation
- [ ] **Open:** Border changes to `rgba(201,169,110,0.45)`
- [ ] **Open:** Chevron rotates 180°
- [ ] **Open:** Answer slides down smoothly

---

### Snow Particles — Subtle (NOT Blizzard)

- [ ] Snow is visible (look carefully at hero section)
- [ ] Snow is subtle (NOT overwhelming)
- [ ] 120 particles total
- [ ] Particle size: 0.4-2.0px (very small)
- [ ] Opacity: 0.08-0.46 (barely visible)
- [ ] Falling slowly (0.3-1.2px/frame)
- [ ] Gentle horizontal drift (sine wave)
- [ ] Pauses when tab is hidden (test by switching tabs)
- [ ] Resumes when tab is visible again

---

### No Console Errors

**Open DevTools Console (F12):**
- [ ] No red errors in console
- [ ] No warnings about missing images
- [ ] No warnings about missing CSS classes
- [ ] No JavaScript errors

---

### No Broken Mobile Layout

**Test at 375px width:**
- [ ] Hero stacks vertically (image top, quote bottom)
- [ ] All grids become single column
- [ ] Cards don't overflow viewport
- [ ] Text is readable (not too small)
- [ ] Buttons are tappable (min 44px height)
- [ ] No horizontal scroll
- [ ] Images load correctly
- [ ] Snow still visible and subtle

---

## 🧪 Quick Visual Tests

### Test 1: Hero Image Display
```
Open http://localhost:3000/support
Look at hero section
✓ Can you see Kavya's face? (YES/NO)
✓ Can you see Kavya's feet? (YES/NO)
✓ Is any part of her body cropped? (YES/NO - should be NO)
```

### Test 2: Card Borders
```
Look at Contact Cards section
✓ Can you see gold borders around cards? (YES/NO)
Hover over a card
✓ Does border get brighter? (YES/NO)
✓ Does card lift up? (YES/NO)
✓ Does shadow appear? (YES/NO)
```

### Test 3: FAQ Cards
```
Look at FAQ section
✓ Are FAQs in bordered cards? (YES/NO - should be YES)
✓ Can you see red left accent bar? (YES/NO)
Click on an FAQ
✓ Does it expand smoothly? (YES/NO)
✓ Does chevron rotate? (YES/NO)
```

### Test 4: Snow Particles
```
Look at hero section carefully
✓ Can you see tiny white dots falling? (YES/NO)
✓ Are they subtle (not overwhelming)? (YES/NO)
Switch to another tab, wait 5 seconds, switch back
✓ Does snow resume falling? (YES/NO)
```

### Test 5: Mobile Layout
```
Resize browser to 375px width (DevTools: Ctrl+Shift+M)
✓ Does hero stack vertically? (YES/NO)
✓ Is image on top? (YES/NO)
✓ Is quote below? (YES/NO)
✓ Are all grids single column? (YES/NO)
✓ Can you still see Kavya's full body? (YES/NO)
```

---

## 📊 DevTools Verification

### Check Hero Image:
```javascript
const img = document.querySelector('[class*="heroModel"]');
console.log('object-fit:', getComputedStyle(img).objectFit);
// Should output: contain (NOT cover)

console.log('object-position:', getComputedStyle(img).objectPosition);
// Should output: bottom center or 50% 100%
```

### Check Card Border:
```javascript
const card = document.querySelector('[class*="contactCard"]');
console.log('border:', getComputedStyle(card).border);
// Should include: rgba(201, 169, 110, 0.22)

console.log('background:', getComputedStyle(card).background);
// Should include: #0f0f16 or rgb(15, 15, 22)
```

### Check Grid Gap:
```javascript
const grid = document.querySelector('[class*="contactGrid"]');
console.log('gap:', getComputedStyle(grid).gap);
// Should output: 14px (NOT 16px or 24px)
```

### Check FAQ Border:
```javascript
const faq = document.querySelector('[class*="faqItem"]');
console.log('border-left:', getComputedStyle(faq).borderLeft);
// Should include: 3px solid rgb(139, 26, 26)
```

---

## 🎯 Critical Success Criteria

### MUST HAVE (Blockers):
1. ✅ Kavya full face AND full body visible at 1440px, 1280px, 768px
2. ✅ All cards have visible gold border
3. ✅ All cards have hover lift effect
4. ✅ FAQ items are bordered cards (NOT flat rows)
5. ✅ Snow is subtle (visible but not a blizzard)
6. ✅ No console errors
7. ✅ No broken mobile layout

### SHOULD HAVE (Important):
- Grid gap: 14px everywhere
- Card padding: 1.5rem (24px)
- Section padding: 72px top/bottom
- Gold underline: 48px × 2px
- FAQ max-width: 740px
- Snow: 120 particles, 0.4-2.0px

### NICE TO HAVE (Polish):
- Smooth transitions (0.25s ease)
- Gradient overlays on hero
- Gold arrow on resource cards
- Sanskrit watermark on CTA section

---

## 🚫 Common Issues to Avoid

### ❌ DON'T SHIP IF:
- Kavya's face is cropped from top
- Kavya's body is cropped from bottom
- Cards have no visible border
- Cards don't lift on hover
- FAQ is a flat list (not bordered cards)
- Snow is too heavy (looks like blizzard)
- Console has red errors
- Mobile layout is broken (horizontal scroll)
- Hero uses `object-fit: cover` (should be `contain`)

### ✅ SHIP WHEN:
- All checklist items above are checked
- Visual tests pass
- DevTools verification passes
- No console errors
- Mobile layout works correctly

---

## 📝 Final Sign-Off

**Before marking as complete:**

1. **Test on real devices** (not just DevTools):
   - [ ] iPhone (Safari)
   - [ ] Android (Chrome)
   - [ ] Desktop (Chrome/Firefox/Safari)

2. **Test all interactions:**
   - [ ] Card hover effects work
   - [ ] FAQ expand/collapse works
   - [ ] Links are clickable
   - [ ] Snow animation runs smoothly

3. **Verify content:**
   - [ ] All text is readable
   - [ ] Images load correctly
   - [ ] No placeholder text remains

4. **Performance check:**
   - [ ] Page loads in < 3 seconds
   - [ ] Snow runs at 60fps
   - [ ] No layout shifts on load

---

**Status:** Ready for final testing at http://localhost:3000/support

**Documentation:** See `SUPPORT_PAGE_FULL_REBUILD_COMPLETE.md` for implementation details
