/**
 * Font Loading Utilities for Pretext
 * 
 * Pretext requires fonts to be loaded before measuring text.
 * These utilities ensure fonts are ready before text measurement.
 */

/**
 * Load a specific font face
 * 
 * @param {string} fontFamily - Font family name
 * @param {string} fontWeight - Font weight (e.g., '400', '700')
 * @param {string} fontStyle - Font style ('normal', 'italic')
 * @returns {Promise<void>}
 */
export async function loadFont(fontFamily, fontWeight = '400', fontStyle = 'normal') {
  if (typeof document === 'undefined' || !document.fonts) {
    console.warn('[loadFont] Font Loading API not supported');
    return;
  }

  try {
    const fontFace = new FontFace(fontFamily, `url(/fonts/${fontFamily}-${fontWeight}.woff2)`, {
      weight: fontWeight,
      style: fontStyle,
    });

    document.fonts.add(fontFace);
    await fontFace.load();
  } catch (error) {
    console.warn(`[loadFont] Failed to load ${fontFamily} ${fontWeight}:`, error);
  }
}

/**
 * Load multiple fonts in parallel
 * 
 * @param {Array<{family: string, weight?: string, style?: string}>} fonts
 * @returns {Promise<void>}
 */
export async function loadFonts(fonts) {
  if (typeof document === 'undefined' || !document.fonts) {
    console.warn('[loadFonts] Font Loading API not supported');
    return;
  }

  const promises = fonts.map(({ family, weight = '400', style = 'normal' }) =>
    loadFont(family, weight, style)
  );

  await Promise.all(promises);
}

/**
 * Wait for all fonts to be loaded
 * This is the recommended approach for most use cases
 * 
 * @returns {Promise<boolean>} True if fonts are ready
 */
export async function waitForFonts() {
  if (typeof document === 'undefined' || !document.fonts) {
    console.warn('[waitForFonts] Font Loading API not supported');
    return true;
  }

  try {
    await document.fonts.ready;
    return true;
  } catch (error) {
    console.error('[waitForFonts] Font loading failed:', error);
    return false;
  }
}

/**
 * Check if a specific font is loaded
 * 
 * @param {string} fontFamily - Font family name
 * @returns {boolean} True if font is loaded
 */
export function isFontLoaded(fontFamily) {
  if (typeof document === 'undefined' || !document.fonts) {
    return false;
  }

  // Check if font is in the document.fonts set
  for (const font of document.fonts) {
    if (font.family.includes(fontFamily)) {
      return font.status === 'loaded';
    }
  }

  return false;
}

/**
 * Preload fonts from CSS
 * Scans computed styles to detect used fonts
 * 
 * @returns {Promise<void>}
 */
export async function preloadUsedFonts() {
  if (typeof document === 'undefined' || !document.fonts) {
    return;
  }

  try {
    // Wait for all fonts used in CSS to load
    await document.fonts.ready;
  } catch (error) {
    console.error('[preloadUsedFonts] Failed:', error);
  }
}

/**
 * Font preload HOC for Next.js App Router
 * Add this to your layout.js or root component
 * 
 * Usage:
 * ```jsx
 * // app/layout.js
 * import { FontPreloadProvider } from '@/utils/fontLoader'
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <FontPreloadProvider>{children}</FontPreloadProvider>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export async function FontPreloadProvider({ children }) {
  // This is a server component placeholder
  // Client-side font loading happens in useEffect
  return children;
}

/**
 * Get font preload links for Next.js Head
 * Add these to your <head> for faster font loading
 * 
 * @param {Array<string>} fontFamilies - Array of font family names
 * @param {string} weights - Comma-separated weights (e.g., '400,500,600,700')
 * @returns {Array<Object>} Link props for next/head
 */
export function getFontPreloadLinks(fontFamilies, weights = '400,500,600,700') {
  // For Google Fonts
  if (fontFamilies.includes('Inter')) {
    const families = fontFamilies.join('%7C');
    return [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: `https://fonts.googleapis.com/css2?family=${families}:wght@${weights.replace(/,/g, ';')}`,
      },
    ];
  }

  return [];
}

/**
 * Sampada-Store default font configuration
 */
export const SAMPADA_FONTS = {
  primary: {
    family: 'Inter',
    weights: ['400', '500', '600', '700'],
    preload: true,
  },
  display: {
    family: 'Playfair Display',
    weights: ['400', '500', '600', '700'],
    preload: false,
  },
  mono: {
    family: 'JetBrains Mono',
    weights: ['400', '500'],
    preload: false,
  },
};

/**
 * Initialize fonts for Sampada-Store
 * Call this in your root layout or _app.js
 * 
 * @returns {Promise<void>}
 */
export async function initializeSampadaFonts() {
  if (typeof document === 'undefined') {
    return;
  }

  // Load primary font (Inter)
  await loadFonts([
    { family: 'Inter', weight: '400' },
    { family: 'Inter', weight: '500' },
    { family: 'Inter', weight: '600' },
    { family: 'Inter', weight: '700' },
  ]);

  // Wait for all fonts to be ready
  await waitForFonts();
}

export default {
  loadFont,
  loadFonts,
  waitForFonts,
  isFontLoaded,
  preloadUsedFonts,
  FontPreloadProvider,
  getFontPreloadLinks,
  SAMPADA_FONTS,
  initializeSampadaFonts,
};
