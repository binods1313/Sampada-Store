//abscommerce/sanity_abscommerce/schemas/aboutUs.js
export default {
  name: 'aboutUs',
  title: 'About Us',
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
      name: 'teamTitle',
      title: 'Team Section Title',
      type: 'string',
    },
    {
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'position', title: 'Position', type: 'string' },
            { 
              name: 'image', 
              title: 'Image', 
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
      name: 'statsDescription',
      title: 'Stats Description',
      type: 'text',
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
      name: 'contactTitle',
      title: 'Contact Section Title',
      type: 'string',
    },
    {
      name: 'contactDescription',
      title: 'Contact Description',
      type: 'text',
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
  ]
}