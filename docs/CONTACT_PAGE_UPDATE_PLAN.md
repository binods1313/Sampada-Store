# CONTACT PAGE - BRAND CONSISTENCY UPDATE PLAN

**Status**: Ready to implement  
**Complexity**: HIGH (form logic, maps, social media, multiple sections)  
**Priority**: HIGH (after Company/Team pages)

---

## 🎯 TARGET SECTION PATTERN

```
Hero: DARK → Intro: LIGHT → Contact Cards: DARK → Form: LIGHT → Social: DARK → FAQ: LIGHT → CTA: CRIMSON
```

---

## 📋 IMPLEMENTATION CHECKLIST

### 1. Hero Section (DARK)
- [ ] Replace `className={styles.heroSection}` with `className="section-dark s-section"`
- [ ] Remove background image inline style
- [ ] Use `.s-heading` for title
- [ ] Use `.s-label` for subtitle
- [ ] Center content, min-height 50vh

### 2. Introduction Section (LIGHT)
- [ ] Replace with `className="section-light s-section"`
- [ ] Use `.s-container` wrapper
- [ ] Use `.s-heading` and `.s-bar`
- [ ] Max-width 700px, centered

### 3. Contact Information Cards (DARK)
- [ ] Replace with `className="section-dark s-section"`
- [ ] Use `.s-card-dark` for each card
- [ ] Add icon badge circles (40×40px, rgba(139,26,26,0.08))
- [ ] Grid: repeat(auto-fit, minmax(250px, 1fr))

### 4. Contact Form Section (LIGHT)
- [ ] Replace with `className="section-light s-section"`
- [ ] Form container: white card on cream background
- [ ] Input fields: border rgba(139,26,26,0.15)
- [ ] Submit button: `.btn-cta-primary`
- [ ] Success message: white card with checkmark
- [ ] Error message: crimson border-left

### 5. Map Section (LIGHT - same section as form)
- [ ] Keep in same LIGHT section as form
- [ ] 2-column grid: form | map
- [ ] Border-radius 8px on iframe

### 6. Social Media Section (DARK)
- [ ] Replace with `className="section-dark s-section"`
- [ ] Use `.s-heading` and `.s-bar`
- [ ] Social links: `.s-card-dark` style
- [ ] Icons with gold color

### 7. FAQ Section (LIGHT - mid cream)
- [ ] Replace with `className="section-mid s-section"`
- [ ] FAQ items: white cards with crimson left border
- [ ] Same style as Support page FAQs
- [ ] Accordion functionality preserved

### 8. Final CTA (CRIMSON)
- [ ] Add new section: `className="section-crimson s-section"`
- [ ] "Still Have Questions?" heading
- [ ] `.btn-cta-primary` button
- [ ] Link to Support page or email

---

## 🎨 KEY STYLING CHANGES

### Form Inputs
```css
background: #FFFFFF
border: 1px solid rgba(139,26,26,0.15)
border-radius: 4px
padding: 12px 16px
font-family: var(--s-sans)
color: var(--s-text-heading)

focus:
  border-color: var(--s-crimson)
  outline: none
```

### Submit Button
```jsx
<button type="submit" className="btn-cta-primary" disabled={isSubmitting}>
  {isSubmitting ? 'Sending...' : 'Send Message'} <span className="arrow">→</span>
</button>
```

### Social Links
```jsx
<a href={social.url} className="s-card-dark" style={{ display: 'block', textDecoration: 'none' }}>
  <div className="s-card-icon">{socialIcons[social.platform]}</div>
  <h3 className="s-card-title">{social.platform}</h3>
  {social.handle && <p className="s-card-hi">@{social.handle}</p>}
</a>
```

---

## ⚠️ PRESERVE FUNCTIONALITY

**CRITICAL**: Must preserve:
- ✅ Form state management (useState)
- ✅ Form submission logic (handleSubmit)
- ✅ Form validation
- ✅ Success/error messages
- ✅ Google Maps embed
- ✅ Social media links
- ✅ FAQ accordion (if present)
- ✅ Conditional rendering

---

## 📝 IMPLEMENTATION STEPS

### Step 1: Update Imports
```javascript
// Remove: import styles from '@/components/ContactPage.module.css'
// Keep all other imports
```

### Step 2: Replace Hero Section
```jsx
<section className="section-dark s-section" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
  <div className="s-container" style={{ textAlign: 'center' }}>
    <h1 className="s-heading">{heroSection?.title || 'Get in Touch'}</h1>
    {heroSection?.subtitle && (
      <p style={{ color: 'var(--s-text-mid)', fontSize: '1.1rem', marginTop: '16px' }}>
        {heroSection.subtitle}
      </p>
    )}
  </div>
</section>
```

### Step 3: Update Form Section
```jsx
<section className="section-light s-section">
  <div className="s-container">
    <div style={{ display: 'grid', gridTemplateColumns: contactFormSection.showMap ? '1fr 1fr' : '1fr', gap: '48px' }}>
      {/* Form */}
      <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '8px', border: '1px solid rgba(139,26,26,0.12)' }}>
        {/* Form content */}
      </div>
      {/* Map */}
      {contactFormSection.showMap && (
        <div>
          <iframe ... />
        </div>
      )}
    </div>
  </div>
</section>
```

### Step 4: Add Final CTA
```jsx
<section className="section-crimson s-section">
  <div className="s-container" style={{ textAlign: 'center', maxWidth: '600px' }}>
    <h2 className="s-heading">Still Have Questions?</h2>
    <p style={{ color: 'rgba(250,246,240,0.85)', margin: '16px 0 32px' }}>
      Need more help? Visit our support page for FAQs and resources.
    </p>
    <Link href="/support" className="btn-cta-primary">
      Visit Support <span className="arrow">→</span>
    </Link>
  </div>
</section>
```

---

## 🧪 TESTING CHECKLIST

After implementation:
- [ ] Form submission works
- [ ] Success message displays
- [ ] Error handling works
- [ ] Map embed displays
- [ ] Social links work
- [ ] FAQ accordion works (if present)
- [ ] Responsive on mobile
- [ ] All sections alternate correctly
- [ ] Typography uses Cormorant Garamond
- [ ] Colors match brand (cream/crimson/gold)

---

## 📊 ESTIMATED COMPLEXITY

- **Lines to change**: ~200-300
- **Sections to update**: 7-8
- **Functionality to preserve**: Form logic, map, social, FAQ
- **Time estimate**: 30-45 minutes careful work

---

## 🎯 RECOMMENDATION

Due to complexity and need to preserve form functionality:

**Option A**: Implement now (careful, methodical)  
**Option B**: Implement after user tests Support/Company/Team pages  
**Option C**: Create new simplified contact page, keep old as backup

---

**STATUS**: Plan documented, ready for implementation when user confirms approach.
