# Next.js Image Sizes Prop - Performance Fix

## Issue
Next.js Image components with `fill` prop were missing the `sizes` prop, causing performance warnings in the console.

## Solution
Added appropriate `sizes` prop to all Image components to improve page performance and image loading optimization.

---

## What is the `sizes` Prop?

The `sizes` prop tells Next.js what sizes the image will be displayed at different viewport widths. This allows Next.js to:
- Generate and serve optimally sized images
- Reduce bandwidth usage
- Improve page load performance
- Prevent loading unnecessarily large images on mobile

---

## Sizes Added to Team Page

### 1. Hero Image
**Location:** Hero banner (full-width)

```javascript
<Image
  src={urlFor(heroImage).auto('format').url()}
  fill
  sizes="100vw"  // ✅ Always 100% of viewport width
  priority
/>
```

**Explanation:**
- `100vw` = 100% of viewport width
- Hero image is always full-width, so this is accurate

---

### 2. Leadership Team Images
**Location:** Leadership cards grid

```javascript
<Image
  src={urlFor(member.image).width(600).height(800).url()}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  // ✅ Responsive sizing based on viewport
/>
```

**Explanation:**
- **Mobile** (`max-width: 768px`): `100vw` = Full width (1 column)
- **Tablet** (`max-width: 1024px`): `50vw` = 50% width (2 columns)
- **Desktop** (default): `33vw` = 33% width (3 columns)

---

### 3. Culture Gallery Images
**Location:** Culture section gallery grid

```javascript
<Image
  src={urlFor(item.image).width(600).height(450).url()}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  // ✅ Same responsive sizing as leadership
/>
```

**Explanation:**
- Same grid layout as leadership team
- Responsive from 1 column (mobile) to 3 columns (desktop)

---

## How Sizes Work

### Syntax:
```javascript
sizes="(media-query) size, (media-query) size, default-size"
```

### Examples:

#### Full Width Image:
```javascript
sizes="100vw"
```

#### Two Column Grid:
```javascript
sizes="(max-width: 768px) 100vw, 50vw"
```
- Mobile: 100% width (1 column)
- Desktop: 50% width (2 columns)

#### Three Column Grid:
```javascript
sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
```
- Mobile: 100% width (1 column)
- Tablet: 50% width (2 columns)
- Desktop: 33% width (3 columns)

#### Sidebar Layout:
```javascript
sizes="(max-width: 768px) 100vw, 33vw"
```
- Mobile: 100% width
- Desktop: 33% width (sidebar)

---

## Performance Impact

### Before (No sizes prop):
❌ Browser doesn't know image size  
❌ May load unnecessarily large images  
❌ Wasted bandwidth on mobile  
❌ Slower page load  
❌ Console warnings  

### After (With sizes prop):
✅ Next.js generates optimized image sizes  
✅ Correct image size loaded for each viewport  
✅ Reduced bandwidth usage  
✅ Faster page load  
✅ No console warnings  

---

## Best Practices

### 1. Always Add Sizes with Fill
If using `fill` prop, **always** add `sizes`:

```javascript
// ❌ BAD - Missing sizes
<Image src="..." fill />

// ✅ GOOD - Has sizes
<Image src="..." fill sizes="100vw" />
```

---

### 2. Match Layout Breakpoints
Use same breakpoints as your CSS grid:

```javascript
// CSS Grid
gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'

// Matching sizes
sizes="(max-width: 768px) 100vw, 33vw"
```

---

### 3. Consider Container Width
If image is in a container, account for container width:

```javascript
// Container max-width: 1200px with 90% width
sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (min-width: 1200px) 400px, 33vw"
```

---

### 4. Account for Padding/Gaps
If grid has gaps, slightly reduce sizes:

```javascript
// Grid with 24px gap between 3 columns
sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 30vw"
// Using 30vw instead of 33vw to account for gaps
```

---

## Testing

### Check in Browser DevTools:

1. Open DevTools → Network tab
2. Filter by "Img"
3. Refresh page
4. Check loaded image dimensions match viewport/layout
5. Resize browser window and check new images loaded

### Expected Results:
- **Mobile (375px)**: ~375px wide images loaded
- **Tablet (768px)**: ~384px wide images loaded (50vw)
- **Desktop (1440px)**: ~480px wide images loaded (33vw)

---

## Related Files

- Frontend: `pages/team.js`
- Documentation: `docs/TEAM_IMAGE_CROPPING_FIX.md`
- CSS: `styles/Team.module.css`

---

## Common Sizes Patterns

### Full-Width Hero:
```javascript
sizes="100vw"
```

### Content Area (max 1200px):
```javascript
sizes="(min-width: 1200px) 1200px, 100vw"
```

### Sidebar (33%):
```javascript
sizes="(max-width: 768px) 100vw, 33vw"
```

### Two Column:
```javascript
sizes="(max-width: 768px) 100vw, 50vw"
```

### Three Column:
```javascript
sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
```

### Four Column:
```javascript
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
```

---

## Summary

✅ **All Team page images now have sizes prop**  
✅ **Performance warnings fixed**  
✅ **Optimal image sizes loaded**  
✅ **Reduced bandwidth usage**  
✅ **Faster page load times**  

---

*Last Updated: June 20, 2026*  
*Issue: Next.js Image sizes prop missing*  
*Status: Fixed ✅*
