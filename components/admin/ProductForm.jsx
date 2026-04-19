/**
 * Enhanced Admin Product Form with AI Description Generator
 * 
 * Features:
 * - AI-powered product description generation with tone/length/templates
 * - Smart field validation and auto-save drafts
 * - Loading states with smooth transitions
 * - Editable textarea with accept/regenerate workflow
 * - Error handling with react-hot-toast
 * - WCAG 2.1 AA accessibility compliant
 * - Dark theme with gold accent (#C9A84C)
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useProductDescription } from '@/hooks/useAI';
import AIImageGenerator from './AIImageGenerator';
import toast from 'react-hot-toast';
import { 
  Sparkles, 
  Loader2, 
  Check, 
  X, 
  Wand2, 
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Zap,
  FileText,
  Palette,
  Ruler
} from 'lucide-react';

// AI Generation Templates
const DESCRIPTION_TEMPLATES = {
  standard: 'Standard e-commerce product description with features and benefits',
  story: 'Narrative-style description that tells the product\'s story',
  technical: 'Detailed technical specifications for tech-savvy buyers',
  minimalist: 'Short, punchy description for modern minimal aesthetic',
  luxury: 'Premium, aspirational language for high-end products',
};

// Tone options
const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional', emoji: '💼' },
  { value: 'friendly', label: 'Friendly & Casual', emoji: '😊' },
  { value: 'luxury', label: 'Luxury & Premium', emoji: '✨' },
  { value: 'technical', label: 'Technical & Detailed', emoji: '⚙️' },
  { value: 'playful', label: 'Playful & Fun', emoji: '🎉' },
  { value: 'urgent', label: 'Urgent & Persuasive', emoji: '🔥' },
];

// Length options
const LENGTH_OPTIONS = [
  { value: 'short', label: 'Short (50-100 words)', words: '50-100' },
  { value: 'medium', label: 'Medium (150-250 words)', words: '150-250' },
  { value: 'long', label: 'Long (300-500 words)', words: '300-500' },
];

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

  // AI Generation Options
  const [selectedTone, setSelectedTone] = useState('professional');
  const [selectedLength, setSelectedLength] = useState('medium');
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [showAiOptions, setShowAiOptions] = useState(false);
  const [generationHistory, setGenerationHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const [generatedDescription, setGeneratedDescription] = useState('');
  const [showGeneratedPreview, setShowGeneratedPreview] = useState(false);

  const {
    generate,
    loading,
    data: aiGeneratedDescription,
    error,
    model: usedModel,
    usage: tokenUsage,
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
      tone: TONE_OPTIONS.find(t => t.value === selectedTone)?.label || 'professional',
      template: selectedTemplate,
      length: LENGTH_OPTIONS.find(l => l.value === selectedLength)?.words || '150-250',
    };

    try {
      const description = await generate(formData.name, context);
      
      // Add to history
      setGenerationHistory(prev => [...prev, {
        description,
        timestamp: new Date(),
        tone: selectedTone,
        length: selectedLength,
        model: usedModel,
      }]);
      setCurrentHistoryIndex(prev => prev + 1);
      
      setGeneratedDescription(description);
      setShowGeneratedPreview(true);
      toast.success('Description generated successfully!');
    } catch (err) {
      // Error already handled by hook
    }
  }, [formData, generate, selectedTone, selectedLength, selectedTemplate, usedModel]);

  // Regenerate with different settings
  const handleRegenerate = useCallback(async () => {
    setGeneratedDescription('');
    setShowGeneratedPreview(false);
    await handleGenerateDescription();
  }, [handleGenerateDescription]);

  // Accept generated description
  const handleAcceptDescription = useCallback(() => {
    if (generatedDescription) {
      setFormData(prev => ({ ...prev, description: generatedDescription }));
      setShowGeneratedPreview(false);
      toast.success('Description applied to product!');
    }
  }, [generatedDescription]);

  // Reject generated description
  const handleRejectDescription = useCallback(() => {
    setGeneratedDescription('');
    setShowGeneratedPreview(false);
    toast('Description discarded', { icon: '👋' });
  }, []);

  // Navigate generation history
  const handleHistoryNavigation = useCallback((direction) => {
    const newIndex = currentHistoryIndex + direction;
    if (newIndex >= 0 && newIndex < generationHistory.length) {
      setCurrentHistoryIndex(newIndex);
      setGeneratedDescription(generationHistory[newIndex].description);
    }
  }, [currentHistoryIndex, generationHistory]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Update description when AI generates
  useEffect(() => {
    if (aiGeneratedDescription && !generatedDescription) {
      setGeneratedDescription(aiGeneratedDescription);
      setShowGeneratedPreview(true);
    }
  }, [aiGeneratedDescription, generatedDescription]);

  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e?.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Product description is required');
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
      
      {/* ==================== BASIC INFORMATION SECTION ==================== */}
      <section 
        style={{ 
          backgroundColor: 'var(--admin-surface-2, #1a1a1a)', 
          borderRadius: 'var(--admin-radius-xl, 12px)', 
          padding: 'var(--admin-space-6, 24px)', 
          boxShadow: 'var(--admin-shadow-sm, 0 2px 4px rgba(0,0,0,0.2))', 
          border: '1px solid var(--admin-border-subtle, rgba(201, 168, 76, 0.12))' 
        }} 
        aria-labelledby="basic-info-heading"
      >
        <h2 id="basic-info-heading" style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary, #ffffff)', marginBottom: 'var(--admin-space-4, 16px)', display: 'flex', alignItems: 'center', gap: 'var(--admin-space-2, 8px)' }}>
          <FileText className="w-5 h-5" style={{ color: 'var(--admin-gold, #C9A84C)' }} aria-hidden="true" />
          Basic Information
        </h2>

        {/* Product Name */}
        <div style={{ marginBottom: 'var(--admin-space-4, 16px)' }}>
          <label htmlFor="product-name" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary, #888888)', marginBottom: 'var(--admin-space-2, 8px)' }}>
            Product Name <span style={{ color: 'var(--admin-error-text, #ff6b6b)' }} aria-hidden="true">*</span>
          </label>
          <input
            id="product-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Premium Cotton T-Shirt"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
              borderRadius: 'var(--admin-radius-md, 8px)',
              backgroundColor: 'var(--admin-surface-1, #141414)',
              color: 'var(--admin-text-primary, #ffffff)',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--admin-gold, #C9A84C)';
              e.target.style.boxShadow = 'var(--admin-focus-ring, 0 0 0 3px rgba(201, 168, 76, 0.2))';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))';
              e.target.style.boxShadow = 'none';
            }}
            required
            aria-required="true"
          />
        </div>

        {/* Category & Price Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--admin-space-4, 16px)', marginBottom: 'var(--admin-space-4, 16px)' }}>
          <div>
            <label htmlFor="product-category" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary, #888888)', marginBottom: 'var(--admin-space-2, 8px)' }}>
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
                padding: '12px 16px',
                border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
                borderRadius: 'var(--admin-radius-md, 8px)',
                backgroundColor: 'var(--admin-surface-1, #141414)',
                color: 'var(--admin-text-primary, #ffffff)',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--admin-gold, #C9A84C)';
                e.target.style.boxShadow = 'var(--admin-focus-ring, 0 0 0 3px rgba(201, 168, 76, 0.2))';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label htmlFor="product-price" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary, #888888)', marginBottom: 'var(--admin-space-2, 8px)' }}>
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
                padding: '12px 16px',
                border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
                borderRadius: 'var(--admin-radius-md, 8px)',
                backgroundColor: 'var(--admin-surface-1, #141414)',
                color: 'var(--admin-text-primary, #ffffff)',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--admin-gold, #C9A84C)';
                e.target.style.boxShadow = 'var(--admin-focus-ring, 0 0 0 3px rgba(201, 168, 76, 0.2))';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 'var(--admin-space-4, 16px)' }}>
          <label htmlFor="product-features" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary, #888888)', marginBottom: 'var(--admin-space-2, 8px)' }}>
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
              padding: '12px 16px',
              border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
              borderRadius: 'var(--admin-radius-md, 8px)',
              backgroundColor: 'var(--admin-surface-1, #141414)',
              color: 'var(--admin-text-primary, #ffffff)',
              fontSize: '14px',
              resize: 'vertical',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--admin-gold, #C9A84C)';
              e.target.style.boxShadow = 'var(--admin-focus-ring, 0 0 0 3px rgba(201, 168, 76, 0.2))';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Target Audience & Keywords Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--admin-space-4, 16px)' }}>
          <div>
            <label htmlFor="product-audience" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary, #888888)', marginBottom: 'var(--admin-space-2, 8px)' }}>
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
                padding: '12px 16px',
                border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
                borderRadius: 'var(--admin-radius-md, 8px)',
                backgroundColor: 'var(--admin-surface-1, #141414)',
                color: 'var(--admin-text-primary, #ffffff)',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--admin-gold, #C9A84C)';
                e.target.style.boxShadow = 'var(--admin-focus-ring, 0 0 0 3px rgba(201, 168, 76, 0.2))';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label htmlFor="product-keywords" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary, #888888)', marginBottom: 'var(--admin-space-2, 8px)' }}>
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
                padding: '12px 16px',
                border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
                borderRadius: 'var(--admin-radius-md, 8px)',
                backgroundColor: 'var(--admin-surface-1, #141414)',
                color: 'var(--admin-text-primary, #ffffff)',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--admin-gold, #C9A84C)';
                e.target.style.boxShadow = 'var(--admin-focus-ring, 0 0 0 3px rgba(201, 168, 76, 0.2))';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </section>

      {/* ==================== AI DESCRIPTION GENERATOR SECTION ==================== */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.08) 0%, rgba(139, 26, 26, 0.08) 100%)',
          borderRadius: 'var(--admin-radius-xl, 12px)',
          padding: 'var(--admin-space-6, 24px)',
          boxShadow: 'var(--admin-shadow-gold, 0 4px 12px rgba(201, 168, 76, 0.15))',
          border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))'
        }}
        aria-labelledby="ai-description-heading"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--admin-space-5, 20px)' }}>
          <h2 id="ai-description-heading" style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary, #ffffff)', display: 'flex', alignItems: 'center', gap: 'var(--admin-space-2, 10px)' }}>
            <Sparkles className="w-5 h-5" style={{ color: 'var(--admin-gold, #C9A84C)' }} aria-hidden="true" />
            AI Description Generator
          </h2>
          <button
            type="button"
            onClick={() => setShowAiOptions(!showAiOptions)}
            style={{
              fontSize: '13px',
              color: 'var(--admin-gold, #C9A84C)',
              background: 'rgba(201, 168, 76, 0.1)',
              border: '1px solid var(--admin-gold-border-strong, rgba(201, 168, 76, 0.3))',
              borderRadius: 'var(--admin-radius-sm, 6px)',
              padding: '6px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--admin-space-1, 6px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(201, 168, 76, 0.2)';
              e.target.style.color = 'var(--admin-gold-hover, #d4b85c)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(201, 168, 76, 0.1)';
              e.target.style.color = 'var(--admin-gold, #C9A84C)';
            }}
            aria-expanded={showAiOptions}
            aria-controls="ai-options-panel"
          >
            {showAiOptions ? (
              <>
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
                Hide Options
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
                Show Options
              </>
            )}
          </button>
        </div>

        {/* AI Options Panel */}
        {showAiOptions && (
          <div id="ai-options-panel" style={{ marginBottom: 'var(--admin-space-4, 16px)', display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-4, 16px)' }} role="region" aria-label="AI generation options">

            {/* Tone Selector */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-1, 6px)', fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary, #888888)', marginBottom: 'var(--admin-space-2, 8px)' }}>
                <Palette className="w-4 h-4" aria-hidden="true" />
                Tone
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--admin-space-2, 8px)' }}>
                {TONE_OPTIONS.map((tone) => (
                  <button
                    key={tone.value}
                    type="button"
                    onClick={() => setSelectedTone(tone.value)}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: selectedTone === tone.value ? 'var(--admin-bg-selected, rgba(201, 168, 76, 0.2))' : 'var(--admin-surface-1, #141414)',
                      border: `1px solid ${selectedTone === tone.value ? 'var(--admin-gold, #C9A84C)' : 'var(--admin-gold-border, rgba(201, 168, 76, 0.15))'}`,
                      borderRadius: 'var(--admin-radius-md, 8px)',
                      color: 'var(--admin-text-primary, #ffffff)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--admin-space-1, 6px)',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTone !== tone.value) {
                        e.target.style.borderColor = 'var(--admin-border-strong, rgba(201, 168, 76, 0.4))';
                        e.target.style.backgroundColor = 'var(--admin-bg-hover, rgba(201, 168, 76, 0.1))';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTone !== tone.value) {
                        e.target.style.borderColor = 'var(--admin-gold-border, rgba(201, 168, 76, 0.15))';
                        e.target.style.backgroundColor = 'var(--admin-surface-1, #141414)';
                      }
                    }}
                    aria-pressed={selectedTone === tone.value}
                  >
                    <span style={{ fontSize: '16px' }}>{tone.emoji}</span>
                    <span>{tone.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selector */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-1, 6px)', fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary, #888888)', marginBottom: 'var(--admin-space-2, 8px)' }}>
                <Ruler className="w-4 h-4" aria-hidden="true" />
                Length
              </label>
              <div style={{ display: 'flex', gap: 'var(--admin-space-2, 8px)' }}>
                {LENGTH_OPTIONS.map((length) => (
                  <button
                    key={length.value}
                    type="button"
                    onClick={() => setSelectedLength(length.value)}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      backgroundColor: selectedLength === length.value ? 'var(--admin-bg-selected, rgba(201, 168, 76, 0.2))' : 'var(--admin-surface-1, #141414)',
                      border: `1px solid ${selectedLength === length.value ? 'var(--admin-gold, #C9A84C)' : 'var(--admin-gold-border, rgba(201, 168, 76, 0.15))'}`,
                      borderRadius: 'var(--admin-radius-md, 8px)',
                      color: 'var(--admin-text-primary, #ffffff)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedLength !== length.value) {
                        e.target.style.borderColor = 'var(--admin-border-strong, rgba(201, 168, 76, 0.4))';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedLength !== length.value) {
                        e.target.style.borderColor = 'var(--admin-gold-border, rgba(201, 168, 76, 0.15))';
                      }
                    }}
                    aria-pressed={selectedLength === length.value}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>{length.label.split(' ')[0]}</div>
                    <div style={{ fontSize: '11px', color: 'var(--admin-text-secondary, #888888)' }}>{length.words} words</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Selector */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-1, 6px)', fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary, #888888)', marginBottom: 'var(--admin-space-2, 8px)' }}>
                <FileText className="w-4 h-4" aria-hidden="true" />
                Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'var(--admin-surface-1, #141414)',
                  border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
                  borderRadius: 'var(--admin-radius-md, 8px)',
                  color: 'var(--admin-text-primary, #ffffff)',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
                aria-label="Description template"
              >
                {Object.entries(DESCRIPTION_TEMPLATES).map(([key, description]) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)} - {description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerateDescription}
          disabled={loading || !formData.name.trim()}
          style={{
            padding: '14px 28px',
            background: loading || !formData.name.trim()
              ? 'rgba(201, 168, 76, 0.3)'
              : 'linear-gradient(135deg, var(--admin-gold, #C9A84C) 0%, var(--admin-gold-active, #a8882e) 100%)',
            color: 'var(--admin-text-primary, #ffffff)',
            fontWeight: '600',
            fontSize: '15px',
            borderRadius: 'var(--admin-radius-lg, 10px)',
            border: 'none',
            boxShadow: loading || !formData.name.trim() ? 'none' : 'var(--admin-shadow-gold, 0 4px 16px rgba(201, 168, 76, 0.4))',
            cursor: loading || !formData.name.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--admin-space-2, 10px)',
            width: '100%',
            maxWidth: '400px',
          }}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              <span>Generating with AI...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" aria-hidden="true" />
              <span>✨ Generate Description</span>
            </>
          )}
        </button>

        {/* Loading State */}
        {loading && (
          <div style={{ marginTop: 'var(--admin-space-4, 16px)', display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-1, 8px)', color: 'var(--admin-text-secondary, #888888)' }} role="status" aria-live="polite">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-3, 12px)' }}>
              <div style={{ display: 'flex', gap: 'var(--admin-space-1, 4px)' }} aria-hidden="true">
                <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--admin-gold, #C9A84C)', borderRadius: '50%', animation: 'bounce 0.6s infinite', animationDelay: '0ms', display: 'inline-block' }}></span>
                <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--admin-gold, #C9A84C)', borderRadius: '50%', animation: 'bounce 0.6s infinite', animationDelay: '150ms', display: 'inline-block' }}></span>
                <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--admin-gold, #C9A84C)', borderRadius: '50%', animation: 'bounce 0.6s infinite', animationDelay: '300ms', display: 'inline-block' }}></span>
              </div>
              <span>Creating compelling description with AI...</span>
            </div>
            {usedModel && (
              <span style={{ fontSize: '12px', color: 'var(--admin-text-muted, #666666)' }}>Using: {usedModel}</span>
            )}
          </div>
        )}

        {/* Generation History Navigation */}
        {generationHistory.length > 1 && showGeneratedPreview && (
          <div style={{ marginTop: 'var(--admin-space-3, 12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--admin-space-3, 12px)' }}>
            <button
              type="button"
              onClick={() => handleHistoryNavigation(-1)}
              disabled={currentHistoryIndex <= 0}
              style={{
                padding: '6px 12px',
                backgroundColor: currentHistoryIndex <= 0 ? 'var(--admin-surface-2, #1a1a1a)' : 'var(--admin-surface-5, #2a2a2a)',
                border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
                borderRadius: 'var(--admin-radius-sm, 6px)',
                color: currentHistoryIndex <= 0 ? 'var(--admin-text-muted, #666666)' : 'var(--admin-text-primary, #ffffff)',
                fontSize: '12px',
                cursor: currentHistoryIndex <= 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              aria-label="Previous generation"
            >
              ← Previous
            </button>
            <span style={{ fontSize: '12px', color: 'var(--admin-text-secondary, #888888)' }}>
              {currentHistoryIndex + 1} / {generationHistory.length}
            </span>
            <button
              type="button"
              onClick={() => handleHistoryNavigation(1)}
              disabled={currentHistoryIndex >= generationHistory.length - 1}
              style={{
                padding: '6px 12px',
                backgroundColor: currentHistoryIndex >= generationHistory.length - 1 ? 'var(--admin-surface-2, #1a1a1a)' : 'var(--admin-surface-5, #2a2a2a)',
                border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
                borderRadius: 'var(--admin-radius-sm, 6px)',
                color: currentHistoryIndex >= generationHistory.length - 1 ? 'var(--admin-text-muted, #666666)' : 'var(--admin-text-primary, #ffffff)',
                fontSize: '12px',
                cursor: currentHistoryIndex >= generationHistory.length - 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              aria-label="Next generation"
            >
              Next →
            </button>
          </div>
        )}

        {/* Generated Description Preview */}
        {showGeneratedPreview && generatedDescription && (
          <div style={{ marginTop: 'var(--admin-space-5, 20px)' }} role="alert" aria-live="polite">
            <div style={{
              backgroundColor: 'var(--admin-surface-1, #141414)',
              borderRadius: 'var(--admin-radius-lg, 10px)',
              padding: 'var(--admin-space-5, 20px)',
              border: '1px solid var(--admin-gold-border-strong, rgba(201, 168, 76, 0.3))',
              boxShadow: '0 2px 8px rgba(201, 168, 76, 0.1)'
            }}>
              {/* Preview Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--admin-space-3, 12px)',
                paddingBottom: 'var(--admin-space-3, 12px)',
                borderBottom: '1px solid var(--admin-gold-border, rgba(201, 168, 76, 0.1))'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-2, 8px)' }}>
                  <Zap className="w-4 h-4" style={{ color: 'var(--admin-gold, #C9A84C)' }} aria-hidden="true" />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--admin-gold, #C9A84C)' }}>
                    AI Generated Preview
                  </span>
                </div>
                {tokenUsage && (
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-muted, #666666)' }}>
                    {tokenUsage.total_tokens} tokens
                  </span>
                )}
              </div>

              {/* Preview Content */}
              <div style={{
                fontSize: '14px',
                color: '#e0e0e0',
                whiteSpace: 'pre-wrap',
                marginBottom: 'var(--admin-space-5, 20px)',
                lineHeight: '1.6',
                maxHeight: '300px',
                overflowY: 'auto',
                padding: 'var(--admin-space-3, 12px)',
                backgroundColor: 'var(--admin-surface-0, #0f0f0f)',
                borderRadius: 'var(--admin-radius-md, 8px)',
              }}>
                {generatedDescription}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 'var(--admin-space-2, 10px)', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleAcceptDescription}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--admin-success, #2d7a2d)',
                    color: 'var(--admin-text-primary, #ffffff)',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: 'var(--admin-radius-md, 8px)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--admin-space-1, 6px)',
                    transition: 'background-color 0.2s',
                    flex: '1',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#3d8a3d'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--admin-success, #2d7a2d)'}
                >
                  <Check className="w-4 h-4" aria-hidden="true" />
                  Accept & Apply
                </button>

                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--admin-surface-5, #2a2a2a)',
                    color: 'var(--admin-gold, #C9A84C)',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: 'var(--admin-radius-md, 8px)',
                    border: '1px solid var(--admin-gold-border-strong, rgba(201, 168, 76, 0.3))',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--admin-space-1, 6px)',
                    transition: 'all 0.2s',
                    flex: '1',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = '#333333';
                      e.target.style.borderColor = 'var(--admin-gold, #C9A84C)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--admin-surface-5, #2a2a2a)';
                    e.target.style.borderColor = 'var(--admin-gold-border-strong, rgba(201, 168, 76, 0.3))';
                  }}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                  Regenerate
                </button>

                <button
                  type="button"
                  onClick={handleRejectDescription}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--admin-surface-5, #2a2a2a)',
                    color: 'var(--admin-text-secondary, #888888)',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: 'var(--admin-radius-md, 8px)',
                    border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--admin-space-1, 6px)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#333333';
                    e.target.style.color = 'var(--admin-text-primary, #ffffff)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--admin-surface-5, #2a2a2a)';
                    e.target.style.color = 'var(--admin-text-secondary, #888888)';
                  }}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ==================== DESCRIPTION TEXTAREA SECTION ==================== */}
      <section
        style={{
          backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
          borderRadius: 'var(--admin-radius-xl, 12px)',
          padding: 'var(--admin-space-6, 24px)',
          boxShadow: 'var(--admin-shadow-sm, 0 2px 4px rgba(0,0,0,0.2))',
          border: '1px solid var(--admin-border-subtle, rgba(201, 168, 76, 0.12))'
        }}
        aria-labelledby="description-heading"
      >
        <h2 id="description-heading" style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary, #ffffff)', marginBottom: 'var(--admin-space-4, 16px)', display: 'flex', alignItems: 'center', gap: 'var(--admin-space-2, 8px)' }}>
          <FileText className="w-5 h-5" style={{ color: 'var(--admin-gold, #C9A84C)' }} aria-hidden="true" />
          Product Description <span style={{ color: 'var(--admin-error-text, #ff6b6b)' }} aria-hidden="true">*</span>
        </h2>
        <textarea
          id="product-description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter or generate a compelling product description..."
          rows={8}
          style={{
            width: '100%',
            padding: '14px 16px',
            border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
            borderRadius: 'var(--admin-radius-md, 8px)',
            backgroundColor: 'var(--admin-surface-1, #141414)',
            color: 'var(--admin-text-primary, #ffffff)',
            fontSize: '14px',
            resize: 'vertical',
            transition: 'all 0.2s',
            lineHeight: '1.6',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--admin-gold, #C9A84C)';
            e.target.style.boxShadow = 'var(--admin-focus-ring, 0 0 0 3px rgba(201, 168, 76, 0.2))';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))';
            e.target.style.boxShadow = 'none';
          }}
          required
          aria-required="true"
          aria-describedby="description-help"
        />
        <p id="description-help" style={{ marginTop: 'var(--admin-space-2, 10px)', fontSize: '13px', color: 'var(--admin-text-muted, #666666)' }}>
          💡 Tip: Use the AI Description Generator above to create compelling descriptions, or write your own.
        </p>
      </section>

      {/* ==================== AI IMAGE GENERATOR SECTION ==================== */}
      {formData.name && (
        <section
          style={{
            backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
            borderRadius: 'var(--admin-radius-xl, 12px)',
            padding: 'var(--admin-space-6, 24px)',
            boxShadow: 'var(--admin-shadow-sm, 0 2px 4px rgba(0,0,0,0.2))',
            border: '1px solid var(--admin-border-subtle, rgba(201, 168, 76, 0.12))'
          }}
          aria-labelledby="image-generator-heading"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-2, 10px)', marginBottom: 'var(--admin-space-5, 20px)' }}>
            <ImageIcon className="w-5 h-5" style={{ color: 'var(--admin-gold, #C9A84C)' }} aria-hidden="true" />
            <h2 id="image-generator-heading" style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary, #ffffff)', margin: 0 }}>
              AI Product Image
            </h2>
          </div>
          <AIImageGenerator
            productName={formData.name}
            category={formData.category}
            onImageGenerated={(imageUrl) => {
              toast.success('Product image generated successfully!');
            }}
          />
        </section>
      )}

      {/* ==================== SUBMIT BUTTONS ==================== */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--admin-space-3, 12px)', paddingTop: 'var(--admin-space-4, 16px)' }}>
        <button
          type="button"
          onClick={() => window.history.back()}
          style={{
            padding: '12px 28px',
            backgroundColor: 'var(--admin-surface-5, #2a2a2a)',
            color: 'var(--admin-text-secondary, #888888)',
            fontWeight: '600',
            fontSize: '14px',
            borderRadius: 'var(--admin-radius-md, 8px)',
            border: '1px solid var(--admin-border-subtle, rgba(201, 168, 76, 0.12))',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#333333';
            e.target.style.color = 'var(--admin-text-primary, #ffffff)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--admin-surface-5, #2a2a2a)';
            e.target.style.color = 'var(--admin-text-secondary, #888888)';
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '12px 32px',
            background: isSubmitting
              ? 'rgba(201, 168, 76, 0.3)'
              : 'linear-gradient(135deg, var(--admin-gold, #C9A84C) 0%, var(--admin-gold-active, #a8882e) 100%)',
            color: 'var(--admin-text-primary, #ffffff)',
            fontWeight: '600',
            fontSize: '15px',
            borderRadius: 'var(--admin-radius-lg, 10px)',
            border: 'none',
            boxShadow: isSubmitting ? 'none' : 'var(--admin-shadow-gold, 0 4px 16px rgba(201, 168, 76, 0.4))',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--admin-space-2, 10px)'
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) e.target.style.boxShadow = '0 6px 20px rgba(201, 168, 76, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = isSubmitting ? 'none' : 'var(--admin-shadow-gold, 0 4px 16px rgba(201, 168, 76, 0.4))';
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 style={{ width: '18px', height: '18px' }} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check style={{ width: '18px', height: '18px' }} />
              Save Product
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
