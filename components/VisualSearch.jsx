/**
 * Visual Product Search — Sampada branded
 * Upload any outfit photo → Gemini analyses it → finds matching Sampada products
 *
 * Triggered by the 📷 camera icon in the navbar.
 * Uses existing /api/search/visual endpoint (Gemini Vision + Sanity matching).
 */

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Camera, X, Upload, Loader2, Search, ShoppingBag } from 'lucide-react'

function ProductCard({ product }) {
  const price = product.similarity_score
    ? product.price
    : product.price
  const discounted = product.discount
    ? Math.round(price * (1 - product.discount / 100))
    : price
  const matchPct = Math.round((product.similarity_score || 0) * 100)

  return (
    <Link
      href={`/product/${product.slug?.current || product.product_id}`}
      style={{
        display: 'flex', gap: '10px', padding: '10px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(201,169,110,0.15)',
        borderRadius: '8px', textDecoration: 'none',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.15)'}
    >
      {product.image_url ? (
        <img src={product.image_url} alt={product.name} style={{
          width: '60px', height: '76px', objectFit: 'cover',
          borderRadius: '6px', flexShrink: 0,
        }} />
      ) : (
        <div style={{
          width: '60px', height: '76px', background: 'rgba(201,169,110,0.08)',
          borderRadius: '6px', flexShrink: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <ShoppingBag size={18} style={{ color: '#c9a96e', opacity: 0.4 }} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: '0 0 3px', fontSize: '0.82rem', fontWeight: 600,
          color: '#f5f0eb', lineHeight: 1.3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{product.name}</p>
        {product.category && (
          <p style={{ margin: '0 0 4px', fontSize: '0.62rem', color: '#c9a96e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {product.category}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f5f0eb' }}>₹{discounted}</span>
          {matchPct > 0 && (
            <span style={{
              fontSize: '0.62rem', background: 'rgba(201,169,110,0.15)',
              color: '#c9a96e', padding: '2px 7px', borderRadius: '10px',
              letterSpacing: '0.05em',
            }}>{matchPct}% match</span>
          )}
        </div>
        {product.match_reasons?.length > 0 && (
          <p style={{ margin: '3px 0 0', fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)' }}>
            {product.match_reasons.slice(0, 2).join(' · ')}
          </p>
        )}
      </div>
    </Link>
  )
}

export default function VisualSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setError(null)
    setResults(null)

    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target.result
      setPreview(base64)
      setLoading(true)

      try {
        const res = await fetch('/api/search/visual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setResults(data)
      } catch (err) {
        setError(err.message || 'Search failed')
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const reset = () => {
    setPreview(null)
    setResults(null)
    setError(null)
  }

  const close = () => { setIsOpen(false); reset() }

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(v => !v)}
        title="Search by image"
        aria-label="Visual search"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.7)', padding: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
      >
        <Camera size={20} />
      </button>

      {/* Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={close}
            style={{
              position: 'fixed', inset: 0, zIndex: 9990,
              background: 'rgba(0,0,0,0.5)',
            }}
          />

          {/* Modal */}
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9991, width: '420px', maxWidth: '95vw',
            maxHeight: '85vh', overflowY: 'auto',
            background: '#0d1126',
            border: '1px solid rgba(201,169,110,0.2)',
            borderRadius: '16px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(201,169,110,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(201,169,110,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search size={16} style={{ color: '#c9a96e' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#f5f0eb' }}>Visual Search</p>
                  <p style={{ margin: 0, fontSize: '0.65rem', color: '#c9a96e', letterSpacing: '0.1em' }}>UPLOAD · MATCH · SHOP</p>
                </div>
              </div>
              <button onClick={close} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.4)', padding: '4px',
              }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              {/* Upload area */}
              {!preview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
                  style={{
                    border: '2px dashed rgba(201,169,110,0.3)',
                    borderRadius: '12px', padding: '40px 20px',
                    textAlign: 'center', cursor: 'pointer',
                    background: 'rgba(201,169,110,0.03)',
                    transition: 'border-color 0.2s, background 0.2s',
                    marginBottom: '16px',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a96e'; e.currentTarget.style.background = 'rgba(201,169,110,0.06)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'; e.currentTarget.style.background = 'rgba(201,169,110,0.03)' }}
                >
                  <Upload size={32} style={{ color: '#c9a96e', opacity: 0.6, marginBottom: '12px' }} />
                  <p style={{ margin: '0 0 6px', color: '#f5f0eb', fontSize: '0.9rem', fontWeight: 600 }}>
                    Drop an outfit photo here
                  </p>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
                    or click to browse · JPG, PNG, WEBP
                  </p>
                </div>
              ) : (
                <div style={{ marginBottom: '16px', position: 'relative', display: 'inline-block' }}>
                  <img src={preview} alt="Search preview" style={{
                    width: '100%', maxHeight: '200px', objectFit: 'contain',
                    borderRadius: '8px', background: 'rgba(255,255,255,0.04)',
                  }} />
                  <button onClick={reset} style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
                    width: '26px', height: '26px', cursor: 'pointer', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <X size={12} />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files[0])}
              />

              {/* Loading */}
              {loading && (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <Loader2 size={24} style={{ color: '#c9a96e', animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                    Analysing your image...
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{
                  padding: '12px', borderRadius: '8px', marginBottom: '16px',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#fca5a5', fontSize: '0.8rem',
                }}>
                  {error}
                </div>
              )}

              {/* Results */}
              {results && !loading && (
                <div>
                  {/* Detected tags */}
                  {results.style_tags?.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{
                        margin: '0 0 8px', fontSize: '0.65rem', letterSpacing: '0.15em',
                        textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
                      }}>Detected</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {results.style_tags.slice(0, 6).map((tag, i) => (
                          <span key={i} style={{
                            fontSize: '0.7rem', background: 'rgba(201,169,110,0.1)',
                            color: '#c9a96e', padding: '3px 10px', borderRadius: '12px',
                            border: '1px solid rgba(201,169,110,0.2)',
                          }}>{tag}</span>
                        ))}
                        {results.detected_colors?.slice(0, 3).map((c, i) => (
                          <span key={`c${i}`} style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)',
                            color: 'rgba(255,255,255,0.6)', padding: '3px 10px', borderRadius: '12px',
                          }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.hex, flexShrink: 0 }} />
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching products */}
                  <p style={{
                    margin: '0 0 10px', fontSize: '0.65rem', letterSpacing: '0.15em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
                  }}>
                    {results.total_matches > 0
                      ? `${results.total_matches} similar looks found`
                      : 'No matches found'}
                  </p>

                  {results.matching_products?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {results.matching_products.slice(0, 6).map(p => (
                        <ProductCard key={p.product_id} product={p} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
                      Try a different photo or browse our collections.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
