// components/HeroBanner.jsx
import React from 'react';
import Link from 'next/link';
import SanityImage from './SanityImage';
import { urlFor } from '../lib/client';
import styles from '../styles/clay.module.css';

// Advanced SplitText with physics and ripple wave effect
const SplitText = ({ text, baseColor, hoverColor, id }) => {
  if (!text) return null;
  const chars = text.split('');

  const handleEnter = (idx) => {
    chars.forEach((_, i) => {
      const el = document.getElementById(`${id}-char-${i}`);
      if (!el) return;
      const distance = Math.abs(i - idx);
      // Build style string with !important to override CSS modules
      let styleStr = '';
      if (distance === 0) {
        styleStr = `transform: translateY(-14px) scale(1.4) !important; color: ${hoverColor} !important; text-shadow: 0 10px 20px ${hoverColor}80 !important;`;
        setTimeout(() => el.setAttribute('style', styleStr), 0);
      } else if (distance === 1) {
        styleStr = `transform: translateY(-8px) scale(1.2) !important; color: ${hoverColor}CC !important;`;
        setTimeout(() => el.setAttribute('style', styleStr), 40);
      } else if (distance === 2) {
        styleStr = `transform: translateY(-4px) scale(1.07) !important;`;
        setTimeout(() => el.setAttribute('style', styleStr), 80);
      }
    });
  };

  const handleLeave = (idx) => {
    chars.forEach((_, i) => {
      const el = document.getElementById(`${id}-char-${i}`);
      if (!el) return;
      const distance = Math.abs(i - idx);
      const styleStr = `transform: translateY(0px) scale(1) !important; color: ${baseColor} !important; text-shadow: none !important;`;
      setTimeout(() => el.setAttribute('style', styleStr), distance * 20);
      el.setAttribute('style', `display: inline-block; cursor: default; transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease, text-shadow 0.2s ease; transform-origin: bottom center; will-change: transform; ${styleStr}`);
    });
  };

  return (
    <span style={{ display: 'inline' }}>
      {chars.map((char, i) => (
        <span
          key={i}
          id={`${id}-char-${i}`}
          data-testid={`split-char-${i}`}
          style={{
            display: 'inline-block',
            cursor: 'default',
            color: baseColor,
            transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease, text-shadow 0.2s ease',
            transformOrigin: 'bottom center',
            willChange: 'transform',
          }}
          onMouseEnter={() => handleEnter(i)}
          onMouseLeave={() => handleLeave(i)}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

const HeroBanner = ({ heroBanner }) => {
  if (!heroBanner) {
    return null;
  }

  const {
    smallText = '',
    midText = '',
    largeText1 = '',
    largeText2 = '',
    product = '',
    buttonText = 'Shop Now',
    image = null,
    desc = '' // desc is no longer used for the badge; we use fixed marquee text
  } = heroBanner;

  return (
    <section className={styles.heroBanner}>
      {/* Parallax background */}
      {image && (
        <div
          className={styles.heroParallax}
          style={{
            backgroundImage: `url(${urlFor(image).fit('max').url()})`,
          }}
        />
      )}
      
      {/* Brand logo */}
      <div className={styles.heroLogo}>
        {/* Replace with actual logo path; using placeholder */}
        <img src="/logo.png" alt="Sampada Logo" className={styles.heroLogoImg} />
      </div>

      {/* Top Marquee */}
      <div className={styles.marquee}>
        Free Shipping ₹999+ • 30-Day Returns • COD Available • ★★★★★ 4.8 from 1,200+ customers
      </div>

      <div className={styles.heroBannerContent}>
        <div className={`${styles.heroBannerText} ${styles.heroFadeIn}`}>
          {smallText && (
            <p className={`${styles.beatsSolo} ${styles.hoverEffect}`}>
              <SplitText
                text={smallText}
                baseColor="#8B1A1A"
                hoverColor="#C9A84C"
                id="hero-small"
              />
            </p>
          )}
          {midText && (
            <h3 className={styles.hoverEffect}>
              <SplitText
                text={midText}
                baseColor="#1A0A08"
                hoverColor="#C9A84C"
                id="hero-mid"
              />
            </h3>
          )}
          {largeText1 && (() => {
            const words = largeText1.split(' ');
            const lastWord = words.pop(); // Get "LEGACY"
            const firstPart = words.join(' '); // Get "WEAR YOUR"
            return (
              <>
                <h1 className={`${styles.hoverEffect} ${styles.heroBannerTitle}`} style={{ fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: '900', lineHeight: 1.0, margin: '0 0 8px 0' }}>
                  <SplitText
                    text={firstPart}
                    baseColor="#1A0A08"
                    hoverColor="#8B1A1A"
                    id="hero-large1-first"
                  />
                </h1>
                <h1 className={`${styles.hoverEffect} ${styles.heroBannerTitle}`} style={{ fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: '900', lineHeight: 1.0, margin: '0 0 8px 0' }}>
                  <SplitText
                    text={lastWord}
                    baseColor="#1A0A08"
                    hoverColor="#8B1A1A"
                    id="hero-large1-last"
                  />
                </h1>
              </>
            );
          })}
          {largeText2 && (
            <h1 className={`${styles.largeText2} ${styles.hoverEffect}`} style={{ fontSize: 'clamp(22px, 2.8vw, 34px)', fontWeight: '700', letterSpacing: '3px', marginBottom: '24px' }}>
              <SplitText
                text={largeText2}
                baseColor="#C9A84C"
                hoverColor="#8B1A1A"
                id="hero-large2"
              />
            </h1>
          )}

          {heroBanner?.heroQuote && (
            <p className={styles.heroQuote}>{heroBanner.heroQuote}</p>
          )}

          {heroBanner?.heroStats?.length > 0 && (
            <div className={styles.sampadaCards}>
              {heroBanner.heroStats.map((card, i) => (
                <div className={`${styles.sCard} ${styles.heroClay}`} key={i} tabIndex={0} role="article">
                  <span className={`${styles.sCardWatermark} aria-hidden="true`}">स</span>
                  <p className={styles.sCardTitle}>{card.value}</p>
                  <div className={styles.sCardDivider} aria-hidden="true" />
                  <p className={styles.sCardSub}>{card.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <div className="hero-cta mt-6">
            {product ? (
              <Link href={`/product/${product}`} className={`${styles.heroButton}`}>
                {buttonText}
                <span>→</span>
              </Link>
            ) : (
              <span className={`${styles.heroButton} opacity-50 cursor-not-allowed`}>
                {buttonText}
                <span>→</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Marquee */}
      <div className={styles.marquee}>
        Free Shipping ₹999+ • 30-Day Returns • COD Available • ★★★★★ 4.8 from 1,200+ customers
      </div>
    </section>
  );
};

export default HeroBanner;