# Portrait Ratio Update Summary (3:4)

**Date:** June 20, 2026  
**Change:** Switched from Square (1:1) to Portrait (3:4) ratio for leadership images  
**Status:** ✅ Complete

---

## What Changed

### Previous Approach (Square):
- Aspect Ratio: 1:1 (square)
- Hotspot: Disabled
- Object Fit: `contain` (shows full image with padding)
- Dimensions: 800x800px

### New Approach (Portrait):
- Aspect Ratio: 3:4 (portrait)
- Hotspot: **Enabled** ✅
- Object Fit: `cover` (edge-to-edge, respects focal point)
- Dimensions: 600x800px, 800x1066px, 900x1200px

---

## Why Portrait Ratio?

### Benefits of 3:4 Portrait:
✅ **More Professional** - Standard portrait photography ratio  
✅ **Better for People** - Natural vertical composition for portraits  
✅ **Space Efficient** - Fits more cards in grid on desktop  
✅ **Hotspot Control** - Editors can control focal point  
✅ **Edge-to-Edge** - No letterboxing, seamless look  

### Use Cases:
- Professional headshots
- Corporate portraits
- Team member photos
- Leadership profiles

---

## Files Modified

### 1. Sanity Schema
**File:** `sanity_abscommerce/schemaTypes/team.js`

```javascript
// Changed from:
hotspot: false

// Changed to:
hotspot: true  // ✅ Enables focal point control
```

---

### 2. Frontend Component
**File:** `pages/team.js`

```javascript
// Changed from:
aspectRatio: '1 / 1'          // Square
objectFit: 'contain'           // Show full image
.width(800).height(800)       // Square dimensions

// Changed to:
aspectRatio: '3 / 4'           // Portrait
objectFit: 'cover'             // Edge-to-edge
objectPosition: 'center top'   // Keep faces visible
.width(600).height(800)        // Portrait dimensions
.fit('crop')                   // Crop to fit
.crop('focalpoint')            // Use hotspot
```

---

### 3. CSS Module
**File:** `styles/Team.module.css`

```css
/* Changed from: */
.leadershipImageWrapper {
  aspect-ratio: 1 / 1;
  object-fit: contain;
}

/* Changed to: */
.leadershipImageWrapper {
  aspect-ratio: 3 / 4;
  object-fit: cover;
  object-position: center top;
}
```

---

### 4. Documentation
**Files Updated:**
- `docs/TEAM_PAGE_STUDIO_FILL_GUIDE.md` - All 4 leadership image specs
- `docs/TEAM_IMAGE_CROPPING_FIX.md` - Updated guidelines
- `docs/PORTRAIT_RATIO_UPDATE_SUMMARY.md` - This file

---

## Image Upload Instructions

### For Content Editors:

1. **Dimensions**: Upload portrait images
   - Recommended: 800x1066px
   - Minimum: 600x800px
   - Maximum: 900x1200px

2. **Aspect Ratio**: 3:4 (portrait/vertical)
   - Height should be 4/3 times the width
   - Example: 600 wide × 800 tall = 3:4 ratio

3. **Composition**:
   - Include head and upper torso (three-quarter length)
   - Leave space above head
   - Face should be in upper 40% of frame

4. **Use Hotspot in Sanity Studio**:
   - After uploading image, click to edit
   - Drag hotspot circle to face
   - This ensures face stays centered in all displays
   - Save image

5. **File Format**:
   - JPG or PNG
   - Under 500KB (optimize before upload)

---

## Hotspot Tool Usage

### What is Hotspot?
The hotspot tool in Sanity Studio allows you to mark the most important part of an image (usually the face in portraits). When the image is displayed at different sizes or aspect ratios, Sanity's image API ensures the hotspot area stays visible and centered.

### How to Use:
1. Upload your portrait image in Sanity Studio
2. Click on the uploaded image
3. You'll see a circular hotspot marker
4. Drag it to position on the subject's face
5. Click "Save" or "Apply"
6. The frontend will now use this focal point when cropping

### Why It Matters:
- **Without hotspot**: Image crops from center, may cut off face
- **With hotspot**: Image crops to keep face visible, professional result

---

## Technical Details

### Sanity Image API Parameters:

```javascript
urlFor(member.image)
  .width(600)           // Target width
  .height(800)          // Target height (3:4 ratio)
  .fit('crop')          // Crop to exact dimensions
  .crop('focalpoint')   // Use hotspot as crop center
  .url()
```

### CSS Styles:

```css
.container {
  aspect-ratio: 3 / 4;      /* Portrait container */
  overflow: hidden;          /* Clip overflow */
}

.image {
  object-fit: cover;         /* Fill container, may crop */
  object-position: center top; /* Prioritize top (faces) */
}
```

---

## Migration from Square to Portrait

### If You Already Have Square Images Uploaded:

**Option 1: Re-Upload Portrait Images (Recommended)**
1. Get new portrait photos (3:4 ratio)
2. Upload to Sanity Studio
3. Set hotspot on face
4. Delete old square images

**Option 2: Crop Existing Images**
1. Download existing square images
2. Crop to 3:4 ratio using photo editor:
   - If 800x800: Crop to 600x800 (remove 100px from each side)
   - If 1000x1000: Crop to 750x1000
3. Re-upload to Sanity Studio
4. Set hotspot on face

**Option 3: Keep Square (Not Recommended)**
- Square images will work but may have padding
- Hotspot tool will still help keep faces centered
- Consider updating for better appearance

---

## Consistency Across Team Members

### All leadership team members now use:
- ✅ **Aarav Mehta** - 3:4 portrait with hotspot
- ✅ **Nisha Rao** - 3:4 portrait with hotspot
- ✅ **Rohan Kapoor** - 3:4 portrait with hotspot
- ✅ **Maya Iyer** - 3:4 portrait with hotspot

### Ensures:
- Uniform card heights in grid
- Professional, consistent look
- Faces always visible
- No unpredictable cropping

---

## Testing Checklist

After uploading portrait images with hotspot:

- [ ] Upload 3:4 portrait image in Sanity Studio
- [ ] Set hotspot on face
- [ ] Save and publish
- [ ] View Team page on desktop - check portrait displays correctly
- [ ] View Team page on mobile - check portrait displays correctly
- [ ] Verify face is centered and visible
- [ ] Check no head or shoulders cropped off
- [ ] Test with different browser zoom levels
- [ ] Verify consistent sizing across all 4 leadership cards
- [ ] Check grid layout looks professional

---

## Responsive Behavior

### Desktop (>1024px):
- Grid: 3-4 columns
- Card Width: ~280px-350px
- Image Height: Calculated from 3:4 ratio
- Hotspot: Keeps face centered

### Tablet (768px-1024px):
- Grid: 2-3 columns
- Card Width: ~300px-400px
- Image Height: Calculated from 3:4 ratio
- Hotspot: Keeps face centered

### Mobile (≤768px):
- Grid: 1 column
- Card Width: 100% (with padding)
- Image Height: Calculated from 3:4 ratio
- Hotspot: Keeps face centered

---

## Troubleshooting

### Problem: Face is cut off at top
**Solution:** 
1. Check hotspot is positioned on face in Studio
2. Ensure `object-position: center top` is set in CSS
3. Verify image has space above head (not cropped too tight)

### Problem: Image looks stretched
**Solution:**
1. Check uploaded image is portrait ratio (3:4 or similar)
2. Verify aspect-ratio: 3/4 in container CSS
3. Re-upload with correct dimensions

### Problem: Letterboxing (padding on sides)
**Solution:**
1. This happens if image is too narrow
2. Upload wider image (at least 600px width)
3. Or use `object-fit: cover` instead of `contain`

---

## Rollback Instructions

To revert to square (1:1) format:

### 1. Schema:
```javascript
hotspot: false
```

### 2. Frontend:
```javascript
aspectRatio: '1 / 1'
objectFit: 'contain'
.width(800).height(800)
```

### 3. CSS:
```css
aspect-ratio: 1 / 1;
object-fit: contain;
```

---

## Related Documentation

- `docs/TEAM_IMAGE_CROPPING_FIX.md` - Detailed technical guide
- `docs/TEAM_PAGE_STUDIO_FILL_GUIDE.md` - Content editor guide
- `styles/Team.module.css` - CSS styles
- `pages/team.js` - Frontend implementation
- `sanity_abscommerce/schemaTypes/team.js` - Schema definition

---

*Last Updated: June 20, 2026*  
*Change Type: Portrait ratio with hotspot support*  
*Status: Complete and Ready for Use ✅*
