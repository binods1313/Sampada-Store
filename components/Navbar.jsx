// components/Navbar.jsx - CORRECTED
import React from 'react';
import Link from 'next/link';
import { AiOutlineShopping } from 'react-icons/ai';
import { useSession, signIn, signOut } from "next-auth/react";
import { useCartContext } from '../context/CartContext';
import { useUIContext } from '../context/StateContext';
import styles from './NavbarStyles.module.css';

const Navbar = () => {
  const { showCart, setShowCart } = useUIContext();
  const { totalQuantities = 0 } = useCartContext();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  
  return (
    <nav className={styles.navbarContainer}>
      {/* --- Left Section --- */}
      <div className={styles.leftSection}>
        <Link href="/" className={styles.logo}>
          Binod Tech Ventures
        </Link>
        {/* About Us Link with proper spacing via CSS */}
        <Link href="/about" className={styles.navLink}>
          About Us
        </Link>
      </div>
      
      {/* --- Right Section --- */}
      <div className={styles.rightSection}>
        {/* Auth Buttons/Info */}
        <div className={styles.authSection}>
          {!session && !loading && (
            <button onClick={() => signIn('github')} className={styles.btnSignin}>
              Sign in with GitHub
            </button>
          )}
          {session?.user && (
            <div className={styles.userInfo}>
              {/* Account Link */}
              <Link href="/account" className={styles.navLink}>
                Account
              </Link>
              {/* User Name with Profile Pic */}
              <span className={styles.userName}>
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className={styles.userAvatar}
                  />
                )}
                {session.user.name || session.user.email}
              </span>
              {/* Sign Out Button */}
              <button onClick={() => signOut()} className={styles.btnSignout}>
                Sign out
              </button>
            </div>
          )}
          {loading && (
            <span className={styles.loadingText}>Loading...</span>
          )}
        </div>
        
        {/* Cart Icon */}
        <button
          className={styles.cartIcon}
          onClick={() => setShowCart(true)}
          aria-label="Open Cart"
        >
          <AiOutlineShopping />
          <span className={styles.cartItemQty}>{totalQuantities}</span>
        </button>
      </div>
      
      {/* REMOVED CartSlider from here - it's already in Layout */}
    </nav>
  );
};

export default Navbar;