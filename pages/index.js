// pages/index.js – Sampada Homepage (Replicated Design)
import React from 'react';
import Head from 'next/head';
import { client } from '../lib/client';

// TEMP: Comment out MegaNavbar to isolate the issue
// import MegaNavbar from '../components/HomePage/MegaNavbar';
import HomeHeroBanner from '../components/HomePage/HomeHeroBanner';
import CollectionsSection from '../components/HomePage/CollectionsSection';
import FeaturedProductsSection from '../components/HomePage/FeaturedProductsSection';
import PromoBanner from '../components/HomePage/PromoBanner';
import SampadaFooter from '../components/HomePage/SampadaFooter';

const Home = ({ products, bannerData }) => {
  return (
    <>
      <Head>
        <title>Sampada – Wear Your Legacy, Prosper In Style</title>
        <meta
          name="description"
          content="Discover Sampada Winter Drop 2026 – premium custom T-shirts, tunics, and lifestyle wear. Inspired by Vedic prosperity, designed for abundance and style."
        />
        <meta property="og:title" content="Sampada – Winter Drop 2026" />
        <meta
          property="og:description"
          content="Wear Your Legacy, Prosper In Style. Shop the Sampada Winter Drop 2026 – 30% off from 01 Feb to 31 Mar 2026."
        />
      </Head>

      {/* ── 1. Navigation ── */}
      {/* TEMP: Using placeholder instead of MegaNavbar */}
      <nav className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-center">
            <p className="text-muted-foreground">Navbar Placeholder - Debugging</p>
          </div>
        </div>
      </nav>

      {/* ── 2. Hero Banner ── */}
      <HomeHeroBanner heroBanner={bannerData} />

      {/* ── 3. Collections ── */}
      <CollectionsSection />

      {/* ── 4. Featured Products ── */}
      <FeaturedProductsSection products={products} />

      {/* ── 5. Promo Banner ── */}
      <PromoBanner />

      {/* ── 6. Footer ── */}
      <SampadaFooter />
    </>
  );
};

export const getServerSideProps = async () => {
  const productQuery = `*[_type == "product"] {
    _id,
    _createdAt,
    name,
    slug,
    image,
    price,
    discount,
    details,
    category->{
      _id,
      name,
      slug
    },
    inventory,
    status
  } | order(_createdAt desc)[0...12]`;
  const bannerQuery = '*[_type == "banner"][0]';

  try {
    const [products, bannerData] = await Promise.all([
      client.fetch(productQuery).catch((err) => {
        console.error('Error fetching products:', err);
        return [];
      }),
      client.fetch(bannerQuery).catch((err) => {
        console.error('Error fetching banner:', err);
        return {};
      }),
    ]);

    console.log(`Fetched ${products?.length || 0} products`);

    return {
      props: {
        products: products || [],
        bannerData: bannerData || {},
      },
    };
  } catch (error) {
    console.error('Data fetch error:', error);
    return {
      props: {
        products: [],
        bannerData: {},
      },
    };
  }
};

export default Home;
