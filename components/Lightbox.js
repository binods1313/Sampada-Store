// components/Lightbox.js — split panel with description
import { useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import styles from './Lightbox.module.css'

export default function Lightbox({ items, currentIndex, onClose, onPrev, onNext }) {
  const current = items[currentIndex]
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < items.length - 1

  // touch swipe
  const touchStartX = useRef(null)

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft' && hasPrev) onPrev()
    if (e.key === 'ArrowRight' && hasNext) onNext()
  }, [onClose, onPrev, onNext, hasPrev, hasNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!current) return null

  const lookNumber = current.title?.split('—')[1]?.trim() || `Look ${currentIndex + 1}`
  const collectionHref = current.tag?.toLowerCase().includes('men') ? '/collections/mens-tshirts' : '/collections/womens-tshirts'

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touchStartX.current === null) return
        const diff = touchStartX.current - e.changedTouches[0].clientX
        if (diff > 50 && hasNext) onNext()
        if (diff < -50 && hasPrev) onPrev()
        touchStartX.current = null
      }}
    >
      <div className={styles.panel} onClick={e => e.stopPropagation()}>

        {/* ── Left info panel ── */}
        <div className={styles.infoPanel}>
          <div className={styles.infoPanelTop}>
            <p className={styles.infoModel}>{current.model}</p>
            <h3 className={styles.infoTitle}>{current.title}</h3>
            {current.tag && <span className={styles.infoTag}>{current.tag}</span>}
            {current.description && (
              <p className={styles.infoDesc}>{current.description}</p>
            )}
          </div>
          <div className={styles.infoPanelBottom}>
            <span className={styles.infoCounter}>{currentIndex + 1} / {items.length}</span>
            <Link href={collectionHref} className={styles.infoShopBtn} onClick={onClose}>
              Shop This Look →
            </Link>
          </div>
        </div>

        {/* ── Right image panel ── */}
        <div className={styles.imagePanel}>
          {/* Prev */}
          {hasPrev && (
            <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={e => { e.stopPropagation(); onPrev() }} aria-label="Previous">‹</button>
          )}

          <img
            key={current._id}
            src={current.coverImage}
            alt={current.title}
            className={styles.image}
          />

          {/* Next */}
          {hasNext && (
            <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={e => { e.stopPropagation(); onNext() }} aria-label="Next">›</button>
          )}

          {/* Close */}
          <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
        </div>
      </div>
    </div>
  )
}
