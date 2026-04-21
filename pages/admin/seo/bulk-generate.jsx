/**
 * Admin - Bulk SEO Generator
 * 
 * Features:
 * - Generate meta descriptions for all products at once
 * - Generate SEO titles, meta keywords, and slugs
 * - Progress tracking with batch processing
 * - Preview before applying changes
 * - Export/import SEO data
 * - AI-powered content generation with rate limiting
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAIGeneration } from '@/hooks/useAI';
import { client } from '@/lib/sanity';
import toast from 'react-hot-toast';
import {
  Sparkles,
  Loader2,
  Check,
  X,
  Download,
  Upload,
  Eye,
  Save,
  RefreshCw,
  Search,
  FileText,
  Tag,
  Link,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

// SEO Generation Types
const SEO_TYPES = [
  { value: 'meta-description', label: 'Meta Description', icon: FileText, description: '150-160 character descriptions for search engines' },
  { value: 'seo-title', label: 'SEO Title', icon: Search, description: 'Optimized page titles (50-60 characters)' },
  { value: 'meta-keywords', label: 'Meta Keywords', icon: Tag, description: 'Relevant keywords for each product' },
  { value: 'slug', label: 'URL Slug', icon: Link, description: 'SEO-friendly URL slugs' },
];

export default function BulkSEOGeneratorPage() {
  return (
    <AdminLayout title="Bulk SEO Generator">
      <BulkSEOContent />
    </AdminLayout>
  );
}

function BulkSEOContent() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('meta-description');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' });
  const [generatedSEO, setGeneratedSEO] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [appliedCount, setAppliedCount] = useState(0);
  const [error, setError] = useState(null);

  const { generate, loading: aiLoading, data: aiData } = useAIGeneration({
    tier: 2, // Use faster model for bulk operations
    enableModelFallback: true,
  });

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await client.fetch(`
          *[_type == "product"]{
            _id,
            name,
            description,
            "category": category->name,
            price,
            keywords,
            slug,
            "metaDescription": metaDescription,
            "seoTitle": seoTitle
          }
        `);
        setProducts(productList);
      } catch (err) {
        console.error('Error fetching products:', err);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Generate SEO content for a single product
  const generateSEOForProduct = useCallback(async (product, type) => {
    const prompts = {
      'meta-description': `Write a compelling meta description for this e-commerce product (150-160 characters):
Product: ${product.name}
Category: ${product.category || 'General'}
Description: ${product.description?.substring(0, 200) || 'No description'}
Price: ₹${product.price || 0}
Keywords: ${(product.keywords || []).join(', ')}

Rules:
- Must be 150-160 characters exactly
- Include main keyword
- Add a call-to-action
- Make it compelling for clicks`,

      'seo-title': `Write an SEO-optimized title for this product (50-60 characters):
Product: ${product.name}
Category: ${product.category || 'General'}
Price: ₹${product.price || 0}

Rules:
- Must be 50-60 characters
- Include product name and category
- Add price if it fits
- Make it click-worthy`,

      'meta-keywords': `Generate 8-12 relevant SEO keywords for this product (comma-separated):
Product: ${product.name}
Category: ${product.category || 'General'}
Description: ${product.description?.substring(0, 200) || 'No description'}

Rules:
- 8-12 keywords only
- Mix of short-tail and long-tail
- Include product variations
- No brand names unless specified`,

      'slug': `Create an SEO-friendly URL slug for this product:
Product: ${product.name}
Category: ${product.category || 'General'}

Rules:
- lowercase-with-hyphens
- Include main product keyword
- Keep it under 60 characters
- Remove stop words (a, an, the, etc.)`,
    };

    const result = await generate('seo', prompts[type], {
      keywords: product.keywords || [],
      contentType: type,
    });

    return result.trim();
  }, [generate]);

  // Bulk generate SEO content
  const handleBulkGenerate = useCallback(async () => {
    if (products.length === 0) {
      toast.error('No products found');
      return;
    }

    setIsGenerating(true);
    setProgress({ current: 0, total: products.length, status: 'Starting...' });
    setGeneratedSEO([]);
    setError(null);

    const results = [];
    const batchSize = 5; // Process 5 products at a time to avoid rate limits

    try {
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        setProgress({ 
          current: i, 
          total: products.length, 
          status: `Processing batch ${Math.floor(i / batchSize) + 1}...` 
        });

        const batchResults = await Promise.allSettled(
          batch.map(async (product) => {
            try {
              const seoContent = await generateSEOForProduct(product, selectedType);
              return {
                product,
                seoContent,
                status: 'success',
              };
            } catch (err) {
              return {
                product,
                seoContent: null,
                status: 'error',
                error: err.message,
              };
            }
          })
        );

        batchResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          }
        });

        // Small delay between batches to respect rate limits
        if (i + batchSize < products.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setGeneratedSEO(results);
      setProgress({ 
        current: products.length, 
        total: products.length, 
        status: 'Complete!' 
      });

      const successCount = results.filter(r => r.status === 'success').length;
      const errorCount = results.filter(r => r.status === 'error').length;

      toast.success(`Generated SEO for ${successCount} products${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
      setShowPreview(true);
    } catch (err) {
      console.error('Bulk generation error:', err);
      setError(err.message);
      toast.error('Failed to generate SEO content');
    } finally {
      setIsGenerating(false);
    }
  }, [products, selectedType, generateSEOForProduct]);

  // Apply SEO content to a single product
  const applyToProduct = useCallback(async (productId, seoContent, type) => {
    try {
      const fieldMap = {
        'meta-description': 'metaDescription',
        'seo-title': 'seoTitle',
        'meta-keywords': 'metaKeywords',
        'slug': 'slug',
      };

      const fieldName = fieldMap[type];

      if (type === 'slug') {
        await client.patch(productId).set({
          slug: { _type: 'slug', current: seoContent }
        }).commit();
      } else {
        await client.patch(productId).set({
          [fieldName]: seoContent
        }).commit();
      }

      toast.success('SEO content applied!');
      setAppliedCount(prev => prev + 1);
    } catch (err) {
      console.error('Error applying SEO:', err);
      toast.error('Failed to apply SEO content');
    }
  }, []);

  // Apply all SEO content
  const applyAllSEO = useCallback(async () => {
    const successItems = generatedSEO.filter(item => item.status === 'success');
    
    for (const item of successItems) {
      await applyToProduct(item.product._id, item.seoContent, selectedType);
    }

    toast.success(`Applied SEO to ${successItems.length} products!`);
    setAppliedCount(successItems.length);
  }, [generatedSEO, selectedType, applyToProduct]);

  // Export SEO data as CSV
  const exportSEOData = useCallback(() => {
    const headers = ['Product Name', 'Category', 'Price', 'SEO Content', 'Type'];
    const rows = generatedSEO
      .filter(item => item.status === 'success')
      .map(item => [
        item.product.name,
        item.product.category || '',
        item.product.price || 0,
        `"${item.seoContent}"`,
        selectedType,
      ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-export-${selectedType}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('SEO data exported!');
  }, [generatedSEO, selectedType]);

  // Calculate stats
  const stats = {
    total: products.length,
    generated: generatedSEO.filter(r => r.status === 'success').length,
    errors: generatedSEO.filter(r => r.status === 'error').length,
    applied: appliedCount,
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: 'var(--admin-space-4, 16px)'
      }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--admin-gold, #C9A84C)' }} />
        <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary, #888888)' }}>Loading products...</p>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--admin-space-6, 24px)' }}>
        <h1 className="admin-heading" style={{ margin: '0 0 var(--admin-space-2, 8px) 0', fontSize: '28px', fontWeight: '700', color: 'var(--admin-text-primary, #ffffff)' }}>
          Bulk SEO Generator
        </h1>
        <p className="admin-text-secondary" style={{ margin: 0, fontSize: '14px', color: 'var(--admin-text-secondary, #888888)' }}>
          Generate SEO-optimized content for all products using AI
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--admin-space-4, 16px)',
        marginBottom: 'var(--admin-space-6, 24px)'
      }}>
        <div style={{
          backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
          borderRadius: 'var(--admin-radius-xl, 12px)',
          padding: 'var(--admin-space-5, 20px)',
          border: '1px solid var(--admin-gold-border, rgba(201, 168, 76, 0.12))'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary, #888888)', marginBottom: 'var(--admin-space-2, 8px)' }}>Total Products</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--admin-text-primary, #ffffff)' }}>{stats.total}</div>
        </div>
        <div style={{
          backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
          borderRadius: 'var(--admin-radius-xl, 12px)',
          padding: 'var(--admin-space-5, 20px)',
          border: '1px solid var(--admin-gold-border, rgba(201, 168, 76, 0.12))'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary, #888888)', marginBottom: 'var(--admin-space-2, 8px)' }}>Generated</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--admin-gold, #C9A84C)' }}>{stats.generated}</div>
        </div>
        <div style={{
          backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
          borderRadius: 'var(--admin-radius-xl, 12px)',
          padding: 'var(--admin-space-5, 20px)',
          border: '1px solid var(--admin-gold-border, rgba(201, 168, 76, 0.12))'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary, #888888)', marginBottom: 'var(--admin-space-2, 8px)' }}>Errors</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--admin-error-text, #ff6b6b)' }}>{stats.errors}</div>
        </div>
        <div style={{
          backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
          borderRadius: 'var(--admin-radius-xl, 12px)',
          padding: 'var(--admin-space-5, 20px)',
          border: '1px solid var(--admin-gold-border, rgba(201, 168, 76, 0.12))'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary, #888888)', marginBottom: 'var(--admin-space-2, 8px)' }}>Applied</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--admin-success, #2d7a2d)' }}>{stats.applied}</div>
        </div>
      </div>

      {/* SEO Type Selector */}
      <section style={{
        backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
        borderRadius: 'var(--admin-radius-xl, 12px)',
        padding: 'var(--admin-space-6, 24px)',
        marginBottom: 'var(--admin-space-6, 24px)',
        border: '1px solid var(--admin-gold-border, rgba(201, 168, 76, 0.12))'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary, #ffffff)', marginBottom: 'var(--admin-space-4, 16px)' }}>
          What would you like to generate?
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--admin-space-3, 12px)'
        }}>
          {SEO_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                style={{
                  padding: 'var(--admin-space-4, 16px)',
                  backgroundColor: selectedType === type.value ? 'var(--admin-bg-selected, rgba(201, 168, 76, 0.15))' : 'var(--admin-surface-1, #141414)',
                  border: `2px solid ${selectedType === type.value ? 'var(--admin-gold, #C9A84C)' : 'var(--admin-bg-selected, rgba(201, 168, 76, 0.15))'}`,
                  borderRadius: 'var(--admin-radius-lg, 10px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  display: 'flex',
                  gap: 'var(--admin-space-3, 12px)',
                  alignItems: 'flex-start',
                }}
                onMouseEnter={(e) => {
                  if (selectedType !== type.value) {
                    e.target.style.borderColor = 'var(--admin-gold-border-strong, rgba(201, 168, 76, 0.3))';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedType !== type.value) {
                    e.target.style.borderColor = 'var(--admin-bg-selected, rgba(201, 168, 76, 0.15))';
                  }
                }}
              >
                <Icon className="w-6 h-6" style={{ color: 'var(--admin-gold, #C9A84C)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-text-primary, #ffffff)', marginBottom: 'var(--admin-space-1, 4px)' }}>
                    {type.label}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary, #888888)' }}>
                    {type.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Generate Button */}
      <div style={{ marginBottom: 'var(--admin-space-6, 24px)', display: 'flex', gap: 'var(--admin-space-3, 12px)', flexWrap: 'wrap' }}>
        <button
          onClick={handleBulkGenerate}
          disabled={isGenerating || products.length === 0}
          style={{
            padding: '14px 28px',
            background: isGenerating || products.length === 0
              ? 'rgba(201, 168, 76, 0.3)'
              : 'linear-gradient(135deg, var(--admin-gold, #C9A84C) 0%, var(--admin-gold-active, #a8882e) 100%)',
            color: 'var(--admin-text-primary, #ffffff)',
            fontWeight: '600',
            fontSize: '15px',
            borderRadius: 'var(--admin-radius-lg, 10px)',
            border: 'none',
            boxShadow: isGenerating || products.length === 0 ? 'none' : 'var(--admin-shadow-gold, 0 4px 16px rgba(201, 168, 76, 0.4))',
            cursor: isGenerating || products.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--admin-space-2, 10px)',
            transition: 'all 0.2s',
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              ✨ Generate SEO for {products.length} Products
            </>
          )}
        </button>

        {showPreview && generatedSEO.length > 0 && (
          <>
            <button
              onClick={applyAllSEO}
              style={{
                padding: '14px 28px',
                backgroundColor: 'var(--admin-success, #2d7a2d)',
                color: 'var(--admin-text-primary, #ffffff)',
                fontWeight: '600',
                fontSize: '15px',
                borderRadius: 'var(--admin-radius-lg, 10px)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--admin-space-2, 10px)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#3d8a3d'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--admin-success, #2d7a2d)'}
            >
              <Save className="w-5 h-5" />
              Apply All to Sanity
            </button>

            <button
              onClick={exportSEOData}
              style={{
                padding: '14px 28px',
                backgroundColor: 'var(--admin-surface-5, #2a2a2a)',
                color: 'var(--admin-gold, #C9A84C)',
                fontWeight: '600',
                fontSize: '15px',
                borderRadius: 'var(--admin-radius-lg, 10px)',
                border: '1px solid var(--admin-gold-border-strong, rgba(201, 168, 76, 0.3))',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--admin-space-2, 10px)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#333333';
                e.target.style.borderColor = 'var(--admin-gold, #C9A84C)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--admin-surface-5, #2a2a2a)';
                e.target.style.borderColor = 'var(--admin-gold-border-strong, rgba(201, 168, 76, 0.3))';
              }}
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </>
        )}
      </div>

      {/* Progress Bar */}
      {isGenerating && (
        <div style={{ marginBottom: 'var(--admin-space-6, 24px)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--admin-space-2, 8px)',
            fontSize: '13px',
            color: 'var(--admin-text-secondary, #888888)'
          }}>
            <span>{progress.status}</span>
            <span>{progress.current} / {progress.total}</span>
          </div>
          <div style={{
            height: '8px',
            backgroundColor: 'var(--admin-surface-1, #141414)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${(progress.current / progress.total) * 100}%`,
              background: 'linear-gradient(90deg, var(--admin-gold, #C9A84C), var(--admin-gold-active, #a8882e))',
              transition: 'width 0.3s',
            }} />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          marginBottom: 'var(--admin-space-6, 24px)',
          padding: 'var(--admin-space-4, 16px)',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          borderRadius: 'var(--admin-radius-lg, 10px)',
          display: 'flex',
          gap: 'var(--admin-space-3, 12px)',
          alignItems: 'flex-start',
        }}>
          <AlertCircle className="w-5 h-5" style={{ color: 'var(--admin-error-text, #ff6b6b)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-error-text, #ff6b6b)', marginBottom: 'var(--admin-space-1, 4px)' }}>
              Generation Error
            </div>
            <div style={{ fontSize: '13px', color: 'var(--admin-text-secondary, #888888)' }}>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {showPreview && generatedSEO.length > 0 && (
        <section style={{
          backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
          borderRadius: 'var(--admin-radius-xl, 12px)',
          padding: 'var(--admin-space-6, 24px)',
          border: '1px solid var(--admin-gold-border, rgba(201, 168, 76, 0.12))'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--admin-space-5, 20px)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary, #ffffff)', display: 'flex', alignItems: 'center', gap: 'var(--admin-space-2, 8px)' }}>
              <Eye className="w-5 h-5" style={{ color: 'var(--admin-gold, #C9A84C)' }} />
              Preview Generated SEO Content
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary, #888888)' }}>
              {generatedSEO.filter(r => r.status === 'success').length} / {generatedSEO.length} successful
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-4, 16px)' }}>
            {generatedSEO.map((item, index) => (
              <div
                key={item.product._id}
                style={{
                  padding: 'var(--admin-space-4, 16px)',
                  backgroundColor: item.status === 'success' ? 'var(--admin-surface-1, #141414)' : 'rgba(255, 107, 107, 0.05)',
                  border: `1px solid ${item.status === 'success' ? 'var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))' : 'rgba(255, 107, 107, 0.3)'}`,
                  borderRadius: 'var(--admin-radius-lg, 10px)',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'var(--admin-space-3, 12px)'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-text-primary, #ffffff)', marginBottom: 'var(--admin-space-1, 4px)' }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary, #888888)' }}>
                      {item.product.category || 'No category'} • ₹{item.product.price || 0}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--admin-space-2, 8px)' }}>
                    {item.status === 'success' ? (
                      <CheckCircle className="w-5 h-5" style={{ color: 'var(--admin-success, #2d7a2d)' }} />
                    ) : (
                      <AlertCircle className="w-5 h-5" style={{ color: 'var(--admin-error-text, #ff6b6b)' }} />
                    )}
                    {item.status === 'success' && (
                      <button
                        onClick={() => applyToProduct(item.product._id, item.seoContent, selectedType)}
                        style={{
                          padding: 'var(--admin-space-1, 6px) var(--admin-space-3, 12px)',
                          backgroundColor: 'var(--admin-success, #2d7a2d)',
                          color: 'var(--admin-text-primary, #ffffff)',
                          fontSize: '12px',
                          fontWeight: '600',
                          borderRadius: 'var(--admin-radius-sm, 6px)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--admin-space-1, 4px)',
                        }}
                      >
                        <Save className="w-3 h-3" />
                        Apply
                      </button>
                    )}
                  </div>
                </div>

                {item.status === 'success' ? (
                  <div style={{
                    padding: 'var(--admin-space-3, 12px)',
                    backgroundColor: 'var(--admin-surface-0, #0f0f0f)',
                    borderRadius: 'var(--admin-radius-md, 8px)',
                    fontSize: '13px',
                    color: '#e0e0e0',
                    lineHeight: '1.5',
                  }}>
                    {item.seoContent}
                  </div>
                ) : (
                  <div style={{
                    padding: 'var(--admin-space-3, 12px)',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderRadius: 'var(--admin-radius-md, 8px)',
                    fontSize: '13px',
                    color: 'var(--admin-error-text, #ff6b6b)',
                  }}>
                    Error: {item.error || 'Failed to generate'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
