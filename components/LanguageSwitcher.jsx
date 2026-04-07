// components/LanguageSwitcher.jsx
// Language switcher component - English/Hindi toggle

import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';

export default function LanguageSwitcher({ className = '' }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sampada_language') || 'en';
    }
    return 'en';
  });
  const [open, setOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  ];

  const handleLanguageChange = (code) => {
    setLanguage(code);
    localStorage.setItem('sampada_language', code);
    setOpen(false);
    // Reload to apply translations
    window.location.reload();
  };

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div className={`language-switcher ${className}`} style={{ position: 'relative' }}>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change language"
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          cursor: 'pointer',
          color: '#C9A84C',
          fontSize: '13px',
          fontWeight: '500',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#C9A84C';
          e.currentTarget.style.backgroundColor = 'rgba(201, 168, 76, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <Globe size={16} />
        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.label}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 1000,
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
            minWidth: '160px',
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 16px',
                backgroundColor: language === lang.code ? 'rgba(201, 168, 76, 0.1)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid #374151',
                cursor: 'pointer',
                color: '#F9FAFB',
                fontSize: '14px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </span>
              {language === lang.code && <Check size={14} color="#C9A84C" />}
            </button>
          ))}
        </div>
      )}

      {/* Close dropdown on outside click */}
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
          }}
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
