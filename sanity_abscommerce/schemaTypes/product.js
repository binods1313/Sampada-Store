// schemas/product.js
import { defineField, defineType } from 'sanity'
import { MdLocalOffer as icon } from 'react-icons/md'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon,
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: Rule => Rule.required().error('Product name is required')
    }),
    defineField({
      name: 'slug',
      title: 'Product Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: Rule => Rule.required().error('Required for URLs')
    }),
    defineField({
      name: 'image', // This remains the 'main' image gallery for the product
      title: 'Default Product Images (for primary display)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: Rule => Rule.required().min(1).error('At least 1 default image required')
    }),
    defineField({
      name: 'price',
      title: 'Base Price (USD)',
      type: 'number',
      description: 'This is the default price. Variant prices can override this.',
      validation: Rule => Rule.required().positive('Price must be positive')
    }),
    defineField({
      name: 'discount',
      title: 'Base Discount Percentage',
      type: 'number',
      description: 'Default discount (0-100). Variant discounts can override this.',
      validation: Rule => Rule.min(0).max(100).precision(2),
      initialValue: 0,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: Rule => Rule.required().error('Category is required')
    }),
    defineField({
      name: 'details', // Main description
      title: 'Details',
      type: 'text', // Changed to 'text' for potentially longer descriptions
      rows: 5, // Gives a larger input area in Sanity Studio
    }),
    
    // --- NEW: Product Specifications Field ---
    defineField({
      name: 'specifications',
      title: 'Product Specifications',
      type: 'array',
      description: 'Key technical specifications for the product (e.g., Battery Life, Connectivity, Screen Size).',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'feature',
              title: 'Feature Name',
              type: 'string',
              validation: Rule => Rule.required().error('Feature name is required')
            }),
            defineField({
              name: 'value',
              title: 'Feature Value',
              type: 'string',
              validation: Rule => Rule.required().error('Feature value is required')
            }),
          ],
          preview: {
            select: {
              title: 'feature',
              subtitle: 'value',
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'New Feature',
                subtitle: subtitle ? `Value: ${subtitle}` : '',
              };
            },
          },
        },
      ],
    }),
    // --- END NEW: Product Specifications Field ---
    
    // --- NEW: Product Variant Field ---
    defineField({
      name: 'variants',
      title: 'Product Variants',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'productVariant',
          title: 'Product Variant',
          fields: [
            defineField({
              name: 'colorName',
              title: 'Color Name',
              type: 'string',
              description: 'e.g., "Navy", "Pink", "Black"',
              validation: Rule => Rule.required().error('Color name is required for variant')
            }),
            defineField({
              name: 'colorHex',
              title: 'Color Hex Code (for swatches)',
              type: 'string',
              description: 'e.g., #000080 for Navy. Used for color swatches.',
              validation: Rule => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Invalid Hex Code')
            }),
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {
                list: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'], // Example common sizes
                layout: 'dropdown'
              },
              validation: Rule => Rule.required().error('Size is required for variant')
            }),
            defineField({
              name: 'variantPrice',
              title: 'Variant Price (USD)',
              type: 'number',
              description: 'Price specific to this variant. Overrides Base Price if set.',
              validation: Rule => Rule.min(0).error('Price must be non-negative')
            }),
            defineField({
              name: 'variantDiscount',
              title: 'Variant Discount Percentage',
              type: 'number',
              description: 'Discount specific to this variant. Overrides Base Discount if set.',
              validation: Rule => Rule.min(0).max(100).precision(2)
            }),
            defineField({
              name: 'variantStock',
              title: 'Stock Quantity',
              type: 'number',
              description: 'Number of items of this specific color/size in stock.',
              validation: Rule => Rule.required().integer().min(0).error('Stock must be a non-negative integer')
            }),
            defineField({
              name: 'variantImage',
              title: 'Variant Image',
              type: 'image',
              options: { hotspot: true },
              description: 'Image specific to this color variant. (Only one image per variant).'
            }),
          ],
          // --- FIX APPLIED HERE for productVariant preview ---
          preview: {
            select: {
              colorName: 'colorName',
              size: 'size',
              variantPrice: 'variantPrice',
              variantDiscount: 'variantDiscount', // Ensure variantDiscount is selected
              variantStock: 'variantStock',
              media: 'variantImage',
              basePrice: 'parent.price',
              baseDiscount: 'parent.discount'
            },
            prepare: ({ colorName, size, variantPrice, variantDiscount, variantStock, media, basePrice, baseDiscount }) => {
              // Safely determine price and discount, falling back to 0 if undefined/null
              const actualPrice = (variantPrice !== undefined && variantPrice !== null) ? variantPrice : (basePrice || 0);
              const actualDiscount = (variantDiscount !== undefined && variantDiscount !== null) ? variantDiscount : (baseDiscount || 0);
              
              const displayPrice = actualPrice * (1 - (actualDiscount / 100));
              const displayStock = (variantStock !== undefined && variantStock !== null) ? variantStock : 'N/A'; // Handle missing stock

              let subtitleParts = [];
              if (typeof displayPrice === 'number' && !isNaN(displayPrice)) { // Check if it's a valid number
                  subtitleParts.push(`$${displayPrice.toFixed(2)}`);
              } else {
                  subtitleParts.push('Price: N/A'); // Fallback if price is invalid
              }
              if (actualDiscount > 0) {
                  subtitleParts.push(`${actualDiscount}% OFF`);
              }
              subtitleParts.push(`Stock: ${displayStock}`);
              
              return {
                title: `${colorName || 'No Color'} / ${size || 'No Size'}`,
                subtitle: subtitleParts.filter(Boolean).join(' | '),
                media: media,
              };
            },
          },
        },
      ],
      description: 'Define different color-size combinations for this product. Each variant needs its own stock and can have specific pricing/images.',
    }),
    // --- END NEW: Product Variant Field ---

    // --- NEW: Size Chart Field ---
    defineField({
      name: 'sizeChart',
      title: 'Size Chart Image',
      type: 'image',
      description: 'Upload an image of the size chart for this product (e.g., a table).',
      options: {
        hotspot: true,
      },
    }),
    // --- END NEW: Size Chart Field ---

    // Keep "insight" fields if you use them (already present, no changes needed)
    defineField({
      name: 'specialty',
      title: 'Product Specialty',
      type: 'text',
      description: 'Unique selling point or key feature'
    }),
    defineField({
      name: 'pros',
      title: 'Pros',
      type: 'array', of: [{ type: 'string' }],
      description: 'Positive aspects'
    }),
    defineField({
      name: 'cons',
      title: 'Cons',
      type: 'array', of: [{ type: 'string' }],
      description: 'Potential drawbacks'
    }),
    defineField({
      name: 'bestUseCases',
      title: 'Best Use Cases',
      type: 'array', of: [{ type: 'string' }],
      description: 'Ideal scenarios'
    }),

    // The 'inventory' field is now largely redundant with 'variantStock' but can remain for simpler products or as a fallback
    defineField({
      name: 'inventory',
      title: 'Overall Inventory Count (fallback)',
      type: 'number',
      description: 'Overall inventory if variants are not used, or combined stock. Consider using variant-specific stock instead.',
      initialValue: 0,
      validation: Rule => Rule.integer().min(0).error('Must be non-negative')
    }),
    // Printify Integration Fields
    defineField({
      name: 'printifyIntegration',
      title: 'Printify Integration',
      type: 'object',
      fields: [
        defineField({
          name: 'isPrintifyProduct',
          title: 'Is Printify Product',
          type: 'boolean',
          description: 'Check this if this product is handled by Printify for fulfillment',
          initialValue: false
        }),
        defineField({
          name: 'printifyProductId',
          title: 'Printify Product ID',
          type: 'string',
          description: 'The product ID from your Printify store',
          hidden: ({ document }) => !document?.printifyIntegration?.isPrintifyProduct
        }),
        defineField({
          name: 'printifyBlueprintId',
          title: 'Printify Blueprint ID',
          type: 'number',
          description: 'The blueprint ID from Printify catalog',
          hidden: ({ document }) => !document?.printifyIntegration?.isPrintifyProduct
        }),
        defineField({
          name: 'printProviderName',
          title: 'Print Provider',
          type: 'string',
          description: 'Name of the print provider (e.g., Gooten, Printful)',
          hidden: ({ document }) => !document?.printifyIntegration?.isPrintifyProduct
        })
      ]
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Active', value: 'active' }, // Renamed from Published
          { title: 'Archived', value: 'archived' } // Added Archived
        ],
        layout: 'radio'
      },
      initialValue: 'draft',
      description: 'Set the current status of this product'
    }),
  ],
  // --- FIX APPLIED HERE for main product preview ---
  preview: {
    select: {
      title: 'name',
      media: 'image.0.asset', // Use first default image for preview
      price: 'price',
      discount: 'discount',
      inventory: 'inventory',
      categoryName: 'category.name',
      status: 'status',
      variants: 'variants' // Select variants for more comprehensive preview
    },
    prepare({ title, media, price, discount, inventory, categoryName, status, variants }) {
      let subtitles = [];
      
      // If variants are present, show a summary
      if (Array.isArray(variants) && variants.length > 0) { // Added Array.isArray check for robustness
        const uniqueColors = new Set(variants.map(v => v.colorName).filter(Boolean)).size; // Filter Boolean
        const uniqueSizes = new Set(variants.map(v => v.size).filter(Boolean)).size; // Filter Boolean
        subtitles.push(`${variants.length} variants (${uniqueColors} colors, ${uniqueSizes} sizes)`);
        const totalStock = variants.reduce((sum, v) => sum + ((v.variantStock !== undefined && v.variantStock !== null) ? v.variantStock : 0), 0); // Safer sum
        subtitles.push(`Total Variant Stock: ${totalStock}`);
      } else {
        // Fallback to old behavior if no variants, with robust checks
        if (price !== undefined && price !== null && typeof price === 'number') subtitles.push(`$${price.toFixed(2)}`); // Safer check
        if (discount !== undefined && discount !== null && discount > 0) subtitles.push(`${discount}% OFF`); // Safer check
        if (inventory !== undefined && inventory !== null) subtitles.push(`${inventory} in stock`); // Safer check
      }
      
      if (categoryName) subtitles.push(categoryName);
      if (status) subtitles.push(`Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`);

      return {
        title: title || 'Untitled Product',
        subtitle: subtitles.filter(Boolean).join(' | '),
        media: media
      }
    }
  }
});