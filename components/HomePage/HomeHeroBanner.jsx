// components/HomePage/HomeHeroBanner.jsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { urlFor } from '../../lib/client';
import styles from './HomeHeroBanner.module.css';

const HomeHeroBanner = ({ heroBanner }) => {
  const [isClient, setIsClient] = useState(false);
  const product = heroBanner?.product?.slug || '';   // dereferenced slug.current from Sanity
  
  // LOGO DATA - Use 'image' field for Hero Banner (Mandala Emblem)
  const logoImage = heroBanner?.image;
  // Bypass crop/hotspot by omitting them
  const logoImageUncropped = logoImage ? { ...logoImage, crop: undefined, hotspot: undefined } : null;
  const logoUrl = logoImageUncropped?.asset 
    ? urlFor(logoImageUncropped).fit('max').auto('format').url()
    : null;

  // Ensure animation only runs after client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, [heroBanner, logoUrl]);

  return (
    <section className={styles.hero} aria-label="Hero section">
      {/* Enhanced Premium Tagline Banner */}
      <div className={styles.taglineBanner}>
        <div className={styles.shimmerLine}></div>
        <div className={styles.taglineFadeLeft}></div>
        <div className={styles.taglineFadeRight}></div>
        <span className={`${styles.taglineOrnament} ${styles.ornamentLeft}`}>✦</span>
        <span className={`${styles.taglineOrnament} ${styles.ornamentRight}`}>✦</span>
        
        <div 
          className={`sampada-marquee-track ${styles.taglineTrack}`}
          onMouseEnter={(e) => {
            e.currentTarget.style.animationPlayState = 'paused';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.animationPlayState = 'running';
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className={styles.taglineContent}>
              <span className={styles.taglineSecondary}>A T-shirt collection crafted to embody</span>
              <div className={styles.taglineDiamond}></div>
              <span className={styles.taglineAccent}>Grace · Grit · Generational Wealth</span>
              <span className={styles.taglineDivider}>&nbsp;&nbsp;✦&nbsp;&nbsp;</span>
              <span className={styles.taglinePrimary}>Sampada Originals™</span>
              <div className={styles.taglineDiamond}></div>
              <span className={styles.taglineSecondary}>Wear your legacy, prosper in style</span>
              <span className={styles.taglineDivider}>&nbsp;&nbsp;✦&nbsp;&nbsp;</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.heroInner}>
        {/* Left: Text Content */}
        <div className={styles.heroText}>
          <p className={styles.smallLabel}>Sampada Originals™</p>
          <p className={styles.winterDrop}>Winter Drop 2026</p>

          {/* The h1 is the page heading - this is the primary heading for the homepage */}
          <h1 className={styles.heroHeading}>
            <span className={styles.heroLine1}>WEAR YOUR</span>
            <span className={styles.heroLine2}>LEGACY</span>
            <span className={styles.heroLine3}>PROSPER IN STYLE</span>
          </h1>

          {heroBanner?.heroQuote && (
            <p className="hero-quote">{heroBanner.heroQuote}</p>
          )}

          {/* New Clean Stat Row — sits between two thin gold rules */}
          {(() => {
            const heroStats = [
              { value: "Legacy Stitch",  label: "पीढ़ी-दर-पीढ़ी निर्मित" },
              { value: "Gold Thread",    label: "कढ़ाईदार समृद्धि"   },
              { value: "Sampada Seal",   label: "प्रामाणिक विरासत चिह्न"  },
            ];

            return (
              <div className={styles.heroStats}>
                <hr className={styles.statRule} />
                <div className={styles.statRow}>
                  {heroStats.map((stat, i) => (
                    <div className={styles.statCol} key={i}>
                      <span className={styles.statValue}>{stat.value}</span>
                      <span className={styles.statLabel}>{stat.label}</span>
                    </div>
                  ))}
                </div>
                <hr className={styles.statRule} />
              </div>
            );
          })()}
        </div>

        {/* Right: Banner Image + Shop Now Button (vertical stack) */}
        <div className={styles.heroVisual}>
          {logoUrl ? (
            <div className={styles.imageWrapper}>
              <div className={styles.logoImageStatic}>
                <Image
                  src={logoUrl}
                  alt={logoImage?.alt || 'Sampada emblem'}
                  fill
                  sizes="(max-width: 900px) 100vw, 450px"
                  className={styles.logoImg}
                  priority
                  style={{
                    objectFit: 'contain',
                    background: 'transparent',
                    backgroundColor: 'transparent',
                  }}
                />
              </div>
            </div>
          ) : (
            <div className={styles.heroLogoContainer} aria-hidden="true">
              <p>No image set</p>
            </div>
          )}

          {/* Shop Now Button - mirrors FooterBanner structure exactly for mobile centering */}
          <div style={{ textAlign: 'center' }}>
            <Link href={product ? `/product/${product}` : '/shop'} aria-label="Shop the collection">
              <button type="button" className="shop-now-btn-light">
                {heroBanner?.buttonText || 'Shop Now'}
                <span style={{ fontSize: '16px', transition: 'transform 0.3s ease' }} aria-hidden="true">→</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroBanner;
