import AdminLayout from '@/components/Admin/AdminLayout'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useAdminData } from '@/hooks/useAdminData'
import { ToastProvider, useToast } from '@/components/Admin/Toast'
import StatusBadge from '@/components/Admin/StatusBadge'
import EmptyState from '@/components/admin/EmptyState'
import Breadcrumbs, { useBreadcrumbs } from '@/components/admin/Breadcrumbs'

const ORDER_STATUS = {
  pending: { label: 'Pending', color: '#C9A84C' },
  processing: { label: 'Processing', color: '#3b82f6' },
  shipped: { label: 'Shipped', color: '#8b5cf6' },
  delivered: { label: 'Delivered', color: '#2d7a2d' },
  cancelled: { label: 'Cancelled', color: '#8B1A1A' },
}

// Universal safe renderer - converts ANY value to safe string
const safeValue = (val, fallback = '') => {
  if (val === null || val === undefined) return fallback
  if (typeof val === 'object') {
    // Try common Sanity patterns
    return val.name || val.email || val.title || val.amount || val._ref || val._createdAt || fallback
  }
  return String(val)
}

export default function OrdersList() {
  return (
    <AdminLayout title="Orders">
      <OrdersContent />
    </AdminLayout>
  )
}

function OrdersContent() {
  const { data: orders, loading } = useAdminData('*[_type == "order"] | order(_createdAt desc)')
  const toast = useToast()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Orders', current: true }
  ]

  // Filter orders
  const filteredOrders = (orders || []).filter(order => {
    const orderId = safeValue(order._id, '')
    const customerName = safeValue(order.customerName, '')
    const customerEmail = safeValue(order.customerEmail, '')
    const status = safeValue(order.status, '')
    
    const matchesFilter = filter === 'all' || status === filter
    const matchesSearch = !search || 
      orderId.toLowerCase().includes(search.toLowerCase()) ||
      customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Stats
  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => safeValue(o.status) === 'pending').length || 0,
    processing: orders?.filter(o => safeValue(o.status) === 'processing').length || 0,
    delivered: orders?.filter(o => safeValue(o.status) === 'delivered').length || 0,
    totalRevenue: orders?.reduce((sum, o) => {
      const total = parseFloat(safeValue(o.total, '0')) || 0
      return sum + total
    }, 0) || 0
  }

  return (
    <>
      <Head>
        <title>Orders - Sampada Admin</title>
      </Head>

      <Breadcrumbs items={breadcrumbs} />

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 'var(--admin-space-4)', 
        marginBottom: 'var(--admin-space-6)' 
      }}>
        <div className="admin-card">
          <div style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)', marginBottom: 'var(--admin-space-2)' }}>Total Orders</div>
          <div style={{ fontSize: 'var(--admin-text-2xl)', fontWeight: 'var(--admin-font-bold)', color: 'var(--admin-text-primary)' }}>{stats.total}</div>
        </div>
        <div className="admin-card">
          <div style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)', marginBottom: 'var(--admin-space-2)' }}>Pending</div>
          <div style={{ fontSize: 'var(--admin-text-2xl)', fontWeight: 'var(--admin-font-bold)', color: '#C9A84C' }}>{stats.pending}</div>
        </div>
        <div className="admin-card">
          <div style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)', marginBottom: 'var(--admin-space-2)' }}>Processing</div>
          <div style={{ fontSize: 'var(--admin-text-2xl)', fontWeight: 'var(--admin-font-bold)', color: '#3b82f6' }}>{stats.processing}</div>
        </div>
        <div className="admin-card">
          <div style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)', marginBottom: 'var(--admin-space-2)' }}>Total Revenue</div>
          <div style={{ fontSize: 'var(--admin-text-xl)', fontWeight: 'var(--admin-font-bold)', color: '#4ade80' }}>₹{stats.totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card" style={{ marginBottom: 'var(--admin-space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--admin-space-4)', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              className="admin-input"
            />
          </div>
          <div style={{ display: 'flex', gap: 'var(--admin-space-2)', flexWrap: 'wrap' }}>
            {Object.entries(ORDER_STATUS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => { setFilter(key); setCurrentPage(1) }}
                style={{
                  padding: 'var(--admin-space-2) var(--admin-space-4)',
                  background: filter === key ? `${config.color}20` : 'transparent',
                  border: `1px solid ${filter === key ? config.color : 'var(--admin-border-subtle)'}`,
                  borderRadius: 'var(--admin-radius-md)',
                  color: filter === key ? config.color : 'var(--admin-text-secondary)',
                  fontSize: 'var(--admin-text-sm)',
                  fontWeight: 'var(--admin-font-medium)',
                  cursor: 'pointer',
                  transition: 'var(--admin-transition-fast)'
                }}
              >
                {config.label}
              </button>
            ))}
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: 'var(--admin-space-2) var(--admin-space-4)',
                background: filter === 'all' ? 'rgba(201, 168, 76, 0.2)' : 'transparent',
                border: `1px solid ${filter === 'all' ? 'var(--admin-gold)' : 'var(--admin-border-subtle)'}`,
                borderRadius: 'var(--admin-radius-md)',
                color: filter === 'all' ? 'var(--admin-gold)' : 'var(--admin-text-secondary)',
                fontSize: 'var(--admin-text-sm)',
                fontWeight: 'var(--admin-font-medium)',
                cursor: 'pointer',
                transition: 'var(--admin-transition-fast)'
              }}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {/* Orders List - Desktop Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Desktop View (hidden on mobile) */}
        <div className="admin-table-desktop" style={{ display: 'none' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 120px', gap: 'var(--admin-space-4)', padding: 'var(--admin-space-4) var(--admin-space-6)', borderBottom: '1px solid var(--admin-border-subtle)', fontSize: 'var(--admin-text-xs)', fontWeight: 'var(--admin-font-semibold)', color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--admin-tracking-wide)' }}>
            <div>Order ID</div>
            <div>Customer</div>
            <div>Date</div>
            <div>Total</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {loading ? (
            <div style={{ padding: 'var(--admin-space-8)', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
              Loading orders...
            </div>
          ) : paginatedOrders.length === 0 ? (
            <EmptyState
              title={search || filter !== 'all' ? "No orders found" : "No orders yet"}
              description={search || filter !== 'all' ? "Try adjusting your search or filters" : "Orders will appear here once customers start purchasing"}
              actionLabel={null}
              onAction={null}
            />
          ) : (
            paginatedOrders.map(order => {
              const status = safeValue(order.status, 'pending')
              const orderId = safeValue(order._id, '')
              const customerName = safeValue(order.customerName, 'Guest')
              const customerEmail = safeValue(order.customerEmail, '')
              const orderTotal = parseFloat(safeValue(order.total, '0')) || 0
              const orderDate = safeValue(order._createdAt, new Date().toISOString())

              return (
              <div
                key={orderId}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 120px', gap: 'var(--admin-space-4)', padding: 'var(--admin-space-4) var(--admin-space-6)', borderBottom: '1px solid var(--admin-border-ghost)', transition: 'var(--admin-transition-fast)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-gold)', fontWeight: 'var(--admin-font-medium)' }}>
                  #{orderId?.slice(0, 8)}
                </div>
                <div>
                  <div style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-primary)', fontWeight: 'var(--admin-font-medium)' }}>
                    {customerName}
                  </div>
                  <div style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-secondary)' }}>
                    {customerEmail}
                  </div>
                </div>
                <div style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
                  {new Date(orderDate).toLocaleDateString()}
                </div>
                <div style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-primary)', fontWeight: 'var(--admin-font-semibold)' }}>
                  ₹{orderTotal.toFixed(2)}
                </div>
                <div>
                  <StatusBadge 
                    status={status || 'pending'} 
                    label={ORDER_STATUS[status]?.label || 'Pending'}
                    color={ORDER_STATUS[status]?.color || '#C9A84C'}
                  />
                </div>
                <div>
                  <Link
                    href={`/admin/orders/${orderId}`}
                    style={{
                      fontSize: 'var(--admin-text-sm)',
                      color: 'var(--admin-gold)',
                      textDecoration: 'none',
                      fontWeight: 'var(--admin-font-medium)'
                    }}
                  >
                    View →
                  </Link>
                </div>
              </div>
            )})
          )}
        </div>

        {/* Mobile View - Card Layout (visible on mobile only) */}
        <div className="admin-table-mobile" style={{ display: 'block' }}>
          {loading ? (
            <div style={{ padding: 'var(--admin-space-8)', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
              Loading orders...
            </div>
          ) : paginatedOrders.length === 0 ? (
            <EmptyState
              title={search || filter !== 'all' ? "No orders found" : "No orders yet"}
              description={search || filter !== 'all' ? "Try adjusting your search or filters" : "Orders will appear here once customers start purchasing"}
              actionLabel={null}
              onAction={null}
            />
          ) : (
            <div style={{ padding: 'var(--admin-space-4)' }}>
              {paginatedOrders.map(order => {
                const status = safeValue(order.status, 'pending')
                const orderId = safeValue(order._id, '')
                const customerName = safeValue(order.customerName, 'Guest')
                const customerEmail = safeValue(order.customerEmail, '')
                const orderTotal = parseFloat(safeValue(order.total, '0')) || 0
                const orderDate = safeValue(order._createdAt, new Date().toISOString())

                return (
                <Link
                  key={orderId}
                  href={`/admin/orders/${orderId}`}
                  style={{
                    display: 'block',
                    padding: 'var(--admin-space-4)',
                    marginBottom: 'var(--admin-space-3)',
                    backgroundColor: 'var(--admin-surface-3)',
                    border: '1px solid var(--admin-border-subtle)',
                    borderRadius: 'var(--admin-radius-md)',
                    textDecoration: 'none',
                    transition: 'var(--admin-transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--admin-space-3)' }}>
                    <div>
                      <div style={{ fontSize: 'var(--admin-text-md)', color: 'var(--admin-gold)', fontWeight: 'var(--admin-font-bold)', marginBottom: 'var(--admin-space-1)' }}>
                        #{orderId?.slice(0, 8)}
                      </div>
                      <div style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-primary)', fontWeight: 'var(--admin-font-medium)' }}>
                        {customerName}
                      </div>
                      <div style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-secondary)' }}>
                        {customerEmail}
                      </div>
                    </div>
                    <StatusBadge
                      status={status || 'pending'}
                      label={ORDER_STATUS[status]?.label || 'Pending'}
                      color={ORDER_STATUS[status]?.color || '#C9A84C'}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 'var(--admin-text-xs)', color: 'var(--admin-text-secondary)' }}>
                      {new Date(orderDate).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: 'var(--admin-text-md)', color: 'var(--admin-text-primary)', fontWeight: 'var(--admin-font-bold)' }}>
                      ₹{orderTotal.toFixed(2)}
                    </div>
                  </div>
                </Link>
              )})}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--admin-space-2)', padding: 'var(--admin-space-4)', borderTop: '1px solid var(--admin-border-subtle)' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="admin-btn admin-btn-secondary"
              style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <div style={{ fontSize: 'var(--admin-text-sm)', color: 'var(--admin-text-secondary)' }}>
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="admin-btn admin-btn-secondary"
              style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* CSS for responsive table */}
      <style jsx>{`
        .admin-table-desktop {
          display: none;
        }
        .admin-table-mobile {
          display: block;
        }
        @media (min-width: 768px) {
          .admin-table-desktop {
            display: block;
          }
          .admin-table-mobile {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
