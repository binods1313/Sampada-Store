// pages/wishlist.js
import React from 'react';
import Head from 'next/head';
import { WishlistPage } from '../components/WishlistSystem';

const Wishlist = () => {
  return (
    <>
      <Head>
        <title>My Wishlist - Sampada</title>
        <meta name="description" content="View and manage your saved items in your wishlist" />
      </Head>
      
      <div className="section-light" style={{ minHeight: '100vh', padding: '80px 0' }}>
        <div className="s-container">
          <WishlistPage />
        </div>
      </div>
    </>
  );
};

export default Wishlist;