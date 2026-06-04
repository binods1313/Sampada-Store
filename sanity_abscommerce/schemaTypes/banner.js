// sanity_abscommerce/schemaTypes/banner.js
import React from 'react';

export default {
    name: 'banner',
    title: 'Banner',
    type: 'document',
    fields: [
      {
        name: 'image',
        title: 'Banner Image',
        type: 'image',
        description: 'Hero emblem. Upload as square PNG with transparent background. Recommended: 512×512px or 1024×1024px.',
        options: { 
          hotspot: false,
          storeDimensions: true,
          metadata: ['blurhash', 'palette'],
        },
        components: {
          preview: (props) => React.createElement('img', {
            src: props?.value?.asset?.url,
            style: {
              objectFit: 'contain',
              width: '100%',
              height: 'auto',
              background: 'transparent'
            }
          })
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
        validation: Rule => Rule.required().custom((image) => {
          if (image?.asset?._ref && image?.asset?.metadata?.dimensions?.aspectRatio) {
            const ratio = image.asset.metadata.dimensions.aspectRatio;
            if (Math.abs(ratio - 1) > 0.05) {
              return 'Logo must be square (1:1 aspect ratio)';
            }
          }
          return true;
        })
      },
      {
        name: 'logo',
        title: 'Logo Image',
        type: 'image',
        options: { 
          hotspot: false,
          storeDimensions: true,
          metadata: ['blurhash', 'palette']
        },
        components: {
          preview: (props) => React.createElement('img', {
            src: props?.value?.asset?.url,
            style: {
              objectFit: 'contain',
              width: '100%',
              height: 'auto',
              background: 'transparent'
            }
          })
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

      // ── NEW FIELDS ──────────────────────────────────────────────
      {
        name: 'heroQuote',
        title: 'Hero Vedic Quote',
        type: 'string',
        description: 'Short powerful Vedic/brand quote shown below the headline. Keep it under 180 characters. E.g. "Woven from the earth. Worn across generations."',
        validation: Rule => Rule.max(180)
      },
      {
        name: 'heroStats',
        title: 'Hero Feature Cards',
        type: 'array',
        description: 'Up to 3 minimalistic stat/feature cards shown below the quote (e.g. 100% | Premium Combed)',
        of: [
          {
            type: 'object',
            name: 'statCard',
            title: 'Feature Card',
            fields: [
              {
                name: 'value',
                title: 'Value / Highlight',
                type: 'string',
                description: 'Bold top line — e.g. "100%", "Teak Wood", "Complimentary"',
                validation: Rule => Rule.required().max(30)
              },
              {
                name: 'label',
                title: 'Label / Sub-text',
                type: 'string',
                description: 'Smaller descriptor — e.g. "Premium Combed", "Engraved Reliefs"',
                validation: Rule => Rule.required().max(40)
              }
            ],
            preview: {
              select: { title: 'value', subtitle: 'label' }
            }
          }
        ],
        validation: Rule => Rule.max(3)
      },
      // ── END NEW FIELDS ──────────────────────────────────────────

      {
        name: 'collectionQuote',
        title: 'Collection Quote',
        type: 'object',
        description: 'Brand quotes for different collection types (Printify theme)',
        fields: [
          {
            name: 'mensQuote',
            title: "Men's Collection Quote",
            type: 'string',
            initialValue: 'Crafted for You, Printed to Perfection.',
            description: 'Quote for men\'s collection pages'
          },
          {
            name: 'womensQuote',
            title: "Women's Collection Quote",
            type: 'string',
            initialValue: 'Crafted for You, Printed to Perfection.',
            description: 'Quote for women\'s collection pages'
          },
          {
            name: 'hisHersQuote',
            title: 'His & Hers Collection Quote',
            type: 'string',
            initialValue: 'Crafted for You, Printed to Perfection.',
            description: 'Quote for his & hers collection pages'
          },
          {
            name: 'supportQuote',
            title: 'Support Page Quote',
            type: 'string',
            initialValue: 'Your satisfaction is our legacy.',
            description: 'Quote for support page'
          },
          {
            name: 'storiesQuote',
            title: 'Stories Page Quote',
            type: 'string',
            initialValue: 'Every design tells a story of heritage and innovation.',
            description: 'Quote for stories page'
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