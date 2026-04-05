import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import ToastProvider from './Toast'
import CommandPalette from './CommandPalette'

export default function AdminLayout({ children, title = 'Dashboard' }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Persist sidebar state
  useEffect(() => {
    const saved = localStorage.getItem('sampada-sidebar-collapsed')
    if (saved) setSidebarCollapsed(JSON.parse(saved))
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed(v => {
      localStorage.setItem('sampada-sidebar-collapsed', JSON.stringify(!v))
      return !v
    })
  }

  // Cmd+K to open command palette
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(v => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const sidebarWidth = sidebarCollapsed ? 64 : 240

  return (
    <>
      <Head>
        <title>{`${title} — Sampada Admin`}</title>
        <style jsx global>{`
          /* Override any gray backgrounds for admin */
          body {
            background: #0f0f0f !important;
            color: #ffffff !important;
          }
          /* Remove any main site layout backgrounds */
          main, .layout, .main-content {
            background: #0f0f0f !important;
          }
          /* Mobile responsive styles */
          @media (max-width: 768px) {
            .mobile-menu-btn {
              display: block !important;
            }
            .admin-topbar-title {
              font-size: 14px !important;
            }
            /* Sidebar slides in from left on mobile */
            aside {
              box-shadow: 2px 0 8px rgba(0,0,0,0.3);
            }
            /* Main content fills screen on mobile */
            main {
              padding: 20px 16px !important;
            }
          }
          @media (max-width: 1024px) {
            /* Tablet adjustments */
            .stat-cards-grid {
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
            }
          }
          /* Hide overlay on desktop */
          @media (min-width: 769px) {
            .mobile-overlay {
              display: none !important;
            }
          }
        `}</style>
      </Head>
      <ToastProvider>
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f0f' }}>
          {/* Mobile overlay */}
          {mobileMenuOpen && (
            <div
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'block',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 99,
              }}
              className="mobile-overlay"
            />
          )}
          <AdminSidebar 
            collapsed={sidebarCollapsed} 
            onToggle={() => {
              toggleSidebar()
              setMobileMenuOpen(false)
            }}
            mobileOpen={mobileMenuOpen}
          />
          <div style={{
            marginLeft: `${sidebarWidth}px`,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            transition: 'margin-left 0.25s ease',
            minWidth: 0
          }}>
            <AdminTopbar 
              title={title} 
              sidebarWidth={sidebarWidth}
              onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
            <main style={{
              marginTop: '64px',
              padding: '28px 32px',
              flex: 1,
              minHeight: 0,
              background: '#0f0f0f'
            }}>
              {children}
            </main>
          </div>
          {commandOpen && <CommandPalette onClose={() => setCommandOpen(false)} />}
        </div>
      </ToastProvider>
    </>
  )
}
