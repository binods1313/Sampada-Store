/**
 * Admin Product Form with AI Description Generator
 * 
 * Features:
 * - AI-powered product description generation
 * - Loading states with smooth transitions
 * - Editable textarea output
 * - Error handling with react-hot-toast
 * - Emil design polish: clean button states, smooth transitions
 * - WCAG 2.1 AA accessibility compliant
 */

import React, { useState, useCallback } from 'react';
import { useProductDescription } from '@/hooks/useAI';
import AIImageGenerator from './AIImageGenerator';
import toast from 'react-hot-toast';
import { Sparkles, Loader2, Check, X, Wand2, Image as ImageIcon } from 'lucide-react';

const ProductForm = ({ initialData = {}, onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    category: initialData.category || '',
    price: initialData.price || '',
    features: initialData.features?.join('\n') || '',
    targetAudience: initialData.targetAudience || '',
    keywords: initialData.keywords?.join(', ') || '',
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [showAiOptions, setShowAiOptions] = useState(false);

  const {
    generate,
    loading,
    data: aiGeneratedDescription,
    error,
  } = useProductDescription({
    temperature: 0.8,
    enableModelFallback: true,
  });

  // Handle input changes
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Generate AI description
  const handleGenerateDescription = useCallback(async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a product name first');
      return;
    }

    try {
      const features = formData.features
        ? formData.features.split('\n').filter(f => f.trim())
        : [];

      const keywords = formData.keywords
        ? formData.keywords.split(',').map(k => k.trim()).filter(k => k)
        : [];

      const context = {
        features: features.length > 0 ? features : undefined,
        category: formData.category || undefined,
        targetAudience: formData.targetAudience || undefined,
        priceRange: formData.price ? `₹${formData.price}` : undefined,
        keywords: keywords.length > 0 ? keywords : undefined,
        tone: 'professional yet friendly',
      };

      await generate(formData.name, context);
      toast.success('Description generated successfully!');
    } catch (err) {
      // Error already handled by hook and toast
    }
  }, [formData, generate]);

  // Update description when AI generates
  React.useEffect(() => {
    if (aiGeneratedDescription) {
      setGeneratedDescription(aiGeneratedDescription);
      setFormData(prev => ({ ...prev, description: aiGeneratedDescription }));
      setShowAiOptions(true);
    }
  }, [aiGeneratedDescription]);

  // Show error toast
  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Accept generated description
  const handleAcceptDescription = useCallback(() => {
    if (generatedDescription) {
      setFormData(prev => ({ ...prev, description: generatedDescription }));
      setShowAiOptions(false);
      toast.success('Description applied!');
    }
  }, [generatedDescription]);

  // Reject generated description
  const handleRejectDescription = useCallback(() => {
    setGeneratedDescription('');
    setShowAiOptions(false);
    setFormData(prev => ({ ...prev, description: '' }));
    toast('Description cancelled', { icon: '👋' });
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e?.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    const submitData = {
      ...formData,
      features: formData.features ? formData.features.split('\n').filter(f => f.trim()) : [],
      keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()).filter(k => k) : [],
    };

    onSubmit?.(submitData);
  }, [formData, onSubmit]);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} aria-label="Product form">
      {/* Basic Information Section */}
      <section style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', border: '1px solid rgba(201, 168, 76, 0.12)' }} aria-labelledby="basic-info-heading">
        <h2 id="basic-info-heading" style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>
          Basic Information
        </h2>

        {/* Product Name */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="product-name" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#888888', marginBottom: '8px' }}>
            Product Name <span style={{ color: '#ff6b6b' }} aria-hidden="true">*</span>
          </label>
          <input
            id="product-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Premium Cotton T-Shirt"
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              borderRadius: '8px',
              backgroundColor: '#141414',
              color: '#ffffff',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#C9A84C';
              e.target.style.boxShadow = '0 0 0 3px rgba(201, 168, 76, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(201, 168, 76, 0.2)';
              e.target.style.boxShadow = 'none';
            }}
            required
            aria-required="true"
          />
        </div>

        {/* Category & Price Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label htmlFor="product-category" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#888888', marginBottom: '8px' }}>
              Category
            </label>
            <input
              id="product-category"
              type="text"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="e.g., Clothing, Electronics"
              style={{
                width: '100%',
                padding: '10px 16px',
                border: '1px solid rgba(201, 168, 76, 0.2)',
                borderRadius: '8px',
                backgroundColor: '#141414',
                color: '#ffffff',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#C9A84C';
                e.target.style.boxShadow = '0 0 0 3px rgba(201, 168, 76, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(201, 168, 76, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label htmlFor="product-price" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#888888', marginBottom: '8px' }}>
              Price (₹)
            </label>
            <input
              id="product-price"
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="999"
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '10px 16px',
                border: '1px solid rgba(201, 168, 76, 0.2)',
                borderRadius: '8px',
                backgroundColor: '#141414',
                color: '#ffffff',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#C9A84C';
                e.target.style.boxShadow = '0 0 0 3px rgba(201, 168, 76, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(201, 168, 76, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="product-features" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#888888', marginBottom: '8px' }}>
            Features (one per line)
          </label>
          <textarea
            id="product-features"
            value={formData.features}
            onChange={(e) => handleChange('features', e.target.value)}
            placeholder="High-quality material&#10;Comfortable fit&#10;Durable construction"
            rows={3}
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              borderRadius: '8px',
              backgroundColor: '#141414',
              color: '#ffffff',
              fontSize: '14px',
              resize: 'vertical',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#C9A84C';
              e.target.style.boxShadow = '0 0 0 3px rgba(201, 168, 76, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(201, 168, 76, 0.2)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Target Audience & Keywords Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label htmlFor="product-audience" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#888888', marginBottom: '8px' }}>
              Target Audience
            </label>
            <input
              id="product-audience"
              type="text"
              value={formData.targetAudience}
              onChange={(e) => handleChange('targetAudience', e.target.value)}
              placeholder="e.g., Young professionals, Students"
              style={{
                width: '100%',
                padding: '10px 16px',
                border: '1px solid rgba(201, 168, 76, 0.2)',
                borderRadius: '8px',
                backgroundColor: '#141414',
                color: '#ffffff',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#C9A84C';
                e.target.style.boxShadow = '0 0 0 3px rgba(201, 168, 76, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(201, 168, 76, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label htmlFor="product-keywords" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#888888', marginBottom: '8px' }}>
              SEO Keywords (comma-separated)
            </label>
            <input
              id="product-keywords"
              type="text"
              value={formData.keywords}
              onChange={(e) => handleChange('keywords', e.target.value)}
              placeholder="cotton, comfortable, casual"
              style={{
                width: '100%',
                padding: '10px 16px',
                border: '1px solid rgba(201, 168, 76, 0.2)',
                borderRadius: '8px',
                backgroundColor: '#141414',
                color: '#ffffff',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#C9A84C';
                e.target.style.boxShadow = '0 0 0 3px rgba(201, 168, 76, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(201, 168, 76, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </section>

      {/* AI Description Generator Section */}
      <section style={{ background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.05) 0%, rgba(139, 26, 26, 0.05) 100%)', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', border: '1px solid rgba(201, 168, 76, 0.12)' }} aria-labelledby="ai-description-heading">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 id="ai-description-heading" style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles className="w-5 h-5" style={{ color: '#C9A84C' }} aria-hidden="true" />
            AI Description Generator
          </h2>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ fontSize: '14px', color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#d4b85c'}
            onMouseLeave={(e) => e.target.style.color = '#C9A84C'}
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Hide Options' : 'Show Options'}
          </button>
        </div>

        {/* AI Options Panel */}
        {isExpanded && (
          <div style={{ marginBottom: '16px' }} role="region" aria-label="AI generation options">
            <p style={{ fontSize: '14px', color: '#888888' }}>
              Fill in the product details above, then click Generate to create a compelling description using AI.
            </p>
          </div>
        )}

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerateDescription}
          disabled={loading || !formData.name.trim()}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #C9A84C 0%, #a8882e 100%)',
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '14px',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(201, 168, 76, 0.3)',
            cursor: loading || !formData.name.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !formData.name.trim() ? 0.5 : 1,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: 'auto'
          }}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" aria-hidden="true" />
              <span>✨ AI Generate</span>
            </>
          )}
        </button>

        {/* Loading State */}
        {loading && (
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', color: '#888888' }} role="status" aria-live="polite">
            <div style={{ display: 'flex', gap: '4px' }} aria-hidden="true">
              <span className="w-2 h-2" style={{ width: '8px', height: '8px', backgroundColor: '#C9A84C', borderRadius: '50%', animation: 'bounce 0.6s infinite', animationDelay: '0ms' }}></span>
              <span className="w-2 h-2" style={{ width: '8px', height: '8px', backgroundColor: '#C9A84C', borderRadius: '50%', animation: 'bounce 0.6s infinite', animationDelay: '150ms' }}></span>
              <span className="w-2 h-2" style={{ width: '8px', height: '8px', backgroundColor: '#C9A84C', borderRadius: '50%', animation: 'bounce 0.6s infinite', animationDelay: '300ms' }}></span>
            </div>
            <span>Creating compelling description with AI...</span>
          </div>
        )}

        {/* Generated Description Preview */}
        {showAiOptions && generatedDescription && (
          <div style={{ marginTop: '16px' }} role="alert" aria-live="polite">
            <div style={{ backgroundColor: '#141414', borderRadius: '8px', padding: '16px', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
              <p style={{ fontSize: '14px', color: '#888888', whiteSpace: 'pre-wrap', marginBottom: '16px' }}>
                {generatedDescription}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleAcceptDescription}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#2d7a2d',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#3d8a3d'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#2d7a2d'}
                >
                  <Check className="w-4 h-4" aria-hidden="true" />
                  Accept
                </button>
                <button
                  type="button"
                  onClick={handleRejectDescription}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#2a2a2a',
                    color: '#888888',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: '6px',
                    border: '1px solid rgba(201, 168, 76, 0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#333333';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#2a2a2a';
                    e.target.style.color = '#888888';
                  }}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Description Textarea (always visible, editable) */}
      <section style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', border: '1px solid rgba(201, 168, 76, 0.12)' }} aria-labelledby="description-heading">
        <h2 id="description-heading" style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>
          Product Description
        </h2>
        <textarea
          id="product-description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter or generate a compelling product description..."
          rows={6}
          style={{
            width: '100%',
            padding: '10px 16px',
            border: '1px solid rgba(201, 168, 76, 0.2)',
            borderRadius: '8px',
            backgroundColor: '#141414',
            color: '#ffffff',
            fontSize: '14px',
            resize: 'vertical',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#C9A84C';
            e.target.style.boxShadow = '0 0 0 3px rgba(201, 168, 76, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(201, 168, 76, 0.2)';
            e.target.style.boxShadow = 'none';
          }}
          aria-describedby="description-help"
        />
        <p id="description-help" style={{ marginTop: '8px', fontSize: '14px', color: '#666666' }}>
          You can edit this description manually or use AI to generate one.
        </p>
      </section>

      {/* AI Image Generator */}
      {formData.name && (
        <section style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', border: '1px solid rgba(201, 168, 76, 0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <ImageIcon style={{ width: '20px', height: '20px', color: '#C9A84C' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', margin: 0 }}>
              AI Product Image
            </h2>
          </div>
          <AIImageGenerator
            productName={formData.name}
            category={formData.category}
            onImageGenerated={(imageUrl) => {
              toast.success('Product image generated!')
              // You can save this to Sanity here or pass it up via onSubmit
            }}
          />
        </section>
      )}

      {/* Submit Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button
          type="button"
          onClick={() => window.history.back()}
          style={{
            padding: '10px 24px',
            backgroundColor: '#2a2a2a',
            color: '#888888',
            fontWeight: '600',
            fontSize: '14px',
            borderRadius: '8px',
            border: '1px solid rgba(201, 168, 76, 0.12)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#333333';
            e.target.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#2a2a2a';
            e.target.style.color = '#888888';
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #C9A84C 0%, #a8882e 100%)',
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '14px',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(201, 168, 76, 0.3)',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) e.target.style.boxShadow = '0 6px 16px rgba(201, 168, 76, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 4px 12px rgba(201, 168, 76, 0.3)';
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" />
              Creating...
            </>
          ) : (
            'Save Product'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
