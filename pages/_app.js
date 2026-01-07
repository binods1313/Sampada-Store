// 2. Update your _app.js file to wrap your application with both providers:
// pages/_app.js
import '../styles/globals.css';
import '../styles/product-description.css';
import '../styles/footer-banner-description.css';
import '../styles/About.module.css';
import '../styles/product-variant.css';
import '../styles/ProductCard.css';
import { Layout, ErrorMonitorDemo, TestSuiteNavigator, EnhancedErrorHandlerNavigator, ErrorBoundaryWithFallback, ImageOptimizerTestNavigator } from '../components';
import { OfflineWrapper } from '../components';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import { UIProvider } from '../context/StateContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../components/WishlistSystem';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <ErrorBoundaryWithFallback>
      <SessionProvider session={session}>
        <UIProvider>
          <CartProvider>
            <WishlistProvider>
              <OfflineWrapper>
                <Layout>
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
                  {/* Error Monitor for Development */}
                  <ErrorMonitorDemo />
                  {/* Test Suite Navigator for Development */}
                  <TestSuiteNavigator />
                  {/* Enhanced Error Handler Navigator for Development */}
                  <EnhancedErrorHandlerNavigator />
                  {/* Image Optimizer Test Navigator for Development */}
                  <ImageOptimizerTestNavigator />
                </Layout>
              </OfflineWrapper>
            </WishlistProvider>
          </CartProvider>
        </UIProvider>
      </SessionProvider>
    </ErrorBoundaryWithFallback>
  );
}

export default MyApp;