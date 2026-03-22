// components/HomePage/HomeHeroBanner.jsx
import React from 'react';
import Link from 'next/link';
import styles from './HomeHeroBanner.module.css';

// Inline SVG Sanskrit emblem (sa/स character with geometric Star of David rings)
const SanskritEmblem = ({ size = 300 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 300 300"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.emblemSvg}
  >
    {/* Outer decorative circle */}
    <circle cx="150" cy="150" r="148" fill="none" stroke="#c9a227" strokeWidth="2.5" />
    <circle cx="150" cy="150" r="140" fill="none" stroke="#c9a227" strokeWidth="1" opacity="0.5" />

    {/* Light background fill for light theme */}
    <circle cx="150" cy="150" r="139" fill="#f8f8f8" />

    {/* Outer geometric star ring (Star of David pattern) */}
    {/* Triangle pointing up */}
    <polygon
      points="150,30 250,190 50,190"
      fill="none"
      stroke="#c9a227"
      strokeWidth="2"
      opacity="0.85"
    />
    {/* Triangle pointing down */}
    <polygon
      points="150,270 250,110 50,110"
      fill="none"
      stroke="#c9a227"
      strokeWidth="2"
      opacity="0.85"
    />

    {/* Inner hexagonal ring */}
    <polygon
      points="150,65 215,105 215,185 150,225 85,185 85,105"
      fill="none"
      stroke="#d4af37"
      strokeWidth="1.5"
      opacity="0.7"
    />

    {/* Inner circle background */}
    <circle cx="150" cy="150" r="72" fill="#fff8e7" />
    <circle cx="150" cy="150" r="72" fill="none" stroke="#c9a227" strokeWidth="2" />

    {/* Sanskrit स character */}
    <text
      x="150"
      y="190"
      textAnchor="middle"
      fontSize="90"
      fontFamily="serif"
      fill="#c9a227"
      fontWeight="bold"
    >
      स
    </text>

    {/* Small decorative dots at cardinal points */}
    <circle cx="150" cy="20" r="4" fill="#c9a227" />
    <circle cx="150" cy="280" r="4" fill="#c9a227" />
    <circle cx="20" cy="150" r="4" fill="#c9a227" />
    <circle cx="280" cy="150" r="4" fill="#c9a227" />
    <circle cx="36" cy="60" r="3" fill="#c9a227" opacity="0.7" />
    <circle cx="264" cy="60" r="3" fill="#c9a227" opacity="0.7" />
    <circle cx="36" cy="240" r="3" fill="#c9a227" opacity="0.7" />
    <circle cx="264" cy="240" r="3" fill="#c9a227" opacity="0.7" />
  </svg>
);

const HomeHeroBanner = ({ heroBanner }) => {
  const desc = heroBanner?.desc || 'Beyond Fabric: A T-shirt collection crafted to embody grace, grit, and generational wealth!';
  const product = heroBanner?.product || '';

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

        {/* Right: Emblem */}
        <div className={styles.emblemWrapper}>
          <SanskritEmblem size={300} />
        </div>
      </div>

      {/* Shop Now Button */}
      {product ? (
        <Link href={`/product/${product}`} className={styles.shopNowLink}>
          <button className={styles.shopNowBtn}>Shop Now</button>
        </Link>
      ) : (
        <Link href="/collections/mens-tshirts" className={styles.shopNowLink}>
          <button className={styles.shopNowBtn}>Shop Now</button>
        </Link>
      )}
    </section>
  );
};

export default HomeHeroBanner;
