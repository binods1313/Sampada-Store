/**
 * AI Description Generator for Sanity Studio
 * Generates compelling product descriptions using OpenRouter API
 */

import { useCallback, useState, useEffect } from 'react';
import { set, useClient, useFormValue } from 'sanity';
import { Box, Button, Text, Stack, Spinner } from '@sanity/ui';

export function AIDescriptionInput(props) {
  const { onChange, value } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  
  const client = useClient({ apiVersion: '2024-05-18' });

  // Get specific field values using useFormValue
  // useFormValue takes a path array and returns the value at that path
  const productName = useFormValue(['name']);
  const category = useFormValue(['category']);
  const price = useFormValue(['price']);

  // Fetch full category document if needed
  const [categoryData, setCategoryData] = useState(null);
  
  useEffect(() => {
    const fetchCategory = async () => {
      if (category?._ref) {
        try {
          const data = await client.getDocument(category._ref);
          setCategoryData(data);
        } catch (err) {
          console.error('[AIDescriptionInput] Failed to fetch category:', err);
        }
      }
    };
    fetchCategory();
  }, [category?._ref, client]);

  // Log props structure to console for debugging
  useEffect(() => {
    console.log('[AIDescriptionInput] Props keys:', Object.keys(props || {}));
    console.log('[AIDescriptionInput] productName:', productName);
    console.log('[AIDescriptionInput] category:', category);
    console.log('[AIDescriptionInput] price:', price);
    console.log('[AIDescriptionInput] categoryData:', categoryData);

    setDebugInfo(`Product Name: ${productName || 'Loading...'}\nCategory: ${categoryData?.name || category?.name || 'N/A'}\nPrice: ₹${price || 'N/A'}`);
  }, [props, productName, category, price, categoryData]);

  // Use the actual values
  const categoryName = categoryData?.name || '';
  const productPrice = price || '';

  const generateDescription = useCallback(async () => {
    if (!productName) {
      setError('Please enter a product name first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          category: categoryName,
          price: productPrice
        })
      });

      const data = await response.json();
      if (data.description) {
        onChange(set(data.description));
        setError(null);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError('Generation failed. Please try again.');
      console.error('AI generation error:', err);
    } finally {
      setLoading(false);
    }
  }, [productName, categoryName, productPrice, onChange]);

  return (
    <Stack space={3}>
      <textarea
        // Filter out Sanity-specific props that shouldn't go to DOM elements
        // to avoid styled-components warnings
        tone={undefined}
        items={undefined}
        onChange={(e) => onChange(set(e.target.value))}
        value={value || ''}
        rows={5}
        style={{
          width: '100%',
          minHeight: '120px',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          padding: '12px',
          borderRadius: '4px',
          border: '1px solid var(--input-border-color)',
          resize: 'vertical'
        }}
      />
      
      {/* AI Generate Button */}
      <Button
        type="button"
        onClick={generateDescription}
        disabled={loading || !productName}
        tone={loading ? 'default' : 'positive'}
        icon={loading ? <Spinner muted /> : <span>✨</span>}
        text={loading ? 'Generating...' : '✨ Generate with AI'}
        style={{
          background: loading 
            ? 'var(--button-default-bg)' 
            : 'linear-gradient(135deg, #8B1A1A, #6B1414)',
          color: '#fff',
          border: '1.5px solid #C9A84C',
          fontWeight: '600',
          cursor: loading || !productName ? 'not-allowed' : 'pointer',
          opacity: loading || !productName ? 0.6 : 1,
          transition: 'all 0.2s ease'
        }}
      />
      
      {/* Debug info - shows all name paths being checked */}
      <Box padding={2} radius={2} style={{ background: '#f5f5f5', fontFamily: 'monospace', fontSize: '11px' }}>
        <Text size={1} weight={500}>🔍 Debug - Checking these paths:</Text>
        <pre style={{ margin: '8px 0', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {debugInfo}
        </pre>
        <Text size={1} tone={productName ? 'positive' : 'critical'}>
          {productName 
            ? `✅ Detected: "${productName}"` 
            : `❌ No product name detected - button disabled`}
        </Text>
      </Box>
      
      {/* Helper text when button is disabled */}
      {!productName && (
        <Text size={1} tone="critical">
          ⚠️ Please enter a Product Name above to enable AI generation
        </Text>
      )}
      
      {/* Loading skeleton */}
      {loading && (
        <Box padding={3} radius={2}>
          <div style={{
            height: '80px',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-shimmer 1.5s infinite',
            borderRadius: '4px'
          }} />
        </Box>
      )}
      
      {/* Error message */}
      {error && (
        <Text size={1} weight={500} tone="critical">
          ⚠️ {error}
        </Text>
      )}
      
      {/* Helper text */}
      {!value && !error && !loading && productName && (
        <Text size={1} muted>
          💡 Click "✨ Generate with AI" to create a compelling product description
        </Text>
      )}
      
      <style>{`
        @keyframes skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </Stack>
  );
}
