/**
 * TrustStrip - Announcement Bar
 *
 * Uses JavaScript-based animation for smooth auto-scroll (matching RelatedProductsCarousel)
 *
 * Features:
 * - Continuous left-to-right scroll
 * - Pauses on hover
 * - Seamless infinite loop
 * - Dismissible (24h localStorage)
 * - Height: exactly 36px
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const TEXT = (
  <>
    Free Shipping ₹999+ &nbsp;•&nbsp;
    30-Day Returns &nbsp;•&nbsp;
    COD Available &nbsp;•&nbsp;
    ★★★★★ 4.8 from 1,200+ customers
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </>
);

const TrustStrip = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const textWidthRef = useRef(0);

  // Dismiss logic
  useEffect(() => {
    const dismissed = localStorage.getItem('trustStripDismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const hoursSinceDismissal = (Date.now() - dismissedTime) / (1000 * 60 * 60);
      if (hoursSinceDismissal < 24) {
        setIsDismissed(true);
      } else {
        localStorage.removeItem('trustStripDismissed');
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('trustStripDismissed', Date.now().toString());
  };

  // Animation logic (matching RelatedProductsCarousel)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Measure text width after render
    const textElement = track.querySelector('.ann-text');
    if (textElement) {
      textWidthRef.current = textElement.scrollWidth;
    }

    const SPEED = 0.5; // px per frame (adjusted for smoother experience)

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += SPEED;
        // Reset at halfway point for seamless loop (when first copy has scrolled completely off)
        if (posRef.current >= textWidthRef.current) {
          posRef.current = 0;
        }
        track.scrollLeft = posRef.current;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    const pause = () => { pausedRef.current = true; };
    const resume = () => { pausedRef.current = false; };

    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);
    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', resume, { passive: true });

    return () => {
      cancelAnimationFrame(animRef.current);
      track.removeEventListener('mouseenter', pause);
      track.removeEventListener('mouseleave', resume);
      track.removeEventListener('touchstart', pause, { passive: true });
      track.removeEventListener('touchend', resume, { passive: true });
    };
  }, []); // Empty deps - only run once on mount

  if (isDismissed) return null;

  return (
    <>
      <style>{`
        .ann-wrapper {
          height: 36px;
          background: #6B0000;
          overflow: hidden;
          display: flex;
          align-items: center;
          position: relative;
          border-bottom: 1px solid rgba(201, 162, 39, 0.3);
        }
        .ann-track {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .ann-text {
          white-space: nowrap;
          color: #C9A227;
          font-size: 13px;
          font-weight: 500;
          padding: 0 3rem;
          display: inline-block;
          flex-shrink: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .ann-track {
            animation: none;
          }
        }
      `}</style>

      <div className="ann-wrapper" ref={trackRef}>
        <div className="ann-track">
          <span className="ann-text">
            {TEXT}
          </span>
          {/* Second copy for seamless loop */}
          <span className="ann-text" aria-hidden="true">
            {TEXT}
          </span>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          style={{
            position: 'absolute',
            right: '12px',
            background: 'transparent',
            border: 'none',
            color: '#C9A227',
            fontSize: '16px',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '4px',
            opacity: 0.7,
          }}
          aria-label="Close announcement"
        >
          <X size={14} />
        </button>
      </div>
    </>
  );
};

export default TrustStrip;