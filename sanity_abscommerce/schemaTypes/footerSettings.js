// sanity_abscommerce/schemaTypes/footerSettings.js
export default {
  name: 'footerSettings',
  title: 'Footer Settings',
  type: 'document',
  fields: [
    {
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      description: 'Main brand name displayed in footer',
      validation: Rule => Rule.required()
    },
    {
      name: 'brandTagline',
      title: 'Brand Tagline',
      type: 'string',
      description: 'Short description under brand name',
      validation: Rule => Rule.required()
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
                  { title: 'Twitter', value: 'twitter' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'TikTok', value: 'tiktok' },
                  { title: 'Pinterest', value: 'pinterest' }
                ]
              }
            },
            {
              name: 'url',
              title: 'Profile URL',
              type: 'url',
              validation: Rule => Rule.uri({ scheme: ['http', 'https'] })
            }
          ],
          preview: {
            select: {
              platform: 'platform',
              url: 'url'
            },
            prepare({ platform, url }) {
              return {
                title: platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Social Link',
                subtitle: url
              }
            }
          }
        }
      ]
    },
    {
      name: 'productLinks',
      title: 'Product Section Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Link Label',
              type: 'string'
            },
            {
              name: 'url',
              title: 'Link URL',
              type: 'string',
              description: 'e.g., /features or /products'
            }
          ],
          preview: {
            select: {
              label: 'label',
              url: 'url'
            },
            prepare({ label, url }) {
              return {
                title: label,
                subtitle: url
              }
            }
          }
        }
      ]
    },
    {
      name: 'companyLinks',
      title: 'Company Section Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Link Label',
              type: 'string'
            },
            {
              name: 'url',
              title: 'Link URL',
              type: 'string',
              description: 'e.g., /about or /careers'
            }
          ],
          preview: {
            select: {
              label: 'label',
              url: 'url'
            },
            prepare({ label, url }) {
              return {
                title: label,
                subtitle: url
              }
            }
          }
        }
      ]
    },
    {
      name: 'supportLinks',
      title: 'Support Section Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Link Label',
              type: 'string'
            },
            {
              name: 'url',
              title: 'Link URL',
              type: 'string',
              description: 'e.g., /help or /contact'
            }
          ],
          preview: {
            select: {
              label: 'label',
              url: 'url'
            },
            prepare({ label, url }) {
              return {
                title: label,
                subtitle: url
              }
            }
          }
        }
      ]
    },
    {
      name: 'legalLinks',
      title: 'Legal Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Link Label',
              type: 'string'
            },
            {
              name: 'url',
              title: 'Link URL',
              type: 'string'
            }
          ],
          preview: {
            select: {
              label: 'label',
              url: 'url'
            },
            prepare({ label, url }) {
              return {
                title: label,
                subtitle: url
              }
            }
          }
        }
      ]
    },
    {
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      description: 'Copyright notice displayed at bottom',
      validation: Rule => Rule.required()
    },
    {
      name: 'poweredByText',
      title: 'Powered By Text',
      type: 'string',
      description: 'Optional "Powered by" text (e.g., "Powered by Printify & Stripe")'
    }
  ],
  preview: {
    select: {
      brandName: 'brandName',
      tagline: 'brandTagline'
    },
    prepare({ brandName, tagline }) {
      return {
        title: brandName || 'Footer Settings',
        subtitle: tagline || 'Configure footer content'
      }
    }
  }
}
