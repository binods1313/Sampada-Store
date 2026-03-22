// pages/_app.js - DEBUG: Adding back providers one by one
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import { UIProvider } from '../context/StateContext';
import { CartProvider } from '../context/CartContext';

// TEMP: Comment out problematic ones
// import { Layout, ErrorMonitorDemo, TestSuiteNavigator, EnhancedErrorHandlerNavigator, ErrorBoundaryWithFallback, ImageOptimizerTestNavigator } from '../components';
// import { OfflineWrapper } from '../components';
// import { WishlistProvider } from '../components/WishlistSystem';
// import dynamic from 'next/dynamic';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <UIProvider>
        <CartProvider>
          <Toaster position="bottom-center" />
          <Component {...pageProps} />
        </CartProvider>
      </UIProvider>
    </SessionProvider>
  );
}

export default MyApp;