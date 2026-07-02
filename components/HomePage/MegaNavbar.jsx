// components/HomePage/MegaNavbar.jsx
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, User, Menu, X, MoreVertical } from "lucide-react";

const menuItems = {
  "Men's Clothing": {
    href: "/collections/mens-tshirts",
    sections: {
      "SHOP BY PRODUCT": ["T-shirts","Hoodies","Sweatshirts","Long Sleeves","Tank Tops","Sportswear","Bottoms","Swimwear","Shoes","Outerwear"]
    }
  },
  "Women's Clothing": {
    href: "/collections/womens-tshirts",
    sections: {
      "SHOP BY PRODUCT": ["T-shirts","Hoodies","Sweatshirts","Long Sleeves","Tank Tops","Skirts & Dresses","Sportswear","Bottoms","Swimwear","Shoes","Outerwear"]
    }
  },
  "His & Hers": {
    href: "/collections/his-hers",
    sections: {
      "SHOP BY PRODUCT": ["Matching Sets","Couples T-shirts","Hoodies","Sweatshirts","Bottoms","Accessories"]
    }
  },
  "Accessories": {
    href: "/category/accessories",
    sections: {
      "SHOP BY PRODUCT": ["Jewelry","Phone Cases","Bags","Socks","Hats","Underwear","Baby Accessories","Mouse Pads"],
      "MORE": ["Tech Accessories","Travel Accessories","Stationery","Sports & Games","Face Masks","Kitchen Accessories","Car Accessories","Other"]
    }
  },
  "Home & Living": {
    href: "/collections/home-living",
    sections: {
      "SHOP BY PRODUCT": ["Mugs","Candles","Posters","Canvas","Blankets","Pillows & Covers","Towels","Journals & Notebooks"],
      "MORE": ["Home Decor","Glassware","Bottles & Tumblers","Rugs & Mats","Bedding","Bathroom","Seasonal Decorations","Food - Health - Beauty"]
    }
  }
};

// MoreDropdown component for Contact and About Us links
function MoreDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div 
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onKeyDown={handleKeyDown}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
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
          gap: '4px'
        }}
      >
        More <MoreVertical size={14} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          borderRadius: '6px',
          padding: '8px 0',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          minWidth: '150px'
        }}>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              color: '#4b5563',
              textDecoration: 'none',
              display: 'block',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              color: '#4b5563',
              textDecoration: 'none',
              display: 'block',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Contact
          </Link>
        </div>
      )}
    </div>
  );
}

// Mobile MoreDropdown component (tap to expand)
function MoreDropdownMobile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ borderBottom: '1px solid #e5e7eb' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="More options"
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0',
          fontSize: '16px',
          fontWeight: 700,
          color: '#1f2937',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        More
        <span style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
          fontSize: '12px'
        }}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div style={{
          paddingLeft: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingBottom: '12px'
        }}>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            style={{
              fontSize: '14px',
              color: '#6b7280',
              textDecoration: 'none',
              padding: '4px 0'
            }}
          >
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            style={{
              fontSize: '14px',
              color: '#6b7280',
              textDecoration: 'none',
              padding: '4px 0'
            }}
          >
            Contact
          </Link>
        </div>
      )}
    </div>
  );
}

export default function MegaNavbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{
      width: '100%',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>

        {/* LEFT — Logo */}
        <Link href="/" style={{
          fontWeight: 900,
          fontSize: '22px',
          color: 'black',
          textDecoration: 'none',
          flexShrink: 0,
          marginRight: '32px'
        }}>
          Sampada
        </Link>

        {/* CENTER — Nav */}
        <nav style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          gap: '4px'
        }}>
          <Link href="/" style={{
            padding: '20px 12px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#1f2937',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}>
            Home
          </Link>

          {Object.entries(menuItems).map(([label, data]) => (
            <div
              key={label}
              style={{ position: 'relative' }}
              onMouseEnter={() => setActiveMenu(label)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link href={data.href} style={{
                padding: '20px 12px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#1f2937',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {label} <span style={{fontSize:'10px'}}>▾</span>
              </Link>

              {/* Dropdown — only shows for active */}
              {activeMenu === label && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '48px',
                  zIndex: 100,
                  minWidth: '400px'
                }}>
                  {Object.entries(data.sections).map(([sectionTitle, items]) => (
                    <div key={sectionTitle}>
                      <h3 style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#111827',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '16px'
                      }}>
                        {sectionTitle}
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}>
                        {items.map(item => {
                          // Generate proper slug for each item
                          const itemSlug = item.toLowerCase()
                            .replace(/[&]/g, 'and')
                            .replace(/[\s-]+/g, '-');
                          
                          return (
                            <li key={item}>
                              <Link
                                href={`${data.href}/${itemSlug}`}
                                style={{
                                  fontSize: '14px',
                                  color: '#4b5563',
                                  textDecoration: 'none'
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#000')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
                              >
                                {item}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link href="/stories" style={{
            padding: '20px 12px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#1f2937',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}>
            Sampada Stories
          </Link>

          <MoreDropdown />
        </nav>

        {/* RIGHT — Actions */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0
        }}>
          {/* Desktop Actions */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
            <Link href="/api/auth/signin" style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <User size={16} /> Sign In
            </Link>
            <Link href="/cart" style={{
              color: '#1f2937',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center'
            }}>
              <ShoppingCart size={22} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 'auto'
            }}
            aria-label="Toggle menu"
            className="lg:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 40,
          overflowY: 'auto',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <Link href="/" style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#1f2937',
              textDecoration: 'none',
              padding: '12px 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              Home
            </Link>

            {Object.entries(menuItems).map(([label, data]) => (
              <div key={label} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <Link href={data.href} style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#1f2937',
                  textDecoration: 'none',
                  padding: '12px 0',
                  display: 'block'
                }}>
                  {label}
                </Link>
                <div style={{
                  paddingLeft: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  paddingBottom: '12px'
                }}>
                  {Object.entries(data.sections).flatMap(([_, items]) => 
                    items.map(item => (
                      <Link
                        key={item}
                        href={`${data.href}/${item.toLowerCase().replace(/[\s&]/g,'-').replace(/-+/g,'-')}`}
                        style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          textDecoration: 'none'
                        }}
                      >
                        {item}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            ))}

            <Link href="/stories" style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#1f2937',
              textDecoration: 'none',
              padding: '12px 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              Sampada Stories
            </Link>

            {/* Mobile More Dropdown */}
            <MoreDropdownMobile />

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/api/auth/signin" style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 600,
                textDecoration: 'none',
                textAlign: 'center'
              }}>
                Sign In
              </Link>
              <Link href="/cart" style={{
                backgroundColor: '#f3f4f6',
                color: '#1f2937',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 600,
                textDecoration: 'none',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <ShoppingCart size={20} /> Cart
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
