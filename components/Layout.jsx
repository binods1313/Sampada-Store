//components/Layout.jsx
import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import Navbar from './Navbar.jsx';
import Footer from './Footer';
import { useUIContext } from '../context/StateContext';

// Dynamically import CartSlider
const CartSlider = dynamic(() => import('./CartSlider'), { ssr: false });

// Pages where the global Navbar and Footer are hidden
// (these pages provide their own nav/footer)
const PAGES_WITHOUT_LAYOUT = ['/'];

const Layout = ({ children }) => {
  const { showCart } = useUIContext();
  const router = useRouter();
  const hideLayout = PAGES_WITHOUT_LAYOUT.includes(router.pathname);

  return (
    <div className="layout">
      <Head>
        <title>Sampada Store</title>
      </Head>
      {/* Only show global Navbar on non-homepage pages */}
      {!hideLayout && (
        <header>
          <Navbar />
        </header>
      )}
      <main className={hideLayout ? '' : 'main-container'}>
        {children}
      </main>
      {/* Only show global Footer on non-homepage pages */}
      {!hideLayout && (
        <footer>
          <Footer />
        </footer>
      )}
      {/* CartSlider is always available globally */}
      {showCart && <CartSlider isOpen={showCart} />}
    </div>
  );
};

export default Layout;
