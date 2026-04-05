// pages/_app.js
import '../styles/globals.css';
import '../styles/sampada-brand-global.css'; // Global brand styles
import Layout from '../components/Layout';
import ErrorBoundaryWithFallback from '../components/ErrorBoundaryWithFallback';
import DevToolsPanel from '../components/DevToolsPanel';
import { OfflineWrapper } from '../components/FallbackUI-Examples';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import { UIProvider } from '../context/StateContext';
import { CartProvider } from '../context/CartContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import { WishlistProvider } from '../components/WishlistSystem';
import { useEffect } from 'react';
import { initGA } from '@/lib/analytics';

// Preload fonts for accurate text measurement (Pretext)
// DISABLED: Inter font already loads via Google Fonts in Layout
// function FontLoader() {
//   useEffect(() => {
//     initializeSampadaFonts();
//   }, []);
//   return null;
// }

function MyApp({ Component, pageProps: { session, ...pageProps }, router }) {
  // Initialize GA4 on mount
  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID
    if (gaId) {
      initGA(gaId)
    }
  }, [])

  // Track page views
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: router.asPath,
      })
    }
  }, [router.asPath])

  // Check if this is an admin page
  const isAdminPage = router.pathname.startsWith('/admin')
  
  // Admin pages: NO main site layout wrapper
  if (isAdminPage) {
    return (
      <ErrorBoundaryWithFallback>
        <SessionProvider session={session}>
          <UIProvider>
            <CartProvider>
              <CurrencyProvider>
                <WishlistProvider>
                  <OfflineWrapper>
                    {/* Font loader disabled - Inter loads via Google Fonts */}
                    {/* <FontLoader /> */}
                    <Toaster
                      position="bottom-center"
                      toastOptions={{
                        style: {
                          background: '#333',
                          color: '#fff',
                        }
                      }}
                    />
                    <Component {...pageProps} />
                    {/* Dev Tools Panel - Admin/Dev Only */}
                    <DevToolsPanel />
                  </OfflineWrapper>
                </WishlistProvider>
              </CurrencyProvider>
            </CartProvider>
          </UIProvider>
        </SessionProvider>
      </ErrorBoundaryWithFallback>
    )
  }

  // All other pages: use main site layout
  return (
    <ErrorBoundaryWithFallback>
      <SessionProvider session={session}>
        <UIProvider>
          <CartProvider>
            <CurrencyProvider>
              <WishlistProvider>
                <OfflineWrapper>
                  <Layout>
                    {/* Font loader disabled - Inter loads via Google Fonts */}
                    {/* <FontLoader /> */}
                    <Toaster
                      position="bottom-center"
                      toastOptions={{
                        style: {
                          background: '#333',
                          color: '#fff',
                        }
                      }}
                    />
                    <Component {...pageProps} />
                    {/* Dev Tools Panel - Admin/Dev Only */}
                    <DevToolsPanel />
                  </Layout>
                </OfflineWrapper>
              </WishlistProvider>
            </CurrencyProvider>
          </CartProvider>
        </UIProvider>
      </SessionProvider>
    </ErrorBoundaryWithFallback>
  );
}

export default MyApp;