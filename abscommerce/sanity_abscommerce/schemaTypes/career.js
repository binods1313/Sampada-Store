// sanity_abscommerce/schemaTypes/career.js
export default {
  name: 'career',
  title: 'Career',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'department',
      title: 'Department',
      type: 'string'
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string'
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      description: 'e.g. Full-time, Part-time, Contract, Internship'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required()
    },
    {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Whether this job listing is currently open',
      initialValue: true
    }
  ],
  preview: {
    select: {
      title: 'title',
      department: 'department',
      location: 'location',
      isActive: 'isActive'
    },
    prepare({ title, department, location, isActive }) {
      const status = isActive === false ? 'Inactive' : 'Active'
      const parts = [department, location, status].filter(Boolean)
      return {
        title: title || 'Untitled Role',
        subtitle: parts.join(' • ')
      }
    }
  }
}
