// schemas/seoFields.js
// Reusable SEO field definitions for all content types

export const seoFields = [
  {
    name: 'seo',
    title: 'SEO Settings',
    type: 'object',
    icon: () => '🔍',
    fields: [
      {
        name: 'metaTitle',
        title: 'Meta Title',
        type: 'string',
        description: 'Recommended: 50-60 characters. Appears in search results and browser tabs.',
        validation: Rule => Rule.max(60).warning('Longer titles may be truncated in search results'),
      },
      {
        name: 'metaDescription',
        title: 'Meta Description',
        type: 'text',
        rows: 3,
        description: 'Recommended: 150-160 characters. Appears under the title in search results.',
        validation: Rule => Rule.max(160).warning('Longer descriptions may be truncated in search results'),
      },
      {
        name: 'keywords',
        title: 'Focus Keywords',
        type: 'array',
        of: [{ type: 'string' }],
        description: 'Primary keywords for this page (for internal tracking and content analysis)',
      },
      {
        name: 'ogImage',
        title: 'Social Sharing Image',
        type: 'image',
        options: { 
          hotspot: true,
          storeDimensions: true 
        },
        description: 'Recommended size: 1200x630px. Appears when shared on Facebook, LinkedIn, etc.',
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
        type: 'url',
        description: 'If this content appears on multiple sites, specify the preferred URL',
      },
      {
        name: 'noIndex',
        title: 'No Index',
        type: 'boolean',
        description: 'Check this to prevent this page from appearing in search results',
        initialValue: false,
      },
    ],
    preview: {
      select: {
        metaTitle: 'metaTitle',
        metaDescription: 'metaDescription',
        ogImage: 'ogImage.asset',
      },
      prepare({ metaTitle, metaDescription, ogImage }) {
        return {
          title: metaTitle || 'No meta title',
          subtitle: metaDescription 
            ? `${metaDescription.substring(0, 80)}${metaDescription.length > 80 ? '...' : ''}`
            : 'No meta description',
          media: ogImage,
        }
      },
    },
  },
]

export default seoFields
