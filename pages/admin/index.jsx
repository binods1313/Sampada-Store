import AdminLayout from '@/components/Admin/AdminLayout'
import StatCard from '@/components/Admin/StatCard'
import { useDashboardStats, useRecentProducts } from '@/hooks/useAdminData'
import StatusBadge from '@/components/Admin/StatusBadge'
import StockIndicator from '@/components/Admin/StockIndicator'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/client'
import { useRouter } from 'next/router'
import Breadcrumbs from '@/components/admin/Breadcrumbs'

// Helper to safely render values that might be Sanity reference objects
const safeValue = (val, fallback = '') => {
  if (val === null || val === undefined) return fallback
  if (typeof val === 'object') {
    return val.name || val.email || val.title || val.amount || val._ref || val.current || String(val) || fallback
  }
  return String(val)
}

// Helper to safely render numeric values that might be objects
const safeNumber = (val, fallback = 0) => {
  if (val === null || val === undefined) return fallback
  if (typeof val === 'object') {
    const num = Number(val.current ?? val.amount ?? val.count ?? val.value ?? 0)
    return isNaN(num) ? fallback : num
  }
  const num = Number(val)
  return isNaN(num) ? fallback : num
}

// Helper to calculate total stock from variants
const getTotalStock = (product) => {
  if (product.variants && product.variants.length > 0) {
    return product.variants.reduce((sum, v) =>
      sum + (v.variantStock || 0), 0
    )
  }
  return product.inventory || 0
}

const QUICK_ACTIONS = [
  { icon: '＋', label: 'Add Product', href: '/admin/products/add', color: '#C9A84C' },
  { icon: '◫', label: 'All Products', href: '/admin/products', color: '#C9A84C' },
  { icon: '◉', label: 'Categories', href: '/admin/categories', color: '#C9A84C' },
  { icon: '◈', label: 'Bulk Tag', href: '/admin/bulk-tag', color: '#C9A84C' },
  { icon: '◯', label: 'Users', href: '/admin/users', color: '#C9A84C' },
  { icon: '◨', label: 'Analytics', href: '/admin/analytics', color: '#C9A84C' },
  { icon: '🌐', label: 'Sanity Studio', href: '/studio', color: '#C9A84C' },
  { icon: '◎', label: 'Settings', href: '/admin/settings', color: '#C9A84C' },
]

// Time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const router = useRouter()
  const { stats, loading: statsLoading } = useDashboardStats()
  const { products, loading: productsLoading } = useRecentProducts(10)

  return (
    <AdminLayout title="Dashboard">
      <Breadcrumbs items={[{ label: 'Dashboard', current: true }]} />

      {/* Welcome Header */}
      <div className="dashboard-header" style={{
        marginBottom: 'var(--admin-space-6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--admin-space-4)'
      }}>
        <div>
          <h2 className="admin-heading" style={{ fontSize: 'var(--admin-text-2xl)', margin: '0 0 var(--admin-space-1) 0' }}>
            {getGreeting()}, Admin 👋
          </h2>
          <p className="admin-text-secondary admin-text-sm" style={{ margin: 0 }}>
            Here's what's happening with your store today.
          </p>
        </div>
        <div className="dashboard-actions" style={{
          display: 'flex',
          gap: 'var(--admin-space-2)'
        }}>
          <Link href="/" target="_blank" style={{
            padding: '10px 18px',
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '8px',
            color: '#C9A84C',
            fontSize: '13px',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(201,168,76,0.2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(201,168,76,0.1)'
            }}
          >
            ↗ View Store
          </Link>
          <Link href="/admin/products/add" style={{
            padding: '10px 18px',
            background: 'linear-gradient(135deg, #C9A84C, #a8882e)',
            border: 'none',
            borderRadius: '8px',
            color: '#0f0f0f',
            fontSize: '13px',
            fontWeight: '700',
            textDecoration: 'none',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(201,168,76,0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            ＋ Add Product
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'var(--admin-space-5)',
        marginBottom: 'var(--admin-space-8)'
      }}>
        <StatCard
          icon="◫"
          iconBg="rgba(139,26,26,0.15)"
          label="Total Products"
          value={safeNumber(stats.totalProducts, 0)}
          sub={`${safeNumber(stats.activeProducts, 0)} active`}
          borderColor="#8B1A1A"
          loading={statsLoading}
          logoPath="/images/stat-total.png"
        />
        <StatCard
          icon="✓"
          iconBg="rgba(45,122,45,0.15)"
          label="Active Products"
          value={safeNumber(stats.activeProducts, 0)}
          sub="Live on store"
          borderColor="#2d7a2d"
          loading={statsLoading}
          logoPath="/images/stat-active.png"
        />
        <StatCard
          icon="◉"
          iconBg="rgba(201,168,76,0.15)"
          label="Categories"
          value={safeNumber(stats.categories, 0)}
          sub="Product categories"
          borderColor="#C9A84C"
          loading={statsLoading}
          logoPath="/images/stat-categories.png"
        />
        <StatCard
          icon="⚠️"
          iconBg="rgba(201,168,76,0.15)"
          label="Low Stock"
          value={safeNumber(stats.lowStock, 0)}
          sub="Need attention"
          borderColor="#C9A84C"
          loading={statsLoading}
          onClick={() => router.push('/admin/products?filter=low-stock')}
          style={{ cursor: 'pointer' }}
          logoPath="/images/stat-lowstock.png"
        />
      </div>

      {/* Quick Actions */}
      <div style={{
        marginBottom: '32px'
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '700',
          color: '#fff',
          margin: '0 0 16px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          Quick Actions
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '12px'
        }}>
          {QUICK_ACTIONS.map(action => (
            <Link
              key={action.href}
              href={action.href}
              style={{
                padding: '16px',
                background: '#1a1a1a',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <span style={{
                fontSize: '20px',
                color: action.color
              }}>{action.icon}</span>
              <span style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#fff'
              }}>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Products */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#fff',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            Recent Products
          </h3>
          <Link
            href="/admin/products"
            style={{
              fontSize: '12px',
              color: '#C9A84C',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            View All →
          </Link>
        </div>
        <div style={{
          background: '#1a1a1a',
          border: '1px solid rgba(201,168,76,0.12)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr 120px 120px 100px 80px',
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
            <div>Image</div>
            <div>Name</div>
            <div>Status</div>
            <div>Price</div>
            <div>Stock</div>
            <div></div>
          </div>

          {/* Table Body */}
          {productsLoading ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666' }}>
              Loading...
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '16px' }}>
                No products yet
              </p>
              <Link
                href="/admin/products/add"
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #C9A84C, #a8882e)',
                  borderRadius: '8px',
                  color: '#0f0f0f',
                  fontSize: '14px',
                  fontWeight: '700',
                  textDecoration: 'none'
                }}
              >
                ＋ Add your first product
              </Link>
            </div>
          ) : (
            products.map(product => (
              <Link
                key={product._id}
                href={`/admin/products/edit/${product._id}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr 120px 120px 100px 80px',
                  gap: '16px',
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(201,168,76,0.06)',
                  textDecoration: 'none',
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
                {/* Image */}
                <div className="admin-thumb-image" style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '10px',
                  background: '#ffe5e5',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  overflow: 'hidden'
                }}>
                  {product.image ? (
                    <img
                      src={urlFor(product.image)
                        .width(140)
                        .height(140)
                        .format('webp')
                        .url()}
                      alt={safeValue(product.name, 'Product image')}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        display: 'block'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#8B1A1A',
                      fontSize: '22px'
                    }}>📦</div>
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
                  {safeValue(product.name, 'Untitled')}
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
                  <StockIndicator stock={getTotalStock(product)} />
                </div>

                {/* Edit Link */}
                <div style={{
                  fontSize: '13px',
                  color: '#666',
                  textAlign: 'right'
                }}>
                  Edit →
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Mobile Responsive CSS */}
      <style jsx global>{`
        /* Desktop: Full layout */
        @media (min-width: 769px) {
          .dashboard-header {
            flex-direction: row !important;
            text-align: left !important;
          }
        }
        
        /* Mobile: Stacked layout */
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column !important;
            text-align: center !important;
          }
          .dashboard-actions {
            width: 100% !important;
            justify-content: center !important;
          }
          .stat-cards-grid {
            grid-template-columns: 1fr !important;
          }
          .recent-products-header {
            flex-direction: column !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </AdminLayout>
  )
}
