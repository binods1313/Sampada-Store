// components/ShareButtons.jsx
// Reusable social share component for product pages
// Order: WhatsApp → X → Facebook → Pinterest → Copy Link
// Brand colors are applied, icons are SVGs from simpleicons.org
// No external library needed for toast – a simple custom Toast component is used.

import React, { useState, useEffect } from 'react';
import Toast from './Toast';
import styles from './ShareButtons.module.css';

// Simple SVG icons (sourced from simpleicons.org)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.149-.67.149-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.521.149-.173.198-.298.298-.496.099-.198.05-.372-.025-.521-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.572-.01c-.198 0-.521.074-.795.372s-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.87.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2.04c-5.523 0-10 4.477-10 10 0 1.766.462 3.428 1.268 4.878l-1.33 4.874 4.983-1.308c1.405.772 2.997 1.216 4.68 1.216 5.523 0 10-4.477 10-10s-4.477-10-10-10z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.675 0h-21.35C.595 0 0 .593 0 1.326v21.348C0 23.407.595 24 1.326 24H12.82v-9.294H9.692V11.01h3.128V8.41c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.59l-.467 3.696h-3.123V24h6.116c.73 0 1.326-.593 1.326-1.326V1.326C24 .593 23.405 0 22.675 0" />
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387-.113-.967-.215-2.453.045-3.511.236-.976 1.525-6.215 1.525-6.215s-.389-.779-.389-1.928c0-1.805 1.047-3.152 2.352-3.152 1.109 0 1.643.832 1.643 1.828 0 1.113-.71 2.777-1.077 4.322-.306 1.292.652 2.342 1.93 2.342 2.315 0 4.092-2.438 4.092-5.965 0-3.115-2.24-5.303-5.442-5.303-3.706 0-5.876 2.779-5.876 5.655 0 1.115.428 2.313.963 2.965.106.124.121.232.09.357-.099.413-.324 1.312-.368 1.494-.058.244-.191.297-.442.181-1.637-.756-2.66-3.125-2.66-5.033 0-4.094 2.979-7.865 8.593-7.865 4.511 0 8.018 3.212 8.018 7.5 0 4.463-2.816 8.067-6.726 8.067-1.314 0-2.55-.682-2.971-1.487l-.808 3.086c-.292 1.146-1.077 2.581-1.604 3.459 1.232.381 2.534.588 3.889.588 6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

export default function ShareButtons({ product }) {
  const [copied, setCopied] = useState(false);
  const [showNativeBtn, setShowNativeBtn] = useState(false);

  const productUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://sampada.store'}/product/${product?.slug?.current || ''}`;
  const title = product?.name || 'Check out this product on Sampada';
  const description = `Check out ${product?.name} on Sampada! Premium custom apparel with prosperity-inspired designs.`;
  const imageUrl = product?.image?.[0]?.asset ? `${process.env.NEXT_PUBLIC_SANITY_IMAGE_URL}/${product.image[0].asset._ref}?w=500` : '';
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      setShowNativeBtn(true);
    }
  }, []);

  const shareLinks = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      color: '#25D366',
      url: `https://wa.me/?text=${encodeURIComponent(`${title}\n${description}\n${productUrl}`)}`,
    },
    {
      id: 'x',
      label: 'X',
      color: '#000000',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(productUrl)}`,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(description)}`,
    },
    {
      id: 'pinterest',
      label: 'Pinterest',
      color: '#E60023',
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(description)}`,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback for older browsers
      const input = document.createElement('input');
      input.value = productUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.container}>
      <span className={styles.label}>Share:</span>
      {/* Native share (mobile only) – rendered only on client after mount */}
      <button
        className={styles.nativeBtn}
        onClick={() => navigator.share({ title, text: description, url: productUrl })}
        aria-label="Native share"
        style={{ display: showNativeBtn ? 'inline-flex' : 'none' }}
      >
        {/* Using generic share icon from lucide */}
        <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#6B7280" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M12 2v10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M9 5l3-3 3 3" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </button>

      {shareLinks.map(link => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.label}`}
          className={styles.shareBtn}
          style={{ '--share-color': link.color }}
        >
          {link.id === 'whatsapp' && <WhatsAppIcon />}
          {link.id === 'x' && <XIcon />}
          {link.id === 'facebook' && <FacebookIcon />}
          {link.id === 'pinterest' && <PinterestIcon />}
        </a>
      ))}

      <button className={styles.shareBtn} onClick={handleCopy} aria-label="Copy link" style={{ '--share-color': '#8B1A1A' }}>
        {copied ? (
          <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#10B981" xmlns="http://www.w3.org/2000/svg"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#6B7280" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h12v12H4z" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
        )}
      </button>

      {copied && <Toast message="Link copied! ✓" />}
    </div>
  );
}
