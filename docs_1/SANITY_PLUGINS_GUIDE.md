# Sanity Studio Plugin Usage Guide

*Om Namah Sivaya* 🙏

**Last Updated:** Jan 20, 2026 | 7:20 PM IST

---

## 🎨 How to Add Table Fields to Product Schema

### **Option 1: Add a Size Chart Table**

Add this field to your product schema (`sanity_abscommerce/schemaTypes/product.js`):

```javascript
defineField({
  name: 'sizeChartTable',
  title: 'Size Chart (Table Format)',
  type: 'table',
  description: 'Interactive size chart table - add rows for different sizes',
})
```

**Where to add it:** After line 217 (after the sizeChart image field)

### **Option 2: Add a Specifications Table**

```javascript
defineField({
  name: 'technicalSpecs',
  title: 'Technical Specifications Table',
  type: 'table',
  description: 'Detailed product specifications in table format',
  options: {
    rows: {
      type: 'object',
      fields: [
        {name: 'specification', type: 'string', title: 'Specification'},
        {name: 'value', type: 'string', title: 'Value'},
        {name: 'unit', type: 'string', title: 'Unit (optional)'}
      ]
    }
  }
})
```

### **How to Use the Table Field:**

1. **Open Sanity Studio:** http://localhost:3333/
2. **Navigate to Products**
3. **Edit or Create a Product**
4. **Scroll to the table field**
5. **Click "Add Row"** to add table rows
6. **Fill in the data** for each cell
7. **Save** the product

---

## 🔍 How to Test GROQ Queries with Vision Tool

### **What is Vision Tool?**

Vision is a powerful query testing tool built into Sanity Studio. It lets you:
- Test GROQ queries in real-time
- See query results instantly
- Debug data structures
- Learn GROQ syntax

### **How to Access Vision:**

1. **Open Sanity Studio:** http://localhost:3333/
2. **Look for the "Vision" tab** in the top navigation (next to "Content")
3. **Click on "Vision"**

### **Example GROQ Queries to Try:**

#### **1. Get All Products:**
```groq
*[_type == "product"]
```

#### **2. Get Products with Price:**
```groq
*[_type == "product"]{
  name,
  price,
  "slug": slug.current
}
```

#### **3. Get Products by Category:**
```groq
*[_type == "product" && category._ref == "category-id"]{
  name,
  price,
  category->{name}
}
```

#### **4. Get Products with Variants:**
```groq
*[_type == "product" && count(variants) > 0]{
  name,
  "variantCount": count(variants),
  variants[]{
    colorName,
    size,
    variantStock
  }
}
```

#### **5. Get Low Stock Products:**
```groq
*[_type == "product" && inventory < 10]{
  name,
  inventory,
  price
} | order(inventory asc)
```

#### **6. Search Products by Name:**
```groq
*[_type == "product" && name match "shirt*"]{
  name,
  price
}
```

#### **7. Get Products with Images:**
```groq
*[_type == "product"]{
  name,
  "imageUrl": image[0].asset->url
}
```

#### **8. Get Products with Calculated Discount Price:**
```groq
*[_type == "product"]{
  name,
  price,
  discount,
  "discountedPrice": price * (1 - discount / 100)
}
```

### **Vision Tool Features:**

1. **Query Editor** - Write your GROQ queries
2. **Results Panel** - See query results in JSON format
3. **API Version Selector** - Test with different API versions
4. **Params Tab** - Add query parameters
5. **Perspective Selector** - View published or draft content

### **Tips for Using Vision:**

- ✅ Start with simple queries and build complexity
- ✅ Use the autocomplete (Ctrl+Space) for field suggestions
- ✅ Check the "Params" tab to add dynamic parameters
- ✅ Use `order()` to sort results
- ✅ Use `[0...10]` to limit results (pagination)
- ✅ Use `->` to dereference (follow references)

---

## 📊 Enhanced Media Library Usage

### **How to Use the Media Plugin:**

1. **Open Sanity Studio:** http://localhost:3333/
2. **Go to any image field** in a product
3. **Click "Select"** or "Upload"
4. **You'll see the enhanced media library** with:
   - Better search and filtering
   - Grid/List view toggle
   - Bulk operations
   - Advanced metadata editing

### **Features:**

- ✅ **Search** - Find images by filename or tags
- ✅ **Filter** - Filter by type, size, date
- ✅ **Organize** - Create folders and collections
- ✅ **Bulk Actions** - Select multiple images
- ✅ **Metadata** - Add titles, descriptions, alt text

---

## 🚀 Quick Reference

### **Installed Plugins:**

1. ✅ **sanity-plugin-media** - Enhanced media library
2. ✅ **@sanity/table** - Table fields
3. ✅ **@sanity/code-input** - Code blocks
4. ✅ **@sanity/vision** - GROQ query tester

### **Useful Links:**

- **GROQ Documentation:** https://www.sanity.io/docs/groq
- **Vision Tool Guide:** https://www.sanity.io/docs/the-vision-plugin
- **Table Plugin:** https://www.sanity.io/plugins/table
- **Media Plugin:** https://www.sanity.io/plugins/media

---

*Har Har Mahadev!* 🕉️
