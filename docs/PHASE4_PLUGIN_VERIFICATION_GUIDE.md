# Phase 4: Plugin Verification Guide

**Date**: May 11, 2026  
**Status**: 📋 Ready for Testing  
**Estimated Time**: 2-3 hours

---

## 🎯 OBJECTIVE

Verify that all 10 Sanity Studio plugins are properly configured and functional. This phase ensures the enhanced editing experience is working before we proceed with accessibility testing and deployment.

---

## 📊 PLUGINS TO VERIFY

### ✅ Already Installed (10 Plugins)

| # | Plugin | Purpose | Status |
|---|--------|---------|--------|
| 1 | **Structure Tool** | Main content editing interface | ✅ Core |
| 2 | **Vision Tool** | GROQ query testing | ✅ Core |
| 3 | **Code Input** | Code blocks in content | ✅ Core |
| 4 | **AI Assist** | Auto-generate product content | ✅ Installed |
| 5 | **Smart Asset Manager** | Optimize media library | ✅ Installed |
| 6 | **Block Styles** | Rich content styling | ✅ Installed |
| 7 | **References** | Prevent broken links | ✅ Installed |
| 8 | **Recursive Hierarchy** | Category management | ✅ Installed |
| 9 | **Color Input** | Product variant colors | ✅ Installed |
| 10 | **Media Library** | Enhanced asset management | ✅ Installed |

---

## 🚀 TESTING PROCEDURE

### Step 1: Start Sanity Studio (5 min)

```bash
cd sanity_abscommerce
npm run dev
```

**Expected Output**:
```
✔ Compiled successfully!
Local:    http://localhost:3333
Network:  http://192.168.x.x:3333
```

**Open**: http://localhost:3333

**Verify**:
- [ ] Studio loads without errors
- [ ] No console errors in browser DevTools (F12)
- [ ] All menu items visible in sidebar

---

### Step 2: Test Core Plugins (10 min)

#### 2.1 Structure Tool ✅
**What**: Main content editing interface

**Test**:
1. Click "Content" in sidebar
2. See list of document types (Product, Category, Banner, etc.)
3. Click on any document
4. Document opens in editor

**Expected**: Clean, organized interface with all document types visible

**Pass Criteria**:
- [ ] All document types listed
- [ ] Can open documents
- [ ] No layout issues

---

#### 2.2 Vision Tool ✅
**What**: GROQ query testing tool

**Test**:
1. Click "Vision" in sidebar
2. Enter query: `*[_type == "product"][0...5]{_id, name, price}`
3. Click "Fetch"

**Expected**: Returns first 5 products with ID, name, and price

**Pass Criteria**:
- [ ] Vision tool opens
- [ ] Query executes successfully
- [ ] Results display in JSON format

---

#### 2.3 Code Input ✅
**What**: Code blocks in rich text

**Test**:
1. Open any document with rich text (e.g., About Us)
2. Add a block
3. Look for "Code" block type

**Expected**: Code block option available with syntax highlighting

**Pass Criteria**:
- [ ] Code block type available
- [ ] Can add code
- [ ] Syntax highlighting works

---

### Step 3: Test E-Commerce Plugins (30 min)

#### 3.1 AI Assist 🤖
**What**: Auto-generate product descriptions

**Test**:
1. Go to Products
2. Create new product or open existing
3. Go to "Details" field
4. Look for AI assist button (sparkle icon ✨)
5. Click it and request: "Write a product description for a premium t-shirt"

**Expected**: AI generates description automatically

**Pass Criteria**:
- [ ] AI button visible in Details field
- [ ] Can trigger AI generation
- [ ] Generated text appears in field
- [ ] Text is relevant and well-written

**Troubleshooting**:
- If no AI button: Check if `@sanity/assist` is configured
- If AI fails: Check API key in Sanity project settings

---

#### 3.2 Smart Asset Manager 📁
**What**: Enhanced media library with file info

**Test**:
1. Go to any product
2. Click "Add image" in image field
3. Upload a new image (or select existing)
4. Hover over image thumbnail

**Expected**: See file size, dimensions, usage count

**Pass Criteria**:
- [ ] File size displayed (e.g., "2.3 MB")
- [ ] Dimensions shown (e.g., "1920x1080")
- [ ] Usage count visible (e.g., "Used in 3 documents")
- [ ] Can bulk delete unused assets

**Test Bulk Delete**:
1. Go to Media tab
2. Select multiple unused images
3. Click "Delete selected"

**Expected**: Confirmation dialog, then images deleted

---

#### 3.3 Block Styles 🎨
**What**: Rich content styling options

**Test**:
1. Open a product
2. Go to "Product Tabs" section
3. Add a new tab
4. In tab content, add text
5. Select text
6. Look for style options in toolbar

**Expected Styles**:
- 📢 Callout (gold background)
- ✨ Feature List (dark background)
- ⚠️ Warning (red border)
- ✅ Success (green border)
- ℹ️ Info Box (blue border)
- 🎉 Promo Banner (gradient)

**Pass Criteria**:
- [ ] All 6 styles available in dropdown
- [ ] Can apply styles to text
- [ ] Styles preview correctly in editor
- [ ] Styles have correct colors/borders

---

#### 3.4 References Plugin 🔗
**What**: Prevent broken links between documents

**Test**:
1. Open a product
2. Set a category reference
3. Try to delete that category (go to Categories)
4. Attempt to delete the category

**Expected**: Warning that product references this category

**Pass Criteria**:
- [ ] Reference badge shows on category
- [ ] Warning appears when trying to delete
- [ ] Shows which products reference it
- [ ] Can view references in side panel

**Additional Test**:
1. Open any category
2. Look for "References" pane in sidebar
3. Should show all products in that category

---

### Step 4: Test Enterprise Plugins (45 min)

#### 4.1 Recursive Hierarchy 🌳
**What**: Drag-and-drop category management

**Test Setup**:
1. Go to Categories
2. Create test categories:
   - "Apparel" (parent)
   - "T-Shirts" (child of Apparel)
   - "Hoodies" (child of Apparel)
   - "Men's T-Shirts" (child of T-Shirts)
   - "Women's T-Shirts" (child of T-Shirts)

**Test Drag-and-Drop**:
1. Drag "Men's T-Shirts" under "T-Shirts"
2. Drag "Women's T-Shirts" under "T-Shirts"
3. Verify hierarchy displays correctly

**Expected**:
```
📁 Apparel
  📁 T-Shirts (2 children)
    📄 Men's T-Shirts
    📄 Women's T-Shirts
  📁 Hoodies
```

**Pass Criteria**:
- [ ] Can drag categories to reorder
- [ ] Can nest categories (parent/child)
- [ ] Child count displays correctly
- [ ] Hierarchy saves after refresh
- [ ] Can expand/collapse categories
- [ ] Visual indentation shows levels

**Advanced Test**:
1. Try to drag a parent under its own child (should prevent)
2. Drag a category to root level
3. Create 3+ levels deep hierarchy

---

#### 4.2 Color Input 🎨
**What**: Visual color picker for products

**Test**:
1. Open a product
2. Go to "🎨 Variants & Colors" tab
3. Scroll to "Available Colors (Visual Picker)"
4. Click "Add item"
5. Color picker should appear

**Test Color Picker**:
1. Click color picker
2. Select a color (e.g., Navy Blue)
3. Verify hex code appears (e.g., #000080)
4. Add multiple colors
5. Reorder colors by dragging

**Expected**: Visual color swatches with hex codes

**Pass Criteria**:
- [ ] Color picker opens
- [ ] Can select any color
- [ ] Hex code displays correctly
- [ ] Can add multiple colors
- [ ] Can reorder colors
- [ ] Colors save correctly

**Test in Variants**:
1. Go to "Product Variants" array
2. Add a variant
3. Set "Color Hex Code" field
4. Type: #FF0000 (red)
5. Verify it validates correctly

---

#### 4.3 Media Library 📸
**What**: Enhanced asset management

**Test**:
1. Click "Media" tab in sidebar
2. Upload multiple images
3. Test features:
   - Search by filename
   - Filter by type (image/video)
   - Sort by date/size
   - View as grid/list
   - Select multiple
   - Bulk operations

**Expected**: Full-featured media manager

**Pass Criteria**:
- [ ] Media tab accessible
- [ ] Can upload images
- [ ] Search works
- [ ] Filters work
- [ ] Can view file details
- [ ] Can bulk select
- [ ] Can bulk delete
- [ ] Shows file dimensions
- [ ] Shows file size
- [ ] Shows usage count

**Advanced Test**:
1. Upload a large image (>5MB)
2. Should see warning about file size
3. Upload different file types (JPG, PNG, GIF, WebP)
4. Verify all display correctly

---

### Step 5: Test Printify Integration (20 min)

#### 5.1 Printify Fields in Product Schema

**Test**:
1. Open any product
2. Go to "🖨️ Printify" tab
3. Check "Is Printify Product" checkbox

**Expected Fields Appear**:
- [ ] Printify Product ID
- [ ] Printify Blueprint ID
- [ ] Print Provider
- [ ] Printify Variant ID
- [ ] Printify Mockup URL
- [ ] Printify Base Price
- [ ] Printify Shipping Info

**Test Field Behavior**:
1. Uncheck "Is Printify Product"
2. All Printify fields should hide
3. Check it again
4. Fields should reappear

**Pass Criteria**:
- [ ] All 8 Printify fields present
- [ ] Fields hide/show based on checkbox
- [ ] Can enter data in all fields
- [ ] URL field validates URLs
- [ ] Number fields validate numbers
- [ ] Data saves correctly

---

#### 5.2 Product Tabs

**Test**:
1. Go to "📑 Product Tabs" tab
2. Click "Add item"
3. Create tabs:
   - Description (📄)
   - Features (✨)
   - Specifications (📋)
   - Shipping (🚚)
   - Returns (↩️)
   - Reviews (⭐)

**For Each Tab**:
1. Set tab title
2. Set tab icon (emoji)
3. Add rich text content
4. Use block styles (callout, warning, etc.)

**Expected**: Organized tab structure

**Pass Criteria**:
- [ ] Can add multiple tabs
- [ ] Can set title and icon
- [ ] Can add rich text content
- [ ] Can use block styles in content
- [ ] Can reorder tabs by dragging
- [ ] Can delete tabs
- [ ] Tabs save correctly

---

### Step 6: Test Custom Tools (15 min)

#### 6.1 Bulk Edit Tool 📝

**Test**:
1. Click "Bulk Edit" in sidebar (custom tool)
2. Should see bulk editing interface
3. Select multiple products
4. Test bulk operations:
   - Change status (draft → active)
   - Update category
   - Add tags

**Expected**: Can edit multiple products at once

**Pass Criteria**:
- [ ] Bulk Edit tool accessible
- [ ] Can select multiple products
- [ ] Can apply changes to all
- [ ] Changes save correctly

---

#### 6.2 Price Updates Tool 💰

**Test**:
1. Click "Price Updates" in sidebar
2. Should see price management interface
3. Test operations:
   - Apply discount to multiple products
   - Update prices by percentage
   - Set sale prices

**Expected**: Bulk price management

**Pass Criteria**:
- [ ] Price Updates tool accessible
- [ ] Can select products
- [ ] Can apply price changes
- [ ] Changes reflect immediately

---

## 📋 VERIFICATION CHECKLIST

### Core Functionality
- [ ] Sanity Studio loads without errors
- [ ] All plugins visible and accessible
- [ ] No console errors
- [ ] Can create/edit/delete documents

### Plugin-Specific
- [ ] AI Assist generates content
- [ ] Smart Asset Manager shows file info
- [ ] Block Styles apply correctly
- [ ] References prevent broken links
- [ ] Recursive Hierarchy drag-and-drop works
- [ ] Color Input picker works
- [ ] Media Library fully functional
- [ ] Printify fields show/hide correctly
- [ ] Product Tabs can be created
- [ ] Custom tools accessible

### Data Integrity
- [ ] All changes save correctly
- [ ] Data persists after refresh
- [ ] No data loss
- [ ] Validation rules work

---

## 🐛 COMMON ISSUES & FIXES

### Issue: Plugin Not Showing
**Symptoms**: Plugin installed but not visible in Studio

**Fix**:
1. Check `sanity.config.js` - plugin imported?
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Clear browser cache: `Ctrl+Shift+R`
4. Check browser console for errors

---

### Issue: AI Assist Not Working
**Symptoms**: No AI button or AI fails to generate

**Fix**:
1. Check if AI Assist is enabled in Sanity project settings
2. Go to: https://www.sanity.io/manage
3. Select project → Settings → AI Assist
4. Enable and configure API key
5. Restart Studio

---

### Issue: Color Picker Not Appearing
**Symptoms**: Color field shows text input instead of picker

**Fix**:
1. Verify `sanity-plugin-color-input` installed
2. Check field type is `color` not `string`
3. Restart dev server

---

### Issue: Hierarchy Not Draggable
**Symptoms**: Can't drag categories

**Fix**:
1. Check `enableDragDrop: true` in config
2. Verify categories have `parent` and `children` fields
3. Refresh browser

---

### Issue: Media Library Not Loading
**Symptoms**: Media tab empty or errors

**Fix**:
1. Check `sanity-plugin-media` installed
2. Verify images exist in dataset
3. Check browser console for errors
4. Try uploading a new image

---

## ✅ SUCCESS CRITERIA

### Phase 4 Complete When:
- [ ] All 10 plugins tested
- [ ] All plugins working correctly
- [ ] No critical bugs found
- [ ] Documentation updated
- [ ] Screenshots captured (optional)

### Ready for Phase 5 When:
- [ ] All checklist items checked
- [ ] Any issues documented
- [ ] Team notified of completion

---

## 📊 TESTING RESULTS TEMPLATE

```markdown
## Phase 4 Testing Results

**Date**: [Date]
**Tester**: [Name]
**Duration**: [Time]

### Plugin Status
- [ ] Structure Tool: ✅ / ❌
- [ ] Vision Tool: ✅ / ❌
- [ ] Code Input: ✅ / ❌
- [ ] AI Assist: ✅ / ❌
- [ ] Smart Asset Manager: ✅ / ❌
- [ ] Block Styles: ✅ / ❌
- [ ] References: ✅ / ❌
- [ ] Recursive Hierarchy: ✅ / ❌
- [ ] Color Input: ✅ / ❌
- [ ] Media Library: ✅ / ❌

### Issues Found
1. [Issue description]
   - Severity: High / Medium / Low
   - Fix: [Solution]

### Notes
[Any additional observations]

### Recommendation
- [ ] Proceed to Phase 5
- [ ] Fix issues first
```

---

## 🚀 NEXT STEPS

**After Phase 4 Complete**:
1. Document any issues found
2. Fix critical bugs
3. Update this document with results
4. Proceed to Phase 5 (Accessibility Testing)

**Phase 5 Preview**:
- Lighthouse audits (target: 90+)
- Screen reader testing
- Keyboard navigation
- WCAG 2.2 AA compliance

---

## 📞 SUPPORT

**For Plugin Issues**:
- Check plugin documentation
- Search Sanity Slack community
- Review plugin GitHub issues

**For Configuration Issues**:
- See `sanity_abscommerce/sanity.config.js`
- Check `sanity_abscommerce/package.json`
- Verify all dependencies installed

**For Testing Help**:
- See `docs/PRINTIFY_TESTING_GUIDE.md`
- See `docs/PRINTIFY_COMPLETE_STATUS.md`

---

**Status**: 📋 Ready for Testing  
**Estimated Time**: 2-3 hours  
**Next Phase**: Phase 5 (Accessibility Testing)

**Let's verify all plugins are working correctly!** 🚀✨
