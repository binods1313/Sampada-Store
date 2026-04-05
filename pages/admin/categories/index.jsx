import AdminLayout from '@/components/Admin/AdminLayout'
import StatusBadge from '@/components/Admin/StatusBadge'
import { useAdminData } from '@/hooks/useAdminData'
import { useToast } from '@/components/Admin/Toast'
import { client } from '@/lib/sanity'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import EmptyState from '@/components/admin/EmptyState'
import Breadcrumbs from '@/components/admin/Breadcrumbs'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

// Helper to safely render values that might be Sanity reference objects
const safeValue = (val, fallback = '') => {
  if (val === null || val === undefined) return fallback
  if (typeof val === 'object') {
    return val.name || val.email || val.title || val.amount || val._ref || val.current || String(val) || fallback
  }
  return String(val)
}

export default function CategoriesList() {
  return (
    <AdminLayout title="Categories">
      <CategoriesContent />
    </AdminLayout>
  )
}

function CategoriesContent() {
  const { data: categories, loading } = useAdminData('*[_type == "category"] | order(sortOrder asc)')
  const { data: products } = useAdminData('*[_type == "product"]{_id, category}')
  const toast = useToast()
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true, sortOrder: 0 })
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Categories', current: true }
  ]

  // Escape key handler for modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && editingId) {
        setEditingId(null)
        setFormData({ name: '', description: '', isActive: true, sortOrder: 0 })
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [editingId])

  // Calculate product count per category
  const getProductCount = (categoryId) => {
    if (!products) return 0
    return products.filter(p => p.category?._ref === categoryId).length
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await client.patch(editingId).set({
          name: formData.name,
          description: formData.description,
          isActive: formData.isActive,
          sortOrder: formData.sortOrder
        }).commit()
        toast.success('Category updated successfully')
      } else {
        const category = {
          _type: 'category',
          name: formData.name,
          description: formData.description,
          isActive: formData.isActive,
          sortOrder: formData.sortOrder || 0,
          slug: { _type: 'slug', current: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
        }
        await client.create(category)
        toast.success('Category created successfully')
      }
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
      name: safeValue(category.name, ''),
      description: safeValue(category.description, ''),
      isActive: safeValue(category.isActive, true),
      sortOrder: category.sortOrder || 0
    })
  }

  // Handle delete - opens ConfirmDialog
  const handleDelete = (id, name) => {
    setDeleteConfirm({ id, name })
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return
    try {
      await client.delete(deleteConfirm.id)
      toast.success('Category deleted successfully')
      setDeleteConfirm(null)
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
      <Breadcrumbs items={breadcrumbs} />

      {/* Header - Centered, balanced layout */}
      <div className="categories-header" style={{
        maxWidth: 'var(--admin-content-max-width)',
        margin: '0 auto var(--admin-space-6)',
        padding: '0 var(--admin-space-8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--admin-space-4)'
      }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <h2 className="admin-heading" style={{ margin: '0 0 var(--admin-space-1) 0', fontSize: 'var(--admin-text-2xl)' }}>
            Categories
          </h2>
          <p className="admin-text-secondary admin-text-sm" style={{ margin: 0 }}>
            {categories?.length || 0} {categories?.length === 1 ? 'category' : 'categories'} — manage your product organization
          </p>
        </div>
        <button
          onClick={() => setEditingId('new')}
          className="admin-btn admin-btn-primary"
          style={{
            padding: 'var(--admin-space-3) var(--admin-space-5)',
            fontSize: 'var(--admin-text-sm)',
            gap: 'var(--admin-space-2)',
            whiteSpace: 'nowrap'
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
        }} onClick={handleCancel}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%',
            maxWidth: '500px',
            background: 'var(--admin-surface-2)',
            border: '1px solid var(--admin-border-default)',
            borderRadius: 'var(--admin-radius-xl)',
            padding: 'var(--admin-space-8)',
            boxShadow: 'var(--admin-shadow-lg)'
          }}>
            <h3 style={{ fontSize: 'var(--admin-text-xl)', fontWeight: 'var(--admin-font-bold)', color: 'var(--admin-text-primary)', margin: '0 0 var(--admin-space-6) 0' }}>
              {editingId === 'new' ? 'Add New Category' : 'Edit Category'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 'var(--admin-space-5)' }}>
                <label style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--admin-tracking-wide)', fontWeight: 'var(--admin-font-semibold)', display: 'block', marginBottom: 'var(--admin-space-2)' }}>
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Men's Clothing"
                  className="admin-input"
                />
              </div>
              <div style={{ marginBottom: 'var(--admin-space-5)' }}>
                <label style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--admin-tracking-wide)', fontWeight: 'var(--admin-font-semibold)', display: 'block', marginBottom: 'var(--admin-space-2)' }}>
                  Description
                </label>
                <textarea
                  value={safeValue(formData.description, '')}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category"
                  rows={3}
                  className="admin-input"
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div style={{ marginBottom: 'var(--admin-space-5)' }}>
                <label style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--admin-tracking-wide)', fontWeight: 'var(--admin-font-semibold)', display: 'block', marginBottom: 'var(--admin-space-2)' }}>
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  className="admin-input"
                  style={{ width: '100px' }}
                />
              </div>
              <div style={{ marginBottom: 'var(--admin-space-6)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-2)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--admin-gold)' }}
                  />
                  <span style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                    Active (visible on store)
                  </span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: 'var(--admin-space-3)' }}>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  style={{ flex: 1, padding: 'var(--admin-space-3)' }}
                >
                  {editingId === 'new' ? 'Create Category' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="admin-btn admin-btn-secondary"
                  style={{ flex: 1, padding: 'var(--admin-space-3)' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Table - Centered, balanced layout */}
      <div className="categories-table-wrapper" style={{
        maxWidth: 'var(--admin-content-max-width)',
        margin: '0 auto',
        padding: '0 var(--admin-space-8)'
      }}>
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Table Header */}
          <div className="categories-table-header" style={{
            display: 'grid',
            gridTemplateColumns: '50px 150px minmax(200px, 1fr) 80px 100px 140px',
            gap: 'var(--admin-space-4)',
            padding: 'var(--admin-space-3) var(--admin-space-5)',
            background: 'var(--admin-surface-1)',
            borderBottom: 'var(--admin-border-width-sm) solid var(--admin-border-subtle)',
            fontSize: 'var(--admin-text-xs)',
            fontWeight: 'var(--admin-font-bold)',
            color: 'var(--admin-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--admin-tracking-wide)'
          }}>
            <div>Order</div>
            <div>Name</div>
            <div>Description</div>
            <div>Products</div>
            <div>Status</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          {/* Table Body */}
          {loading ? (
            <div style={{ padding: 'var(--admin-space-12)', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
              Loading categories...
            </div>
          ) : !categories || categories.length === 0 ? (
            <EmptyState
              title="No categories yet"
              description="Get started by creating your first product category"
              actionLabel="Add Category"
              onAction={() => { setEditingId('new'); setFormData({ name: '', description: '', isActive: true, sortOrder: 0 }) }}
            />
          ) : (
            <>
              {/* Active Categories */}
              {categories.filter(c => c.isActive !== false).map((category, index) => (
                <div
                  key={category._id}
                  className="categories-table-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 150px minmax(200px, 1fr) 80px 100px 140px',
                    gap: 'var(--admin-space-4)',
                    padding: 'var(--admin-space-4) var(--admin-space-5)',
                    borderBottom: 'var(--admin-border-width-sm) solid var(--admin-border-ghost)',
                    transition: 'var(--admin-transition-fast)',
                    alignItems: 'center'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--admin-bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontSize: 'var(--admin-text-sm)', fontWeight: 'var(--admin-font-medium)', color: 'var(--admin-gold)' }}>
                    {category.sortOrder || index + 1}
                  </div>
                  <div style={{ fontSize: 'var(--admin-text-md)', fontWeight: 'var(--admin-font-bold)', color: 'var(--admin-text-primary)' }}>
                    {safeValue(category.name, 'Untitled')}
                  </div>
                  <div className="categories-description" style={{
                    fontSize: 'var(--admin-text-sm)',
                    color: 'var(--admin-text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '300px'
                  }}>
                    {safeValue(category.description, '—')}
                  </div>
                  <div style={{ fontSize: 'var(--admin-text-sm)', fontWeight: 'var(--admin-font-semibold)', color: 'var(--admin-text-primary)', textAlign: 'center' }}>
                    {getProductCount(category._id)}
                  </div>
                  <div>
                    <StatusBadge
                      status={safeValue(category.isActive, true) ? 'active' : 'draft'}
                      label={safeValue(category.isActive, true) ? 'Active' : 'Inactive'}
                      color={safeValue(category.isActive, true) ? '#4ade80' : '#888'}
                    />
                  </div>
                  <div className="categories-actions" style={{ display: 'flex', gap: 'var(--admin-space-2)', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleEdit(category)}
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: 'var(--admin-space-1)', minWidth: '32px', height: '32px', justifyContent: 'center' }}
                      title="Edit category"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(category._id, safeValue(category.name, 'category'))}
                      className="admin-btn admin-btn-danger"
                      style={{ padding: 'var(--admin-space-1)', minWidth: '32px', height: '32px', justifyContent: 'center' }}
                      title="Delete category"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}

              {/* Inactive/Archived Categories - Visually separated */}
              {categories.filter(c => c.isActive === false).length > 0 && (
                <>
                  <div style={{
                    padding: 'var(--admin-space-3) var(--admin-space-5)',
                    background: 'var(--admin-surface-1)',
                    borderTop: 'var(--admin-border-width-sm) solid var(--admin-border-subtle)',
                    fontSize: 'var(--admin-text-xs)',
                    fontWeight: 'var(--admin-font-bold)',
                    color: 'var(--admin-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--admin-tracking-wide)'
                  }}>
                    Archived ({categories.filter(c => c.isActive === false).length})
                  </div>
                  {categories.filter(c => c.isActive === false).map((category, index) => (
                    <div
                      key={category._id}
                      className="categories-table-row categories-table-row-archived"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '50px 150px minmax(200px, 1fr) 80px 100px 140px',
                        gap: 'var(--admin-space-4)',
                        padding: 'var(--admin-space-4) var(--admin-space-5)',
                        borderBottom: 'var(--admin-border-width-sm) solid var(--admin-border-ghost)',
                        transition: 'var(--admin-transition-fast)',
                        alignItems: 'center',
                        opacity: 0.5
                      }}
                    >
                      <div style={{ fontSize: 'var(--admin-text-sm)', fontWeight: 'var(--admin-font-medium)', color: 'var(--admin-text-muted)' }}>
                        {category.sortOrder || index + 1}
                      </div>
                      <div style={{ fontSize: 'var(--admin-text-md)', fontWeight: 'var(--admin-font-bold)', color: 'var(--admin-text-secondary)' }}>
                        {safeValue(category.name, 'Untitled')}
                      </div>
                      <div className="categories-description" style={{
                        fontSize: 'var(--admin-text-sm)',
                        color: 'var(--admin-text-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '300px'
                      }}>
                        {safeValue(category.description, '—')}
                      </div>
                      <div style={{ fontSize: 'var(--admin-text-sm)', fontWeight: 'var(--admin-font-semibold)', color: 'var(--admin-text-secondary)', textAlign: 'center' }}>
                        {getProductCount(category._id)}
                      </div>
                      <div>
                        <StatusBadge status="archived" label="Archived" color="#888" />
                      </div>
                      <div className="categories-actions" style={{ display: 'flex', gap: 'var(--admin-space-2)', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleEdit(category)}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: 'var(--admin-space-1)', minWidth: '32px', height: '32px', justifyContent: 'center' }}
                          title="Edit category"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(category._id, safeValue(category.name, 'category'))}
                          className="admin-btn admin-btn-danger"
                          style={{ padding: 'var(--admin-space-1)', minWidth: '32px', height: '32px', justifyContent: 'center' }}
                          title="Delete category"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirm Dialog for Delete */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
      />

      {/* Responsive CSS */}
      <style jsx global>{`
        @media (min-width: 769px) {
          .categories-table-wrapper { overflow-x: visible; }
        }
        @media (max-width: 768px) {
          .categories-table-wrapper {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding: 0 var(--admin-space-4) !important;
          }
          .categories-table-header,
          .categories-table-row { min-width: 700px; }
          .categories-header { padding: 0 var(--admin-space-4) !important; }
          .categories-description { max-width: 150px !important; }
        }
      `}</style>
    </AdminLayout>
  )
}
