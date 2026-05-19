// components/HomePage/HomeHeroBanner.jsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '../../lib/client';
import styles from './HomeHeroBanner.module.css';

const HomeHeroBanner = ({ heroBanner }) => {
  const [isClient, setIsClient] = useState(false);
  const product = heroBanner?.product || '';
  const image = heroBanner?.image;

  // Generate image URL from Sanity
  const imageUrl = image?.asset 
    ? urlFor(image).width(500).height(500).url()
    : null;

  // Ensure animation only runs after client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

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
        </div>

        {/* Right: Banner Image + Shop Now Button (vertical stack) */}
        <div className={styles.heroVisual}>
          {imageUrl ? (
            <div className={styles.imageWrapper}>
              <Image
                src={imageUrl}
                alt={heroBanner?.altText || heroBanner?.midText || 'Sampada winter collection banner image'}
                width={400}
                height={400}
                className={styles.bannerImage}
                priority
              />
            </div>
          ) : (
            <div className={styles.imageWrapper} aria-hidden="true">
              <div className={styles.imagePlaceholder}>
                <p>No image set</p>
              </div>
            </div>
          )}

          {/* Shop Now Button - sits directly below the logo */}
          {product ? (
            <Link
              href={`/product/${product}`}
              className={styles.shopNowLink}
              aria-label={`Shop ${product}`}
            >
              <button type="button" className="shop-now-btn-reversed">
                Shop Now <span className="arrow">→</span>
              </button>
            </Link>
          ) : (
            <Link
              href="/collections/mens-tshirts"
              className={styles.shopNowLink}
              aria-label="Shop men's t-shirts"
            >
              <button type="button" className="shop-now-btn-reversed">
                Shop Now <span className="arrow">→</span>
              </button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeHeroBanner;
