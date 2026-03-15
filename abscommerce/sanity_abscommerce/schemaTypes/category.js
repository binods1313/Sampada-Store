// schemas/category.js
import { defineField, defineType } from 'sanity'
import { FaTags as icon } from 'react-icons/fa' // Using react-icons

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: icon, // Assign the icon
  fields: [
    defineField({
      name: 'name', // Changed from 'title' to 'name' for consistency with product
      title: 'Category Name',
      type: 'string',
      validation: rule => rule.required().error('Category name is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name', // Generate slug from the 'name' field
        maxLength: 96,
        slugify: input => (input || '') // Ensure input is not undefined
                         .toLowerCase()
                         .replace(/\s+/g, '-')
                         .replace(/[^a-z0-9-]/g, '') // Remove invalid chars
                         .slice(0, 96)
      },
      validation: rule => rule.required().error('Slug is required for URLs'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text', // Using 'text' for potentially longer descriptions than 'string'
      rows: 3, // Suggests a text area size in the Studio
    }),
  ],
  preview: {
    select: {
      title: 'name', // Use 'name' field for preview title
      subtitle: 'slug.current'
    }
  }
})