# Design Document — Stories Page Enhancement

## Overview

Two visual enhancements to `pages/stories/index.js` (Next.js Pages Router):

- **Part A**: Replace the existing plain text hero with a `SpotlightReveal` component featuring a mouse-following clip-path reveal between two Kavya images, with an `EchoCanvas` velocity-ring overlay.
- **Part B**: Add a `SelectedWorksGallery` masonry section at the bottom of the page (above footer) with category filter tabs and gold hover overlays.

## Architecture

### New Files

| File | Purpose |
|------|---------|
| `components/spotlight/EchoCanvas.jsx` | Canvas-based velocity echo rings |
| `components/spotlight/SpotlightReveal.jsx` | Spotlight hero with lerp-smoothed clip-path reveal |
| `components/stories/SelectedWorksGallery.jsx` | Masonry gallery with filter tabs |
| `components/stories/SelectedWorksGallery.module.css` | Styles for gallery |

### Modified Files

| File | Change |
|------|--------|
| `pages/stories/index.js` | Import + render SpotlightReveal (replaces hero), import + render SelectedWorksGallery (appended) |

## Component Design

### SpotlightReveal

- Uses two `<img>` layers: base (dimmed) and revealed (clipped)
- CSS `clip-path: circle(Rpx at Xpx Ypx)` on the top image creates the spotlight
- `requestAnimationFrame` loop applies lerp (factor 0.08) to smooth cursor tracking
- Falls back to static `circle(40% at 50% 40%)` on touch-only devices
- `EchoCanvas` sits at `z-index: 3` between images and text

### EchoCanvas

- Full-size `<canvas>` with `pointer-events: none`
- `ResizeObserver` keeps canvas dimensions in sync with parent
- Each `mousemove` spawns a particle: `{ x, y, radius, maxRadius, alpha, born, lifetime }`
- Animation loop expands radius and fades alpha over 600ms lifetime
- Velocity = `sqrt(dx² + dy²)` scales initial radius (capped at 60px)

### SelectedWorksGallery

- Receives `stories` prop (same data already on the page)
- CSS `columns` masonry: 2 → 3 → 4 at 768px / 1024px breakpoints
- Filter state managed with `useState`; filtered list via `useMemo`
- Hover overlay uses CSS opacity transition (no JS needed)
- CTA links to `/collections/womens-tshirts`

## Design Tokens

| Token | Value |
|-------|-------|
| Dark navy | `#0d1126` |
| Gold | `#c9a96e` |
| Cream | `#f5f0eb` |
| Hero height | `85vh`, min `600px` |
| Lerp factor | `0.08` |
| Spotlight radius | `220px` |
| Echo lifetime | `600ms` |
