// components/StoriesHeroBanner.jsx
// Full-bleed Stories hero — editorial carousel + direct quote overlays
import React, { useState, useEffect, useCallback } from 'react';
import styles from './StoriesHeroBanner.module.css';

export const STORIES_HERO_SLIDES = [
  {
    image: '/images/stories/hero/01-winter-editorial.jpg',
    alt: 'Winter editorial — crimson and gold layered lookbook',
    label: 'Winter Drop 2026',
    objectPosition: 'center center',
    overlayVariant: 'washLeft',
    quoteLeft: 'Grace is not just how you look — it\'s how you carry your story.',
    quoteRight: 'Every look is a legacy worn with intention.',
  },
  {
    image: '/images/stories/hero/02-festive-silk-look.jpg',
    alt: 'Festive silk-inspired contemporary Sampada look',
    label: 'Festive Edit',
    objectPosition: 'center 30%',
    overlayVariant: 'washRight',
    quoteLeft: 'Silk whispers heritage; style speaks legacy.',
    quoteRight: 'Dress the celebration. Wear the craft.',
  },
  {
    image: '/images/stories/hero/03-premium-casual.jpg',
    alt: 'Premium casual layered ivory and crimson apparel',
    label: 'Everyday Legacy',
    objectPosition: 'center center',
    overlayVariant: 'washBalanced',
    quoteLeft: 'Casual never means careless — it means composed.',
    quoteRight: 'Prosper in comfort. Stand in character.',
  },
  {
    image: '/images/stories/hero/04-gold-embroidered.jpg',
    alt: 'Gold embroidered heritage jacket editorial',
    label: 'Gold Thread',
    objectPosition: 'center 25%',
    overlayVariant: 'washCenter',
    quoteLeft: 'Every stitch carries a generation of intention.',
    quoteRight: 'Embroidery is memory made visible.',
  },
  {
    image: '/images/stories/hero/slide5.png',
    alt: 'Legacy portrait — ivory saree with crimson gold border in palace setting',
    label: 'The Legacy Portrait',
    objectPosition: 'center 35%',
    overlayVariant: 'washLeft',
    quoteLeft: 'What you wear today becomes tomorrow\'s heirloom.',
    quoteRight: 'Legacy is the fabric of who we become.',
  },
  {
    image: '/images/stories/hero/06-evening-gala.jpg',
    alt: 'Evening gala couture crimson and gold editorial',
    label: 'Evening Gala',
    objectPosition: 'center 20%',
    overlayVariant: 'washRight',
    quoteLeft: 'Elegance is the language of legacy.',
    quoteRight: 'Prosper in style, shine with intention.',
  },
];

const SLIDE_INTERVAL_MS = 7000;

export default function StoriesHeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const goToSlide = useCallback((index) => {
    setActiveSlide((index + STORIES_HERO_SLIDES.length) % STORIES_HERO_SLIDES.length);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide(activeSlide + 1);
  }, [activeSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(activeSlide - 1);
  }, [activeSlide, goToSlide]);

  useEffect(() => {
    if (!isClient || isPaused) return undefined;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const timer = setInterval(nextSlide, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isClient, isPaused, nextSlide]);

  const current = STORIES_HERO_SLIDES[activeSlide];
  const overlayClass = styles[current.overlayVariant] || styles.washBalanced;

  return (
    <section
      className={styles.hero}
      aria-label="Stories hero"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.heroBleed}>
        <div className={styles.slideStack} aria-hidden="true">
          {STORIES_HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.image}
              className={`${styles.slide} ${i === activeSlide ? styles.slideActive : ''}`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className={styles.slideImg}
                style={{ objectPosition: slide.objectPosition }}
                draggable={false}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Per-slide editorial overlay for quote legibility (no cards) */}
        <div
          key={current.overlayVariant}
          className={`${styles.editorialOverlay} ${overlayClass}`}
          aria-hidden="true"
        />

        {/* Direct quote overlays — homepage / support style */}
        <div className={styles.quotesLayer}>
          <div className={`${styles.quoteBlock} ${styles.quoteLeft}`}>
            <span className={styles.quoteMark}>&ldquo;</span>
            <p className={styles.quoteText}>{current.quoteLeft}</p>
            <div className={styles.quoteRule} />
            <span className={styles.quoteBrand}>Sampada Originals™</span>
          </div>

          <div className={styles.centerBlock}>
            <p className={styles.eyebrow}>Meet the Face</p>
            <h1 className={styles.heroTitle}>Kavya</h1>
            <p className={styles.slideLabel}>{current.label}</p>
            <p className={styles.heroSub}>Sampada Originals™</p>
          </div>

          <div className={`${styles.quoteBlock} ${styles.quoteRight}`}>
            <span className={styles.quoteMark}>&ldquo;</span>
            <p className={styles.quoteText}>{current.quoteRight}</p>
            <div className={styles.quoteRule} />
            <span className={styles.quoteSeason}>Winter Drop 2026</span>
          </div>
        </div>

        <div className={styles.carouselControls}>
          <button type="button" className={styles.carouselArrow} onClick={prevSlide} aria-label="Previous look">
            ‹
          </button>
          <div className={styles.slideDots} role="tablist" aria-label="Story hero looks">
            {STORIES_HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.image}
                type="button"
                role="tab"
                aria-selected={i === activeSlide}
                aria-label={`Look ${i + 1}: ${slide.label}`}
                className={`${styles.dot} ${i === activeSlide ? styles.dotActive : ''}`}
                onClick={() => goToSlide(i)}
              />
            ))}
          </div>
          <button type="button" className={styles.carouselArrow} onClick={nextSlide} aria-label="Next look">
            ›
          </button>
        </div>

        <div className={styles.heroFade} aria-hidden="true" />
      </div>
    </section>
  );
}