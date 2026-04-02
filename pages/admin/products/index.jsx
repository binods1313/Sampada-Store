import { useState, useMemo } from 'react'
import AdminLayout from '@/components/Admin/AdminLayout'
import StatusBadge from '@/components/Admin/StatusBadge'
import StockIndicator from '@/components/Admin/StockIndicator'
import { useAdminData } from '@/hooks/useAdminData'
import Link from 'next/link'
import Image from 'next/image'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
  { value: 'stock', label: 'Stock Level' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

export default function ProductsList() {
  const { data: products, loading } = useAdminData('*[_type == "product"] | order(_createdAt desc)')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [selected, setSelected] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Filter and sort products
  const filtered = useMemo(() => {
    if (!products) return []

    let result = [...products]

    // Search filter
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter)
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt))
        break
      case 'price-asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price-desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'name':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        break
      case 'stock':
        result.sort((a, b) => (b.inventory || 0) - (a.inventory || 0))
        break
    }

    return result
  }, [products, search, statusFilter, sortBy])

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Bulk selection
  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(paginated.map(p => p._id)))
    }
  }

  return (
    <AdminLayout title="Products">
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
            All Products
          </h2>
          <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            {search && ` matching "${search}"`}
          </p>
        </div>
        <Link href="/admin/products/add" style={{
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
          gap: '6px'
        }}>
          ＋ Add Product
        </Link>
      </div>

      {/* Filters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 200px 200px',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#666',
            fontSize: '14px'
          }}>⌕</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{
              width: '100%',
              background: '#1a1a1a',
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: '8px',
              padding: '10px 14px 10px 36px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none'
            }}
            onFocus={e => e.target.style.borderColor = '#C9A84C'}
            onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.15)'}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{
            background: '#1a1a1a',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{
            background: '#1a1a1a',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Bulk Actions Bar */}
      {selected.size > 0 && (
        <div style={{
          background: 'rgba(201,168,76,0.1)',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '13px', color: '#C9A84C', fontWeight: '600' }}>
            {selected.size} selected
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              padding: '6px 14px',
              background: 'rgba(139,26,26,0.2)',
              border: '1px solid rgba(139,26,26,0.4)',
              borderRadius: '6px',
              color: '#ff6b6b',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Archive
            </button>
            <button style={{
              padding: '6px 14px',
              background: 'rgba(45,122,45,0.2)',
              border: '1px solid rgba(45,122,45,0.4)',
              borderRadius: '6px',
              color: '#4ade80',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Publish
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div style={{
        background: '#1a1a1a',
        border: '1px solid rgba(201,168,76,0.12)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 60px 1fr 120px 120px 100px 80px',
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
          <div>
            <input
              type="checkbox"
              checked={selected.size === paginated.length && paginated.length > 0}
              onChange={toggleSelectAll}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div>Image</div>
          <div>Name</div>
          <div>Status</div>
          <div>Price</div>
          <div>Stock</div>
          <div></div>
        </div>

        {/* Table Body */}
        {loading ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666' }}>
            Loading products...
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666' }}>
            {search || statusFilter !== 'all' ? 'No products match your filters' : 'No products yet'}
          </div>
        ) : (
          paginated.map(product => (
            <div
              key={product._id}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 60px 1fr 120px 120px 100px 80px',
                gap: '16px',
                padding: '14px 20px',
                borderBottom: '1px solid rgba(201,168,76,0.06)',
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
              {/* Checkbox */}
              <div>
                <input
                  type="checkbox"
                  checked={selected.has(product._id)}
                  onChange={() => toggleSelect(product._id)}
                  style={{ cursor: 'pointer' }}
                />
              </div>

              {/* Image */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                background: '#0f0f0f',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {product.image?.asset ? (
                  <Image
                    src={product.image.asset.url}
                    alt={product.name}
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#333',
                    fontSize: '16px'
                  }}>?</div>
                )}
              </div>

              {/* Name */}
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#fff',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {product.name}
              </div>

              {/* Status */}
              <div>
                <StatusBadge status={product.status} />
              </div>

              {/* Price */}
              <div style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#C9A84C'
              }}>
                ₹{product.price?.toFixed(2) || '0.00'}
              </div>

              {/* Stock */}
              <div>
                <StockIndicator stock={product.inventory} />
              </div>

              {/* Edit Link */}
              <div style={{ textAlign: 'right' }}>
                <Link
                  href={`/admin/products/edit/${product._id}`}
                  style={{
                    fontSize: '13px',
                    color: '#666',
                    textDecoration: 'none'
                  }}
                >
                  Edit →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '20px'
        }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 14px',
              background: currentPage === 1 ? '#1a1a1a' : 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '6px',
              color: currentPage === 1 ? '#444' : '#C9A84C',
              fontSize: '13px',
              fontWeight: '600',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            Previous
          </button>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: '8px 14px',
                  background: page === currentPage ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.1)',
                  border: `1px solid ${page === currentPage ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.2)'}`,
                  borderRadius: '6px',
                  color: page === currentPage ? '#C9A84C' : '#888',
                  fontSize: '13px',
                  fontWeight: page === currentPage ? '700' : '600',
                  cursor: 'pointer',
                  minWidth: '40px'
                }}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 14px',
              background: currentPage === totalPages ? '#1a1a1a' : 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '6px',
              color: currentPage === totalPages ? '#444' : '#C9A84C',
              fontSize: '13px',
              fontWeight: '600',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            Next
          </button>
        </div>
      )}
    </AdminLayout>
  )
}
