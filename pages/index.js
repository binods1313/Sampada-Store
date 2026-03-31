// pages/index.js – Sampada Homepage with Revenue Upgrades
import React from 'react';
import Head from 'next/head';
import { SessionProvider, useSession } from 'next-auth/react';
import { client } from '../lib/client';
import { CartProvider, useCartContext } from '../context/CartContext';
import { UIProvider, useUIContext } from '../context/StateContext';
import SampadaNavbar from '../components/HomePage/SampadaNavbar';
import HomeHeroBanner from '../components/HomePage/HomeHeroBanner';
import CollectionsSection from '../components/HomePage/CollectionsSection';
import ProductFilterSection from '../components/ProductFilterSection';
import PromoBanner from '../components/HomePage/PromoBanner';
import NewsletterSection from '../components/NewsletterSection';
import SampadaFooter from '../components/HomePage/SampadaFooter';

// NEW: Revenue-boosting components
import TrustStrip from '../components/TrustStrip';
import WhySampada from '../components/WhySampada';

function HomeContent({ products, categories, bannerData }) {
  const { data: session, status } = useSession();
  const { totalQuantities } = useCartContext();
  const { setShowCart } = useUIContext();
  const loading = status === 'loading';

  return (
    <>
      {/* ── 1. Navigation ── */}
      <SampadaNavbar
        session={session}
        loading={loading}
        onSignIn={() => window.location.href = '/api/auth/signin'}
        totalQuantities={totalQuantities}
        setShowCart={setShowCart}
        showMarquee={true}
      />

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

export default function Home(props) {
  return (
    <SessionProvider>
      <UIProvider>
        <CartProvider>
          <HomeContent {...props} />
        </CartProvider>
      </UIProvider>
    </SessionProvider>
  );
}

