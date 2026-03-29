// sanity_abscommerce/schemaTypes/support.js
export default {
  name: 'support',
  title: 'Support Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
        storeDimensions: true,
        metadata: ['blurhash', 'palette']
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Important for accessibility and SEO',
          validation: Rule => Rule.required().error('Alt text is required'),
        },
      ],
    },
    {
      name: 'contactMethodsTitle',
      title: 'Contact Methods Title',
      type: 'string',
    },
    {
      name: 'contactMethods',
      title: 'Contact Methods',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { 
              name: 'method', 
              title: 'Method', 
              type: 'string',
              options: {
                list: [
                  { title: 'Email', value: 'email' },
                  { title: 'Phone', value: 'phone' },
                  { title: 'WhatsApp', value: 'whatsapp' },
                  { title: 'Live Chat', value: 'chat' },
                  { title: 'Contact Form', value: 'form' }
                ]
              }
            },
            { name: 'value', title: 'Contact Value', type: 'string' },
            { name: 'description', title: 'Description', type: 'string' },
            { name: 'icon', title: 'Icon', type: 'string' }
          ],
          preview: {
            select: {
              title: 'method',
              subtitle: 'value'
            }
          }
        }
      ]
    },
    {
      name: 'faqTitle',
      title: 'FAQ Section Title',
      type: 'string',
    },
    {
      name: 'faqDescription',
      title: 'FAQ Description',
      type: 'text',
    },
    {
      name: 'faqs',
      title: 'Frequently Asked Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text' },
            { 
              name: 'category', 
              title: 'Category', 
              type: 'string',
              options: {
                list: [
                  { title: 'General', value: 'general' },
                  { title: 'Orders', value: 'orders' },
                  { title: 'Shipping', value: 'shipping' },
                  { title: 'Returns', value: 'returns' },
                  { title: 'Products', value: 'products' },
                  { title: 'Payment', value: 'payment' }
                ]
              }
            }
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'category'
            }
          }
        }
      ]
    },
    {
      name: 'supportHoursTitle',
      title: 'Support Hours Title',
      type: 'string',
    },
    {
      name: 'supportHours',
      title: 'Support Hours',
      type: 'object',
      fields: [
        {
          name: 'weekdays',
          title: 'Weekdays (Mon-Fri)',
          type: 'string'
        },
        {
          name: 'weekend',
          title: 'Weekend (Sat-Sun)',
          type: 'string'
        },
        {
          name: 'holidays',
          title: 'Holidays',
          type: 'string'
        },
        {
          name: 'timezone',
          title: 'Timezone',
          type: 'string',
          description: 'e.g., IST (Indian Standard Time)'
        }
      ]
    },
    {
      name: 'helpfulResourcesTitle',
      title: 'Helpful Resources Title',
      type: 'string',
    },
    {
      name: 'helpfulResources',
      title: 'Helpful Resources',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { name: 'url', title: 'URL', type: 'string' },
            { 
              name: 'type', 
              title: 'Resource Type', 
              type: 'string',
              options: {
                list: [
                  { title: 'Guide', value: 'guide' },
                  { title: 'Tutorial', value: 'tutorial' },
                  { title: 'Blog Post', value: 'blog' },
                  { title: 'Video', value: 'video' },
                  { title: 'Documentation', value: 'docs' }
                ]
              }
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'type'
            }
          }
        }
      ]
    },
    {
      name: 'ticketSystemEnabled',
      title: 'Enable Ticket System',
      type: 'boolean',
      description: 'Show support ticket submission form',
      initialValue: true
    },
    {
      name: 'ticketDescription',
      title: 'Ticket System Description',
      type: 'text',
      hidden: ({ document }) => !document?.ticketSystemEnabled
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      icon: '🔍',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Recommended: 50-60 characters',
          validation: Rule => Rule.max(60),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Recommended: 150-160 characters',
          validation: Rule => Rule.max(160),
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      heroTitle: 'heroTitle'
    },
    prepare({ title, heroTitle }) {
      return {
        title: title || 'Support Page',
        subtitle: heroTitle || 'Configure support page content'
      }
    }
  }
}
