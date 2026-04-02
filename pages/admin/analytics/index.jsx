import { useState } from 'react'
import AdminLayout from '@/components/Admin/AdminLayout'
import StatCard from '@/components/Admin/StatCard'

const DATE_RANGES = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'all', label: 'All Time' },
]

// Mock data for demonstration
const MOCK_DATA = {
  '7d': { revenue: 12450, orders: 87, visitors: 3420, conversion: 2.54 },
  '30d': { revenue: 48920, orders: 342, visitors: 12840, conversion: 2.66 },
  '90d': { revenue: 142560, orders: 1024, visitors: 38920, conversion: 2.63 },
  'ytd': { revenue: 487230, orders: 3421, visitors: 128450, conversion: 2.66 },
  'all': { revenue: 892450, orders: 6234, visitors: 234890, conversion: 2.65 },
}

const TOP_PRODUCTS = [
  { rank: 1, name: 'Premium Wireless Headphones', sales: 342, revenue: 42780, growth: 12.5 },
  { rank: 2, name: 'Organic Cotton T-Shirt', sales: 289, revenue: 8670, growth: 8.3 },
  { rank: 3, name: 'Smart Fitness Watch', sales: 256, revenue: 38400, growth: -3.2 },
  { rank: 4, name: 'Minimalist Backpack', sales: 198, revenue: 11880, growth: 15.7 },
  { rank: 5, name: 'Ceramic Coffee Mug Set', sales: 187, revenue: 5610, growth: 5.1 },
]

export default function Analytics() {
  const [dateRange, setDateRange] = useState('30d')
  const data = MOCK_DATA[dateRange]

  return (
    <AdminLayout title="Analytics">
      {/* Header with Date Range */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '0 0 4px 0' }}>
            Analytics Overview
          </h2>
          <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
            Track your store performance
          </p>
        </div>
        <select
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
          style={{
            background: '#1a1a1a',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '8px',
            padding: '10px 16px',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '600',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {DATE_RANGES.map(range => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
      </div>

      {/* Revenue Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <StatCard
          icon="₹"
          iconBg="rgba(201,168,76,0.15)"
          label="Total Revenue"
          value={data.revenue}
          sub="₹48,920 previous period"
          borderColor="#C9A84C"
          loading={false}
        />
        <StatCard
          icon="📦"
          iconBg="rgba(139,26,26,0.15)"
          label="Total Orders"
          value={data.orders}
          sub="+12.5% from last period"
          borderColor="#8B1A1A"
          loading={false}
        />
        <StatCard
          icon="👁️"
          iconBg="rgba(201,168,76,0.15)"
          label="Total Visitors"
          value={data.visitors}
          sub="+8.3% from last period"
          borderColor="#C9A84C"
          loading={false}
        />
        <StatCard
          icon="%"
          iconBg="rgba(45,122,45,0.15)"
          label="Conversion Rate"
          value={data.conversion}
          sub="Industry avg: 2.5%"
          borderColor="#2d7a2d"
          loading={false}
        />
      </div>

      {/* Revenue Chart Placeholder */}
      <div style={{
        background: '#1a1a1a',
        border: '1px solid rgba(201,168,76,0.12)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Revenue Trend
          </h3>
          <span style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {DATE_RANGES.find(r => r.value === dateRange)?.label}
          </span>
        </div>
        {/* Chart Placeholder */}
        <div style={{
          height: '300px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '20px 0'
        }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const height = Math.random() * 60 + 20
            return (
              <div key={i} style={{
                flex: 1,
                background: `linear-gradient(180deg, rgba(201,168,76,0.8) 0%, rgba(201,168,76,0.2) 100%)`,
                borderRadius: '4px 4px 0 0',
                height: `${height}%`,
                transition: 'height 0.3s ease',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: '-24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '10px',
                  color: '#666'
                }}>
                  {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                </div>
              </div>
            )
          })}
        </div>
        <p style={{ fontSize: '11px', color: '#666', textAlign: 'center', marginTop: '30px' }}>
          📊 Interactive chart coming soon
        </p>
      </div>

      {/* Top Products Table */}
      <div style={{
        background: '#1a1a1a',
        border: '1px solid rgba(201,168,76,0.12)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(201,168,76,0.12)'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Top Products
          </h3>
          <a href="/admin/products" style={{
            fontSize: '12px',
            color: '#C9A84C',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            View All →
          </a>
        </div>

        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr 120px 140px 100px',
          gap: '16px',
          padding: '14px 24px',
          background: 'rgba(0,0,0,0.3)',
          fontSize: '11px',
          fontWeight: '700',
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          <div>Rank</div>
          <div>Product</div>
          <div>Sales</div>
          <div>Revenue</div>
          <div>Growth</div>
        </div>

        {/* Table Body */}
        {TOP_PRODUCTS.map(product => (
          <div
            key={product.rank}
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 120px 140px 100px',
              gap: '16px',
              padding: '14px 24px',
              borderBottom: product.rank < TOP_PRODUCTS.length ? '1px solid rgba(201,168,76,0.06)' : 'none',
              alignItems: 'center'
            }}
          >
            {/* Rank */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: product.rank === 1 ? 'rgba(201,168,76,0.2)' : product.rank === 2 ? 'rgba(139,26,26,0.15)' : product.rank === 3 ? 'rgba(139,26,26,0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '800',
              color: product.rank === 1 ? '#C9A84C' : product.rank === 2 ? '#ff6b6b' : product.rank === 3 ? '#ff8080' : '#666'
            }}>
              {product.rank === 1 ? '🥇' : product.rank === 2 ? '🥈' : product.rank === 3 ? '🥉' : product.rank}
            </div>

            {/* Product Name */}
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#fff'
            }}>
              {product.name}
            </div>

            {/* Sales */}
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#fff'
            }}>
              {product.sales}
            </div>

            {/* Revenue */}
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#C9A84C'
            }}>
              ₹{product.revenue.toLocaleString()}
            </div>

            {/* Growth */}
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: product.growth > 0 ? '#4ade80' : '#ff6b6b',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {product.growth > 0 ? '↑' : '↓'} {Math.abs(product.growth)}%
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Notice */}
      <div style={{
        marginTop: '32px',
        padding: '24px',
        background: 'rgba(201,168,76,0.08)',
        border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '13px', color: '#C9A84C', margin: '0 0 8px 0', fontWeight: '600' }}>
          🚀 Advanced Analytics Coming Soon
        </p>
        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
          Real-time charts, customer insights, and detailed reports are in development
        </p>
      </div>
    </AdminLayout>
  )
}
