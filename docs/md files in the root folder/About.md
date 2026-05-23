# ABSCommerce

## Overview

ABSCommerce is a comprehensive full-stack e-commerce platform built with Next.js and Sanity CMS. The application provides a modern, responsive shopping experience with features like product management, user authentication, shopping cart functionality, wishlist system, review management, and order processing integrated with Stripe payments. The platform specializes in tech products including headphones, smartwatches, space suits, and sunglasses, with a focus on the "Aurora Sky Pulse™" product line.

## Features

### Core Features
- **Product Management**: Complete product catalog with variant support (colors, sizes), dynamic pricing, and inventory management
- **User Authentication**: GitHub OAuth integration with NextAuth.js for secure user sessions
- **Shopping Cart**: Real-time cart management with add/remove items, quantity controls, and persistent state
- **Wishlist System**: Save favorite products with add/remove functionality and wishlist page
- **Review & Rating System**: Five-star rating system, written reviews, helpful votes, and reply functionality
- **Order Management**: Complete order processing, history tracking, and email integration
- **Payment Processing**: Stripe checkout integration with international shipping support
- **Search & Filtering**: Advanced product search, category filtering, price range filters, and sorting options

### Additional Functionalities
- **Responsive Design**: Mobile-first design with adaptive layouts for all screen sizes
- **Image Management**: Optimized image handling with Sanity's image transformation API
- **Performance Optimization**: Loading skeletons, virtual scrolling, and lazy loading for enhanced UX
- **Content Management**: Sanity CMS integration for dynamic content and product management
- **Error Handling**: Comprehensive error boundaries and fallback UI components
- **SEO Optimization**: Dynamic meta tags, structured data, and optimized URLs

## Technical Implementation

### Technology Stack
- **Frontend**: Next.js 15.2.4, React 19.1.0, React DOM 19.1.0
- **Backend**: Next.js API routes with serverless functions
- **Database**: Sanity CMS with GROQ query language
- **Authentication**: NextAuth.js with GitHub OAuth provider
- **Payment Processing**: Stripe API integration
- **Styling**: CSS Modules, global CSS, and responsive design
- **State Management**: React Context API for cart and UI state
- **Image Processing**: Sanity Image URLs with optimization
- **Email Service**: SendGrid integration for order notifications
- **Development Tools**: ESLint, Prettier, TypeScript support

### Architecture
The application follows a **modern JAMstack architecture** with:
- **Static Site Generation (SSG)** for product pages and performance optimization
- **Server-Side Rendering (SSR)** for dynamic user content and SEO
- **API-first approach** with RESTful endpoints for all operations
- **Headless CMS architecture** using Sanity for content management
- **Serverless deployment** ready for Vercel or similar platforms

### Key Components

1. **Product System**:
   - `Product.jsx` - Product card display with variant selection
   - `ProductFilters.jsx` - Advanced filtering and search functionality
   - `[slug].js` - Dynamic product detail pages with full specification display

2. **Shopping Experience**:
   - `Cart.jsx` & `CartSlider.jsx` - Shopping cart with real-time updates
   - `WishlistSystem.jsx` - Complete wishlist management
   - `Navbar.jsx` - Navigation with cart/wishlist indicators

3. **User Management**:
   - `account.js` - User profile and order history
   - `[...nextauth].js` - Authentication configuration
   - User session management across the application

4. **Content & Layout**:
   - `Layout.jsx` - Main application wrapper
   - `HeroBanner.jsx` & `FooterBanner.jsx` - Marketing content sections
   - `LoadingSkeletons.jsx` - Performance optimization components

## Current Implementation Status

### Completed Features
- ✅ **Product Catalog**: Full product management with variants, pricing, and inventory
- ✅ **User Authentication**: GitHub OAuth with user profile management
- ✅ **Shopping Cart**: Add/remove items, quantity management, persistent state
- ✅ **Wishlist System**: Complete wishlist functionality with dedicated page
- ✅ **Review System**: Star ratings, written reviews, helpful votes, and replies
- ✅ **Order Processing**: Stripe integration with order history and tracking
- ✅ **Search & Filtering**: Advanced product discovery and sorting
- ✅ **Responsive Design**: Mobile-optimized layouts and components
- ✅ **Performance Features**: Loading states, skeleton screens, image optimization
- ✅ **Content Management**: Sanity CMS integration with rich content types

### API Endpoints
| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| POST | `/api/stripe` | Process Stripe checkout sessions | ✅ |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth.js authentication | ✅ |
| GET | `/api/user/orders` | Fetch user order history | ✅ |
| POST | `/api/orders/fix-email-mismatch` | Fix order email mismatches | ✅ |
| POST | `/api/sanity/webhook` | Sanity content webhook | ✅ |
| GET | `/api/hello` | Health check endpoint | ✅ |

## Database Schema

### Main Collections (Sanity)

- **Product**: Core product information with variants, pricing, specifications, and media
  - Fields: name, slug, image[], price, discount, category, details, specifications[], variants[]
  - Variants include: colorName, colorHex, size, variantPrice, variantDiscount, variantStock, variantImage

- **Category**: Product categorization system
  - Fields: name, slug, description, image

- **User**: User profile and authentication data
  - Fields: providerId, name, email, image, emailVerified

- **Order**: Complete order management
  - Fields: orderItems[], totalAmount, paidAt, status, user reference, shipping details

- **Banner**: Marketing content for hero and footer sections
  - Fields: discount, largeText1, largeText2, saleTime, desc, smallText, midText, product, buttonText, image

- **Contact Message**: Contact form submissions
  - Fields: name, email, subject, message, submitDate

## Configuration & Environment

### Environment Variables
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Sanity project identifier
- `NEXT_PUBLIC_SANITY_DATASET`: Sanity dataset name (production/development)
- `SANITY_API_WRITE_TOKEN`: Write access token for Sanity operations
- `STRIPE_SECRET_KEY`: Stripe secret key for payment processing
- `GITHUB_ID` & `GITHUB_SECRET`: GitHub OAuth application credentials
- `NEXTAUTH_SECRET`: NextAuth.js session encryption secret
- `SENDGRID_API_KEY`: SendGrid API key for email services

### Configuration Files
- `next.config.js`: Next.js build and runtime configuration
- `sanity.config.js`: Sanity Studio configuration and schema definitions
- `jsconfig.json`: JavaScript project configuration with path aliases
- `package.json`: Dependencies and script definitions

## Security Features
- **Authentication**: OAuth-based login with session management
- **Authorization**: Protected routes and API endpoints with session validation
- **Data Validation**: Input validation on both client and server sides
- **CSRF Protection**: Built-in NextAuth.js CSRF protection
- **Environment Security**: Secure environment variable management
- **Payment Security**: PCI-compliant Stripe integration

## Performance & Optimization
- **Image Optimization**: Next.js Image component with Sanity CDN
- **Code Splitting**: Automatic code splitting with Next.js
- **Caching Strategies**: Browser caching and API response optimization
- **Loading States**: Skeleton screens and loading indicators
- **Lazy Loading**: Dynamic imports for non-critical components
- **Virtual Scrolling**: Efficient handling of large product lists

## Dependencies

### Main Dependencies
- `next`: 15.2.4 - React framework with SSR/SSG capabilities
- `react`: 19.1.0 - Core React library
- `@sanity/client`: 6.29.1 - Sanity CMS client
- `next-auth`: 4.24.11 - Authentication solution
- `stripe`: 8.209.0 - Payment processing
- `@stripe/stripe-js`: 1.54.2 - Stripe frontend integration
- `react-icons`: 5.5.0 - Icon library
- `react-hot-toast`: 2.5.2 - Toast notifications
- `framer-motion`: 12.7.4 - Animation library

### Development Dependencies
- `eslint`: 9 - Code linting
- `prettier`: 3.5.3 - Code formatting
- `typescript`: 5.8.3 - Type checking
- `tailwindcss`: 4.1.6 - Utility-first CSS framework

## Project Structure

```
E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce\
├── .next/                    # Next.js build output
├── .qodo/                    # Qodo configuration
├── .sanity/                  # Sanity configuration
├── analyze/                  # Analysis tools
├── components/               # React components
│   ├── Product/              # Product-specific components
│   │   ├── Product.jsx       # Product card component
│   │   └── ...               # Other product components
│   ├── Cart.jsx              # Shopping cart component
│   ├── CartSlider.jsx        # Cart slider component
│   ├── NeumorphicToggle.jsx  # Neumorphic dark mode toggle
│   ├── DarkModeToggle.jsx    # Legacy dark mode toggle (deprecated)
│   ├── Footer.jsx            # Footer component
│   ├── FooterBanner.jsx      # Footer banner component
│   ├── HeroBanner.jsx        # Hero banner component
│   ├── Layout.jsx            # Main layout component
│   ├── Navbar.jsx            # Navigation component
│   ├── ProductFilters.jsx    # Product filtering component
│   ├── ReviewSystem.jsx      # Review and rating system
│   ├── WishlistSystem.jsx    # Wishlist functionality
│   ├── LoadingSkeletons.jsx  # Loading skeletons
│   ├── AnimatedCounter.jsx   # Animated counter
│   ├── ErrorBoundary.jsx     # Error boundary
│   ├── QuickPreview.jsx      # Quick preview component
│   ├── TrendingBadge.jsx     # Trending badge component
│   ├── LazyImage.jsx         # Lazy loading image
│   ├── SanityImage.jsx       # Sanity image component
│   ├── NewsletterSignup.jsx  # Newsletter signup
│   ├── EnhancedErrorHandlerNavigator.jsx
│   ├── ErrorHandlingTestSuite.jsx
│   ├── FallbackUI.jsx
│   ├── ImageOptimizerTest.jsx
│   ├── ImageOptimizerTestNavigator.jsx
│   ├── TestSuiteNavigator.jsx
│   ├── ErrorMonitor.jsx
│   ├── ErrorMonitorDemo.jsx
│   ├── FallbackUI-Examples.jsx
│   ├── ErrorBoundaryWithFallback.jsx
│   ├── ErrorHandlingTestSuite.jsx
│   ├── SimpleErrorTest.jsx
│   ├── index.js              # Export components
│   └── NavbarStyles.module.css # Navbar styles
├── context/                  # React context providers
│   ├── CartContext.js        # Shopping cart context
│   ├── StateContext.js       # Global state context
│   ├── ThemeContext.js       # Theme context
│   └── index.js              # Export contexts
├── hooks/                    # Custom React hooks
│   ├── useAnalytics.js       # Analytics hook
│   ├── usePerformance.js     # Performance hook
│   ├── useSanityFetch.jsx    # Sanity fetch hook
│   ├── useWishlist.js        # Wishlist hook
│   └── index.js              # Export hooks
├── images/                   # Static images
├── lib/                      # Library utilities
├── logs/                     # Application logs
├── node_modules/             # Node.js dependencies
├── pages/                    # Next.js pages
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication API
│   │   │   └── [...nextauth].js # NextAuth configuration
│   │   ├── orders/           # Order management API
│   │   │   ├── create-manual.js
│   │   │   ├── fix-email-mismatch.js
│   │   │   └── fix-user-link.js
│   │   ├── sanity/           # Sanity API
│   │   │   └── write.js
│   │   ├── user/             # User API
│   │   │   └── orders.js     # User orders API
│   │   ├── stripe.js         # Stripe payment processing
│   │   ├── hello.js          # Health check endpoint
│   │   ├── example-error-handler.js
│   │   ├── test-enhanced-error-handler.js
│   │   └── webhooks/         # Webhook endpoints
│   ├── product/              # Product pages
│   │   └── [slug].js         # Dynamic product page
│   ├── products/             # Product category pages
│   │   └── [id].js           # Dynamic product category page
│   ├── _app.js               # Next.js app wrapper
│   ├── _document.js          # Custom document
│   ├── index.js              # Home page
│   ├── about.js              # About page
│   ├── account.js            # User account page
│   ├── contact.js            # Contact page
│   ├── success.js            # Success page after checkout
│   ├── wishlist.js           # Wishlist page
│   ├── enhanced-error-handler-demo.js
│   ├── error-test-suite.js
│   ├── fallback-demo.js
│   ├── image-optimizer-examples.js
│   ├── image-optimizer-test.js
│   ├── simple-test.js
│   ├── test-error-api.js
│   └── test-error-component.js
├── public/                   # Public assets
├── sanity_abscommerce/       # Sanity CMS studio
├── scripts/                  # Build/deployment scripts
├── styles/                   # CSS styles
│   ├── globals.css           # Global styles
│   ├── About.module.css      # About page styles
│   ├── HomePage.module.css   # Home page styles
│   ├── AuroraFeature.module.css # Aurora feature styles
│   ├── EnhancedComponents.module.css
│   ├── ErrorHandlingTestSuite.module.css
│   ├── LoadingSkeletons.css  # Loading skeleton styles
│   ├── ProductCard.css       # Product card styles
│   ├── ProductFilters.css    # Product filters styles
│   ├── ReviewSystem.css      # Review system styles
│   ├── WishlistSystem.css    # Wishlist system styles
│   ├── footer-banner-description.css
│   ├── product-description.css
│   ├── product-variant.css   # Product variant styles
│   ├── VenturesFooter.module.css
│   ├── cropping.png          # Image asset
│   ├── Home_page.jpeg        # Image asset
│   ├── Image Optimizer Examples.jpeg
│   ├── Image Optimizer Test Suite.jpeg
│   ├── problems.jpeg         # Image asset
│   ├── Product_Detail_page.jpeg
│   └── ...                   # Other style files
├── utils/                    # Utility functions
│   ├── sanityClient.js       # Sanity client configuration
│   ├── sanityHelpers.js      # Sanity helper functions
│   ├── sanityImage.js        # Sanity image utilities
│   ├── sanityImageBuilder.js # Sanity image builder
│   └── sanityImageUrl.js     # Sanity image URL utilities
├── .babelrc                  # Babel configuration
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore rules
├── .npmrc                    # npm configuration
├── About.md                  # This file
├── Build.md                  # Build instructions
├── Errors.md                 # Error handling documentation
├── Instructions.md           # Development instructions
├── ORDER_RESOLUTION.md       # Order resolution documentation
├── README.md                 # Project README
├── Warnings.md               # Warnings documentation
├── ToDo.md                   # Current tasks
├── eslint.config.mjs         # ESLint config (ESM)
├── fix-order-email.html      # Order email template
├── fix-orders.html           # Order fix template
├── jsconfig.json             # JavaScript configuration
├── next.config.js            # Next.js configuration
├── old_package.json          # Old package.json backup
├── package-lock.json         # Package lock file
├── package.json              # Project dependencies
├── postcss.config.js         # PostCSS configuration
├── sanity.config.js          # Sanity configuration
├── sanity.cli.js             # Sanity CLI configuration
├── sanityClient.js           # Sanity client (duplicate)
├── STRIPE_WEBHOOK_SETUP.md   # Stripe webhook setup documentation
├── tailwind.config.js        # Tailwind CSS configuration
└── ...                       # Other files
```

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- Sanity account and project
- Stripe account for payments
- GitHub OAuth application

### Installation Steps
1. Clone the repository and navigate to the project directory
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`
4. Configure Sanity project and import schema
5. Set up GitHub OAuth application
6. Configure Stripe webhooks and keys
7. Run development server: `npm run dev`

### Usage
- Access the application at `http://localhost:3000`
- Use Sanity Studio for content management
- Test authentication with GitHub
- Process test payments with Stripe test keys

## Recent Updates
- **September 1, 2025**: Fixed CSS vendor prefix compatibility issues in WishlistSystem.css by adding standard 'line-clamp' property alongside '-webkit-line-clamp' for cross-browser support
- **September 1, 2025**: Resolved JavaScript syntax errors in ReviewSystem.jsx caused by file corruption (escaped newlines) by recreating the file with proper formatting
- **September 1, 2025**: Fixed escaped quote syntax errors in WishlistSystem.jsx href attributes, replacing escaped quotes with proper quote formatting
- **September 1, 2025**: Created comprehensive About.md documentation following detailed analysis guidelines, documenting all features, architecture, and implementation details
- **Enhanced Product Variants**: Improved color and size selection with stock management
- **Wishlist System**: Complete wishlist functionality with persistent storage
- **Review System**: Comprehensive review and rating system with moderation
- **Performance Improvements**: Added loading skeletons and optimized image handling
- **Mobile Optimization**: Responsive design improvements across all components

## Known Issues
- **CSS Vendor Prefixes**: Some CSS properties may need vendor prefixes for full browser compatibility
- **Image Loading**: Occasional delays in Sanity image CDN response times
- **Search Performance**: Search functionality could benefit from debouncing for large catalogs

## Future Roadmap
- **Multi-language Support**: Internationalization with i18n
- **Advanced Analytics**: Integration with Google Analytics and conversion tracking
- **Inventory Alerts**: Real-time stock level notifications
- **Advanced Search**: Elasticsearch integration for enhanced search capabilities
- **Mobile App**: React Native mobile application
- **Social Features**: Social sharing and user-generated content
- **Subscription Model**: Recurring payment and subscription management