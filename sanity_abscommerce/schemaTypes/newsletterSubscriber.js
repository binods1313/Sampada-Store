// sanity_abscommerce/schemaTypes/newsletterSubscriber.js
export default {
  name: 'newsletterSubscriber',
  title: 'Newsletter Subscribers',
  type: 'document',
  fields: [
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      description: 'When the user subscribed'
    },
    {
      name: 'source',
      title: 'Subscription Source',
      type: 'string',
      options: {
        list: [
          { title: 'Homepage Footer', value: 'homepage_footer' },
          { title: 'Checkout', value: 'checkout' },
          { title: 'Pop-up', value: 'popup' },
          { title: 'Other', value: 'other' }
        ]
      }
    },
    {
      name: 'agreedToMarketing',
      title: 'Agreed to Marketing',
      type: 'boolean',
      description: 'User agreed to receive marketing emails'
    },
    {
      name: 'discountCodeSent',
      title: 'Discount Code Sent',
      type: 'boolean',
      description: 'Whether the welcome discount code was sent',
      initialValue: false
    },
    {
      name: 'unsubscribedAt',
      title: 'Unsubscribed At',
      type: 'datetime',
      description: 'When the user unsubscribed (if applicable)'
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Unsubscribed', value: 'unsubscribed' },
          { title: 'Bounced', value: 'bounced' }
        ],
        layout: 'radio'
      },
      initialValue: 'active'
    }
  ],
  preview: {
    select: {
      email: 'email',
      subscribedAt: 'subscribedAt',
      source: 'source',
      status: 'status'
    },
    prepare({ email, subscribedAt, source, status }) {
      const date = subscribedAt ? new Date(subscribedAt).toLocaleDateString() : 'N/A';
      return {
        title: email,
        subtitle: `${date} • ${source || 'Unknown'} • ${status || 'active'}`
      }
    }
  }
}
