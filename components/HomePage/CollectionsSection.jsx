// components/HomePage/CollectionsSection.jsx
import React from 'react';
import Link from 'next/link';
import styles from './CollectionsSection.module.css';

const collections = [
  {
    id: 'mens',
    label: "Men's Clothing",
    href: '/collections/mens-tshirts',
    btnText: 'Shop Men',
    // gradient inspired by earthy/forest tones
    gradient: 'linear-gradient(160deg, #3d2b1f 0%, #6b4c35 50%, #8b6553 100%)',
    emoji: '👕',
    overlayColor: 'rgba(40,20,10,0.45)',
  },
  {
    id: 'womens',
    label: "Women's Clothing",
    href: '/collections/womens-tshirts',
    btnText: 'Shop Women',
    gradient: 'linear-gradient(160deg, #2d4a22 0%, #5a7c42 50%, #7a9e60 100%)',
    emoji: '👗',
    overlayColor: 'rgba(20,40,10,0.40)',
  },
  {
    id: 'his-hers',
    label: 'His & Hers',
    href: '/collections/his-hers',
    btnText: 'Shop His & Hers',
    gradient: 'linear-gradient(160deg, #1a2a3a 0%, #2c4a6b 50%, #3d6080 100%)',
    emoji: '👫',
    overlayColor: 'rgba(10,25,45,0.40)',
  },
  {
    id: 'home',
    label: 'Home & Living',
    href: '/collections/home-living',
    btnText: 'Shop Home',
    gradient: 'linear-gradient(160deg, #3a2a1a 0%, #6b502c 50%, #7a6040 100%)',
    emoji: '🏠',
    overlayColor: 'rgba(40,25,10,0.40)',
  },
];

const CollectionsSection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Explore Our Collections</h2>

      <div className={styles.grid}>
        {collections.map((col) => (
          <div
            key={col.id}
            className={styles.card}
            style={{ background: col.gradient }}
          >
            {/* Decorative emoji background */}
            <div className={styles.cardEmoji}>{col.emoji}</div>

            {/* Overlay */}
            <div
              className={styles.cardOverlay}
              style={{ background: col.overlayColor }}
            />

            {/* Content */}
            <div className={styles.cardContent}>
              <h3 className={styles.cardLabel}>{col.label}</h3>
              <Link href={col.href}>
                <button className={styles.cardBtn}>{col.btnText}</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectionsSection;
