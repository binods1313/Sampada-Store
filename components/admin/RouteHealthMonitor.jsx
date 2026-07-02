import { useState, useEffect } from 'react'

const ROUTES_TO_CHECK = [
  // Customer-facing
  '/', '/shop', '/stories', '/blog', '/careers',
  '/documentation', '/about', '/contact', '/support',
  '/creative-studio', '/privacy-policy', '/terms-and-conditions',
  // Admin
  '/admin', '/admin/products', '/admin/categories',
  '/admin/orders', '/admin/analytics', '/admin/ai-tools',
  '/admin/ai-hub', '/admin/bulk-tag', '/admin/seo/bulk-generate',
  '/admin/dashboard/orders', '/admin/dashboard/products', '/admin/dashboard/ai-usage'
]

const NOT_BUILT_ROUTES = new Set([
  '/admin/users', '/admin/reviews', '/admin/settings',
  '/admin/dashboard/users', '/admin/dashboard/reviews'
])

const statusConfig = {
  200: { icon: '✅', label: '200 OK', color: '#059669', bg: '#D1FAE5', border: '#A7F3D0' },
  301: { icon: '⚠️', label: '301 Redirect', color: '#92400E', bg: '#FEF3C7', border: '#FDE68A' },
  302: { icon: '⚠️', label: '302 Redirect', color: '#92400E', bg: '#FEF3C7', border: '#FDE68A' },
  404: { icon: '❌', label: '404 Not Found', color: '#991B1B', bg: '#FEE2E2', border: '#FECACA' },
  'not-built': { icon: '⚪', label: 'Not Built', color: '#64748B', bg: '#F1F5F9', border: '#E2E8F0' },
  checking: { icon: '⏳', label: 'Checking...', color: '#C9A84C', bg: '#FEFCE8', border: '#FDE68A' },
  error: { icon: '❌', label: 'Error', color: '#991B1B', bg: '#FEE2E2', border: '#FECACA' }
}

function fetchWithTimeout(url, options = {}, timeout = 5000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
  ])
}

export default function RouteHealthMonitor() {
  const [expanded, setExpanded] = useState(false)
  const [results, setResults] = useState({})
  const [checking, setChecking] = useState(false)

  // Initialize with not-built routes
  useEffect(() => {
    const initial = {}
    NOT_BUILT_ROUTES.forEach(route => {
      initial[route] = { status: 'not-built', responseTime: null }
    })
    setResults(initial)
  }, [])

  useEffect(() => {
    if (expanded) {
      runChecks()
    }
  }, [expanded])

  const runChecks = async () => {
    setChecking(true)
    const newResults = { ...results }
    
    // Reset checking routes
    Object.keys(newResults).forEach(route => {
      if (newResults[route].status === 'checking') {
        newResults[route] = { status: 'checking', responseTime: null }
      }
    })
    
    // Add routes to check
    ROUTES_TO_CHECK.forEach(route => {
      if (!newResults[route]) {
        newResults[route] = { status: 'checking', responseTime: null }
      }
    })
    
    setResults(newResults)

    // Check each route
    const promises = ROUTES_TO_CHECK.map(async (route) => {
      const start = performance.now()
      try {
        const res = await fetchWithTimeout(route, { method: 'HEAD' }, 5000)
        const responseTime = Math.round(performance.now() - start)
        return { route, status: res.status, responseTime }
      } catch (error) {
        const responseTime = Math.round(performance.now() - start)
        if (error.message === 'Timeout') {
          return { route, status: 'timeout', responseTime }
        }
        return { route, status: 'error', responseTime }
      }
    })

    const checkResults = await Promise.allSettled(promises)
    
    const finalResults = { ...newResults }
    checkResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { route, status, responseTime } = result.value
        finalResults[route] = { status, responseTime }
      } else {
        const route = ROUTES_TO_CHECK[checkResults.indexOf(result)]
        finalResults[route] = { status: 'error', responseTime: null }
      }
    })

    setResults(finalResults)
    setChecking(false)
  }

  const copyReport = () => {
    const lines = ['Sampada Admin — Route Health Report', '='.repeat(40), '']
    Object.entries(results).forEach(([route, data]) => {
      const config = statusConfig[data.status] || statusConfig.error
      const time = data.responseTime ? ` (${data.responseTime}ms)` : ''
      lines.push(`${config.icon} ${route} — ${config.label}${time}`)
    })
    lines.push('', `Generated: ${new Date().toLocaleString()}`)
    navigator.clipboard.writeText(lines.join('\n'))
  }

  const sortedRoutes = [...ROUTES_TO_CHECK].sort()
  const notBuiltSorted = [...NOT_BUILT_ROUTES].sort()

if (!expanded) {
    return (
      <div style={{
        background: '#FDF6EC',
        borderRadius: '24px',
        boxShadow: '8px 8px 20px rgba(0,0,0,0.08), -8px -8px 20px rgba(255,255,255,0.85)',
        borderTop: '3px solid var(--sampada-gold, #C9A84C)',
        padding: '16px 28px',
        margin: '24px 28px 0',
        cursor: 'pointer',
        transition: 'all 0.2s',
        userSelect: 'none'
      }}
      onClick={() => setExpanded(true)}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '14px 14px 32px rgba(0,0,0,0.12), -14px -14px 32px rgba(255,255,255,0.9)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '8px 8px 20px rgba(0,0,0,0.08), -8px -8px 20px rgba(255,255,255,0.85)' }}
      >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{
          fontFamily: 'var(--font-sans, Inter, sans-serif)',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--sampada-dark, #1A0A08)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🔍 Route Health Monitor
        </span>
        <span style={{
          fontFamily: 'var(--font-sans, Inter, sans-serif)',
          fontSize: '12px',
          color: 'var(--sampada-gold, #C9A84C)',
          transition: 'transform 0.2s'
        }}>
          ▼
        </span>
      </div>
    </div>
  );
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
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <span style={{
          fontFamily: 'var(--font-sans, Inter, sans-serif)',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--sampada-dark, #1A0A08)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🔍 Route Health Monitor
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setExpanded(false)}
            style={{
              padding: '6px 12px',
              background: 'transparent',
              border: '1px solid var(--sampada-gold, #C9A84C)',
              color: 'var(--sampada-gold, #C9A84C)',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: 'var(--font-sans, Inter, sans-serif)',
              cursor: 'pointer'
            }}
          >
            Collapse ▲
          </button>
          <button
            onClick={runChecks}
            disabled={checking}
            style={{
              padding: '6px 12px',
              background: 'var(--sampada-crimson, #8B1A1A)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: 'var(--font-sans, Inter, sans-serif)',
              cursor: checking ? 'not-allowed' : 'pointer',
              opacity: checking ? 0.6 : 1
            }}
          >
            {checking ? '⏳ Re-checking...' : 'Re-check All'}
          </button>
          <button
            onClick={copyReport}
            style={{
              padding: '6px 12px',
              background: 'transparent',
              border: '1px solid var(--sampada-gold, #C9A84C)',
              color: 'var(--sampada-gold, #C9A84C)',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: 'var(--font-sans, Inter, sans-serif)',
              cursor: 'pointer'
            }}
          >
            Copy Report
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px'
      }}>
        {sortedRoutes.map(route => {
          const data = results[route] || { status: 'checking', responseTime: null }
          const config = statusConfig[data.status] || statusConfig.error
          const isChecking = data.status === 'checking'
          
          return (
            <div
              key={route}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                background: config.bg,
                border: `1px solid ${config.border}`,
                borderRadius: '10px',
                transition: 'all 0.2s'
              }}
            >
              <code style={{
                fontFamily: 'var(--font-mono, JetBrains Mono, monospace)',
                fontSize: '12px',
                color: 'var(--sampada-dark, #1A0A08)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '200px'
              }}>
                {route}
              </code>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0
              }}>
                <span style={{
                  fontSize: isChecking ? '14px' : '16px',
                  animation: isChecking ? 'pulse 1.5s ease-in-out infinite' : 'none'
                }}>
                  {config.icon}
                </span>
                <span style={{
                  fontFamily: 'var(--font-sans, Inter, sans-serif)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: config.color,
                  whiteSpace: 'nowrap'
                }}>
                  {config.label}
                </span>
                {data.responseTime && (
                  <span style={{
                    fontFamily: 'var(--font-mono, JetBrains Mono, monospace)',
                    fontSize: '10px',
                    color: 'rgba(26,10,8,0.4)'
                  }}>
                    {data.responseTime}ms
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}