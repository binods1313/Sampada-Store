import Link from 'next/link'

export default function BrandFooter() {
  return (
    <div style={{
      background: 'var(--sampada-dark, #1A0A08)',
      padding: '20px 28px',
      borderRadius: '0 0 16px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
      marginTop: '24px'
    }}>
      {/* LEFT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <img
          src="/images/sampada-logo.png"
          alt="Sampada"
          height={24}
          style={{ display: 'block' }}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <span style={{
          fontFamily: 'var(--font-sans, Inter, sans-serif)',
          fontSize: '12px',
          color: 'white'
        }}>
          Sampada Originals Admin
        </span>
        <span style={{
          fontFamily: 'var(--font-sanskrit, "Tiro Devanagari Sanskrit", serif)',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.4)'
        }}>
          धर्मो रक्षति रक्षितः
        </span>
      </div>

      {/* CENTER */}
      <div style={{
        fontFamily: 'var(--font-sans, Inter, sans-serif)',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.3)'
      }}>
        Build · June 2026 · Next.js 16
      </div>

      {/* RIGHT */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link
          href="https://sanity.io"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-sans, Inter, sans-serif)',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'white' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
        >
          Sanity Studio ↗
        </Link>
        <Link
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-sans, Inter, sans-serif)',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'white' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
        >
          Vercel ↗
        </Link>
        <Link
          href="https://console.x.ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-sans, Inter, sans-serif)',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'white' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
        >
          console.x.ai ↗
        </Link>
      </div>
    </div>
  )
}