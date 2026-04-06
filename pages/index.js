// pages/index.js – Sampada Homepage with Revenue Upgrades
import React from 'react';
import Head from 'next/head';
import { SessionProvider, useSession } from 'next-auth/react';
import { client, fetchOptions, longCache } from '../lib/client';
import { logger, logFetchError } from '../lib/logger';
import JsonLd from '../components/JsonLd';
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

      {/* Main content landmark - skip link target */}
      <main id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
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
      </main>
    </>
  );
};

export const getServerSideProps = async () => {
  // GROQ queries with status == "published" filter to exclude drafts
  const productQuery = `*[_type == "product" && status == "published"] {
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

  const bannerQuery = `*[_type == "banner" && defined(desc)][0]{
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

  const categoriesQuery = `*[_type == "category" && defined(slug.current)] {
    _id,
    name,
    slug
  } | order(name asc)`;

  // Fetch options with revalidation
  const productOptions = fetchOptions(3600); // 1 hour revalidation
  const bannerOptions = fetchOptions(1800);  // 30 min revalidation
  const categoriesOptions = longCache();      // 24 hour revalidation (static data)

  try {
    const [products, bannerData, categories] = await Promise.all([
      client.fetch(productQuery, {}, productOptions).catch((err) => {
        logFetchError('homepage:products', err);
        return [];
      }),
      client.fetch(bannerQuery, {}, bannerOptions).catch((err) => {
        logFetchError('homepage:banner', err);
        return {};
      }),
      client.fetch(categoriesQuery, {}, categoriesOptions).catch((err) => {
        logFetchError('homepage:categories', err);
        return [];
      }),
    ]);

    logger.debug('Homepage data fetched successfully', {
      productsCount: products?.length || 0,
      hasBanner: !!bannerData?.desc,
      categoriesCount: categories?.length || 0,
    });

    return {
      props: {
        products: products || [],
        categories: categories || [],
        bannerData: bannerData || {},
      },
    };
  } catch (error) {
    logFetchError('homepage:getServerSideProps', error);
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

