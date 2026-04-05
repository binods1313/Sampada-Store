/**
 * Sampada Store - Onyx AI Chat Widget
 * 
 * Embeds Onyx AI assistant into Sampada storefront for:
 * - Product search and recommendations
 * - Customer support (order status, returns, shipping)
 * - Technical product questions
 * 
 * Usage:
 * 1. Add <OnyxChatWidget /> to Layout.jsx
 * 2. Configure ONYX_API_URL in .env.local
 * 3. Choose persona: 'product-expert' or 'support-agent'
 */

import { useEffect, useRef, useState } from 'react';

// Configuration - move to .env.local
const ONYX_CONFIG = {
  apiUrl: process.env.NEXT_PUBLIC_ONYX_API_URL || 'http://localhost:3000',
  personaId: process.env.NEXT_PUBLIC_ONYX_PERSONA_ID || 'sampada-product-expert',
  theme: {
    primaryColor: '#6366F1', // Indigo - matches Sampada branding
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    borderRadius: '12px',
  },
};

/**
 * Onyx Chat Widget Component
 * 
 * Embeds a floating chat button that opens Onyx AI assistant.
 * Supports two modes:
 * - Product Expert: Helps customers find products
 * - Support Agent: Handles order inquiries, returns, shipping
 */
export default function OnyxChatWidget({ 
  persona = 'product-expert',
  position = 'bottom-right',
  autoOpen = false,
  welcomeMessage = 'Hi! How can I help you find the perfect tech product today?' 
}) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [isLoaded, setIsLoaded] = useState(false);
  const widgetRef = useRef(null);
  const iframeRef = useRef(null);

  // Position styles
  const positionStyles = {
    'bottom-right': { bottom: '24px', right: '24px' },
    'bottom-left': { bottom: '24px', left: '24px' },
    'top-right': { top: '24px', right: '24px' },
    'top-left': { top: '24px', left: '24px' },
  };

  // Load Onyx embed script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.src = `${ONYX_CONFIG.apiUrl}/embed/chat.js`;
    script.async = true;
    script.dataset.personaId = persona;
    script.dataset.theme = JSON.stringify(ONYX_CONFIG.theme);
    
    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = (error) => {
      console.error('[Onyx] Failed to load chat widget:', error);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [persona]);

  // Auto-open on first visit
  useEffect(() => {
    if (autoOpen && isLoaded) {
      const hasVisited = localStorage.getItem('sampada-onyx-visited');
      if (!hasVisited) {
        setIsOpen(true);
        localStorage.setItem('sampada-onyx-visited', 'true');
      }
    }
  }, [autoOpen, isLoaded]);

  // Handle messages from Onyx iframe
  useEffect(() => {
    const handleMessage = (event) => {
      // Verify origin
      if (!event.origin.includes(ONYX_CONFIG.apiUrl)) return;

      const { type, data } = event.data;

      switch (type) {
        case 'product-selected':
          // User clicked a product recommendation
          console.log('[Onyx] Product selected:', data);
          // Could trigger navigation or analytics
          break;

        case 'order-inquiry':
          // User asked about order status
          console.log('[Onyx] Order inquiry:', data);
          break;

        case 'cart-add':
          // User wants to add product to cart
          console.log('[Onyx] Add to cart:', data);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div
      ref={widgetRef}
      style={{
        position: 'fixed',
        ...positionStyles[position],
        zIndex: 9999,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Chat Window */}
      {isOpen && isLoaded && (
        <div
          style={{
            width: '380px',
            height: '600px',
            borderRadius: ONYX_CONFIG.theme.borderRadius,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            backgroundColor: ONYX_CONFIG.theme.backgroundColor,
            marginBottom: '12px',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: `linear-gradient(135deg, ${ONYX_CONFIG.theme.primaryColor}, #8B5CF6)`,
              color: 'white',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
                Sampada AI Assistant
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '12px', opacity: 0.9 }}>
                {persona === 'support-agent' ? 'Support Team' : 'Product Expert'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              ×
            </button>
          </div>

          {/* Onyx Embed Container */}
          <div
            id="onyx-chat-embed"
            ref={iframeRef}
            style={{
              height: 'calc(100% - 70px)',
              width: '100%',
            }}
          />
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${ONYX_CONFIG.theme.primaryColor}, #8B5CF6)`,
          border: 'none',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 30px rgba(99, 102, 241, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)';
        }}
        aria-label="Open AI Assistant"
      >
        {isOpen ? '×' : '💬'}
      </button>

      {/* Welcome Tooltip */}
      {!isOpen && isLoaded && welcomeMessage && (
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            right: position.includes('right') ? '0' : 'auto',
            left: position.includes('left') ? '0' : 'auto',
            backgroundColor: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            maxWidth: '250px',
            fontSize: '13px',
            color: ONYX_CONFIG.theme.textColor,
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          {welcomeMessage}
          <div
            style={{
              position: 'absolute',
              bottom: '-6px',
              right: position.includes('right') ? '24px' : 'auto',
              left: position.includes('left') ? '24px' : 'auto',
              width: '12px',
              height: '12px',
              backgroundColor: 'white',
              transform: 'rotate(45deg)',
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Product Search Bar Component
 * 
 * Adds AI-powered search bar to product listing pages.
 * Uses Onyx RAG to understand natural language queries.
 */
export function ProductSearchBar({ onSearch, placeholder = 'Search products naturally... e.g., "headphones under $100 with good bass"' }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);

    try {
      const response = await fetch(`${ONYX_CONFIG.apiUrl}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Find products matching: ${query}`,
          persona_id: ONYX_CONFIG.personaId,
          return_sources: true,
        }),
      });

      const data = await response.json();
      
      // Extract product recommendations from Onyx response
      const products = data.sources?.map(source => ({
        id: source.metadata?.product_id,
        name: source.title,
        price: source.metadata?.price,
        url: source.link,
      })) || [];

      onSearch?.({ query, products, aiResponse: data.answer });
    } catch (error) {
      console.error('[Onyx] Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '14px 20px',
          paddingRight: '50px',
          borderRadius: '24px',
          border: '2px solid #E5E7EB',
          fontSize: '15px',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => (e.target.style.borderColor = ONYX_CONFIG.theme.primaryColor)}
        onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
      />
      <button
        type="submit"
        disabled={isSearching || !query.trim()}
        style={{
          position: 'absolute',
          right: '6px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: ONYX_CONFIG.theme.primaryColor,
          border: 'none',
          color: 'white',
          cursor: isSearching || !query.trim() ? 'not-allowed' : 'pointer',
          opacity: isSearching || !query.trim() ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
        }}
      >
        {isSearching ? '⏳' : '🔍'}
      </button>
    </form>
  );
}
