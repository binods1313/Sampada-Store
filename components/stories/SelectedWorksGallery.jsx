// components/stories/SelectedWorksGallery.jsx
import { useState, useMemo } from 'react'
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

  const filtered = useMemo(
    () => (active === 'All' ? works : works.filter(w => w.category === active)),
    [active]
  )

  const paginated = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = paginated.length < filtered.length

  const handleFilter = (f) => { setActive(f); setPage(1) }

  return (
    <section style={{ background: '#0d1126', padding: '80px 24px 96px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
