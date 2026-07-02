import { useState, useEffect } from 'react'

// Animated counter hook
function useCounter(target, duration = 1200) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!target) return

    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])

  return value
}

// Skeleton loader
function Skeleton({ width = '100%', height = '20px', style = {} }) {
  return (
    <div style={{
      width,
      height,
      borderRadius: '6px',
      background: 'linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style
    }} />
  )
}

export default function StatCard({ icon, iconBg, label, value, sub, borderColor, loading, onClick, style, logoPath }) {
  const animated = useCounter(loading ? 0 : value)

  return (
    <div
      className="stat-card admin-card"
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View ${label} details` : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, var(--admin-surface-3) 0%, var(--admin-surface-5) 100%)',
        borderLeft: `var(--admin-border-width-md) solid ${borderColor}`,
        minHeight: '140px',
        padding: 'var(--admin-space-5)',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 'var(--admin-space-5)',
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden',
        color: 'var(--admin-text-primary)',
        ...style
      }}
      onClick={onClick}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = 'var(--admin-shadow-md)'
        const logo = e.currentTarget.querySelector('.stat-card-logo-area')
        if (logo) logo.style.opacity = '0.8'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
        const logo = e.currentTarget.querySelector('.stat-card-logo-area')
        if (logo) logo.style.opacity = '0.65'
      }}
    >
      {/* Subtle gradient overlay for depth */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.1) 100%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Logo area - left side */}
      <div className="stat-card-logo-area" style={{
        flex: '0 0 80px',
        width: '80px',
        height: '80px',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: logoPath ? `url('${logoPath}')` : "url('/images/Logo_16.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        opacity: 0.7,
        transition: 'var(--admin-transition-base)'
      }} />

      {/* Text content - right side */}
      <div className="stat-card-content" style={{
        position: 'relative',
        zIndex: 1,
        flex: 1,
        textAlign: 'left',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {/* Label row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--admin-space-2)',
          marginBottom: 'var(--admin-space-1)'
        }}>
          <div className="admin-text-xs admin-font-semibold" style={{ 
            color: 'var(--admin-text-secondary)', 
            textTransform: 'uppercase', 
            letterSpacing: 'var(--admin-tracking-wider)',
            fontSize: '11px'
          }}>
            {label}
          </div>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: 'var(--admin-radius-sm)',
            background: iconBg,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px'
          }}>{icon}</div>
        </div>

        {/* Value */}
        {loading ? (
          <Skeleton height="32px" width="80px" style={{ marginBottom: 'var(--admin-space-1)' }} />
        ) : (
          <div className="admin-text-3xl admin-font-extrabold" style={{ 
            color: 'var(--admin-text-primary)', 
            lineHeight: 1.2, 
            fontVariantNumeric: 'tabular-nums',
            fontSize: '28px'
          }}>
            {animated.toLocaleString()}
          </div>
        )}

        {/* Sub text */}
        {loading ? (
          <Skeleton height="12px" width="100px" />
        ) : (
          <div className="admin-text-sm" style={{ 
            color: 'var(--admin-gold)',
            fontSize: '12px',
            fontWeight: '500',
            marginTop: '2px'
          }}>
            {sub}
          </div>
        )}
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        ${value > 0 && label === 'Low Stock' ? `
          @keyframes pulse-red {
            0%, 100% { border-color: rgba(139,26,26,0.4); }
            50% { border-color: rgba(139,26,26,0.9); }
          }
          .stat-card {
            animation: pulse-red 2s ease-in-out infinite;
          }
        ` : ''}
        /* Responsive layout - stack on mobile, side-by-side on desktop */
        @media (max-width: 768px) {
          .stat-card {
            flex-direction: column !important;
            min-height: auto !important;
            padding: 16px !important;
            gap: 12px !important;
          }
          .stat-card-logo-area {
            flex: 0 0 80px !important;
            width: 100% !important;
            minHeight: 80px !important;
            opacity: 0.55 !important;
          }
          .stat-card-content {
            textAlign: center !important;
          }
          .stat-card-content > div:first-child {
            justify-content: center !important;
          }
          .stat-card-content > div:nth-child(2) {
            margin-left: 0 !important;
          }
          .stat-card-content > div:last-child {
            margin-left: 0 !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1023px) {
          .stat-card {
            min-height: 120px !important;
            padding: 18px !important;
          }
          .stat-card-logo-area {
            opacity: 0.6 !important;
          }
        }
        @media (min-width: 1024px) {
          .stat-card {
            min-height: 140px !important;
            padding: 20px !important;
          }
          .stat-card-logo-area {
            opacity: 0.65 !important;
          }
        }
      `}</style>
    </div>
  )
}
