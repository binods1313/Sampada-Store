# Sanity Schema Implementation Guide

## ✅ Completed Changes

### 1. Footer Settings Schema (Improved)
**File:** `sanity_abscommerce/schemaTypes/footerSettings.js`

**Changes Made:**
- ✅ Added proper `url` type validation for all link fields
- ✅ Enabled `allowRelative: true` for internal links (can use `/about` or full URLs)
- ✅ Required platform selection for social links to avoid empty entries
- ✅ Improved preview display for better Studio UX

**Benefits:**
- Editors can use relative URLs like `/about` for internal links
- Built-in URL validation prevents broken links
- Better data consistency with required fields

### 2. Team Page Schema (New)
**File:** `sanity_abscommerce/schemaTypes/teamPage.js`

**Fields Structure:**
- Page Title & Hero (title, description, image with alt)
- Team Introduction (title, description)
- Leadership Team (array with name, role, bio, photo with alt, profile link)
- Departments (array of department names and descriptions)
- Culture Section (title, description, gallery with alt text)
- Benefits & Perks (array of benefits)
- Careers CTA (title, description, button text, link)
- SEO Settings (meta title, meta description)

**Accessibility:**
- ✅ All image fields require alt text
- ✅ URL fields validate http/https schemes
- ✅ Proper preview displays for better content management

### 3. Schema Index Updated
**File:** `sanity_abscommerce/schemaTypes/index.js`
- ✅ Added `teamPage` import and export

---

## 📝 Next Steps for Content Entry

### Step 1: Access Sanity Studio
1. Open your browser and navigate to: `http://localhost:3333/studio`
2. Log in to your Sanity Studio

### Step 2: Create Footer Settings Document
1. Click "Create" button in Sanity Studio
2. Select "Footer Settings"
3. Use the sample data from `docs/FOOTER_SETTINGS_SAMPLE.json` to fill in fields:
   - Brand Name: `Sampada`
   - Brand Tagline: `Wear Your Legacy`
   - Add social links (Instagram, Facebook, YouTube, Pinterest, LinkedIn)
   - Add product links (Men's, Women's, Home & Living)
   - Add company links (About, Stories, Team, Careers)
   - Add support links (Help Center, Shipping, Contact)
   - Add legal links (Privacy, Terms, Cookie Policy)
   - Copyright Text: `© 2026 Sampada. All rights reserved.`
   - Powered By Text: `Powered by Printify & Stripe`
4. Click "Publish"

### Step 3: Create Team Page Document
1. Click "Create" button in Sanity Studio
2. Select "Team Page"
3. Use the sample data from `docs/TEAM_PAGE_SAMPLE.json`:
   - Page Title: `Team`
   - Hero Title: `Meet the Keepers of Legacy`
   - Hero Description: Copy from sample
   - **Upload Hero Image** (recommended: team photo, office, or brand image)
     - Add Alt Text: `Sampada team`
   - Team Intro Title: `Our People, Our Promise`
   - Team Intro: Copy from sample
   - Leadership Title: `Leadership Team`
   - **Add Leadership Members** (4 members):
     - For each member:
       - Name, Role, Bio (copy from sample)
       - **Upload Photo** and add Alt Text: `[Name], [Role] at Sampada`
       - Profile Link (optional)
   - Departments: Copy 5 departments from sample
   - Culture Title: `Culture at Sampada`
   - Culture Description: Copy from sample
   - **Culture Gallery**: Upload 3-5 team/office/workshop photos with alt text
   - Benefits Title: `Benefits and Perks`
   - Benefits: Copy 6 benefits from sample
   - Careers CTA: Copy all CTA fields from sample
   - SEO Settings: Copy meta title and description
4. Click "Publish"

---

## 🎨 Sample Data Reference

### Footer Settings Sample
Located in: `docs/FOOTER_SETTINGS_SAMPLE.json`

**Key Points:**
- Use relative URLs for internal links: `/company`, `/stories`, `/contact`
- Use full URLs for external links: `https://instagram.com/...`
- All social links use full URLs

### Team Page Sample
Located in: `docs/TEAM_PAGE_SAMPLE.json`

**Key Points:**
- 4 Leadership team members (add photos in Studio)
- 5 Departments defined
- 6 Benefits listed
- All image fields need alt text for accessibility

---

## 🔍 Validation & Testing

After creating documents:

1. **Verify Footer Settings:**
   - Check that all required fields are filled
   - Test that relative URLs work: `/company` should navigate correctly
   - Ensure social links open in new tabs

2. **Verify Team Page:**
   - All images have alt text
   - Leadership photos are uploaded and display correctly
   - All sections are complete
   - SEO meta tags are set

3. **Frontend Integration:**
   - The frontend will fetch this data using Sanity client
   - Check that fields match expected structure:
     - `footerSettings`: brandName, brandTagline, socialLinks[], productLinks[], etc.
     - `teamPage`: pageTitle, heroTitle, heroImage, leadership[], departments[], etc.

---

## 📂 Files Created/Modified

### New Files:
1. `sanity_abscommerce/schemaTypes/teamPage.js` - New team page schema
2. `docs/FOOTER_SETTINGS_SAMPLE.json` - Sample footer data
3. `docs/TEAM_PAGE_SAMPLE.json` - Sample team page data
4. `docs/SCHEMA_IMPLEMENTATION_GUIDE.md` - This guide

### Modified Files:
1. `sanity_abscommerce/schemaTypes/footerSettings.js` - Improved with url validation
2. `sanity_abscommerce/schemaTypes/index.js` - Added teamPage import/export

---

## 🚀 Frontend Usage

### Fetching Footer Settings
```javascript
const footerQuery = `*[_type == "footerSettings"][0]{
  brandName,
  brandTagline,
  socialLinks[]{platform, url},
  productLinks[]{label, url},
  companyLinks[]{label, url},
  supportLinks[]{label, url},
  legalLinks[]{label, url},
  copyrightText,
  poweredByText
}`

const footerData = await client.fetch(footerQuery)
```

### Fetching Team Page
```javascript
const teamQuery = `*[_type == "teamPage"][0]{
  pageTitle,
  heroTitle,
  heroDescription,
  heroImage{asset->{url}, alt},
  teamIntroTitle,
  teamIntro,
  leadershipTitle,
  leadership[]{
    name,
    role,
    bio,
    photo{asset->{url}, alt},
    profileLink
  },
  departmentsTitle,
  departments[]{label, description},
  cultureTitle,
  cultureDescription,
  cultureGallery[]{asset->{url}, alt},
  benefitsTitle,
  benefits[]{title, description},
  careersCTATitle,
  careersCTADescription,
  careersCTAButtonText,
  careersCTALink,
  seo{metaTitle, metaDescription}
}`

const teamData = await client.fetch(teamQuery)
```

---

## ✨ Benefits of These Changes

1. **Better Data Validation**: URL fields prevent broken links
2. **Flexibility**: Relative URLs make it easy to update internal links
3. **Accessibility**: Required alt text on all images
4. **SEO**: Dedicated SEO fields for better search optimization
5. **Maintainability**: Clear structure and field descriptions
6. **Editor Experience**: Preview displays make content management easier

---

## 🛠️ Troubleshooting

**Q: Schema not showing in Studio?**
- Restart the Sanity dev server: Stop and run `npm run dev` again
- Clear browser cache and refresh

**Q: Can't save document?**
- Check that all required fields are filled (marked with *)
- Ensure URLs use proper format (http:// or https://)
- Verify alt text is added to all images

**Q: Relative URLs not working?**
- Make sure you're using the updated footerSettings schema
- Relative URLs should start with `/` (e.g., `/about`, not `about`)

---

## 📞 Support

For questions about:
- Schema structure: Check this guide
- Sample data: See JSON files in `docs/`
- Frontend integration: Check the usage examples above
