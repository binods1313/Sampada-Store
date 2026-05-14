/**
 * Style Assistant — Floating Chat Widget
 * Powered by Gemini Vision + Sanity product data
 *
 * Features:
 * - Floating button (bottom-right)
 * - Conversational fashion recommendations
 * - Real product cards with images, prices, links
 * - Conversation history maintained per session
 */

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, X, Send, ChevronDown, ShoppingBag } from 'lucide-react'

const WELCOME = "Hi! I'm Kavya's Style Assistant ✨ Tell me what you're looking for — an occasion, a vibe, a budget — and I'll find the perfect Sampada look for you."

function ProductCard({ product }) {
  const price = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price

  return (
    <Link
      href={`/product/${product.slug}`}
      style={{
        display: 'flex', gap: '10px', padding: '10px',
        background: 'rgba(255,255,255,0.04)', borderRadius: '8px',
        border: '1px solid rgba(201,169,110,0.15)',
        textDecoration: 'none', transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.15)'}
    >
      {product.image ? (
        <img src={product.image} alt={product.name} style={{
          width: '56px', height: '72px', objectFit: 'cover',
          borderRadius: '6px', flexShrink: 0,
        }} />
      ) : (
        <div style={{
          width: '56px', height: '72px', background: 'rgba(201,169,110,0.1)',
          borderRadius: '6px', flexShrink: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <ShoppingBag size={20} style={{ color: '#c9a96e', opacity: 0.5 }} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: '0 0 4px', fontSize: '0.8rem', fontWeight: 600,
          color: '#f5f0eb', lineHeight: 1.3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{product.name}</p>
        {product.category && (
          <p style={{ margin: '0 0 4px', fontSize: '0.65rem', color: '#c9a96e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {product.category}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f5f0eb' }}>₹{price}</span>
          {product.discount > 0 && (
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through' }}>
              ₹{product.price}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
    }}>
      <div style={{
        maxWidth: '85%', padding: '10px 14px', borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isUser ? '#c9a96e' : 'rgba(255,255,255,0.07)',
        color: isUser ? '#0d1126' : '#f5f0eb',
        fontSize: '0.85rem', lineHeight: 1.55,
      }}>
        {msg.content}
      </div>

      {/* Product cards */}
      {msg.products?.length > 0 && (
        <div style={{ width: '100%', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {msg.products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* Quick reply suggestions */}
      {msg.suggestions?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
          {msg.suggestions.map(s => (
            <button key={s} onClick={() => msg.onSuggestion?.(s)} style={{
              background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)',
              borderRadius: '20px', color: '#c9a96e', fontSize: '0.72rem',
              padding: '4px 12px', cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.1)' }}
            >{s}</button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function StyleAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: WELCOME, products: [], suggestions: ['Show me festive wear', 'Casual looks under ₹1000', 'Something for a wedding'] },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200)
  }, [open])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')

    const userMsg = { role: 'user', content: msg }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      // Build history for API (exclude welcome message)
      const history = messages.slice(1).map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/ai/style-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history }),
      })
      const data = await res.json()

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.reply,
          products: data.products || [],
          suggestions: data.suggestions || [],
          onSuggestion: (s) => sendMessage(s),
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I'm having a moment — please try again!",
          products: [],
        }])
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Something went wrong. Please try again.",
        products: [],
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Style Assistant"
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #c9a96e, #a07840)',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(201,169,110,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(201,169,110,0.55)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,169,110,0.4)' }}
      >
        {open ? <ChevronDown size={22} color="#0d1126" /> : <Sparkles size={22} color="#0d1126" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '92px', right: '24px', zIndex: 9998,
          width: '360px', maxHeight: '560px',
          background: '#0d1126', border: '1px solid rgba(201,169,110,0.2)',
          borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 16px', borderBottom: '1px solid rgba(201,169,110,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(201,169,110,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: '#c9a96e' }} />
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#f5f0eb' }}>Style Assistant</p>
                <p style={{ margin: 0, fontSize: '0.65rem', color: '#c9a96e', letterSpacing: '0.1em' }}>SAMPADA · KAVYA</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: '4px',
            }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', scrollbarWidth: 'thin' }}>
            {messages.map((msg, i) => (
              <Message key={i} msg={{
                ...msg,
                onSuggestion: (s) => sendMessage(s),
              }} />
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '4px', padding: '8px 0' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '6px', height: '6px', borderRadius: '50%', background: '#c9a96e',
                    animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                  }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px', borderTop: '1px solid rgba(201,169,110,0.1)',
            display: 'flex', gap: '8px', alignItems: 'flex-end',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything about style..."
              rows={1}
              style={{
                flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', color: '#f5f0eb', padding: '10px 12px',
                fontSize: '0.85rem', resize: 'none', fontFamily: 'inherit',
                outline: 'none', lineHeight: 1.4, maxHeight: '80px', overflowY: 'auto',
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                background: input.trim() && !loading ? '#c9a96e' : 'rgba(201,169,110,0.2)',
                border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
            >
              <Send size={16} color={input.trim() && !loading ? '#0d1126' : 'rgba(201,169,110,0.4)'} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  )
}
