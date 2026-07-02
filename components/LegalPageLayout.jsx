import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/legal.module.css';

export default function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  tocItems,
  contentHtml,
  meta,
}) {
  const [activeId, setActiveId] = useState(tocItems[0]?.id);
  const [tocOpen, setTocOpen] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const headings = document.querySelectorAll('article h2[id]');
    if (!headings.length) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    headings.forEach((h) => observerRef.current.observe(h));
    return () => observerRef.current?.disconnect();
  }, []);

  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';

  return (
    <>
      <Head>
        <title>{meta?.title ?? `${title} — Sampada Originals`}</title>
        <meta name="description" content={meta?.description ?? ''} />
        <link rel="canonical" href={meta?.canonical ?? 'https://sampadaoriginals.in'} />
        <meta name="robots" content="index,follow" />
      </Head>

      <div className={styles.pageWrapper}>
        {/* Hero */}
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Sampada Originals</p>
          <h1 className={styles.heroTitle}>{title}</h1>
          <div className={styles.goldRule} aria-hidden="true" />
          {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}
          {lastUpdated && (
            <time className={styles.lastUpdated} dateTime={lastUpdated}>
              Last updated: {formattedDate}
            </time>
          )}
        </section>

        {/* Trust strip */}
        <div className={styles.trustStrip}>
          <span>🔒 Secure &amp; Encrypted</span>
          <span>🚫 Data Never Sold</span>
          <span>✏️ Updated June 2026</span>
          <span>📧 Direct Support</span>
        </div>

        {/* Body */}
        <div className={styles.bodyLayout}>

          {/* TOC */}
          <nav className={styles.toc} aria-label="Page contents">
            <button
              className={styles.tocToggle}
              onClick={() => setTocOpen((o) => !o)}
              aria-expanded={tocOpen}
              aria-controls="toc-list"
            >
              <span>Contents</span>
              <span aria-hidden="true">{tocOpen ? '▲' : '▼'}</span>
            </button>
            <ul
              id="toc-list"
              className={`${styles.tocList} ${tocOpen ? styles.tocOpen : ''}`}
            >
              {tocItems.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={`${styles.tocLink} ${activeId === id ? styles.tocActive : ''}`}
                    onClick={() => setTocOpen(false)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right column */}
          <div className={styles.contentWrapper}>

            {/* Quick summary card */}
            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <span className={styles.summaryIcon}>📋</span>
                <strong>Quick Summary</strong>
              </div>
              <ul className={styles.summaryList}>
                <li>We collect only what's needed to process your orders</li>
                <li>We never sell your personal data to third parties</li>
                <li>You can request access or deletion at any time</li>
                <li>Contact us: <a href="mailto:binods1313@gmail.com">binods1313@gmail.com</a></li>
              </ul>
            </div>

            {/* Main content card */}
            <article
              className={styles.contentCard}
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Contact box */}
            <aside className={styles.contactBox}>
              <strong className={styles.contactTitle}>Questions about this policy?</strong>
              <p>
                Email us at{' '}
                <a href="mailto:binods1313@gmail.com">binods1313@gmail.com</a>
                {' '}and we'll respond within 2 business days.
              </p>
            </aside>

          </div>
        </div>
      </div>
    </>
  );
}
