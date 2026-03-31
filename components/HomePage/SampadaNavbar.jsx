"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, User, Menu, X, MoreVertical, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getNavigationData } from '@/lib/client';

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
          animation: isClient ? 'sampada-marquee 15s linear infinite' : 'none'
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
        style={{
          padding: '20px 12px',
          fontSize: '14px',
          fontWeight: 700,
          color: '#1f2937',
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
          e.currentTarget.style.color = '#8B1A1A';
          const underline = e.currentTarget.querySelector('.nav-underline');
          if (underline) underline.style.width = '100%';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#1f2937';
          const underline = e.currentTarget.querySelector('.nav-underline');
          if (underline) underline.style.width = '0%';
        }}
      >
        {label}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: '10px' }}
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
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              x: '-50%',
              backgroundColor: '#0a0a0a',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              padding: '20px 28px',
              zIndex: 9999,
              borderTop: '2px solid #C9A84C',
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px',
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
                    borderLeft: index === 1 && Object.keys(data.sections).length === 2 ? '1px solid rgba(201, 168, 76, 0.3)' : 'none',
                    minWidth: 0
                  }}
                >
                  <h3
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#C9A84C',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid rgba(201, 168, 76, 0.4)'
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
                      gap: '10px'
                    }}
                  >
                    {items.map(item => {
                      // Use item.href if available (from Sanity), otherwise construct from label
                      const itemHref = item.href || `${data.href}/${generateSlug(typeof item === 'string' ? item : item.label)}`;
                      const itemLabel = typeof item === 'string' ? item : item.label;
                      
                      return (
                        <li key={itemLabel}>
                          <Link
                            href={itemHref}
                            style={{
                              fontSize: '13px',
                              color: '#e0e0e0',
                              textDecoration: 'none',
                              transition: 'all 0.15s ease',
                              display: 'block',
                              padding: '6px 0'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#C9A84C';
                              e.currentTarget.style.paddingLeft = '6px';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#e0e0e0';
                              e.currentTarget.style.paddingLeft = '0px';
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
        style={{
          padding: '20px 12px',
          fontSize: '14px',
          fontWeight: 700,
          color: '#1f2937',
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
          e.currentTarget.style.color = '#8B1A1A';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#1f2937';
        }}
      >
        More <MoreVertical size={14} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: '#0a0a0a',
              borderTop: '2px solid #C9A84C',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              borderRadius: '6px',
              padding: '12px 0',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 9999,
              minWidth: '180px'
            }}
          >
            <Link
              href="/about"
              onClick={onClose}
              style={{
                padding: '12px 20px',
                fontSize: '14px',
                color: '#e5e5e5',
                textDecoration: 'none',
                display: 'block',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(201, 168, 76, 0.1)';
                e.currentTarget.style.color = '#C9A84C';
                e.currentTarget.style.paddingLeft = '24px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#e5e5e5';
                e.currentTarget.style.paddingLeft = '20px';
              }}
            >
              About Us
            </Link>
            <div style={{ height: '1px', backgroundColor: 'rgba(201, 168, 76, 0.3)', margin: '8px 0' }} />
            <Link
              href="/contact"
              onClick={onClose}
              style={{
                padding: '12px 20px',
                fontSize: '14px',
                color: '#e5e5e5',
                textDecoration: 'none',
                display: 'block',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(201, 168, 76, 0.1)';
                e.currentTarget.style.color = '#C9A84C';
                e.currentTarget.style.paddingLeft = '24px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#e5e5e5';
                e.currentTarget.style.paddingLeft = '20px';
              }}
            >
              Contact
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// TASK 4: MOBILE HAMBURGER MENU WITH ACCORDION
// ============================================================================
function MobileMenu({ isOpen, onClose, session }) {
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 149
            }}
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '400px',
              backgroundColor: '#0a0a0a',
              zIndex: 150,
              overflowY: 'auto',
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.3)'
            }}
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
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#C9A84C',
                  letterSpacing: '1px'
                }}
              >
                Menu
              </span>
              <button
                onClick={onClose}
                aria-label="Close menu"
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
                  minWidth: '48px'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Menu Items */}
            <div
              style={{
                padding: '16px 24px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Home Link */}
              <Link
                href="/"
                onClick={onClose}
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#e5e5e5',
                  textDecoration: 'none',
                  padding: '16px 0',
                  borderBottom: '1px solid rgba(201, 168, 76, 0.2)',
                  minHeight: '48px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Home
              </Link>

              {/* Category Accordion Items */}
              {Object.entries(menuItems).map(([label, data]) => {
                const isExpanded = expandedCategory === label;

                return (
                  <div
                    key={label}
                    style={{
                      borderBottom: '1px solid rgba(201, 168, 76, 0.2)'
                    }}
                  >
                    <button
                      onClick={() => toggleCategory(label)}
                      aria-expanded={isExpanded}
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 0',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#e5e5e5',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        minHeight: '48px'
                      }}
                    >
                      {label}
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: '#C9A84C' }}
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div
                            style={{
                              paddingBottom: '16px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '12px'
                            }}
                          >
                            {Object.entries(data.sections).flatMap(([_, items]) =>
                              items.map(item => {
                                const itemHref = item.href || `${data.href}/${generateSlug(typeof item === 'string' ? item : item.label)}`;
                                const itemLabel = typeof item === 'string' ? item : item.label;
                                
                                return (
                                  <Link
                                    key={itemLabel}
                                    href={itemHref}
                                    onClick={onClose}
                                    style={{
                                      fontSize: '14px',
                                      color: '#a0a0a0',
                                      textDecoration: 'none',
                                      padding: '8px 16px',
                                      borderRadius: '4px',
                                      transition: 'all 0.2s ease',
                                      display: 'block',
                                      minHeight: '44px',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#C9A84C';
                                      e.currentTarget.style.backgroundColor = 'rgba(201, 168, 76, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#a0a0a0';
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                  >
                                    {itemLabel}
                                  </Link>
                                );
                              })
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Sampada Stories */}
              <Link
                href="/stories"
                onClick={onClose}
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#e5e5e5',
                  textDecoration: 'none',
                  padding: '16px 0',
                  borderBottom: '1px solid rgba(201, 168, 76, 0.2)',
                  minHeight: '48px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Sampada Stories
              </Link>

              {/* More Dropdown (Mobile) */}
              <div
                style={{
                  borderBottom: '1px solid rgba(201, 168, 76, 0.2)'
                }}
              >
                <button
                  onClick={() => setExpandedMore(!expandedMore)}
                  aria-expanded={expandedMore}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 0',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#e5e5e5',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    minHeight: '48px'
                  }}
                >
                  More
                  <motion.span
                    animate={{ rotate: expandedMore ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: '#C9A84C' }}
                  >
                    {expandedMore ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </motion.span>
                </button>

                <AnimatePresence>
                  {expandedMore && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        style={{
                          paddingBottom: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        <Link
                          href="/about"
                          onClick={onClose}
                          style={{
                            fontSize: '14px',
                            color: '#a0a0a0',
                            textDecoration: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            transition: 'all 0.2s ease',
                            minHeight: '44px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#C9A84C';
                            e.currentTarget.style.backgroundColor = 'rgba(201, 168, 76, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#a0a0a0';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          About Us
                        </Link>
                        <Link
                          href="/contact"
                          onClick={onClose}
                          style={{
                            fontSize: '14px',
                            color: '#a0a0a0',
                            textDecoration: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            transition: 'all 0.2s ease',
                            minHeight: '44px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#C9A84C';
                            e.currentTarget.style.backgroundColor = 'rgba(201, 168, 76, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#a0a0a0';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          Contact
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sign In Button (Prominent at Bottom) */}
              {!session && (
                <div style={{ marginTop: '24px' }}>
                  <Link
                    href="/api/auth/signin"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      backgroundColor: '#8B1A1A',
                      color: 'white',
                      padding: '16px 24px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
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

              {/* Cart Link */}
              <div style={{ marginTop: '16px' }}>
                <Link
                  href="/cart"
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
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
  showMarquee = true
}) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeMore, setActiveMore] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
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
        console.error('Nav fetch failed:', err);
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
    <header
      style={{
        width: '100%',
        backgroundColor: 'white',
        borderBottom: isScrolled ? '1px solid rgba(201, 168, 76, 0.3)' : '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* TASK 1: Marquee Announcement Bar - only if showMarquee is true */}
      {showMarquee && <MarqueeBar />}

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 32px',
          height: '72px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* LEFT — Logo with Premium Typography */}
        <Link
          href="/"
          style={{
            fontWeight: 900,
            fontSize: '26px',
            background: 'linear-gradient(135deg, #8B1A1A 0%, #0a0a0a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none',
            flexShrink: 0,
            marginRight: '40px',
            letterSpacing: '-0.5px',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Sampada
        </Link>

        {/* CENTER — Navigation with Mega Dropdowns */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            gap: '4px'
          }}
          className="hidden lg:flex"
        >
          <Link
            href="/"
            style={{
              padding: '20px 12px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#1f2937',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              position: 'relative',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#8B1A1A';
              const underline = e.currentTarget.querySelector('.home-underline');
              if (underline) underline.style.width = '100%';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#1f2937';
              const underline = e.currentTarget.querySelector('.home-underline');
              if (underline) underline.style.width = '0%';
            }}
          >
            Home
            <span
              className="home-underline"
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
            style={{
              padding: '20px 12px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#1f2937',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              position: 'relative',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#8B1A1A';
              const underline = e.currentTarget.querySelector('.stories-underline');
              if (underline) underline.style.width = '100%';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#1f2937';
              const underline = e.currentTarget.querySelector('.stories-underline');
              if (underline) underline.style.width = '0%';
            }}
          >
            Sampada Stories
            <span
              className="stories-underline"
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
          </Link>

          <MoreDropdown
            isOpen={activeMore === 'more'}
            onOpen={() => setActiveMore('more')}
            onClose={() => setActiveMore(null)}
          />
        </nav>

        {/* RIGHT — Actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16px',
            flexShrink: 0
          }}
        >
          {/* Desktop Actions */}
          <div
            className="hidden lg:flex"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}
          >
            {/* Sign In Button with Gold Border */}
            {!session && !loading && (
              <button
                onClick={onSignIn}
                style={{
                  backgroundColor: 'transparent',
                  color: '#8B1A1A',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: '2px solid #C9A84C',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#8B1A1A';
                  e.currentTarget.style.borderColor = '#8B1A1A';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#C9A84C';
                  e.currentTarget.style.color = '#8B1A1A';
                }}
              >
                <User size={16} /> Sign In
              </button>
            )}

            {/* Cart Icon */}
            <button
              onClick={() => setShowCart(true)}
              aria-label={`Open Cart, ${(totalQuantities || 0)} items`}
              style={{
                color: '#1f2937',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                position: 'relative',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8B1A1A'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1f2937'}
            >
              <ShoppingCart size={24} />
              {(totalQuantities || 0) > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    backgroundColor: '#8B1A1A',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 700,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white'
                  }}
                  aria-label={`${totalQuantities} items in cart`}
                >
                  {totalQuantities}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle (Gold Hamburger) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Toggle menu"
            className="lg:hidden"
            style={{
              display: 'flex',
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C9A84C',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#8B1A1A'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#C9A84C'}
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* TASK 4: Mobile Menu Slide-in Panel */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        session={session}
      />
    </header>
  );
}
