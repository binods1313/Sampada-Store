// pages/wishlist.js
import React from 'react';
import Head from 'next/head';
import { WishlistPage } from '../components/WishlistSystem';

const Wishlist = () => {
  return (
    <>
      <Head>
        <title>My Wishlist - AbsCommerce</title>
        <meta name="description" content="View and manage your saved items in your wishlist" />
      </Head>
      
      <div className="main-container">
        <WishlistPage />
      </div>
    </>
  );
};

export default Wishlist;