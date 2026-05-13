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
    // ✨ BONUS ELEMENTS
    {
      name: 'supportPromise',
      title: 'Support Promise',
      type: 'text',
      description: 'A short promise statement that appears prominently on the support page',
      rows: 3,
      initialValue: 'Your satisfaction is our legacy. Every inquiry is treated with the care and attention that defines the Sampada experience.'
    },
    {
      name: 'trustBadges',
      title: 'Trust Badges',
      type: 'array',
      description: 'Display trust badges to build customer confidence',
      of: [
        {
          type: 'object',
          fields: [
            { 
              name: 'icon', 
              title: 'Icon', 
              type: 'string',
              description: 'Emoji or icon identifier (e.g., 🔒, 📦, 🔄)',
              validation: Rule => Rule.required()
            },
            { 
              name: 'title', 
              title: 'Title', 
              type: 'string',
              validation: Rule => Rule.required()
            },
            { 
              name: 'description', 
              title: 'Description', 
              type: 'string',
              description: 'Optional short description'
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'icon'
            }
          }
        }
      ],
      initialValue: [
        { icon: '🔒', title: 'Secure Payments', description: 'SSL encrypted transactions' },
        { icon: '📦', title: 'Free Shipping on Orders Above ₹2,999', description: 'Pan-India delivery' },
        { icon: '🔄', title: '7-Day Easy Returns', description: 'Hassle-free returns' },
        { icon: '✨', title: '100% Authentic Products', description: 'Genuine heritage designs' },
        { icon: '🇮🇳', title: 'Made in India with Pride', description: 'Supporting local artisans' }
      ]
    },
    {
      name: 'heroStyling',
      title: 'Hero Section Styling',
      type: 'object',
      description: 'Customize the hero section appearance',
      fields: [
        {
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'string',
          description: 'Hex color code (e.g., #0d1126)',
          initialValue: '#0d1126'
        },
        {
          name: 'textColor',
          title: 'Text Color',
          type: 'string',
          description: 'Hex color code (e.g., #f5f0eb)',
          initialValue: '#f5f0eb'
        },
        {
          name: 'accentColor',
          title: 'Accent Color',
          type: 'string',
          description: 'Hex color code for highlights (e.g., #c9a96e)',
          initialValue: '#c9a96e'
        },
        {
          name: 'overlayOpacity',
          title: 'Image Overlay Opacity',
          type: 'number',
          description: 'Value between 0 and 1 (e.g., 0.7)',
          validation: Rule => Rule.min(0).max(1),
          initialValue: 0.7
        },
        {
          name: 'height',
          title: 'Hero Height',
          type: 'string',
          description: 'CSS height value (e.g., 60vh, 500px)',
          initialValue: '60vh'
        }
      ]
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
