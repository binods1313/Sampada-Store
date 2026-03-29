# 📞 Contact Page - Dynamic Sanity Integration Complete!

## ✅ Status: Complete & Deployed

The Contact page now dynamically fetches all content from Sanity CMS, just like the Stories page!

---

## 🎯 What Was Created

### 1. Sanity Schema (`contactPage.js`)

**Location**: `sanity_abscommerce/schemaTypes/contactPage.js`

**Features**:
- ✅ Hero section with background image
- ✅ Introduction section
- ✅ Contact information cards (address, phone, email, hours)
- ✅ Contact form with customizable messages
- ✅ Google Maps embed support
- ✅ Social media links section
- ✅ FAQ section with categories
- ✅ Full SEO support

---

### 2. Next.js Page (`/contact`)

**Location**: `pages/contact.js`

**Features**:
- ✅ Server-side rendering for SEO
- ✅ Dynamic content from Sanity
- ✅ Working contact form (submits to Sanity)
- ✅ Google Maps integration
- ✅ Social media links
- ✅ FAQ display
- ✅ Responsive design

---

### 3. CSS Styles

**Location**: `components/ContactPage.module.css`

**Features**:
- ✅ Responsive grid layouts
- ✅ Beautiful contact cards
- ✅ Form styling with validation states
- ✅ Social media links styling
- ✅ FAQ section styling
- ✅ Map embed responsive

---

## 📋 How to Use

### Step 1: Create Contact Page in Sanity

1. Open Sanity Studio: http://localhost:3333/
2. Click **+ Create** button
3. Select **Contact Page**
4. Fill in the content sections

---

### Step 2: Fill Content Sections

#### Hero Section
```
Hero Title: "Contact Us"
Hero Subtitle: "Have questions? We're here to help!"
Background Image: Upload hero banner (1920x600px)
```

#### Introduction Section
```
Title: "Get In Touch"
Description: "Have questions or want to learn more about our products? We're here to help."
```

#### Contact Information Cards
Click **+ Add Contact Card** for each:

**Card 1: Location**
```
Icon: 📍
Title: "Our Location"
Content: "123 Tech Park Avenue\nInnovation District\nMumbai, Maharashtra 400001\nIndia"
```

**Card 2: Phone & Email**
```
Icon: 📱
Title: "Phone & Email"
Content: "+91 98765 43210\nhello@sampada.com\nsupport@sampada.com"
Link: "tel:+919876543210" or "mailto:hello@sampada.com"
```

**Card 3: Business Hours**
```
Icon: ⏰
Title: "Business Hours"
Content: "Monday - Friday: 10:00 AM - 7:00 PM\nSaturday: 10:00 AM - 3:00 PM\nSunday: Closed"
```

#### Contact Form Section
```
Form Title: "Send Us a Message"
Form Description: "Fill out the form below and we'll get back to you as soon as possible."
Submit Button: "Send Message"
Success Message: "Message Sent!\nThank you for reaching out. We'll get back to you as soon as possible."
Error Message: "There was an error submitting your message. Please try again."

Show Map: [x] (checked)
Map Embed URL: [Get from Google Maps > Share > Embed a map]
```

**How to get Google Maps Embed URL:**
1. Go to Google Maps
2. Find your location
3. Click "Share"
4. Select "Embed a map"
5. Copy the URL from the iframe src

#### Social Media Section
```
Title: "Follow Us"
Description: "Stay connected on social media"

Social Links:
- Platform: Instagram
  URL: https://instagram.com/sampada
  Handle: @sampada

- Platform: Facebook
  URL: https://facebook.com/sampada
  Handle: sampada

- Platform: Twitter
  URL: https://twitter.com/sampada
  Handle: @sampada
```

#### FAQ Section
```
Title: "Frequently Asked Questions"
Description: "Find answers to common questions"

FAQs:
1. Question: "What are your shipping options?"
   Answer: "We offer standard and express shipping..."
   Category: shipping

2. Question: "What is your return policy?"
   Answer: "We accept returns within 30 days..."
   Category: returns

3. Question: "How can I track my order?"
   Answer: "You'll receive a tracking number..."
   Category: orders
```

#### SEO Settings
```
Meta Title: "Contact Us – Sampada"
Meta Description: "Get in touch with Sampada. For support, orders, and inquiries, email hello@sampada.com or call +91 98765 43210."
Keywords: ["contact", "support", "customer service", "help"]
Social Sharing Image: Upload (1200x630px)
```

### Step 3: Publish

1. Click **Publish** button
2. ✅ Visit `/contact` to see your page!

---

## 🎨 Page Sections Preview

```
┌─────────────────────────────────────────┐
│           HERO SECTION                  │
│   [Background Image]                    │
│   "Contact Us"                          │
│   "Have questions?..."                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      INTRODUCTION                       │
│   "Get In Touch"                        │
│   Description text...                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│     CONTACT INFORMATION CARDS           │
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │ 📍   │ │ 📱   │ │ ⏰   │            │
│  │Location│Phone │Hours │            │
│  └──────┘ └──────┘ └──────┘            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│        CONTACT FORM & MAP               │
│  ┌─────────────┐ ┌─────────┐           │
│  │ Contact     │ │ Google  │           │
│  │ Form        │ │ Maps    │           │
│  │ [Name]      │ │         │           │
│  │ [Email]     │ │         │           │
│  │ [Message]   │ │         │           │
│  │ [Send]      │ │         │           │
│  └─────────────┘ └─────────┘           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│        SOCIAL MEDIA                     │
│  📷 Instagram  👍 Facebook  🐦 Twitter  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           FAQ SECTION                   │
│  Q: What are your shipping options?     │
│  A: We offer standard and express...    │
│                                         │
│  Q: What is your return policy?         │
│  A: We accept returns within 30 days... │
└─────────────────────────────────────────┘
```

---

## 📊 Form Submissions

When someone submits the contact form:
1. ✅ Data is saved to Sanity as `contactMessage` document
2. ✅ User sees success message
3. ✅ Form resets for next submission
4. ✅ You can view all submissions in Sanity Studio

**View Submissions:**
1. Open Sanity Studio
2. Go to **Contact Messages** section
3. See all submissions with name, email, subject, message, date

---

## 🔗 Integration with Other Pages

### Navbar
The Contact link should be in your navbar (already exists in most templates).

### Footer
Add Contact link to footer legal or support section.

---

## ✅ Testing Checklist

### In Sanity Studio
- [ ] Create Contact page
- [ ] Fill all sections
- [ ] Add at least 3 contact cards
- [ ] Configure contact form
- [ ] Add Google Maps embed (optional)
- [ ] Add social media links
- [ ] Add FAQs
- [ ] Fill SEO settings
- [ ] **Publish** page

### On Website
- [ ] Visit `/contact`
- [ ] Check all sections display
- [ ] Test contact form submission
- [ ] Verify success message
- [ ] Check in Sanity for submission
- [ ] Test Google Maps (if enabled)
- [ ] Click social media links
- [ ] Check on mobile device
- [ ] Verify SEO meta tags

---

## 🐛 Troubleshooting

### Page shows "Not Published"
**Solution**: Publish the page in Sanity Studio

### Form not submitting
**Solution**: 
1. Check API token has write permissions
2. Verify `contactMessage` schema exists
3. Check browser console for errors

### Map not showing
**Solution**:
1. Check "Show Map" is enabled
2. Verify embed URL is correct
3. Use full embed URL from Google Maps

### Social icons not showing
**Solution**:
- Use emoji icons in contact cards (📍, 📱, ⏰, 📧)
- Platform icons auto-display based on selection

---

## 📱 Responsive Design

| Breakpoint | Behavior |
|------------|----------|
| Mobile (< 768px) | Single column, stacked cards |
| Tablet (768px+) | 2-3 column cards grid |
| Desktop (1024px+) | Form + Map side by side |

---

## 🎯 Example Content

### Complete Contact Card Example
```javascript
{
  icon: "📍",
  title: "Our Location",
  content: "123 Tech Park Avenue\nInnovation District\nMumbai, Maharashtra 400001\nIndia",
  link: "https://goo.gl/maps/..."
}
```

### FAQ Example
```javascript
{
  question: "How do I track my order?",
  answer: "Once your order ships, you'll receive a tracking number via email. You can use this number to track your package on our carrier's website.",
  category: "orders"
}
```

---

## 📈 SEO Benefits

- ✅ Server-side rendered content
- ✅ Meta title and description
- ✅ Semantic HTML structure
- ✅ Mobile-friendly responsive design
- ✅ Fast loading with optimized images
- ✅ Structured data for local business

---

## 🚀 Comparison: Before vs After

### Before ❌
- Hardcoded contact information
- Manual updates needed
- No FAQ management
- Static social links
- Form submissions not tracked

### After ✅
- Dynamic from Sanity
- Update in minutes
- Manage FAQs in Studio
- Dynamic social links
- All submissions in Sanity

---

## 📞 Support

### Files Created/Modified
- `schemaTypes/contactPage.js` - Schema definition
- `pages/contact.js` - Next.js page (updated)
- `components/ContactPage.module.css` - Styles (new)

### Related Schemas
- `contactMessage` - Form submissions (already exists)

---

**Created**: March 29, 2026  
**Status**: ✅ Complete & Ready  
**Sanity Build**: ✅ Successful (21s)  
**Auto-Population**: ✅ Enabled

Your Contact page is now fully dynamic and manageable from Sanity Studio! 🎉

---

## 🎉 Summary

You now have **TWO** fully dynamic pages:

1. ✅ **Sampada Stories** (`/stories`) - Customer stories, videos, galleries
2. ✅ **Contact Us** (`/contact`) - Contact info, form, map, FAQs

Both pages:
- Auto-populate from Sanity when published
- Show in navigation when live
- Fully manageable without code changes
- SEO optimized
- Mobile responsive

**Next**: Just create and publish in Sanity Studio!
