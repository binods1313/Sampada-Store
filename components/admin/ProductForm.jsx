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
import toast from 'react-hot-toast';
import { Sparkles, Loader2, Check, X, Wand2 } from 'lucide-react';

const ProductForm = ({ initialData = {}, onSubmit }) => {
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
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Product form">
      {/* Basic Information Section */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700" aria-labelledby="basic-info-heading">
        <h2 id="basic-info-heading" className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Basic Information
        </h2>

        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product Name <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="product-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Premium Cotton T-Shirt"
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            required
            aria-required="true"
          />
        </div>

        {/* Category & Price Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <input
              id="product-category"
              type="text"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="e.g., Clothing, Electronics"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <label htmlFor="product-features" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Features (one per line)
          </label>
          <textarea
            id="product-features"
            value={formData.features}
            onChange={(e) => handleChange('features', e.target.value)}
            placeholder="High-quality material&#10;Comfortable fit&#10;Durable construction"
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        {/* Target Audience & Keywords Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="product-audience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Audience
            </label>
            <input
              id="product-audience"
              type="text"
              value={formData.targetAudience}
              onChange={(e) => handleChange('targetAudience', e.target.value)}
              placeholder="e.g., Young professionals, Students"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="product-keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SEO Keywords (comma-separated)
            </label>
            <input
              id="product-keywords"
              type="text"
              value={formData.keywords}
              onChange={(e) => handleChange('keywords', e.target.value)}
              placeholder="cotton, comfortable, casual"
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </section>

      {/* AI Description Generator Section */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 shadow-sm border border-purple-100 dark:border-gray-700" aria-labelledby="ai-description-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="ai-description-heading" className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" aria-hidden="true" />
            AI Description Generator
          </h2>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Hide Options' : 'Show Options'}
          </button>
        </div>

        {/* AI Options Panel */}
        {isExpanded && (
          <div className="mb-4 space-y-4 animate-in slide-in-from-top-2 duration-200" role="region" aria-label="AI generation options">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fill in the product details above, then click Generate to create a compelling description using AI.
            </p>
          </div>
        )}

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerateDescription}
          disabled={loading || !formData.name.trim()}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
          <div className="mt-4 flex items-center gap-3 text-gray-600 dark:text-gray-400" role="status" aria-live="polite">
            <div className="flex gap-1" aria-hidden="true">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span>Creating compelling description with AI...</span>
          </div>
        )}

        {/* Generated Description Preview */}
        {showAiOptions && generatedDescription && (
          <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300" role="alert" aria-live="polite">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap mb-4">
                {generatedDescription}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAcceptDescription}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700"
                >
                  <Check className="w-4 h-4" aria-hidden="true" />
                  Accept
                </button>
                <button
                  type="button"
                  onClick={handleRejectDescription}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700"
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
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700" aria-labelledby="description-heading">
        <h2 id="description-heading" className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Product Description
        </h2>
        <textarea
          id="product-description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter or generate a compelling product description..."
          rows={6}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
          aria-describedby="description-help"
        />
        <p id="description-help" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          You can edit this description manually or use AI to generate one.
        </p>
      </section>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Save Product
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
