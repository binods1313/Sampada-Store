import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'providerId',
      title: 'Auth Provider ID',
      type: 'string',
      description: 'ID from authentication provider (e.g., GitHub, Google)',
      validation: Rule => Rule.required().error('Provider ID is mandatory'),
      readOnly: true,
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
      validation: Rule => Rule.required().email(),
    }),
    defineField({
      name: 'emailVerified',
      title: 'Email Verified',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'image',
      title: 'Image URL',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'orders',
      title: 'Orders',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'order' }] }],
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      providerId: 'providerId',
    },
    prepare({ title, subtitle, providerId }) {
      return {
        title: title || subtitle || 'User',
        subtitle: providerId ? `ID: ${providerId}` : (subtitle || 'No email provided'),
      }
    }
  },
})