import Link from 'next/link'

function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Just now'
  const diff = Date.now() - new Date(timestamp).getTime()
  const secs = Math.floor(diff / 1000)
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (secs < 60) return 'Just now'
  if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${days} day${days > 1 ? 's' : ''} ago`
}

const typeColors = {
  order: 'var(--sampada-crimson, #8B1A1A)',
  product: 'var(--sampada-gold, #C9A84C)',
  ai: '#6366F1',
  support: '#0EA5E9'
}

export default function ActivityFeed({ feed = [], loading = true, refreshing = false }) {
  if (loading) {
    return (
      <div style={{
        background: '#FDF6EC',
        borderRadius: '24px',
        boxShadow: '8px 8px 20px rgba(0,0,0,0.08), -8px -8px 20px rgba(255,255,255,0.85)',
        borderTop: '3px solid var(--sampada-gold, #C9A84C)',
        padding: '24px 28px',
        margin: '24px 28px 0'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <span style={{
            fontFamily: 'var(--font-serif, "Libre Baskerville", Georgia, serif)',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--sampada-dark, #1A0A08)'
          }}>
            ⚡ Recent Activity
          </span>
          <span style={{
            fontFamily: 'var(--font-sans, Inter, sans-serif)',
            fontSize: '11px',
            color: 'rgba(26,10,8,0.4)'
          }}>
            Loading...
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
              padding: '12px 0',
              borderBottom: '1px solid rgba(201,168,76,0.08)'
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'rgba(201,168,76,0.3)',
                marginTop: '5px',
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  height: '16px',
                  width: '60%',
                  borderRadius: '8px',
                  background: 'linear-gradient(90deg, rgba(201,168,76,0.08), rgba(201,168,76,0.15), rgba(201,168,76,0.08))',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite'
                }} />
                <div style={{
                  height: '12px',
                  width: '40%',
                  borderRadius: '8px',
                  background: 'linear-gradient(90deg, rgba(201,168,76,0.08), rgba(201,168,76,0.15), rgba(201,168,76,0.08))',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  marginTop: '4px'
                }} />
              </div>
            </div>
          ))}
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

  if (!feed || feed.length === 0) {
    return (
      <div style={{
        background: '#FDF6EC',
        borderRadius: '24px',
        boxShadow: '8px 8px 20px rgba(0,0,0,0.08), -8px -8px 20px rgba(255,255,255,0.85)',
        borderTop: '3px solid var(--sampada-gold, #C9A84C)',
        padding: '40px 28px',
        margin: '24px 28px 0',
        textAlign: 'center'
      }}>
        <div style={{
          fontFamily: 'var(--font-sans, Inter, sans-serif)',
          fontSize: '14px',
          color: 'rgba(26,10,8,0.5)',
          marginBottom: '16px'
        }}>
          Your store activity will appear here as orders come in
        </div>
        <Link
          href="https://sampadaoriginals.in"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-sans, Inter, sans-serif)',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--sampada-crimson, #8B1A1A)',
            textDecoration: 'underline'
          }}
        >
          Share your store →
        </Link>
      </div>
    )
  }

  return (
    <div style={{
      background: '#FDF6EC',
      borderRadius: '24px',
      boxShadow: '8px 8px 20px rgba(0,0,0,0.08), -8px -8px 20px rgba(255,255,255,0.85)',
      borderTop: '3px solid var(--sampada-gold, #C9A84C)',
      padding: '24px 28px',
      margin: '24px 28px 0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <span style={{
          fontFamily: 'var(--font-serif, "Libre Baskerville", Georgia, serif)',
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--sampada-dark, #1A0A08)'
        }}>
          ⚡ Recent Activity
        </span>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-sans, Inter, sans-serif)',
          fontSize: '11px',
          color: 'rgba(26,10,8,0.4)'
        }}>
          <span>Last updated just now</span>
          {refreshing && (
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              border: '2px solid var(--sampada-gold, #C9A84C)',
              borderTopColor: 'transparent',
              animation: 'spin 1s linear infinite'
            }} />
          )}
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
  {feed.map((item, index) => {
    if (!item.href) return null;
    return (
      <Link
        key={index}
        href={item.href}
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start',
          padding: '12px 0',
          borderBottom: index < feed.length - 1 ? '1px solid rgba(201,168,76,0.08)' : 'none',
          textDecoration: 'none',
          color: 'inherit',
          transition: 'background 0.15s, margin 0.15s, padding 0.15s',
          margin: '0 -28px',
          paddingLeft: '28px',
          paddingRight: '28px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(201,168,76,0.04)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: item.color || typeColors[item.type] || typeColors.order,
          marginTop: '5px',
          flexShrink: 0
        }} />
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-sans, Inter, sans-serif)',
            fontSize: '13px',
            color: 'var(--sampada-dark, #1A0A08)',
            lineHeight: 1.4
          }}>
            {item.text}
          </div>
          <div style={{
            fontFamily: 'var(--font-sans, Inter, sans-serif)',
            fontSize: '11px',
            color: 'rgba(26,10,8,0.4)',
            marginTop: '2px'
          }}>
            {formatRelativeTime(item.timestamp)}
          </div>
        </div>
        <div style={{
          fontSize: '14px',
          color: 'var(--sampada-gold, #C9A84C)',
          opacity: 0,
          transition: 'opacity 0.15s',
          flexShrink: 0
        }}>
          →
        </div>
        <style jsx>{`
          a:hover div:last-child { opacity: 1; }
        `}</style>
      </Link>
    );
  })}
</div>
    </div>
  )
}