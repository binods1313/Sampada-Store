// sanity_abscommerce/schemaTypes/blockContent.js
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blockContent',
  title: 'Rich Text',
  type: 'array',
  of: [
    {
      type: 'block',
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Code', value: 'code'}
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'URL',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: Rule => Rule.uri({scheme: ['http', 'https', 'mailto', 'tel']})
              }
            ]
          }
        ]
      },
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'}
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'}
      ]
    },
    {
      type: 'image',
      title: 'Inline image',
      description: 'Add an inline image block inside the rich text body.',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Used for accessibility and SEO.',
          validation: Rule => Rule.required().error('Alt text is required for inline images.')
        }
      ]
    },
    // This is where we define the code block type
    // This will be provided by the @sanity/code-input plugin
    {
      type: 'code',
      title: 'Code Block',
      options: {
        language: 'javascript',
        languageAlternatives: [
          {title: 'JavaScript', value: 'javascript'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'Shell', value: 'shell'}
        ]
      }
    }
  ],
  validation: Rule => Rule.required().error('Content cannot be empty')
})