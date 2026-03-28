// components/HomePage/PromoBanner.jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '../../lib/client';
import styles from './PromoBanner.module.css';

const PromoBanner = ({ bannerData }) => {
  // Get logo from banner data
  const logoImage = bannerData?.logo;

  // Generate logo URL from Sanity
  const logoUrl = logoImage?.asset
    ? urlFor(logoImage).width(200).height(200).url()
    : null;

  // Debug: Log banner data
  console.log('PromoBanner - bannerData:', bannerData);
  console.log('PromoBanner - logoImage:', logoImage);
  console.log('PromoBanner - logoUrl:', logoUrl);
  console.log('PromoBanner - Will render:', logoUrl ? 'UPLOADED LOGO' : 'DEFAULT SVG EMBLEM');

  return (
    <section className={styles.banner} aria-label="Promotional banner">
      <div className={styles.inner}>
        {/* Left: Tagline + Dates */}
        <div className={styles.left}>
          <p className={styles.label}>SALE</p>
          <h2 className={styles.tagline}>
            WEAR YOUR<br />LEGACY<br />PROSPER IN STYLE
          </h2>
          <p className={styles.sale}>31 Feb to 31 Mar 2026</p>
        </div>

        {/* Center: Rotating Logo (uploaded image or default emblem) */}
        <div className={styles.center}>
          {/* Logo wrapper - rotation applied here for consistency */}
          <div
            className={styles.logoRotator}
            role="img"
            aria-label={logoUrl ? "Sampada brand logo" : "Sampada emblem logo"}
          >
            {logoUrl ? (
              /* Uploaded Logo from Sanity */
              <Image
                src={logoUrl}
                alt="Sampada brand logo"
                width={200}
                height={200}
                className={styles.logoImage}
                priority
                quality={85}
              />
            ) : (
              /* Default SVG Emblem Fallback - SHOULD ROTATE */}
              <svg
                width="200"
                height="200"
                viewBox="0 0 300 300"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.emblemSvg}
                aria-hidden="true"
                focusable="false"
                style={{
                  // Fallback inline styles to force rotation
                  animation: 'emblemSpin 60s linear infinite',
                  transformOrigin: 'center',
                  willChange: 'transform'
                }}
              >
                <circle cx="150" cy="150" r="148" fill="none" stroke="#c9a227" strokeWidth="2.5" />
                <circle cx="150" cy="150" r="140" fill="none" stroke="#c9a227" strokeWidth="1" opacity="0.5" />
                <circle cx="150" cy="150" r="139" fill="#8b1a1a" />

                {/* Star of David triangles */}
                <polygon points="150,30 250,190 50,190" fill="none" stroke="#c9a227" strokeWidth="2" opacity="0.85" />
                <polygon points="150,270 250,110 50,110" fill="none" stroke="#c9a227" strokeWidth="2" opacity="0.85" />
                <polygon points="150,65 215,105 215,185 150,225 85,185 85,105" fill="none" stroke="#d4af37" strokeWidth="1.5" opacity="0.7" />

                {/* Inner circle */}
                <circle cx="150" cy="150" r="72" fill="#6b0f0f" />
                <circle cx="150" cy="150" r="72" fill="none" stroke="#c9a227" strokeWidth="2" />

                {/* Sanskrit स */}
                <text x="150" y="190" textAnchor="middle" fontSize="90" fontFamily="serif" fill="#c9a227" fontWeight="bold">
                  स
                </text>

                <circle cx="150" cy="20" r="4" fill="#c9a227" />
                <circle cx="150" cy="280" r="4" fill="#c9a227" />
                <circle cx="20" cy="150" r="4" fill="#c9a227" />
                <circle cx="280" cy="150" r="4" fill="#c9a227" />
              </svg>
            )}
          </div>
        </div>

        {/* Right: Product info + CTA */}
        <div className={styles.right}>
          <p className={styles.smallLabel}>Sampada Originals™</p>
          <h3 className={styles.productName}>Winter Drop 2026</h3>
          <p className={styles.desc}>
            Beyond Fabric: A T-shirt collection crafted to embody grace, grit, and generational wealth!
          </p>
          <div className={styles.ctaWrapper}>
            <Link href="/collections/mens-tshirts">
              <button className={styles.shopBtn}>Shop Now</button>
            </Link>
            <p className={styles.discount}>30% off – 01 Feb to 31 Mar 2026</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
