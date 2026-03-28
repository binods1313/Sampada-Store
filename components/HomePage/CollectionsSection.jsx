// components/HomePage/CollectionsSection.jsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CollectionsSection.module.css';

const collections = [
  {
    id: 'mens',
    label: "Men's Clothing",
    href: '/collections/mens-tshirts',
    btnText: 'Shop Men',
    image: '/images/collections/mens.png',
    alt: "Men's Clothing Collection - Custom T-shirts and apparel for men",
    objectFit: 'cover', // Match Women's layout
    objectPosition: 'center 35%', // Focus on face and upper body
  },
  {
    id: 'womens',
    label: "Women's Clothing",
    href: '/collections/womens-tshirts',
    btnText: 'Shop Women',
    image: '/images/collections/womens.jpeg',
    alt: "Women's Clothing Collection - Custom T-shirts and apparel for women",
    objectFit: 'cover', // Works perfectly
    objectPosition: 'center top',
  },
  {
    id: 'his-hers',
    label: 'His & Hers',
    href: '/collections/his-hers',
    btnText: 'Shop His & Hers',
    image: '/images/collections/his-hers.png',
    alt: 'His & Hers Collection - Matching outfits for couples',
    objectFit: 'cover', // Match Women's layout
    objectPosition: 'center 30%', // Focus on faces and upper bodies
  },
  {
    id: 'home',
    label: 'Home & Living',
    href: '/collections/home-living',
    btnText: 'Shop Home',
    image: '/images/collections/home-living.png',
    alt: 'Home & Living Collection - Custom mugs, blankets, and home decor',
    objectFit: 'cover', // Works perfectly
    objectPosition: 'center center',
  },
];

const CollectionsSection = () => {
  return (
    <section className={styles.section} aria-labelledby="collections-heading">
      <h2 id="collections-heading" className={styles.heading}>
        Explore Our Collections
      </h2>

      <div className={styles.grid}>
        {collections.map((col) => (
          <Link
            key={col.id}
            href={col.href}
            className={styles.cardLink}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <article
              className={styles.card}
              aria-label={`${col.label} collection`}
            >
              {/* Collection Image */}
              <div className={styles.cardImageContainer}>
                <Image
                  src={col.image}
                  alt={col.alt}
                  fill
                  sizes="(max-width: 560px) 100vw, (max-width: 960px) 50vw, 25vw"
                  priority={false}
                  loading="lazy"
                  quality={85}
                  className={styles.cardImage}
                  style={{
                    objectFit: col.objectFit || 'cover',
                    objectPosition: col.objectPosition || 'center center'
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className={styles.cardOverlay} />
              </div>

              {/* Content */}
              <div className={styles.cardContent}>
                <h3 className={styles.cardLabel}>{col.label}</h3>
                <button className={styles.cardBtn} aria-label={`Shop ${col.label}`}>
                  {col.btnText}
                </button>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CollectionsSection;
