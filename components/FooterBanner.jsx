// components/FooterBanner.jsx
// UI/UX Pro Max: Fashion/Apparel - Heritage Luxury Streetwear
// WCAG AA compliant color contrast

import React from 'react';
import Link from 'next/link';
import { urlFor } from '../lib/client';
import Image from 'next/image';

const FooterBanner = ({ footerBanner }) => {
  const defaultBanner = {
    discount: '20% OFF',
    largeText1: 'Special Offer',
    largeText2: 'Limited Time',
    saleTime: 'Today Only',
    desc: 'Shop now for amazing deals!',
    smallText: "Don't Miss Out",
    midText: 'Flash Sale',
    product: '',
    buttonText: 'Shop Now',
    image: null
  };

  const safeBanner = footerBanner ? { ...defaultBanner, ...footerBanner } : defaultBanner;
  const { discount, largeText1, largeText2, saleTime, desc, smallText, midText, product, buttonText, image } = safeBanner;

  const imageUrl = image?.asset
    ? urlFor(image).width(450).height(450).url()
    : '/asset/placeholder-image.jpg';

  const shouldRenderLink = product && product.trim() !== '';

  return (
    <div className="footer-banner-container" style={{
      background: `linear-gradient(135deg, var(--color-cta-red) 0%, var(--color-cta-red-hover) 100%)`,
      borderRadius: 'var(--radius-2xl)',
      position: 'relative',
      padding: 'var(--space-10)',
      color: 'white',
      overflow: 'hidden',
      marginTop: 0
    }}>
      <div className="banner-desc" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'var(--space-6)'
      }}>
        <div className="left" style={{ flex: 1 }}>
          {/* Discount Badge - Gold color to stand out on red */}
          <p style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--color-accent-gold-light)',
            marginBottom: 'var(--space-2)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)'
          }}>
            {discount}
          </p>
          
          {/* largeText1 split into two lines */}
          {largeText1 && (() => {
            const words = largeText1.split(' ');
            const lastWord = words.pop();
            const firstPart = words.join(' ');
            return (
              <>
                <h3 style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--font-black)',
                  color: 'white',
                  lineHeight: 1.1,
                  marginBottom: 'var(--space-1)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {firstPart}
                </h3>
                <h3 style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--font-black)',
                  color: 'white',
                  lineHeight: 1.1,
                  marginBottom: 'var(--space-2)'
                }}>
                  {lastWord}
                </h3>
              </>
            );
          })()}
          
          {/* largeText2 */}
          <h3 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-accent-gold-light)',
            fontStyle: 'italic',
            marginBottom: 'var(--space-2)',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {largeText2}
          </h3>
          
          {/* Sale Time - smaller, opacity 0.8 */}
          <p style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)',
            color: 'rgba(255,255,255,0.8)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)'
          }}>
            {saleTime}
          </p>
        </div>

        <div className="image-container" style={{ flex: '0 0 auto' }}>
          <Image
            src={imageUrl}
            alt={midText || 'footer banner'}
            width={450}
            height={450}
            priority
            className="footer-banner-image"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            }}
            onError={(e) => {
              console.error('Banner image load failed:', imageUrl);
              e.target.src = '/asset/placeholder-image.jpg';
              e.target.style.width = 'auto';
              e.target.style.height = 'auto';
              e.target.style.maxWidth = '100%';
              e.target.style.maxHeight = '100%';
              e.target.style.objectFit = 'contain';
            }}
          />
        </div>

        <div className="right" style={{ flex: 1, textAlign: 'right' }}>
          {/* smallText */}
          <p style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: 'var(--space-2)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)'
          }}>
            {smallText}
          </p>
          
          {/* midText - Aurora Sky Pulse */}
          <h3 className="product-name" style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            color: 'white',
            marginBottom: 'var(--space-3)',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {midText}
          </h3>
          
          {/* Description - WCAG AA compliant contrast */}
          <p style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-normal)',
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.5,
            maxWidth: '400px',
            marginLeft: 'auto'
          }}>
            {desc}
          </p>
        </div>
      </div>
      
      {/* CTA Button - UI/UX Pro Max: 44px min height, white bg, red text */}
      <div className="footer-cta" style={{
        marginTop: 'var(--space-8)',
        textAlign: 'center'
      }}>
        {shouldRenderLink ? (
          <Link href={`/product/${product}`}>
            <button type="button" className="shop-now-btn hover-effect" style={{
              backgroundColor: 'white',
              color: 'var(--color-cta-red)',
              padding: 'var(--space-3) var(--space-8)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-bold)',
              cursor: 'pointer',
              minHeight: '44px',
              transition: 'all var(--transition-base)',
              boxShadow: 'var(--shadow-medium)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)'
            }}>
              {buttonText}
            </button>
          </Link>
        ) : (
          <button type="button" className="shop-now-btn hover-effect" disabled style={{
            backgroundColor: 'rgba(255,255,255,0.5)',
            color: 'var(--color-cta-red)',
            padding: 'var(--space-3) var(--space-8)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-bold)',
            cursor: 'not-allowed',
            minHeight: '44px',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)'
          }}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default FooterBanner;