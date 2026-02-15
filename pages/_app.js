// 2. Update your _app.js file to wrap your application with both providers:
// pages/_app.js
import '../styles/globals.css';
import '../styles/product-description.css';
import '../styles/footer-banner-description.css';
import '../styles/About.module.css';
import '../styles/product-variant.css';
import '../styles/ProductCard.css';
import { Layout, ErrorBoundaryWithFallback } from '../components';
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

// Dynamically import development tools to avoid hydration mismatches
const ErrorMonitorDemo = dynamic(
  () => import('../components/ErrorMonitorDemo'),
  { ssr: false }
);

const TestSuiteNavigator = dynamic(
  () => import('../components/TestSuiteNavigator'),
  { ssr: false }
);

const EnhancedErrorHandlerNavigator = dynamic(
  () => import('../components/EnhancedErrorHandlerNavigator'),
  { ssr: false }
);

const ImageOptimizerTestNavigator = dynamic(
  () => import('../components/ImageOptimizerTestNavigator'),
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
                    {/* Development Tools - Dynamically loaded to prevent hydration issues */}
                    <ErrorMonitorDemo />
                    <TestSuiteNavigator />
                    <EnhancedErrorHandlerNavigator />
                    <ImageOptimizerTestNavigator />
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