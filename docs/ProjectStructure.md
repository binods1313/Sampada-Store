# ABSCommerce Project Structure

## Overview

ABSCommerce is a comprehensive full-stack e-commerce platform built with Next.js and Sanity CMS. This document provides a detailed breakdown of the project's directory structure and the purpose of each file and directory.

## Root Directory Structure

```
E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce\
├── .next/                    # Next.js build output
├── .qodo/                    # Qodo configuration files
├── .sanity/                  # Sanity CMS configuration
├── analyze/                  # Analysis tools and scripts
├── components/               # Shared React components
├── context/                  # React context providers
├── dist/                     # Distribution build files
├── hooks/                    # Custom React hooks
├── images/                   # Static image assets
├── lib/                      # Library utilities and helper functions
├── logs/                     # Application logs
├── node_modules/             # Node.js dependencies
├── pages/                    # Next.js pages
├── public/                   # Public assets
├── sanity_abscommerce/       # Sanity CMS studio
├── scripts/                  # Build and deployment scripts
├── styles/                   # CSS styles
├── utils/                    # Utility functions
├── --.babelrc                # Babel configuration (corrupted/duplicate)
├── --.eslintrc.json          # ESLint configuration (corrupted/duplicate)
├── --sanity.config.js        # Sanity configuration (corrupted/duplicate)
├── .env                      # Environment variables
├── .env.local                # Local environment variables
├── .gitignore                # Git ignore rules
├── .npmrc                    # npm configuration
├── .stylelintrc.json         # Stylelint configuration
├── About.md                  # Project overview documentation
├── Build.md                  # Build instructions
├── Errors.md                 # Error handling documentation
├── eslint.config.mjs         # ESLint configuration (ESM)
├── find_shop_id.js           # Utility to find shop ID
├── fix-order-email.html      # Order email template
├── fix-orders.html           # Order fix template
├── Instructions.md           # Development instructions
├── jsconfig.json             # JavaScript configuration
├── next.config.js            # Next.js configuration
├── old_package.json          # Backup of old package.json
├── ORDER_RESOLUTION.md       # Order resolution documentation
├── package-lock.json         # Package lock file
├── package.json              # Project dependencies
├── postcss.config.js         # PostCSS configuration
├── Printify_API_key.md       # Printify API key documentation
├── README.md                 # Project README
├── sanity.cli.js             # Sanity CLI configuration
├── sanity.config.js          # Sanity configuration
├── sanityClient.js           # Sanity client configuration
├── STRIPE_WEBHOOK_SETUP.md   # Stripe webhook setup documentation
├── tailwind.config.js        # Tailwind CSS configuration
├── ToDo.md                   # Current tasks
└── Warnings.md               # Warnings documentation
```

## Detailed Directory and File Explanations

### `.next/`
Next.js build output directory containing compiled application files. This directory is auto-generated and should not be committed to version control.

### `.qodo/`
Configuration files for the Qodo development environment or tool.

### `.sanity/`
Sanity CMS configuration directory containing Sanity-specific settings.

### `analyze/`
Directory for analysis tools and scripts used during development.

### `components/`
React components used throughout the application.

#### `components/Product/`
Product-specific components for displaying and interacting with products.

- `Product.jsx` - Product card component with variant selection
- `ProductCarousel.jsx` - Carousel for displaying multiple products
- Other product-related components

#### Other Components
- `AnimatedCounter.jsx` - Component for animating numerical values
- `Cart.jsx` - Shopping cart component with add/remove functionality
- `CartSlider.jsx` - Sliding cart panel component
- `DarkModeToggle.jsx` - Component for toggling dark/light mode
- `NeumorphicToggle.jsx` - Neumorphic-style dark mode toggle
- `EnhancedErrorHandlerNavigator.jsx` - Error handling navigation component
- `ErrorBoundary.jsx` - React error boundary component
- `ErrorBoundaryWithFallback.jsx` - Error boundary with fallback UI
- `ErrorHandlingTestSuite.jsx` - Test suite for error handling
- `ErrorMonitor.jsx` - Error monitoring component
- `ErrorMonitorDemo.jsx` - Demo for error monitoring
- `FallbackUI.jsx` - Fallback UI component for error states
- `FallbackUI-Examples.jsx` - Examples of fallback UI implementations
- `Footer.jsx` - Website footer component
- `FooterBanner.jsx` - Promotional banner in the footer
- `GooglePayButton.jsx` - Google Pay integration button
- `HeroBanner.jsx` - Hero section banner component
- `ImageOptimizerTest.jsx` - Test component for image optimization
- `ImageOptimizerTest_backup.jsx` - Backup of image optimizer test
- `ImageOptimizerTestNavigator.jsx` - Navigator for image optimizer tests
- `index.js` - Export file for all components
- `Layout.jsx` - Main layout wrapper component
- `LazyImage.jsx` - Component for lazy-loading images
- `LoadingSkeletons.jsx` - Loading skeleton components for better UX
- `LoginModal.jsx` - Modal for user login
- `LoginModalStyles.module.css` - Styles for login modal
- `Navbar.jsx` - Navigation bar component
- `NavbarStyles.module.css` - Styles for navbar
- `NewsletterSignup.jsx` - Newsletter subscription component
- `QuickPreview.jsx` - Quick product preview component
- `ReviewSystem.jsx` - Product review and rating system
- `SanityImage.jsx` - Component for displaying Sanity CMS images
- `SimpleErrorTest.jsx` - Simple error testing component
- `TestSuiteNavigator.jsx` - Navigator for test suites
- `TrendingBadge.jsx` - Badge indicating trending products
- `WishlistSystem.jsx` - Product wishlist functionality

### `context/`
React context providers for managing global state.

- `CartContext.js` - Context for managing shopping cart state
- `StateContext.js` - General application state context
- `ThemeContext.js` - Context for managing theme (light/dark mode)
- `index.js` - Export file for all contexts

### `dist/`
Distribution build files directory containing the production-ready build.

### `hooks/`
Custom React hooks for reusable logic.

- `useAnalytics.js` - Hook for analytics tracking
- `usePerformance.js` - Hook for performance monitoring
- `useSanityFetch.jsx` - Hook for fetching data from Sanity CMS
- `useWishlist.js` - Hook for wishlist functionality
- `index.js` - Export file for all hooks

### `images/`
Static image assets used in the application.

### `lib/`
Library utilities and helper functions.

- `--emailService.js` - Email service utility (corrupted/duplicate)
- `apiErrorHandler.js` - Error handler for API routes
- `client.js` - Client-side utilities
- `email.js` - Email sending utilities
- `errorHandler.js` - General error handling utilities
- `errorHandler.js_backup` - Backup of error handler
- `getStripe.js` - Stripe initialization utility
- `imageOptimizer.d.ts` - TypeScript definitions for image optimizer
- `imageOptimizer.example.js` - Example implementation of image optimizer
- `imageOptimizer.js` - Image optimization utility
- `imageService.js` - Image handling service
- `nextApiErrorHandler.js` - Error handler for Next.js API routes
- `printifyClient.js` - Client for Printify API
- `sanity.js` - Sanity CMS utilities
- `utils.js` - General utility functions

### `logs/`
Application logs directory.

### `pages/`
Next.js pages directory defining the application's routing.

#### `pages/api/`
API routes for server-side functionality.

- `auth/[...nextauth].js` - NextAuth.js authentication configuration
- `orders/create-manual.js` - API for creating manual orders
- `orders/fix-email-mismatch.js` - API for fixing email mismatches in orders
- `orders/fix-user-link.js` - API for fixing user links in orders
- `sanity/write.js` - API for writing to Sanity CMS
- `user/orders.js` - API for fetching user orders
- `stripe.js` - Stripe payment processing API
- `hello.js` - Health check endpoint
- `example-error-handler.js` - Example error handler API
- `test-enhanced-error-handler.js` - Test for enhanced error handler
- `webhooks/` - Webhook endpoints

#### `pages/product/`
Dynamic product pages.

- `[slug].js` - Dynamic product detail page based on product slug

#### `pages/products/`
Product category pages.

- `[id].js` - Dynamic product category page based on category ID

#### Other Pages
- `pages/_app.js` - Next.js custom App component that wraps all pages
- `pages/_document.js` - Custom Document component for controlling page rendering
- `pages/index.js` - Home page of the application
- `pages/about.js` - About page with company information
- `pages/account.js` - User account page with profile and order history
- `pages/contact.js` - Contact page with contact form
- `pages/enhanced-error-handler-demo.js` - Demo page for enhanced error handling
- `pages/error-test-suite.js` - Test suite for error handling components
- `pages/fallback-demo.js` - Demo page for fallback UI components
- `pages/image-optimizer-examples.js` - Examples of image optimization techniques
- `pages/image-optimizer-test.js` - Test page for image optimization
- `pages/simple-test.js` - Simple test page
- `pages/success.js` - Success page after checkout completion
- `pages/test-error-api.js` - Test page for API error handling
- `pages/test-error-component.js` - Test page for component error handling
- `pages/wishlist.js` - Wishlist page showing saved products

### `public/`
Public assets accessible via HTTP requests.

- `assets/` - Additional asset files
  - `about-hero-bg.jpg` - Background image for about page hero
  - `Akky_placeholder-image.jpg` - Placeholder image
  - `company-story.jpg` - Company story image
  - `laceholder-size-chart.jpg` - Size chart placeholder
  - `placeholder-image.jpg` - General placeholder image
- `default-image.jpg` - Default image for products
- `favicon.ico` - Website favicon
- `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` - SVG icons

### `sanity_abscommerce/`
Sanity CMS studio configuration and files.

### `scripts/`
Build and deployment scripts.

### `styles/`
CSS styles for the application.

- `globals.css` - Global styles applied throughout the app
- `About.module.css` - Styles for about page
- `HomePage.module.css` - Styles for home page
- `AuroraFeature.module.css` - Styles for aurora feature
- `EnhancedComponents.module.css` - Styles for enhanced components
- `ErrorHandlingTestSuite.module.css` - Styles for error handling test suite
- `LoadingSkeletons.css` - Styles for loading skeletons
- `ProductCard.css` - Styles for product cards
- `ProductFilters.css` - Styles for product filters
- `ReviewSystem.css` - Styles for review system
- `WishlistSystem.css` - Styles for wishlist system
- `footer-banner-description.css` - Styles for footer banner description
- `product-description.css` - Styles for product descriptions
- `product-variant.css` - Styles for product variants
- `VenturesFooter.module.css` - Styles for ventures footer
- Various image assets used in styles

### `utils/`
Utility functions for various purposes.

- `sanityClient.js` - Sanity client configuration
- `sanityHelpers.js` - Helper functions for Sanity CMS
- `sanityImage.js` - Sanity image utilities
- `sanityImageBuilder.js` - Sanity image builder
- `sanityImageUrl.js` - Sanity image URL utilities

## Configuration Files

### `--.babelrc`, `--.eslintrc.json`, `--sanity.config.js`
Corrupted or duplicate configuration files that should likely be removed.

### `.env`, `.env.local`
Environment variable files containing sensitive configuration data.

### `.gitignore`
Git ignore rules specifying files and directories to exclude from version control.

### `.npmrc`
npm configuration file.

### `.stylelintrc.json`
Stylelint configuration for CSS/SCSS linting.

### `eslint.config.mjs`
ESLint configuration in ES Module format.

### `jsconfig.json`
JavaScript configuration file for IDE support and module resolution.

### `next.config.js`
Next.js configuration file with build settings and custom configurations.

### `package.json`
Project manifest containing dependencies, scripts, and metadata.

### `postcss.config.js`
PostCSS configuration for CSS processing.

### `sanity.config.js`
Sanity CMS configuration file.

### `sanity.cli.js`
Sanity CLI configuration file.

### `tailwind.config.js`
Tailwind CSS configuration file.

## Documentation Files

### `About.md`
Detailed overview of the ABSCommerce project.

### `Build.md`
Build instructions and procedures.

### `Errors.md`
Documentation about error handling in the application.

### `Instructions.md`
Development instructions and guidelines.

### `ORDER_RESOLUTION.md`
Documentation about order resolution processes.

### `Printify_API_key.md`
Documentation about Printify API key configuration.

### `README.md`
Main project README file.

### `STRIPE_WEBHOOK_SETUP.md`
Documentation about Stripe webhook setup.

### `ToDo.md`
Current tasks and to-do items.

### `Warnings.md`
Documentation about warnings and potential issues.

## Utility Files

### `find_shop_id.js`
Utility script to find shop ID.

### `fix-order-email.html`
HTML template for fixing order emails.

### `fix-orders.html`
HTML template for fixing orders.

### `old_package.json`
Backup of the old package.json file.

### `package-lock.json`
Lock file ensuring consistent dependency versions.

## Summary

ABSCommerce is a comprehensive e-commerce platform built with Next.js and Sanity CMS. The project follows a modular architecture with clear separation of concerns between frontend components, backend services, and shared utilities. The project includes advanced features like product management, user authentication, shopping cart, wishlist, reviews, and payment processing with Stripe integration.