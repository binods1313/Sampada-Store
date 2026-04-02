import { useState } from 'react'
import AdminLayout from '@/components/Admin/AdminLayout'
import StatusBadge from '@/components/Admin/StatusBadge'
import { useAdminData } from '@/hooks/useAdminData'
import { useToast } from '@/components/Admin/Toast'
import { getClient } from '@/lib/sanity'
import Link from 'next/link'

export default function CategoriesList() {
  const { data: categories, loading } = useAdminData('*[_type == "category"] | order(sortOrder asc)')
  const { data: products } = useAdminData('*[_type == "product"]{_id, category}')
  const toast = useToast()
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true, sortOrder: 0 })

  // Calculate product count per category
  const getProductCount = (categoryId) => {
    if (!products) return 0
    return products.filter(p => p.category?._ref === categoryId).length
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const client = getClient('admin')
      
      if (editingId) {
        // Update existing category
        await client.patch(editingId).set({
          name: formData.name,
          description: formData.description,
          isActive: formData.isActive,
          sortOrder: formData.sortOrder
        }).commit()
        toast.success('Category updated successfully')
      } else {
        // Create new category
        const category = {
          _type: 'category',
          name: formData.name,
          description: formData.description,
          isActive: formData.isActive,
          sortOrder: formData.sortOrder || 0,
          slug: {
            _type: 'slug',
            current: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          }
        }
        await client.create(category)
        toast.success('Category created successfully')
      }
      
      // Reset and close
      setEditingId(null)
      setFormData({ name: '', description: '', isActive: true, sortOrder: 0 })
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Failed to save category')
    }
  }

  // Handle edit
  const handleEdit = (category) => {
    setEditingId(category._id)
    setFormData({
      name: category.name || '',
      description: category.description || '',
      isActive: category.isActive ?? true,
      sortOrder: category.sortOrder || 0
    })
  }

  // Handle delete
  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return
    
    try {
      const client = getClient('admin')
      await client.delete(id)
      toast.success('Category deleted successfully')
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  // Handle cancel
  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: '', description: '', isActive: true, sortOrder: 0 })
  }

  return (
    <AdminLayout title="Categories">
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '0 0 4px 0' }}>
            Categories
          </h2>
          <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
            {categories?.length || 0} {categories?.length === 1 ? 'category' : 'categories'}
          </p>
        </div>
        <button
          onClick={() => setEditingId('new')}
          style={{
            padding: '10px 18px',
            background: 'linear-gradient(135deg, #C9A84C, #a8882e)',
            border: 'none',
            borderRadius: '8px',
            color: '#0f0f0f',
            fontSize: '13px',
            fontWeight: '700',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          ＋ Add Category
        </button>
      </div>

      {/* Edit/Create Modal */}
      {(editingId || editingId === 'new') && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
          onClick={handleCancel}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '500px',
              background: '#1a1a1a',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6)'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '0 0 24px 0' }}>
              {editingId === 'new' ? 'Add New Category' : 'Edit Category'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  fontSize: '11px',
                  color: '#777',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: '600',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Men's Clothing"
                  style={{
                    width: '100%',
                    background: '#0f0f0f',
                    border: '1.5px solid rgba(201,168,76,0.2)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = '#C9A84C'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  fontSize: '11px',
                  color: '#777',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: '600',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category"
                  rows={3}
                  style={{
                    width: '100%',
                    background: '#0f0f0f',
                    border: '1.5px solid rgba(201,168,76,0.2)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  onFocus={e => e.target.style.borderColor = '#C9A84C'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  fontSize: '11px',
                  color: '#777',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: '600',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  style={{
                    width: '100%',
                    background: '#0f0f0f',
                    border: '1.5px solid rgba(201,168,76,0.2)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = '#C9A84C'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
                />
                <p style={{ fontSize: '11px', color: '#666', marginTop: '6px' }}>
                  Lower numbers appear first
                </p>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#fff'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ cursor: 'pointer' }}
                  />
                  Active (visible on store)
                </label>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'linear-gradient(135deg, #C9A84C, #a8882e)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#0f0f0f',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {editingId === 'new' ? 'Create Category' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    borderRadius: '8px',
                    color: '#C9A84C',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div style={{
        background: '#1a1a1a',
        border: '1px solid rgba(201,168,76,0.12)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr 2fr 100px 120px 120px',
          gap: '16px',
          padding: '14px 20px',
          background: 'rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          fontSize: '11px',
          fontWeight: '700',
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          <div>Order</div>
          <div>Name</div>
          <div>Description</div>
          <div>Products</div>
          <div>Status</div>
          <div></div>
        </div>

        {/* Table Body */}
        {loading ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666' }}>
            Loading categories...
          </div>
        ) : !categories || categories.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666' }}>
            No categories yet. Click "Add Category" to create one.
          </div>
        ) : (
          categories.map((category, index) => (
            <div
              key={category._id}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 2fr 100px 120px 120px',
                gap: '16px',
                padding: '14px 20px',
                borderBottom: index < categories.length - 1 ? '1px solid rgba(201,168,76,0.06)' : 'none',
                transition: 'all 0.15s ease',
                alignItems: 'center'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(201,168,76,0.05)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {/* Sort Order */}
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#C9A84C'
              }}>
                {category.sortOrder || index + 1}
              </div>

              {/* Name */}
              <div style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#fff'
              }}>
                {category.name}
              </div>

              {/* Description */}
              <div style={{
                fontSize: '13px',
                color: '#888',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {category.description || '—'}
              </div>

              {/* Product Count */}
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#fff'
              }}>
                {getProductCount(category._id)}
              </div>

              {/* Status */}
              <div>
                <StatusBadge status={category.isActive ? 'active' : 'archived'} />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleEdit(category)}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    borderRadius: '6px',
                    color: '#C9A84C',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category._id, category.name)}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(139,26,26,0.1)',
                    border: '1px solid rgba(139,26,26,0.3)',
                    borderRadius: '6px',
                    color: '#ff6b6b',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  )
}
