// pages/index.js – Sampada Homepage with Revenue Upgrades
import React from 'react';
import Head from 'next/head';
import { client } from '../lib/client';

// Using direct imports instead of barrel file
import MegaNavbar from '../components/HomePage/MegaNavbar';
import HomeHeroBanner from '../components/HomePage/HomeHeroBanner';
import CollectionsSection from '../components/HomePage/CollectionsSection';
import ProductFilterSection from '../components/ProductFilterSection';
import PromoBanner from '../components/HomePage/PromoBanner';
import NewsletterSection from '../components/NewsletterSection';
import SampadaFooter from '../components/HomePage/SampadaFooter';

// NEW: Revenue-boosting components
import TrustStrip from '../components/TrustStrip';
import WhySampada from '../components/WhySampada';

const Home = ({ products, categories, bannerData }) => {
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

      {/* ── 0. Trust & Urgency Strip (NEW) ── */}
      <TrustStrip />

      {/* ── 1. Navigation ── */}
      <MegaNavbar />

      {/* ── 2. Hero Banner ── */}
      <HomeHeroBanner heroBanner={bannerData} />

      {/* ── 3. Collections ── */}
      <CollectionsSection />

      {/* ── 4. Why Sampada Value Props (NEW) ── */}
      <WhySampada />

      {/* ── 5. Featured Products with Filters ── */}
      <ProductFilterSection
        products={products}
        categories={categories}
        title="Featured Products"
      />

      {/* ── 6. Promo Banner ── */}
      <PromoBanner bannerData={bannerData} />

      {/* ── 7. Newsletter Section ── */}
      <NewsletterSection />

      {/* ── 8. Footer ── */}
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
  } | order(_createdAt desc)[0...24]`;
  
  const bannerQuery = `*[_type == "banner"][0]{
    _id,
    image,
    logo,
    buttonText,
    product,
    desc,
    smallText,
    midText,
    largeText1,
    largeText2,
    discount,
    saleTime
  }`;
  
  const categoriesQuery = `*[_type == "category"] {
    _id,
    name,
    slug
  }`;

  try {
    const [products, bannerData, categories] = await Promise.all([
      client.fetch(productQuery).catch((err) => {
        console.error('Error fetching products:', err);
        return [];
      }),
      client.fetch(bannerQuery).catch((err) => {
        console.error('Error fetching banner:', err);
        return {};
      }),
      client.fetch(categoriesQuery).catch((err) => {
        console.error('Error fetching categories:', err);
        return [];
      }),
    ]);

    // Debug: Log banner data
    console.log('=== BANNER DATA DEBUG ===');
    console.log('bannerData:', bannerData);
    console.log('bannerData.logo:', bannerData?.logo);
    console.log('========================');

    return {
      props: {
        products: products || [],
        categories: categories || [],
        bannerData: bannerData || {},
      },
    };
  } catch (error) {
    console.error('Data fetch error:', error);
    return {
      props: {
        products: [],
        categories: [],
        bannerData: {},
      },
    };
  }
};

export default Home;
