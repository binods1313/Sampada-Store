export default {
  name: 'navigation',
  title: 'Navigation Menu',
  type: 'document',
  fields: [
    {
      name: 'label',
      title: 'Menu Label',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'href',
      title: 'Destination URL',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'sections',
      title: 'Dropdown Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Section Header',
              type: 'string'
            },
            {
              name: 'items',
              title: 'Menu Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'label',
                      title: 'Item Label',
                      type: 'string'
                    },
                    {
                      name: 'href',
                      title: 'Item URL',
                      type: 'string',
                      description: 'e.g. /collections/womens-tshirts'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ]
}
