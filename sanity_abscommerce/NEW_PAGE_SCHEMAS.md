# 📄 New Page Schemas Added

## ✅ Status: Complete

I've added three new page schemas to match the About Us style:

---

## 🏢 Company Page (`company.js`)

**Purpose**: Manage company information, mission, vision, values, and partners

**Sections**:
- ✅ Hero (title, description, image)
- ✅ Company Info (founded year, headquarters, size, industry)
- ✅ Mission & Vision
- ✅ Core Values (with icons)
- ✅ Company Story (rich content + image)
- ✅ Statistics
- ✅ Partners & Clients (with logos)
- ✅ SEO Settings

**Access in Studio**: 
1. Click **Create** button
2. Select **Company Page**

---

## 🆘 Support Page (`support.js`)

**Purpose**: Manage support page content, FAQs, contact methods, and help resources

**Sections**:
- ✅ Hero (title, description, image)
- ✅ Contact Methods (email, phone, WhatsApp, chat, form)
- ✅ FAQ Section (categorized questions)
- ✅ Support Hours (weekdays, weekend, holidays, timezone)
- ✅ Helpful Resources (guides, tutorials, videos)
- ✅ Ticket System toggle
- ✅ SEO Settings

**Access in Studio**:
1. Click **Create** button
2. Select **Support Page**

---

## 👥 Team Page (`team.js`)

**Purpose**: Showcase team members, departments, culture, and careers

**Sections**:
- ✅ Hero (title, description, image)
- ✅ Team Introduction
- ✅ Leadership Team (with bios, social links)
- ✅ Departments (with team members)
- ✅ Culture Gallery (photos)
- ✅ Benefits & Perks
- ✅ Careers CTA (call-to-action)
- ✅ SEO Settings

**Access in Studio**:
1. Click **Create** button
2. Select **Team Page**

---

## 📋 All Available Page Types

You now have these page types in Sanity Studio:

| Page Type | Schema Name | Purpose |
|-----------|-------------|---------|
| 📖 About Us | `aboutUs` | Company story, mission, team |
| 🏢 Company | `company` | Corporate info, values, partners |
| 🆘 Support | `support` | Help center, FAQs, contact |
| 👥 Team | `team` | Team members, culture, careers |
| 🎨 Banner | `banner` | Homepage/promotional banners |

---

## 🎯 How to Use

### Create a New Page

1. Open Sanity Studio: http://localhost:3333/
2. Click **+ Create** button (top right)
3. Select the page type you want:
   - Company Page
   - Support Page
   - Team Page
   - About Us
   - Banner

### Edit Existing Page

1. Click **Structure** tab
2. Find your page type in the list
3. Click the page to edit
4. Update content
5. Click **Publish**

---

## 🖼️ Image Features

All image fields include:
- ✅ **Focal Point** - Click edit to set focus area
- ✅ **Alt Text** - Required for accessibility
- ✅ **Blurhash** - Automatic placeholder
- ✅ **Color Palette** - Extracted colors
- ✅ **Dimensions** - Width & height stored

---

## 🔍 SEO Features

All page types include SEO settings:
- ✅ Meta Title (50-60 chars)
- ✅ Meta Description (150-160 chars)
- ✅ Social Sharing Image
- ✅ Focus Keywords

---

## 📊 Example Content

### Company Page Example
```
Title: "About Sampada Store"
Hero: "Your Trusted Electronics Partner"
Founded: 2020
Headquarters: Mumbai, India
Mission: "To provide quality electronics..."
Values:
  - Quality First
  - Customer Satisfaction
  - Innovation
Partners: Sony, LG, Samsung
```

### Support Page Example
```
Title: "Support Center"
Hero: "We're Here to Help"
Contact Methods:
  - Email: support@sampada.com
  - Phone: +91 98765 43210
  - WhatsApp: +91 98765 43210
FAQs: [10+ questions organized by category]
Support Hours: Mon-Fri 9AM-6PM IST
```

### Team Page Example
```
Title: "Our Team"
Hero: "Meet the People Behind Sampada"
Leadership: [CEO, CTO, COO profiles]
Departments: Sales, Support, Tech
Culture: [Office photos, events]
Benefits: Health Insurance, Remote Work, Learning Budget
```

---

## 🚀 Next Steps

1. **Create Pages**: Add content for each page type
2. **Upload Images**: Add hero images, team photos, etc.
3. **Set Focal Points**: Ensure images crop properly
4. **Add SEO Data**: Fill meta titles and descriptions
5. **Publish**: Make pages live on your website

---

## 📞 Integration with Frontend

Your frontend can fetch these pages like this:

```javascript
// Fetch Company page
const companyPage = await client.fetch(`
  *[_type == 'company'][0] {
    ...,
    "heroImageUrl": heroImage.asset->url,
    "values": values[] {
      title,
      description,
      "iconUrl": icon.asset->url
    }
  }
`)

// Fetch Support page with FAQs
const supportPage = await client.fetch(`
  *[_type == 'support'][0] {
    ...,
    faqs[] {
      question,
      answer,
      category
    }
  }
`)

// Fetch Team page with leadership
const teamPage = await client.fetch(`
  *[_type == 'team'][0] {
    ...,
    leadership[] {
      name,
      position,
      bio,
      "imageUrl": image.asset->url,
      linkedin,
      twitter
    }
  }
`)
```

---

## ✅ Build Status

```
✅ Build Sanity Studio - SUCCESS (26s)
✅ All schemas validated
✅ Company page schema added
✅ Support page schema added
✅ Team page schema added
✅ Index updated
✅ Ready to use
```

---

**Created**: March 29, 2026  
**Status**: ✅ Complete & Deployed  
**Pages Added**: 3 (Company, Support, Team)
