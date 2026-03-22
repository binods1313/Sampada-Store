// pages/_app.js - DEBUG MINIMAL
import '../styles/globals.css';

// TEMP: Comment out ALL imports to isolate the issue
// import { Layout, ErrorMonitorDemo, TestSuiteNavigator, EnhancedErrorHandlerNavigator, ErrorBoundaryWithFallback, ImageOptimizerTestNavigator } from '../components';
// import { OfflineWrapper } from '../components';
// import { Toaster } from 'react-hot-toast';
// import { SessionProvider } from 'next-auth/react';
// import { UIProvider } from '../context/StateContext';
// import { CartProvider } from '../context/CartContext';
// import { WishlistProvider } from '../components/WishlistSystem';
// import dynamic from 'next/dynamic';

// TEMP: Minimal app
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;