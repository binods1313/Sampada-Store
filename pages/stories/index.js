// pages/stories/index.js
import { useState, useMemo, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { client, urlFor } from '@/lib/client'
import { getLocalKavyaImages } from '@/lib/getLocalStories'
import styles from './Stories.module.css'
import SpotlightReveal from '@/components/spotlight/SpotlightReveal'
import SelectedWorksGallery from '@/components/stories/SelectedWorksGallery'

// ─── Collections data ─────────────────────────────────────────────────────────
const COLLECTIONS = [
  { id: 'mens',     label: "Men's Clothing",   href: '/collections/mens-tshirts',   image: '/images/collections/mens.png',       objectPosition: 'center 15%', btnText: 'Shop Men' },
  { id: 'womens',   label: "Women's Clothing", href: '/collections/womens-tshirts', image: '/images/collections/womens.png',     objectPosition: 'center 10%', btnText: 'Shop Women' },
  { id: 'his-hers', label: 'His & Hers',       href: '/collections/his-hers',       image: '/images/collections/his-hers.png',   objectPosition: 'center 10%', btnText: 'Shop His & Hers' },
  { id: 'home',     label: 'Home & Living',    href: '/collections/home-living',    image: '/images/collections/home-living.png', objectPosition: 'center 15%', btnText: 'Shop Home' },
]

const FILTERS = ['All', 'Casual', 'Festive', 'Premium', 'Summer', 'Winter']

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

// ─── Story Card ───────────────────────────────────────────────────────────────
function StoryCard({ story, index, featured, onOpen, openTip, onToggleTip, voted, onVote, isTopVoted }) {
  const isLocal = story.source === 'local'
  const imgSrc = isLocal
    ? story.coverImage
    : urlFor(story.coverImage).width(600).height(900).fit('crop').url()

  return (
    <div id={`story-card-${index}`} className={`${styles.cardWrap} ${featured ? styles.cardWrapFeatured : ''}`}>
      <div className={`${styles.card} ${featured ? styles.cardFeatured : ''}`}>

        {/* Image */}
        <button className={styles.cardImgBtn} onClick={() => onOpen(index)} aria-label={`View ${story.title}`}>
          <div className={styles.cardImageWrap}>
            <img src={imgSrc} alt={story.title} className={styles.cardImage} loading="lazy" />
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
  return (
    <section className={styles.behindSection}>
      <div className={styles.behindInner}>
        <p className={styles.behindEyebrow}>The Sampada Promise</p>
        <h2 className={styles.behindHeading}>Every look tells a story.</h2>
        <p className={styles.behindSub}>Our models wear what we make.<br />Real people. Real style. Real Sampada.</p>
        <div className={styles.behindStats}>
          <div className={styles.behindStat}><span className={styles.behindIcon}>📸</span><span className={styles.behindStatLabel}>{total} Looks Captured</span></div>
          <div className={styles.behindStat}><span className={styles.behindIcon}>👗</span><span className={styles.behindStatLabel}>4 Collections Featured</span></div>
          <div className={styles.behindStat}><span className={styles.behindIcon}>✨</span><span className={styles.behindStatLabel}>100% Heritage Design</span></div>
        </div>
      </div>
    </section>
  )
}

// ─── Collection Banners ───────────────────────────────────────────────────────
function CollectionBanners() {
  return (
    <section className={styles.collectionsSection}>
      <div className={styles.collectionsHeader}>
        <p className={styles.collectionsEyebrow}>Shop the Collection</p>
        <h2 className={styles.collectionsHeading}>Wear What Kavya Wears</h2>
      </div>
      <div className={styles.collectionsGrid}>
        {COLLECTIONS.map(col => (
          <Link key={col.id} href={col.href} className={styles.colCard}>
            <img src={col.image} alt={col.label} className={styles.colImage}
              style={{ objectPosition: col.objectPosition }} loading="lazy" />
            <div className={styles.colOverlay} />
            <div className={styles.colContent}>
              <h3 className={styles.colLabel}>{col.label}</h3>
              <span className={styles.colBtn}>{col.btnText}</span>
            </div>
          </Link>
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
export default function StoriesIndex({ stories }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [openTip, setOpenTip] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [voted, setVoted] = useState(null)
  const [votes, setVotes] = useState({})

  // Load vote from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sampada_vote')
    if (saved) setVoted(saved)
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
        {heroImage && <meta property="og:image" content={heroImage} />}
        <meta property="og:title" content="Sampada Stories — Lookbooks & Collections" />
      </Head>

      <main>
        {/* 1. Hero — Spotlight Reveal */}
        <SpotlightReveal
          imageA="/images/Kavya/kavya-1.jpg"
          imageB="/images/Kavya/kavya-3.jpg"
        />

        {/* 2. Meet the Face */}
        {heroImage && <MeetTheFace heroImage={heroImage} total={stories.length} />}

        {/* 3. Timeline */}
        {stories.length > 0 && <StoryTimeline stories={stories} />}

        {/* 4. Filter + Grid */}
        <section className={styles.gridSection} id="stories-grid">
          {stories.length === 0 ? <EmptyState /> : (
            <>
              <FilterBar total={filtered.length} active={activeFilter} onChange={setActiveFilter} />
              <div className={`${styles.grid} ${styles.gridAnimated}`}>
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

        {/* 5. Behind the Shoot */}
        <BehindTheShoot total={stories.length} />

        {/* 6. Collection Banners */}
        <CollectionBanners />

        {/* 7. Selected Works Gallery */}
        <SelectedWorksGallery stories={stories} />
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
  let sanityStories = []
  try { sanityStories = await client.fetch(query) } catch (e) { console.error(e) }
  const localStories = getLocalKavyaImages()
  return { props: { stories: [...sanityStories, ...localStories] }, revalidate: 60 }
}
