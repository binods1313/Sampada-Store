// components/HomePage/MegaNavbar.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, User } from "lucide-react";

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

export default function MegaNavbar() {
  const [activeMenu, setActiveMenu] = useState(null);

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
                        {items.map(item => (
                          <li key={item}>
                            <Link
                              href={`${data.href}/${item.toLowerCase().replace(/[\s&]/g,'-').replace(/-+/g,'-')}`}
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
                        ))}
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

          <Link href="/contact" style={{
            padding: '20px 12px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#1f2937',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}>
            Contact
          </Link>
        </nav>

        {/* RIGHT — Actions */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0
        }}>
          <Link href="/sign-in" style={{
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

      </div>
    </header>
  );
}
