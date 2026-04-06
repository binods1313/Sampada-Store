// components/HomePage/HomeHeroBanner.jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '../../lib/client';
import styles from './HomeHeroBanner.module.css';

const HomeHeroBanner = ({ heroBanner }) => {
  const desc = heroBanner?.desc || 'Beyond Fabric: A T-shirt collection crafted to embody grace, grit, and generational wealth!';
  const product = heroBanner?.product || '';
  const image = heroBanner?.image;

  // Generate image URL from Sanity
  const imageUrl = image?.asset 
    ? urlFor(image).width(500).height(500).url()
    : null;

  return (
    <section className={styles.hero} aria-label="Hero section">
      {/* Description ticker / announcement bar */}
      {desc && (
        <div className={styles.announcementBar} role="status" aria-live="polite">
          <p>{desc}</p>
        </div>
      )}

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
              className="shop-now-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
              aria-label={`Shop ${product}`}
            >
              Shop Now
              <span style={{ fontSize: '16px', transition: 'transform 0.3s ease' }} aria-hidden="true">→</span>
            </Link>
          ) : (
            <Link
              href="/collections/mens-tshirts"
              className="shop-now-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
              aria-label="Shop men's t-shirts"
            >
              Shop Now
              <span style={{ fontSize: '16px', transition: 'transform 0.3s ease' }} aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeHeroBanner;
