// components/stories/SelectedWorksGallery.jsx
import { useState, useMemo, useRef } from 'react'
import { kavyaPortfolioImages } from '@/data/kavyaPortfolioImages'

const CATEGORIES = ['Casual', 'Festive', 'Premium', 'Summer', 'Winter', 'Campus']
const PAGE_SIZE = 24
const FILTERS = ['All', ...CATEGORIES]

const works = kavyaPortfolioImages.map((src, i) => ({
  src,
  category: CATEGORIES[i % CATEGORIES.length],
  title: `Look ${i + 1}`,
  collection: CATEGORIES[i % CATEGORIES.length] + ' Collection',
}))

export default function SelectedWorksGallery() {
  const [active, setActive] = useState('All')
  const [hovered, setHovered] = useState(null)
  const [page, setPage] = useState(1)

  // RAG search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchMessage, setSearchMessage] = useState('')
  const [searchMood, setSearchMood] = useState('')
  const inputRef = useRef(null)

  const filtered = useMemo(
    () => (active === 'All' ? works : works.filter(w => w.category === active)),
    [active]
  )

  const paginated = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = paginated.length < filtered.length

  const handleFilter = (f) => { setActive(f); setPage(1); setSearchMessage(''); setSearchMood('') }

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!searchQuery.trim() || searching) return
    setSearching(true)
    setSearchMessage('')
    try {
      const res = await fetch('/api/ai/lookbook-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setActive(data.category)
        setPage(1)
        setSearchMessage(data.message)
        setSearchMood(data.mood)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchMessage('')
    setSearchMood('')
    setActive('All')
    setPage(1)
    inputRef.current?.focus()
  }

  return (
    <section style={{ background: '#0d1126', padding: '80px 24px 96px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase',
          color: '#c9a96e', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, margin: '0 0 14px',
        }}>The Sampada Archive</p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 900, color: '#f5f0eb', margin: '0 0 14px', lineHeight: 1, letterSpacing: '-0.02em',
        }}>Selected Works</h2>
        <p style={{
          fontSize: '0.9rem', color: 'rgba(245,240,235,0.4)',
          maxWidth: '400px', margin: '0 auto', fontFamily: "'Montserrat', sans-serif",
        }}>Every frame, a story. Every look, a legacy.</p>
      </div>

      {/* AI Search bar */}
      <form onSubmit={handleSearch} style={{
        maxWidth: '520px', margin: '0 auto 32px', display: 'flex', gap: '8px',
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            ref={inputRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder='Try "casual earthy tones" or "festive looks"...'
            style={{
              width: '100%', background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid rgba(201,169,110,0.3)', borderRadius: '28px',
              color: '#f5f0eb', padding: '11px 44px 11px 18px',
              fontSize: '0.85rem', fontFamily: "'Montserrat', sans-serif",
              outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#c9a96e'}
            onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'}
          />
          {searchQuery && (
            <button type="button" onClick={clearSearch} style={{
              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: '2px',
            }}>×</button>
          )}
        </div>
        <button type="submit" disabled={!searchQuery.trim() || searching} style={{
          padding: '11px 20px', borderRadius: '28px', flexShrink: 0,
          background: searchQuery.trim() && !searching ? '#c9a96e' : 'rgba(201,169,110,0.2)',
          border: 'none', color: searchQuery.trim() && !searching ? '#0d1126' : 'rgba(201,169,110,0.4)',
          fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          fontFamily: "'Montserrat', sans-serif", cursor: searchQuery.trim() && !searching ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
        }}>
          {searching ? '...' : '✦ Search'}
        </button>
      </form>

      {/* AI search result message */}
      {searchMessage && (
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{
            fontSize: '0.85rem', color: '#c9a96e', fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic', margin: '0 0 4px',
          }}>{searchMessage}</p>
          {searchMood && (
            <p style={{
              fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)', fontFamily: "'Montserrat', sans-serif", margin: 0,
            }}>Mood: {searchMood}</p>
          )}
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => handleFilter(f)} style={{
            padding: '8px 20px', fontSize: '0.72rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
            border: `1.5px solid ${active === f ? '#c9a96e' : 'rgba(255,255,255,0.2)'}`,
            background: active === f ? '#c9a96e' : 'transparent',
            color: active === f ? '#0d1126' : 'rgba(255,255,255,0.5)',
            cursor: 'pointer', transition: 'all 0.2s ease', borderRadius: '24px',
          }}>{f}</button>
        ))}
      </div>

      {/* Masonry grid */}
      <div style={{ columns: 2, columnGap: '12px', maxWidth: '1320px', margin: '0 auto' }} className="gallery-masonry">
        {paginated.map((work, i) => (
          <div key={work.src} style={{
            position: 'relative', breakInside: 'avoid', marginBottom: '12px',
            overflow: 'hidden', cursor: 'pointer', background: '#1a1f3a',
          }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <img
              src={work.src}
              alt={`Kavya portfolio look ${i + 1} — ${work.collection}`}
              loading="lazy"
              decoding="async"
              style={{
                display: 'block', width: '100%', objectFit: 'cover',
                transition: 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
                transform: hovered === i ? 'scale(1.05)' : 'scale(1)',
              }}
            />
            {/* Hover overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(13,17,38,0.88) 0%, transparent 55%)',
              opacity: hovered === i ? 1 : 0, transition: 'opacity 0.3s ease',
            }}>
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                <p style={{
                  fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: '#c9a96e', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, margin: '0 0 4px',
                }}>{work.collection}</p>
                <p style={{
                  fontSize: '0.95rem', fontFamily: "'Playfair Display', serif",
                  fontWeight: 700, color: '#f5f0eb', margin: 0,
                }}>{work.title}</p>
              </div>
            </div>
            {/* Gold corner accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '20px', height: '20px',
              borderTop: '2px solid #c9a96e', borderLeft: '2px solid #c9a96e',
              opacity: hovered === i ? 1 : 0, transition: 'opacity 0.3s ease',
            }} />
          </div>
        ))}
      </div>

      {/* Load more / end state */}
      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        {hasMore ? (
          <>
            <p style={{
              fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)', fontFamily: "'Montserrat', sans-serif", marginBottom: '16px',
            }}>Showing {paginated.length} of {filtered.length} looks</p>
            <button onClick={() => setPage(p => p + 1)} style={{
              padding: '14px 40px', border: '1.5px solid #c9a96e', color: '#c9a96e',
              fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase',
              fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
              background: 'transparent', cursor: 'pointer', transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#c9a96e'; e.currentTarget.style.color = '#0d1126' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c9a96e' }}
            >Load More →</button>
          </>
        ) : (
          <p style={{
            fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', fontFamily: "'Montserrat', sans-serif",
          }}>{filtered.length} frames captured</p>
        )}
      </div>

      {/* Responsive columns */}
      <style>{`
        @media (min-width: 768px) { .gallery-masonry { columns: 3 !important; } }
        @media (min-width: 1024px) { .gallery-masonry { columns: 4 !important; } }
      `}</style>
    </section>
  )
}
