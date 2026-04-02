import AdminLayout from '@/components/Admin/AdminLayout'
import StatCard from '@/components/Admin/StatCard'
import { useDashboardStats, useRecentProducts } from '@/hooks/useAdminData'
import StatusBadge from '@/components/Admin/StatusBadge'
import StockIndicator from '@/components/Admin/StockIndicator'
import Link from 'next/link'
import Image from 'next/image'

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

export default function Dashboard() {
  const { stats, loading: statsLoading } = useDashboardStats()
  const { products, loading: productsLoading } = useRecentProducts(10)

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome Header */}
      <div style={{
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#fff',
            margin: '0 0 6px 0'
          }}>
            Welcome back, Admin
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: 0
          }}>
            Here's what's happening with your store today.
          </p>
        </div>
        <div style={{
          display: 'flex',
          gap: '10px'
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
        gap: '20px',
        marginBottom: '32px'
      }}>
        <StatCard
          icon="◫"
          iconBg="rgba(139,26,26,0.15)"
          label="Total Products"
          value={stats.totalProducts}
          sub={`${stats.activeProducts} active`}
          borderColor="#8B1A1A"
          loading={statsLoading}
        />
        <StatCard
          icon="✓"
          iconBg="rgba(45,122,45,0.15)"
          label="Active Products"
          value={stats.activeProducts}
          sub="Live on store"
          borderColor="#2d7a2d"
          loading={statsLoading}
        />
        <StatCard
          icon="◉"
          iconBg="rgba(201,168,76,0.15)"
          label="Categories"
          value={stats.categories}
          sub="Product categories"
          borderColor="#C9A84C"
          loading={statsLoading}
        />
        <StatCard
          icon="⚠️"
          iconBg="rgba(201,168,76,0.15)"
          label="Low Stock"
          value={stats.lowStock}
          sub="Need attention"
          borderColor="#C9A84C"
          loading={statsLoading}
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
            gridTemplateColumns: '60px 1fr 120px 120px 100px 80px',
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
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666' }}>
              No products yet
            </div>
          ) : (
            products.map(product => (
              <Link
                key={product._id}
                href={`/admin/products/edit/${product._id}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 120px 120px 100px 80px',
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
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '6px',
                  background: '#0f0f0f',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  {product.image ? (
                    <Image
                      src={product.image}
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
    </AdminLayout>
  )
}
