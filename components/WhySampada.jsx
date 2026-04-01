/**
 * WhySampada — Value Proposition Section
 * 
 * Credit/Debit Card Styled Cards with:
 * - Centered content (icon → title → tagline → quote)
 * - Shiva silhouette watermark (cultural depth)
 * - Silky animated gold gradient border
 * - Subtle stone texture overlay
 * 
 * Applied: emil-design-eng skill
 */

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Landmark, Shield, Zap } from 'lucide-react';

// Shiva Watermark SVG Component (Nataraja/Padmasana pose)
const ShivaWatermark = ({ position = 'right', opacity = 0.07 }) => {
  const flip = position === 'left' ? 'scale(-1, 1)' : 'scale(1, 1)';
  
  return (
    <svg
      viewBox="0 0 200 280"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom: '-15px',
        right: position === 'right' ? '-10px' : 'auto',
        left: position === 'left' ? '-10px' : 'auto',
        width: '170px',
        height: '220px',
        opacity: opacity,
        fill: '#C9A227',
        pointerEvents: 'none',
        zIndex: 0,
        transform: flip,
      }}
    >
      {/* Crescent moon above head */}
      <path d="M95 18 Q100 8 110 12 Q102 14 100 22 Q97 14 95 18Z" />
      
      {/* Trishul (trident) */}
      <line x1="100" y1="20" x2="100" y2="55" stroke="#C9A227" strokeWidth="2" fill="none" />
      <path d="M92 28 L100 20 L108 28 M96 25 L96 35 M104 25 L104 35" />
      
      {/* Head */}
      <ellipse cx="100" cy="72" rx="18" ry="20" />
      
      {/* Jata (matted hair flowing) */}
      <path d="M82 60 Q70 45 75 35 Q85 50 88 58Z" />
      <path d="M118 60 Q130 45 125 35 Q115 50 112 58Z" />
      <path d="M100 52 Q100 30 105 22 Q100 35 100 52Z" />
      
      {/* Neck */}
      <rect x="94" y="90" width="12" height="12" rx="4" />
      
      {/* Upper body */}
      <path d="M70 102 Q100 95 130 102 L125 145 Q100 150 75 145 Z" />
      
      {/* 4 Arms */}
      {/* Upper right arm - raised with damaru */}
      <path d="M125 108 Q148 95 158 80" />
      <ellipse cx="162" cy="77" rx="6" ry="9" transform="rotate(30 162 77)" />
      
      {/* Upper left arm - raised with flame */}
      <path d="M75 108 Q52 95 42 80" />
      <path d="M38 72 Q42 65 46 72 Q42 68 38 72Z" />
      <path d="M42 70 Q46 60 50 70 Q46 64 42 70Z" />
      
      {/* Lower right arm - abhaya mudra */}
      <path d="M125 125 Q145 125 152 115" />
      <path d="M152 108 Q158 112 156 120 Q152 125 148 118 Z" />
      
      {/* Lower left arm pointing down */}
      <path d="M75 125 Q55 130 48 125" />
      
      {/* Lotus seat base */}
      <ellipse cx="100" cy="220" rx="55" ry="12" />
      
      {/* Lotus petals */}
      <path d="M55 220 Q45 200 55 190 Q62 205 65 215Z" />
      <path d="M145 220 Q155 200 145 190 Q138 205 135 215Z" />
      <path d="M68 215 Q60 192 72 182 Q76 198 78 210Z" />
      <path d="M132 215 Q140 192 128 182 Q124 198 122 210Z" />
      <path d="M80 212 Q75 188 88 180 Q90 195 92 208Z" />
      <path d="M120 212 Q125 188 112 180 Q110 195 108 208Z" />
      <path d="M92 210 Q90 185 100 178 Q110 185 108 210Z" />
      
      {/* Crossed legs (padmasana) */}
      <path d="M75 145 Q60 175 55 210 Q75 205 90 195 Q88 170 85 155Z" />
      <path d="M125 145 Q140 175 145 210 Q125 205 110 195 Q112 170 115 155Z" />
      
      {/* Visible foot left */}
      <ellipse cx="60" cy="212" rx="14" ry="7" transform="rotate(-10 60 212)" />
      {/* Visible foot right */}
      <ellipse cx="140" cy="212" rx="14" ry="7" transform="rotate(10 140 212)" />
      
      {/* Sacred thread (yagnopavita) */}
      <path d="M85 102 Q70 130 80 160" fill="none" stroke="#C9A227" strokeWidth="1.5" />
      
      {/* Cobra around neck */}
      <path d="M86 96 Q78 88 82 80 Q90 85 94 94" fill="none" stroke="#C9A227" strokeWidth="2" />
      <ellipse cx="80" cy="78" rx="5" ry="4" transform="rotate(-20 80 78)" />
      
      {/* Third eye */}
      <ellipse cx="100" cy="68" rx="3" ry="4" />
      
      {/* Ganges flowing from hair */}
      <path d="M118 55 Q128 65 125 80 Q120 70 118 55Z" />
    </svg>
  );
};

// Stone texture SVG pattern (inline data URI)
const stoneTexture = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A227' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

const WhySampada = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Landmark style={{ width: '28px', height: '28px' }} />,
      title: 'Heritage Design',
      tagline: 'Rooted in Indian culture, crafted for modern legacy',
      quote: 'Where ancient wisdom meets contemporary style',
      bgGradient: 'linear-gradient(135deg, #1A1A2E 0%, #12122A 100%)',
      cornerGradient: 'radial-gradient(circle, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.03) 70%)',
      shivaPosition: 'right',
      shivaOpacity: 0.08,
    },
    {
      icon: <Shield style={{ width: '28px', height: '28px' }} />,
      title: 'Premium Fabric',
      tagline: 'Beyond ordinary clothing — quality that lasts generations',
      quote: 'Every thread carries the promise of excellence',
      bgGradient: 'linear-gradient(135deg, #1E1418 0%, #2A1520 100%)',
      cornerGradient: 'radial-gradient(circle, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.03) 70%)',
      shivaPosition: 'left',
      shivaOpacity: 0.08,
    },
    {
      icon: <Zap style={{ width: '28px', height: '28px' }} />,
      title: 'Ships in 48hrs',
      tagline: 'Fast, reliable delivery to your doorstep',
      quote: 'Your legacy shouldn\'t wait — neither should your order',
      bgGradient: 'linear-gradient(135deg, #111820 0%, #0D1A14 100%)',
      cornerGradient: 'radial-gradient(circle, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.03) 70%)',
      shivaPosition: 'right',
      shivaOpacity: 0.06,
    },
  ];

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-labelledby="why-sampada-title"
      style={{
        background: '#0D0D14',
        padding: '80px 0',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Section Eyebrow */}
      <p
        style={{
          color: 'rgba(201, 162, 39, 0.7)',
          fontSize: '11px',
          letterSpacing: '0.15em',
          textAlign: 'center',
          marginBottom: '8px',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        The Sampada Promise
      </p>

      {/* Section Title */}
      <h2
        id="why-sampada-title"
        style={{
          color: '#F5F0E8',
          fontSize: '28px',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '48px',
        }}
      >
        Built on Three Pillars
      </h2>

      {/* Cards Grid - Credit card aspect ratio */}
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '20px',
          boxSizing: 'border-box',
        }}
      >
        {features.map((feature, index) => (
          // Outer wrapper with hover effects
          <div
            key={index}
            className="pillar-card-wrapper"
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              border: '2px solid rgba(245, 208, 107, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(245, 208, 107, 0.8)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(245, 208, 107, 0.3), 0 16px 48px rgba(0,0,0,0.6)';
              e.currentTarget.style.transform = 'translateY(-10px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(245, 208, 107, 0.3)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Card */}
            <article
              role="article"
              aria-labelledby={`feature-title-${index}`}
              className="pillar-card"
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                aspectRatio: '16 / 9',
                background: '#f3f4f6',
              }}
            >
              {/* LAYER 1: Full bleed Shiva image */}
              <img
                src={index === 0 
                  ? '/images/shiva-heritage.png'
                  : index === 1
                  ? '/images/shiva-premium.png'
                  : '/images/shiva-shipping.png'}
                alt={feature.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 10%',
                  transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                  zIndex: 0,
                }}
                className="pillar-card-image"
              />

              {/* LAYER 2: Minimal bottom gradient ONLY for text readability */}
              <div
                className="pillar-card-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.15) 40%, transparent 70%)',
                  pointerEvents: 'none',
                  transition: 'background 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  zIndex: 1,
                }}
              />

              {/* LAYER 3: Icon — top left */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '2px solid #F5D06B',
                  background: 'rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F5D06B',
                  fontSize: '20px',
                  zIndex: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                }}
              >
                {feature.icon}
              </div>

              {/* LAYER 4: Title — top right corner */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  textAlign: 'right',
                  zIndex: 2,
                  maxWidth: '45%',
                }}
              >
                <h3
                  id={`feature-title-${index}`}
                  style={{
                    color: '#FFE8A3',
                    fontSize: '1.2rem',
                    fontWeight: '800',
                    margin: 0,
                    textShadow: '0 2px 16px rgba(0, 0, 0, 0.9), 0 0 24px rgba(201, 168, 76, 0.4)',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.3',
                  }}
                >
                  {feature.title}
                </h3>
              </div>

              {/* LAYER 5: Tagline & Quote — bottom */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '20px 24px 24px',
                  zIndex: 2,
                }}
              >
                <p
                  style={{
                    color: '#FFE8A3',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    margin: '0 0 10px 0',
                    textShadow: '0 2px 12px rgba(0, 0, 0, 0.9), 0 0 16px rgba(201, 168, 76, 0.3)',
                    fontWeight: '500',
                  }}
                >
                  {feature.tagline}
                </p>
                <div
                  style={{
                    width: '32px',
                    height: '2px',
                    background: 'linear-gradient(90deg, #F5D06B, transparent)',
                    boxShadow: '0 0 10px rgba(201, 168, 76, 0.6)',
                    marginBottom: '10px',
                  }}
                />
                <p
                  style={{
                    color: '#FFE8A3',
                    fontSize: '11px',
                    fontStyle: 'italic',
                    margin: 0,
                    textShadow: '0 1px 8px rgba(0, 0, 0, 0.9), 0 0 14px rgba(201, 168, 76, 0.35)',
                    fontWeight: '500',
                    letterSpacing: '0.02em',
                  }}
                >
                  {feature.quote}
                </p>
              </div>
            </article>

            {/* Hover: Image zooms in to show portrait detail */}
            <style>{`
              .pillar-card-wrapper:hover .pillar-card-image {
                transform: scale(1.12);
              }
              .pillar-card-wrapper:hover .pillar-card-overlay {
                background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.25) 40%, transparent 70%);
              }
            `}</style>
          </div>
        ))}
      </div>

      {/* Animations & Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          section[aria-labelledby="why-sampada-title"] > div:last-child {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            padding: 0 16px !important;
            gap: 16px !important;
          }
        }

        @media (max-width: 768px) {
          section[aria-labelledby="why-sampada-title"] > div:last-child {
            grid-template-columns: 1fr !important;
            padding: 0 20px !important;
            gap: 16px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pillar-card-wrapper,
          .pillar-card-image,
          .pillar-card-overlay {
            transition: none !important;
          }
          .pillar-card-wrapper:hover {
            transform: none !important;
          }
          .pillar-card-wrapper:hover .pillar-card-image {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default WhySampada;
