/**
 * Admin — AI Tools
 * /admin/ai-tools
 *
 * AI Product Description Generator using Gemini Vision.
 * Upload a product image → get SEO title, description, keywords, tags instantly.
 */

import { useState, useRef, useCallback } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  Sparkles, Upload, Copy, Check, RefreshCw,
  Image as ImageIcon, Tag, FileText, Search, Loader2, X, ChevronDown
} from 'lucide-react'
import toast from 'react-hot-toast'

// ─── Field copy button ────────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} title="Copy" style={{
      background: 'none', border: 'none', cursor: 'pointer',
      color: copied ? '#c9a96e' : 'rgba(255,255,255,0.4)',
      padding: '2px 6px', borderRadius: '4px', transition: 'color 0.2s',
    }}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  )
}

// ─── Result field ─────────────────────────────────────────────────────────────
function ResultField({ label, value, multiline = false, icon: Icon }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)

  if (!val) return null

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '8px', padding: '14px 16px', marginBottom: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {Icon && <Icon size={13} style={{ color: '#c9a96e' }} />}
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
            {label}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => setEditing(e => !e)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', padding: '2px 6px',
          }}>
            {editing ? 'done' : 'edit'}
          </button>
          <CopyButton text={Array.isArray(val) ? val.join(', ') : val} />
        </div>
      </div>
      {editing ? (
        multiline
          ? <textarea value={val} onChange={e => setVal(e.target.value)} rows={4} style={{
              width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,169,110,0.3)',
              borderRadius: '6px', color: '#fff', padding: '8px', fontSize: '0.85rem',
              resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
            }} />
          : <input value={val} onChange={e => setVal(e.target.value)} style={{
              width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,169,110,0.3)',
              borderRadius: '6px', color: '#fff', padding: '8px', fontSize: '0.85rem',
              fontFamily: 'inherit', boxSizing: 'border-box',
            }} />
      ) : (
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#f5f0eb', lineHeight: 1.6 }}>
          {Array.isArray(val) ? val.join(' · ') : val}
        </p>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
function AIToolsContent() {
  const [image, setImage] = useState(null)       // { file, preview }
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)

  // Optional context fields
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [showContext, setShowContext] = useState(false)

  const fileInputRef = useRef(null)

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    const preview = URL.createObjectURL(file)
    setImage({ file, preview })
    setResult(null)
    setError(null)
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const generate = async () => {
    if (!image) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', image.file)
      if (productName) formData.append('productName', productName)
      if (category) formData.append('category', category)
      if (priceRange) formData.append('priceRange', priceRange)

      const res = await fetch('/api/ai/describe-product', {
        method: 'POST',
        body: formData, // multipart — no Content-Type header needed, browser sets it
      })
      const data = await res.json()

      if (!data.success) throw new Error(data.error || 'Generation failed')
      setResult(data)
      toast.success('Description generated!')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setImage(null)
    setResult(null)
    setError(null)
    setProductName('')
    setCategory('')
    setPriceRange('')
  }

  const copyAll = () => {
    if (!result) return
    const text = [
      `Title: ${result.title}`,
      `\nDescription:\n${result.description}`,
      `\nMeta Description:\n${result.metaDescription}`,
      `\nKeywords: ${result.keywords?.join(', ')}`,
      `\nTags: ${result.tags?.join(', ')}`,
      `\nOccasion: ${result.occasion}`,
      `\nColour: ${result.colour}`,
      `\nCategory: ${result.category}`,
    ].join('\n')
    navigator.clipboard.writeText(text)
    toast.success('All fields copied!')
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Sparkles size={20} style={{ color: '#c9a96e' }} />
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#f5f0eb', fontFamily: "'Playfair Display', serif" }}>
            AI Product Description Generator
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>
          Upload a product image — Gemini Vision generates SEO title, description, keywords and tags instantly.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>

        {/* Left — Upload + controls */}
        <div>
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => !image && fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? '#c9a96e' : image ? 'rgba(201,169,110,0.4)' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: '12px',
              background: dragging ? 'rgba(201,169,110,0.05)' : 'rgba(255,255,255,0.02)',
              minHeight: '280px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: image ? 'default' : 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
              marginBottom: '16px',
            }}
          >
            {image ? (
              <>
                <img src={image.preview} alt="Product" style={{
                  maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', display: 'block',
                }} />
                <button onClick={reset} style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
                  width: '28px', height: '28px', cursor: 'pointer', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <X size={14} />
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px' }}>
                <ImageIcon size={40} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '12px' }} />
                <p style={{ margin: '0 0 6px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                  Drop product image here
                </p>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
                  or click to browse · JPG, PNG, WEBP · max 10MB
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />

          {/* Optional context toggle */}
          <button onClick={() => setShowContext(v => !v)} style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
            color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', padding: '8px 14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            marginBottom: showContext ? '12px' : '16px', width: '100%', justifyContent: 'space-between',
          }}>
            <span>Add context (optional)</span>
            <ChevronDown size={14} style={{ transform: showContext ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {showContext && (
            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Product name hint', value: productName, set: setProductName, placeholder: 'e.g. Silk Kurta Set' },
                { label: 'Category', value: category, set: setCategory, placeholder: "e.g. Women's Clothing" },
                { label: 'Price range', value: priceRange, set: setPriceRange, placeholder: 'e.g. ₹1,200 – ₹2,500' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    {f.label}
                  </label>
                  <input
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    placeholder={f.placeholder}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px', color: '#fff', padding: '8px 12px', fontSize: '0.85rem',
                      fontFamily: 'inherit', boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={!image || loading}
            style={{
              width: '100%', padding: '14px', borderRadius: '8px',
              background: image && !loading ? '#c9a96e' : 'rgba(201,169,110,0.2)',
              border: 'none', color: image && !loading ? '#0d1126' : 'rgba(201,169,110,0.5)',
              fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: image && !loading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            {loading
              ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Analysing image...</>
              : <><Sparkles size={16} /> Generate Description</>
            }
          </button>

          {error && (
            <div style={{
              marginTop: '12px', padding: '12px', borderRadius: '8px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5', fontSize: '0.8rem',
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Right — Results */}
        {result && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#c9a96e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Generated Copy
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={generate} style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px', color: 'rgba(255,255,255,0.6)', padding: '6px 12px',
                  fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <RefreshCw size={12} /> Regenerate
                </button>
                <button onClick={copyAll} style={{
                  background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.3)',
                  borderRadius: '6px', color: '#c9a96e', padding: '6px 12px',
                  fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <Copy size={12} /> Copy All
                </button>
              </div>
            </div>

            <ResultField label="SEO Title" value={result.title} icon={Search} />
            <ResultField label="Product Description" value={result.description} multiline icon={FileText} />
            <ResultField label="Meta Description (SEO)" value={result.metaDescription} multiline icon={FileText} />
            <ResultField label="Keywords" value={result.keywords} icon={Search} />
            <ResultField label="Tags" value={result.tags} icon={Tag} />
            <ResultField label="Occasion" value={result.occasion} icon={Tag} />
            <ResultField label="Colour" value={result.colour} icon={Tag} />
            <ResultField label="Category" value={result.category} icon={Tag} />

            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '8px', textAlign: 'center' }}>
              All fields are editable before copying
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default function AIToolsPage() {
  return (
    <AdminLayout title="AI Tools">
      <AIToolsContent />
    </AdminLayout>
  )
}
