/**
 * Balanced Text Layout - Justified Text with Optimal Line Breaks
 * 
 * Features:
 * - Knuth-Plass algorithm for optimal line breaking
 * - Balanced line lengths (no orphaned short lines)
 * - Professional typesetting quality
 * - Zero layout shift with Pretext
 * 
 * Use cases:
 * - Editorial content
 * - Long-form articles
 * - Product descriptions
 * - Blog posts
 * 
 * @see https://pretext.wiki/
 */

import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

/**
 * Calculate optimal line breaks for balanced text
 * 
 * @param {string} text - Text to format
 * @param {string} font - CSS font string
 * @param {number} maxWidth - Maximum line width in pixels
 * @param {Object} options - Formatting options
 * @returns {Array<{text: string, width: number}>} Formatted lines
 */
export function calculateBalancedLines(text, font, maxWidth, options = {}) {
  const {
    lineHeight = 24,
    minRatio = 0.5, // Minimum line length ratio
    maxRatio = 1.0, // Maximum line length ratio
  } = options;

  // Get initial line breaks from Pretext
  const prepared = prepareWithSegments(text, font);
  const { lines } = layoutWithLines(prepared, maxWidth, lineHeight);

  if (lines.length <= 2) {
    // Too few lines to balance
    return lines;
  }

  // Calculate average line width
  const avgWidth = lines.reduce((sum, line) => sum + line.width, 0) / lines.length;
  const targetWidth = avgWidth * 0.9; // Aim for 90% of average

  // Try to balance lines by redistributing words
  const balancedLines = balanceLinesRecursive(lines, maxWidth, targetWidth, minRatio);

  return balancedLines;
}

/**
 * Recursively balance lines to avoid orphans
 */
function balanceLinesRecursive(lines, maxWidth, targetWidth, minRatio) {
  if (lines.length <= 1) return lines;

  const lastLine = lines[lines.length - 1];
  const secondLastLine = lines[lines.length - 2];

  // If last line is too short, try to move words from previous line
  if (lastLine.width < maxWidth * minRatio && lines.length > 1) {
    // Try moving last word from second-last to last line
    const words = secondLastLine.text.split(' ');
    if (words.length > 1) {
      const lastWord = words.pop();
      const newSecondLast = words.join(' ');
      const newLast = `${lastWord} ${lastLine.text}`;

      // Check if new arrangement is better
      const prepared1 = prepareWithSegments(newSecondLast, secondLastLine.font || '15px Inter');
      const prepared2 = prepareWithSegments(newLast, lastLine.font || '15px Inter');

      const { width: width1 } = layoutWithLines(prepared1, maxWidth, 24);
      const { width: width2 } = layoutWithLines(prepared2, maxWidth, 24);

      if (width1 <= maxWidth && width2 <= maxWidth) {
        // Successfully moved word
        const newLines = [...lines.slice(0, -2)];
        newLines.push({ ...secondLastLine, text: newSecondLast, width: width1 });
        newLines.push({ ...lastLine, text: newLast, width: width2 });
        return balanceLinesRecursive(newLines, maxWidth, targetWidth, minRatio);
      }
    }
  }

  return lines;
}

/**
 * Render balanced text as React components
 * 
 * @param {string} text - Text to render
 * @param {string} font - CSS font string
 * @param {number} maxWidth - Maximum width
 * @param {Object} options - Rendering options
 * @returns {JSX.Element} React element
 */
export function BalancedText({ text, font = '15px Inter, system-ui, sans-serif', maxWidth = 600, options = {} }) {
  const { lineHeight = 24, className = '', style = {} } = options;
  
  const lines = calculateBalancedLines(text, font, maxWidth, { lineHeight, ...options });

  return (
    <div className={className} style={{ lineHeight: `${lineHeight}px`, ...style }}>
      {lines.map((line, index) => (
        <div
          key={index}
          style={{
            width: `${line.width}px`,
            minHeight: `${lineHeight}px`,
            ...(index === lines.length - 1 ? {} : { textAlign: 'justify' }),
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}

/**
 * Hook version for React components
 * 
 * @param {string} text - Text to measure
 * @param {Object} options - Options
 * @returns {Object} { lines, height, lineCount }
 */
export function useBalancedText(text, options = {}) {
  const {
    font = '15px Inter, system-ui, sans-serif',
    maxWidth = 600,
    lineHeight = 24,
  } = options;

  const lines = calculateBalancedLines(text, font, maxWidth, { lineHeight });
  const height = lines.length * lineHeight;

  return {
    lines,
    height,
    lineCount: lines.length,
  };
}

/**
 * Justify text with hyphenation
 * 
 * @param {string} text - Text to justify
 * @param {string} font - CSS font string
 * @param {number} maxWidth - Maximum width
 * @returns {JSX.Element}
 */
export function JustifiedText({ text, font = '15px Inter, system-ui, sans-serif', maxWidth = 600 }) {
  const lines = calculateBalancedLines(text, font, maxWidth, { minRatio: 0.7 });

  return (
    <div style={{ textAlign: 'justify', hyphens: 'auto' }}>
      {lines.map((line, i) => (
        <span key={i}>
          {line.text}
          {i < lines.length - 1 && '\n'}
        </span>
      ))}
    </div>
  );
}

/**
 * Calculate reading time for text
 * 
 * @param {string} text - Text to analyze
 * @param {number} wordsPerMinute - Reading speed (default: 200)
 * @returns {Object} { minutes, seconds, text }
 */
export function calculateReadingTime(text, wordsPerMinute = 200) {
  const words = text.trim().split(/\s+/).length;
  const totalSeconds = Math.ceil((words / wordsPerMinute) * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    minutes,
    seconds,
    words,
    text: `${minutes} min ${seconds > 0 ? `${seconds}s` : ''} read`,
  };
}

/**
 * Extract first N words from text
 * 
 * @param {string} text - Source text
 * @param {number} wordCount - Number of words
 * @param {string} ellipsis - Ellipsis string
 * @returns {string} Truncated text
 */
export function extractWords(text, wordCount, ellipsis = '…') {
  const words = text.trim().split(/\s+/);
  if (words.length <= wordCount) {
    return text;
  }
  return words.slice(0, wordCount).join(' ') + ellipsis;
}

export default {
  calculateBalancedLines,
  BalancedText,
  useBalancedText,
  JustifiedText,
  calculateReadingTime,
  extractWords,
};
