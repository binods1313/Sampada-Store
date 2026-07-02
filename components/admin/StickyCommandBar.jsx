import Link from 'next/link'
import { useState } from 'react'

export default function StickyCommandBar({ pendingOrdersCount = 0, lowStockCount = 0 }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const ordersPill = pendingOrdersCount > 0
    ? { label: `🔴 ${pendingOrdersCount} Orders Need Attention`, variant: 'red', href: '/admin/orders' }
    : { label: '✅ Orders Clear', variant: 'green', href: '/admin/orders' }

  const stockPill = lowStockCount > 0
    ? { label: `⚠️ ${lowStockCount} Low Stock`, variant: 'amber', href: '/admin/products' }
    : { label: '✅ Stock Healthy', variant: 'green', href: '/admin/products' }

  const systemPill = {
    label: '🟢 System Live · sampadaoriginals.in',
    variant: 'green',
    external: true,
    href: 'https://sampadaoriginals.in',
  }

  const pillStyles = {
    red: { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' },
    amber: { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' },
    green: { background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' }
  }

  const renderPill = (pill) => {
    const style = pillStyles[pill.variant]
    const onClick = pill.external
      ? () => window.open('https://sampadaoriginals.in', '_blank', 'noopener,noreferrer')
      : () => {} // Link handles navigation

    return (
      <Link
        key={pill.label}
        href={pill.href}
        target={pill.external ? '_blank' : undefined}
        rel={pill.external ? 'noopener noreferrer' : undefined}
        style={{
          padding: '6px 16px',
          borderRadius: '40px',
          fontSize: '12px',
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          cursor: 'pointer',
          transition: 'opacity 0.2s',
          textDecoration: 'none',
          ...style,
          display: 'inline-flex',
          alignItems: 'center'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
      >
        {pill.label}
      </Link>
    )
  }

  return (
    <div className="sticky-command-bar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'white',
      borderBottom: '1px solid rgba(201,168,76,0.2)',
      padding: '14px 28px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      {/* LEFT SIDE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!logoFailed ? (
            <img
              src="/images/Logo_16.png"
              alt="Sampada"
              height={32}
              width={32}
              style={{ display: 'block', borderRadius: '50%' }}
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span style={{
              fontFamily: '"Libre Baskerville", Georgia, serif',
              color: 'var(--sampada-crimson, #8B1A1A)',
              fontSize: '22px',
              fontWeight: '700',
              letterSpacing: '-0.5px',
            }}>
              Sampada
            </span>
          )}
        </div>
        <div style={{
          width: '1px',
          height: '28px',
          background: 'var(--sampada-gold, #C9A84C)'
        }} />
        <div>
          <div style={{
            fontFamily: 'var(--font-sans, "Inter", sans-serif)',
            fontSize: '16px',
            color: 'var(--sampada-dark, #1A0A08)',
            fontWeight: '500'
          }}>
            {greeting}, Admin 👋
          </div>
          <div style={{
            fontFamily: 'var(--font-sans, "Inter", sans-serif)',
            fontSize: '12px',
            color: 'rgba(26,10,8,0.45)'
          }}>
            {dateStr}
          </div>
        </div>
      </div>

      {/* CENTER — Live Alert Pills */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {renderPill(ordersPill)}
        {renderPill(stockPill)}
        {renderPill(systemPill)}
      </div>

      {/* RIGHT SIDE — Quick Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Link
          href="/creative-studio"
          style={{
            padding: '8px 18px',
            background: 'var(--sampada-crimson, #8B1A1A)',
            color: 'white',
            borderRadius: '8px',
            fontWeight: 600,
            fontFamily: 'var(--font-sans, "Inter", sans-serif)',
            fontSize: '13px',
            textDecoration: 'none',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          🎨 Creative Studio
        </Link>
        <Link
          href="/admin/products/add"
          style={{
            padding: '8px 18px',
            background: 'var(--sampada-crimson, #8B1A1A)',
            color: 'white',
            borderRadius: '8px',
            fontWeight: 600,
            fontFamily: 'var(--font-sans, "Inter", sans-serif)',
            fontSize: '13px',
            textDecoration: 'none',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          + Add Product
        </Link>
        <Link
          href="https://sampadaoriginals.in"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '8px 18px',
            background: 'transparent',
            border: '1px solid var(--sampada-gold, #C9A84C)',
            color: 'var(--sampada-gold, #C9A84C)',
            borderRadius: '8px',
            fontWeight: 600,
            fontFamily: 'var(--font-sans, "Inter", sans-serif)',
            fontSize: '13px',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--sampada-gold, #C9A84C)'
            e.currentTarget.style.color = 'var(--sampada-dark, #1A0A08)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--sampada-gold, #C9A84C)'
          }}
        >
          View Store ↗
        </Link>
      </div>
    </div>
  )
}