// pages/stories/index.js
import { useState, useMemo, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { client, urlFor } from '@/lib/client'
import { getLocalKavyaImages } from '@/lib/getLocalStories'
import '../../styles/hero-banner.css';
import SpotlightRevealClean from '@/components/spotlight/SpotlightRevealClean';
import JourneyStats from '@/components/JourneyStats';
import styles from './Stories.module.css'
import animStyles from '@/styles/animations.module.css';
import SelectedWorksGallery from '@/components/stories/SelectedWorksGallery'
import { useInView } from '@/hooks/useInView';

// ─── Collections data ─────────────────────────────────────────────────────────
const COLLECTIONS = [
  { id: 'mens',     label: "Men's Clothing",   href: '/collections/mens-tshirts',   image: '/images/collections/mens.png',       objectPosition: 'center 15%', btnText: 'Shop Men' },
  { id: 'womens',   label: "Women's Clothing", href: '/collections/womens-tshirts', image: '/images/collections/womens.png',     objectPosition: 'center 10%', btnText: 'Shop Women' },
  { id: 'his-hers', label: 'His & Hers',       href: '/collections/his-hers',       image: '/images/collections/his-hers.png',   objectPosition: 'center 10%', btnText: 'Shop His & Hers' },
  { id: 'home',     label: 'Home & Living',    href: '/collections/home-living',    image: '/images/collections/home-living.png', objectPosition: 'center 15%', btnText: 'Shop Home' },
]

const FILTERS = ['All', 'Casual', 'Festive', 'Premium', 'Summer', 'Winter']

// ─── Section Divider ─────────────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div className="brand-divider">
      <div className="brand-divider-line" />
      <div className="brand-divider-diamond" />
      <div className="brand-divider-line" />
    </div>
  )
}

// ─── Meet the Face ────────────────────────────────────────────────────────────
function MeetTheFace({ heroImage, total }) {
  return (
    <section className={styles.bioSection}>
      <div className={styles.bioInner}>
        <div className={styles.bioImageWrap}>
          <img src={heroImage} alt="Kavya" className={styles.bioImage} />
        </div>
        <div className={styles.bioContent}>
          <p className={styles.bioEyebrow}>Meet the Face</p>
          <h2 className={styles.bioName}>Kavya</h2>
          <p className={styles.bioCopy}>
            The face behind Sampada&apos;s first lookbook. A story of grace, grit,
            and style — told through every look she wears.
          </p>
          <p className={styles.bioMeta}>📍 Bengaluru &nbsp;•&nbsp; Winter Drop 2026 &nbsp;•&nbsp; {total} Looks</p>
          <a href="#stories-grid" className={styles.bioBtn}>View All Looks ↓</a>
        </div>
      </div>
    </section>
  )
}

// ─── Horizontal Timeline ──────────────────────────────────────────────────────
function StoryTimeline({ stories }) {
  const scrollTo = (i) => {
    document.getElementById(`story-card-${i}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  return (
    <section className={styles.timeline}>
      <p className={styles.timelineLabel}>Kavya&apos;s Journey</p>
      <div className={styles.timelineScroll}>
        {stories.map((story, i) => (
          <button key={story._id} className={styles.timelineNode} onClick={() => scrollTo(i)}>
            <div className={styles.timelineThumb}>
              <img
                src={story.source === 'local' ? story.coverImage : urlFor(story.coverImage).width(120).height(120).fit('crop').url()}
                alt={story.title}
              />
            </div>
            <span className={styles.timelineNum}>0{i + 1}</span>
            <span className={styles.timelineTitle}>{story.title.split('—')[1]?.trim()}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────
function FilterBar({ total, active, onChange }) {
  return (
    <div className={styles.filterBar}>
      <span className={styles.filterCount}>{total} {total === 1 ? 'Story' : 'Stories'}</span>
      <div className={styles.filterPills}>
        {FILTERS.map(f => (
          <button key={f}
            className={`${styles.filterPill} ${active === f ? styles.filterPillActive : ''}`}
            onClick={() => onChange(f)}
          >{f}</button>
        ))}
      </div>
    </div>
  )
}

// ─── StoryCard ───────────────────────────────────────────────────────────────
function StoryCard({ story, index, featured, onOpen, openTip, onToggleTip, voted, onVote, isTopVoted }) {
  const isLocal = story.source === 'local'
  const imgSrc = isLocal
    ? story.coverImage
    : urlFor(story.coverImage).width(600).height(900).fit('crop').url()

  const [cardRef, cardInView] = useInView({ threshold: 0.15, triggerOnce: true })

  return (
    <div
      ref={cardRef}
      id={`story-card-${index}`}
      className={`${styles.cardWrap} ${featured ? styles.cardWrapFeatured : ''} story-card ${animStyles.cardReveal} ${cardInView ? animStyles.visible : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >

      <div className={`${styles.card} ${featured ? styles.cardFeatured : ''}`}>

        {/* Image */}
        <button className={styles.cardImgBtn} onClick={() => onOpen(index)} aria-label={`View ${story.title}`}>
          <div className={styles.cardImageWrap}>
            <img src={imgSrc} alt={`Kavya wearing ${story.tag || 'Sampada'} — ${story.title}`} className={styles.cardImage} loading="lazy" />
            <div className={styles.cardGradient} />
            <span className={styles.modelBadge}>{story.model}</span>
            {story.tag && <span className={styles.tagPill}>{story.tag}</span>}
          </div>
        </button>

        {/* Meta */}
        <div className={styles.cardMeta}>
          {story.behindTheScenes && (
            <p className={styles.behindScenes}>📍 {story.behindTheScenes}</p>
          )}
          <h3 className={styles.cardTitle}>{story.title}</h3>
          <div className={styles.cardUnderline} />
          {story.description && (
            <p className={`${styles.cardDesc} ${featured ? styles.cardDescFeatured : ''}`}>
              {story.description}
            </p>
          )}

          {/* How to Wear It */}
          {story.styleTip && (
            <>
              <button className={styles.styleTipBtn} onClick={() => onToggleTip(story._id)}>
                ✦ How to Wear It
              </button>
              {openTip === story._id && (
                <p className={styles.tipContent}>{story.styleTip}</p>
              )}
            </>
          )}

          {/* Actions row */}
          <div className={styles.cardActions}>
            <button className={styles.cardCta} onClick={() => onOpen(index)}>
              View Look →
            </button>
            <div className={styles.voteWrap}>
              <button
                className={`${styles.voteBtn} ${voted === story._id ? styles.voteBtnVoted : ''} ${voted && voted !== story._id ? styles.voteBtnDisabled : ''}`}
                onClick={() => onVote(story._id)}
                disabled={!!voted}
              >
                {voted === story._id ? '♥ Your Pick' : '♡ Vote'}
              </button>
              {isTopVoted && <span className={styles.mostLovedBadge}>♥ Most Loved</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ stories, currentIndex, onClose, onPrev, onNext }) {
  const story = stories[currentIndex]
  const touchStartX = useState(null)

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') onPrev()
    if (e.key === 'ArrowRight') onNext()
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!story) return null

  const collectionHref = story.tag?.toLowerCase().includes('men') ? '/collections/mens-tshirts' : '/collections/womens-tshirts'

  return (
    <div className={styles.lbOverlay} onClick={onClose}>
      <div className={styles.lbPanel} onClick={e => e.stopPropagation()}>

        {/* Info panel */}
        <div className={styles.lbInfo}>
          <div className={styles.lbInfoTop}>
            <p className={styles.lbModel}>{story.model}</p>
            <h2 className={styles.lbTitle}>{story.title}</h2>
            {story.tag && <span className={styles.lbTag}>{story.tag}</span>}
            {story.description && <p className={styles.lbDesc}>{story.description}</p>}
            {story.behindTheScenes && <p className={styles.lbLocation}>📍 {story.behindTheScenes}</p>}
          </div>
          <div className={styles.lbInfoBottom}>
            <span className={styles.lbCounter}>{currentIndex + 1} / {stories.length}</span>
            <Link href={collectionHref} className={styles.lbShopBtn} onClick={onClose}>
              Shop This Look →
            </Link>
          </div>
        </div>

        {/* Image panel */}
        <div className={styles.lbImageWrap}>
          <img key={story._id} src={story.coverImage} alt={story.title} className={styles.lbImage} />
          <button className={`${styles.lbArrow} ${styles.lbPrev}`} onClick={e => { e.stopPropagation(); onPrev() }}>‹</button>
          <button className={`${styles.lbArrow} ${styles.lbNext}`} onClick={e => { e.stopPropagation(); onNext() }}>›</button>
        </div>

        <button className={styles.lbClose} onClick={onClose}>✕</button>
      </div>
    </div>
  )
}

// ─── Behind the Shoot ─────────────────────────────────────────────────────────
function BehindTheShoot({ total }) {
  const stats = [
    { value: `${total} Looks`, label: 'Captured' },
    { value: '4 Collections', label: 'Featured' },
    { value: '100%', label: 'Heritage Design' },
  ]
  const [sectionRef, sectionInView] = useInView({ threshold: 0.15, triggerOnce: true })
  
  return (
    <section
      ref={sectionRef}
      className={`section-dark s-section ${animStyles.slideUpFade} ${sectionInView ? animStyles.visible : ''}`}
      style={{
        borderTop: '1px solid rgba(201,169,110,0.15)',
        borderBottom: '1px solid rgba(201,169,110,0.15)',
      }}
    >
      <div className="s-container" style={{ textAlign: 'center' }}>
        <p className="s-label">THE SAMPADA PROMISE</p>
        <h2 className="s-heading" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.8rem)' }}>
          Every look tells a story.
        </h2>
        <p style={{
          fontSize: '0.9rem', color: 'var(--s-text-mid)',
          maxWidth: '360px', margin: '20px auto 40px', lineHeight: 1.7,
        }}>Real models, real wear, real Sampada.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className={`${animStyles.statReveal} ${sectionInView ? animStyles.visible : ''}`}
              style={{ textAlign: 'center', animationDelay: `${index * 0.1}s` }}
            >
              <p style={{
                fontFamily: 'var(--s-serif)',
                fontSize: '1.6rem', fontWeight: 900, color: 'var(--s-gold)', margin: '0 0 6px',
              }}>{stat.value}</p>
              <p style={{
                fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                color: 'var(--s-text-dim)', margin: 0,
              }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Collection Banners ───────────────────────────────────────────────────────
function CollectionBanners() {
  const kavyaShowcase = [
    '/images/kavya-portfolio/WhatsApp Image 2026-02-20 at 07.44.36.jpeg',
    '/images/kavya-portfolio/WhatsApp Image 2026-02-20 at 09.01.17 (1).jpeg',
    '/images/kavya-portfolio/WhatsApp Image 2026-02-27 at 12.21.41 (2).jpeg',
    '/images/kavya-portfolio/WhatsApp Image 2026-02-27 at 12.21.50 (2).jpeg',
  ]

  return (
    <section className="section-dark" style={{
      borderTop: '1px solid rgba(201,169,110,0.1)',
      padding: 0,
    }}>
      {/* Text block */}
      <div style={{ padding: '64px 24px 48px', textAlign: 'center' }}>
        <p className="s-label">SHOP THE COLLECTION</p>
        <h2 className="s-heading" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
          Wear What Kavya Wears
        </h2>
        <span className="s-bar" />
      </div>

      {/* 4-image row from Kavya Archive */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2px',
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '0 0 2px',
      }}>
        {kavyaShowcase.map((src, i) => (
          <div key={i} style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4' }}>
            <img
              src={src}
              alt={`Kavya look ${i + 1}`}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
                transition: 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            />
            {/* Subtle gold bottom fade */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80px',
              background: 'linear-gradient(to top, rgba(26,10,8,0.6), transparent)',
              pointerEvents: 'none',
            }} />
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyLogo}>स</div>
      <h2 className={styles.emptyTitle}>Stories Coming Soon</h2>
      <p className={styles.emptySub}>We&apos;re behind the lens. Check back shortly.</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StoriesIndex({ stories, banner }) {
   const [activeFilter, setActiveFilter] = useState('All')
   const [openTip, setOpenTip] = useState(null)
   const [lightboxIndex, setLightboxIndex] = useState(null)
   const [voted, setVoted] = useState(null)
   const [votes, setVotes] = useState({})
   const [heroAnimated, setHeroAnimated] = useState(false)

   // Load vote from localStorage
   useEffect(() => {
     const saved = localStorage.getItem('sampada_vote')
     if (saved) setVoted(saved)
   }, [])
   
   // Hero animation on mount
   useEffect(() => {
     setHeroAnimated(true)
   }, [])

  const handleVote = (id) => {
    if (voted) return
    setVotes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
    setVoted(id)
    localStorage.setItem('sampada_vote', id)
  }

  const topVotedId = useMemo(() =>
    Object.entries(votes).sort((a, b) => b[1] - a[1])[0]?.[0]
  , [votes])

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return stories
    return stories.filter(s =>
      s.tag?.toLowerCase().includes(activeFilter.toLowerCase()) ||
      s.title?.toLowerCase().includes(activeFilter.toLowerCase())
    )
  }, [stories, activeFilter])

  const isFeatured = filtered.length >= 4
  const heroImage = stories.find(s => s.source === 'local')?.coverImage || null

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const nextLook = useCallback(() => setLightboxIndex(i => (i + 1) % stories.length), [stories.length])
  const prevLook = useCallback(() => setLightboxIndex(i => (i - 1 + stories.length) % stories.length), [stories.length])

   return (
     <>
       <Head>
         <title>Sampada Stories — Lookbooks &amp; Collections</title>
         <meta name="description" content="Explore Sampada's lookbooks, model stories, and curated collections. Featuring Kavya in Winter Drop 2026." />
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         {heroImage && <link rel="preload" href={heroImage} as="image" />}
         {heroImage && <meta property="og:image" content={heroImage} />}
         <meta property="og:title" content="Sampada Stories — Lookbooks &amp; Collections" />
       </Head>

       <main>
         {/* 1. Hero Section: DARK - Spotlight Reveal (Support Page Style) */}
         <section className="section-dark" style={{ padding: 0 }}>
           <div className={styles.heroSpotlight}>
             <SpotlightRevealClean
               baseImage="/images/kavya-portfolio/WhatsApp Image 2026-02-20 at 09.01.17.jpeg"
               revealImage="/images/kavya-portfolio/WhatsApp Image 2026-02-20 at 09.01.17 (1).jpeg"
             />
             
             {/* Quotes/Text overlay in Support page style */}
             <div className="hero-quotes-section">
               {/* Left quote */}
               <div className="hero-quote-block left">
                 <span className="quote-mark">&ldquo;</span>
                 <p className="quote-text" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                   Grace is not just how you look &mdash;<br />
                   it&apos;s how you carry your story.
                 </p>
                 <div className="quote-rule" />
                 <span className="quote-brand">SAMPADA ORIGINALS&trade;</span>
               </div>
               
               {/* Center Title */}
               <div className="hero-quote-center">
                 <div style={{ textAlign: 'center', pointerEvents: 'none', userSelect: 'none' }}>
                   <p style={{
                     fontFamily: "'Montserrat', sans-serif",
                     fontSize: '0.72rem',
                     letterSpacing: '0.28em',
                     textTransform: 'uppercase',
                     color: '#c9a96e',
                     margin: '0 0 18px',
                     fontWeight: 600,
                     textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                   }}>
                   Meet the Face
                 </p>
                 <h1 className={animStyles.cinematicFade} style={{
                   fontFamily: "'Playfair Display', serif",
                   fontSize: 'clamp(5rem, 12vw, 8rem)',
                   fontWeight: 900,
                   color: '#f5f0eb',
                   margin: '0 0 20px',
                   lineHeight: 0.95,
                   letterSpacing: '-0.02em',
                   textShadow: '0 4px 32px rgba(13,17,38,0.8)',
                 }}>
                   Kavya
                 </h1>
                 <p className={animStyles.cinematicFade} style={{
                   fontFamily: "'Montserrat', sans-serif",
                   fontSize: '0.8rem',
                   letterSpacing: '0.22em',
                   textTransform: 'uppercase',
                   color: 'rgba(245,240,235,0.85)',
                   margin: 0,
                   fontWeight: 500,
                   textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                   animationDelay: '0.2s'
                 }}>
                   Sampada Originals&trade;
                 </p>
               </div>
              </div>

              {/* Right quote */}
              <div className="hero-quote-block right">
                <span className="quote-mark">&ldquo;</span>
                <p className="quote-text" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                  Every look is a legacy<br />
                  worn with intention.
                </p>
                <div className="quote-rule" />
                <span className="quote-season">WINTER DROP 2026</span>
              </div>
               </div>
             </div>
           </section>


        {banner?.collectionQuote?.storiesQuote && (
          <section className="section-light s-section">
            <div className="s-container" style={{ textAlign: 'center', maxWidth: '800px' }}>
              <p style={{
                fontFamily: 'var(--s-serif)',
                fontSize: '1.8rem',
                fontStyle: 'italic',
                color: 'var(--s-crimson)',
                lineHeight: '1.4'
              }}>
                "{banner.collectionQuote.storiesQuote}"
              </p>
            </div>
          </section>
        )}

        {banner?.collectionQuote?.storiesQuote && <SectionDivider />}
<JourneyStats />

        {/* 2. Timeline */}
        {stories.length > 0 && <StoryTimeline stories={stories} />}

        <SectionDivider />

        {/* 4. Filter + Grid */}
        <section className={styles.gridSection} id="stories-grid">
          {stories.length === 0 ? <EmptyState /> : (
            <>
              <FilterBar total={filtered.length} active={activeFilter} onChange={setActiveFilter} />
              <div className={styles.grid}>
                {filtered.map((story, i) => (
                  <StoryCard
                    key={story._id}
                    story={story}
                    index={i}
                    featured={i === 0 && isFeatured}
                    onOpen={openLightbox}
                    openTip={openTip}
                    onToggleTip={id => setOpenTip(openTip === id ? null : id)}
                    voted={voted}
                    onVote={handleVote}
                    isTopVoted={topVotedId === story._id && votes[story._id] > 0}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        <SectionDivider />

        {/* 5. Behind the Shoot */}
        <BehindTheShoot total={stories.length} />

        <SectionDivider />

        {/* 6. Collection Banners */}
        <CollectionBanners />

        <SectionDivider />

        {/* 7. Selected Works Gallery */}
        <SelectedWorksGallery />
      </main>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          stories={stories}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevLook}
          onNext={nextLook}
        />
      )}
    </>
  )
}

export async function getStaticProps() {
  const query = `*[_type == "story" && published == true] | order(publishedAt desc) {
    _id, title, slug, model, tag, publishedAt,
    coverImage { alt, asset->{ _ref } }
  }`
  
  const bannerQuery = `*[_type == "banner"][0]{
    collectionQuote
  }`
  
  let sanityStories = []
  let banner = null
  
  try { 
    [sanityStories, banner] = await Promise.all([
      client.fetch(query),
      client.fetch(bannerQuery)
    ])
  } catch (e) { 
    console.error(e) 
  }
  
  const localStories = getLocalKavyaImages()
  return { 
    props: { 
      stories: [...sanityStories, ...localStories],
      banner: banner || null
    }, 
    revalidate: 60 
  }
}
