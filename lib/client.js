// lib/client.js
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { logger } from './logger';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-05-18'; // Keep your latest API version
const isDev = process.env.NODE_ENV === 'development';
const isPreviewMode = process.env.SANITY_PREVIEW_MODE === 'true';

// Validation at module load time (non-blocking)
if (!projectId && typeof window === 'undefined') {
  logger.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env");
}
if (!dataset && typeof window === 'undefined') {
  logger.error("Missing NEXT_PUBLIC_SANITY_DATASET in .env");
}

/**
 * Primary read client — CDN enabled in production for performance.
 * - Development: CDN disabled for instant content updates
 * - Preview mode: CDN disabled for draft content visibility
 * - Production: CDN enabled for cached, fast responses
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !isDev && !isPreviewMode, // Enable CDN in production unless in preview mode
  // Stega settings for visual editing (optional, future-proof)
  stega: {
    enabled: isPreviewMode,
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '/studio',
  },
});

/**
 * Write client — always CDN disabled, requires write token.
 * Used for mutations and server-side operations.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false, // Never use CDN for write operations
});

/**
 * Authenticated read client — for user-specific or private data.
 * Uses read token for authenticated requests.
 */
export const authenticatedClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false, // Never use CDN for authenticated/private data
});

// ============================================================================
// FETCH OPTIONS HELPER
// ============================================================================

/**
 * Generate fetch options with ISR revalidation and caching headers.
 * @param {number} revalidateSeconds - ISR revalidation time in seconds (default: 3600 = 1 hour)
 * @param {Object} extraOptions - Additional fetch options to merge
 * @returns {Object} - Fetch options for client.fetch()
 */
export function fetchOptions(revalidateSeconds = 3600, extraOptions = {}) {
  return {
    next: { revalidate: revalidateSeconds },
    // CDN cache hint for Sanity
    cache: 'force-cache',
    ...extraOptions,
  };
}

/**
 * Short cache for frequently changing data (5 minutes)
 */
export function shortCache(extraOptions = {}) {
  return fetchOptions(300, extraOptions);
}

/**
 * Long cache for static data (24 hours)
 */
export function longCache(extraOptions = {}) {
  return fetchOptions(86400, extraOptions);
}

/**
 * Preview mode fetch options — always fresh, no cache
 */
export function previewOptions(extraOptions = {}) {
  return {
    cache: 'no-store',
    ...extraOptions,
  };
}

const builder = imageUrlBuilder(client);

/**
 * Mock builder for invalid image sources
 * Implements all methods used in imageOptimizer.js
 */
class MockImageBuilder {
  constructor() {
    this.options = {};
  }

  width(w) {
    this.options.width = w;
    return this;
  }

  height(h) {
    this.options.height = h;
    return this;
  }

  quality(q) {
    this.options.quality = q;
    return this;
  }

  format(f) {
    this.options.format = f;
    return this;
  }

  auto(a) {
    this.options.auto = a;
    return this;
  }

  fit(f) {
    this.options.fit = f;
    return this;
  }

  rect(r) {
    this.options.rect = r;
    return this;
  }

  sharpen(s) {
    this.options.sharpen = s;
    return this;
  }

  dpr(d) {
    this.options.dpr = d;
    return this;
  }

  url() {
    return '/asset/placeholder-image.jpg';
  }
}

/**
 * Generates an image URL builder for a Sanity image source.
 * This function returns an instance of imageUrlBuilder, allowing chaining (e.g., .width().url()).
 * It provides a robust fallback if the source is invalid.
 * @param {Object} source - The Sanity image object (e.g., product.image[0] or variant.variantImage).
 * @returns {Object} An imageUrlBuilder instance or a mock object for invalid sources.
 */
export const urlFor = (source) => {
  if (!source?.asset) {
    // Return a mock builder that implements all needed methods
    return new MockImageBuilder();
  }

  try {
    return builder.image(source); // Return the actual builder for valid sources
  } catch (error) {
    logger.error('Error initializing Sanity image builder:', { source: source?._key || 'unknown' }, error);
    // Fallback in case builder.image(source) itself throws an error for some reason
    return new MockImageBuilder();
  }
};

/**
 * Get image props for Next.js Image component.
 * Uses the consolidated urlFor function to generate the image URL.
 * @param {Object} image - The Sanity image object.
 * @param {Object} options - Options (width, height, alt).
 * @returns {Object} - Props for Next.js Image component.
 */
export function getImageProps(image, options = {}) {
  const defaultWidth = options.width || 400;
  const defaultHeight = options.height || 600;
  const placeholderSrc = '/asset/placeholder-image.jpg';

  if (!image || !image.asset) {
    return {
      src: placeholderSrc,
      alt: options.alt || 'Placeholder image',
      width: defaultWidth,
      height: defaultHeight,
    };
  }

  try {
    const imageUrl = urlFor(image).width(defaultWidth).height(defaultHeight).url();

    return {
      src: imageUrl,
      alt: options.alt || 'Image',
      width: defaultWidth,
      height: defaultHeight,
    };
  } catch (error) {
    logger.error('Error generating image props:', { imageKey: image?._key }, error);
    return {
      src: placeholderSrc,
      alt: options.alt || 'Placeholder image',
      width: defaultWidth,
      height: defaultHeight,
    };
  }
}

/**
 * Creates a more resilient URL for Sanity images with fallback handling.
 * This is similar to urlFor but explicitly targets returning a URL string.
 * @param {Object} source - The Sanity image object.
 * @param {Object} options - Image options (width, height, etc.).
 * @returns {string} - A valid image URL or a placeholder.
 */
export const getReliableImageUrl = (source, options = {}) => {
  const placeholderSrc = '/asset/placeholder-image.jpg';

  if (!source?.asset) {
    return placeholderSrc;
  }

  try {
    let imageBuilder = urlFor(source);

    if (options.width) imageBuilder = imageBuilder.width(options.width);
    if (options.height) imageBuilder = imageBuilder.height(options.height);
    if (options.rect) imageBuilder = imageBuilder.rect(options.rect);
    if (options.quality) imageBuilder = imageBuilder.quality(options.quality);
    if (options.format) imageBuilder = imageBuilder.format(options.format);

    const imageUrl = imageBuilder.url();

    return imageUrl || placeholderSrc;
  } catch (error) {
    logger.error('Failed to generate reliable image URL:', { sourceKey: source?._key }, error);
    return placeholderSrc;
  }
};

// Export the debug function but use logger
export const logImageProps = (componentName, image, props) => {
  logger.debug(`[${componentName}] Image props:`, {
    hasImage: !!image,
    hasAsset: !!(image?.asset),
    width: props.width,
    height: props.height,
    src: props.src?.substring(0, 50) + '...',
  });
};

// ============================================================================
// NAVIGATION DATA FETCHING
// ============================================================================

export const navigationQuery = `
  *[_type == "navigation"] | order(order asc) {
    _id,
    label,
    href,
    order,
    sections[] {
      sectionTitle,
      items[] {
        label,
        href
      }
    }
  }
`;

export async function getNavigationData() {
  return await client.fetch(navigationQuery, {}, {
    next: { revalidate: 3600 }
  });
}