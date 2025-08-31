// sanity_abscommerce/vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    exclude: [
      '@sanity/base',
      '@sanity/components',
      '@sanity/icons',
      'react-icons',
      'sanity-plugin-asset-source-unsplash',
      '@sanity/code-input', // Add this to the exclude list
      '@sanity/ui',         // Add this too
      'sanity'              // And this
    ],
    include: [
      'react',
      'react-dom',
      'styled-components'
    ]
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  // Add this section to handle potential module resolution issues
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  // Add this to increase the HMR timeout
  server: {
    hmr: {
      timeout: 2000
    }
  }
})