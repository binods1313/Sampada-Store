/**
 * Admin - Edit Existing Product Page
 *
 * Features:
 * - Load existing product from Sanity CMS
 * - Pre-fill ProductForm with product data
 * - AI description regeneration
 * - Update product in Sanity
 * - Toast notifications
 * - AdminLayout integration
 * - Loading states and error handling
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '@/components/Admin/Toast';
import AdminLayout from '@/components/Admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { client } from '@/lib/sanity';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

export default function EditProductPage() {
  return (
    <AdminLayout title="Edit Product">
      <EditProductContent />
    </AdminLayout>
  );
}

function EditProductContent() {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product from Sanity
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const productData = await client.fetch(
          `*[_type == "product" && _id == $id][0]{
            _id,
            name,
            description,
            "category": category->name,
            price,
            features,
            targetAudience,
            keywords,
            slug,
            inventory,
            isActive
          }`,
          { id }
        );

        if (!productData) {
          setError('Product not found');
          toast.error('Product not found');
          return;
        }

        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  // Handle form submission
  const handleSubmit = useCallback(async (formData) => {
    setIsSubmitting(true);

    try {
      // Generate slug if name changed
      const baseSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // Check for existing slug (excluding current product)
      const existingSlug = await client.fetch(
        `*[_type == "product" && slug.current == $slug && _id != $id][0].slug.current`,
        { slug: baseSlug, id }
      );

      const finalSlug = existingSlug
        ? `${baseSlug}-${Date.now().toString(36)}`
        : baseSlug;

      // Update product document in Sanity
      const updatedProduct = {
        _type: 'product',
        name: formData.name,
        slug: {
          _type: 'slug',
          current: finalSlug || product?.slug?.current,
        },
        description: formData.description,
        category: formData.category ? {
          _type: 'reference',
          _ref: formData.category,
        } : undefined,
        price: parseFloat(formData.price) || 0,
        features: formData.features || [],
        targetAudience: formData.targetAudience,
        keywords: formData.keywords || [],
      };

      const result = await client.patch(id).set(updatedProduct).commit();
      console.log('Product updated:', result);
      
      toast.success('Product updated successfully!');
      
      // Optionally redirect back to products list
      // router.push('/admin/products');
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [id, product, toast]);

  // Loading state
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
        <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary, #888888)' }}>Loading product...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: 'var(--admin-space-4, 16px)',
        backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
        borderRadius: 'var(--admin-radius-xl, 12px)',
        padding: 'var(--admin-space-8, 32px)',
        border: '1px solid rgba(255, 107, 107, 0.2)'
      }}>
        <AlertCircle className="w-12 h-12" style={{ color: 'var(--admin-error-text, #ff6b6b)' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary, #ffffff)', margin: 0 }}>
          Error Loading Product
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary, #888888)', textAlign: 'center' }}>
          {error}
        </p>
        <button
          onClick={() => router.push('/admin/products')}
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--admin-gold, #C9A84C)',
            color: 'var(--admin-text-primary, #ffffff)',
            fontWeight: '600',
            fontSize: '14px',
            borderRadius: 'var(--admin-radius-md, 8px)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--admin-space-2, 8px)',
            transition: 'all 0.2s',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
      </div>
    );
  }

  // No product found
  if (!product) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: 'var(--admin-space-4, 16px)'
      }}>
        <AlertCircle className="w-12 h-12" style={{ color: 'var(--admin-error-text, #ff6b6b)' }} />
        <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary, #888888)' }}>Product not found</p>
        <button
          onClick={() => router.push('/admin/products')}
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--admin-gold, #C9A84C)',
            color: 'var(--admin-text-primary, #ffffff)',
            fontWeight: '600',
            fontSize: '14px',
            borderRadius: 'var(--admin-radius-md, 8px)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--admin-space-2, 8px)',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--admin-space-6, 24px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-3, 12px)', marginBottom: 'var(--admin-space-3, 12px)' }}>
          <button
            onClick={() => router.push('/admin/products')}
            style={{
              padding: 'var(--admin-space-2, 8px) var(--admin-space-3, 12px)',
              backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
              color: 'var(--admin-text-secondary, #888888)',
              border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
              borderRadius: 'var(--admin-radius-sm, 6px)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--admin-space-1, 6px)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--admin-surface-5, #2a2a2a)';
              e.target.style.color = 'var(--admin-text-primary, #ffffff)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--admin-surface-2, #1a1a1a)';
              e.target.style.color = 'var(--admin-text-secondary, #888888)';
            }}
            aria-label="Back to products list"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        <h1 className="admin-heading" style={{ margin: '0 0 var(--admin-space-2, 8px) 0', fontSize: '28px', fontWeight: '700', color: 'var(--admin-text-primary, #ffffff)' }}>
          Edit Product
        </h1>
        <p className="admin-text-secondary" style={{ margin: 0, fontSize: '14px', color: 'var(--admin-text-secondary, #888888)' }}>
          Update product details and regenerate descriptions with AI
        </p>
        {product.name && (
          <div style={{
            marginTop: 'var(--admin-space-3, 12px)',
            padding: 'var(--admin-space-2, 8px) var(--admin-space-3, 12px)',
            backgroundColor: 'var(--admin-bg-selected, rgba(201, 168, 76, 0.1))',
            borderRadius: 'var(--admin-radius-sm, 6px)',
            display: 'inline-block',
            border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))'
          }}>
            <span style={{ fontSize: '13px', color: 'var(--admin-gold, #C9A84C)', fontWeight: '500' }}>
              Currently editing: <strong>{product.name}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Product Form */}
      <ProductForm 
        initialData={{
          name: product.name || '',
          description: product.description || '',
          category: product.category || '',
          price: product.price || '',
          features: product.features || [],
          targetAudience: product.targetAudience || '',
          keywords: product.keywords || [],
        }} 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </>
  );
}
