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
import { DesignerProvider } from '../context/DesignerContext';
import dynamic from 'next/dynamic';

// Dynamically import SampadaVoiceButton to avoid SSR issues with Web Speech API
const SampadaVoiceButton = dynamic(
  () => import('../components/VoiceAssistant/SampadaVoiceButton'),
  { ssr: false }
);

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <ErrorBoundaryWithFallback>
      <SessionProvider session={session}>
        <UIProvider>
          <CartProvider>
            <WishlistProvider>
              <OfflineWrapper>
                <DesignerProvider>
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
                    {/* Sampada AI Voice Assistant */}
                    <SampadaVoiceButton />
                    {/* Development Tools - Only in dev mode */}
                    {process.env.NODE_ENV === 'development' && (
                      <>
                        <ErrorMonitorDemo />
                        <TestSuiteNavigator />
                        <EnhancedErrorHandlerNavigator />
                        <ImageOptimizerTestNavigator />
                      </>
                    )}
                  </Layout>
                </DesignerProvider>
              </OfflineWrapper>
            </WishlistProvider>
          </CartProvider>
        </UIProvider>
      </SessionProvider>
    </ErrorBoundaryWithFallback>
  );
}

export default MyApp;