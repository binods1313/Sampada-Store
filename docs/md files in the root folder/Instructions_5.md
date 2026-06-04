SAMPADA HERO — LOGO CROP FIX ONLY
Files:
  1. components/HomePage/HomeHeroBanner.jsx
  2. components/HomePage/HomeHeroBanner.module.css
  3. E:\Sampada-Store\sanity_abscommerce\schemaTypes\banner.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO NOT touch the ring structure, layout, or any other
part of the hero. Only fix the 3 things below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 1 — HomeHeroBanner.jsx: Stop Sanity cropping the image
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Find the  tag that renders the hero logo.
Change the src to use .fit('max') so Sanity delivers
the full uncropped image:

BEFORE (any of these cause cropping):
  src={urlFor(bannerData.image).url()}
  src={urlFor(bannerData.image).width(X).height(Y).url()}

AFTER:
  src={urlFor(bannerData.image)
    .fit('max')
    .auto('format')
    .url()}

Keep width and height on the Next.js  component
exactly as they are — only change the urlFor chain.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 2 — HomeHeroBanner.module.css: object-fit contain
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Find the CSS class applied to the  tag itself
(likely .logoImg, .heroLogoImg, or .logoImage).

Set object-fit to contain — not cover, not fill:

.logoImg {
  width: 100%;
  height: 100%;
  object-fit: contain;   /* never crops — always shows full image */
  display: block;
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 3 — banner.js: Disable hotspot on image field
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
File: E:\Sampada-Store\sanity_abscommerce\schemaTypes\banner.js

Find the 'image' field. Change hotspot: true to false:

  options: {
    hotspot: false,       /* was true — caused auto-cropping */
    metadata: ['blurhash', 'palette']
  },

Also update the description to guide future uploads:
  description: 'Hero emblem. Upload as square PNG with
  transparent background. Recommended: 512×512px or 1024×1024px.',

After saving banner.js, restart the Sanity dev server.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Full circular logo visible — no cropping on any side
□ Logo same quality/size as the uploaded PNG
□ No white square background bleeding around the logo
□ Footer logo still displays correctly — unchanged
□ Hard refresh browser after changes: Ctrl+Shift+R