// pages/_app.js - DEBUG: Direct imports instead of barrel
import '../styles/globals.css';
// Direct imports to avoid barrel file issues
import Layout from '../components/Layout';
import ErrorBoundaryWithFallback from '../components/ErrorBoundaryWithFallback';
import ErrorMonitorDemo from '../components/ErrorMonitorDemo';
import TestSuiteNavigator from '../components/TestSuiteNavigator';
import EnhancedErrorHandlerNavigator from '../components/EnhancedErrorHandlerNavigator';
import ImageOptimizerTestNavigator from '../components/ImageOptimizerTestNavigator';
import { OfflineWrapper } from '../components/FallbackUI-Examples';
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