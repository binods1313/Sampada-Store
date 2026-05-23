 Shell npm run build (Building the Next.js application to check if all build errors are fixed)  │
 │                                                                                                   │
 │    > abscommerce@0.1.0 build                                                                      │
 │    > next build                                                                                   │
 │                                                                                                   │
 │       ▲ Next.js 15.5.2                                                                            │
 │       - Environments: .env.local, .env                                                            │
 │       - Experiments (use with caution):                                                           │
 │         ✓ scrollRestoration                                                                       │
 │                                                                                                   │
 │       Linting and checking validity of types ...                                                  │
 │                                                                                                   │
 │    ./pages/about.js                                                                               │
 │    141:15  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider       │
 │    using `<Image />` from `next/image` or a custom image loader to automatically optimize         │
 │    images. This may incur additional usage or cost from your provider. See:                       │
 │    https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element                     │
 │    168:21  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider       │
 │    using `<Image />` from `next/image` or a custom image loader to automatically optimize         │
 │    images. This may incur additional usage or cost from your provider. See:                       │
 │    https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element                     │
 │    182:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider       │
 │    using `<Image />` from `next/image` or a custom image loader to automatically optimize         │
 │    images. This may incur additional usage or cost from your provider. See:                       │
 │    https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element                     │
 │    191:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider       │
 │    using `<Image />` from `next/image` or a custom image loader to automatically optimize         │
 │    images. This may incur additional usage or cost from your provider. See:                       │
 │    https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element                     │
 │    200:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider       │
 │    using `<Image />` from `next/image` or a custom image loader to automatically optimize         │
 │    images. This may incur additional usage or cost from your provider. See:                       │
 │    https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element                     │
 │                                                                                                   │
 │    ./pages/account.js                                                                             │
 │    281:6  Warning: React Hook useEffect has a missing dependency: 'refreshOrders'. Either         │
 │    include it or remove the dependency array.  react-hooks/exhaustive-deps                        │
 │    353:78  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider       │
 │    using `<Image />` from `next/image` or a custom image loader to automatically optimize         │
 │    images. This may incur additional usage or cost from your provider. See:                       │
 │    https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element                     │
 │                                                                                                   │
 │    ./pages/success.js                                                                             │
 │    90:6  Warning: React Hook useEffect has missing dependencies: 'clearCart', 'router', and       │
 │    'session.user.email'. Either include them or remove the dependency array.                      │
 │    react-hooks/exhaustive-deps                                                                    │
 │                                                                                                   │
 │    ./lib/nextApiErrorHandler.js                                                                   │
 │    411:1  Warning: Assign object to a variable before exporting as module default                 │
 │    import/no-anonymous-default-export                                                             │
 │                                                                                                   │
 │    info  - Need to disable some ESLint rules? Learn more here:                                    │
 │    https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules                        │
 │       Creating an optimized production build ...                                                  │
 │     ✓ Compiled successfully in 2.1min                                                             │
 │       Collecting page data ...                                                                    │
 │       Generating static pages (0/26) ...                                                          │
 │    ErrorHandlingTestSuite imported: [Function: m]                                                 │
                                                            │
                                                           │
                                                           │
 │     ✓ Generating static pages (26/26)                                                             │
 │       Finalizing page optimization ...                                                            │
 │       Collecting build traces ...                                                                 │
 │                                                                                                   │
 │    Route (pages)                                                 Size  First Load JS  Revalidate  │
 │    Expire                                                                                         │
 │    ┌ ƒ /                                                      6.01 kB         249 kB              │
 │    ├   /_app                                                      0 B         243 kB              │
 │    ├ ○ /404                                                   1.27 kB         244 kB              │
 │    ├ ● /about (537 ms)                                        5.75 kB         249 kB          1m  │
 │    1y                                                                                             │
 │    ├ ƒ /account                                               10.3 kB         253 kB              │
 │    ├ ƒ /api/auth/[...nextauth]                                    0 B         243 kB              │
 │    ├ ƒ /api/example-error-handler                                 0 B         243 kB              │
 │    ├ ƒ /api/hello                                                 0 B         243 kB              │
 │    ├ ƒ /api/orders/create-manual                                  0 B         243 kB              │
 │    ├ ƒ /api/orders/fix-email-mismatch                             0 B         243 kB              │
 │    ├ ƒ /api/orders/fix-user-link                                  0 B         243 kB              │
 │    ├ ƒ /api/sanity/write                                          0 B         243 kB              │
 │    ├ ƒ /api/stripe                                                0 B         243 kB              │
 │    ├ ƒ /api/test-enhanced-error-handler                           0 B         243 kB              │
 │    ├ ƒ /api/user/orders                                           0 B         243 kB              │
 │    ├ ƒ /api/webhooks/stripe                                       0 B         243 kB              │
 │    ├ ○ /contact (1704 ms)                                     1.72 kB         245 kB              │
 │    ├ ○ /enhanced-error-handler-demo (1703 ms)                 3.09 kB         246 kB              │
 │    ├ ○ /error-test-suite (1711 ms)                              276 B         243 kB              │
 │    ├ ○ /fallback-demo (1703 ms)                               2.13 kB         245 kB              │
 │    ├ ○ /image-optimizer-examples (1703 ms)                    5.38 kB         248 kB              │
 │    ├ ○ /image-optimizer-test (1704 ms)                          307 B         243 kB              │
 │    ├ ƒ /index_backup                                           2.2 kB         245 kB              │
 │    ├ ● /product/[slug] (27201 ms)                             7.64 kB         251 kB          1m  │
 │    1y                                                                                             │
 │    ├   ├ /product/enhanced-bohemian-inspired-tunic (3031 ms)                                      │
 │    ├   ├ /product/quantum-echo-core-qec-1 (3029 ms)                                               │
 │    ├   ├ /product/shadowfit (3029 ms)                                                             │
 │    ├   ├ /product/radiant-nova-armor-rna-1 (3009 ms)                                              │
 │    ├   ├ /product/SunGlasses (3003 ms)                                                            │
 │    ├   ├ /product/headphones Latest (2993 ms)                                                     │
 │    ├   ├ /product/stellar-nexus-prime-snp-1 (2988 ms)                                             │
 │    ├   └ [+5 more paths] (avg 1224 ms)                                                            │
 │    ├ ƒ /products/[id]                                         1.28 kB         244 kB              │
 │    ├ ○ /simple-test (1702 ms)                                   531 B         243 kB              │
 │    ├ ○ /success (1702 ms)                                      5.3 kB         249 kB              │
 │    ├ ○ /test-error-api                                        1.27 kB         244 kB              │
 │    ├ ○ /test-error-component                                    402 B         243 kB              │
 │    └ ○ /wishlist                                                415 B         243 kB              │
 │    + First Load JS shared by all                               261 kB                             │
 │      ├ chunks/framework-175624a9a3839688.js                   57.7 kB                             │
 │      ├ chunks/main-19112999d408bcd3.js                          35 kB                             │
 │      ├ chunks/pages/_app-b10e547a40c44511.js                   148 kB                             │
 │      ├ css/fc1e17fea947bc90.css                               18.6 kB                             │
 │      └ other shared chunks (total)                            1.81 kB                             │
 │                                                                                                   │
 │    ○  (Static)   prerendered as static content                                                    │
 │    ●  (SSG)      prerendered as static HTML (uses getStaticProps)                                 │
 │    ƒ  (Dynamic)  server-rendered on demand