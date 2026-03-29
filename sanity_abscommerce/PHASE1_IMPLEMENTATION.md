# Sanity Phase 1 Implementation Guide

## 🎯 Overview

This guide covers the Phase 1 quick wins implementation for Sampada-Store using Sanity CMS:

1. ✅ **Media Library** - Centralized asset management
2. ✅ **SEO Fields** - Enhanced product/category metadata
3. ✅ **Image Focal Points** - Better image cropping control
4. ✅ **Bulk Editing Tools** - Mass update capabilities

---

## 📁 Files Modified/Created

### New Files
```
sanity_abscommerce/
├── schemaTypes/
│   └── seoFields.js              # Reusable SEO field definitions
├── plugins/
│   └── bulk-edit/
│       ├── index.js              # Plugin exports
│       ├── BulkEditTool.jsx      # General bulk edit tool
│       └── BulkPriceUpdate.jsx   # Price-specific bulk updater
└── scripts/
    └── migrate-images.js         # Migration script for existing content
```

### Modified Files
```
sanity_abscommerce/
├── sanity.config.js              # Added tools configuration
├── schemaTypes/
│   ├── product.js                # Added SEO fields, enhanced images
│   ├── category.js               # Added SEO fields, image field
│   ├── banner.js                 # Enhanced images, added SEO
│   └── aboutUs.js                # Enhanced images, added SEO
```

---

## 🚀 Setup Instructions

### 1. Install Dependencies (if needed)

```bash
cd sanity_abscommerce
npm install
```

### 2. Enable Media Library

The Media Library is **enabled by default** in Sanity v4+. To access it:

1. Go to your Sanity Studio (usually `http://localhost:3333/studio`)
2. Click the **Media** tab in the left sidebar
3. Or visit `https://www.sanity.io/manage/personal/project/7lh35oho`

**Features enabled:**
- ✅ Automatic image optimization
- ✅ Focal point setting (hotspot)
- ✅ Blurhash generation
- ✅ Color palette extraction
- ✅ Image dimensions storage

### 3. Deploy Updated Schema

```bash
cd sanity_abscommerce
npm run build
npm run deploy
```

### 4. Run Migration Script (Optional)

If you have existing products/categories without SEO fields or alt text:

```bash
# Set your API token first
export SANITY_API_TOKEN="your_personal_api_token"

# Run migration
npm run migrate-images

# Or with auto-confirm
npm run migrate-images -- --yes
```

**What the migration does:**
- Adds alt text to existing images (generated from product names)
- Creates basic SEO metadata for products and categories
- Preserves all existing image assets

---

## 🎨 New Features

### 1. SEO Fields

All content types now include an **SEO Settings** group with:

| Field | Description | Best Practice |
|-------|-------------|---------------|
| Meta Title | Search engine title | 50-60 characters |
| Meta Description | Search snippet | 150-160 characters |
| Focus Keywords | Internal tracking | 3-5 relevant terms |
| Social Sharing Image | OG image for social | 1200x630px |
| Alt Text | Accessibility | Descriptive text |
| Canonical URL | Duplicate content | Full URL if needed |
| No Index | Search visibility | Uncheck for public content |

**Usage in Studio:**
- Scroll to the "SEO Settings" section in any product/category
- Fill in the fields for better search rankings
- Preview how it will appear in search results

### 2. Image Focal Points

All image fields now support:

- **Hotspot Selection**: Click and drag to set focal point
- **Automatic Optimization**: Sanity CDN handles resizing
- **Blurhash**: Low-quality placeholder while loading
- **Color Palette**: Extracted dominant colors

**How to set focal points:**
1. Upload or select an image
2. Click the "Edit" button on the image
3. Drag the focal point circle to the important area
4. Save - the focal point is used for all crops

### 3. Bulk Editing Tools

Access via the tools menu in Sanity Studio:

#### 📝 Bulk Edit Tool
- Select multiple products/categories
- Update common fields at once
- Modes: Set, Increase, Decrease, Percentage

**Use cases:**
- Mark 50 products as "Active" for a launch
- Increase all inventory counts by 10
- Change category for multiple products

#### 💰 Price Updates Tool
- Filter by category
- Apply percentage or fixed changes
- Preview changes before applying
- See total impact on catalog value

**Use cases:**
- Holiday sale: 20% off all Electronics
- Price increase: +$5 on all accessories
- Margin adjustment: 15% increase on low-margin items

---

## 📊 Content Releases (Scheduled Publishing)

**Content Releases** are enabled via Sanity Manage:

1. Go to `https://www.sanity.io/manage`
2. Select your project (abscommerce)
3. Navigate to **Content Releases**
4. Create a new release for coordinated launches

**Example workflow:**
```
1. Create release: "Diwali Sale 2026"
2. Set publish date: October 20, 2026, 12:00 AM IST
3. Add all sale banners, updated prices, featured products
4. Review all changes together
5. Schedule - everything publishes automatically!
```

---

## 🔧 Configuration Options

### Media Library Settings

Access at: `https://www.sanity.io/manage/project/7lh35oho/settings/media`

Recommended settings:
- ✅ Enable automatic image optimization
- ✅ Store image dimensions
- ✅ Generate blurhash placeholders
- ✅ Extract color palettes

### API Usage

Access optimized images in your frontend:

```javascript
import { urlForImage } from '@/sanity/lib/image'

// With focal point-aware cropping
const imageUrl = urlForImage(product.image[0])
  .width(800)
  .height(600)
  .fit('crop')
  .url()

// With blurhash placeholder
<Image
  src={imageUrl}
  alt={product.image[0].alt}
  placeholder="blur"
  blurDataURL={product.image[0].asset.metadata.blurhash}
/>
```

---

## ✅ Testing Checklist

Before deploying to production:

### In Sanity Studio
- [ ] Open a product and verify SEO fields appear
- [ ] Upload a new image and set a focal point
- [ ] Test Bulk Edit tool with 2-3 products
- [ ] Test Price Updates tool with a small batch

### On Your Website
- [ ] Product images display correctly
- [ ] Focal points are respected in crops
- [ ] SEO meta tags render in page source
- [ ] Social sharing images appear correctly

### Performance
- [ ] Images are optimized (check Network tab)
- [ ] Blurhash placeholders show during load
- [ ] No console errors related to images

---

## 🎯 Next Steps (Phase 2)

After Phase 1 is stable, consider:

1. **Multiple Studios**: Separate views for different teams
2. **Content Agent**: AI-powered content management (beta access)
3. **Canvas**: Visual content creation workflow
4. **Custom Apps**: Build specialized tools for your workflow
5. **Advanced Workflows**: Review/approval processes

---

## 📞 Support & Resources

### Documentation
- [Sanity Media Library](https://www.sanity.io/docs/media-library)
- [Content Releases](https://www.sanity.io/docs/content-releases)
- [Image Focal Points](https://www.sanity.io/docs/image-focal-points)
- [SEO Best Practices](https://www.sanity.io/docs/seo)

### Your Project
- **Studio URL**: `http://localhost:3333/studio` (dev)
- **Manage URL**: `https://www.sanity.io/manage/project/7lh35oho`
- **API Version**: `2024-05-18`
- **Dataset**: `production`

---

## 🐛 Troubleshooting

### Images not showing focal points
```bash
# Clear Sanity cache
npm run clean
npm run dev
```

### SEO fields not appearing
```bash
# Rebuild schema
npm run build
# Redeploy
npm run deploy
```

### Migration script fails
```bash
# Check API token
echo $SANITY_API_TOKEN

# Verify token has write permissions
# Go to: https://www.sanity.io/manage/personal/project/7lh35oho/api
```

---

**Last Updated**: March 29, 2026  
**Version**: 1.0.0  
**Status**: ✅ Phase 1 Complete
