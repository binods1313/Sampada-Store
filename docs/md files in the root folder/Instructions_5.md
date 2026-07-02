
# Project Instructions

## Home Hero Banner Logo Crop Fix (Upstream)
Files:
  1. components/HomePage/HomeHeroBanner.jsx
  2. components/HomePage/HomeHeroBanner.module.css
  3. sanity_abscommerce/schemaTypes/banner.js

DO NOT touch the ring structure, layout, or any other part of the hero. Only fix the 3 things below.

### FIX 1 — HomeHeroBanner.jsx: Stop Sanity cropping the image
Find the tag that renders the hero logo.
Change the src to use .fit('max') so Sanity delivers the full uncropped image:
```javascript
src={urlFor(bannerData.image)
  .fit('max')
  .auto('format')
  .url()}
```

### FIX 2 — HomeHeroBanner.module.css: object-fit contain
Set object-fit to contain:
```css
.logoImg {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
```

### FIX 3 — banner.js: Disable hotspot on image field
Find the 'image' field. Change hotspot: true to false:
```javascript
options: {
  hotspot: false,
  metadata: ['blurhash', 'palette']
},
```

---

## Support Page Hero Image Crop Fix (Stashed Local)
The hero banner on the Support page is cropping the model image — currently it shows only the top half of the photo. I want the full image to be visible without cropping.

### Requirements:
- Set the image's object-fit to contain instead of cover, OR increase the hero section height so the full image fits naturally without being cropped.
- The image should be bottom-aligned (object-position: bottom or object-position: center bottom) so her feet/boots are not cut off.
- Maintain the same dark/neon background aesthetic — you can extend the background color/gradient to fill any empty space around the image.
- Ensure the text overlays on the left and right sides remain properly positioned and readable on all screen sizes.
- The layout should be responsive — on mobile, the full figure should still be visible, possibly centered.

The key technical fix is changing object-fit: cover → object-fit: contain on the <img> or background image, and adjusting the container height to accommodate the full portrait aspect ratio of the photo.

Fix: Center HeroBanner SHOP NOW text on mobile using Footer button logic
Issue
The SHOP NOW → button in the HeroBanner has text that is not centered on mobile browsers. Desktop is fine.The SHOP NOW → button in the footer banner section for "Winter Drop 2026" is perfectly centered on mobile. Use that as the reference.
Scope
Only fix text + arrow centering inside the HeroBanner button. Do not change button width, height, color, padding, font, position, or any other styling.
Task
In components/HeroBanner.tsx, update the HeroBanner CTA button to use the same text-centering approach as the footer banner SHOP NOW → button. If the footer uses a shared component like <GoldButton> or <CtaButton>, replace the hero button with that same component. If the styles are different, copy only the centering-related CSS from the footer button: likely display: inline-flex, align-items: center, justify-content: center, and line-height: 1.
Reference
Check components/FooterBanner.tsx or the "Winter Drop 2026" section for the working button code.
Acceptance criteria
HeroBanner SHOP NOW → text and arrow must be centered exactly like the footer button on iOS Safari + Android Chrome
No visual changes to button size, color, spacing, or placement
Desktop appearance must remain unchanged

# Project Instructions

## Home Hero Banner Logo Crop Fix (Upstream)
Files:
  1. components/HomePage/HomeHeroBanner.jsx
  2. components/HomePage/HomeHeroBanner.module.css
  3. sanity_abscommerce/schemaTypes/banner.js

DO NOT touch the ring structure, layout, or any other part of the hero. Only fix the 3 things below.

### FIX 1 — HomeHeroBanner.jsx: Stop Sanity cropping the image
Find the tag that renders the hero logo.
Change the src to use .fit('max') so Sanity delivers the full uncropped image:
```javascript
src={urlFor(bannerData.image)
  .fit('max')
  .auto('format')
  .url()}
```

### FIX 2 — HomeHeroBanner.module.css: object-fit contain
Set object-fit to contain:
```css
.logoImg {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
```

### FIX 3 — banner.js: Disable hotspot on image field
Find the 'image' field. Change hotspot: true to false:
```javascript
options: {
  hotspot: false,
  metadata: ['blurhash', 'palette']
},
```

---

## Support Page Hero Image Crop Fix (Stashed Local)
The hero banner on the Support page is cropping the model image — currently it shows only the top half of the photo. I want the full image to be visible without cropping.

### Requirements:
- Set the image's object-fit to contain instead of cover, OR increase the hero section height so the full image fits naturally without being cropped.
- The image should be bottom-aligned (object-position: bottom or object-position: center bottom) so her feet/boots are not cut off.
- Maintain the same dark/neon background aesthetic — you can extend the background color/gradient to fill any empty space around the image.
- Ensure the text overlays on the left and right sides remain properly positioned and readable on all screen sizes.
- The layout should be responsive — on mobile, the full figure should still be visible, possibly centered.

The key technical fix is changing object-fit: cover → object-fit: contain on the <img> or background image, and adjusting the container height to accommodate the full portrait aspect ratio of the photo.
=======
Fix: Center HeroBanner SHOP NOW text on mobile using Footer button logicIssue
The SHOP NOW → button in the HeroBanner has text that is not centered on mobile browsers. Desktop is fine.The SHOP NOW → button in the footer banner section for "Winter Drop 2026" is perfectly centered on mobile. Use that as the reference.Scope
Only fix text + arrow centering inside the HeroBanner button. Do not change button width, height, color, padding, font, position, or any other styling.Task
In components/HeroBanner.tsx, update the HeroBanner CTA button to use the same text-centering approach as the footer banner SHOP NOW → button.If the footer uses a shared component like <GoldButton> or <CtaButton>, replace the hero button with that same component. If the styles are different, copy only the centering-related CSS from the footer button: likely display: inline-flex, align-items: center, justify-content: center, and line-height: 1.Reference
Check components/FooterBanner.tsx or the "Winter Drop 2026" section for the working button code.Acceptance criteriaHeroBanner SHOP NOW → text and arrow must be centered exactly like the footer button on iOS Safari + Android ChromeNo visual changes to button size, color, spacing, or placementDesktop appearance must remain unchanged
>>>>>>> f54d793 (Fix HeroBanner CTA button centering on mobile)
