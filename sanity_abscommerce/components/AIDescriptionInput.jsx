/**
 * AI Description Generator for Sanity Studio
 * Generates compelling product descriptions using OpenRouter API
 */

import { useCallback, useState, useEffect } from 'react';
import { set } from 'sanity';
import { Box, Button, Text, Stack, Spinner } from '@sanity/ui';

export function AIDescriptionInput(props) {
  const { onChange, value, elementProps } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  // Log full props structure to console for debugging
  useEffect(() => {
    console.log('[AIDescriptionInput] FULL PROPS:', JSON.stringify(props, null, 2));
    console.log('[AIDescriptionInput] props.document:', props.document);
    console.log('[AIDescriptionInput] props.parent:', props.parent);
    console.log('[AIDescriptionInput] props.value:', props.value);
    
    // Try to find the product name in multiple ways
    const namePaths = [
      'props.document.displayed.name',
      'props.document.displayed.title',
      'props.parent.name',
      'props.parent.title',
      'props.value.name',
      'props.value.title',
    ];
    
    const debugLines = namePaths.map(path => {
      const val = path.split('.').reduce((obj, key) => obj?.[key], props);
      return `${path}: ${JSON.stringify(val)}`;
    });
    
    setDebugInfo(debugLines.join('\n'));
  }, [props]);

  // Get product context from parent document - multiple fallback paths
  // Try both 'name' and 'title' as the field might be called either
  const productName = props.document?.displayed?.name || 
                      props.document?.displayed?.title ||
                      props.parent?.name || 
                      props.parent?.title ||
                      props.value?.name ||
                      props.value?.title || 
                      '';
  const category = props.document?.displayed?.category?.name || 
                   props.parent?.category?.name || 
                   '';
  const price = props.document?.displayed?.price || 
                props.parent?.price || 
                '';

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
