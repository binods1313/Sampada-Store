import Link from 'next/link'
import { useRouter } from 'next/router'

const statusStyles = {
  active: { background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0', dot: '🟢' },
  'needs-review': { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', dot: '🟡' },
  'action-required': { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA', dot: '🔴' },
  'not-built': { background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0', dot: '⚪' }
}

const badgeStyles = {
  default: { background: '#8B1A1A', color: 'white' }
}

function Skeleton({ style = {} }) {
  return (
    <div style={{
      borderRadius: '8px',
      background: 'linear-gradient(90deg, rgba(201,168,76,0.08), rgba(201,168,76,0.15), rgba(201,168,76,0.08))',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style
    }} />
  )
}

export default function ModuleCard({ module, stats = null, loading = false, error = false, lastUpdated }) {
  const router = useRouter()
  const isNotBuilt = module.status === 'not-built'
  const statusStyle = statusStyles[module.status] || statusStyles['not-built']
  const accentColor = module.accentColor || '#C9A84C'
  const iconBg = `${accentColor}1A` // 10% opacity

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return 'Updated just now'
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const cardStyle = {
    borderRadius: '24px',
    background: '#FDF6EC',
    boxShadow: '8px 8px 20px rgba(0,0,0,0.08), -8px -8px 20px rgba(255,255,255,0.85)',
    borderTop: `3px solid ${accentColor}`,
    padding: 0,
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: isNotBuilt ? 'default' : 'pointer',
    opacity: isNotBuilt ? 0.6 : 1,
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }

  const hoverStyle = {
    transform: 'translateY(-4px)',
    boxShadow: '14px 14px 32px rgba(0,0,0,0.12), -14px -14px 32px rgba(255,255,255,0.9)'
  }

  const renderCTA = () => {
    if (isNotBuilt) {
      return (
        <button
          style={{
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid var(--sampada-gold, #C9A84C)',
            color: 'var(--sampada-gold, #C9A84C)',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: 'var(--font-sans, Inter, sans-serif)',
            cursor: 'default'
          }}
        >
          Plan & Build →
        </button>
      )
    }
    // Check for null or undefined href specifically
    if (module.href == null) {
      return null
    }
    const ctaStyle = {
      padding: '8px 16px',
      background: module.external ? '#059669' : 'var(--sampada-crimson, #8B1A1A)',
      color: 'white',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: 600,
      fontFamily: 'var(--font-sans, Inter, sans-serif)',
      display: 'inline-block',
      pointerEvents: 'none',
    }
    return (
      <span style={ctaStyle}>
        {module.external ? 'Visit Store ↗' : `Open ${module.label} →`}
      </span>
    )
  }

  const handleCardClick = () => {
    if (isNotBuilt || !module.href) return
    if (module.external) {
      window.open(module.href, '_blank', 'noopener,noreferrer')
      return
    }
    router.push(module.href)
  }

  const renderMiniStats = () => {
    if (isNotBuilt) {
      return (
        <div style={{
          fontFamily: 'var(--font-sans, Inter, sans-serif)',
          fontSize: '12px',
          fontStyle: 'italic',
          color: 'rgba(26,10,8,0.4)',
          textAlign: 'center',
          padding: '20px'
        }}>
          This section is planned for a future sprint
        </div>
      )
    }

    if (!module.fetchUrl) {
      return (
        <div style={{ padding: '0 20px' }}>
          <div style={{
            fontFamily: 'var(--font-sans, Inter, sans-serif)',
            fontSize: '11px',
            color: 'rgba(26,10,8,0.6)',
            textAlign: 'center',
            padding: '16px 0'
          }}>
            No live data available
          </div>
        </div>
      )
    }

    if (loading) {
      return (
        <div style={{ padding: '0 20px' }}>
          <Skeleton height="16px" width="80%" style={{ marginBottom: '8px' }} />
          <Skeleton height="16px" width="60%" style={{ marginBottom: '8px' }} />
          <Skeleton height="16px" width="70%" />
        </div>
      )
    }

    if (error || !stats) {
      return (
        <div style={{ padding: '0 20px' }}>
          <div style={{
            fontFamily: 'var(--font-sans, Inter, sans-serif)',
            fontSize: '11px',
            color: 'rgba(26,10,8,0.4)',
            textAlign: 'center',
            padding: '16px 0'
          }}>
            Data unavailable
          </div>
        </div>
      )
    }

    if (!module.stats || !module.stats.length) {
      return null
    }

    return (
      <div style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '8px' }}>
        {module.stats.map((stat, i) => (
          <div key={i} style={{
            fontFamily: 'var(--font-sans, Inter, sans-serif)',
            fontSize: '11px',
            color: 'rgba(26,10,8,0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}>
            <span style={{ fontWeight: 600, fontSize: '16px', color: 'var(--sampada-dark, #1A0A08)' }}>
              {stats[stat.key] !== undefined ? stats[stat.key] : '—'}
            </span>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      role={!isNotBuilt && module.href ? 'link' : undefined}
      tabIndex={!isNotBuilt && module.href ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (!isNotBuilt && module.href && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleCardClick()
        }
      }}
      style={cardStyle}
      onMouseEnter={isNotBuilt ? undefined : (e) => Object.assign(e.currentTarget.style, hoverStyle)}
      onMouseLeave={isNotBuilt ? undefined : (e) => Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: '8px 8px 20px rgba(0,0,0,0.08), -8px -8px 20px rgba(255,255,255,0.85)' })}
    >
      {/* CARD HEADER */}
      <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            flexShrink: 0
          }}>
            {module.icon}
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-serif, "Libre Baskerville", Georgia, serif)',
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--sampada-dark, #1A0A08)'
            }}>
              {module.label}
            </div>
            <div style={{
              fontFamily: 'var(--font-sans, Inter, sans-serif)',
              fontSize: '13px',
              color: 'rgba(26,10,8,0.5)',
              marginTop: '2px',
              maxWidth: '280px'
            }}>
              {module.description}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '10px',
            fontWeight: 600,
            fontFamily: 'var(--font-sans, Inter, sans-serif)',
            ...statusStyle
          }}>
            <span>{statusStyle.dot}</span>
            {module.status === 'active' && 'Active'}
            {module.status === 'needs-review' && 'Review'}
            {module.status === 'action-required' && 'Action'}
            {module.status === 'not-built' && 'Planned'}
          </span>
          {module.badge && (
            <span style={{
              background: 'var(--sampada-crimson, #8B1A1A)',
              color: 'white',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '2px',
              padding: '2px 8px',
              borderRadius: '10px',
              fontFamily: 'var(--font-sans, Inter, sans-serif)',
              textTransform: 'uppercase'
            }}>
              {module.badge}
            </span>
          )}
        </div>
      </div>

      {/* CARD DIVIDER */}
      <div style={{ 
        borderTop: '1px solid rgba(201,168,76,0.15)', 
        margin: '16px 0' 
      }} />

      {/* CARD BODY */}
      <div style={{ flex: 1 }}>
        {renderMiniStats()}
        <div style={{ padding: '0 20px 16px', textAlign: 'right' }}>
          <span style={{
            fontFamily: 'var(--font-sans, Inter, sans-serif)',
            fontSize: '10px',
            color: 'rgba(26,10,8,0.4)'
          }}>
            {formatRelativeTime(lastUpdated)}
          </span>
        </div>
      </div>

      {/* CARD FOOTER */}
      <div style={{ padding: '16px 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(201,168,76,0.08)', marginTop: 'auto' }}>
        <div>
          {renderCTA()}
        </div>
        {module.drilldown && !isNotBuilt && (
          <Link
            href={module.drilldown}
            data-card-action="true"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: 'var(--font-sans, Inter, sans-serif)',
              fontSize: '11px',
              color: 'var(--sampada-gold, #C9A84C)',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Drill Down →
          </Link>
        )}
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
