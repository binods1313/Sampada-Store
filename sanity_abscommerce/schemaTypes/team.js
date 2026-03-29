// sanity_abscommerce/schemaTypes/team.js
export default {
  name: 'team',
  title: 'Team Page',
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
      name: 'teamIntroductionTitle',
      title: 'Team Introduction Title',
      type: 'string',
    },
    {
      name: 'teamIntroduction',
      title: 'Team Introduction',
      type: 'text',
    },
    {
      name: 'leadershipTitle',
      title: 'Leadership Team Title',
      type: 'string',
    },
    {
      name: 'leadership',
      title: 'Leadership Team',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'position', title: 'Position', type: 'string' },
            { name: 'bio', title: 'Bio', type: 'text' },
            {
              name: 'image',
              title: 'Profile Image',
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
            { name: 'linkedin', title: 'LinkedIn URL', type: 'url' },
            { name: 'twitter', title: 'Twitter URL', type: 'url' }
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'position',
              media: 'image'
            }
          }
        }
      ]
    },
    {
      name: 'departmentsTitle',
      title: 'Departments Title',
      type: 'string',
    },
    {
      name: 'departments',
      title: 'Departments',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Department Name', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            {
              name: 'members',
              title: 'Team Members',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'name', title: 'Name', type: 'string' },
                    { name: 'role', title: 'Role', type: 'string' },
                    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }
                  ],
                  preview: {
                    select: {
                      title: 'name',
                      subtitle: 'role',
                      media: 'image'
                    }
                  }
                }
              ]
            }
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'description'
            }
          }
        }
      ]
    },
    {
      name: 'cultureTitle',
      title: 'Culture Section Title',
      type: 'string',
    },
    {
      name: 'cultureDescription',
      title: 'Culture Description',
      type: 'text',
    },
    {
      name: 'cultureGallery',
      title: 'Culture Gallery',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
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
            },
            { name: 'caption', title: 'Caption', type: 'string' }
          ],
          preview: {
            select: {
              title: 'caption',
              media: 'image'
            }
          }
        }
      ]
    },
    {
      name: 'benefitsTitle',
      title: 'Benefits & Perks Title',
      type: 'string',
    },
    {
      name: 'benefits',
      title: 'Benefits & Perks',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Benefit Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { name: 'icon', title: 'Icon', type: 'string' }
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
      name: 'careersCTATitle',
      title: 'Careers CTA Title',
      type: 'string',
    },
    {
      name: 'careersCTADescription',
      title: 'Careers CTA Description',
      type: 'text',
    },
    {
      name: 'careersCTAButton',
      title: 'Careers CTA Button Text',
      type: 'string',
    },
    {
      name: 'careersCTALink',
      title: 'Careers CTA Link',
      type: 'string',
      description: 'URL to careers page or job listings'
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
        title: title || 'Team Page',
        subtitle: heroTitle || 'Configure team page content'
      }
    }
  }
}
