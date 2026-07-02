/**
 * React Hooks for Pretext Text Layout
 * 
 * High-performance text measurement hooks for React components.
 * These hooks handle font loading, caching, and re-measurement automatically.
 */

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  measureTextHeight,
  measureTextsBatch,
  getLineLayout,
  loadFonts,
  areFontsReady,
  clearPretextCache,
  DEFAULT_FONT,
  DEFAULT_LINE_HEIGHT,
} from '../utils/pretext';

/**
 * Hook: Load fonts before rendering text-dependent layouts
 * 
 * @returns {Object} { loaded: boolean, ready: Promise }
 */
export function useFonts() {
  const [loaded, setLoaded] = useState(false);
  const readyRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      readyRef.current = loadFonts();
      await readyRef.current;
      if (mounted) {
        setLoaded(true);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    loaded,
    ready: readyRef.current,
  };
}

/**
 * Hook: Measure text height without DOM reflow
 * 
 * @param {string} text - Text to measure
 * @param {Object} options - Measurement options
 * @param {string} options.font - CSS font string
 * @param {number} options.maxWidth - Maximum width in pixels
 * @param {number} options.lineHeight - Line height in pixels
 * @param {Object} options.whiteSpace - 'normal' or 'pre-wrap'
 * @returns {Object} { height, lineCount, loaded }
 */
export function useTextHeight(text, options = {}) {
  const {
    font = DEFAULT_FONT,
    maxWidth = 300,
    lineHeight = DEFAULT_LINE_HEIGHT,
    whiteSpace = 'normal',
  } = options;

  const [measurements, setMeasurements] = useState({ height: 0, lineCount: 0 });
  const [loaded, setLoaded] = useState(false);
  const previousTextRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const measure = async () => {
      // Wait for fonts to be ready
      if (typeof document !== 'undefined' && document.fonts) {
        try {
          await document.fonts.ready;
        } catch (error) {
          console.warn('[useTextHeight] Font loading failed:', error);
        }
      }

      if (!mounted) return;

      const result = measureTextHeight(text, font, maxWidth, lineHeight, { whiteSpace });
      setMeasurements({ height: result.height, lineCount: result.lineCount });
      setLoaded(true);
    };

    // Only re-measure if text or options changed
    const cacheKey = `${text}|${font}|${maxWidth}|${lineHeight}|${whiteSpace}`;
    if (previousTextRef.current === cacheKey && loaded) {
      return;
    }

    previousTextRef.current = cacheKey;
    measure();

    return () => {
      mounted = false;
    };
  }, [text, font, maxWidth, lineHeight, whiteSpace, loaded]);

  return { ...measurements, loaded };
}

/**
 * Hook: Measure multiple texts efficiently (batched)
 * 
 * @param {Array<Object>} items - Array of { text, font?, maxWidth, lineHeight?, options? }
 * @returns {Array<{height: number, lineCount: number}>}
 */
export function useTextsHeight(items) {
  const [measurements, setMeasurements] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const measure = async () => {
      if (typeof document !== 'undefined' && document.fonts) {
        try {
          await document.fonts.ready;
        } catch (error) {
          console.warn('[useTextsHeight] Font loading failed:', error);
        }
      }

      if (!mounted) return;

      const results = measureTextsBatch(items);
      setMeasurements(results);
      setLoaded(true);
    };

    measure();

    return () => {
      mounted = false;
    };
  }, [JSON.stringify(items)]); // eslint-disable-line react-hooks/exhaustive-deps

  return { measurements, loaded };
}

/**
 * Hook: Get line-by-line layout for manual rendering
 * 
 * @param {string} text - Text to layout
 * @param {Object} options - Layout options
 * @returns {Object} { lines, height, lineCount, loaded }
 */
export function useLineLayout(text, options = {}) {
  const {
    font = DEFAULT_FONT,
    maxWidth = 300,
    lineHeight = DEFAULT_LINE_HEIGHT,
    whiteSpace = 'normal',
  } = options;

  const [layout, setLayout] = useState({ lines: [], height: 0, lineCount: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const calculate = async () => {
      if (typeof document !== 'undefined' && document.fonts) {
        try {
          await document.fonts.ready;
        } catch (error) {
          console.warn('[useLineLayout] Font loading failed:', error);
        }
      }

      if (!mounted) return;

      const result = getLineLayout(text, font, maxWidth, lineHeight, { whiteSpace });
      setLayout(result);
      setLoaded(true);
    };

    calculate();

    return () => {
      mounted = false;
    };
  }, [text, font, maxWidth, lineHeight, whiteSpace]);

  return { ...layout, loaded };
}

/**
 * Hook: Measure product card content
 * Specialized for e-commerce product cards
 * 
 * @param {Object} product - Product data
 * @param {number} cardWidth - Card width in pixels
 * @param {Object} typography - Typography overrides
 * @returns {Object} Card measurements
 */
export function useProductCardMeasurements(product, cardWidth, typography = {}) {
  const {
    titleFont = '600 18px Inter, system-ui, sans-serif',
    priceFont = '700 20px Inter, system-ui, sans-serif',
    descriptionFont = '14px Inter, system-ui, sans-serif',
    titleLineHeight = 26,
    priceLineHeight = 28,
    descriptionLineHeight = 22,
  } = typography;

  const titleText = product?.name || product?.title || '';
  const priceText = `₹${product?.price?.toLocaleString() || '0'}`;
  const descriptionText = product?.description || product?.details || '';

  const title = useTextHeight(titleText, {
    font: titleFont,
    maxWidth: cardWidth,
    lineHeight: titleLineHeight,
  });

  const price = useTextHeight(priceText, {
    font: priceFont,
    maxWidth: cardWidth,
    lineHeight: priceLineHeight,
  });

  const description = useTextHeight(descriptionText, {
    font: descriptionFont,
    maxWidth: cardWidth,
    lineHeight: descriptionLineHeight,
  });

  const totalHeight = title.height + price.height + description.height;

  return {
    title,
    price,
    description,
    totalHeight,
    loaded: title.loaded && price.loaded && description.loaded,
  };
}

/**
 * Hook: Debounced text measurement (for streaming/input)
 * Useful for AI chat streaming or live text input
 * 
 * @param {string} text - Text to measure
 * @param {Object} options - Measurement options
 * @param {number} debounceMs - Debounce delay in ms
 * @returns {Object} { height, lineCount, loaded }
 */
export function useDebouncedTextHeight(text, options = {}, debounceMs = 150) {
  const {
    font = DEFAULT_FONT,
    maxWidth = 300,
    lineHeight = DEFAULT_LINE_HEIGHT,
    whiteSpace = 'normal',
  } = options;

  const [measurements, setMeasurements] = useState({ height: 0, lineCount: 0 });
  const [loaded, setLoaded] = useState(false);
  const timeoutRef = useRef(null);
  const previousTextRef = useRef(null);

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't re-measure if text hasn't changed
    const cacheKey = `${text}|${font}|${maxWidth}|${lineHeight}|${whiteSpace}`;
    if (previousTextRef.current === cacheKey && loaded) {
      return;
    }

    previousTextRef.current = cacheKey;

    // Debounce the measurement
    timeoutRef.current = setTimeout(async () => {
      if (typeof document !== 'undefined' && document.fonts) {
        try {
          await document.fonts.ready;
        } catch (error) {
          console.warn('[useDebouncedTextHeight] Font loading failed:', error);
        }
      }

      const result = measureTextHeight(text, font, maxWidth, lineHeight, { whiteSpace });
      setMeasurements({ height: result.height, lineCount: result.lineCount });
      setLoaded(true);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, font, maxWidth, lineHeight, whiteSpace, debounceMs, loaded]);

  return { ...measurements, loaded };
}

/**
 * Hook: Clear pretext cache on demand
 * Useful when fonts change or to free memory
 * 
 * @returns {Function} clearCache function
 */
export function useClearPretextCache() {
  return useCallback(() => {
    clearPretextCache();
  }, []);
}

/**
 * Hook: Check if fonts are ready for measurement
 * 
 * @returns {boolean} True if fonts are loaded
 */
export function useFontsReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    areFontsReady().then((isReady) => {
      if (mounted) {
        setReady(isReady);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return ready;
}

export default {
  useFonts,
  useTextHeight,
  useTextsHeight,
  useLineLayout,
  useProductCardMeasurements,
  useDebouncedTextHeight,
  useClearPretextCache,
  useFontsReady,
};
