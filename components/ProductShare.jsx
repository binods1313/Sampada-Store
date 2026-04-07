// components/ProductShare.jsx
// Social sharing buttons for product pages
// Share via WhatsApp, Twitter, Facebook, or copy link

import React, { useState } from 'react';
import { Share2, MessageCircle, Twitter, Facebook, Link, Check } from 'lucide-react';

export default function ProductShare({ product, className = '' }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  if (!product) return null;

  const productUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://sampada.store'}/product/${product.slug?.current || ''}`;
  const title = product.name || 'Check out this product on Sampada';
  const description = `Check out ${product.name} on Sampada! Premium custom apparel with prosperity-inspired designs.`;

  const shareLinks = [
    {
      id: 'whatsapp',
      icon: <MessageCircle size={20} />,
      label: 'WhatsApp',
      color: '#25D366',
      url: `https://wa.me/?text=${encodeURIComponent(`${title}\n${description}\n${productUrl}`)}`,
    },
    {
      id: 'twitter',
      icon: <Twitter size={20} />,
      label: 'Twitter',
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(productUrl)}`,
    },
    {
      id: 'facebook',
      icon: <Facebook size={20} />,
      label: 'Facebook',
      color: '#4267B2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(description)}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
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

  // Native share API (mobile browsers)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: productUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    }
  };

  return (
    <div className={`product-share ${className}`}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px',
      }}>
        <span style={{
          fontSize: '12px',
          color: '#6B7280',
          fontWeight: '500',
        }}>
          Share:
        </span>

        {/* Native share button (mobile only) */}
        {typeof navigator !== 'undefined' && navigator.share && (
          <button
            onClick={handleNativeShare}
            aria-label="Share product"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#C9A84C';
              e.currentTarget.style.backgroundColor = '#FFF8F0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            <Share2 size={16} color="#6B7280" />
          </button>
        )}

        {/* Individual share buttons */}
        {shareLinks.map((share) => (
          <a
            key={share.id}
            href={share.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${share.label}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: `1px solid ${share.color}20`,
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = share.color;
              e.currentTarget.style.backgroundColor = `${share.color}10`;
              e.currentTarget.querySelector('svg').style.color = share.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${share.color}20`;
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.querySelector('svg').style.color = '#6B7280';
            }}
          >
            {React.cloneElement(share.icon, {
              color: '#6B7280',
              style: { transition: 'color 0.2s' },
            })}
          </a>
        ))}

        {/* Copy link button */}
        <button
          onClick={handleCopyLink}
          aria-label="Copy product link"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: copied ? '1px solid #10B981' : '1px solid #E5E7EB',
            backgroundColor: copied ? '#F0FDF4' : '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {copied ? (
            <Check size={16} color="#10B981" />
          ) : (
            <Link size={16} color="#6B7280" />
          )}
        </button>
      </div>
    </div>
  );
}
