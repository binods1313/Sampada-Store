/**
 * EditorialLayout - Magazine-Style Product Display
 * 
 * Features:
 * - Pretext-powered text flow around images
 * - Dynamic line width calculation
 * - Beautiful editorial/magazine layout
 * - Responsive design
 * 
 * Perfect for:
 * - Featured product stories
 * - Product highlights
 * - Editorial content
 * - Brand storytelling
 * 
 * @see https://pretext.wiki/
 */

'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { urlFor } from '../lib/client';
import { flowTextAroundObstacle, prepareWithSegments, layoutWithLines } from '../utils/pretext';
import { useFontsReady } from '../hooks/usePretext';

const COLORS = {
  text: '#1E1E2E',
  textMuted: '#6B7280',
  gold: '#C9A227',
  bg: '#FAFAFA',
};

/**
 * EditorialLayout Component
 * 
 * @param {Object} product - Product data with description and images
 * @param {string} layout - 'left' | 'right' | 'center' (image position)
 * @param {boolean} showDecorative - Show decorative elements
 */
export default function EditorialLayout({ 
  product, 
  layout = 'left',
  showDecorative = true 
}) {
  const fontsReady = useFontsReady();
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [lines, setLines] = useState([]);

  const {
    name,
    description,
    details,
    image,
    category,
    price,
    discount
  } = product || {};

  const firstImage = image && image[0] ? image[0] : null;
  const imageUrl = firstImage?.asset ? urlFor(firstImage).width(800).url() : null;

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Calculate text flow around image using Pretext
  useEffect(() => {
    if (!fontsReady || !description || containerWidth < 600) {
      return;
    }

    const text = description;
    const font = '15px Inter, system-ui, sans-serif';
    const lineHeight = 26;
    
    // Image dimensions
    const imageWidth = Math.min(300, containerWidth * 0.4);
    const imageHeight = 400;
    const imageMargin = 32;
    
    // Calculate obstacle based on layout
    const obstacle = {
      top: 0,
      bottom: imageHeight + imageMargin * 2,
      width: imageWidth + imageMargin * 2,
    };

    // Base column width
    const baseWidth = containerWidth - 48; // Account for padding

    // Use Pretext to flow text around the image
    const flowedLines = flowTextAroundObstacle(
      text,
      font,
      baseWidth,
      obstacle,
      lineHeight
    );

    setLines(flowedLines);
  }, [fontsReady, description, containerWidth, layout]);

  // Fallback: Simple layout without flow
  const simpleLayout = useMemo(() => {
    if (!description) return [];
    
    const prepared = prepareWithSegments(description, '15px Inter, system-ui, sans-serif');
    const { lines } = layoutWithLines(prepared, containerWidth - 48, 26);
    return lines;
  }, [description, containerWidth]);

  const displayLines = lines.length > 0 ? lines : simpleLayout;
  const hasImage = imageUrl && containerWidth >= 600;

  return (
    <article
      ref={containerRef}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '48px 24px',
        background: COLORS.bg,
        position: 'relative',
      }}
    >
      {/* Decorative Elements */}
      {showDecorative && (
        <>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${COLORS.gold}, transparent)`,
          }} />
          <div style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            fontSize: '12px',
            color: COLORS.gold,
            fontWeight: '600',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            {category?.name || 'Featured'}
          </div>
        </>
      )}

      {/* Header */}
      <header style={{
        marginBottom: '48px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 48px)',
          fontWeight: '700',
          color: COLORS.text,
          marginBottom: '16px',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}>
          {name}
        </h1>

        {/* Price Badge */}
        {price && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 20px',
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            {discount && discount > 0 ? (
              <>
                <span style={{
                  fontSize: '14px',
                  color: '#999',
                  textDecoration: 'line-through',
                }}>
                  ${price.toFixed(2)}
                </span>
                <span style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#DC2626',
                }}>
                  ${(price * (1 - discount / 100)).toFixed(2)}
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#DC2626',
                  background: '#FEE2E2',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}>
                  {discount}% OFF
                </span>
              </>
            ) : (
              <span style={{
                fontSize: '20px',
                fontWeight: '700',
                color: COLORS.text,
              }}>
                ${price.toFixed(2)}
              </span>
            )}
          </div>
        )}
      </header>

      {/* Main Content - Editorial Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: hasImage ? '1fr 1fr' : '1fr',
        gap: '48px',
        alignItems: 'start',
      }}>
        {/* Image Column */}
        {hasImage && (
          <div style={{
            position: 'relative',
            order: layout === 'right' ? 2 : 1,
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingTop: '133%', // 3:4 aspect ratio
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
            }}>
              <Image
                src={imageUrl}
                alt={name || 'Product image'}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                style={{
                  objectFit: 'cover',
                }}
                priority
              />
            </div>

            {/* Caption */}
            {firstImage?.alt && (
              <p style={{
                fontSize: '12px',
                color: COLORS.textMuted,
                marginTop: '12px',
                fontStyle: 'italic',
              }}>
                {firstImage.alt}
              </p>
            )}
          </div>
        )}

        {/* Text Column - Flowing Text */}
        <div style={{
          order: layout === 'right' ? 1 : 2,
          position: 'relative',
        }}>
          {/* Drop Cap */}
          {displayLines.length > 0 && (
            <div style={{
              fontSize: '15px',
              lineHeight: '26px',
              color: COLORS.text,
              textAlign: 'justify',
            }}>
              {displayLines.map((line, index) => (
                <span
                  key={index}
                  style={{
                    display: index === 0 ? 'inline-block' : 'inline',
                    ...(index === 0 && {
                      fontSize: '48px',
                      fontWeight: '700',
                      color: COLORS.gold,
                      lineHeight: '48px',
                      float: 'left',
                      marginRight: '12px',
                      marginTop: '-8px',
                    }),
                  }}
                >
                  {line.text}
                  {index < displayLines.length - 1 && ' '}
                </span>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: `1px solid ${COLORS.gold}30`,
          }}>
            <button
              style={{
                width: '100%',
                padding: '16px 32px',
                background: `linear-gradient(135deg, ${COLORS.gold}, #F0C93A)`,
                color: '#1E1E2E',
                border: 'none',
                borderRadius: '4px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(201, 162, 39, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 162, 39, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 162, 39, 0.3)';
              }}
            >
              Add to Cart — ${price?.toFixed(2) || '0.00'}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          article {
            padding: 32px 16px !important;
          }
          
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </article>
  );
}

/**
 * TextFlowAroundImage - Lower-level component for custom layouts
 * 
 * @param {string} text - Text to flow
 * @param {Object} image - Image dimensions and position
 * @param {number} containerWidth - Container width
 */
export function TextFlowAroundImage({ text, image, containerWidth }) {
  const fontsReady = useFontsReady();
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (!fontsReady || !text) return;

    const flowedLines = flowTextAroundObstacle(
      text,
      '15px Inter, system-ui, sans-serif',
      containerWidth - 48,
      {
        top: image.top || 0,
        bottom: image.bottom || 400,
        width: image.width || 300,
      },
      26
    );

    setLines(flowedLines);
  }, [fontsReady, text, image, containerWidth]);

  return (
    <div style={{ fontSize: '15px', lineHeight: '26px' }}>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            width: `${line.width}px`,
            minHeight: '26px',
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}
