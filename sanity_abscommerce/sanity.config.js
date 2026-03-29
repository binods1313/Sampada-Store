//sanity_abscommerce/sanity.config.js
import { defineConfig } from 'sanity'
import { visionTool } from '@sanity/vision'
import { structureTool } from 'sanity/structure'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from './schemaTypes'
import { structure } from './structure'

// Import bulk edit tools
import { BulkEditTool } from './plugins/bulk-edit/BulkEditTool'
import { BulkPriceUpdate } from './plugins/bulk-edit/BulkPriceUpdate'

// Define a consistent API version to use throughout the project
const apiVersion = '2024-05-18'

export default defineConfig({
  name: 'default',
  title: 'abscommerce',

  // Add your project details directly
  projectId: '7lh35oho',
  dataset: 'production',

  // Add default API version for the whole project
  apiVersion,

  // Configure the plugins
  plugins: [
    // structureTool() provides the main content editing interface with custom structure
    structureTool({ structure }),

    // visionTool allows you to test GROQ queries
    visionTool({ defaultApiVersion: apiVersion }),

    // codeInput for code blocks in your content
    codeInput(),

    // Media Library is enabled by default in Sanity v4+
    // Access it via the Media tab in the Studio or at sanity.io/manage
  ],

  // Add your schema types
  schema: {
    types: schemaTypes,
  },

  // Register custom tools
  tools: (prev) => [
    ...prev,
    {
      name: 'bulk-edit',
      title: 'Bulk Edit',
      component: BulkEditTool,
      icon: () => '📝',
    },
    {
      name: 'bulk-price-update',
      title: 'Price Updates',
      component: BulkPriceUpdate,
      icon: () => '💰',
    },
  ],

  // Document configuration for better content management
  document: {
    // Enable content releases for scheduled publishing
    actions: (prev, context) => {
      // Add custom document actions here
      return prev
    },
    
    // New document creation defaults
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        // Filter the initial document options in the global "Create" menu
        return prev.filter((item) => 
          ['product', 'category', 'banner', 'aboutUs', 'company', 'support', 'team', 'storiesPage', 'contactPage'].includes(item.templateId)
        )
      }
      return prev
    },
  },

  // Internationalization (optional - enable when you need multi-language)
  // internationalization: {
  //   base: 'en',
  //   languages: ['en', 'es', 'fr', 'de', 'hi'],
  // },
})