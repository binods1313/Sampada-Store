// components/SkipLink.jsx
// WCAG 2.4.1 Bypass Blocks - Skip to main content link
// Hidden by default, visible on focus for keyboard users

import React from 'react';

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
      style={{
        position: 'absolute',
        top: '-100%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        background: '#C9A84C',
        color: '#1a0a00',
        padding: '12px 24px',
        fontWeight: 700,
        fontSize: '16px',
        textDecoration: 'none',
        borderRadius: '0 0 8px 8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'top 0.15s ease',
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '0';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-100%';
      }}
    >
      Skip to main content
    </a>
  );
}
