/**
 * JsonLd.jsx - Reusable JSON-LD structured data component
 *
 * Implements Schema.org markup for SEO enhancement.
 * Supports: Product, BreadcrumbList, Organization, WebSite, and custom schemas.
 *
 * Usage:
 *   <JsonLd type="product" data={productData} />
 *   <JsonLd type="breadcrumb" items={breadcrumbItems} />
 *   <JsonLd type="organization" data={orgData} />
 *   <JsonLd type="custom" schema={customSchema} />
 */

import React from 'react';

/**
 * Base URL for the application (defaults to production URL)
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sampada-store.com';

/**
 * Product Schema - For product detail pages
 * @see https://schema.org/Product
 */
function ProductJsonLd({ data }) {
  const {
    name,
    description,
    image,
    brand = 'Sampada',
    price,
    currency = 'USD',
    availability = 'https://schema.org/InStock',
    sku,
    rating,
    reviewCount,
  } = data;

  // Normalize image to array
  const images = Array.isArray(image) ? image : (image ? [image] : []);

  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: name || 'Product',
    description: description || '',
    image: images.length > 0 ? images : ['/asset/placeholder-image.jpg'],
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${data.slug || ''}`,
      priceCurrency: currency,
      price: typeof price === 'number' ? price.toFixed(2) : String(price),
      availability,
      seller: {
        '@type': 'Organization',
        name: brand,
      },
    },
  };

  // Add optional fields if present
  if (sku) schema.sku = sku;
  if (rating) schema.aggregateRating = { '@type': 'AggregateRating', ratingValue: rating };
  if (reviewCount) schema.aggregateRating = schema.aggregateRating || { '@type': 'AggregateRating', ratingValue: '4' };
  if (reviewCount) schema.aggregateRating.reviewCount = reviewCount;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * BreadcrumbList Schema - For navigation hierarchy
 * @see https://schema.org/BreadcrumbList
 */
function BreadcrumbJsonLd({ items = [] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name || 'Untitled',
      item: item.item ? `${SITE_URL}${item.item}` : undefined,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Organization Schema - For homepage and about pages
 * @see https://schema.org/Organization
 */
function OrganizationJsonLd({ data = {} }) {
  const {
    name = 'Sampada',
    url = SITE_URL,
    logo = `${SITE_URL}/logo.png`,
    description = 'Premium custom apparel and print-on-demand products with prosperity-inspired designs.',
    sameAs = [],
    contactPoint = null,
  } = data;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    sameAs: sameAs.length > 0 ? sameAs : [
      'https://www.facebook.com/sampada',
      'https://www.instagram.com/sampada',
      'https://twitter.com/sampada',
    ],
  };

  // Add optional contact point
  if (contactPoint) {
    schema.contactPoint = contactPoint;
  }

  // Add WebSite schema for search
  schema.potentialAction = {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * WebSite Schema - For homepage
 * @see https://schema.org/WebSite
 */
function WebSiteJsonLd({ data = {} }) {
  const {
    name = 'Sampada Store',
    alternateName = 'Sampada Custom Print',
    url = SITE_URL,
  } = data;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    alternateName,
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Main JsonLd component - Routes to appropriate schema type
 */
export default function JsonLd({ type = 'custom', data = {}, schema = null, ...props }) {
  switch (type) {
    case 'product':
      return <ProductJsonLd data={data} {...props} />;
    case 'breadcrumb':
      return <BreadcrumbJsonLd items={data.items || data} {...props} />;
    case 'organization':
      return <OrganizationJsonLd data={data} {...props} />;
    case 'website':
      return <WebSiteJsonLd data={data} {...props} />;
    case 'custom':
      if (!schema) return null;
      return (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      );
    default:
      return null;
  }
}

// Export individual components for advanced usage
export {
  ProductJsonLd,
  BreadcrumbJsonLd,
  OrganizationJsonLd,
  WebSiteJsonLd,
};
