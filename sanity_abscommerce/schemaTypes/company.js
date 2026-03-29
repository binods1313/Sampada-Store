// sanity_abscommerce/schemaTypes/company.js
export default {
  name: 'company',
  title: 'Company Page',
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
      name: 'companyInfo',
      title: 'Company Information',
      type: 'object',
      fields: [
        {
          name: 'foundedYear',
          title: 'Founded Year',
          type: 'number'
        },
        {
          name: 'headquarters',
          title: 'Headquarters Location',
          type: 'string'
        },
        {
          name: 'companySize',
          title: 'Company Size',
          type: 'string',
          options: {
            list: [
              { title: '1-10', value: '1-10' },
              { title: '11-50', value: '11-50' },
              { title: '51-200', value: '51-200' },
              { title: '201-500', value: '201-500' },
              { title: '500+', value: '500+' }
            ]
          }
        },
        {
          name: 'industry',
          title: 'Industry',
          type: 'string'
        }
      ]
    },
    {
      name: 'missionTitle',
      title: 'Mission Title',
      type: 'string',
    },
    {
      name: 'missionDescription',
      title: 'Mission Description',
      type: 'text',
    },
    {
      name: 'visionTitle',
      title: 'Vision Title',
      type: 'string',
    },
    {
      name: 'visionDescription',
      title: 'Vision Description',
      type: 'text',
    },
    {
      name: 'valuesTitle',
      title: 'Core Values Title',
      type: 'string',
    },
    {
      name: 'values',
      title: 'Core Values',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Value Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { 
              name: 'icon', 
              title: 'Icon', 
              type: 'image',
              options: { hotspot: true }
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description'
            }
          }
        }
      ]
    },
    {
      name: 'storyTitle',
      title: 'Our Story Title',
      type: 'string',
    },
    {
      name: 'storyContent',
      title: 'Story Content',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'storyImage',
      title: 'Story Image',
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
      name: 'statsTitle',
      title: 'Stats Section Title',
      type: 'string',
    },
    {
      name: 'stats',
      title: 'Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value', type: 'string' },
            { name: 'label', title: 'Label', type: 'string' }
          ]
        }
      ]
    },
    {
      name: 'partnersTitle',
      title: 'Partners & Clients Title',
      type: 'string',
    },
    {
      name: 'partners',
      title: 'Partners & Clients',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } },
            { name: 'website', title: 'Website', type: 'url' }
          ],
          preview: {
            select: {
              title: 'name',
              media: 'logo'
            }
          }
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
        title: title || 'Company Page',
        subtitle: heroTitle || 'Configure company page content'
      }
    }
  }
}
