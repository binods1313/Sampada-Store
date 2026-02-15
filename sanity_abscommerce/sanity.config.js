//sanity_abscommerce/sanity.config.js
import { defineConfig } from 'sanity'
import { visionTool } from '@sanity/vision'
import { structureTool } from 'sanity/structure'
import { codeInput } from '@sanity/code-input'
import { media } from 'sanity-plugin-media'
import { table } from '@sanity/table'
import { schemaTypes } from './schemaTypes'

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
    // structureTool() provides the main content editing interface
    structureTool(),

    // visionTool allows you to test GROQ queries
    visionTool({ defaultApiVersion: apiVersion }),

    // codeInput for code blocks in your content
    codeInput(),

    // media for enhanced media library
    media(),

    // table for table fields in documents
    table(),
  ],

  // Add your schema types
  schema: {
    types: schemaTypes,
  },
})