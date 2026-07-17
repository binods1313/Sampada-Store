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
 * Accepts common Sanity image shapes and returns true only when a real asset id exists.
 * Prevents image-url from throwing: Malformed asset _ref ''.
 */
function hasValidSanityAsset(source) {
  if (!source) return false;
  // Direct asset id string
  if (typeof source === 'string') {
    return source.startsWith('image-') && source.length > 6;
  }
  // Prefer nested asset; also accept bare reference / image asset docs
  const asset =
    source.asset ||
    (source._type === 'reference' ? source : null) ||
    (source._ref ? source : null) ||
    (source._id && String(source._id).startsWith('image-') ? source : null);
  if (!asset) return false;
  if (typeof asset === 'string') {
    return asset.startsWith('image-') && asset.length > 6;
  }
  const id = asset._ref || asset._id || '';
  // Reject empty / whitespace / non-image ids (bad GROQ often yields _ref: '')
  return typeof id === 'string' && /^image-[A-Za-z0-9_-]+/.test(id.trim());
}

/**
 * Wraps the real Sanity image builder so chained .url() never throws during SSG.
 * (builder.image() often succeeds; Malformed asset _ref is thrown from .url())
 */
class SafeImageBuilder {
  constructor(inner) {
    this._inner = inner;
    this._failed = !inner;
  }

  _chain(fn) {
    if (this._failed || !this._inner) return this;
    try {
      this._inner = fn(this._inner);
    } catch (error) {
      this._failed = true;
      this._inner = null;
    }
    return this;
  }

  width(w) {
    return this._chain((b) => b.width(w));
  }
  height(h) {
    return this._chain((b) => b.height(h));
  }
  quality(q) {
    return this._chain((b) => b.quality(q));
  }
  format(f) {
    return this._chain((b) => b.format(f));
  }
  auto(a) {
    return this._chain((b) => b.auto(a));
  }
  fit(f) {
    return this._chain((b) => b.fit(f));
  }
  rect(...args) {
    return this._chain((b) => b.rect(...args));
  }
  sharpen(s) {
    return this._chain((b) => b.sharpen(s));
  }
  dpr(d) {
    return this._chain((b) => b.dpr(d));
  }
  crop(c) {
    return this._chain((b) =>
      typeof b.crop === 'function' ? b.crop(c) : b
    );
  }
  focalPoint(...args) {
    return this._chain((b) =>
      typeof b.focalPoint === 'function' ? b.focalPoint(...args) : b
    );
  }
  ignoreImageParams() {
    return this._chain((b) =>
      typeof b.ignoreImageParams === 'function' ? b.ignoreImageParams() : b
    );
  }
  url() {
    if (this._failed || !this._inner) {
      return '/asset/placeholder-image.jpg';
    }
    try {
      const u = this._inner.url();
      return u || '/asset/placeholder-image.jpg';
    } catch (error) {
      try {
        logger.error('Error building Sanity image URL:', {}, error);
      } catch {
        /* ignore logger failures during SSG */
      }
      return '/asset/placeholder-image.jpg';
    }
  }
}

/**
 * Generates an image URL builder for a Sanity image source.
 * Chainable (e.g. .width().url()). Never throws on bad/missing assets.
 * @param {Object} source - The Sanity image object (e.g., product.image[0] or variant.variantImage).
 * @returns {Object} An imageUrlBuilder-like instance
 */
export const urlFor = (source) => {
  if (!hasValidSanityAsset(source)) {
    return new MockImageBuilder();
  }

  try {
    return new SafeImageBuilder(builder.image(source));
  } catch (error) {
    logger.error(
      'Error initializing Sanity image builder:',
      { source: source?._key || 'unknown' },
      error
    );
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
  if (options.fit) imageBuilder = imageBuilder.fit(options.fit);
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