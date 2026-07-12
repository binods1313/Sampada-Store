"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, User, Menu, X, MoreVertical, ChevronDown, ChevronUp, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { getNavigationData } from '@/lib/client';
import SmartSearch from '@/components/SmartSearch/SmartSearch';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SampadaMedallion from './SampadaMedallion';

// ============================================================================
// CONFIGURATION - Hardcoded Menu Items (Fallback if Sanity is unreachable)
// ============================================================================
const HARDCODED_MENU_ITEMS = {
  "Men's Clothing": {
    href: "/collections/mens-tshirts",
    sections: {
      "SHOP BY PRODUCT": [
        { label: "T-shirts", href: "/collections/mens-tshirts" },
        { label: "Hoodies", href: "/collections/mens-hoodies" },
        { label: "Sweatshirts", href: "/collections/mens-sweatshirts" },
        { label: "Long Sleeves", href: "/collections/mens-long-sleeves" },
        { label: "Tank Tops", href: "/collections/mens-tank-tops" },
        { label: "Sportswear", href: "/collections/mens-sportswear" },
        { label: "Bottoms", href: "/collections/mens-bottoms" },
        { label: "Swimwear", href: "/collections/mens-swimwear" },
        { label: "Shoes", href: "/collections/mens-shoes" },
        { label: "Outerwear", href: "/collections/mens-outerwear" }
      ]
    }
  },
  "Women's Clothing": {
    href: "/collections/womens-tshirts",
    sections: {
      "SHOP BY PRODUCT": [
        { label: "T-shirts", href: "/collections/womens-tshirts" },
        { label: "Hoodies", href: "/collections/womens-hoodies" },
        { label: "Sweatshirts", href: "/collections/womens-sweatshirts" },
        { label: "Long Sleeves", href: "/collections/womens-long-sleeves" },
        { label: "Tank Tops", href: "/collections/womens-tank-tops" },
        { label: "Skirts & Dresses", href: "/collections/womens-skirts-dresses" },
        { label: "Sportswear", href: "/collections/womens-sportswear" },
        { label: "Bottoms", href: "/collections/womens-bottoms" },
        { label: "Swimwear", href: "/collections/womens-swimwear" },
        { label: "Shoes", href: "/collections/womens-shoes" },
        { label: "Outerwear", href: "/collections/womens-outerwear" }
      ]
    }
  },
  "His & Hers": {
    href: "/collections/his-hers",
    sections: {
      "SHOP BY PRODUCT": [
        { label: "Matching Sets", href: "/collections/matching-sets" },
        { label: "Couples T-shirts", href: "/collections/couples-tshirts" },
        { label: "Hoodies", href: "/collections/his-hers-hoodies" },
        { label: "Sweatshirts", href: "/collections/his-hers-sweatshirts" },
        { label: "Bottoms", href: "/collections/his-hers-bottoms" },
        { label: "Accessories", href: "/collections/his-hers-accessories" }
      ]
    }
  },
  "Accessories": {
    href: "/category/accessories",
    sections: {
      "SHOP BY PRODUCT": [
        { label: "Jewelry", href: "/collections/jewelry" },
        { label: "Phone Cases", href: "/collections/phone-cases" },
        { label: "Bags", href: "/collections/bags" },
        { label: "Socks", href: "/collections/socks" },
        { label: "Hats", href: "/collections/hats" },
        { label: "Underwear", href: "/collections/underwear" },
        { label: "Baby Accessories", href: "/collections/baby-accessories" },
        { label: "Mouse Pads", href: "/collections/mouse-pads" }
      ],
      "MORE": [
        { label: "Tech Accessories", href: "/collections/tech-accessories" },
        { label: "Travel Accessories", href: "/collections/travel-accessories" },
        { label: "Stationery", href: "/collections/stationery" },
        { label: "Sports & Games", href: "/collections/sports-games" },
        { label: "Face Masks", href: "/collections/face-masks" },
        { label: "Kitchen Accessories", href: "/collections/kitchen-accessories" },
        { label: "Car Accessories", href: "/collections/car-accessories" },
        { label: "Other", href: "/collections/other-accessories" }
      ]
    }
  },
  "Home & Living": {
    href: "/collections/home-living",
    sections: {
      "SHOP BY PRODUCT": [
        { label: "Mugs", href: "/collections/mugs" },
        { label: "Candles", href: "/collections/candles" },
        { label: "Posters", href: "/collections/posters" },
        { label: "Canvas", href: "/collections/canvas" },
        { label: "Blankets", href: "/collections/blankets" },
        { label: "Pillows & Covers", href: "/collections/pillows-covers" },
        { label: "Towels", href: "/collections/towels" },
        { label: "Journals & Notebooks", href: "/collections/journals-notebooks" }
      ],
      "MORE": [
        { label: "Home Decor", href: "/collections/home-decor" },
        { label: "Glassware", href: "/collections/glassware" },
        { label: "Bottles & Tumblers", href: "/collections/bottles-tumblers" },
        { label: "Rugs & Mats", href: "/collections/rugs-mats" },
        { label: "Bedding", href: "/collections/bedding" },
        { label: "Bathroom", href: "/collections/bathroom" },
        { label: "Seasonal Decorations", href: "/collections/seasonal-decorations" },
        { label: "Food - Health - Beauty", href: "/collections/food-health-beauty" }
      ]
    }
  }
};

// ============================================================================
// UTILITY: Generate URL slugs from text (kept for backward compatibility)
// ============================================================================
function generateSlug(text) {
  return text.toLowerCase()
    .replace(/[&]/g, 'and')
    .replace(/[\s-]+/g, '-');
}

// ============================================================================
// TASK 1: MARQUEE ANNOUNCEMENT BAR (WCAG 2.2.2 Compliant - Pausable)
// Client-only component to avoid hydration mismatch
// ============================================================================
function MarqueeBar() {
  const [isClient, setIsClient] = useState(false);
  const text = "Free Shipping ₹999+  •  30-Day Returns  •  COD Available  •  ★★★★★ 4.8 from 1,200+ customers";
  
  // Ensure animation only runs after client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <div 
      className="sampada-marquee-bar"
      role="marquee"
      aria-label="Announcements: Free Shipping on orders over ₹999, 30-Day Returns, COD Available, 4.8 star rating from 1,200+ customers"
    >
      <div
        className="sampada-marquee-track"
        style={{
          animation: isClient ? 'sampada-marquee 22.5s linear infinite' : 'none' // Updated duration to 22.5s
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.animationPlayState = 'paused';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animationPlayState = 'running';
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <span key={i} className="sampada-marquee-text">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// TASK 3: MEGA DROPDOWN MENU COMPONENT
// ============================================================================
function MegaDropdown({ label, data, isOpen, onOpen, onClose }) {
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onClose]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpen();
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      onClose();
    }, 150);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      isOpen ? onClose() : onOpen();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      <button
        onClick={isOpen ? onClose : onOpen}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`nav-link ${isOpen ? 'nav-link-active' : ''}`}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          const underline = e.currentTarget.querySelector('.nav-underline');
          if (underline) underline.style.width = '100%';
        }}
        onMouseLeave={(e) => {
          const underline = e.currentTarget.querySelector('.nav-underline');
          if (underline) underline.style.width = '0%';
        }}
      >
        {label}
        <motion.span
          className={`nav-chevron ${isOpen ? 'nav-chevron-open' : ''}`}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: '11px' }}
        >
          ▾
        </motion.span>
        <span
          className="nav-underline"
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            height: '2px',
            backgroundColor: '#C9A84C',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease',
            width: '0%'
          }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="nav-dropdown"
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              x: '-50%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              padding: '20px 28px',
              zIndex: 9999,
              borderTop: '2px solid #C9A84C',
              width: Object.keys(data.sections).length === 1 ? '220px' : '480px',
              maxWidth: '720px'
            }}
          >
            <div
              style={{
                display: Object.keys(data.sections).length === 1 ? 'flex' : 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: Object.keys(data.sections).length === 1 ? '0' : '24px'
              }}
            >
              {Object.entries(data.sections).map(([sectionTitle, items], index) => (
                <div 
                  key={sectionTitle}
                  style={{
                    paddingLeft: index === 1 && Object.keys(data.sections).length === 2 ? '24px' : '0',
                    borderLeft: index === 1 && Object.keys(data.sections).length === 2 ? '1px solid rgba(201, 168, 76, 0.1)' : 'none',
                    minWidth: 0
                  }}
                >
                  <h3
                    style={{
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid rgba(201, 168, 76, 0.2)'
                    }}
                  >
                    {sectionTitle}
                  </h3>
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    {items.map(item => {
                      const itemHref = item.href || `${data.href}/${generateSlug(typeof item === 'string' ? item : item.label)}`;
                      const itemLabel = typeof item === 'string' ? item : item.label;
                      const isActive = pathname === itemHref;
                      
                      return (
                        <li key={itemLabel}>
                          <Link
                            href={itemHref}
                            className={isActive ? 'active' : ''}
                            style={{
                              display: 'block'
                            }}
                          >
                            {itemLabel}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ============================================================================
// TASK 3 (continued): MORE DROPDOWN
// ============================================================================
function MoreDropdown({ isOpen, onOpen, onClose }) {
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onClose]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpen();
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      onClose();
    }, 150);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      isOpen ? onClose() : onOpen();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <button
        onClick={isOpen ? onClose : onOpen}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="More options"
        className={`nav-link ${isOpen ? 'nav-link-active' : ''}`}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'color 0.2s ease',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          const underline = e.currentTarget.querySelector('.more-underline');
          if (underline) underline.style.width = '100%';
        }}
        onMouseLeave={(e) => {
          const underline = e.currentTarget.querySelector('.more-underline');
          if (underline) underline.style.width = '0%';
        }}
      >
        More <MoreVertical size={14} />
        <span
          className="more-underline"
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            height: '2px',
            backgroundColor: '#C9A84C',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease',
            width: '0%'
          }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="nav-dropdown"
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              borderRadius: '6px',
              padding: '12px 0',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 9999,
              minWidth: '180px',
              borderTop: '2px solid #C9A84C'
            }}
          >
            <Link
              href="/about"
              onClick={onClose}
              className={pathname === '/about' ? 'active' : ''}
              style={{ display: 'block' }}
            >
              About Us
            </Link>
            <div style={{ height: '1px', backgroundColor: 'rgba(201, 168, 76, 0.1)', margin: '8px 0' }} />
            <Link
              href="/company"
              onClick={onClose}
              className={pathname === '/company' ? 'active' : ''}
              style={{ display: 'block' }}
            >
              Company
            </Link>
            <div style={{ height: '1px', backgroundColor: 'rgba(201, 168, 76, 0.1)', margin: '8px 0' }} />
            <Link
              href="/team"
              onClick={onClose}
              className={pathname === '/team' ? 'active' : ''}
              style={{ display: 'block' }}
            >
              Team
            </Link>
            <div style={{ height: '1px', backgroundColor: 'rgba(201, 168, 76, 0.1)', margin: '8px 0' }} />
            <Link
              href="/support"
              onClick={onClose}
              className={pathname === '/support' ? 'active' : ''}
              style={{ display: 'block' }}
            >
              Support
            </Link>
            <div style={{ height: '1px', backgroundColor: 'rgba(201, 168, 76, 0.1)', margin: '8px 0' }} />
            <Link
              href="/blog"
              onClick={onClose}
              className={pathname === '/blog' ? 'active' : ''}
              style={{ display: 'block' }}
            >
              Blog
            </Link>
            <div style={{ height: '1px', backgroundColor: 'rgba(201, 168, 76, 0.1)', margin: '8px 0' }} />
            <Link
              href="/contact"
              onClick={onClose}
              className={pathname === '/contact' ? 'active' : ''}
              style={{ display: 'block' }}
            >
              Contact
            </Link>
            <div style={{ height: '1px', backgroundColor: 'rgba(201, 168, 76, 0.1)', margin: '8px 0' }} />
            {/* Creative Studio — premium entry in More dropdown */}
            <a
              href="/creative-studio"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 14px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(139,26,26,0.12) 0%, rgba(201,168,76,0.08) 100%)',
                border: '1px solid rgba(201,168,76,0.3)',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                marginTop: 4,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139,26,26,0.25) 0%, rgba(201,168,76,0.18) 100%)';
                e.currentTarget.style.border = '1px solid rgba(201,168,76,0.6)';
                e.currentTarget.style.boxShadow = '0 0 18px rgba(201,168,76,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139,26,26,0.12) 0%, rgba(201,168,76,0.08) 100%)';
                e.currentTarget.style.border = '1px solid rgba(201,168,76,0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Animated shimmer sweep */}
              <span style={{
                position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.12), transparent)',
                animation: 'studioShimmer 3s infinite',
                pointerEvents: 'none',
              }} />

              {/* Icon */}
              <span style={{
                width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                background: 'linear-gradient(135deg, #8B1A1A, #C9A84C)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: '#FAF6F0',
                boxShadow: '0 0 8px rgba(201,168,76,0.3)',
              }}>
                ✦
              </span>

              {/* Label block */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{
                  fontSize: 13, fontWeight: 700, color: '#1A0A08',
                  fontFamily: 'inherit', letterSpacing: '0.2px', lineHeight: 1.2,
                }}>
                  Creative Studio
                </span>
                <span style={{
                  fontSize: 10, color: '#8B1A1A', fontWeight: 600,
                  letterSpacing: '1px', textTransform: 'uppercase',
                }}>
                  AI-Powered · Beta
                </span>
              </div>

              {/* NEW badge */}
              <span style={{
                marginLeft: 'auto', padding: '2px 7px', borderRadius: 20,
                background: 'linear-gradient(135deg, #8B1A1A, #C9A84C)',
                color: '#FAF6F0', fontSize: 9, fontWeight: 700,
                letterSpacing: '0.8px', textTransform: 'uppercase',
                animation: 'studioPulse 2.5s ease-in-out infinite',
                flexShrink: 0,
              }}>
                NEW
              </span>
            </a>


          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ============================================================================
// TASK 4: MOBILE HAMBURGER MENU WITH ACCORDION
// ============================================================================
function MobileMenu({ isOpen, onClose, session, menuItems }) {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedMore, setExpandedMore] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <>
      {/* Overlay — OUTSIDE header, sibling to it */}
      {isOpen && (
        <div
          className="drawer-overlay"
          onClick={onClose}
        />
      )}

      {/* Drawer — OUTSIDE header, sibling to it */}
      <div 
        className={`mobile-drawer ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header with Close Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(201, 168, 76, 0.3)'
          }}
        >
          <span
            className="sampada-logo"
            style={{
              fontFamily: "'Pinyon Script', 'Cinzel', cursive",
              fontSize: '28px',
              fontWeight: 700,
              color: '#C9A84C',
              letterSpacing: '1px',
              lineHeight: 1
            }}
          >
            Sampada
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="drawer-close"
            style={{
              background: 'none',
              border: 'none',
              color: '#C9A84C',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '48px',
              minWidth: '48px',
              transition: 'opacity 0.2s ease',
              fontSize: '22px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            ✕
          </button>
        </div>

        {/* Menu Items */}
        <div
          style={{
            padding: '0',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
              {/* Home Link */}
              <Link
                href="/"
                onClick={onClose}
                className="mobile-nav-item"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span style={{ flex: 1 }}>Home</span>
                <span className="mobile-nav-item-arrow">→</span>
              </Link>

              {/* Category Accordion Items */}
              {Object.entries(menuItems).map(([label, data]) => {
                const isExpanded = expandedCategory === label;

                return (
                  <div
                    key={label}
                    style={{
                    }}
                  >
                    <button
                      onClick={() => toggleCategory(label)}
                      aria-expanded={isExpanded}
                      className="mobile-nav-item"
                      style={{
                        width: '100%',
                        fontSize: '15px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {label}
                      <span
                        className="mobile-nav-item-arrow"
                        style={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mobile-submenu mobile-submenu-open">
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            {Object.entries(data.sections).map(([sectionTitle, items]) => (
                              <>
                                <div className="mobile-submenu-header">{sectionTitle}</div>
                                {items.map(item => {
                                  const itemHref = item.href || `${data.href}/${generateSlug(typeof item === 'string' ? item : item.label)}`;
                                  const itemLabel = typeof item === 'string' ? item : item.label;

                                  return (
                                    <Link
                                      key={itemLabel}
                                      href={itemHref}
                                      onClick={onClose}
                                      className="mobile-submenu-item"
                                      style={{
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        display: 'block'
                                      }}
                                    >
                                      {itemLabel}
                                    </Link>
                                  );
                                })}
                              </>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

              {/* Sampada Stories */}
              <Link
                href="/stories"
                onClick={onClose}
                className="mobile-nav-item"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span style={{ flex: 1 }}>Sampada Stories</span>
                <span className="mobile-nav-item-arrow">→</span>
              </Link>

              {/* More Dropdown (Mobile) */}
              <div>
                <button
                  onClick={() => setExpandedMore(!expandedMore)}
                  aria-expanded={expandedMore}
                  className="mobile-nav-item"
                  style={{
                    width: '100%',
                    fontSize: '15px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  More
                  <span
                    className="mobile-nav-item-arrow"
                    style={{
                      transform: expandedMore ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    {expandedMore ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {expandedMore && (
                  <div className="mobile-submenu mobile-submenu-open">
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Link
                          href="/about"
                          onClick={onClose}
                          className="mobile-submenu-item"
                          style={{
                            fontSize: '14px',
                            textDecoration: 'none',
                            display: 'block'
                          }}
                        >
                          About Us
                        </Link>
                        <Link
                          href="/company"
                          onClick={onClose}
                          className="mobile-submenu-item"
                          style={{
                            fontSize: '14px',
                            textDecoration: 'none',
                            display: 'block'
                          }}
                        >
                          Company
                        </Link>
                        <Link
                          href="/team"
                          onClick={onClose}
                          className="mobile-submenu-item"
                          style={{
                            fontSize: '14px',
                            textDecoration: 'none',
                            display: 'block'
                          }}
                        >
                          Team
                        </Link>
                        <Link
                          href="/support"
                          onClick={onClose}
                          className="mobile-submenu-item"
                          style={{
                            fontSize: '14px',
                            textDecoration: 'none',
                            display: 'block'
                          }}
                        >
                          Support
                        </Link>
                        <Link
                          href="/blog"
                          onClick={onClose}
                          className="mobile-submenu-item"
                          style={{
                            fontSize: '14px',
                            textDecoration: 'none',
                            display: 'block'
                          }}
                        >
                          Blog
                        </Link>
                        <Link
                          href="/contact"
                          onClick={onClose}
                          className="mobile-submenu-item"
                          style={{
                            fontSize: '14px',
                            textDecoration: 'none',
                            display: 'block'
                          }}
                        >
                          Contact
                        </Link>
                        <div style={{ height: '1px', backgroundColor: 'rgba(201, 168, 76, 0.1)', margin: '8px 0' }} />
                        <Link
                          href="/creative-studio"
                          onClick={onClose}
                          className="mobile-submenu-item"
                          style={{
                            fontSize: '14px',
                            textDecoration: 'none',
                            display: 'block',
                            fontWeight: '600',
                            color: '#C9A84C'
                          }}
                        >
                          🎨 Creative Studio
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

              {/* Sign In Button (When Not Logged In) */}
              {!session && (
                <div style={{ marginTop: '24px', padding: '0 24px' }}>
                  <Link
                    href="/api/auth/signin"
                    className="mobile-signin-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '14px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      border: '2px solid transparent',
                      minHeight: '56px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#C9A84C';
                      e.currentTarget.style.borderColor = '#C9A84C';
                      e.currentTarget.style.color = '#0a0a0a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#8B1A1A';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.color = 'white';
                    }}
                  >
                    <User size={20} /> Sign In
                  </Link>
                </div>
              )}

              {/* Account Section (When Logged In) */}
              {session?.user && (
                <div style={{ marginTop: '24px', paddingBottom: '16px', borderTop: '1px solid rgba(201, 168, 76, 0.3)', paddingTop: '16px' }}>
                  {/* User Info */}
                  <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#C9A84C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <User size={24} color="#0a0a0a" />
                      </div>
                    )}
                    <div style={{ color: '#ffffff' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{session.user.name || 'User'}</div>
                      <div style={{ fontSize: '12px', color: '#C9A84C' }}>{session.user.email}</div>
                    </div>
                  </div>

                  {/* Account Link */}
                  <Link
                    href="/account"
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '14px 24px',
                      color: '#C9A84C',
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                      borderBottom: '1px solid rgba(201, 168, 76, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(201, 168, 76, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    📋 My Account
                  </Link>

                  {/* Sign Out Button */}
                  <button
                    onClick={() => {
                      signOut();
                      onClose();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '14px 24px',
                      color: '#ff6b6b',
                      backgroundColor: 'transparent',
                      border: 'none',
                      fontSize: '15px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    🚪 Sign out
                  </button>
                </div>
              )}

              {/* Cart Link */}
              <div style={{ marginTop: '16px', padding: '0 24px' }}>
                <Link
                  href="/cart"
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: 'transparent',
                    color: '#C9A84C',
                    padding: '16px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    border: '2px solid #C9A84C',
                    minHeight: '56px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(201, 168, 76, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <ShoppingCart size={20} /> Cart
                </Link>
              </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// MAIN COMPONENT: SampadaNavbar
// ============================================================================
export default function SampadaNavbar({
  session,
  loading,
  onSignIn,
  totalQuantities,
  setShowCart,
  showMarquee = false
}) {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeMore, setActiveMore] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Keyboard shortcut: Ctrl+K or Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const userButton = document.querySelector('[data-user-dropdown-toggle]');
      const userMenu = document.querySelector('[data-user-dropdown-menu]');
      
      if (
        isUserDropdownOpen &&
        userMenu &&
        !userMenu.contains(event.target) &&
        userButton &&
        !userButton.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserDropdownOpen]);
  
  // Navigation data state - Initialize with hardcoded fallback for immediate render
  const [menuItems, setMenuItems] = useState(HARDCODED_MENU_ITEMS);
  const [navLoading, setNavLoading] = useState(true);

  // Fetch navigation data from Sanity on mount
  useEffect(() => {
    async function loadNav() {
      try {
        const data = await getNavigationData();
        const formatted = data.reduce((acc, item) => {
          acc[item.label] = {
            href: item.href,
            sections: (item.sections || []).reduce((secAcc, section) => {
              secAcc[section.sectionTitle] = (section.items || []).map(i => ({
                label: i.label,
                href: i.href
              }));
              return secAcc;
            }, {})
          };
          return acc;
        }, {});
        setMenuItems(formatted);
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') console.error('Nav fetch failed:', err);
        // Keep hardcoded data (already set as initial state)
      } finally {
        setNavLoading(false);
      }
    }
    loadNav();
  }, []);

  // Handle scroll effect for sticky navbar shadow
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* TASK 1: Marquee Announcement Bar - only if showMarquee is true */}
      {showMarquee && <MarqueeBar />}

      <header className="site-header">
        {/* Zone 1: Text Wordmark Logo */}
        <div className="header-logo">
          <Link href="/" className="navLogo" aria-label="Sampada Home">
            Sampada
          </Link>
        </div>

        {/* Zone 2: Nav links — all in one flex row */}
        <nav className="header-nav">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'nav-link-active' : ''}`}
          >
            Home
          </Link>

          {/* Mega Dropdowns for each category */}
          {Object.entries(menuItems).map(([label, data]) => (
            <MegaDropdown
              key={label}
              label={label}
              data={data}
              isOpen={activeMenu === label}
              onOpen={() => setActiveMenu(label)}
              onClose={() => setActiveMenu(null)}
            />
          ))}

          <Link
            href="/stories"
            className={`nav-link ${pathname === '/stories' ? 'nav-link-active' : ''}`}
          >
            Sampada Stories
          </Link>

          <MoreDropdown
            isOpen={activeMore === 'more'}
            onOpen={() => setActiveMore('more')}
            onClose={() => setActiveMore(null)}
          />
        </nav>

        {/* Zone 3: Right actions — all inline */}
        <div className="header-actions">
          {/* Sign In / Account Dropdown */}
          {!session && !loading ? (
            <button
              onClick={onSignIn}
              className="signin-btn"
            >
              <User size={14} /> Sign In
            </button>
          ) : session?.user && !loading ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                data-user-dropdown-toggle
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="icon-btn"
                style={{ fontSize: '14px', gap: '5px' }}
              >
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="user-avatar"
                    style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                  />
                )}
                {!session.user.image && <User size={18} />}
                <ChevronDown size={14} />
              </button>
              {isUserDropdownOpen && (
                <div
                  data-user-dropdown-menu
                  className="nav-dropdown"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    minWidth: '200px',
                    marginTop: '8px',
                    overflow: 'hidden'
                  }}
                >
                  <Link
                    href="/account"
                    onClick={() => setIsUserDropdownOpen(false)}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      color: '#1a1a1a',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fdf6e3'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    📋 My Account
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsUserDropdownOpen(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px 16px',
                      color: '#dc2626',
                      backgroundColor: 'transparent',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    🚪 Sign out
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* Search Icon */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search products"
            className="icon-btn"
          >
            <Search size={18} />
          </button>

          {/* Cart Icon — Sampada custom V6 */}
          <button
            onClick={() => setShowCart(true)}
            aria-label={`Open Cart, ${(totalQuantities || 0)} items`}
            className="icon-btn"
            style={{ position: 'relative', background: 'none', border: 'none', padding: 4 }}
          >
            <div
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, filter 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.filter =
                  'drop-shadow(0 2px 8px rgba(201,168,76,0.5))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.filter = 'none';
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/sampada-cart.png"
                alt="Cart"
                width={34}
                height={34}
                style={{ display: 'block' }}
              />
            </div>
            {(totalQuantities || 0) > 0 && (
              <span 
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#8B1A1A',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {totalQuantities}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle (Gold Hamburger) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Toggle menu"
            className="icon-btn hamburger-btn"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>


      {/* TASK 4: Mobile Menu Slide-in Panel */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        session={session}
        menuItems={menuItems}
      />

      {/* Smart Search Overlay */}
      <SmartSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
