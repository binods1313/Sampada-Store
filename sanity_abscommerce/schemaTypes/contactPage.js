// sanity_abscommerce/schemaTypes/contactPage.js
export default {
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // Prevent deletion
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Page Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'URL path for the contact page (e.g., /contact)',
      validation: Rule => Rule.required()
    },
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Hero Title',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'subtitle',
          title: 'Hero Subtitle',
          type: 'text',
          rows: 3
        },
        {
          name: 'backgroundImage',
          title: 'Hero Background Image',
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
        }
      ]
    },
    {
      name: 'introductionSection',
      title: 'Introduction Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 4
        }
      ]
    },
    {
      name: 'contactInformation',
      title: 'Contact Information Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'contactCard',
          title: 'Contact Card',
          fields: [
            {
              name: 'icon',
              title: 'Icon Emoji',
              type: 'string',
              description: 'e.g., 📍, 📱, ⏰, 📧',
              validation: Rule => Rule.required()
            },
            {
              name: 'title',
              title: 'Card Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'content',
              title: 'Content',
              type: 'text',
              rows: 4,
              validation: Rule => Rule.required()
            },
            {
              name: 'link',
              title: 'Link (Optional)',
              type: 'string',
              description: 'e.g., tel:+919876543210, mailto:hello@sampada.com'
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'content',
              icon: 'icon'
            },
            prepare({ title, subtitle, icon }) {
              return {
                title: `${icon || '📍'} ${title}`,
                subtitle: subtitle?.substring(0, 50)
              }
            }
          }
        }
      ]
    },
    {
      name: 'contactFormSection',
      title: 'Contact Form Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Form Title',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Form Description',
          type: 'text'
        },
        {
          name: 'submitButton',
          title: 'Submit Button Text',
          type: 'string',
          defaultValue: 'Send Message'
        },
        {
          name: 'successMessage',
          title: 'Success Message',
          type: 'text',
          description: 'Message shown after successful submission',
          defaultValue: 'Message Sent! Thank you for reaching out. We\'ll get back to you as soon as possible.'
        },
        {
          name: 'errorMessage',
          title: 'Error Message',
          type: 'text',
          description: 'Message shown if there\'s an error',
          defaultValue: 'There was an error submitting your message. Please try again.'
        },
        {
          name: 'showMap',
          title: 'Show Map',
          type: 'boolean',
          description: 'Display Google Maps embed',
          initialValue: false
        },
        {
          name: 'mapEmbedUrl',
          title: 'Google Maps Embed URL',
          type: 'url',
          description: 'Get from Google Maps > Share > Embed a map',
          hidden: ({ document }) => !document?.contactFormSection?.showMap
        }
      ]
    },
    {
      name: 'socialMediaSection',
      title: 'Social Media Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          defaultValue: 'Follow Us'
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'string'
        },
        {
          name: 'socialLinks',
          title: 'Social Media Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'platform',
                  title: 'Platform',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Instagram', value: 'instagram' },
                      { title: 'Facebook', value: 'facebook' },
                      { title: 'Twitter', value: 'twitter' },
                      { title: 'LinkedIn', value: 'linkedin' },
                      { title: 'YouTube', value: 'youtube' },
                      { title: 'WhatsApp', value: 'whatsapp' },
                      { title: 'TikTok', value: 'tiktok' },
                      { title: 'Pinterest', value: 'pinterest' }
                    ]
                  }
                },
                {
                  name: 'url',
                  title: 'Profile URL',
                  type: 'url'
                },
                {
                  name: 'handle',
                  title: 'Handle/Username',
                  type: 'string'
                }
              ],
              preview: {
                select: {
                  platform: 'platform',
                  handle: 'handle'
                },
                prepare({ platform, handle }) {
                  return {
                    title: platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Social',
                    subtitle: handle || ''
                  }
                }
              }
            }
          ]
        }
      ]
    },
    {
      name: 'faqSection',
      title: 'FAQ Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'FAQ Title',
          type: 'string',
          defaultValue: 'Frequently Asked Questions'
        },
        {
          name: 'description',
          title: 'FAQ Description',
          type: 'text'
        },
        {
          name: 'faqs',
          title: 'FAQs',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'question',
                  title: 'Question',
                  type: 'string',
                  validation: Rule => Rule.required()
                },
                {
                  name: 'answer',
                  title: 'Answer',
                  type: 'text',
                  rows: 4,
                  validation: Rule => Rule.required()
                },
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
          validation: Rule => Rule.max(60)
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Recommended: 150-160 characters',
          validation: Rule => Rule.max(160)
        },
        {
          name: 'keywords',
          title: 'Focus Keywords',
          type: 'array',
          of: [{ type: 'string' }]
        },
        {
          name: 'ogImage',
          title: 'Social Sharing Image',
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
              description: 'Important for accessibility and social media',
              validation: Rule => Rule.required().error('Alt text is required for social images')
            }
          ]
        },
        {
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url'
        },
        {
          name: 'noIndex',
          title: 'No Index',
          type: 'boolean',
          description: 'Prevent search engines from indexing this page',
          initialValue: false
        }
      ]
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime'
    },
    {
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime'
    }
  ],
  preview: {
    select: {
      title: 'title',
      heroTitle: 'heroSection.title'
    },
    prepare({ title, heroTitle }) {
      return {
        title: title || 'Contact Page',
        subtitle: heroTitle || 'Contact page configuration'
      }
    }
  }
}
