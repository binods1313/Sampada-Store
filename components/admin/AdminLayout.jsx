import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import ToastProvider from './Toast'
import CommandPalette from './CommandPalette'

export default function AdminLayout({ children, title = 'Dashboard' }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)

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
        <title>{title} — Sampada Admin</title>
      </Head>
      <ToastProvider>
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f0f' }}>
          <AdminSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
          <div style={{
            marginLeft: `${sidebarWidth}px`,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            transition: 'margin-left 0.25s ease',
            minWidth: 0
          }}>
            <AdminTopbar title={title} sidebarWidth={sidebarWidth} />
            <main style={{
              marginTop: '64px',
              padding: '28px 32px',
              flex: 1,
              minHeight: 0
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
