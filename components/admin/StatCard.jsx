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

export default function StatCard({ icon, iconBg, label, value, sub, borderColor, loading }) {
  const animated = useCounter(loading ? 0 : value)

  return (
    <div style={{
      background: '#1a1a1a',
      border: `1px solid rgba(201,168,76,0.12)`,
      borderLeft: `3px solid ${borderColor}`,
      borderRadius: '12px',
      padding: '22px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      transition: 'all 0.2s ease',
      cursor: 'default'
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: iconBg,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px'
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '11px',
          color: '#666',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '6px'
        }}>{label}</div>
        {loading ? (
          <Skeleton height="32px" width="80px" style={{ marginBottom: '6px' }} />
        ) : (
          <div style={{
            fontSize: '30px',
            fontWeight: '800',
            color: '#fff',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums'
          }}>
            {animated.toLocaleString()}
          </div>
        )}
        {loading ? (
          <Skeleton height="14px" width="120px" />
        ) : (
          <div style={{ fontSize: '12px', color: '#C9A84C', marginTop: '5px' }}>
            {sub}
          </div>
        )}
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
