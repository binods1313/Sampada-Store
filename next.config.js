// next.config.js
/** @type {import('next').NextConfig} */

const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfigCore = {
  reactStrictMode: true,

  // Fix slow filesystem warning on Windows/network drives
  outputFileTracingRoot: path.join(__dirname, './'),

  // Production build optimizations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable gzip compression
  generateEtags: true, // Enable ETag headers for caching

  // Turbopack config (required for Next.js 16+)
  turbopack: {},

  // ISR and build optimizations
  experimental: {
    scrollRestoration: true,
    // Optimize package imports
    optimizePackageImports: [
      'lucide-react',
      'react-icons',
      '@sanity/client',
      'framer-motion',
    ],
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      }
    ],
    formats: ['image/avif', 'image/webp'], // Prioritize modern formats
    qualities: [25, 50, 75, 85, 100],
    minimumCacheTTL: 31536000, // Cache images for 1 year
    deviceSizes: [320, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  webpack: (config, { isServer, dev }) => {
    // rxjs aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      'rxjs': path.resolve(__dirname, './node_modules/rxjs'),
      'rxjs/operators': path.resolve(__dirname, './node_modules/rxjs/operators'),
    };
    if (!config.resolve.fallback) { config.resolve.fallback = {}; }
    config.resolve.fallback['rxjs/operators'] = path.resolve(__dirname, './node_modules/rxjs/operators/index.js');

    // Production webpack optimizations
    if (!dev && !isServer) {
      // Tree shaking
      config.optimization.usedExports = true;
      config.optimization.concatenateModules = true;
      // Split vendor chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // React ecosystem
          react: {
            name: 'react',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            priority: 40,
          },
          // Sanity CMS
          sanity: {
            name: 'sanity',
            test: /[\\/]node_modules[\\/](@sanity|sanity)[\\/]/,
            priority: 35,
          },
          // Icons (split separately since they're heavy)
          icons: {
            name: 'icons',
            test: /[\\/]node_modules[\\/](react-icons|lucide-react)[\\/]/,
            priority: 30,
          },
          // Framer Motion
          motion: {
            name: 'framer-motion',
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            priority: 25,
          },
          // Razorpay
          razorpay: {
            name: 'razorpay',
            test: /[\\/]node_modules[\\/]razorpay[\\/]/,
            priority: 20,
          },
          // Common vendor fallback
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
          },
        },
      };
    }

    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 500,
        ignored: /node_modules/,
        aggregateTimeout: 300,
      };
      config.optimization.moduleIds = 'named';
      config.stats = 'errors-warnings';
      config.performance = { hints: false };
    }

    return config;
  },

  // Production security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfigCore);