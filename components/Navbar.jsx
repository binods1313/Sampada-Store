// components/Navbar.jsx - CORRECTED
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineShopping } from 'react-icons/ai';
import { useSession, signIn, signOut } from "next-auth/react";
import { useCartContext } from '../context/CartContext';
import { useUIContext } from '../context/StateContext';
import NeumorphicToggle from './NeumorphicToggle';
import LoginModal from './LoginModal';
import VisualSearch from './VisualSearch';
import styles from './NavbarStyles.module.css';
import { client } from '../lib/client';

const Navbar = () => {
  const { showCart, setShowCart } = useUIContext();
  const { totalQuantities = 0 } = useCartContext();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showStoriesLink, setShowStoriesLink] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Fetch published pages to show in navbar
  useEffect(() => {
    async function checkPublishedPages() {
      try {
        const storiesPage = await client.fetch(`*[_type == "storiesPage"][0]{ _id }`);
        setShowStoriesLink(!!storiesPage);
      } catch (error) {
        console.error('Error checking published pages:', error);
      }
    }
    
    checkPublishedPages();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const userMenuButton = document.querySelector('[class*="userToggleButton"]');
      const userDropdown = document.querySelector('[class*="userDropdown"]');
      
      if (
        isUserDropdownOpen &&
        userDropdown &&
        !userDropdown.contains(event.target) &&
        userMenuButton &&
        !userMenuButton.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserDropdownOpen]);

  return (
    <nav className={styles.navbarContainer}>
      {/* --- Left Section --- */}
      <div className={styles.leftSection}>
        <Link href="/" className={styles.logo}>
          Sampada
        </Link>
        {/* About Us Link */}
        <Link href="/about" className={styles.navLink}>
          About Us
        </Link>
        {/* Sampada Stories Link - shows when published */}
        {showStoriesLink && (
          <Link href="/stories" className={styles.navLink}>
            Sampada Stories
          </Link>
        )}
      </div>

      {/* --- Right Section --- */}
      <div className={styles.rightSection}>
        {/* Neumorphic Dark Mode Toggle - hide when modal is open */}
        <div className={isLoginModalOpen ? styles.hiddenElement : ""}>
          <NeumorphicToggle />
        </div>

        {/* Visual Search */}
        {process.env.NEXT_PUBLIC_FEATURE_VISUAL_SEARCH === 'true' && (
          <VisualSearch />
        )}

        {/* Auth Buttons/Info */}
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
            <div className={styles.userMenuContainer}>
              {/* User Avatar/Name - Clickable Toggle */}
              <button
                className={styles.userToggleButton}
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className={styles.userAvatar}
                  />
                )}
                <span className={styles.userName}>
                  {session.user.name || session.user.email}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className={styles.userDropdown}>
                  <Link href="/account" className={styles.dropdownItem}>
                    📋 My Account
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsUserDropdownOpen(false);
                    }}
                    className={`${styles.dropdownItem} ${styles.signOutItem}`}
                  >
                    🚪 Sign out
                  </button>
                </div>
              )}
            </div>
          )}
          {loading && (
            <span className={styles.loadingText}>Loading...</span>
          )}
        </div>

        {/* Cart Icon - hide when modal is open */}
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

      {/* REMOVED CartSlider from here - it's already in Layout */}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;