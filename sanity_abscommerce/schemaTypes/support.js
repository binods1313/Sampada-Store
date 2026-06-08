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
    { name: 'heroTitle', title: 'Hero Heading', type: 'string' },
    { name: 'heroTagline', title: 'Hero Tagline', type: 'string', description: 'Small text above heading' },
    { name: 'heroHeading', title: 'Hero Heading (Legacy)', type: 'string', description: 'Large display text' },
    { name: 'heroDescription', title: 'Hero Description', type: 'text' },
    {
      name: 'heroDescription2',
      title: 'Hero Description 2 (Right Panel)',
      description: 'Displays on the right side of the hero banner. Use for a stylistic quote or secondary message.',
      type: 'text',
      rows: 4,
    },
    { name: 'supportPromise', title: 'Support Promise Quote', type: 'string' },
    {
      name: 'heroStyling', title: 'Hero Styling', type: 'object',
      fields: [
        { name: 'backgroundColor', type: 'string' },
        { name: 'textColor', type: 'string' },
        { name: 'accentColor', type: 'string' },
        { name: 'overlayOpacity', type: 'number' },
        { name: 'height', type: 'string' },
      ]
    },
    { name: 'heroImage', title: 'Hero Background Image (Base)', type: 'image', options: { hotspot: true } },
    { name: 'heroRevealImage', title: 'Hero Reveal Image (Spotlight)', type: 'image', options: { hotspot: true } },
    
    // 2. Contact Section
    { name: 'contactMethodsTitle', title: 'Contact Section Heading', type: 'string' },
    {
      name: 'contactMethods', title: 'Contact Cards', type: 'array',
      of: [{
        type: 'object',
        preview: { select: { title: 'method', subtitle: 'value' } },
        fields: [
          { name: 'method', type: 'string',
            options: { list: ['email','phone','whatsapp','chat'] } },
          { name: 'value', type: 'string' },
          { name: 'description', type: 'text' },
          { name: 'icon', type: 'string' },
        ]
      }]
    },
    {
      name: 'contactCards',
      title: 'Contact Cards (Legacy)',
      type: 'array',
      of: [{
        type: 'object',
        preview: { select: { title: 'title', subtitle: 'subtitle' } },
        fields: [
          { name: 'title', type: 'string' },
          { name: 'subtitle', type: 'string' },
          { name: 'icon', type: 'image' },
          { name: 'description', type: 'text' },
          { name: 'actionType', type: 'string', options: { list: ['email','phone','whatsapp','link','modal'] } },
          { name: 'actionValue', type: 'string' },
        ]
      }]
    },
    
    // 3. Business Hours
    { name: 'supportHoursTitle', title: 'Business Hours Section Heading', type: 'string' },
    {
      name: 'supportHours', title: 'Business Hours', type: 'object',
      fields: [
        { name: 'weekdays', type: 'string' },
        { name: 'weekend', type: 'string' },
        { name: 'timezone', type: 'string' },
        { name: 'holidays', type: 'string' },
      ]
    },
    {
      name: 'businessHours',
      title: 'Business Hours (Legacy)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string' },
          { name: 'hours', type: 'string' },
          { name: 'days', type: 'string' },
        ]
      }]
    },
    { name: 'holidayNote', title: 'Holiday Closure Note', type: 'string' },
    
    // 4. FAQ
    { name: 'faqTitle', title: 'FAQ Section Heading', type: 'string' },
    { name: 'faqDescription', title: 'FAQ Section Subtext', type: 'text' },
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
    
    // 5. Resources
    { name: 'helpfulResourcesTitle', title: 'Resources Section Heading', type: 'string' },
    {
      name: 'helpfulResources', title: 'Helpful Resources', type: 'array',
      of: [{
        type: 'object',
        preview: { select: { title: 'title', subtitle: 'type' } },
        fields: [
          { name: 'title', type: 'string' },
          { name: 'description', type: 'text' },
          { name: 'type', type: 'string', options: { list: ['guide','docs','blog'] } },
          { name: 'url', type: 'string' },
        ]
      }]
    },
    {
      name: 'resources',
      title: 'Helpful Resources (Legacy)',
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
    
    // 6. Trust & Badges
    {
      name: 'trustBadges', title: 'Trust Badges', type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'icon', type: 'string' },
        ]
      }]
    },
    
    // 7. Fulfillment Section
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
    
    // 8. Ticket System
    { name: 'ticketDescription', title: 'Support Ticket CTA Text', type: 'text' },
    { name: 'ticketSystemEnabled', title: 'Show Ticket CTA Section', type: 'boolean' },
    { name: 'ctaHeading', title: 'CTA Heading', type: 'string' },
    { name: 'ctaSubtext', title: 'CTA Subtext', type: 'text' },
    { name: 'ctaButtonLabel', title: 'CTA Button Label', type: 'string' },
    
    // SEO
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
      heroHeading: 'heroTitle'
    },
    prepare({ title, heroHeading }) {
      return {
        title: title || heroHeading || 'Support Page'
      }
    }
  }
}
