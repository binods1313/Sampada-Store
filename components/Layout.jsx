// components/Layout.jsx
import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import SampadaNavbar from './HomePage/SampadaNavbar';
import Footer from './Footer';
import { useUIContext } from '../context/StateContext';
import { useCartContext } from '../context/CartContext';

// Dynamically import CartSlider
const CartSlider = dynamic(() => import('./CartSlider'), { ssr: false });

// Dynamically import Support Chat Widget (client-side only)
const SupportChatWidget = dynamic(
  () => import('./SupportChatWidget'),
  { ssr: false }
);

// Dynamically import Voice Assistant (client-side only)
const VoiceAssistant = dynamic(
  () => import('./VoiceAssistant/SampadaVoiceButton'),
  { ssr: false }
);

// Pages where the global Navbar and Footer are hidden
const PAGES_WITHOUT_LAYOUT = ['/'];

const Layout = ({ children }) => {
  const { showCart, setShowCart } = useUIContext();
  const { totalQuantities } = useCartContext();
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const hideLayout = PAGES_WITHOUT_LAYOUT.includes(router.pathname);

  // Widget state management for mobile
  const [chatWidgetOpen, setChatWidgetOpen] = useState(false);
  const [voiceWidgetOpen, setVoiceWidgetOpen] = useState(false);
  const [activeWidget, setActiveWidget] = useState(null); // 'chat' | 'voice' | null

  // Handle widget toggle - on mobile, only one widget can be open at a time
  const handleChatToggle = useCallback((isOpen) => {
    setChatWidgetOpen(isOpen);
    if (isOpen) {
      setActiveWidget('chat');
      setVoiceWidgetOpen(false);
    } else {
      setActiveWidget(null);
    }
  }, []);

  const handleVoiceToggle = useCallback((isOpen) => {
    setVoiceWidgetOpen(isOpen);
    if (isOpen) {
      setActiveWidget('voice');
      setChatWidgetOpen(false);
    } else {
      setActiveWidget(null);
    }
  }, []);

  return (
    <div className="layout">
      <Head>
        <title>Sampada Store</title>
      </Head>
      
      {/* Only show global Navbar on non-homepage pages */}
      {!hideLayout && (
        <header>
          <SampadaNavbar
            session={session}
            loading={loading}
            onSignIn={() => window.location.href = '/api/auth/signin'}
            totalQuantities={totalQuantities}
            setShowCart={setShowCart}
            showMarquee={true}
          />
        </header>
      )}
      
      <main className={hideLayout ? '' : 'main-container'}>
        {children}
      </main>
      
      {/* Only show global Footer on non-homepage pages */}
      {!hideLayout && (
        <footer>
          <Footer />
        </footer>
      )}
      
      {/* CartSlider is always available globally */}
      {showCart && <CartSlider isOpen={showCart} />}
      
      {/* AI Widgets - Always available on client side */}
      {/* On mobile (<768px), only one widget shows at a time via activeWidget state */}
      <div className="hidden sm:block">
        {/* Desktop: show both widgets with higher z-index to be above cart */}
        <div className="fixed bottom-4 left-4 z-[1100]" style={{ paddingBottom: 'env(safe-area-inset-bottom)', width: '52px', height: '52px', pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto' }}>
            <SupportChatWidget onToggleOpen={handleChatToggle} />
          </div>
        </div>
        <div className="fixed bottom-4 right-4 z-[1100]" style={{ paddingBottom: 'env(safe-area-inset-bottom)', width: '52px', height: '52px', pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto' }}>
            <VoiceAssistant onToggleOpen={handleVoiceToggle} />
          </div>
        </div>
      </div>
      
      <div className="sm:hidden">
        {/* Mobile: show only the active widget */}
        {activeWidget === 'chat' && <SupportChatWidget onToggleOpen={handleChatToggle} />}
        {activeWidget === 'voice' && <VoiceAssistant onToggleOpen={handleVoiceToggle} />}

        {/* Mobile trigger buttons - show both, but opening one closes the other */}
        {/* Added safe-area-inset support for notched devices */}
        <div
          className="chat-float-btn fixed bottom-4 left-4 z-[1100]"
          style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))', width: '52px', height: '52px' }}
        >
          <button
            onClick={() => {
              if (activeWidget === 'chat') {
                handleChatToggle(false);
              } else {
                handleChatToggle(true);
                handleVoiceToggle(false);
              }
            }}
            className="w-[52px] h-[52px] rounded-full shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #c9a227 0%, #a88620 100%)',
            }}
            aria-label="Open chat"
          >
            <svg className="w-[22px] h-[22px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>

        <div
          className="voice-float-btn fixed bottom-4 right-4 z-[1100]"
          style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))', width: '52px', height: '52px' }}
        >
          <button
            onClick={() => {
              if (activeWidget === 'voice') {
                handleVoiceToggle(false);
              } else {
                handleVoiceToggle(true);
                handleChatToggle(false);
              }
            }}
            className="w-[52px] h-[52px] rounded-full shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #c9a227 0%, #a88620 100%)',
            }}
            aria-label="Open voice assistant"
          >
            <svg className="w-[22px] h-[22px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Layout;
