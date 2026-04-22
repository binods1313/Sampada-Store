// components/stories/SelectedWorksGallery.jsx
import { useState, useMemo } from 'react'
import Link from 'next/link'
import styles from './SelectedWorksGallery.module.css'

const FILTERS = ['All', 'Casual', 'Festive', 'Premium', 'Summer', 'Winter']

// Map tag strings to filter categories
function matchesFilter(story, filter) {
  if (filter === 'All') return true
  const tag = (story.tag || '').toLowerCase()
  const title = (story.title || '').toLowerCase()
  return tag.includes(filter.toLowerCase()) || title.includes(filter.toLowerCase())
}

function GalleryItem({ story }) {
  const [hovered, setHovered] = useState(false)

  // Derive a short collection name from tag
  const collection = story.tag || 'Sampada Originals'
  // Short title — strip "Kavya — " prefix
  const shortTitle = story.title?.replace(/^Kavya\s*[—-]\s*/i, '') || story.title

  return (
    <div
      className={styles.item}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={story.coverImage}
        alt={story.title}
        className={styles.itemImg}
        loading="lazy"
      />
      <div className={`${styles.overlay} ${hovered ? styles.overlayVisible : ''}`}>
        <p className={styles.overlayCollection}>{collection}</p>
        <h3 className={styles.overlayTitle}>{shortTitle}</h3>
      </div>
    </div>
  )
}

export default function SelectedWorksGallery({ stories = [] }) {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = useMemo(
    () => stories.filter(s => matchesFilter(s, activeFilter)),
    [stories, activeFilter]
  )

  return (
    <section className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <p className={styles.eyebrow}>The Kavya Edit</p>
        <h2 className={styles.heading}>Selected Works</h2>
        <p className={styles.sub}>
          A curated gallery of looks — each one a chapter in Kavya&apos;s story.
        </p>
      </div>

      {/* Filter tabs */}
      <div className={styles.filters}>
        {FILTERS.map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${activeFilter === f ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      {filtered.length > 0 ? (
        <div className={styles.masonry}>
          {filtered.map(story => (
            <GalleryItem key={story._id} story={story} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>No looks in this category yet.</p>
      )}

      {/* CTA */}
      <div className={styles.cta}>
        <Link href="/collections/womens-tshirts" className={styles.ctaBtn}>
          Explore Full Collection
        </Link>
      </div>
    </section>
  )
}
