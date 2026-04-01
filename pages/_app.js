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
import { WishlistProvider } from '../components/WishlistSystem';
import { useEffect } from 'react';
import { initializeSampadaFonts } from '../utils/fontLoader';
import dynamic from 'next/dynamic';

// Preload fonts for accurate text measurement (Pretext)
function FontLoader() {
  useEffect(() => {
    initializeSampadaFonts();
  }, []);
  return null;
}

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
                  {/* Font loader for Pretext text measurement */}
                  <FontLoader />
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
                  {/* Dev Tools Panel - Admin/Dev Only */}
                  <DevToolsPanel />
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