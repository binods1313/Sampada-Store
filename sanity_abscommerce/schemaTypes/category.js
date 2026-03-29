// schemas/category.js
import { defineField, defineType } from 'sanity'
import { FaTags as icon } from 'react-icons/fa'
import { seoFields } from './seoFields'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: icon,
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: rule => rule.required().error('Category name is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: input => (input || '')
                         .toLowerCase()
                         .replace(/\s+/g, '-')
                         .replace(/[^a-z0-9-]/g, '')
                         .slice(0, 96)
      },
      validation: rule => rule.required().error('Slug is required for URLs'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
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
    }),
    
    // SEO Fields
    ...seoFields,
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'slug.current',
      media: 'image.asset',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Untitled Category',
        subtitle: subtitle,
        media: media,
      }
    }
  }
})