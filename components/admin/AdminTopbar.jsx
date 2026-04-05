import { useState } from 'react'
import { useRouter } from 'next/router'
import { Menu, Search, Bell, ExternalLink, Command } from 'lucide-react'

export default function AdminTopbar({ title, sidebarWidth, onMenuClick }) {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      router.push(`/admin/products?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header className="admin-topbar" style={{
      left: `${sidebarWidth}px`,
      transition: 'left 0.25s ease'
    }}>
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="admin-btn mobile-menu-btn"
        style={{ display: 'none', padding: 'var(--admin-space-2)' }}
      >
        <Menu style={{ width: '20px', height: '20px', color: 'var(--admin-gold)' }} />
      </button>

      <h1 className="admin-heading" style={{ margin: 0, flexShrink: 0, fontSize: 'var(--admin-text-lg)' }}>
        {title}
      </h1>

      {/* Search */}
      <div className="admin-topbar-search" style={{ flex: 1, maxWidth: '320px', position: 'relative', marginLeft: 'var(--admin-space-4)' }}>
        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)', width: '14px', height: '14px' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search products... (Enter)"
          aria-label="Search products"
          className="admin-input"
          style={{
            width: '100%',
            paddingLeft: '32px',
            paddingRight: '80px',
            fontSize: 'var(--admin-text-sm)'
          }}
        />
        <kbd style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '10px',
          color: 'var(--admin-text-muted)',
          background: 'var(--admin-surface-0)',
          border: 'var(--admin-border-width-sm) solid #333',
          borderRadius: 'var(--admin-radius-sm)',
          padding: '2px 5px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Command style={{ width: '10px', height: '10px' }} />K
        </kbd>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--admin-space-2)' }}>
        {/* View site */}
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-secondary" style={{
          padding: 'var(--admin-space-2) var(--admin-space-3)',
          fontSize: 'var(--admin-text-xs)',
          gap: '4px'
        }}>
          <ExternalLink style={{ width: '12px', height: '12px' }} />
          View Store
        </a>

        {/* Notification bell */}
        <button
          aria-label="Notifications"
          className="admin-btn"
          style={{ width: '36px', height: '36px', padding: 0, position: 'relative' }}
        >
          <Bell style={{ width: '16px', height: '16px', color: 'var(--admin-text-secondary)' }} />
          <div style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            background: 'var(--admin-red)',
            borderRadius: '50%',
            border: '2px solid var(--admin-surface-1)'
          }} />
        </button>

        {/* Avatar */}
        <button
          aria-label="User profile menu"
          className="admin-avatar-btn"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--admin-red), var(--admin-gold))',
            border: '2px solid var(--admin-gold-border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'var(--admin-font-bold)',
            fontSize: 'var(--admin-text-sm)',
            cursor: 'pointer',
            padding: 0
          }}
        >A</button>
      </div>

      <style jsx global>{`
        .admin-topbar {
          height: var(--admin-topbar-height);
          background: var(--admin-surface-1);
          border-bottom: var(--admin-border-width-sm) solid var(--admin-border-subtle);
          position: fixed;
          top: 0;
          right: 0;
          z-index: var(--admin-z-sticky);
          display: flex;
          align-items: center;
          padding: 0 var(--admin-space-6);
          gap: var(--admin-space-4);
        }
        .mobile-menu-btn {
          display: none !important;
        }
        @media (max-width: 768px) {
          .admin-topbar {
            left: 0 !important;
            padding: 0 var(--admin-space-4);
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .admin-topbar-search {
            display: none;
          }
        }
      `}</style>
    </header>
  )
}
