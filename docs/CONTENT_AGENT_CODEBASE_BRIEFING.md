# Content Agent — Codebase Briefing

Short technical audit for Content Agent work on Sampada-Store.  
Generated from codebase + Sanity production dataset verification.

---

## 1. Blog post body rendering

### Paths

| Surface | URL | Page file | Sanity type | Body field |
|---------|-----|-----------|-------------|------------|
| **Blog (journal)** | `/blog/[slug]` | `pages/blog/[slug].jsx` | `post` | `body` |
| **Stories** | `/stories/[slug]` | `pages/stories/[slug].js` | `story` | `description` |

> **Note:** Blog posts live at **`/blog/[slug]`**, not `/stories/[slug]`. Stories are a separate content type.

### How Portable Text is rendered (blog)

- **Library:** `@portabletext/react` (`PortableText`)
- **Components:** `components/PortableTextComponents.jsx` (`portableTextComponents`)
- **Query:** `body` is fetched as-is (no GROQ projection strip of blocks)

```jsx
// pages/blog/[slug].jsx
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '../../components/PortableTextComponents';

const hasPortableText = post.body && Array.isArray(post.body) && post.body.length > 0;

{hasPortableText ? (
  <PortableText value={post.body} components={portableTextComponents} />
) : post.body && typeof post.body === 'string' ? (
  <p>{post.body}</p>
) : (
  <p>{post.excerpt || ''}</p>
)}
```

### Custom PT components

`components/PortableTextComponents.jsx` only customizes **`types.image`**:

- Sanity image via `urlFor(value).width(800).auto('format').url()`
- Plain `<img>` (not `next/image`)
- Optional `alt` + `caption`

No custom `block` styles, marks filters, or block-type allowlist.

### Conditions that can prevent body from rendering

1. **`body` missing / not an array / empty array** → falls back to string `body`, else `excerpt`.
2. **No filter on block styles** (`normal`, `h2`, etc.) — defaults from `@portabletext/react`.
3. **Unknown custom block types** (anything other than `image` without a component) may not render usefully.
4. **`getStaticPaths`** only prebuilds posts with `publishedAt < now()`; detail query does not re-check publish date (fallback: `blocking`).

### Stories (for comparison)

```jsx
// pages/stories/[slug].js — field is description, not body
{story.description && (
  <PortableText
    value={story.description}
    components={{ ...ptComponents, ...portableTextComponents }}
  />
)}
```

---

## 2. Product slugs

### URL param source

**Yes — the product page uses `slug.current` as the dynamic route param.**

| Item | Value |
|------|--------|
| Route | `pages/product/[slug].js` |
| Public URL | `/product/{slug.current}` |
| Paths query | `slug.current` → `params.slug` |
| Props query | `slug.current == $slug` |

```js
// getStaticPaths
const query = `*[_type == "product" && status in ["published", "active"] && defined(slug.current)] {
  slug { current }
}`;
// → params: { slug: p.slug.current }

// getStaticProps
`*[_type == "product" && status in ["published", "active"] && slug.current == $slug][0]{ ... }`
```

Also requires `status in ["published", "active"]`.

### Slug fixes applied (production)

| Product name | Old slug | New slug | Document `_id` |
|--------------|----------|----------|----------------|
| HyperVision Alpha – HVA-1 | `SunGlasses` | `hypervision-alpha-hva-1` | `5d00a8eb-cfbf-41d0-bb10-e429d20bd7fa` |
| Neural Pulse Core – NPC-1 | `smartwatches` | `neural-pulse-core-npc-1` | `1517b055-76c5-4da4-b518-286a852518b9` |
| Neural Sound Prime – NSP-1 | `headphones Latest` | `neural-sound-prime-nsp-1` | `1ba44701-d988-4a9e-8072-8b1aa00d5cfc` |

Verified in Sanity after patch. Old URLs 404 until caches/paths refresh (ISR 60s; no product on-demand revalidate yet).

---

## 3. ISR / caching setup

### Page `revalidate` values

| Page | `revalidate` | File |
|------|--------------|------|
| Blog post | **60** (seconds) | `pages/blog/[slug].jsx` |
| Blog index | **60** | `pages/blog/index.jsx` |
| Product detail | **60** | `pages/product/[slug].js` |
| Stories detail | **60** | `pages/stories/[slug].js` |

### On-demand revalidate route

| Item | Status |
|------|--------|
| Route | **`pages/api/revalidate.js`** — **exists** |
| Methods | `GET`, `POST` |
| Auth | `SANITY_WEBHOOK_SECRET` or `REVALIDATE_SECRET` (query `?secret=` **or** Sanity HMAC header) |
| Paths busted | `/blog`, `/blog/[slug]` only |
| Product paths | **Not** revalidated by this route |
| Sanity webhook UI | Must be configured at [sanity.io/manage](https://www.sanity.io/manage) → project → API → Webhooks (code is ready; configure URL + secret + filter) |

**Suggested webhook:**

- URL: `https://YOUR_DOMAIN/api/revalidate`
- Filter: `_type == "post"`
- Trigger: Create, Update, Delete
- Projection: `{ _id, _type, "slug": slug.current }`
- Secret: same as `SANITY_WEBHOOK_SECRET` on Vercel

**Manual test:**

```bash
curl "https://YOUR_DOMAIN/api/revalidate?secret=YOUR_SECRET&path=/blog/your-slug"
```

### Cache TTL summary

- **Without webhook:** ISR TTL = **60 seconds** for blog + product pages.
- **With webhook (posts):** near-instant refresh of `/blog` + `/blog/[slug]`.
- Product page also uses Sanity client `fetchOptions(3600)` / `longCache()` for some GROQ calls (client CDN opts; separate from page ISR).

---

## 4. Product page structure (details vs tabs)

### `details` field (Sanity)

- **Rendered as plain text**, not a tab.
- Location: buy column, under **“Details:”** heading.
- Fetched in `getStaticProps` as `details`.
- Also used for meta / `og:description` (truncated).

```jsx
// pages/product/[slug].js
const { _id, name, details, specialty, pros, cons, bestUseCases, ... } = product;

<div className="details-section">
  <h4>Details:</h4>
  <p>{details}</p>
</div>
```

### Description / details tab?

- **No dedicated “Details” tab** wired to `details`.
- **Optional tabs:** `product.productTabs[]` → `components/ProductTabs.jsx`
  - Fields: `tabTitle`, `tabIcon`, `tabContent` (Portable Text)
  - Only mounts if `productTabs.length > 0`
  - Does **not** auto-map `details` into a tab

### Other product copy blocks (below fold)

- `specifications[]` (`feature` / `value`)
- `specialty`, `pros`, `cons`, `bestUseCases`

Schema reference: `sanity_abscommerce/schemaTypes/product.js` (`productTabs`, `details`, etc.)

---

## 5. Image pipeline

### Product images

| Role | Component | Source sizing |
|------|-----------|---------------|
| Main gallery | `next/image` | `urlFor(...).width(600).url()`, `width={600}` `height={500}` |
| Color / thumb | `next/image` | `urlFor(...).width(50|60).height(50|60).url()` |
| Fallback | path string | `/asset/placeholder-image.jpg` |

```js
// pages/product/[slug].js
const mainProductImageSource = selectedVariant?.variantImage?.asset
  ? urlFor(selectedVariant.variantImage).width(600).url()
  : (image?.[currentImageIndex]?.asset
    ? urlFor(image[currentImageIndex]).width(600).url()
    : '/asset/placeholder-image.jpg');
```

### Blog images

| Role | Component | Notes |
|------|-----------|--------|
| Cover | plain `<img>` | Raw `mainImage.asset->url` — **not** `next/image` |
| Body images | plain `<img>` via PT | `urlFor(value).width(800).auto('format')` |

### Stories images

| Role | Component | Notes |
|------|-----------|--------|
| Cover | CSS `background-image` | `urlFor(...).width(1600).height(900).fit('crop')` |
| Gallery | plain `<img>` | `urlFor(...).width(800).height(1000).fit('crop')` |

### `next.config.js` (`images`)

```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/**' },
    // + avatars.githubusercontent.com, images.unsplash.com, picsum.photos
  ],
  formats: ['image/avif', 'image/webp'],
  qualities: [25, 50, 75, 85, 95, 100],
  minimumCacheTTL: 31536000, // 1 year
  deviceSizes: [320, 480, 640, 768, 1024, 1280, 1536, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

Product `<Image>` does not set explicit `quality` prop → Next default (~75), allowed by `qualities` list.

`urlFor` helper: `lib/client.js`.

---

## File index

| Concern | Paths |
|---------|--------|
| Blog PT render | `pages/blog/[slug].jsx` |
| Stories PT render | `pages/stories/[slug].js` |
| PT components | `components/PortableTextComponents.jsx` |
| Product detail + ISR + slug | `pages/product/[slug].js` |
| Product tabs | `components/ProductTabs.jsx`, `components/ProductTabs.module.css` |
| On-demand ISR | `pages/api/revalidate.js` |
| Product schema | `sanity_abscommerce/schemaTypes/product.js` |
| Post schema | `sanity_abscommerce/schemaTypes/post.js` |
| Image config | `next.config.js` |
| Sanity client / `urlFor` | `lib/client.js` |

---

## Agent takeaways

1. Write journal content as Portable Text on **`post.body`** for **`/blog/[slug]`**.
2. Product marketing blurb goes in **`details`** (plain string UI); rich tab content goes in **`productTabs`**.
3. Product URLs must be clean kebab `slug.current` values matching `/product/[slug]`.
4. Default cache is **60s ISR**; blog can go near-instant via Sanity webhook → `/api/revalidate` (products not included unless route is extended).
5. Prefer product images through **`next/image` + Sanity CDN**; blog cover/body currently use raw or PT `<img>`.
