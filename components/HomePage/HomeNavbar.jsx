// components/HomePage/HomeNavbar.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import { AiOutlineShopping } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import { useCartContext } from '../../context/CartContext';
import { useUIContext } from '../../context/StateContext';
import LoginModal from '../LoginModal';
import styles from './HomeNavbar.module.css';

const HomeNavbar = () => {
  const { setShowCart } = useUIContext();
  const { totalQuantities = 0 } = useCartContext();
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: "Men's Clothing", href: '/collections/mens-tshirts' },
    { label: "Women's Clothing", href: '/collections/womens-tshirts' },
    { label: 'His & Hers', href: '/collections/his-hers' },
    { label: 'Home & Living', href: '/collections/home-living' },
    { label: 'Sampada Stories', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          Sampada
        </Link>

        {/* Desktop Nav Links */}
        <ul className={styles.navLinks}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className={styles.actions}>
          {/* Sign In / User */}
          {!session && !loading && (
            <button
              className={styles.signInBtn}
              onClick={() => setIsLoginModalOpen(true)}
            >
              Sign In
            </button>
          )}
          {session?.user && (
            <Link href="/account" className={styles.navLink}>
              {session.user.name || 'Account'}
            </Link>
          )}

          {/* Cart */}
          <button
            className={styles.cartBtn}
            onClick={() => setShowCart(true)}
            aria-label="Open Cart"
          >
            <AiOutlineShopping />
            {totalQuantities > 0 && (
              <span className={styles.cartCount}>{totalQuantities}</span>
            )}
          </button>

          {/* Mobile Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!session && (
            <button
              className={styles.signInBtn}
              onClick={() => {
                setMobileMenuOpen(false);
                setIsLoginModalOpen(true);
              }}
            >
              Sign In
            </button>
          )}
        </div>
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </nav>
  );
};

export default HomeNavbar;
