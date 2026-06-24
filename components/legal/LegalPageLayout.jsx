/**
 * components/legal/LegalPageLayout.jsx
 * Sampada Originals — Claymorphism × Heritage Luxury legal page shell.
 *
 * Props:
 *   pageTitle        string          – e.g. "Privacy Policy"
 *   pageSubtitle     string          – one-liner description
 *   lastUpdated      string          – ISO date, e.g. "2026-06-23"
 *   canonicalSlug    string          – e.g. "privacy-policy"
 *   quickSummaryItems string[]       – bullet points for the Quick Summary card
 *   sections         Array<{         – main content
 *     id:      string,
 *     heading: string,
 *     content: string | string[]     – string[] preferred; string auto-splits
 *   }>
 *   contactEmail     string          – displayed in the contact box
 */

import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import styles from '../../styles/clay.module.css';

/* ── Helper: normalise content to an array of paragraph strings ── */
function toParagraphs(content) {
  if (Array.isArray(content)) return content;
  // Split a single string on sentence boundaries and group into 2-sentence chunks
  const sentences = content
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);
  const chunks = [];
  for (let i = 0; i < sentences.length; i += 2) {
    chunks.push(sentences.slice(i, i + 2).join(' '));
  }
  return chunks;
}

/* ── Trust badge data ── */
const TRUST_ITEMS = [
  { icon: '🔒', label: 'Secure & Encrypted' },
  { icon: '🚫', label: 'Data Never Sold' },
  { icon: '✏️', label: 'Updated June 2026' },
  { icon: '📧', label: 'Direct Support' },
];

export default function LegalPageLayout({
  pageTitle = 'Legal',
  pageSubtitle = '',
  lastUpdated = '',
  canonicalSlug = '',
  quickSummaryItems = [],
  sections = [],
  contactEmail = 'binod1313@gmail.com',
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id || '');
  const [tocOpen, setTocOpen] = useState(false);
  const observerRef = useRef(null);
  const revealObserverRef = useRef(null);

  /* ── Formatted date ── */
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  /* ── Active TOC tracking via IntersectionObserver ── */
  useEffect(() => {
    const sectionEls = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);

    if (!sectionEls.length) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );

    sectionEls.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, [sections]);

  /* ── Scroll-reveal animation via IntersectionObserver ── */
  useEffect(() => {
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (!revealEls.length) return;

    revealObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            revealObserverRef.current.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => revealObserverRef.current.observe(el));
    return () => revealObserverRef.current?.disconnect();
  }, []);

  /* ── Smooth-scroll TOC click ── */
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTocOpen(false);
  };

  return (
    <>
      <Head>
        <title>{`${pageTitle} | Sampada Originals`}</title>
        <meta name="description" content={pageSubtitle} />
        {canonicalSlug && (
          <link rel="canonical" href={`https://sampada.online/${canonicalSlug}`} />
        )}
        <meta name="robots" content="index,follow" />
        {/* Fonts loaded globally via pages/_document.js */}
      </Head>

      <div className={styles.pageWrapper}>

        {/* ── 1. Hero Banner ── */}
        <section className={styles.clayHero} aria-labelledby="legal-page-title">
          <p className={styles.heroEyebrow}>Sampada Originals</p>
          <h1 id="legal-page-title" className={styles.heroTitle}>
            {pageTitle}
          </h1>
          <div className={styles.goldRule} aria-hidden="true" />
          {pageSubtitle && (
            <p className={styles.heroSubtitle}>{pageSubtitle}</p>
          )}
          {lastUpdated && (
            <time className={styles.lastUpdated} dateTime={lastUpdated}>
              Last updated: {formattedDate}
            </time>
          )}
        </section>

        {/* ── 2. Trust Badge Row ── */}
        <div className={styles.clayTrustBadge} role="list" aria-label="Trust indicators">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className={styles.clayTrustItem} role="listitem">
              <span className={styles.trustIcon} aria-hidden="true">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        {/* ── 3. Body: Sticky TOC + Content Column ── */}
        <div className={styles.bodyLayout}>

          {/* ── TOC Sidebar ── */}
          <nav className={styles.clayTOC} aria-label="Page sections">
            {/* Mobile accordion toggle */}
            <button
              className={styles.tocToggleBtn}
              onClick={() => setTocOpen((o) => !o)}
              aria-expanded={tocOpen}
              aria-controls="toc-list"
            >
              <span>Contents</span>
              <span aria-hidden="true">{tocOpen ? '▲' : '▼'}</span>
            </button>

            {/* Desktop heading */}
            <p className={styles.tocHeading}>On This Page</p>

            <ul
              id="toc-list"
              className={`${styles.tocList} ${tocOpen ? styles.tocListOpen : ''}`}
              role="list"
            >
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    className={`${styles.clayTOCItem} ${
                      activeId === section.id ? styles.clayTOCItemActive : ''
                    }`}
                    onClick={() => scrollTo(section.id)}
                    aria-current={activeId === section.id ? 'location' : undefined}
                    style={{
                      background: 'none',
                      border: 'none',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    {section.heading}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Content Column ── */}
          <div className={styles.contentColumn}>

            {/* ── Quick Summary Card ── */}
            {quickSummaryItems.length > 0 && (
              <div
                className={`${styles.claySummaryCard} ${styles.clayReveal}`}
                data-reveal
              >
                <div className={styles.summaryHeader}>
                  <span className={styles.summaryIcon} aria-hidden="true">📋</span>
                  <strong className={styles.summaryTitle}>Quick Summary</strong>
                </div>
                <ul className={styles.summaryList} aria-label="Key points">
                  {quickSummaryItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Section Cards ── */}
            {sections.map((section, index) => {
              const paragraphs = toParagraphs(section.content);
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className={`${styles.claySection} ${styles.clayReveal}`}
                  data-reveal
                  style={{ transitionDelay: `${index * 60}ms` }}
                  aria-labelledby={`heading-${section.id}`}
                >
                  <h2
                    id={`heading-${section.id}`}
                    className={styles.claySectionHeading}
                  >
                    {section.heading}
                  </h2>
                  <div className={styles.sectionBody}>
                    {paragraphs.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* ── Contact Box ── */}
            <aside
              className={`${styles.clayContactBox} ${styles.clayReveal}`}
              data-reveal
              aria-label="Contact information"
            >
              <span className={styles.contactIcon} aria-hidden="true">💬</span>
              <div>
                <strong className={styles.contactTitle}>Questions about this policy?</strong>
                <p className={styles.contactBody}>
                  Email us at{' '}
                  <a
                    href={`mailto:${contactEmail}`}
                    className={styles.contactLink}
                  >
                    {contactEmail}
                  </a>{' '}
                  and we will respond within 2 business days. We are always happy to clarify
                  anything and work with you to find a fair resolution.
                </p>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </>
  );
}
