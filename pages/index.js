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
      {/* SEO Meta Tags */}
      <Head>
        <title>Sampada — Wear Your Legacy, Prosper in Style | Premium Custom Apparel</title>
        <meta name="description" content="Sampada offers premium custom apparel and print-on-demand products with prosperity-inspired designs. Shop t-shirts, hoodies, and more with worldwide shipping." />
        <meta name="keywords" content="custom t-shirts, print on demand, premium apparel, Sampada, custom hoodies, prosperity designs, Indian fashion, sustainable clothing" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="Sampada" />
        <link rel="canonical" href="https://sampada.store" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sampada.store" />
        <meta property="og:title" content="Sampada — Wear Your Legacy, Prosper in Style" />
        <meta property="og:description" content="Premium custom apparel with prosperity-inspired designs. Shop t-shirts, hoodies & more." />
        <meta property="og:image" content="https://sampada.store/og-image.jpg" />
        <meta property="og:site_name" content="Sampada" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://sampada.store" />
        <meta name="twitter:title" content="Sampada — Wear Your Legacy, Prosper in Style" />
        <meta name="twitter:description" content="Premium custom apparel with prosperity-inspired designs." />
        <meta name="twitter:image" content="https://sampada.store/og-image.jpg" />

        {/* JSON-LD Structured Data */}
        <JsonLd
          type="organization"
          data={{
            name: 'Sampada',
            url: 'https://sampada.store',
            logo: 'https://sampada.store/logo.png',
            description: 'Premium custom apparel and print-on-demand products with prosperity-inspired designs.',
            sameAs: [
              'https://www.instagram.com/sampada',
              'https://www.facebook.com/sampada',
            ],
          }}
        />
        <JsonLd
          type="website"
          data={{
            name: 'Sampada Store',
            alternateName: 'Sampada Custom Print',
            url: 'https://sampada.store',
          }}
        />
      </Head>

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
  // GROQ queries - accept both "published" (legacy) and "active" (current schema)
  const productQuery = `*[_type == "product" && status in ["published", "active"]] {
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

