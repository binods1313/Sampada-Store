// sanity_abscommerce/schemaTypes/story.js
export default {
  name: 'story',
  title: 'Story',
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
      name: 'model',
      title: 'Model Name',
      type: 'string',
      description: 'e.g. Kavya, Priya',
      validation: Rule => Rule.required()
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string'
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string'
            }
          ]
        }
      ]
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'tag',
      title: 'Tag',
      type: 'string',
      description: 'e.g. Winter Drop 2026, Women\'s Collection',
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'published',
      title: 'Published',
      type: 'boolean',
      description: 'Toggle off to hide from frontend',
      initialValue: true
    }
  ],
  preview: {
    select: {
      title: 'title',
      model: 'model',
      media: 'coverImage',
      published: 'published'
    },
    prepare({ title, model, media, published }) {
      return {
        title,
        subtitle: `${model}${published ? '' : ' (Draft)'}`,
        media
      }
    }
  },
  orderings: [
    {
      title: 'Published Date, Newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    }
  ]
}
