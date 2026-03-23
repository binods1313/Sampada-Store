// sanity_abscommerce/schemaTypes/banner.js
export default {
    name: 'banner',
    title: 'Banner',
    type: 'document',
    fields: [
      {
        name: 'image',
        title: 'Image',
        type: 'image',
        options: { hotspot: true },
        validation: Rule => Rule.required()
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
      }
    ]
  };