import Link from 'next/link'
import { useRouter } from 'next/router'

const NAV = [
  {
    section: 'Content',
    items: [
      { icon: '⬡', label: 'Dashboard', href: '/admin', badge: null },
      { icon: '◫', label: 'Products', href: '/admin/products', badge: null },
      { icon: '◉', label: 'Categories', href: '/admin/categories', badge: null },
      { icon: '◈', label: 'Bulk Tag', href: '/admin/bulk-tag', badge: null },
    ]
  },
  {
    section: 'Management',
    items: [
      { icon: '◳', label: 'Orders', href: '/admin/orders', badge: 'new' },
      { icon: '◯', label: 'Users', href: '/admin/users', badge: null },
      { icon: '◷', label: 'Reviews', href: '/admin/reviews', badge: null },
    ]
  },
  {
    section: 'Tools',
    items: [
      { icon: '◬', label: 'AI Tools', href: '/admin/ai-tools', badge: null },
      { icon: '◨', label: 'Analytics', href: '/admin/analytics', badge: null },
      { icon: '◎', label: 'Settings', href: '/admin/settings', badge: null },
    ]
  }
]

export default function AdminSidebar({ collapsed, onToggle }) {
  const router = useRouter()

  const isActive = (href) => {
    if (href === '/admin') return router.pathname === '/admin'
    return router.pathname.startsWith(href)
  }

  return (
    <aside style={{
      width: collapsed ? '64px' : '240px',
      height: '100vh',
      background: '#141414',
      borderRight: '1px solid rgba(201,168,76,0.12)',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      overflow: 'hidden',
      transition: 'width 0.25s ease'
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 0' : '20px',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        minHeight: '64px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          flexShrink: 0,
          background: 'linear-gradient(135deg, #8B1A1A, #C9A84C)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: '900',
          color: 'white',
          fontFamily: 'serif'
        }}>स</div>
        {!collapsed && (
          <div>
            <div style={{
              fontSize: '15px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #C9A84C, #a8882e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Sampada</div>
            <div style={{ fontSize: '10px', color: '#555', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: collapsed ? '12px 0' : '12px' }}>
        {NAV.map(group => (
          <div key={group.section} style={{ marginBottom: '4px' }}>
            {!collapsed && (
              <div style={{
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#444',
                padding: '12px 12px 4px'
              }}>{group.section}</div>
            )}
            {group.items.map(item => {
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: collapsed ? '0' : '10px',
                    padding: collapsed ? '10px 0' : '9px 12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: collapsed ? '0' : '8px',
                    marginBottom: '2px',
                    cursor: 'pointer',
                    position: 'relative',
                    background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: active ? '#C9A84C' : '#888',
                    fontSize: '13px',
                    fontWeight: active ? '600' : '400',
                    transition: 'all 0.15s ease',
                    borderLeft: active && !collapsed ? '3px solid #C9A84C' : '3px solid transparent'
                  }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.background = 'rgba(201,168,76,0.05)'
                        e.currentTarget.style.color = '#bbb'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#888'
                      }
                    }}
                  >
                    <span style={{ fontSize: '15px', width: '18px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                    {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span style={{
                        background: '#8B1A1A',
                        color: 'white',
                        fontSize: '9px',
                        fontWeight: '700',
                        padding: '2px 5px',
                        borderRadius: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>{item.badge}</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        style={{
          margin: '12px',
          padding: '10px',
          background: 'rgba(201,168,76,0.06)',
          border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: '8px',
          cursor: 'pointer',
          color: '#C9A84C',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: '8px',
          transition: 'all 0.15s'
        }}
      >
        <span style={{
          transform: collapsed ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.25s',
          display: 'inline-block'
        }}>◀</span>
        {!collapsed && <span style={{ fontSize: '12px', color: '#777' }}>Collapse</span>}
      </button>

      {/* Admin profile */}
      {!collapsed && (
        <div style={{
          padding: '14px 16px',
          borderTop: '1px solid rgba(201,168,76,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            flexShrink: 0,
            background: 'linear-gradient(135deg, #8B1A1A, #C9A84C)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '13px'
          }}>A</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', color: '#fff', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin</div>
            <div style={{ fontSize: '11px', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>sampada.com</div>
          </div>
          <a href="/api/logout-admin" style={{ marginLeft: 'auto', color: '#555', fontSize: '12px', textDecoration: 'none' }} title="Logout">⏻</a>
        </div>
      )}
    </aside>
  )
}
