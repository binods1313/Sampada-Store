// pages/_app.js - DEBUG: Adding back ALL original providers
import '../styles/globals.css';
import { Layout, ErrorMonitorDemo, TestSuiteNavigator, EnhancedErrorHandlerNavigator, ErrorBoundaryWithFallback, ImageOptimizerTestNavigator } from '../components';
import { OfflineWrapper } from '../components';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import { UIProvider } from '../context/StateContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../components/WishlistSystem';
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