// components/HeroBanner.jsx
import React from 'react';
import Link from 'next/link';
import SanityImage from './SanityImage';
import { urlFor } from '../lib/client';

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
    desc = ''
  } = heroBanner;

  return (
    <div className="hero-banner-container">
      <div className="hero-banner-content">
        <div className="flex flex-col items-center justify-center text-center py-10 w-full">
          {desc && (
            <div className="rounded-xl text-center border-4 mx-auto mb-10 hover-effect-intense" style={{ marginTop: '-1cm', marginLeft: 'auto', marginRight: 'auto', maxWidth: 'fit-content', padding: '1rem 1.5rem', backgroundColor: '#FFFACD', borderColor: '#d97706', boxShadow: '0 0 10px #d97706', borderRadius: '1rem' }}>
              <p className="text-xl text-gray-900 leading-snug" style={{ fontWeight: 700 }}>
                {desc}
              </p>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto" style={{ minHeight: '600px', padding: '0 48px', overflow: 'visible' }}>
            <div className="hero-banner-text" style={{ flex: 1, maxWidth: '55%' }}>
              {smallText && (
                <p className="beats-solo hover-effect">
                  <SplitText
                    text={smallText}
                    baseColor="#8B1A1A"
                    hoverColor="#C9A84C"
                    id="hero-small"
                  />
                </p>
              )}
              {midText && (
                <h3 className="hover-effect">
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
                    <h1 className="hover-effect" style={{ fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: '900', lineHeight: 1.0, margin: '0 0 8px 0' }}>
                      <SplitText
                        text={firstPart}
                        baseColor="#1A0A08"
                        hoverColor="#8B1A1A"
                        id="hero-large1-first"
                      />
                    </h1>
                    <h1 className="hover-effect" style={{ fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: '900', lineHeight: 1.0, margin: '0 0 8px 0' }}>
                      <SplitText
                        text={lastWord}
                        baseColor="#1A0A08"
                        hoverColor="#8B1A1A"
                        id="hero-large1-last"
                      />
                    </h1>
                  </>
                );
              })()}
              {largeText2 && (
                <h1 className="large-text-2 hover-effect" style={{ fontSize: 'clamp(22px, 2.8vw, 34px)', fontWeight: '700', letterSpacing: '3px', marginBottom: '24px' }}>
                  <SplitText
                    text={largeText2}
                    baseColor="#C9A84C"
                    hoverColor="#8B1A1A"
                    id="hero-large2"
                  />
                </h1>
              )}

              {heroBanner?.heroQuote && (
                <p className="hero-quote">{heroBanner.heroQuote}</p>
              )}

              {heroBanner?.heroStats?.length > 0 && (
                <div className="sampada-cards">
                  {heroBanner.heroStats.map((card, i) => (
                    <div className="s-card" key={i} tabIndex={0} role="article">
                      <span className="s-card__watermark" aria-hidden="true">स</span>
                      <p className="s-card__title">{card.value}</p>
                      <div className="s-card__divider" aria-hidden="true" />
                      <p className="s-card__sub">{card.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* HERO RIGHT SIDE — emblem section */}
            <div className="hero-emblem-section">
              <div className="hero-emblem-outer-wrapper">
                {/* LAYER 1: Gold radial glow — behind everything */}
                <div className="hero-emblem-glow" />

                {/* LAYER 2: Primary rotating dashed ring — clockwise 12s */}
                <div className="hero-ring-primary" />

                {/* LAYER 3: Secondary outer ring — counter-clockwise 22s */}
                <div className="hero-ring-secondary" />

                {/* LAYER 4: The emblem image — STATIC, never rotates */}
                {image ? (
                  <img
                    src={urlFor(image).fit('max').url()}
                    alt={midText || 'Sampada Emblem'}
                    className="hero-emblem-img"
                  />
                ) : (
                  <div className="hero-emblem-placeholder" />
                )}
              </div>

              {/* Shop Now button */}
              <div className="hero-cta mt-8" style={{ zIndex: 3, transform: 'translateY(-0.5cm)' }}>
                {product ? (
                  <Link href={`/product/${product}`} className="shop-now-btn">
                    {buttonText}
                    <span>→</span>
                  </Link>
                ) : (
                  <span className="shop-now-btn" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                    {buttonText}
                    <span>→</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;