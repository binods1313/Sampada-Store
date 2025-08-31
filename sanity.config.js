// abscommerce/sanity.config.js
/**
 * This configuration is used for the Sanity Studio.
 */
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { codeInput } from '@sanity/code-input';

// Retrieve configuration values from environment variables.
// Vite automatically loads these from .env.local if it's in the project root.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-05-18';

// Debug log to ensure the variable is loaded.
console.log("Sanity projectId:", projectId);

if (!projectId) {
  throw new Error(
    "Configuration error: `projectId` is missing. Please set NEXT_PUBLIC_SANITY_PROJECT_ID in your .env.local file."
  );
}

import { schemaTypes } from './sanity_abscommerce/schemaTypes';
import { structure } from './sanity_abscommerce/structure';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({ structure }),
    // Vision plugin for querying GROQ from inside the Studio
    visionTool({ defaultApiVersion: apiVersion }),
    codeInput(),
  ],
  document: {
    productionUrl: async (prev, context) => {
      return prev;
    },
  },
});
