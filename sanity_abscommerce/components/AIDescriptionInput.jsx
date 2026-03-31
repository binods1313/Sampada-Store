/**
 * AI Description Generator for Sanity Studio
 * Generates compelling product descriptions using OpenRouter API
 */

import { useCallback, useState } from 'react';
import { set } from 'sanity';
import { Box, Button, Text, Stack, Spinner } from '@sanity/ui';

export function AIDescriptionInput(props) {
  const { onChange, value, elementProps } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get product context from parent document
  const productName = props.document?.displayed?.name || '';
  const category = props.document?.displayed?.category?.name || '';
  const price = props.document?.displayed?.price || '';

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
          category,
          price
        })
      });
      
      const data = await response.json();
      if (data.description) {
        onChange(set(data.description));
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError('Generation failed. Please try again.');
      console.error('AI generation error:', err);
    } finally {
      setLoading(false);
    }
  }, [productName, category, price, onChange]);

  return (
    <Stack space={3}>
      <textarea
        {...elementProps}
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
        <Text size={1} weight={500} style={{ color: '#8B1A1A' }}>
          ⚠️ {error}
        </Text>
      )}
      
      {/* Helper text */}
      {!value && !error && !loading && (
        <Text size={1} muted>
          💡 Click "Generate with AI" to create a compelling product description
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
