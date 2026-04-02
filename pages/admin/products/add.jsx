/**
 * Admin - Add New Product Page
 *
 * Features:
 * - ProductForm with AI description generator
 * - Sanity CMS integration
 * - Image upload support
 * - Toast notifications
 * - AdminLayout integration
 */

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '@/components/Admin/Toast';
import AdminLayout from '@/components/Admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { getClient } from '@/lib/sanity';

const AddProductPage = () => {
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (formData) => {
    setIsSubmitting(true);

    try {
      const client = getClient('admin');
      
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
        // Store category as plain string (not reference) for simplicity
        category: formData.category || undefined,
        price: parseFloat(formData.price) || 0,
        features: formData.features || [],
        targetAudience: formData.targetAudience,
        keywords: formData.keywords || [],
        inventory: 0, // Default to 0, admin can update later
        isActive: true,
      };

      const result = await client.create(product);
      
      console.log('Product created:', result);
      
      toast.success('Product created successfully!');
      
      // Navigate to products list or edit page
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [router, toast]);

  return (
    <AdminLayout title="Add Product">
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: '0 0 6px 0' }}>
          Add New Product
        </h1>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
          Create a new product with AI-powered description generation
        </p>
      </div>

      {/* Product Form */}
      <ProductForm onSubmit={handleSubmit} />
    </AdminLayout>
  );
};

export default AddProductPage;
