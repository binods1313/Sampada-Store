// schemas/order.js
import { defineField, defineType } from 'sanity';
import { FaShoppingCart as icon } from 'react-icons/fa';

export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  icon,
  fields: [
    defineField({
      name: 'stripeSessionId',
      title: 'Stripe Session ID',
      type: 'string',
      readOnly: true,
      description: 'The unique ID from the Stripe Checkout Session.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      description: 'Reference to the user document associated with this order.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'orderItems',
      title: 'Order Items',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'product',
            title: 'Product',
            type: 'reference',
            to: [{ type: 'product' }],
            validation: (rule) => rule.required(),
          },
          {
            name: 'quantity',
            title: 'Quantity',
            type: 'number',
            validation: (rule) => rule.required().min(1).integer(),
          },
          {
            name: 'pricePerItem',
            title: 'Price Per Item',
            type: 'number',
            validation: (rule) => rule.required().min(0),
          },
          defineField({
            name: 'variantColorName',
            title: 'Variant Color',
            type: 'string',
            description: 'Color name if this was a product variant (e.g., "Red", "Blue")'
          }),
          defineField({
            name: 'variantSize',
            title: 'Variant Size',
            type: 'string',
            description: 'Size if this was a product variant (e.g., "M", "XL")'
          }),
          defineField({
            name: 'variantImage',
            title: 'Variant Image',
            type: 'image',
            description: 'Image specific to this variant, if applicable',
            options: { hotspot: true }
          }),
          defineField({
            name: 'variantKey',
            title: 'Variant Key',
            type: 'string',
            description: 'Sanity _key of the selected variant, if applicable. Helps identify exact variant purchased.'
          })
        ],
        preview: {
          select: {
            productName: 'product.name',
            quantity: 'quantity',
            price: 'pricePerItem',
            variantColorName: 'variantColorName',
            variantSize: 'variantSize',
            variantImage: 'variantImage',
            productImage: 'product.image.0',
          },
          prepare({ productName, quantity, price, variantColorName, variantSize, variantImage, productImage }) {
            const subtitleParts = [`${quantity} x $${price?.toFixed(2) || '0.00'}`];
            if (variantColorName || variantSize) {
              subtitleParts.push(`Variant: ${variantColorName || ''}${variantColorName && variantSize ? ' / ' : ''}${variantSize || ''}`);
            }
            return {
              title: productName || 'Unknown product',
              subtitle: subtitleParts.filter(Boolean).join(' | '),
              media: variantImage || productImage
            };
          }
        }
      }],
      description: 'Products included in this order with their quantities and prices',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'items',
      title: 'Items (Legacy)',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{ type: 'product' }],
      }],
      description: 'Legacy field - Use Order Items instead',
      hidden: true,
    }),
    defineField({
      name: 'quantities',
      title: 'Quantities (Legacy)',
      type: 'array',
      of: [{ type: 'number' }],
      description: 'Legacy field - Use Order Items instead',
      hidden: true,
    }),
    defineField({
      name: 'prices',
      title: 'Prices (Legacy)',
      type: 'array',
      of: [{ type: 'number' }],
      description: 'Legacy field - Use Order Items instead',
      hidden: true,
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        { name: 'line1', title: 'Address Line 1', type: 'string' },
        { name: 'line2', title: 'Address Line 2', type: 'string' },
        { name: 'city', title: 'City', type: 'string' },
        { name: 'state', title: 'State/Province', type: 'string' },
        { name: 'postal_code', title: 'Postal Code', type: 'string' },
        { name: 'country', title: 'Country', type: 'string' },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
      description: 'Total amount paid in base currency (e.g., USD, INR).',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Refunded', value: 'refunded' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
      initialValue: 'pending',
    }),
    defineField({
      name: 'paidAt',
      title: 'Paid At',
      type: 'datetime',
    }),
    defineField({
      name: 'shippedAt',
      title: 'Shipped At',
      type: 'datetime',
    }),
    defineField({
      name: 'deliveredAt',
      title: 'Delivered At',
      type: 'datetime',
    }),
    defineField({
      name: 'notes',
      title: 'Order Notes',
      type: 'text',
      description: 'Internal notes about this order (not visible to customers)',
    }),
  ],
  orderings: [
    {
      title: 'Order Date, New',
      name: 'orderDateDesc',
      by: [{ field: 'paidAt', direction: 'desc' }],
    },
    {
      title: 'Order Date, Old',
      name: 'orderDateAsc',
      by: [{ field: 'paidAt', direction: 'asc' }],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }],
    },
    {
      title: 'Total Amount, High',
      name: 'amountDesc',
      by: [{ field: 'totalAmount', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      email: 'customerEmail',
      status: 'status',
      date: 'paidAt',
      amount: 'totalAmount',
      userName: 'user.name',
      // Fixed: Select the entire orderItems array
      orderItems: 'orderItems',
      // Still select the first item's images for the preview media icon
      firstItemVariantImage: 'orderItems.0.variantImage',
      firstItemProductImage: 'orderItems.0.product.image.0',
    },
    prepare(selection) {
      const { 
        email, 
        status, 
        date, 
        amount, 
        userName, 
        orderItems, // Use this for the count
        firstItemVariantImage, 
        firstItemProductImage 
      } = selection;
        // Calculate itemCount using the length of the orderItems array (number of unique products)
      const itemCount = Array.isArray(orderItems) ? orderItems.length : 0;
      
      const displayDate = date ? new Date(date).toLocaleDateString() : 'No date';
      const userInfo = userName ? ` | ${userName}` : '';
      
      const media = firstItemVariantImage || firstItemProductImage;
      
      return {
        title: email || 'No email',
        subtitle: `${status || 'N/A'} | ${displayDate} | $${amount?.toFixed(2) || '0.00'} | ${itemCount} item(s)${userInfo}`,
        media: media
      }
    }
  }
});