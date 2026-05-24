Objective-
The Support page at pages/support.js is already scaffolded and visually live. Content is currently hardcoded. The goal is to wire it fully to Sanity Studio so editors can manage all sections without touching code — and to polish the "Connect With Us" contact cards to match Sampada brand standards.

⚠️ Do NOT rebuild the page from scratch. Preserve existing layout, class names, and structure. Only replace hardcoded strings with Sanity-fetched data and apply the card style improvements below.

Brand tokens non negotiable.

Cream (bg)
#FAF6F0
Crimson (primary)
#8B1A1A
Gold (accent)
#C9A84C
Dark
#1A0A08
Heading font
Cormorant Garamond (serif)
Body font
Inter (sans-serif)
CSS sources
sampada-brand.csssampada-premium-brand.css

sanity schema support.js additions
Add these fields to sanity_abscommerce/schemaTypes/support.js. Each maps 1-to-1 to a visible section on the page.
// ADD to existing support.js schema fields array:

// 1. Hero Section
{ name: 'heroImage', title: 'Hero Background Image', type: 'image' },
{ name: 'heroTagline', title: 'Hero Tagline', type: 'string' },
{ name: 'heroHeading', title: 'Hero Heading', type: 'string' },

// 2. Contact Cards (Connect With Us)
{
  name: 'contactCards',
  title: 'Contact Cards',
  type: 'array',
  of: [{
    type: 'object',
    preview: { select: { title: 'title', subtitle: 'subtitle' } },
    fields: [
      { name: 'title', type: 'string' },
      { name: 'subtitle', type: 'string' },   // e.g. email address or phone
      { name: 'icon', type: 'image' },         // SVG or PNG icon
      { name: 'description', type: 'text' },
      {
        name: 'actionType', type: 'string',
        options: { list: ['email','phone','whatsapp','link','modal'] }
      },
      { name: 'actionValue', type: 'string' }, // mailto:, tel:, url, or modal id
    ]
  }]
},

// 3. Business Hours
{
  name: 'businessHours',
  title: 'Business Hours',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      { name: 'label', type: 'string' },   // e.g. 'Weekdays'
      { name: 'hours', type: 'string' },   // e.g. '9:00 AM – 9:00 PM'
      { name: 'days', type: 'string' },    // e.g. 'Monday – Friday'
    ]
  }]
},
{ name: 'holidayNote', title: 'Holiday Closure Note', type: 'string' },

// 4. FAQ
{
  name: 'faqs',
  title: 'FAQs',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      { name: 'question', type: 'string' },
      { name: 'answer', type: 'text' },
    ]
  }]
},

// 5. Helpful Resources
{
  name: 'resources',
  title: 'Helpful Resources',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      { name: 'title', type: 'string' },
      { name: 'description', type: 'text' },
      { name: 'icon', type: 'image' },
      { name: 'link', type: 'url' },
    ]
  }]
},

// 6. Print-on-Demand Section
{
  name: 'podCards',
  title: 'Print-on-Demand Info Cards',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      { name: 'title', type: 'string' },
      { name: 'description', type: 'text' },
      { name: 'icon', type: 'image' },
    ]
  }]
},

// 7. Still Need Help CTA
{ name: 'ctaHeading', title: 'CTA Heading', type: 'string' },
{ name: 'ctaSubtext', title: 'CTA Subtext', type: 'text' },
{ name: 'ctaButtonLabel', title: 'CTA Button Label', type: 'string' },

Contact card style spec
Update pages/support.js or create components/SupportContactCard.jsx. Add these styles to styles/sampada-brand.css.
.support-cards {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr); /* matches current 2-col layout */
}

.support-card {
  background: #FAF6F0;
  border: 1.5px solid #C9A84C;
  border-radius: 8px;
  padding: 18px;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.support-card:hover,
.support-card:focus {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(26,10,8,0.08);
  border-color: rgba(201,168,76,0.95);
  outline: none;
}

.support-card:focus-visible {
  outline: 3px solid rgba(201,168,76,0.4);
  outline-offset: 2px;
}

.support-card .card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem;
  color: #1A0A08;
  margin: 8px 0 4px;
}

.support-card .card-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #8B1A1A;
  font-weight: 500;
  margin-bottom: 6px;
}

.support-card .card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: #1A0A08;
  line-height: 1.5;
  margin-bottom: 12px;
}

.support-card .card-action {
  font-size: 0.8rem;
  color: #8B1A1A;
  font-weight: 500;
  text-decoration: none;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

@media (max-width: 640px) {
  .support-cards { grid-template-columns: 1fr; gap: 10px; }
  .support-card { padding: 14px; }
}

Card action behavior by actionType:

email
window.location.href = 'mailto:' + actionValue
phone
window.location.href = 'tel:' + actionValue
whatsapp
Open https://wa.me/{number}?text=Hello
link
router.push(actionValue)
modal
Open ticket modal (use Modal.jsx)

Fetch all support page data in one GROQ query from Sanity. Project ID: 7lh35oho, Dataset: production.
// pages/support.js
export async function getServerSideProps() {
  const query = `*[_type == "support"][0]{
    heroImage{ asset->{ url } },
    heroTagline,
    heroHeading,
    contactCards[]{
      title, subtitle, description,
      icon{ asset->{ url } },
      actionType, actionValue
    },
    businessHours[]{ label, hours, days },
    holidayNote,
    faqs[]{ question, answer },
    resources[]{ title, description, link, icon{ asset->{ url } } },
    podCards[]{ title, description, icon{ asset->{ url } } },
    ctaHeading, ctaSubtext, ctaButtonLabel
  }`;

  const data = await client.fetch(query);
  return { props: { pageData: data || {} } };
}

Acceptance Criteria:
✓
All visible text on Support page comes from Sanity — zero hardcoded strings remain
✓
Contact cards have gold border (#C9A84C), cream bg (#FAF6F0), hover lift + shadow
✓
Cards keyboard-focusable, visible focus ring, aria-label on action buttons
✓
Card grid: 2-col desktop → 1-col mobile (≤640px)
✓
All 5 actionTypes work: email, phone, whatsapp, link, modal
✓
FAQ accordion renders from Sanity faqs[] array
✓
Business hours and holiday note editable from Studio
✓
Sanity Studio shows card title + subtitle in array preview (no blank entries)
✓
Page still passes existing visual regression — no layout shifts from changes
✓
PR description lists every changed file

files to change
sanity_abscommerce/schemaTypes/support.js pages/support.js styles/sampada-brand.css components/SupportContactCard.jsx components/Modal.jsx (if ticket modal added) pages/api/support-ticket.js (if ticket API added)