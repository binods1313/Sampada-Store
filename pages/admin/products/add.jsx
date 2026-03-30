/**
 * Admin - Add New Product Page
 * 
 * Features:
 * - ProductForm with AI description generator
 * - Sanity CMS integration
 * - Image upload support
 * - Toast notifications
 */

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import ProductForm from '@/components/admin/ProductForm';
import toast from 'react-hot-toast';
import { getClient } from '@/lib/sanity';

const AddProductPage = () => {
  const router = useRouter();
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
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Add New Product
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create a new product with AI-powered description generation
          </p>
        </div>

        {/* Product Form */}
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AddProductPage;
