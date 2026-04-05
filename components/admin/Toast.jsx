import { useState, useEffect, createContext, useContext, useCallback } from 'react'

// Toast context
const ToastContext = createContext(null)

// Toast types
const TOAST_TYPES = {
  success: { bg: 'rgba(45,122,45,0.95)', border: 'rgba(45,122,45,0.4)', icon: '✓' },
  error: { bg: 'rgba(139,26,26,0.95)', border: 'rgba(139,26,26,0.4)', icon: '✕' },
  info: { bg: 'rgba(201,168,76,0.15)', border: 'rgba(201,168,76,0.3)', icon: 'ℹ' },
}

// Toast provider component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [pausedToasts, setPausedToasts] = useState(new Set())

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type, duration, remaining: duration }])

    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)

    // Store timer reference for pausing
    toasts.push({ id, timer })
  }, [toasts])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    setPausedToasts(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const pauseToast = useCallback((id) => {
    setPausedToasts(prev => new Set(prev).add(id))
    // Clear the existing timer
    setToasts(prev => {
      const toast = prev.find(t => t.id === id)
      if (toast && toast.timer) {
        clearTimeout(toast.timer)
      }
      return prev
    })
  }, [])

  const resumeToast = useCallback((id) => {
    setPausedToasts(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    // Resume with remaining time
    setToasts(prev => {
      const toast = prev.find(t => t.id === id)
      if (toast) {
        const elapsed = Date.now() - toast.id
        const remaining = Math.max(0, toast.duration - elapsed)
        const timer = setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id))
        }, remaining)
        return prev.map(t => t.id === id ? { ...t, timer } : t)
      }
      return prev
    })
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '360px'
      }}>
        {toasts.map(toast => {
          const isPaused = pausedToasts.has(toast.id)
          return (
            <div
              key={toast.id}
              onClick={() => removeToast(toast.id)}
              onMouseEnter={() => pauseToast(toast.id)}
              onMouseLeave={() => resumeToast(toast.id)}
              role="alert"
              aria-live="polite"
              style={{
                background: TOAST_TYPES[toast.type].bg,
                border: `1px solid ${TOAST_TYPES[toast.type].border}`,
                borderRadius: '10px',
                padding: '14px 18px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(10px)',
                animation: isPaused ? 'none' : 'slideIn 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                opacity: isPaused ? 0.85 : 1
              }}
            >
              <span style={{
                fontSize: '16px',
                fontWeight: '700',
                color: toast.type === 'success' ? '#4ade80' : toast.type === 'error' ? '#ff6b6b' : '#C9A84C'
              }}>
                {TOAST_TYPES[toast.type].icon}
              </span>
              <span style={{ flex: 1 }}>{toast.message}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeToast(toast.id)
                }}
                aria-label="Dismiss notification"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{ fontSize: '18px', color: '#888', lineHeight: 1 }}>×</span>
              </button>
            </div>
          )
        })}
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

// useToast hook
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return {
    success: (message, duration) => context.addToast(message, 'success', duration),
    error: (message, duration) => context.addToast(message, 'error', duration),
    info: (message, duration) => context.addToast(message, 'info', duration),
  }
}

export default ToastProvider
