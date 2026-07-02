import Link from 'next/link'

export default function AlertStrip({ alerts = [] }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div style={{
        background: '#D1FAE5',
        borderLeft: '4px solid #059669',
        padding: '12px 28px',
        marginBottom: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans, "Inter", sans-serif)',
        fontSize: '13px',
        color: '#065F46',
        fontWeight: 500
      }}>
        ✓ धर्मो रक्षति रक्षितः — Everything is running smoothly today
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(139,26,26,0.04)',
      borderTop: '3px solid var(--sampada-crimson, #8B1A1A)',
      padding: '12px 28px',
      marginBottom: '4px',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }}>
      <style>{`
        &::-webkit-scrollbar { display: none; }
      `}</style>
      <div style={{
        display: 'flex',
        gap: '12px',
        minWidth: 'max-content'
      }}>
{alerts.map((alert, index) => (
  alert.href ? (
    <div
      key={index}
      style={{
        background: 'white',
        borderLeft: '4px solid var(--sampada-crimson, #8B1A1A)',
        borderRadius: '0 10px 10px 0',
        padding: '12px 16px',
        minWidth: '260px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexShrink: 0
      }}
    >
      <span style={{ fontSize: '24px', lineHeight: 1 }}>{alert.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-sans, "Inter", sans-serif)',
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--sampada-dark, #1A0A08)'
        }}>
          {alert.title}
        </div>
        <div style={{
          fontFamily: 'var(--font-sans, "Inter", sans-serif)',
          fontSize: '11px',
          color: 'rgba(26,10,8,0.5)',
          marginTop: '2px'
        }}>
          {alert.subtitle}
        </div>
      </div>
      <Link
        href={alert.href}
        style={{
          fontFamily: 'var(--font-sans, "Inter", sans-serif)',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--sampada-crimson, #8B1A1A)',
          textDecoration: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        Fix →
      </Link>
    </div>
  ) : null
))}
      </div>
    </div>
  )
}