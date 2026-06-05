// sanity_abscommerce/schemaTypes/support.js
export default {
  name: 'support',
  title: 'Support Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Internal Document Title',
      type: 'string',
      description: 'Internal reference name, not shown on site'
    },
    // 1. Hero Section
    { name: 'heroImage', title: 'Hero Background Image (Base)', type: 'image', options: { hotspot: true } },
    { name: 'heroRevealImage', title: 'Hero Reveal Image (Spotlight)', type: 'image', options: { hotspot: true } },
    { name: 'heroTagline', title: 'Hero Tagline', type: 'string', description: 'Small text above heading' },
    { name: 'heroHeading', title: 'Hero Heading', type: 'string', description: 'Large display text' },

    // 2. Contact Cards (Connect With Us)
    {
      name: 'contactCards',
      title: 'Contact Cards',
      type: 'array',
      of: [{
        type: 'object',
        name: 'contactCard',
        preview: {
          select: {
            title: 'title',
            subtitle: 'subtitle'
          }
        },
        fields: [
          { name: 'title', type: 'string', title: 'Card Title' },
          { name: 'subtitle', type: 'string', title: 'Card Subtitle (Value)', description: 'e.g. email@sampada.com or +91...' },
          { name: 'icon', type: 'image', title: 'Card Icon' },
          { name: 'description', type: 'text', title: 'Short Description' },
          {
            name: 'actionType',
            type: 'string',
            title: 'Action Type',
            options: {
              list: [
                { title: 'Email', value: 'email' },
                { title: 'Phone', value: 'phone' },
                { title: 'WhatsApp', value: 'whatsapp' },
                { title: 'External Link', value: 'link' },
                { title: 'Open Modal', value: 'modal' }
              ]
            }
          },
          { name: 'actionValue', type: 'string', title: 'Action Value', description: 'Email address, phone number, URL, or modal ID' },
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
        name: 'hourEntry',
        preview: {
          select: {
            title: 'label',
            subtitle: 'hours'
          }
        },
        fields: [
          { name: 'label', type: 'string', title: 'Label (e.g. Weekdays)' },
          { name: 'hours', type: 'string', title: 'Hours (e.g. 9:00 AM – 9:00 PM)' },
          { name: 'days', type: 'string', title: 'Days (e.g. Monday – Friday)' },
        ]
      }]
    },
    { name: 'holidayNote', title: 'Holiday Closure Note', type: 'string', description: 'e.g. Closed on major Indian holidays' },

    // 4. FAQ
    {
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [{
        type: 'object',
        name: 'faqEntry',
        preview: {
          select: { title: 'question' }
        },
        fields: [
          { name: 'question', type: 'string', title: 'Question' },
          { name: 'answer', type: 'text', title: 'Answer' },
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
        name: 'resourceEntry',
        preview: {
          select: { title: 'title' }
        },
        fields: [
          { name: 'title', type: 'string', title: 'Resource Title' },
          { name: 'description', type: 'text', title: 'Description' },
          { name: 'icon', type: 'image', title: 'Icon' },
          { name: 'link', type: 'url', title: 'Link URL' },
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
        name: 'podEntry',
        preview: {
          select: { title: 'title' }
        },
        fields: [
          { name: 'title', type: 'string', title: 'Card Title' },
          { name: 'description', type: 'text', title: 'Description' },
          { name: 'icon', type: 'image', title: 'Icon' },
        ]
      }]
    },

    // 7. Still Need Help CTA
    { name: 'ctaHeading', title: 'CTA Heading', type: 'string' },
    { name: 'ctaSubtext', title: 'CTA Subtext', type: 'text' },
    { name: 'ctaButtonLabel', title: 'CTA Button Label', type: 'string' },

    // 8. 16 Missing Fields from Database
    { name: 'contactMethodsTitle', title: 'Contact Methods Title', type: 'string' },
    {
      name: 'contactMethods',
      title: 'Contact Methods (Detailed)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'contactMethod',
        fields: [
          { name: 'method', type: 'string', title: 'Method (e.g. email, phone, whatsapp)' },
          { name: 'value', type: 'string', title: 'Value' },
          { name: 'icon', type: 'string', title: 'Icon name (e.g. envelope, phone, whatsapp)' },
          { name: 'description', type: 'text', title: 'Description' }
        ]
      }]
    },
    { name: 'faqTitle', title: 'FAQ Title', type: 'string' },
    { name: 'faqDescription', title: 'FAQ Description', type: 'text' },
    { name: 'helpfulResourcesTitle', title: 'Helpful Resources Title', type: 'string' },
    {
      name: 'helpfulResources',
      title: 'Helpful Resources (Detailed)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'helpfulResourceEntry',
        fields: [
          { name: 'title', type: 'string', title: 'Title' },
          { name: 'description', type: 'text', title: 'Description' },
          { name: 'type', type: 'string', title: 'Type (e.g. guide, docs, blog)' },
          { name: 'url', type: 'string', title: 'URL' }
        ]
      }]
    },
    { name: 'heroTitle', title: 'Hero Title (Text)', type: 'string' },
    { name: 'heroDescription', title: 'Hero Description', type: 'text' },
    { name: 'heroDescription2', title: 'Hero Description 2 (Secondary)', type: 'text' },
    {
      name: 'heroStyling',
      title: 'Hero Styling Settings',
      type: 'object',
      fields: [
        { name: 'accentColor', type: 'string', title: 'Accent Color' },
        { name: 'backgroundColor', type: 'string', title: 'Background Color' },
        { name: 'height', type: 'string', title: 'Height (e.g. 60vh)' },
        { name: 'overlayOpacity', type: 'number', title: 'Overlay Opacity' },
        { name: 'textColor', type: 'string', title: 'Text Color' }
      ]
    },
    { name: 'supportPromise', title: 'Support Promise Text', type: 'string' },
    { name: 'supportHoursTitle', title: 'Support Hours Title', type: 'string' },
    {
      name: 'supportHours',
      title: 'Support Hours Config',
      type: 'object',
      fields: [
        { name: 'weekdays', type: 'string', title: 'Weekdays' },
        { name: 'weekend', type: 'string', title: 'Weekend' },
        { name: 'timezone', type: 'string', title: 'Timezone' },
        { name: 'holidays', type: 'string', title: 'Holidays' }
      ]
    },
    { name: 'ticketDescription', title: 'Ticket Description', type: 'text' },
    { name: 'ticketSystemEnabled', title: 'Ticket System Enabled', type: 'boolean' },
    {
      name: 'trustBadges',
      title: 'Trust Badges',
      type: 'array',
      of: [{
        type: 'object',
        name: 'trustBadgeEntry',
        fields: [
          { name: 'title', type: 'string', title: 'Title' },
          { name: 'description', type: 'string', title: 'Description' },
          { name: 'icon', type: 'string', title: 'Icon (Emoji or text)' }
        ]
      }]
    },
    
    // SEO Settings
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text' },
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      heroHeading: 'heroHeading'
    },
    prepare({ title, heroHeading }) {
      return {
        title: title || heroHeading || 'Support Page'
      }
    }
  }
}
