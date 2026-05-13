# 🧪 SUPPORT PAGE — QUICK TEST GUIDE

## ✅ What to Check

### 1. Hero Section (Editorial Split Layout)

**Desktop View:**
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  LEFT (45%)           │  RIGHT (55%)                │
│  ─────────────────    │  ──────────────────────     │
│  CUSTOMER SUPPORT     │                             │
│                       │                             │
│  "Your satisfaction   │     [Kavya Full Body]      │
│   is our legacy..."   │     No Cropping            │
│                       │     object-fit: contain     │
│  [Snow particles]     │                             │
│                       │                             │
└──────────────────────────────────────────────────────┘
```

**✅ Check:**
- [ ] Kavya's full body visible (head to toe)
- [ ] No cropping from top or bottom
- [ ] Quote on left with dark background
- [ ] Image on right (55% width)
- [ ] Gradient fade from left to right
- [ ] Snow particles falling subtly

**Mobile View:**
```
┌──────────────────────┐
│                      │
│  [Kavya Full Body]   │ ← Image on top
│  (50vh height)       │
│                      │
├──────────────────────┤
│  CUSTOMER SUPPORT    │ ← Quote below
│                      │
│  "Your satisfaction  │
│   is our legacy..."  │
│                      │
└──────────────────────┘
```

**✅ Check:**
- [ ] Image stacks on top
- [ ] Quote below on dark background
- [ ] Gradient fades from top to bottom
- [ ] Still no cropping

---

### 2. Contact Cards (Match Homepage Style)

**Visual:**
```
┌─────────────┐  ┌─────────────┐
│   ┌───┐     │  │   ┌───┐     │
│   │ 📧│     │  │   │ 💬│     │
│   └───┘     │  │   └───┘     │
│ Email       │  │ WhatsApp    │
│ support@... │  │ +91 987...  │
│ We respond  │  │ Quick resp  │
└─────────────┘  └─────────────┘
```

**✅ Check:**
- [ ] Background: `#0f0f14` (solid, not transparent)
- [ ] Border: `rgba(201,169,110,0.2)` (subtle gold)
- [ ] NO box-shadow by default
- [ ] Grid gap: 16px (not 24px)
- [ ] Padding: 1.5rem (24px)
- [ ] 2x2 grid on desktop
- [ ] 1 column on mobile

**Hover Effect:**
- [ ] Border changes to `rgba(201,169,110,0.55)` (brighter gold)
- [ ] Card lifts 3px (`translateY(-3px)`)
- [ ] Box-shadow appears: `0 4px 16px rgba(0,0,0,0.3)`
- [ ] Transition: 0.25s ease

---

### 3. Business Hours Cards

**✅ Check:**
- [ ] Same card style as Contact Cards
- [ ] 3 cards side-by-side on desktop
- [ ] 1 column on mobile
- [ ] Grid gap: 16px
- [ ] Holiday notice below with red left border

---

### 4. FAQ Cards (Bordered Sultry Style)

**Visual:**
```
┃ How long does shipping take?              ▼
└──────────────────────────────────────────────

┃ What is your return policy?               ▲
│
│ We offer a 7-day easy return policy...
│
└──────────────────────────────────────────────
```

**✅ Check:**
- [ ] Red left accent bar: 3px solid #8B1A1A
- [ ] Gradient background
- [ ] Border: `rgba(201,169,110,0.15)`
- [ ] Gap between cards: 10px
- [ ] Chevron rotates 180° when open
- [ ] Smooth expand/collapse animation
- [ ] Open card border: `rgba(201,169,110,0.45)`

---

### 5. Resource Cards

**✅ Check:**
- [ ] Same card style as Contact Cards
- [ ] 3 columns on desktop
- [ ] 2 columns on tablet
- [ ] 1 column on mobile
- [ ] Grid gap: 16px
- [ ] Gold arrow (→) appears on hover at bottom-right
- [ ] Arrow opacity: 0 → 1 on hover

---

### 6. Snow Particles

**✅ Check:**
- [ ] 120 particles total
- [ ] Particle size: 0.4-1.8px (very small)
- [ ] Opacity: 0.08-0.45 (subtle)
- [ ] Falling speed: 0.3-1.1px/frame (slow)
- [ ] Horizontal drift: gentle sine wave
- [ ] NOT a blizzard (should be barely noticeable)
- [ ] Pauses when tab is hidden
- [ ] 60fps performance (check DevTools)

---

## 🎯 Quick DevTools Checks

### Check Card Background:
```javascript
const card = document.querySelector('.contactCard');
console.log(getComputedStyle(card).background);
// Should output: #0f0f14 or rgb(15, 15, 20)
```

### Check Card Shadow:
```javascript
const card = document.querySelector('.contactCard');
console.log(getComputedStyle(card).boxShadow);
// Should output: none (before hover)
```

### Check Hero Image:
```javascript
const img = document.querySelector('.heroImage');
console.log(getComputedStyle(img).objectFit);
// Should output: contain (NOT cover)
console.log(getComputedStyle(img).objectPosition);
// Should output: bottom center or 50% 100%
```

### Check Grid Gap:
```javascript
const grid = document.querySelector('.contactGrid');
console.log(getComputedStyle(grid).gap);
// Should output: 16px (NOT 24px)
```

### Check Snow Particle Count:
```javascript
// Open Console, wait 2 seconds, then run:
const canvas = document.querySelector('.snowCanvas');
console.log('Canvas found:', canvas !== null);
// Should output: true
```

---

## 📱 Responsive Testing

### Desktop (1440px):
1. Open http://localhost:3000/support
2. Check all sections match specifications above
3. Hover over cards to verify effects

### Tablet (768px):
1. Resize browser to 768px width (DevTools: Ctrl+Shift+M)
2. Resources should show 2 columns
3. Other sections maintain desktop layout

### Mobile (375px):
1. Resize browser to 375px width
2. Hero should stack vertically
3. All grids should be single column
4. Cards should have 1.25rem padding

---

## ⚡ Performance Check

### FPS Test:
1. Open DevTools → Performance tab
2. Click Record
3. Wait 5 seconds
4. Stop recording
5. Check FPS graph: Should be stable at 60fps

### Tab Pause Test:
1. Open Support page
2. Watch snow particles falling
3. Switch to another tab
4. Wait 5 seconds
5. Switch back
6. Snow should resume (was paused while hidden)

---

## 🐛 Common Issues

### Issue: Kavya is cropped
**Fix:** Check `object-fit: contain` in DevTools

### Issue: Cards have glass effect
**Fix:** Background should be `#0f0f14`, not `rgba(255,255,255,0.03)`

### Issue: Cards have shadow by default
**Fix:** Remove default box-shadow, only show on hover

### Issue: Grid gap is too wide
**Fix:** Should be `16px`, not `24px`

### Issue: Snow is too visible
**Fix:** Reduce opacity range to 0.08-0.45

---

## ✅ Final Checklist

Before marking as complete, verify:

- [ ] Hero shows Kavya full body (no crop)
- [ ] Hero uses editorial split layout (45% left, 55% right)
- [ ] All cards have `#0f0f14` background
- [ ] All cards have NO default box-shadow
- [ ] All grid gaps are 16px
- [ ] All card padding is 1.5rem (24px)
- [ ] Section padding is 72px top/bottom
- [ ] Gold underline is 48px × 2px
- [ ] FAQ cards have red left accent bar
- [ ] Snow is subtle (120 particles, 0.4-1.8px)
- [ ] Responsive at 375px, 768px, 1280px, 1440px
- [ ] No console errors
- [ ] 60fps performance
- [ ] Snow pauses when tab hidden

---

**Status:** Ready for testing at http://localhost:3000/support

**Documentation:** See `SUPPORT_PAGE_REDESIGN_COMPLETE.md` for full details
