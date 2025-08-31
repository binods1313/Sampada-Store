// next.config.js
/** @type {import('next').NextConfig} */

const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfigCore = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**', // Be more specific if possible: /images/YOUR_PROJECT_ID/production/**
      },
      { // Add this if you display user avatars from GitHub
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack: (config, { isServer, dev }) => {
    // Your existing webpack customizations for rxjs and HMR
    config.resolve.alias = {
      ...config.resolve.alias,
      'rxjs': path.resolve(__dirname, './node_modules/rxjs'),
      'rxjs/operators': path.resolve(__dirname, './node_modules/rxjs/operators'),
    };
    if (!config.resolve.fallback) { config.resolve.fallback = {}; }
    config.resolve.fallback['rxjs/operators'] = path.resolve(__dirname, './node_modules/rxjs/operators/index.js');
    if (dev && !isServer) {
      config.watchOptions = { ...config.watchOptions, poll: 500, ignored: /node_modules/, };
      config.optimization.moduleIds = 'named';
    }
    return config;
  },

  // --- REMOVED PROBLEMATIC HEADERS FOR STRIPE COMPATIBILITY ---
  // The Cross-Origin-Embedder-Policy was preventing Stripe redirects from working
  // You can add these back later if needed, but they're not required for most e-commerce apps
  
  // Uncomment below ONLY if you specifically need security headers for other reasons
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         // Only add headers that don't interfere with third-party services
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'DENY',
  //         },
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff',
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'origin-when-cross-origin',
  //         },
  //       ],
  //     },
  //   ];
  // },
};

module.exports = withBundleAnalyzer(nextConfigCore);