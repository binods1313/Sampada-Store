import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [showPassword, setShowPassword] = useState(false)

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
        document.getElementById('login-card')?.animate([
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
      <Head>
        <title>Admin Login — Sampada</title>
      </Head>
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(139,26,26,0.08) 0%, transparent 60%)'
      }}>
        <div id="login-card" style={{
          background: '#1a1a1a',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: '16px',
          padding: '48px 40px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)'
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #8B1A1A, #C9A84C)',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: '900',
              color: 'white',
              fontFamily: 'serif'
            }}>स</div>
            <h1 style={{
              fontSize: '22px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #C9A84C, #a8882e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
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
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '12px',
              color: '#ff6b6b',
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
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '13px',
              color: '#ff8080',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '11px',
                color: '#777',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: '600',
                display: 'block',
                marginBottom: '8px'
              }}>
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@sampada.com"
                style={{
                  width: '100%',
                  background: '#0f0f0f',
                  border: '1.5px solid rgba(201,168,76,0.2)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
              />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                fontSize: '11px',
                color: '#777',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: '600',
                display: 'block',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    background: '#0f0f0f',
                    border: '1.5px solid rgba(201,168,76,0.2)',
                    borderRadius: '8px',
                    padding: '12px 44px 12px 14px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#C9A84C'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#777',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                  onMouseLeave={e => e.currentTarget.style.color = '#777'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                background: loading ? 'rgba(201,168,76,0.3)' : 'linear-gradient(135deg, #C9A84C, #a8882e)',
                border: 'none',
                borderRadius: '8px',
                color: loading ? '#999' : '#0f0f0f',
                fontSize: '14px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.02em'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In to Dashboard →'}
            </button>
          </form>

          <a href="/" style={{
            display: 'block',
            textAlign: 'center',
            marginTop: '24px',
            color: '#444',
            fontSize: '13px',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
            onMouseLeave={e => e.currentTarget.style.color = '#444'}
          >
            ← Back to Sampada Store
          </a>
        </div>
      </div>
    </>
  )
}
