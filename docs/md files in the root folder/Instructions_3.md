# Instructions 3

🧱 Sampada Admin Dashboard — Full Coder Prompt (Enhanced)

🎯 Mission
Build a complete, production-ready Admin Dashboard for Sampada — a heritage Indian apparel brand. The dashboard must feel like a premium dark-themed SaaS product (think Linear, Vercel, or Planetscale's admin UI), not a generic template. Every pixel should reflect the Sampada brand: deep red (#8B1A1A), gold (#C9A84C), dark backgrounds.

🎨 Design System (Non-Negotiable)
jsconst SAMPADA_TOKENS = {
  bg: {
    page: '#0f0f0f',
    sidebar: '#141414',
    card: '#1a1a1a',
    input: '#0f0f0f',
    hover: 'rgba(201,168,76,0.06)',
  },
  color: {
    gold: '#C9A84C',
    goldMuted: 'rgba(201,168,76,0.15)',
    goldBorder: 'rgba(201,168,76,0.2)',
    red: '#8B1A1A',
    redMuted: 'rgba(139,26,26,0.15)',
    green: '#2d7a2d',
    greenMuted: 'rgba(45,122,45,0.15)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#999999',
    muted: '#555555',
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
  }
}
```

**Typography rule:** Use `Inter` or `system-ui`. Labels: uppercase, 10–11px, letter-spacing 0.1em. Numbers: `font-variant-numeric: tabular-nums` so they don't jump when updating.

---

### 🗂️ Complete File Structure
```
pages/
  admin/
    index.jsx              ← Dashboard homepage
    login.jsx              ← Auth page
    products/
      index.jsx            ← Products list + management
      add.jsx              ← Add new product form
    categories/
      index.jsx            ← Category management
    analytics/
      index.jsx            ← Analytics (placeholder with charts)

components/
  Admin/
    AdminLayout.jsx        ← Master layout wrapper
    AdminSidebar.jsx       ← Fixed left navigation
    AdminTopbar.jsx        ← Fixed top header
    StatCard.jsx           ← Reusable stat card with sparkline
    SkeletonCard.jsx       ← Loading skeleton
    Toast.jsx              ← Notification system
    CommandPalette.jsx     ← Cmd+K quick nav
    StatusBadge.jsx        ← Reusable status badge
    StockIndicator.jsx     ← Stock level display

hooks/
  useAdminData.js          ← Sanity data fetching hook
  useToast.js              ← Toast state management

lib/
  sanityClient.js          ← Sanity client config
  adminAuth.js             ← Auth helpers

middleware.ts              ← Route protection (root level)
pages/api/
  verify-admin.ts          ← Login endpoint
  logout-admin.ts          ← Logout endpoint

🔐 PART 1 — Authentication (Build This First)
pages/api/verify-admin.ts
tsimport type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

// Rate limiter — use upstash/ratelimit or simple in-memory
const attempts = new Map<string, { count: number; resetAt: number }>()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const ip = req.headers['x-forwarded-for'] as string || 'unknown'
  const now = Date.now()

  // Rate limiting: 5 attempts per 15 minutes per IP
  const record = attempts.get(ip)
  if (record) {
    if (now < record.resetAt && record.count >= 5) {
      return res.status(429).json({ 
        error: 'Too many attempts. Try again in 15 minutes.' 
      })
    }
    if (now >= record.resetAt) {
      attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
    } else {
      record.count++
    }
  } else {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
  }

  const { email, password } = req.body

  // IMPORTANT: Store ADMIN_EMAIL and ADMIN_PASSWORD_HASH in .env.local
  // Generate hash: node -e "console.log(require('bcryptjs').hashSync('yourpassword', 10))"
  const validEmail = email === process.env.ADMIN_EMAIL
  const validPassword = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH || '')

  if (!validEmail || !validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { email, role: 'admin', iat: Date.now() },
    process.env.JWT_SECRET || 'change-this-secret',
    { expiresIn: '7d' }
  )

  // httpOnly cookie — not accessible to JavaScript (XSS protection)
  res.setHeader('Set-Cookie', serialize('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  }))

  // Reset attempt counter on success
  attempts.delete(ip)

  return res.status(200).json({ success: true })
}
middleware.ts (root level, not in pages/)
tsimport { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'

  if (!isAdminRoute) return NextResponse.next()
  if (isLoginPage) return NextResponse.next()

  const token = request.cookies.get('admin-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || 'change-this-secret')
    )
    return NextResponse.next()
  } catch {
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    response.cookies.delete('admin-token')
    return response
  }
}

export const config = {
  matcher: ['/admin/:path*']
}
pages/admin/login.jsx
jsximport { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        router.replace('/admin')
      } else {
        const data = await res.json()
        setAttempts(a => a + 1)
        setError(data.error || 'Invalid credentials')
        // Shake animation
        document.getElementById('login-card').animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-8px)' },
          { transform: 'translateX(8px)' },
          { transform: 'translateX(-8px)' },
          { transform: 'translateX(0)' },
        ], { duration: 300 })
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Admin Login — Sampada</title></Head>
      <div style={{
        minHeight: '100vh', background: '#0f0f0f',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(139,26,26,0.08) 0%, transparent 60%)'
      }}>
        <div id="login-card" style={{
          background: '#1a1a1a',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: '16px',
          padding: '48px 40px',
          width: '100%', maxWidth: '400px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)'
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #8B1A1A, #C9A84C)',
              margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: '900', color: 'white',
              fontFamily: 'serif'
            }}>स</div>
            <h1 style={{
              fontSize: '22px', fontWeight: '800', color: '#C9A84C', margin: 0
            }}>Sampada Admin</h1>
            <p style={{ color: '#555', fontSize: '13px', marginTop: '6px' }}>
              Sign in to manage your store
            </p>
          </div>

          {/* Attempts warning */}
          {attempts >= 3 && (
            <div style={{
              background: 'rgba(139,26,26,0.12)',
              border: '1px solid rgba(139,26,26,0.3)',
              borderRadius: '8px', padding: '10px 14px',
              fontSize: '12px', color: '#ff6b6b',
              marginBottom: '16px'
            }}>
              ⚠️ {5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining before lockout
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(139,26,26,0.15)',
              border: '1px solid rgba(139,26,26,0.4)',
              borderRadius: '8px', padding: '10px 14px',
              fontSize: '13px', color: '#ff8080',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                Admin Email
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required autoComplete="email"
                placeholder="admin@sampada.com"
                style={{
                  width: '100%', background: '#0f0f0f',
                  border: '1.5px solid rgba(201,168,76,0.2)',
                  borderRadius: '8px', padding: '12px 14px',
                  color: '#fff', fontSize: '14px', outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
              />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password"
                placeholder="••••••••"
                style={{
                  width: '100%', background: '#0f0f0f',
                  border: '1.5px solid rgba(201,168,76,0.2)',
                  borderRadius: '8px', padding: '12px 14px',
                  color: '#fff', fontSize: '14px', outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
              />
            </div>
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? 'rgba(201,168,76,0.3)' : 'linear-gradient(135deg, #C9A84C, #a8882e)',
                border: 'none', borderRadius: '8px',
                color: loading ? '#999' : '#0f0f0f',
                fontSize: '14px', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', letterSpacing: '0.02em'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In to Dashboard →'}
            </button>
          </form>

          <a href="/" style={{
            display: 'block', textAlign: 'center',
            marginTop: '24px', color: '#444', fontSize: '13px',
            textDecoration: 'none', transition: 'color 0.2s'
          }}
            onMouseEnter={e => e.target.style.color = '#C9A84C'}
            onMouseLeave={e => e.target.style.color = '#444'}
          >
            ← Back to Sampada Store
          </a>
        </div>
      </div>
    </>
  )
}

🧭 PART 2 — AdminLayout, Sidebar, Topbar
components/Admin/AdminLayout.jsx
jsximport { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import Toast from './Toast'
import CommandPalette from './CommandPalette'
import Head from 'next/head'

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
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f0f' }}>
        <AdminSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <div style={{
          marginLeft: `${sidebarWidth}px`,
          flex: 1, display: 'flex', flexDirection: 'column',
          transition: 'margin-left 0.25s ease',
          minWidth: 0
        }}>
          <AdminTopbar title={title} sidebarWidth={sidebarWidth} />
          <main style={{
            marginTop: '64px', padding: '28px 32px',
            flex: 1, minHeight: 0
          }}>
            {children}
          </main>
        </div>
        <Toast />
        {commandOpen && <CommandPalette onClose={() => setCommandOpen(false)} />}
      </div>
    </>
  )
}
components/Admin/AdminSidebar.jsx
jsximport Link from 'next/link'
import { useRouter } from 'next/router'

const NAV = [
  {
    section: 'Content',
    items: [
      { icon: '⬡', label: 'Dashboard', href: '/admin' },
      { icon: '◫', label: 'Products', href: '/admin/products', badge: null },
      { icon: '◉', label: 'Categories', href: '/admin/categories' },
      { icon: '◈', label: 'Bulk Tag', href: '/admin/bulk-tag' },
    ]
  },
  {
    section: 'Management',
    items: [
      { icon: '◳', label: 'Orders', href: '/admin/orders', badge: 'new' },
      { icon: '◯', label: 'Users', href: '/admin/users' },
      { icon: '◷', label: 'Reviews', href: '/admin/reviews' },
    ]
  },
  {
    section: 'Tools',
    items: [
      { icon: '◬', label: 'AI Tools', href: '/admin/ai-tools' },
      { icon: '◨', label: 'Analytics', href: '/admin/analytics' },
      { icon: '◎', label: 'Settings', href: '/admin/settings' },
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
      position: 'fixed', top: 0, left: 0,
      display: 'flex', flexDirection: 'column',
      zIndex: 100,
      overflow: 'hidden',
      transition: 'width 0.25s ease'
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 0' : '20px',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
        display: 'flex', alignItems: 'center',
        gap: '12px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        minHeight: '64px'
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
          background: 'linear-gradient(135deg, #8B1A1A, #C9A84C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', fontWeight: '900', color: 'white', fontFamily: 'serif'
        }}>स</div>
        {!collapsed && (
          <div>
            <div style={{
              fontSize: '15px', fontWeight: '800',
              background: 'linear-gradient(135deg, #C9A84C, #a8882e)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
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
                fontSize: '10px', fontWeight: '700', letterSpacing: '0.15em',
                textTransform: 'uppercase', color: '#444',
                padding: '12px 12px 4px'
              }}>{group.section}</div>
            )}
            {group.items.map(item => {
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: collapsed ? '0' : '10px',
                    padding: collapsed ? '10px 0' : '9px 12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: collapsed ? '0' : '8px',
                    marginBottom: '2px', cursor: 'pointer',
                    position: 'relative',
                    background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: active ? '#C9A84C' : '#888',
                    fontSize: '13px', fontWeight: active ? '600' : '400',
                    transition: 'all 0.15s ease',
                    borderLeft: active && !collapsed ? '3px solid #C9A84C' : '3px solid transparent'
                  }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(201,168,76,0.05)'; e.currentTarget.style.color = active ? '#C9A84C' : '#bbb' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = active ? '#C9A84C' : '#888' }}
                  >
                    <span style={{ fontSize: '15px', width: '18px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                    {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span style={{
                        background: '#8B1A1A', color: 'white',
                        fontSize: '9px', fontWeight: '700', padding: '2px 5px',
                        borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em'
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
          margin: '12px', padding: '10px',
          background: 'rgba(201,168,76,0.06)',
          border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: '8px', cursor: 'pointer',
          color: '#C9A84C', fontSize: '12px',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: '8px', transition: 'all 0.15s'
        }}
      >
        <span style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', display: 'inline-block' }}>◀</span>
        {!collapsed && <span style={{ fontSize: '12px', color: '#777' }}>Collapse</span>}
      </button>

      {/* Admin profile */}
      {!collapsed && (
        <div style={{
          padding: '14px 16px',
          borderTop: '1px solid rgba(201,168,76,0.12)',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #8B1A1A, #C9A84C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: '700', fontSize: '13px'
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
components/Admin/AdminTopbar.jsx
jsximport { useState } from 'react'
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
      position: 'fixed', top: 0,
      left: `${sidebarWidth}px`, right: 0,
      zIndex: 99,
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: '16px',
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
            width: '100%', background: '#1a1a1a',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '8px', padding: '8px 14px 8px 32px',
            color: '#fff', fontSize: '13px', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = '#C9A84C'}
          onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.15)'}
        />
        <kbd style={{
          position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
          fontSize: '10px', color: '#444', background: '#0f0f0f',
          border: '1px solid #333', borderRadius: '4px', padding: '2px 5px'
        }}>⌘K</kbd>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* View site */}
        <a href="/" target="_blank" rel="noopener noreferrer" style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '7px 12px', background: 'transparent',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: '7px', color: '#C9A84C',
          fontSize: '12px', fontWeight: '600',
          textDecoration: 'none', transition: 'all 0.15s'
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          ↗ View Store
        </a>

        {/* Notification bell */}
        <button style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: '#1a1a1a', border: '1px solid rgba(201,168,76,0.15)',
          color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative', fontSize: '15px'
        }}>
          🔔
          <div style={{
            position: 'absolute', top: '6px', right: '6px',
            width: '8px', height: '8px', background: '#8B1A1A',
            borderRadius: '50%', border: '2px solid #141414'
          }} />
        </button>

        {/* Avatar */}
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #8B1A1A, #C9A84C)',
          border: '2px solid rgba(201,168,76,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer'
        }}>A</div>
      </div>
    </header>
  )
}

📊 PART 3 — Dashboard Homepage
pages/admin/index.jsx
jsximport { useState, useEffect, useRef } from 'react'
import AdminLayout from '@/components/Admin/AdminLayout'
import { client } from '@/lib/sanityClient'
import Link from 'next/link'

// Animated number counter hook
function useCounter(target, duration = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!target) return
    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return value
}

// Skeleton loader
function Skeleton({ width = '100%', height = '20px', style = {} }) {
  return (
    <div style={{
      width, height, borderRadius: '6px',
      background: 'linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style
    }} />
  )
}

function StatCard({ icon, iconBg, label, value, sub, borderColor, loading }) {
  const animated = useCounter(loading ? 0 : value)
  return (
    <div style={{
      background: '#1a1a1a',
      border: `1px solid rgba(201,168,76,0.12)`,
      borderLeft: `3px solid ${borderColor}`,
      borderRadius: '12px', padding: '22px',
      display: 'flex', alignItems: 'center', gap: '16px',
      transition: 'all 0.2s ease', cursor: 'default'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)` }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: iconBg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '22px'
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '11px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{label}</div>
        {loading ? <Skeleton height="32px" width="80px" style={{ marginBottom: '6px' }} /> : (
          <div style={{ fontSize: '30px', fontWeight: '800', color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {animated.toLocaleString()}
          </div>
        )}
        {loading ? <Skeleton height="14px" width="120px" /> : (
          <div style={{ fontSize: '12px', color: '#C9A84C', marginTop: '5px' }}>{sub}</div>
        )}
      </div>
    </div>
  )
}

const QUICK_ACTIONS = [
  { icon: '＋', label: 'Add Product', href: '/admin/products/add', color: '#C9A84C' },
  { icon: '◫', label: 'All Products', href: '/admin/products', color: '#C9A84C' },
  { icon: '◉', label: 'Categories', href: '/admin/categories', color: '#C9A84C' },
  { icon: '◈', label: 'Bulk Tag', href: '/admin/bulk-tag', color: '#C9A84C' },
  { icon: '◯', label: 'Users', href: '/admin/users', color: '#C9A84C' },
  { icon: '◨', label: 'Analytics', href: '/admin/analytics', color: '#C9A84C' },
  { icon: '🌐', label: 'Sanity Studio', href: '/studio', color: '#C9A84C' },
  { icon: '◎', label: 'Settings', href: '/admin/settings', color: '#C9A84C' },
]

const STATUS_BADGE = {
  active: { bg: 'rgba(45,122,45,0.15)', color: '#4caf50', label: 'Active' },
  draft: { bg: 'rgba(201,168,76,0.15)', color: '#C9A84C', label: 'Draft' },
  archived: { bg: 'rgba(100,100,100,0.15)', color: '#888', label: 'Archived' },
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [totalProducts, activeProducts, categories, lowStock, recent] = await Promise.all([
          client.fetch(`count(*[_type == "product"])`),
          client.fetch(`count(*[_type == "product" && status == "active"])`),
          client.fetch(`count(*[_type == "category"])`),
          client.fetch(`count(*[_type == "product" && defined(variants) && count(variants[variantStock < 10]) > 0])`),
          client.fetch(`*[_type == "product"] | order(_createdAt desc) [0...10] {
            _id, name, status, price, discount,
            "category": category->name,
            "image": image[0].asset->url,
            _createdAt
          }`)
        ])
        setStats({ totalProducts, activeProducts, categories, lowStock })
        setProducts(recent)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <AdminLayout title="Dashboard">
      {/* Inject shimmer keyframe */}
      <style>{`@keyframes shimmer { from { background-position: 200% 0 } to { background-position: -200% 0 } }`}</style>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard icon="📦" iconBg="rgba(201,168,76,0.15)" label="Total Products" value={stats?.totalProducts} sub={`+${Math.floor((stats?.totalProducts || 0) * 0.08)} this month`} borderColor="#C9A84C" loading={loading} />
        <StatCard icon="✅" iconBg="rgba(45,122,45,0.15)" label="Active Products" value={stats?.activeProducts} sub={`${(stats?.totalProducts || 0) - (stats?.activeProducts || 0)} drafts pending`} borderColor="#2d7a2d" loading={loading} />
        <StatCard icon="🏷️" iconBg="rgba(201,168,76,0.15)" label="Categories" value={stats?.categories} sub="across all collections" borderColor="#C9A84C" loading={loading} />
        <StatCard icon="⚠️" iconBg="rgba(139,26,26,0.15)" label="Low Stock Alert" value={stats?.lowStock} sub="need restocking" borderColor="#8B1A1A" loading={loading} />
      </div>

      {/* Quick Actions + Recent Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '28px' }}>
        {/* Quick Actions */}
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '14px', padding: '20px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {QUICK_ACTIONS.map(action => (
              <Link key={action.href} href={action.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#141414', border: '1px solid rgba(201,168,76,0.12)',
                  borderRadius: '10px', padding: '14px 10px',
                  textAlign: 'center', cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.07)'; e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#141414'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)'; e.currentTarget.style.transform = 'none' }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>{action.icon}</div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#ccc', lineHeight: 1.3 }}>{action.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recent Products</h3>
            <Link href="/admin/products" style={{ fontSize: '12px', color: '#C9A84C', textDecoration: 'none' }}>View all →</Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[...Array(5)].map((_, i) => <Skeleton key={i} height="36px" />)}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#444' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📦</div>
              <div style={{ fontSize: '14px' }}>No products yet</div>
              <Link href="/admin/products/add" style={{ color: '#C9A84C', fontSize: '13px', display: 'inline-block', marginTop: '8px' }}>Add your first product →</Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                  {['Product', 'Category', 'Price', 'Status', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0 8px 10px', color: '#555', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const badge = STATUS_BADGE[p.status] || STATUS_BADGE.draft
                  const price = p.discount ? (p.price * (1 - p.discount / 100)).toFixed(2) : p.price
                  return (
                    <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '10px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {p.image ? (
                            <img src={p.image} alt={p.name} style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />
                          ) : (
                            <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#252525', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>📦</div>
                          )}
                          <span style={{ color: '#ddd', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 8px', color: '#777' }}>{p.category || '—'}</td>
                      <td style={{ padding: '10px 8px', color: '#C9A84C', fontWeight: '600', fontVariantNumeric: 'tabular-nums' }}>${price}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{ background: badge.bg, color: badge.color, fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px', display: 'flex', gap: '8px' }}>
                        <a href={`https://sampada-production.sanity.studio/structure/product;${p._id}`} target="_blank" rel="noopener noreferrer" style={{ color: '#555', fontSize: '14px', textDecoration: 'none', transition: 'color 0.1s' }}
                          onMouseEnter={e => e.target.style.color = '#C9A84C'} onMouseLeave={e => e.target.style.color = '#555'}
                          title="Edit in Sanity">✏️</a>
                        <a href={`/products/${p.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#555', fontSize: '14px', textDecoration: 'none', transition: 'color 0.1s' }}
                          onMouseEnter={e => e.target.style.color = '#C9A84C'} onMouseLeave={e => e.target.style.color = '#555'}
                          title="View live page">👁️</a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

🛍️ PART 4 — Products Admin Page
pages/admin/products/index.jsx
jsximport { useState, useEffect, useMemo } from 'react'
import AdminLayout from '@/components/Admin/AdminLayout'
import { client } from '@/lib/sanityClient'
import Link from 'next/link'

const PRODUCTS_QUERY = `
  *[_type == "product"] | order(_createdAt desc) {
    _id, name,
    "slug": slug.current,
    price, discount, status,
    "image": image[0].asset->url,
    "categoryName": category->name,
    "totalStock": math::sum(variants[].variantStock),
    _createdAt
  }
`

const STATUS_CONFIG = {
  active: { bg: 'rgba(45,122,45,0.15)', color: '#4caf50', label: 'Active' },
  draft: { bg: 'rgba(201,168,76,0.15)', color: '#C9A84C', label: 'Draft' },
  archived: { bg: 'rgba(100,100,100,0.15)', color: '#666', label: 'Archived' },
}

function StockBadge({ stock }) {
  if (stock === null || stock === undefined) return <span style={{ color: '#555' }}>—</span>
  if (stock > 20) return <span style={{ color: '#4caf50', fontWeight: '600' }}>{stock}</span>
  if (stock >= 5) return <span style={{ color: '#C9A84C', fontWeight: '600' }}>⚠️ {stock}</span>
  return <span style={{ color: '#ff5555', fontWeight: '600' }}>🔴 {stock}</span>
}

const PAGE_SIZE = 12

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(new Set())

  useEffect(() => {
    client.fetch(PRODUCTS_QUERY)
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let result = [...products]
    if (search) result = result.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()))
    if (filterStatus !== 'all') result = result.filter(p => p.status === filterStatus)
    if (sortBy === 'newest') result.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt))
    if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price)
    if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price)
    if (sortBy === 'name') result.sort((a, b) => a.name?.localeCompare(b.name))
    return result
  }, [products, search, filterStatus, sortBy])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const toggleAll = () => {
    if (selected.size === paginated.length) setSelected(new Set())
    else setSelected(new Set(paginated.map(p => p._id)))
  }

  return (
    <AdminLayout title="Products">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0 }}>All Products</h2>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{filtered.length} products total</p>
        </div>
        <Link href="/admin/products/add" style={{
          background: 'linear-gradient(135deg, #C9A84C, #a8882e)',
          color: '#0f0f0f', padding: '10px 20px',
          borderRadius: '8px', fontWeight: '700', fontSize: '13px',
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          ＋ Add Product
        </Link>
      </div>

      {/* Filters */}
      <div style={{
        background: '#1a1a1a', border: '1px solid rgba(201,168,76,0.12)',
        borderRadius: '12px', padding: '16px 20px',
        display: 'flex', gap: '12px', flexWrap: 'wrap',
        alignItems: 'center', marginBottom: '20px'
      }}>
        <input
          value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search products..."
          style={{
            flex: 1, minWidth: '200px', background: '#0f0f0f',
            border: '1px solid rgba(201,168,76,0.15)', borderRadius: '8px',
            padding: '8px 14px', color: '#fff', fontSize: '13px', outline: 'none'
          }}
          onFocus={e => e.target.style.borderColor = '#C9A84C'}
          onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.15)'}
        />
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
          style={{ background: '#0f0f0f', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none' }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ background: '#0f0f0f', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none' }}>
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="name">Name A–Z</option>
        </select>
        {selected.size > 0 && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#C9A84C', alignSelf: 'center' }}>{selected.size} selected</span>
            <button style={{ background: 'rgba(45,122,45,0.15)', border: '1px solid rgba(45,122,45,0.3)', color: '#4caf50', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>Activate</button>
            <button style={{ background: 'rgba(100,100,100,0.15)', border: '1px solid rgba(100,100,100,0.3)', color: '#888', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>Archive</button>
            <button style={{ background: 'rgba(139,26,26,0.15)', border: '1px solid rgba(139,26,26,0.3)', color: '#ff6b6b', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ background: '#1a1a1a', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '14px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#555' }}>Loading products...</div>
        ) : paginated.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</div>
            <div style={{ fontSize: '16px', color: '#555', marginBottom: '8px' }}>No products found</div>
            <div style={{ fontSize: '13px', color: '#444' }}>Try adjusting your search or filters</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.1)', background: '#161616' }}>
                <th style={{ padding: '12px 16px', width: '40px' }}>
                  <input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleAll} style={{ accentColor: '#C9A84C' }} />
                </th>
                {['Image', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 12px', color: '#555', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => {
                const badge = STATUS_CONFIG[p.status] || STATUS_CONFIG.draft
                const displayPrice = p.discount ? (p.price * (1 - p.discount / 100)).toFixed(2) : p.price?.toFixed(2)
                return (
                  <tr key={p._id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <input type="checkbox" checked={selected.has(p._id)} onChange={() => toggleSelect(p._id)} style={{ accentColor: '#C9A84C' }} />
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      {p.image ? (
                        <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#252525', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>📦</div>
                      )}
                    </td>
                    <td style={{ padding: '12px 12px', color: '#ddd', fontWeight: '500', maxWidth: '200px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    </td>
                    <td style={{ padding: '12px 12px', color: '#888' }}>{p.categoryName || '—'}</td>
                    <td style={{ padding: '12px 12px', color: '#C9A84C', fontWeight: '700', fontVariantNumeric: 'tabular-nums' }}>
                      ${displayPrice}
                      {p.discount > 0 && <span style={{ fontSize: '10px', color: '#8B1A1A', marginLeft: '4px' }}>-{p.discount}%</span>}
                    </td>
                    <td style={{ padding: '12px 12px' }}><StockBadge stock={p.totalStock} /></td>
                    <td style={{ padding: '12px 12px' }}>
                      <span style={{ background: badge.bg, color: badge.color, fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <a href={`https://sampada-production.sanity.studio/structure/product;${p._id}`} target="_blank" rel="noopener noreferrer"
                          style={{ color: '#555', textDecoration: 'none', fontSize: '15px', transition: 'color 0.1s' }}
                          onMouseEnter={e => e.target.style.color = '#C9A84C'} onMouseLeave={e => e.target.style.color = '#555'}
                          title="Edit in Sanity">✏️</a>
                        <a href={`/products/${p.slug}`} target="_blank" rel="noopener noreferrer"
                          style={{ color: '#555', textDecoration: 'none', fontSize: '15px', transition: 'color 0.1s' }}
                          onMouseEnter={e => e.target.style.color = '#C9A84C'} onMouseLeave={e => e.target.style.color = '#555'}
                          title="View live page">👁️</a>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
            <span style={{ fontSize: '12px', color: '#555' }}>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{
                    width: '30px', height: '30px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                    background: page === p ? '#C9A84C' : 'transparent',
                    border: `1px solid ${page === p ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`,
                    color: page === p ? '#0f0f0f' : '#888', cursor: 'pointer'
                  }}>{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

🔔 PART 5 — Toast + Command Palette Components
components/Admin/Toast.jsx
jsximport { useState, useEffect, createContext, useContext } from 'react'

const ToastContext = createContext(null)

const TOAST_COLORS = {
  success: { bg: 'rgba(45,122,45,0.15)', border: 'rgba(45,122,45,0.3)', color: '#4caf50', icon: '✓' },
  error: { bg: 'rgba(139,26,26,0.15)', border: 'rgba(139,26,26,0.3)', color: '#ff6b6b', icon: '✕' },
  warning: { bg: 'rgba(201,168,76,0.12)', border: 'rgba(201,168,76,0.3)', color: '#C9A84C', icon: '⚠' },
  info: { bg: 'rgba(60,100,180,0.12)', border: 'rgba(60,100,180,0.3)', color: '#6699ff', icon: 'ℹ' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'success', duration = 3500) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map(toast => {
          const cfg = TOAST_COLORS[toast.type] || TOAST_COLORS.info
          return (
            <div key={toast.id} style={{
              background: '#1a1a1a', border: `1px solid ${cfg.border}`,
              borderLeft: `3px solid ${cfg.color}`,
              borderRadius: '10px', padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: '10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              animation: 'slideIn 0.25s ease',
              minWidth: '240px', maxWidth: '360px'
            }}>
              <span style={{ color: cfg.color, fontWeight: '700', fontSize: '14px' }}>{cfg.icon}</span>
              <span style={{ fontSize: '13px', color: '#ddd' }}>{toast.message}</span>
            </div>
          )
        })}
      </div>
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px) } to { opacity: 1; transform: none } }`}</style>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

export default function Toast() { return null }
components/Admin/CommandPalette.jsx
jsximport { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

const COMMANDS = [
  { label: 'Dashboard', icon: '⬡', href: '/admin' },
  { label: 'Products', icon: '◫', href: '/admin/products' },
  { label: 'Add Product', icon: '＋', href: '/admin/products/add' },
  { label: 'Categories', icon: '◉', href: '/admin/categories' },
  { label: 'Users', icon: '◯', href: '/admin/users' },
  { label: 'Analytics', icon: '◨', href: '/admin/analytics' },
  { label: 'Settings', icon: '◎', href: '/admin/settings' },
  { label: 'View Store', icon: '↗', href: '/', external: true },
  { label: 'Sanity Studio', icon: '🌐', href: '/studio', external: true },
]

export default function CommandPalette({ onClose }) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const router = useRouter()
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const filtered = COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))

  const execute = (cmd) => {
    if (cmd.external) window.open(cmd.href, '_blank')
    else router.push(cmd.href)
    onClose()
  }

  const handleKey = (e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && filtered[activeIdx]) execute(filtered[activeIdx])
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      zIndex: 9999, display: 'flex', alignItems: 'flex-start',
      justifyContent: 'center', paddingTop: '20vh'
    }} onClick={onClose}>
      <div style={{
        background: '#1a1a1a', border: '1px solid rgba(201,168,76,0.3)',
        borderRadius: '14px', width: '100%', maxWidth: '480px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
        overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid rgba(201,168,76,0.1)', gap: '10px' }}>
          <span style={{ color: '#555', fontSize: '16px' }}>⌕</span>
          <input
            ref={inputRef} value={query}
            onChange={e => { setQuery(e.target.value); setActiveIdx(0) }}
            onKeyDown={handleKey}
            placeholder="Search commands..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '15px' }}
          />
          <kbd style={{ fontSize: '11px', color: '#444', background: '#0f0f0f', border: '1px solid #333', borderRadius: '4px', padding: '2px 6px' }}>ESC</kbd>
        </div>
        <div style={{ padding: '8px', maxHeight: '320px', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#555', fontSize: '13px' }}>No commands found</div>
          ) : filtered.map((cmd, i) => (
            <div key={cmd.href} onClick={() => execute(cmd)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '8px',
                cursor: 'pointer', background: i === activeIdx ? 'rgba(201,168,76,0.1)' : 'transparent',
                color: i === activeIdx ? '#C9A84C' : '#bbb',
                fontSize: '14px', transition: 'all 0.1s'
              }}
              onMouseEnter={() => setActiveIdx(i)}
            >
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{cmd.icon}</span>
              {cmd.label}
              {cmd.external && <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#555' }}>↗ external</span>}
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(201,168,76,0.1)', display: 'flex', gap: '16px' }}>
          {[['↑↓', 'navigate'], ['↵', 'open'], ['esc', 'close']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <kbd style={{ fontSize: '10px', color: '#555', background: '#0f0f0f', border: '1px solid #333', borderRadius: '4px', padding: '1px 5px' }}>{k}</kbd>
              <span style={{ fontSize: '11px', color: '#444' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

### ⚙️ PART 6 — Environment Variables & Setup

**`.env.local`** (add these)
```
ADMIN_EMAIL=admin@sampada.com
ADMIN_PASSWORD_HASH=<run: node -e "console.log(require('bcryptjs').hashSync('YourStrongPassword123!', 10))">
JWT_SECRET=<generate: openssl rand -base64 32>
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token
Packages to install:
bashnpm install bcryptjs jsonwebtoken jose cookie
npm install -D @types/bcryptjs @types/jsonwebtoken @types/cookie
lib/sanityClient.js
jsimport { createClient } from '@sanity/client'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
})
pages/api/logout-admin.ts
tsimport type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', serialize('admin-token', '', {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', maxAge: 0, path: '/'
  }))
  res.redirect(307, '/admin/login')
}

✅ Final QA Checklist for Your Coder
Auth & Security

 /admin/login — shake animation on wrong credentials, attempt counter shown after 3 failures
 Rate limit blocks at 5 attempts / IP / 15 min
 httpOnly cookie set on success — not readable in browser DevTools > Console
 All /admin/* routes redirect to login with no token (test in incognito)
 Logout clears cookie and redirects

Dashboard

 Stat card numbers animate up from 0 on page load
 Skeleton shimmer shows while Sanity data fetches
 All 4 GROQ queries return correct counts
 Quick action grid navigates correctly
 Recent products table shows last 10 with images
 Status badges: green/gold/gray correct

Sidebar

 Collapse toggle works, state persists on refresh (localStorage)
 Active page has gold left border
 Collapsed mode shows icons only
 All nav links navigate correctly

Products Page

 Real-time search filters as you type
 Status filter dropdown works
 Sort options work (newest/price/name)
 Stock colors: green >20, gold+⚠️ 5–20, red+🔴 <5
 Bulk checkboxes select/deselect rows
 Pagination shows correct page, count
 Empty state shows when no results

Polish

 ⌘K opens command palette, ESC closes it
 Arrow keys navigate palette items
 "View Store" opens in new tab
 No white flash between page navigations
 Mobile: sidebar collapses at 768px
 Zero console errors on all admin pages


Skills to invoke in your coder for best results:
ui-ux-pro-max, vercel-react-best-practices, sast-missingauth, sast-jwt, sast-businesslogic, review