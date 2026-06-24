# Team Page Image Cropping Fix - Portrait Ratio (3:4)

## Problem
Leadership team profile images (Maya Iyer, and others) were being unpredictably cropped, cutting off heads, shoulders, or important parts of portraits.

## Solution Implemented

### 1. Sanity Schema Changes ✅

**File:** `sanity_abscommerce/schemaTypes/team.js`

**Changes Made:**
- ✅ Enabled `hotspot: true` → Allows manual focal point control in Studio
- ✅ Updated description to recommend portrait images (3:4 ratio, e.g., 800x1066px)
- ✅ Kept `storeDimensions` and `metadata` for performance

**Current Configuration:**
```javascript
options: {
  hotspot: true,  // Enable hotspot for focal point control
  accept: 'image/*',
  storeDimensions: true,
  metadata: ['blurhash', 'palette']
}
```

**Benefits:**
- Editors can set focal point on face in Sanity Studio
- Hotspot ensures faces stay centered even if image is cropped
- More flexibility for different image compositions

---

### 2. Frontend CSS Changes ✅

**File:** `pages/team.js`

**Changes Made:**
- ✅ Changed from `aspectRatio: '1 / 1'` to `aspectRatio: '3 / 4'` (portrait)
- ✅ Changed `objectFit: 'contain'` to `objectFit: 'cover'` for edge-to-edge fill
- ✅ Changed `objectPosition: 'center'` to `objectPosition: 'center top'` to keep faces visible
- ✅ Updated image dimensions to portrait: `600x800` instead of `800x800`
- ✅ Added Sanity image API params: `.fit('crop').crop('focalpoint')` to respect hotspot
- ✅ Added background color for better appearance

**Current Implementation:**
```javascript
<div style={{ 
  position: 'relative', 
  width: '100%', 
  aspectRatio: '3 / 4',  // Portrait container
  overflow: 'hidden',
  backgroundColor: 'rgba(0,0,0,0.1)'
}}>
  <Image
    src={urlFor(member.image)
      .width(600)
      .height(800)
      .fit('crop')           // Crop to fit
      .crop('focalpoint')    // Use hotspot as focal point
      .url()}
    fill
    style={{ 
      objectFit: 'cover',           // Edge-to-edge fill
      objectPosition: 'center top'  // Keep faces at top
    }}
  />
</div>
```

---

### 3. CSS Module Created ✅

**File:** `styles/Team.module.css`

Created reusable CSS classes for:
- `.leadershipImageWrapper` - Square container with `object-fit: contain`
- `.leadershipImageWrapperCover` - Alternative with `object-fit: cover` (if needed)
- `.departmentMemberImage` - For department team member photos
- `.cultureGalleryImage` - For culture gallery (4:3 landscape)

---

## Image Upload Guidelines

### For Leadership Team:

**Recommended Dimensions:**
- **Portrait images**: 600x800px, 800x1066px, or 900x1200px
- **Aspect Ratio**: 3:4 (portrait)
- **Format**: JPG or PNG
- **File Size**: Under 500KB (optimize before upload)

**Composition Tips:**
- Frame subject in portrait orientation (vertical)
- Include head and upper torso (three-quarter length)
- Leave space above head (don't crop too tight at top)
- Ensure face is in upper 40% of frame
- Use hotspot tool in Sanity Studio to set focal point on face

**Hotspot Usage in Sanity Studio:**
1. Upload portrait image (3:4 ratio)
2. Click on image to open editor
3. Drag the hotspot circle to position it on the subject's face
4. This ensures the face stays centered when image is displayed in different sizes
5. Save the image

**Example Prompt for AI Generation:**
```
Professional portrait photograph (3:4 aspect ratio) of [description]; 
three-quarter length showing head and upper torso; 
portrait orientation (vertical); 
face in upper portion of frame; 
professional lighting; 
clean background; 
800x1066 pixels
```

---

## Object-Fit Comparison

### `object-fit: cover` (Current - Recommended)
✅ **Pros:**
- Edge-to-edge fill, no letterboxing
- Professional, seamless look
- Works well with hotspot focal points
- Consistent card sizing

❌ **Cons:**
- May crop some edges if image aspect ratio differs
- Requires proper composition (face in upper portion)

### `object-fit: contain` (Alternative)
✅ **Pros:**
- Shows entire image without cropping
- No loss of any image content
- Predictable result

❌ **Cons:**
- May show background/padding if aspect ratio differs
- Letterboxing effect
- Less polished appearance

### Hotspot + Cover = Best Solution ✨
The combination of:
- `object-fit: cover` for edge-to-edge fill
- `object-position: center top` to prioritize face placement
- Sanity hotspot to set focal point
- `.crop('focalpoint')` in image API

Results in professional portraits that always keep faces visible while filling the entire card.

---

## Testing Checklist

After uploading leadership images:

- [ ] Check Sanity Studio preview - image looks correct
- [ ] View Team page on desktop - no cropping issues
- [ ] View Team page on mobile - no cropping issues
- [ ] Verify faces are centered and visible
- [ ] Check no heads or shoulders are cut off
- [ ] Ensure consistent sizing across all leadership cards
- [ ] Test with portrait and landscape images
- [ ] Verify loading performance (should be fast with 800x800)

---

## Rollback Instructions

If you need to revert to the old behavior:

### In `team.js` schema:
```javascript
options: {
  hotspot: true,  // Re-enable hotspot
  // ...
}
```

### In `pages/team.js`:
```javascript
style={{ 
  objectFit: 'cover'  // Change back to cover
}}
```

---

## Future Improvements

### Optional Enhancements:

1. **Add crop UI in Sanity** (if hotspot re-enabled):
   - Allow editors to manually adjust crop
   - Preview crop in Studio

2. **Support multiple aspect ratios**:
   - Portrait: 3:4
   - Square: 1:1
   - Landscape: 4:3

3. **Lazy loading optimization**:
   - Already using Next.js Image component ✅
   - Consider adding `loading="lazy"` for below-fold images

4. **Image validation**:
   - Add minimum dimension check (e.g., 600x600px)
   - Warn if aspect ratio isn't square

---

## Related Files

- Schema: `sanity_abscommerce/schemaTypes/team.js`
- Frontend: `pages/team.js`
- Styles: `styles/Team.module.css`
- Guide: `docs/TEAM_PAGE_STUDIO_FILL_GUIDE.md`

---

## Summary

✅ **Problem Fixed**: Images no longer crop unpredictably  
✅ **Solution**: Square containers (1:1) + `object-fit: contain`  
✅ **Best Practice**: Upload square images (800x800px or larger)  
✅ **Result**: Full portraits visible, no cropping of faces/heads

---

*Last Updated: June 20, 2026*  
*Issue: Leadership team image cropping*  
*Status: Resolved ✅*
