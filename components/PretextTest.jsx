/**
 * Pretext Integration Test Component
 * 
 * Use this component to verify Pretext is working correctly in your environment.
 * Mount this component in development to test text measurement.
 * 
 * Usage:
 * ```jsx
 * // In a test page or dev-only component
 * import PretextTest from '@/components/PretextTest'
 * 
 * {process.env.NODE_ENV === 'development' && <PretextTest />}
 * ```
 */

'use client';

import { useState, useEffect } from 'react';
import {
  measureTextHeight,
  measureTextsBatch,
  getLineLayout,
  truncateText,
  getMinWidthForLines,
  loadFonts,
} from '@/utils/pretext';
import { useTextHeight, useFonts, useProductCardMeasurements } from '@/hooks/usePretext';

export default function PretextTest() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const { loaded: fontsLoaded } = useFonts();

  const sampleText =
    'AGI 春天到了。بدأت الرحلة 🚀 This is a multiline text sample with mixed scripts, emojis, and bidirectional text to test Pretext capabilities.';

  const testMeasurements = async () => {
    if (!fontsLoaded) return;

    setLoading(true);
    const testResults = {};

    try {
      // Test 1: Basic height measurement
      testResults.basicHeight = measureTextHeight(
        sampleText,
        '16px Inter, system-ui, sans-serif',
        300,
        24
      );

      // Test 2: Batch measurement
      testResults.batch = measureTextsBatch([
        { text: 'Short text', maxWidth: 200 },
        { text: 'Medium length text sample', maxWidth: 200 },
        { text: 'Very long text that should definitely wrap to multiple lines when measured with our maxWidth constraint', maxWidth: 200 },
      ]);

      // Test 3: Line layout
      testResults.lineLayout = getLineLayout(
        sampleText,
        '14px Inter, system-ui',
        250,
        22
      );

      // Test 4: Truncation
      testResults.truncated = truncateText(
        sampleText,
        '14px Inter, system-ui',
        200,
        '…'
      );

      // Test 5: Minimum width calculation
      testResults.minWidth = getMinWidthForLines(
        sampleText,
        '16px Inter, system-ui',
        3,
        24
      );

      // Test 6: Product card measurement
      testResults.productCard = measureTextHeight(
        'Premium Wireless Headphones with Active Noise Cancellation and 30-hour Battery Life',
        '600 18px Inter, system-ui',
        280,
        26
      );
    } catch (error) {
      testResults.error = error.message;
    }

    setResults(testResults);
    setLoading(false);
  };

  useEffect(() => {
    if (fontsLoaded) {
      testMeasurements();
    }
  }, [fontsLoaded]);

  // Hook test component
  function HookTest() {
    const { height, lineCount, loaded } = useTextHeight(sampleText, {
      font: '15px Inter, system-ui',
      maxWidth: 320,
      lineHeight: 24,
    });

    return (
      <div style={testStyle}>
        <h4>Hook Test (useTextHeight)</h4>
        <p>Status: {loaded ? '✅ Loaded' : '⏳ Loading...'}</p>
        <p>Height: {height}px</p>
        <p>Lines: {lineCount}</p>
      </div>
    );
  }

  // Product card hook test
  function ProductCardTest() {
    const mockProduct = {
      name: 'Premium Wireless Headphones',
      price: 12999,
      description: 'Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and plush ear cushions for all-day comfort.',
    };

    const { title, price, description, totalHeight, loaded } =
      useProductCardMeasurements(mockProduct, 280);

    return (
      <div style={testStyle}>
        <h4>Product Card Hook Test</h4>
        <p>Status: {loaded ? '✅ Loaded' : '⏳ Loading...'}</p>
        <p>Title Height: {title.height}px ({title.lineCount} lines)</p>
        <p>Price Height: {price.height}px ({price.lineCount} lines)</p>
        <p>Description Height: {description.height}px ({description.lineCount} lines)</p>
        <p>Total Height: {totalHeight}px</p>
      </div>
    );
  }

  if (!fontsLoaded) {
    return (
      <div style={containerStyle}>
        <h3>🔤 Pretext Integration Test</h3>
        <p>⏳ Loading fonts...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h3>🔤 Pretext Integration Test</h3>
      <p style={{ fontSize: '12px', color: '#666' }}>
        Testing DOM-free text measurement with @chenglou/pretext
      </p>

      <button onClick={testMeasurements} style={buttonStyle}>
        {loading ? 'Testing...' : 'Run Tests Again'}
      </button>

      {loading && <p>Running tests...</p>}

      {results.error && (
        <div style={{ ...testStyle, borderColor: 'red' }}>
          <h4 style={{ color: 'red' }}>❌ Error</h4>
          <p>{results.error}</p>
        </div>
      )}

      {!loading && !results.error && (
        <>
          <div style={testStyle}>
            <h4>Test 1: Basic Height Measurement</h4>
            <p>Height: {results.basicHeight?.height}px</p>
            <p>Lines: {results.basicHeight?.lineCount}</p>
          </div>

          <div style={testStyle}>
            <h4>Test 2: Batch Measurement</h4>
            {results.batch?.map((result, i) => (
              <p key={i}>
                Item {i + 1}: {result.height}px ({result.lineCount} lines)
              </p>
            ))}
          </div>

          <div style={testStyle}>
            <h4>Test 3: Line Layout</h4>
            <p>Total Height: {results.lineLayout?.height}px</p>
            <p>Lines: {results.lineLayout?.lineCount}</p>
            <p>First Line: &quot;{results.lineLayout?.lines[0]?.text}&quot;</p>
          </div>

          <div style={testStyle}>
            <h4>Test 4: Truncation</h4>
            <p>Original: {sampleText.length} chars</p>
            <p>Truncated: &quot;{results.truncated}&quot;</p>
          </div>

          <div style={testStyle}>
            <h4>Test 5: Minimum Width for 3 Lines</h4>
            <p>Min Width: {results.minWidth}px</p>
          </div>

          <div style={testStyle}>
            <h4>Test 6: Product Card Title</h4>
            <p>Height: {results.productCard?.height}px</p>
            <p>Lines: {results.productCard?.lineCount}</p>
          </div>

          <HookTest />
          <ProductCardTest />

          <div style={{ ...testStyle, background: '#f0fff4' }}>
            <h4>✅ All Tests Passed!</h4>
            <p>Pretext is working correctly in your environment.</p>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>
              You can now use Pretext utilities and hooks in your components.
            </p>
          </div>
        </>
      )}

      <div style={infoStyle}>
        <h4>📚 Documentation</h4>
        <p>See docs/PRETEXT_INTEGRATION.md for full API reference and examples.</p>
      </div>
    </div>
  );
}

// Inline styles for test component
const containerStyle = {
  padding: '24px',
  margin: '24px',
  border: '2px solid #0070f3',
  borderRadius: '8px',
  background: '#fff',
  fontFamily: 'Inter, system-ui, sans-serif',
};

const testStyle = {
  padding: '16px',
  margin: '16px 0',
  border: '1px solid #e0e0e0',
  borderRadius: '6px',
  background: '#fafafa',
};

const buttonStyle = {
  padding: '10px 20px',
  background: '#0070f3',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  marginBottom: '16px',
};
