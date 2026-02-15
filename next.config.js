// next.config.js
/** @type {import('next').NextConfig} */

const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfigCore = {
    reactStrictMode: true,

    // Enable standalone output for Docker deployment
    output: 'standalone',
    // Fix workspace root detection warning
    outputFileTracingRoot: path.join(__dirname, './'),

    // ISR and build optimizations
    experimental: {
        // Disabled optimizeCss due to hardcoded critters dependency in Next.js
        // optimizeCss: true,
        scrollRestoration: true,
    },

    // Improve dev experience
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },
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
                hostname: 'storage.googleapis.com',
                port: '',
                pathname: '/**',
            }
        ],
        // Image optimization settings
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
            config.watchOptions = {
                ...config.watchOptions,
                // poll: 500, // Removed for better Fast Refresh stability on native Windows
                ignored: [
                    '**/node_modules/**',
                    '**/System Volume Information/**',
                    '**/$RECYCLE.BIN/**',
                    '**/Thumbs.db',
                    '**/.DS_Store',
                    '**/.next/**',
                    '**/out/**'
                ],
                aggregateTimeout: 300,
            };
            config.optimization.moduleIds = 'named';

            // Conservative webpack optimization for stability
            config.stats = 'errors-warnings';
            config.performance = {
                hints: false
            };
        }



        return config;
    },

    // Performance: Caching Headers
    async headers() {
        return [
            {
                source: '/_next/static/:path*',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            {
                source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, must-revalidate' }],
            },
            {
                source: '/api/:path*',
                headers: [{ key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' }],
            },
        ];
    },

    // Performance optimizations
    compress: true,
    // swcMinify is enabled by default in Next.js 15+
    productionBrowserSourceMaps: false,

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

// Export config without Sentry
module.exports = withBundleAnalyzer(nextConfigCore);