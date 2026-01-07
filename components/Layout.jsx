//components/Layout.jsx
import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import Navbar from './Navbar.jsx';
import Footer from './Footer';
import { useUIContext } from '../context/StateContext';

// Dynamically import CartSlider
const CartSlider = dynamic(() => import('./CartSlider'), { ssr: false });

const Layout = ({ children }) => {
  const { showCart } = useUIContext();

  return (
    <div className="layout">
      <Head>
        <title>Lumina Store</title>
      </Head>
      <header>
        <Navbar />
      </header>
      <main className="main-container">
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
      {/* Dynamically render CartSlider if needed */}
      {showCart && <CartSlider isOpen={showCart} />}
    </div>
  );
};

export default Layout;
