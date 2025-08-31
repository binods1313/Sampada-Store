// 2. Update your _app.js file to wrap your application with both providers:
// pages/_app.js
import '../styles/globals.css';
import '../styles/product-description.css';
import '../styles/footer-banner-description.css';
import '../styles/About.module.css';
import '../styles/product-variant.css';
import '../styles/ProductCard.css';
import { Layout } from '../components';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import { UIProvider } from '../context/StateContext';
import { CartProvider } from '../context/CartContext';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <UIProvider>
        <CartProvider>
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
          </Layout>
        </CartProvider>
      </UIProvider>
    </SessionProvider>
  );
}

export default MyApp;
