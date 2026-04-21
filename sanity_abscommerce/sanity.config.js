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

// Import Top 5 Sanity Plugins for E-Commerce Efficiency
import { assist } from '@sanity/assist'
import { smartAssetManager } from 'sanity-plugin-smart-asset-manager'
import { blockStyles } from 'sanity-plugin-block-styles'
import { references } from 'sanity-plugin-references'
import { media } from 'sanity-plugin-media'

// Import Next 5 Enterprise Plugins for Competitive Edge
import { recursiveHierarchy } from 'sanity-plugin-recursive-hierarchy'
import { colorInput } from 'sanity-plugin-color-input'
import { iframePane } from 'sanity-plugin-iframe-pane'

// Note: Slack Publisher not yet available on npm
// import { slackPublisher } from 'sanity-plugin-slack-publisher' // Coming soon

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

    // ============================================
    // TOP 5 SANITY PLUGINS FOR E-COMMERCE
    // ============================================

    // 1. AI Assist - Auto-generate product content
    assist(),

    // 2. Smart Asset Manager - Optimize media library
    smartAssetManager({
      showFileSize: true,
      showUsageCount: true,
      showDimensions: true,
      enableBulkDelete: true,
      maxFileSizeMB: 5, // Warn if images > 5MB
    }),

    // 3. Block Styles - Rich content styling
    blockStyles({
      styles: [
        {
          name: 'callout',
          title: '📢 Callout',
          icon: '📣',
          style: {
            backgroundColor: 'rgba(201, 168, 76, 0.1)',
            borderLeft: '4px solid #C9A84C',
            padding: '16px',
            borderRadius: '8px',
          },
        },
        {
          name: 'feature-list',
          title: '✨ Feature List',
          icon: '✅',
          style: {
            backgroundColor: '#1a1a1a',
            padding: '16px',
            borderRadius: '8px',
          },
        },
        {
          name: 'warning',
          title: '⚠️ Warning',
          icon: '⚠️',
          style: {
            backgroundColor: 'rgba(139, 26, 26, 0.1)',
            borderLeft: '4px solid #8B1A1A',
            padding: '16px',
            borderRadius: '8px',
          },
        },
        {
          name: 'success',
          title: '✅ Success',
          icon: '✅',
          style: {
            backgroundColor: 'rgba(26, 139, 26, 0.1)',
            borderLeft: '4px solid #1A8B1A',
            padding: '16px',
            borderRadius: '8px',
          },
        },
        {
          name: 'info-box',
          title: 'ℹ️ Info Box',
          icon: 'ℹ️',
          style: {
            backgroundColor: 'rgba(26, 26, 139, 0.1)',
            borderLeft: '4px solid #1A1A8B',
            padding: '16px',
            borderRadius: '8px',
          },
        },
        {
          name: 'promo-banner',
          title: '🎉 Promo Banner',
          icon: '🎉',
          style: {
            backgroundColor: 'linear-gradient(135deg, rgba(201, 168, 76, 0.2), rgba(139, 26, 26, 0.2))',
            border: '2px solid #C9A84C',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
          },
        },
      ],
    }),

    // 4. References - Prevent broken links
    references({
      showInPane: true,
      showBadge: true,
      filterTypes: ['product', 'category', 'order', 'banner', 'collection'],
    }),

    // ============================================
    // NEXT 5 ENTERPRISE PLUGINS FOR COMPETITIVE EDGE
    // ============================================

    // 6. Recursive Hierarchy - Amazon-level category management
    recursiveHierarchy({
      documentType: 'category',
      titleField: 'name',
      childrenField: 'children',
      parentField: 'parent',
      enableDragDrop: true,
      showChildCount: true,
    }),

    // 7. Color Input - Product variant colors
    colorInput(),

    // 8. Media Library - Enhanced asset management (replaces basic media tab)
    media(),

    // 9. Accessibility Preview - Live site preview pane for WCAG checking
    // (replaces incompatible skynet scanner — uses iframe to preview live site)
    // Configured per-document in structure.js via iframePane

    // Note: Google Analytics Dashboard (sanity-plugin-google-analytics) is v2 only.
    // GA data is available at analytics.google.com — link added to Studio sidebar.

    // Note: Tab Block (@multidots/sanity-plugin-tab-block) is v3/v4 only.
    // Tabs are implemented via Sanity's native fieldGroups in product schema.

    // Note: Slack Publisher not yet on npm — documented for future use.

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