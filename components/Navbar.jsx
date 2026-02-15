// components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AiOutlineShopping, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';
import { useSession, signIn, signOut } from "next-auth/react";
import { useCartContext } from '../context/CartContext';
import { useUIContext } from '../context/StateContext';
import NeumorphicToggle from './NeumorphicToggle';
import { navData } from './Navbar/navData';
import styles from './NavbarStyles.module.css';

// PERFORMANCE: Dynamic imports for heavy components
// These components are not needed on initial page load
const VisualSearch = dynamic(() => import('./VisualSearch'), {
  ssr: false,
  loading: () => <div style={{ width: '40px', height: '40px', opacity: 0.5 }} />
});

const LoginModal = dynamic(() => import('./LoginModal'), {
  ssr: false
});

const Navbar = () => {
  const { showCart, setShowCart } = useUIContext();
  const { totalQuantities = 0 } = useCartContext();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // CRITICAL: Placeholder must match final structure EXACTLY to prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className={styles.navbarContainer}>
        <button className={styles.mobileMenuBtn} aria-label="Menu">
          <AiOutlineMenu />
        </button>
        <div className={styles.leftSection}>
          <Link href="/" className={styles.logo}>
            Sampada
          </Link>
        </div>
        <div className={styles.centerSection}>
          <div className={styles.navItem}>
            <Link href="/" className={styles.navLink}>Home</Link>
          </div>
          {navData.map((item, index) => (
            <div key={index} className={styles.navItem}>
              <Link href={item.link} className={styles.navLink}>
                {item.title} <BiChevronDown />
              </Link>
            </div>
          ))}
          <div className={styles.navItem}>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
          </div>
        </div>
        <div className={styles.rightSection}>
          {/* NeumorphicToggle placeholder - exact dimensions */}
          <div style={{ width: '64px', height: '32px', opacity: 0.5 }} />
          {/* VisualSearch placeholder - only if feature enabled */}
          {process.env.NEXT_PUBLIC_FEATURE_VISUAL_SEARCH === 'true' && (
            <div style={{ width: '40px', height: '40px', opacity: 0.5 }} />
          )}
          <div className={styles.authSection}>
            <button className={styles.btnSignin} disabled style={{ opacity: 0.7 }}>
              Sign in
            </button>
          </div>
          <button className={styles.cartIcon} aria-label="Cart" disabled>
            <AiOutlineShopping />
            <span className={styles.cartItemQty}>0</span>
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className={styles.navbarContainer}>
      {/* Mobile Menu Button - Left */}
      <button
        className={styles.mobileMenuBtn}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
      </button>

      {/* --- Left Section (Logo) --- */}
      <div className={styles.leftSection}>
        <Link href="/" className={styles.logo}>
          Sampada
        </Link>
      </div>

      {/* --- Center Section (Nav Links) --- */}
      <div className={`${styles.centerSection} ${isMobileMenuOpen ? styles.mobileNavOpen : ''}`}>
        <div className={styles.navItem}>
          <Link href="/" className={styles.navLink}>Home</Link>
        </div>

        {navData.map((item, index) => (
          <div key={index} className={styles.navItem}>
            <Link href={item.link} className={styles.navLink}>
              {item.title} <BiChevronDown />
            </Link>
            <div className={styles.dropdown}>
              {item.subcategories.map((sub, idx) => (
                <Link key={idx} href={sub.link} className={styles.dropdownItem}>
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className={styles.navItem}>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
        </div>
      </div>

      {/* --- Right Section --- */}
      <div className={styles.rightSection}>
        {/* Neumorphic Dark Mode Toggle */}
        <div className={isLoginModalOpen ? styles.hiddenElement : ""}>
          <NeumorphicToggle />
        </div>

        {/* Visual Search - check feature flag once */}
        {process.env.NEXT_PUBLIC_FEATURE_VISUAL_SEARCH === 'true' && (
          <VisualSearch />
        )}

        {/* Auth Buttons */}
        <div className={styles.authSection}>
          {!session && !loading && (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className={isLoginModalOpen ? `${styles.btnSignin} ${styles.hiddenElement}` : styles.btnSignin}
            >
              Sign in
            </button>
          )}
          {session?.user && (
            <div className={styles.userInfo}>
              <Link href="/account" className={styles.navLink}>
                Account
              </Link>
              <span className={styles.userName}>
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className={styles.userAvatar}
                  />
                )}
              </span>
              <button onClick={() => signOut()} className={styles.btnSignout}>
                Out
              </button>
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <div className={isLoginModalOpen ? styles.hiddenElement : ""}>
          <button
            className={styles.cartIcon}
            onClick={() => setShowCart(true)}
            aria-label="Open Cart"
          >
            <AiOutlineShopping />
            <span className={styles.cartItemQty}>{totalQuantities}</span>
          </button>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;