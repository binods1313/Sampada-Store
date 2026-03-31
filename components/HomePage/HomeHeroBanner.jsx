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
    <section className={styles.hero}>
      {/* Description ticker / announcement bar */}
      {desc && (
        <div className={styles.announcementBar}>
          <p>{desc}</p>
        </div>
      )}

      <div className={styles.heroInner}>
        {/* Left: Text Content */}
        <div className={styles.heroText}>
          <p className={styles.smallLabel}>Sampada Originals™</p>
          <p className={styles.winterDrop}>Winter Drop 2026</p>

          <h1 className={styles.heroHeading}>
            <span className={styles.heroLine1}>WEAR YOUR</span>
            <span className={styles.heroLine2}>LEGACY</span>
            <span className={styles.heroLine3}>PROSPER IN STYLE</span>
          </h1>
        </div>

        {/* Right: Banner Image from Sanity */}
        {imageUrl ? (
          <div className={styles.imageWrapper}>
            <Image
              src={imageUrl}
              alt={heroBanner?.midText || 'Sampada banner'}
              width={400}
              height={400}
              className={styles.bannerImage}
              priority
            />
          </div>
        ) : (
          <div className={styles.imageWrapper}>
            <div className={styles.imagePlaceholder}>
              <p>No image set</p>
            </div>
          </div>
        )}
      </div>

      {/* Shop Now Button with Arrow Icon */}
      {product ? (
        <Link href={`/product/${product}`} className={styles.shopNowLink}>
          <button className="shop-now-btn">
            Shop Now
            <span style={{ fontSize: '16px', transition: 'transform 0.3s ease' }}>→</span>
          </button>
        </Link>
      ) : (
        <Link href="/collections/mens-tshirts" className={styles.shopNowLink}>
          <button className="shop-now-btn">
            Shop Now
            <span style={{ fontSize: '16px', transition: 'transform 0.3s ease' }}>→</span>
          </button>
        </Link>
      )}
    </section>
  );
};

export default HomeHeroBanner;
