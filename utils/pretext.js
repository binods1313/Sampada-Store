/**
 * Pretext Text Layout Utilities
 * 
 * DOM-free text measurement and layout engine for high-performance text rendering.
 * @see https://github.com/chenglou/pretext
 * @see https://pretext.wiki/
 */

import {
  prepare,
  layout,
  prepareWithSegments,
  layoutWithLines,
  layoutNextLine,
  walkLineRanges,
  clearCache,
  setLocale,
} from '@chenglou/pretext';

/**
 * Default font settings for Sampada-Store
 * Update these to match your project's primary font
 */
export const DEFAULT_FONT = '16px Inter, system-ui, sans-serif';
export const DEFAULT_LINE_HEIGHT = 24;

/**
 * Cache for prepared texts to avoid re-measurement
 */
const preparedCache = new Map();

/**
 * Measure text height without DOM reflow
 * 
 * @param {string} text - The text to measure
 * @param {string} font - CSS font string (e.g., '16px Inter')
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} lineHeight - Line height in pixels
 * @param {Object} options - Additional options
 * @param {string} options.whiteSpace - 'normal' or 'pre-wrap'
 * @returns {Object} { height, lineCount, prepared }
 */
export function measureTextHeight(
  text,
  font = DEFAULT_FONT,
  maxWidth,
  lineHeight = DEFAULT_LINE_HEIGHT,
  options = {}
) {
  if (!text || typeof text !== 'string') {
    return { height: 0, lineCount: 0, prepared: null };
  }

  const cacheKey = `${text}|${font}|${options.whiteSpace || 'normal'}`;
  let prepared = preparedCache.get(cacheKey);

  if (!prepared) {
    prepared = prepare(text, font, options);
    preparedCache.set(cacheKey, prepared);
  }

  const result = layout(prepared, maxWidth, lineHeight);
  return { ...result, prepared };
}

/**
 * Measure multiple texts efficiently (batch measurement)
 * 
 * @param {Array<{text: string, font?: string, maxWidth: number, lineHeight?: number, options?: Object}>} items
 * @returns {Array<{height: number, lineCount: number}>}
 */
export function measureTextsBatch(items) {
  // First pass: prepare all unique texts
  items.forEach(({ text, font = DEFAULT_FONT, options = {} }) => {
    if (!text || typeof text !== 'string') return;
    
    const cacheKey = `${text}|${font}|${options.whiteSpace || 'normal'}`;
    if (!preparedCache.has(cacheKey)) {
      preparedCache.set(cacheKey, prepare(text, font, options));
    }
  });

  // Second pass: layout all texts
  return items.map(({ text, font = DEFAULT_FONT, maxWidth, lineHeight = DEFAULT_LINE_HEIGHT, options = {} }) => {
    if (!text || typeof text !== 'string') {
      return { height: 0, lineCount: 0 };
    }

    const cacheKey = `${text}|${font}|${options.whiteSpace || 'normal'}`;
    const prepared = preparedCache.get(cacheKey);
    return layout(prepared, maxWidth, lineHeight);
  });
}

/**
 * Get line-by-line layout data for manual rendering
 * 
 * @param {string} text - The text to layout
 * @param {string} font - CSS font string
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} lineHeight - Line height in pixels
 * @param {Object} options - Additional options
 * @returns {Object} { lines: Array<{text, width, start, end}>, height, lineCount }
 */
export function getLineLayout(
  text,
  font = DEFAULT_FONT,
  maxWidth,
  lineHeight = DEFAULT_LINE_HEIGHT,
  options = {}
) {
  if (!text || typeof text !== 'string') {
    return { lines: [], height: 0, lineCount: 0 };
  }

  const prepared = prepareWithSegments(text, font, options);
  const result = layoutWithLines(prepared, maxWidth, lineHeight);
  return result;
}

/**
 * Flow text around an obstacle (e.g., floated image)
 * 
 * @param {string} text - The text to flow
 * @param {string} font - CSS font string
 * @param {number} baseWidth - Base column width
 * @param {Object} obstacle - Obstacle dimensions { top, bottom, width }
 * @param {number} lineHeight - Line height in pixels
 * @returns {Array<{text: string, width: number, y: number}>}
 */
export function flowTextAroundObstacle(
  text,
  font = DEFAULT_FONT,
  baseWidth,
  obstacle,
  lineHeight = DEFAULT_LINE_HEIGHT
) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const prepared = prepareWithSegments(text, font);
  const lines = [];
  let cursor = 0;
  let y = 0;

  while (cursor < text.length) {
    const lineWidth = y >= obstacle.top && y < obstacle.bottom
      ? baseWidth - obstacle.width
      : baseWidth;

    const line = layoutNextLine(prepared, cursor, lineWidth);
    if (!line) break;

    lines.push({
      text: line.text,
      width: line.width,
      y,
    });

    cursor = line.end;
    y += lineHeight;
  }

  return lines;
}

/**
 * Truncate text with ellipsis at word boundary
 * 
 * @param {string} text - The text to truncate
 * @param {string} font - CSS font string
 * @param {number} maxWidth - Maximum width in pixels
 * @param {string} ellipsis - Ellipsis string (default: '…')
 * @returns {string} Truncated text
 */
export function truncateText(text, font = DEFAULT_FONT, maxWidth, ellipsis = '…') {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const prepared = prepare(text, font);
  const { width: fullWidth } = layout(prepared, Infinity, 0);

  if (fullWidth <= maxWidth) {
    return text;
  }

  // Binary search for optimal truncation point
  let left = 0;
  let right = text.length;
  let result = text;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const truncated = text.slice(0, mid).trimEnd() + ellipsis;
    const preparedTruncated = prepare(truncated, font);
    const { width } = layout(preparedTruncated, Infinity, 0);

    if (width <= maxWidth) {
      result = truncated;
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return result;
}

/**
 * Calculate the minimum width needed to fit text in N lines
 * 
 * @param {string} text - The text to measure
 * @param {string} font - CSS font string
 * @param {number} maxLines - Maximum number of lines
 * @param {number} lineHeight - Line height in pixels
 * @returns {number} Minimum width in pixels
 */
export function getMinWidthForLines(
  text,
  font = DEFAULT_FONT,
  maxLines,
  lineHeight = DEFAULT_LINE_HEIGHT
) {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  const prepared = prepare(text, font);
  
  // Binary search for minimum width
  let left = 0;
  let right = 10000; // Start with a large width

  // First, find an upper bound
  while (true) {
    const { lineCount } = layout(prepared, right, lineHeight);
    if (lineCount <= maxLines) break;
    right *= 2;
  }

  // Binary search
  while (right - left > 1) {
    const mid = Math.floor((left + right) / 2);
    const { lineCount } = layout(prepared, mid, lineHeight);

    if (lineCount <= maxLines) {
      right = mid;
    } else {
      left = mid;
    }
  }

  return right;
}

/**
 * Clear the internal prepared text cache
 * Call this when fonts change or to free memory
 */
export function clearPretextCache() {
  preparedCache.clear();
  clearCache();
}

/**
 * Set locale for text measurement
 * 
 * @param {string} locale - Locale string (e.g., 'en-US', 'zh-CN')
 */
export function setPretextLocale(locale) {
  setLocale(locale);
}

/**
 * Preload fonts before using Pretext
 * This is critical for accurate measurements
 * 
 * @returns {Promise<void>}
 */
export async function loadFonts() {
  if (typeof document === 'undefined' || !document.fonts) {
    return;
  }

  try {
    await document.fonts.ready;
  } catch (error) {
    console.warn('[Pretext] Font loading failed:', error);
  }
}

/**
 * Hook-like utility for React: use when fonts are loaded
 * 
 * @returns {Promise<boolean>} True if fonts are ready
 */
export async function areFontsReady() {
  if (typeof document === 'undefined' || !document.fonts) {
    return true;
  }

  try {
    await document.fonts.ready;
    return true;
  } catch {
    return false;
  }
}

/**
 * Measure product card content height
 * Specialized helper for e-commerce product cards
 * 
 * @param {Object} product - Product data
 * @param {number} cardWidth - Card width in pixels
 * @param {Object} typography - Typography settings
 * @returns {Object} Measurements for each card element
 */
export function measureProductCard(product, cardWidth, typography = {}) {
  const {
    titleFont = '600 18px Inter, system-ui, sans-serif',
    priceFont = '700 20px Inter, system-ui, sans-serif',
    descriptionFont = '14px Inter, system-ui, sans-serif',
    titleLineHeight = 26,
    priceLineHeight = 28,
    descriptionLineHeight = 22,
  } = typography;

  const measurements = {
    title: measureTextHeight(product.name || product.title, titleFont, cardWidth, titleLineHeight),
    price: measureTextHeight(
      `₹${product.price?.toLocaleString() || '0'}`,
      priceFont,
      cardWidth,
      priceLineHeight
    ),
    description: measureTextHeight(
      product.description || product.details || '',
      descriptionFont,
      cardWidth,
      descriptionLineHeight
    ),
  };

  // Calculate total card content height
  const totalHeight = Object.values(measurements).reduce(
    (sum, m) => sum + m.height,
    0
  );

  return { ...measurements, totalHeight };
}

export default {
  measureTextHeight,
  measureTextsBatch,
  getLineLayout,
  flowTextAroundObstacle,
  truncateText,
  getMinWidthForLines,
  measureProductCard,
  clearPretextCache,
  setPretextLocale,
  loadFonts,
  areFontsReady,
  DEFAULT_FONT,
  DEFAULT_LINE_HEIGHT,
};
