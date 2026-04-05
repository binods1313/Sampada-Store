import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

const COMMANDS = [
  { icon: '⬡', label: 'Dashboard', href: '/admin', shortcut: 'G D' },
  { icon: '◫', label: 'All Products', href: '/admin/products', shortcut: 'G P' },
  { icon: '＋', label: 'Add Product', href: '/admin/products/add', shortcut: 'N P' },
  { icon: '◉', label: 'Categories', href: '/admin/categories', shortcut: 'G C' },
  { icon: '◈', label: 'Bulk Tag', href: '/admin/bulk-tag', shortcut: '' },
  { icon: '◳', label: 'Orders', href: '/admin/orders', shortcut: 'G O' },
  { icon: '◯', label: 'Users', href: '/admin/users', shortcut: 'G U' },
  { icon: '◷', label: 'Reviews', href: '/admin/reviews', shortcut: '' },
  { icon: '◬', label: 'AI Tools', href: '/admin/ai-tools', shortcut: '' },
  { icon: '◨', label: 'Analytics', href: '/admin/analytics', shortcut: 'G A' },
  { icon: '◎', label: 'Settings', href: '/admin/settings', shortcut: ',' },
  { icon: '🌐', label: 'View Store', href: '/', external: true, shortcut: '' },
  { icon: '🎨', label: 'Sanity Studio', href: '/studio', external: true, shortcut: '' },
]

export default function CommandPalette({ onClose }) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef(null)

  const filtered = COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => (i + 1) % filtered.length)
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => (i - 1 + filtered.length) % filtered.length)
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const cmd = filtered[selectedIndex]
        if (cmd) {
          if (cmd.external) {
            window.open(cmd.href, '_blank')
          } else {
            router.push(cmd.href)
          }
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [filtered, selectedIndex, onClose, router])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '100px'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#1a1a1a',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: '12px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          animation: 'scaleIn 0.2s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      >
        {/* Search input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(201,168,76,0.12)'
        }}>
          <span style={{ fontSize: '18px', color: '#888', marginRight: '12px' }}>⌕</span>
          <input
            ref={inputRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '15px',
              outline: 'none'
            }}
          />
          <kbd style={{
            fontSize: '11px',
            color: '#888',
            background: '#0f0f0f',
            border: '1px solid #333',
            borderRadius: '4px',
            padding: '2px 6px'
          }}>ESC</kbd>
        </div>

        {/* Results */}
        <div style={{
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {filtered.length === 0 ? (
            <div style={{
              padding: '32px 20px',
              textAlign: 'center',
              color: '#888',
              fontSize: '14px'
            }}>
              No commands found
            </div>
          ) : (
            filtered.map((cmd, index) => (
              <div
                key={cmd.href}
                onClick={() => {
                  if (cmd.external) {
                    window.open(cmd.href, '_blank')
                  } else {
                    router.push(cmd.href)
                  }
                  onClose()
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  background: index === selectedIndex ? 'rgba(201,168,76,0.1)' : 'transparent',
                  color: index === selectedIndex ? '#C9A84C' : '#888',
                  transition: 'all 0.1s',
                  borderLeft: index === selectedIndex ? '3px solid #C9A84C' : '3px solid transparent'
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{cmd.icon}</span>
                <span style={{ flex: 1, fontSize: '14px' }}>{cmd.label}</span>
                {cmd.shortcut && (
                  <kbd style={{
                    fontSize: '10px',
                    color: '#888',
                    background: '#0f0f0f',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    padding: '2px 6px'
                  }}>{cmd.shortcut}</kbd>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
