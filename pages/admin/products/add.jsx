/**
 * Admin - Add New Product Page
 *
 * Features:
 * - ProductForm with AI description generator
 * - AI Image Generator (Pollinations.ai + Stability AI)
 * - Sanity CMS integration
 * - Image upload support
 * - Toast notifications
 * - AdminLayout integration
 */

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '@/components/admin/Toast';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { client } from '@/lib/sanity';

export default function AddProductPage() {
  return (
    <AdminLayout title="Add Product">
      <AddProductContent />
    </AdminLayout>
  )
}

function AddProductContent() {
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (formData) => {
    setIsSubmitting(true);

    try {
      // Generate unique slug with collision handling
      const baseSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // Check for existing slug
      const existingSlug = await client.fetch(
        `*[_type == "product" && slug.current == $slug][0].slug.current`,
        { slug: baseSlug }
      );

      const finalSlug = existingSlug
        ? `${baseSlug}-${Date.now().toString(36)}`
        : baseSlug;

      // Create product document in Sanity
      const product = {
        _type: 'product',
        name: formData.name,
        slug: {
          _type: 'slug',
          current: finalSlug,
        },
        description: formData.description,
        category: formData.category || undefined,
        price: parseFloat(formData.price) || 0,
        features: formData.features || [],
        targetAudience: formData.targetAudience,
        keywords: formData.keywords || [],
        inventory: 0,
        isActive: true,
      };

      const result = await client.create(product);
      console.log('Product created:', result);
      toast.success('Product created successfully!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [router, toast]);

  return (
    <>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--admin-space-6)' }}>
        <h1 className="admin-heading" style={{ margin: '0 0 var(--admin-space-1) 0' }}>
          Add New Product
        </h1>
        <p className="admin-text-secondary admin-text-sm" style={{ margin: 0 }}>
          Create a new product with AI-powered description and image generation
        </p>
      </div>

      {/* Product Form */}
      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </>
  );
}
