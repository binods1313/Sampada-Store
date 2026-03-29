// sanity_abscommerce/schemaTypes/banner.js
export default {
    name: 'banner',
    title: 'Banner',
    type: 'document',
    fields: [
      {
        name: 'image',
        title: 'Banner Image',
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
        validation: Rule => Rule.required()
      },
      {
        name: 'logo',
        title: 'Logo Image',
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
          },
        ],
        description: 'Optional logo for footer banner (defaults to Sampada emblem if not provided)'
      },
      {
        name: 'buttonText',
        title: 'Button Text',
        type: 'string',
        validation: Rule => Rule.required()
      },
      {
        name: 'product',
        title: 'Product Reference',
        type: 'string',
        description: 'Use product slug or ID'
      },
      {
        name: 'desc',
        title: 'Description',
        type: 'string',
        validation: Rule => Rule.max(150)
      },
      {
        name: 'smallText',
        title: 'Small Text',
        type: 'string',
        validation: Rule => Rule.max(50)
      },
      {
        name: 'midText',
        title: 'Mid Text',
        type: 'string',
        validation: Rule => Rule.max(100)
      },
      {
        name: 'largeText1',
        title: 'Large Text 1',
        type: 'string',
        validation: Rule => Rule.required()
      },
      {
        name: 'largeText2',
        title: 'Large Text 2',
        type: 'string',
        validation: Rule => Rule.required()
      },
      {
        name: 'discount',
        title: 'Discount',
        type: 'string',
        validation: Rule => Rule.required()
      },
      {
        name: 'saleTime',
        title: 'Sale Duration',
        type: 'string',
        validation: Rule => Rule.required()
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
        title: 'largeText1',
        subtitle: 'desc',
        media: 'image.asset',
      },
      prepare({ title, subtitle, media }) {
        return {
          title: title || 'Untitled Banner',
          subtitle: subtitle,
          media: media,
        }
      },
    },
  };