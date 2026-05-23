// components/ProductShare.jsx
// Social sharing buttons for product pages
// Share via WhatsApp, Twitter, Facebook, or copy link

import React, { useState, useEffect } from 'react';
import ShareButtons from './ShareButtons';
import { Share2, MessageCircle, Twitter, Facebook, Link, Check } from 'lucide-react';

export default function ProductShare({ product, className = '' }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [supportsNativeShare, setSupportsNativeShare] = useState(false);

  // Detect native share support only on client
  useEffect(() => {
    setSupportsNativeShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

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
    if (typeof navigator !== 'undefined' && navigator.share) {
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
    <ShareButtons product={product} />
  );
}
