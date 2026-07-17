// sanity_abscommerce/schemaTypes/post.js
import { seoFields } from './seoFields'

export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required()
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime'
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
        // AI Assist: only write image description into mainImage.alt.
        // Do NOT target seo.ogImage (fails when seo.ogImage is undefined).
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Important for accessibility and SEO',
          validation: Rule => Rule.error('Alt text is recommended for main images'),
        },
      ],
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string'
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt Text', type: 'string', description: 'Alt text is required for accessibility' },
            { name: 'caption', title: 'Caption', type: 'string' }
          ]
        }
      ]
    },
    // Same SEO object as product schema (metaTitle, metaDescription, keywords/Focus Keywords, ogImage, …)
    ...seoFields,
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'mainImage'
    },
    prepare({ title, author, media }) {
      return {
        title: title || 'Untitled Post',
        subtitle: author ? `by ${author}` : '',
        media
      }
    }
  }
}
