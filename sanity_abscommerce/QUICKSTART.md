# 🚀 Quick Start Guide - Sanity Phase 1

## Getting Started (5 minutes)

### Step 1: Install Dependencies

```bash
cd sanity_abscommerce
npm install
```

### Step 2: Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Generate an API token:
# 1. Go to https://www.sanity.io/manage/personal/project/7lh35oho/api
# 2. Click "Create API token"
# 3. Name it "Migration Script"
# 4. Set permissions to "write"
# 5. Paste the token in .env
```

### Step 3: Start Sanity Studio

```bash
npm run dev
```

Studio will be available at: `http://localhost:3333/studio`

---

## 🎯 What's New

### 1. Media Library (Always Available)

**Access**: Click the **Media** icon in Sanity Studio sidebar

**Features**:
- 📸 Upload and organize all images/videos
- 🎯 Set focal points on images
- ⚡ Automatic image optimization
- 🎨 Color palette extraction

**How to use**:
1. Click Media tab
2. Upload images
3. Click an image → Edit → Drag to set focal point
4. Use in your content with automatic cropping

---

### 2. SEO Fields (New)

**Available on**: Products, Categories, Banners, About Us

**How to use**:
1. Open any product/category
2. Scroll to "SEO Settings" section
3. Fill in:
   - **Meta Title** (50-60 chars)
   - **Meta Description** (150-160 chars)
   - **Social Image** (1200x630px recommended)
4. Save

**Example**:
```
Product: "Wireless Bluetooth Headphones"
Meta Title: "Wireless Bluetooth Headphones - Premium Sound | Sampada Store"
Meta Description: "Experience premium sound with our Wireless Bluetooth Headphones. 30hr battery, noise cancellation. Free shipping across India."
```

---

### 3. Image Focal Points (Enhanced)

**Available on**: All image fields

**How to use**:
1. Upload/select an image
2. Click the **Edit** button (pencil icon)
3. Drag the circle to the important part
4. Save

**Frontend usage**:
```javascript
import { urlForImage } from '@/sanity/lib/image'

// Image will be cropped based on focal point
const imageUrl = urlForImage(product.image[0])
  .width(800)
  .height(600)
  .fit('crop')
  .url()
```

---

### 4. Bulk Editing Tools (New)

Access via the **tool icons** in Sanity Studio sidebar:

#### 📝 Bulk Edit Tool

**Use for**: General mass updates

**Steps**:
1. Select content type (Products, Categories, Banners)
2. Click "Refresh List" to load documents
3. Select documents to update (or all)
4. Choose field to update (Price, Status, Inventory)
5. Choose update mode (Set, Increase, Decrease, Percentage)
6. Enter value
7. Click "Update X Documents"

**Example**: Mark 20 products as "Active" for launch
```
1. Type: Products
2. Select: All 20 products
3. Field: Status
4. Mode: Set
5. Value: active
6. Update!
```

---

#### 💰 Price Updates Tool

**Use for**: Price changes across catalog

**Steps**:
1. Filter by category (optional)
2. Choose update type:
   - **Percentage**: +10% or -20%
   - **Fixed**: +$5 or -$3
   - **Set Price**: All to $29.99
3. Enter value
4. Review preview table
5. Click "Apply Price Updates"

**Example**: Holiday Sale - 20% off Electronics
```
1. Category: Electronics
2. Update Type: Percentage Change
3. Value: -20
4. Preview shows all changes
5. Apply!
```

---

## 📅 Content Releases (Scheduled Publishing)

**Access**: https://www.sanity.io/manage/project/7lh35oho

**How to use**:
1. Click "Content Releases"
2. "Create Release"
3. Name it (e.g., "Diwali Sale 2026")
4. Set publish date/time
5. Add documents to release
6. Make your changes
7. Schedule release

**Benefits**:
- ✅ Coordinate multiple changes
- ✅ Schedule launches in advance
- ✅ One-click rollback if needed
- ✅ Audit trail of all changes

---

## 🔄 Migration Script (One-Time Setup)

If you have existing products without SEO fields:

```bash
# Run migration
npm run migrate-images

# Or auto-confirm
npm run migrate-images:confirm
```

**What it does**:
- Adds alt text to all product images
- Creates basic SEO metadata
- Preserves existing content

**Safe to skip** if you want to fill SEO data manually!

---

## ✅ Testing Checklist

### In Studio
- [ ] Open a product → See SEO fields
- [ ] Upload image → Set focal point
- [ ] Try Bulk Edit tool
- [ ] Try Price Updates tool

### On Website (after deploying schema)
- [ ] Product pages load correctly
- [ ] Images crop properly on mobile
- [ ] SEO meta tags in page source
- [ ] Social sharing preview works

---

## 🆘 Troubleshooting

### "Cannot find module '@sanity/ui'"
```bash
npm install @sanity/ui
```

### Bulk edit tools not showing
```bash
# Rebuild studio
npm run build
npm run dev
```

### Migration script permission error
```bash
# Check your API token has write permissions
# Go to: https://www.sanity.io/manage/personal/project/7lh35oho/api
# Create new token with "write" permission
```

### Images not optimizing
```bash
# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

---

## 📚 Resources

- **Full Documentation**: `PHASE1_IMPLEMENTATION.md`
- **Sanity Docs**: https://www.sanity.io/docs
- **Media Library**: https://www.sanity.io/docs/media-library
- **Image Optimization**: https://www.sanity.io/docs/image-focal-points

---

## 🎉 You're Ready!

Your Sanity Studio is now equipped with:
- ✅ Centralized Media Library
- ✅ SEO optimization fields
- ✅ Smart image focal points
- ✅ Bulk editing capabilities
- ✅ Scheduled publishing (Content Releases)

**Next time**: Phase 2 - Multiple Studios, Content Agent, Canvas!

---

**Questions?** Check `PHASE1_IMPLEMENTATION.md` or the Sanity docs.
