import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { ChevronLeft, Package, LayoutGrid, List, Tag, ShoppingCart, Users, Star, Sparkles, BarChart3, Settings, LogOut } from 'lucide-react'

const NAV = [
  {
    section: 'Content',
    items: [
      { icon: LayoutGrid, label: 'Dashboard', href: '/admin', badge: null },
      { icon: Package, label: 'Products', href: '/admin/products', badge: null },
      { icon: List, label: 'Categories', href: '/admin/categories', badge: null },
      { icon: Tag, label: 'Bulk Tag', href: '/admin/bulk-tag', badge: null },
    ]
  },
  {
    section: 'Management',
    items: [
      { icon: ShoppingCart, label: 'Orders', href: '/admin/orders', badge: 'new' },
      { icon: Users, label: 'Users', href: '/admin/users', badge: null },
      { icon: Star, label: 'Reviews', href: '/admin/reviews', badge: null },
    ]
  },
  {
    section: 'Tools',
    items: [
      { icon: Sparkles, label: 'AI Tools', href: '/admin/ai-tools', badge: null },
      { icon: BarChart3, label: 'Analytics', href: '/admin/analytics', badge: null },
      { icon: Settings, label: 'Settings', href: '/admin/settings', badge: null },
    ]
  }
]

export default function AdminSidebar({ collapsed, onToggle, mobileOpen }) {
  const router = useRouter()

  // Auto-collapse on mobile
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768 && !collapsed) {
        onToggle()
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const isActive = (href) => {
    if (href === '/admin') return router.pathname === '/admin'
    return router.pathname.startsWith(href)
  }

  return (
    <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`} style={{
      width: collapsed ? 'var(--admin-sidebar-width-collapsed)' : 'var(--admin-sidebar-width-expanded)',
      transition: 'var(--admin-transition-slow)'
    }}>
      {/* Logo */}
      <div className="admin-sidebar-logo" style={{
        padding: collapsed ? 'var(--admin-space-4) 0' : 'var(--admin-space-4)',
        borderBottom: 'var(--admin-border-width-sm) solid var(--admin-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? '0' : 'var(--admin-space-3)',
        justifyContent: collapsed ? 'center' : 'flex-start',
        minHeight: 'var(--admin-topbar-height)'
      }}>
        <img
          src="/images/Logo_16.png"
          alt="Sampada"
          style={{
            height: collapsed ? '32px' : '40px',
            width: 'auto',
            objectFit: 'contain',
            flexShrink: 0
          }}
        />
        {!collapsed && (
          <div className="admin-text-xs admin-text-tertiary admin-font-semibold" style={{ letterSpacing: 'var(--admin-tracking-wide)', textTransform: 'uppercase' }}>Admin</div>
        )}
      </div>

      {/* Nav */}
      <nav className="admin-sidebar-nav" style={{ flex: 1, overflowY: 'auto', padding: collapsed ? 'var(--admin-space-3) 0' : 'var(--admin-space-3)' }}>
        {NAV.map(group => (
          <div key={group.section} style={{ marginBottom: 'var(--admin-space-1)' }}>
            {!collapsed && (
              <div className="admin-text-xs admin-font-bold" style={{ color: 'var(--admin-text-tertiary)', padding: 'var(--admin-space-3) var(--admin-space-3) var(--admin-space-1)', letterSpacing: 'var(--admin-tracking-wider)', textTransform: 'uppercase' }}>{group.section}</div>
            )}
            {group.items.map(item => {
              const active = isActive(item.href)
              const IconComponent = item.icon
              return (
                <Link key={item.href} href={item.href} className="admin-sidebar-item" style={{ textDecoration: 'none' }}>
                  <div className="admin-sidebar-item-inner" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: collapsed ? '0' : 'var(--admin-space-2)',
                    padding: collapsed ? 'var(--admin-space-2) 0' : 'var(--admin-space-2) var(--admin-space-3)',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: collapsed ? '0' : 'var(--admin-radius-md)',
                    marginBottom: '2px',
                    cursor: 'pointer',
                    position: 'relative',
                    background: active ? 'var(--admin-bg-selected)' : 'transparent',
                    color: active ? 'var(--admin-gold)' : 'var(--admin-text-secondary)',
                    fontSize: 'var(--admin-text-base)',
                    fontWeight: active ? 'var(--admin-font-semibold)' : 'var(--admin-font-normal)',
                    transition: 'var(--admin-transition-fast)',
                    borderLeft: active && !collapsed ? 'var(--admin-border-width-sm) solid var(--admin-gold)' : 'var(--admin-border-width-sm) solid transparent'
                  }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.background = 'var(--admin-bg-hover)'
                        e.currentTarget.style.color = 'var(--admin-text-primary)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'var(--admin-text-secondary)'
                      }
                    }}
                  >
                    <IconComponent style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                    {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="admin-badge admin-badge-error">{item.badge}</span>
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
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="admin-btn admin-btn-secondary"
        style={{
          margin: 'var(--admin-space-3)',
          padding: 'var(--admin-space-2)',
          fontSize: 'var(--admin-text-sm)',
          color: 'var(--admin-gold)',
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}
      >
        <ChevronLeft style={{
          width: '14px',
          height: '14px',
          transform: collapsed ? 'rotate(180deg)' : 'none',
          transition: 'var(--admin-transition-slow)',
          display: 'inline-block'
        }} />
        {!collapsed && <span className="admin-text-tertiary" style={{ fontSize: 'var(--admin-text-sm)' }}>Collapse</span>}
      </button>

      {/* Admin profile */}
      {!collapsed && (
        <div className="admin-sidebar-profile" style={{
          padding: 'var(--admin-space-3) var(--admin-space-4)',
          borderTop: 'var(--admin-border-width-sm) solid var(--admin-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--admin-space-2)'
        }}>
          <div className="admin-skeleton admin-skeleton-avatar" style={{
            background: 'linear-gradient(135deg, var(--admin-red), var(--admin-gold))',
            width: '32px',
            height: '32px'
          }}>
            <span style={{ color: 'white', fontSize: 'var(--admin-text-sm)', fontWeight: 'var(--admin-font-bold)' }}>A</span>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="admin-text-sm" style={{ color: 'var(--admin-text-primary)', fontWeight: 'var(--admin-font-semibold)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin</div>
            <div className="admin-text-xs" style={{ color: 'var(--admin-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>sampada.com</div>
          </div>
          <a href="/api/logout-admin" className="admin-text-tertiary admin-text-sm" title="Logout" aria-label="Logout" style={{ textDecoration: 'none' }}>
            <LogOut style={{ width: '14px', height: '14px' }} />
          </a>
        </div>
      )}

      <style jsx global>{`
        .admin-sidebar {
          height: 100vh;
          background: var(--admin-surface-1);
          border-right: var(--admin-border-width-sm) solid var(--admin-border-subtle);
          position: fixed;
          top: 0;
          left: 0;
          z-index: var(--admin-z-fixed);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .admin-sidebar-item:hover .admin-sidebar-item-inner {
          background: var(--admin-bg-hover);
          color: var(--admin-text-primary);
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.mobile-open {
            transform: translateX(0);
            box-shadow: var(--admin-shadow-md);
          }
        }
      `}</style>
    </aside>
  )
}
