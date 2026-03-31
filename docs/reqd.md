# Navbar Data Migration Requirements

## Overview
This document outlines the hardcoded data in the current navbar component and the Sanity client configuration needed to fetch this data dynamically.

---

## 1. Sanity Client Configuration

### Primary Client File
**Location:** `lib/client.js`

```javascript
// lib/client.js
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-05-18';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});
```

### Environment Variables Required
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

---

## 2. Current Hardcoded Navbar Data

### File Location
**Component:** `components/HomePage/SampadaNavbar.jsx`

### Hardcoded Menu Structure (Lines 10-43)

```javascript
const menuItems = {
  "Men's Clothing": {
    href: "/collections/mens-tshirts",
    sections: {
      "SHOP BY PRODUCT": ["T-shirts", "Hoodies", "Sweatshirts", "Long Sleeves", "Tank Tops", "Sportswear", "Bottoms", "Swimwear", "Shoes", "Outerwear"]
    }
  },
  "Women's Clothing": {
    href: "/collections/womens-tshirts",
    sections: {
      "SHOP BY PRODUCT": ["T-shirts", "Hoodies", "Sweatshirts", "Long Sleeves", "Tank Tops", "Skirts & Dresses", "Sportswear", "Bottoms", "Swimwear", "Shoes", "Outerwear"]
    }
  },
  "His & Hers": {
    href: "/collections/his-hers",
    sections: {
      "SHOP BY PRODUCT": ["Matching Sets", "Couples T-shirts", "Hoodies", "Sweatshirts", "Bottoms", "Accessories"]
    }
  },
  "Accessories": {
    href: "/category/accessories",
    sections: {
      "SHOP BY PRODUCT": ["Jewelry", "Phone Cases", "Bags", "Socks", "Hats", "Underwear", "Baby Accessories", "Mouse Pads"],
      "MORE": ["Tech Accessories", "Travel Accessories", "Stationery", "Sports & Games", "Face Masks", "Kitchen Accessories", "Car Accessories", "Other"]
    }
  },
  "Home & Living": {
    href: "/collections/home-living",
    sections: {
      "SHOP BY PRODUCT": ["Mugs", "Candles", "Posters", "Canvas", "Blankets", "Pillows & Covers", "Towels", "Journals & Notebooks"],
      "MORE": ["Home Decor", "Glassware", "Bottles & Tumblers", "Rugs & Mats", "Bedding", "Bathroom", "Seasonal Decorations", "Food - Health - Beauty"]
    }
  }
};
```

---

## 3. Data to Fetch from Sanity

### Proposed Sanity Schema for Navigation

```javascript
// schemas/navigation.js
export default {
  name: 'navigation',
  title: 'Navigation Menu',
  type: 'document',
  fields: [
    {
      name: 'label',
      title: 'Menu Label',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'href',
      title: 'Destination URL',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'sections',
      title: 'Dropdown Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Section Header',
              type: 'string'
            },
            {
              name: 'items',
              title: 'Menu Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'label',
                      title: 'Item Label',
                      type: 'string'
                    },
                    {
                      name: 'slug',
                      title: 'Item Slug',
                      type: 'slug',
                      options: { source: 'label' }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
```

### GROQ Query to Fetch Navigation Data

```javascript
// Example query for lib/client.js
const navigationQuery = `*[_type == "navigation"] | order(order asc) {
  _id,
  label,
  href,
  order,
  sections[] {
    sectionTitle,
    items[] {
      label,
      slug
    }
  }
}`;

export async function getNavigationData() {
  return await client.fetch(navigationQuery);
}
```

---

## 4. Implementation Steps

### Step 1: Create Sanity Schema
1. Add `schemas/navigation.js` to your Sanity studio
2. Add the schema to `schemaTypes` array
3. Deploy/restart Sanity Studio

### Step 2: Populate Navigation Data
1. Go to Sanity Studio (`/studio`)
2. Create navigation documents for each menu item:
   - Men's Clothing
   - Women's Clothing
   - His & Hers
   - Accessories
   - Home & Living
3. Add sections and items for each

### Step 3: Update Navbar Component
Replace the hardcoded `menuItems` object with dynamic data:

```javascript
// components/HomePage/SampadaNavbar.jsx

// Add this function to fetch navigation data
async function fetchNavigationData() {
  const navigationQuery = `*[_type == "navigation"] | order(order asc) {
    _id,
    label,
    href,
    sections[] {
      sectionTitle,
      items[] {
        label,
        slug
      }
    }
  }`;
  
  return await client.fetch(navigationQuery);
}

// In the component:
const [menuItems, setMenuItems] = useState({});

useEffect(() => {
  async function loadNavigation() {
    const data = await fetchNavigationData();
    const formattedData = data.reduce((acc, item) => {
      acc[item.label] = {
        href: item.href,
        sections: item.sections.reduce((secAcc, section) => {
          secAcc[section.sectionTitle] = section.items.map(i => i.label);
          return secAcc;
        }, {})
      };
      return acc;
    }, {});
    setMenuItems(formattedData);
  }
  
  loadNavigation();
}, []);
```

---

## 5. Additional Hardcoded Data to Migrate

### Marquee Announcement Text (Lines 78-82)
**Current:** Hardcoded in `MarqueeBar` component
```javascript
"Free Shipping ₹999+ • 30-Day Returns • COD Available • ★★★★★ 4.8 from 1,200+ customers"
```

**Sanity Schema Suggestion:**
```javascript
// schemas/announcement.js
{
  name: 'announcement',
  title: 'Announcement Bar',
  type: 'document',
  fields: [
    { name: 'text', title: 'Announcement Text', type: 'string' },
    { name: 'enabled', title: 'Show Announcement', type: 'boolean' }
  ]
}
```

---

## 6. Files Referenced

| File | Purpose |
|------|---------|
| `lib/client.js` | Primary Sanity client |
| `lib/sanity.js` | Alternative client (abscommerce) |
| `sanity.config.js` | Sanity Studio configuration |
| `components/HomePage/SampadaNavbar.jsx` | Navbar component with hardcoded data |

---

## 7. Next Actions

1. ✅ Create `schemas/navigation.js` in Sanity
2. ✅ Add navigation schema to `schemaTypes`
3. ✅ Populate navigation data in Sanity Studio
4. ✅ Create GROQ query in `lib/client.js`
5. ✅ Update `SampadaNavbar.jsx` to fetch and use dynamic data
6. ✅ Add loading state for navigation data
7. ✅ Test all dropdown menus with dynamic data

---

**Last Updated:** March 30, 2026
**Status:** Ready for implementation
