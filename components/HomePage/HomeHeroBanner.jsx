// components/HomePage/HomeHeroBanner.jsx
// Full-bleed editorial hero carousel — Sampada Originals ivory/sandal/crimson/gold
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '../../lib/client';
import styles from './HomeHeroBanner.module.css';

const HERO_SLIDES = [
  {
    image: '/images/home/hero/slide1.png',
    alt: 'Winter Drop 2026 — Sampada Originals premium streetwear editorial',
    eyebrow: 'Winter Drop 2026',
    objectPosition: 'center 22%',
  },
  {
    image: '/images/home/hero/slide2.png',
    alt: 'Wear Your Legacy — Gen Z models in customized Sampada outfits',
    eyebrow: 'Heritage Collection',
    objectPosition: 'center 30%',
  },
  {
    image: '/images/homepage/hero/03-gold-thread.jpg',
    alt: 'Gold Thread — intricate embroidery and luxury fabric detail',
    eyebrow: 'Gold Thread',
    objectPosition: 'center 30%',
  },
  {
    image: '/images/home/hero/slide4.png',
    alt: 'Prosper in Style — classy Sampada Originals editorial',
    eyebrow: 'Prosper in Style',
    objectPosition: 'center 20%',
  },
  {
    image: '/images/homepage/hero/05-generational-wealth.jpg',
    alt: 'Generational Wealth — heirloom quality premium apparel',
    eyebrow: 'Generational Wealth',
    objectPosition: 'center 25%',
  },
  {
    image: '/images/homepage/hero/06-sampada-originals.jpg',
    alt: 'Sampada Originals — lotus mandala brand emblem atmosphere',
    eyebrow: 'Sampada Originals™',
    objectPosition: 'center center',
  },
];

const SLIDE_INTERVAL_MS = 6000;

const HomeHeroBanner = ({ heroBanner }) => {
  const [isClient, setIsClient] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const product = heroBanner?.product?.slug || '';

  const logoImage = heroBanner?.image;
  const logoImageUncropped = logoImage ? { ...logoImage, crop: undefined, hotspot: undefined } : null;
  const logoUrl = logoImageUncropped?.asset
    ? urlFor(logoImageUncropped).fit('max').auto('format').url()
    : null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const goToSlide = useCallback((index) => {
    setActiveSlide((index + HERO_SLIDES.length) % HERO_SLIDES.length);
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

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <section
      className={styles.hero}
      aria-label="Hero section"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Crimson + gold tagline marquee */}
      <div className={styles.taglineBanner}>
        <div className={styles.shimmerLine} />
        <div className={styles.taglineFadeLeft} />
        <div className={styles.taglineFadeRight} />
        <span className={`${styles.taglineOrnament} ${styles.ornamentLeft}`}>✦</span>
        <span className={`${styles.taglineOrnament} ${styles.ornamentRight}`}>✦</span>

        {isClient && (
          <div
            className={`sampada-marquee-track ${styles.taglineTrack}`}
            onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = 'paused'; }}
            onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = 'running'; }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className={styles.taglineContent}>
                <span className={styles.taglineSecondary}>A T-shirt collection crafted to embody</span>
                <div className={styles.taglineDiamond} />
                <span className={styles.taglineAccent}>Grace · Grit · Generational Wealth</span>
                <span className={styles.taglineDivider}>&nbsp;&nbsp;✦&nbsp;&nbsp;</span>
                <span className={styles.taglinePrimary}>Sampada Originals™</span>
                <div className={styles.taglineDiamond} />
                <span className={styles.taglineSecondary}>Wear your legacy, prosper in style</span>
                <span className={styles.taglineDivider}>&nbsp;&nbsp;✦&nbsp;&nbsp;</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full-bleed editorial hero */}
      <div className={styles.heroBleed}>
        {/* Background slides */}
        <div className={styles.slideStack} aria-hidden="true">
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.image}
              className={`${styles.slide} ${i === activeSlide ? styles.slideActive : ''}`}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="100vw"
                className={styles.slideImg}
                style={{ objectPosition: slide.objectPosition }}
                priority={i === 0}
                quality={85}
              />
            </div>
          ))}
        </div>

        {/* Ivory → sandal editorial gradient for text legibility */}
        <div className={styles.editorialOverlay} aria-hidden="true" />

        {/* Top-right Sampada emblem (decorative) */}
        <div className={styles.brandMarkOverlay} aria-hidden="true" role="presentation">
          {logoUrl ? (
              <div className={`${styles.brandMark} sampada-emblem-hover`} tabIndex={0} aria-hidden="false" role="img">
              <Image
                src={logoUrl}
                alt={logoImage?.alt || 'Sampada emblem'}
                fill
                sizes="(max-width: 767px) 120px, (max-width: 1023px) 160px, 190px"
                className={styles.brandMarkImg}
                priority
              />
            </div>
          ) : (
            <div className={styles.brandMarkFallback}>
              <span>स</span>
            </div>
          )}
        </div>

        {/* Two-column editorial content */}
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <p className={styles.smallLabel}>Sampada Originals™</p>
            <p className={styles.winterDrop} key={currentSlide.eyebrow}>
              {currentSlide.eyebrow}
            </p>

            <h1 className={styles.heroHeading}>
              <span className={styles.heroLine1}>WEAR YOUR</span>
              <span className={styles.heroLine2}>LEGACY</span>
              <span className={styles.heroLine3}>PROSPER IN STYLE</span>
            </h1>

            {heroBanner?.heroQuote && (() => {
              const sentences = heroBanner.heroQuote
                .split(/(?<=[.!?])\s+/)
                .filter((s) => s.trim().length > 0);
              const paragraphs = [];
              for (let i = 0; i < sentences.length; i += 2) {
                paragraphs.push(sentences.slice(i, i + 2).join(' '));
              }
              return (
                <div className={styles.heroQuote}>
                  {paragraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              );
            })()}

            <div className={styles.heroStats}>
              <hr className={styles.statRule} />
              <div className={styles.statRow}>
                {[
                  { value: 'Legacy Stitch', label: 'पीढ़ी-दर-पीढ़ी निर्मित' },
                  { value: 'Gold Thread', label: 'कढ़ाईदार समृद्धि' },
                  { value: 'Sampada Seal', label: 'प्रामाणिक विरासत चिह्न' },
                ].map((stat, i) => (
                  <div className={styles.statCol} key={i}>
                    <span className={styles.statValue}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
              <hr className={styles.statRule} />
            </div>

            <div className={styles.heroCta}>
              <Link href={product ? `/product/${product}` : '/shop'} aria-label="Shop the collection">
                <button type="button" className={styles.shopBtn}>
                  {heroBanner?.buttonText || 'Shop Now'}
                  <span aria-hidden="true">→</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right visual accent preserves editorial balance */}
          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.editorialFrame}>
              <div className={styles.frameInner} />
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        <div className={styles.carouselControls}>
          <button
            type="button"
            className={styles.carouselArrow}
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            ‹
          </button>

          <div className={styles.slideDots} role="tablist" aria-label="Hero slides">
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.image}
                type="button"
                role="tab"
                aria-selected={i === activeSlide}
                aria-label={`Slide ${i + 1}: ${slide.eyebrow}`}
                className={`${styles.dot} ${i === activeSlide ? styles.dotActive : ''}`}
                onClick={() => goToSlide(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.carouselArrow}
            onClick={nextSlide}
            aria-label="Next slide"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroBanner;