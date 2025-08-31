export default {
  name: 'contactMessage',
  title: 'Contact Messages',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'subject',
      title: 'Subject',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'submitDate',
      title: 'Submission Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Resolved', value: 'resolved' },
          { title: 'Archived', value: 'archived' }
        ],
      },
      initialValue: 'new'
    },
    {
      name: 'notes',
      title: 'Internal Notes',
      type: 'text'
    }
  ],
  preview: {
    select: {
      title: 'subject',
      subtitle: 'name',
      email: 'email'
    },
    prepare(selection) {
      const { title, subtitle, email } = selection;
      return {
        title: title || 'No Subject',
        subtitle: `${subtitle} (${email})`
      };
    }
  },
  orderings: [
    {
      title: 'Submission Date, New',
      name: 'submitDateDesc',
      by: [{ field: 'submitDate', direction: 'desc' }]
    }
  ]
}