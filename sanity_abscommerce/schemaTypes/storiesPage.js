// sanity_abscommerce/schemaTypes/storiesPage.js
export default {
  name: 'storiesPage',
  title: 'Sampada Stories Page',
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
      description: 'URL path for the stories page (e.g., /stories)',
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
        },
        {
          name: 'ctaButton',
          title: 'CTA Button Text',
          type: 'string',
          description: 'e.g., "Explore Stories", "Read More"'
        },
        {
          name: 'ctaLink',
          title: 'CTA Link',
          type: 'string',
          description: 'Anchor link to section (e.g., #latest-stories)'
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
          name: 'content',
          title: 'Introduction Content',
          type: 'array',
          of: [
            { type: 'block' },
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: Rule => Rule.required()
                },
                {
                  name: 'caption',
                  title: 'Caption',
                  type: 'string'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'featuredStories',
      title: 'Featured Stories',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'featuredStory',
          title: 'Featured Story',
          fields: [
            {
              name: 'title',
              title: 'Story Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'excerpt',
              title: 'Story Excerpt',
              type: 'text',
              rows: 3,
              validation: Rule => Rule.max(200)
            },
            {
              name: 'coverImage',
              title: 'Cover Image',
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
                  validation: Rule => Rule.required()
                },
              ],
            },
            {
              name: 'author',
              title: 'Author',
              type: 'string'
            },
            {
              name: 'publishDate',
              title: 'Publish Date',
              type: 'datetime'
            },
            {
              name: 'readTime',
              title: 'Read Time',
              type: 'string',
              description: 'e.g., "5 min read"'
            },
            {
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  { title: 'Customer Success', value: 'customer-success' },
                  { title: 'Product Innovation', value: 'product-innovation' },
                  { title: 'Behind the Scenes', value: 'behind-scenes' },
                  { title: 'Community', value: 'community' },
                  { title: 'Sustainability', value: 'sustainability' },
                  { title: 'Technology', value: 'technology' },
                  { title: 'Design', value: 'design' },
                  { title: 'Other', value: 'other' }
                ]
              }
            },
            {
              name: 'content',
              title: 'Story Content',
              type: 'array',
              of: [
                { type: 'block' },
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    { name: 'alt', title: 'Alt Text', type: 'string', validation: Rule => Rule.required() },
                    { name: 'caption', title: 'Caption', type: 'string' }
                  ]
                },
                {
                  type: 'file',
                  options: { accept: '.pdf,.doc,.docx,.xls,.xlsx' },
                  fields: [
                    { name: 'caption', title: 'File Description', type: 'string' }
                  ]
                }
              ]
            },
            {
              name: 'videoUrl',
              title: 'Video URL (YouTube/Vimeo)',
              type: 'url',
              description: 'Optional embedded video'
            },
            {
              name: 'ctaText',
              title: 'CTA Button Text',
              type: 'string',
              description: 'e.g., "Read Full Story"'
            },
            {
              name: 'ctaLink',
              title: 'CTA Link',
              type: 'string',
              description: 'Full story URL or external link'
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'excerpt',
              media: 'coverImage',
              category: 'category'
            },
            prepare({ title, subtitle, media, category }) {
              return {
                title: title || 'Untitled Story',
                subtitle: `${category ? `[${category}] ` : ''}${subtitle?.substring(0, 80) || ''}`,
                media: media
              }
            }
          }
        }
      ]
    },
    {
      name: 'videoSection',
      title: 'Video Showcase Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text'
        },
        {
          name: 'videos',
          title: 'Videos',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Video Title',
                  type: 'string'
                },
                {
                  name: 'videoUrl',
                  title: 'Video URL (YouTube/Vimeo)',
                  type: 'url'
                },
                {
                  name: 'thumbnail',
                  title: 'Thumbnail Image',
                  type: 'image',
                  options: { hotspot: true }
                },
                {
                  name: 'duration',
                  title: 'Duration',
                  type: 'string',
                  description: 'e.g., "3:45"'
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'text'
                }
              ],
              preview: {
                select: {
                  title: 'title',
                  media: 'thumbnail'
                }
              }
            }
          ]
        }
      ]
    },
    {
      name: 'gallerySection',
      title: 'Photo Gallery Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Gallery Title',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Gallery Description',
          type: 'text'
        },
        {
          name: 'images',
          title: 'Gallery Images',
          type: 'array',
          of: [
            {
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
                  validation: Rule => Rule.required()
                },
                {
                  name: 'caption',
                  title: 'Caption',
                  type: 'string'
                },
                {
                  name: 'photographer',
                  title: 'Photographer Credit',
                  type: 'string'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'testimonialsSection',
      title: 'Testimonials Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string'
        },
        {
          name: 'testimonials',
          title: 'Testimonials',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'quote',
                  title: 'Quote',
                  type: 'text',
                  rows: 4,
                  validation: Rule => Rule.required()
                },
                {
                  name: 'author',
                  title: 'Author Name',
                  type: 'string',
                  validation: Rule => Rule.required()
                },
                {
                  name: 'role',
                  title: 'Role/Title',
                  type: 'string'
                },
                {
                  name: 'company',
                  title: 'Company',
                  type: 'string'
                },
                {
                  name: 'avatar',
                  title: 'Author Photo',
                  type: 'image',
                  options: { hotspot: true }
                },
                {
                  name: 'rating',
                  title: 'Rating',
                  type: 'number',
                  options: {
                    list: [
                      { title: '5 Stars', value: 5 },
                      { title: '4 Stars', value: 4 },
                      { title: '3 Stars', value: 3 }
                    ],
                    layout: 'radio'
                  }
                }
              ],
              preview: {
                select: {
                  title: 'author',
                  subtitle: 'quote',
                  media: 'avatar'
                }
              }
            }
          ]
        }
      ]
    },
    {
      name: 'ctaSection',
      title: 'Call-to-Action Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'CTA Title',
          type: 'string'
        },
        {
          name: 'description',
          title: 'CTA Description',
          type: 'text'
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string'
        },
        {
          name: 'buttonLink',
          title: 'Button Link',
          type: 'string'
        },
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: { hotspot: true }
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
              validation: Rule => Rule.required().error('Alt text is required for social images'),
            },
          ],
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
      ],
      preview: {
        select: {
          metaTitle: 'metaTitle',
          metaDescription: 'metaDescription',
          ogImage: 'ogImage.asset'
        },
        prepare({ metaTitle, metaDescription, ogImage }) {
          return {
            title: metaTitle || 'No meta title',
            subtitle: metaDescription?.substring(0, 80) || 'No description',
            media: ogImage
          }
        }
      }
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'Page publication date'
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
      heroTitle: 'heroSection.title',
      media: 'heroSection.backgroundImage.asset'
    },
    prepare({ title, heroTitle, media }) {
      return {
        title: title || 'Sampada Stories',
        subtitle: heroTitle || 'Stories page configuration',
        media: media
      }
    }
  }
}
