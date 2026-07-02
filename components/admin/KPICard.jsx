import { useState, useEffect } from 'react'

function useCounter(target, duration = 1200) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!target || typeof target !== 'number') return

    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])

  return value
}

function Skeleton({ style = {} }) {
  return (
    <div style={{
      borderRadius: '12px',
      background: 'linear-gradient(90deg, rgba(201,168,76,0.08), rgba(201,168,76,0.15), rgba(201,168,76,0.08))',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style
    }} />
  )
}

export default function KPICard({ 
  icon, 
  value, 
  label, 
  trend, 
  href, 
  accentColor = '#C9A84C',
  loading = false,
  error = false,
  subLabel
}) {
  const isNumeric = typeof value === 'number'
  const animatedValue = useCounter(isNumeric ? value : 0)

  const formatValue = () => {
    if (loading) return null
    if (error || value === '—' || value === null || value === undefined) return '—'
    if (typeof value === 'number') {
      if (label === 'Revenue Today (₹)') {
        return `₹${value.toLocaleString('en-IN')}`
      }
      return value.toLocaleString('en-IN')
    }
    return String(value)
  }

  const renderTrend = () => {
    if (!trend || trend === 0) return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '20px',
        fontSize: '10px',
        fontWeight: 600,
        fontFamily: 'var(--font-sans, Inter, sans-serif)',
        background: '#F1F5F9',
        color: '#64748B'
      }}>
        → Same as yesterday
      </span>
    )
    
    const isPositive = trend > 0
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '20px',
        fontSize: '10px',
        fontWeight: 600,
        fontFamily: 'var(--font-sans, Inter, sans-serif)',
        background: isPositive ? '#D1FAE5' : '#FEE2E2',
        color: isPositive ? '#065F46' : '#991B1B'
      }}>
        {isPositive ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}% vs yesterday
      </span>
    )
  }

  const cardStyle = {
    borderRadius: '20px',
    background: '#FDF6EC',
    padding: '20px 24px',
    boxShadow: '8px 8px 20px rgba(0,0,0,0.08), -8px -8px 20px rgba(255,255,255,0.85)',
    borderTop: `3px solid ${accentColor}`,
    cursor: href ? 'pointer' : 'default',
    transition: 'transform 0.2s, box-shadow 0.2s',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '160px'
  }

  const hoverStyle = {
    transform: 'translateY(-4px)',
    boxShadow: '10px 10px 24px rgba(0,0,0,0.1), -10px -10px 24px rgba(255,255,255,0.9)'
  }

  if (href) {
    return (
      <a
        href={href}
        style={cardStyle}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: '8px 8px 20px rgba(0,0,0,0.08), -8px -8px 20px rgba(255,255,255,0.85)' })}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px', lineHeight: 1 }}>{icon}</span>
            {subLabel && (
              <span style={{
                fontFamily: 'var(--font-sans, Inter, sans-serif)',
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#94A3B8',
                background: 'rgba(148,163,184,0.1)',
                padding: '2px 8px',
                borderRadius: '20px'
              }}>
                {subLabel}
              </span>
            )}
          </div>
          
          <div style={{ marginTop: '16px', flex: 1 }}>
            {loading ? (
              <Skeleton height="40px" width="60%" style={{ marginBottom: '8px' }} />
            ) : (
              <div style={{
                fontFamily: 'var(--font-serif, "Libre Baskerville", Georgia, serif)',
                fontSize: '40px',
                fontWeight: 700,
                color: '#8B1A1A',
                lineHeight: 1.2,
                fontVariantNumeric: 'tabular-nums'
              }}>
                {formatValue()}
              </div>
            )}
            
            <div style={{
              fontFamily: 'var(--font-sans, Inter, sans-serif)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'rgba(26,10,8,0.45)',
              marginTop: '8px'
            }}>
              {label}
            </div>
          </div>
          
          <div style={{ marginTop: '12px' }}>
            {loading ? (
              <Skeleton height="20px" width="40%" />
            ) : (
              renderTrend()
            )}
          </div>
        </div>
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </a>
    )
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '24px', lineHeight: 1 }}>{icon}</span>
          {subLabel && (
            <span style={{
              fontFamily: 'var(--font-sans, Inter, sans-serif)',
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#94A3B8',
              background: 'rgba(148,163,184,0.1)',
              padding: '2px 8px',
              borderRadius: '20px'
            }}>
              {subLabel}
            </span>
          )}
        </div>
        
        <div style={{ marginTop: '16px', flex: 1 }}>
          {loading ? (
            <Skeleton height="40px" width="60%" style={{ marginBottom: '8px' }} />
          ) : (
            <div style={{
              fontFamily: 'var(--font-serif, "Libre Baskerville", Georgia, serif)',
              fontSize: '40px',
              fontWeight: 700,
              color: '#8B1A1A',
              lineHeight: 1.2,
              fontVariantNumeric: 'tabular-nums'
            }}>
              {formatValue()}
            </div>
          )}
          
          <div style={{
            fontFamily: 'var(--font-sans, Inter, sans-serif)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'rgba(26,10,8,0.45)',
            marginTop: '8px'
          }}>
            {label}
          </div>
        </div>
        
        <div style={{ marginTop: '12px' }}>
          {loading ? (
            <Skeleton height="20px" width="40%" />
          ) : (
            renderTrend()
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}