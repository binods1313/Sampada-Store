import { useState } from 'react'
import { useRouter } from 'next/router'

export default function AdminTopbar({ title, sidebarWidth }) {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      router.push(`/admin/products?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header style={{
      height: '64px',
      background: '#141414',
      borderBottom: '1px solid rgba(201,168,76,0.12)',
      position: 'fixed',
      top: 0,
      left: `${sidebarWidth}px`,
      right: 0,
      zIndex: 99,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: '16px',
      transition: 'left 0.25s ease'
    }}>
      <h1 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: 0, flexShrink: 0 }}>
        {title}
      </h1>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: '320px', position: 'relative', marginLeft: '16px' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#444', fontSize: '13px' }}>⌕</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search products... (Enter)"
          style={{
            width: '100%',
            background: '#1a1a1a',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '8px',
            padding: '8px 14px 8px 32px',
            color: '#fff',
            fontSize: '13px',
            outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = '#C9A84C'}
          onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.15)'}
        />
        <kbd style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '10px',
          color: '#444',
          background: '#0f0f0f',
          border: '1px solid #333',
          borderRadius: '4px',
          padding: '2px 5px'
        }}>⌘K</kbd>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* View site */}
        <a href="/" target="_blank" rel="noopener noreferrer" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '7px 12px',
          background: 'transparent',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: '7px',
          color: '#C9A84C',
          fontSize: '12px',
          fontWeight: '600',
          textDecoration: 'none',
          transition: 'all 0.15s'
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          ↗ View Store
        </a>

        {/* Notification bell */}
        <button style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: '#1a1a1a',
          border: '1px solid rgba(201,168,76,0.15)',
          color: '#888',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          fontSize: '15px'
        }}>
          🔔
          <div style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            background: '#8B1A1A',
            borderRadius: '50%',
            border: '2px solid #1a1a1a'
          }} />
        </button>

        {/* Avatar */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8B1A1A, #C9A84C)',
          border: '2px solid rgba(201,168,76,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: '700',
          fontSize: '13px',
          cursor: 'pointer'
        }}>A</div>
      </div>
    </header>
  )
}
