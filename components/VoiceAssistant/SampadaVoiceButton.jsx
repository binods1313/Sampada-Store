/**
 * Sampada Voice Assistant - Full AI Integration
 * 
 * Features:
 * - Speech-to-text using Web Speech API
 * - AI brain using useAIGeneration (Tier 3 - Llama 8B for speed)
 * - Text-to-speech using Web Speech Synthesis API
 * - Product search by voice intent detection
 * - Customer support routing via useSupportChat
 * - Store navigation by voice
 * - Order/cart integration by voice
 * - Animated waveform/pulse when listening
 * - Status states: idle → listening → processing → speaking
 * - Emil design polish with smooth transitions
 * - WCAG 2.1 AA accessibility with keyboard fallbacks
 * - Mobile-first responsive design
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAIGeneration } from '@/hooks/useAI';
import { useSupportChat } from '@/hooks/useAI';
import { useCartContext } from '@/context/CartContext';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ShoppingCart,
  Search,
  MessageCircle,
  Navigation,
} from 'lucide-react';

// Intent detection patterns - simplified for better matching
const INTENT_PATTERNS = {
  // Product search intents - match "find X", "search for X", "show me X", etc.
  search: [
    /\b(?:find|search|look for|show me|i want|i need)\s+(.+?)\b/i,
    /\bdo you have\s+(.+?)\b/i,
    /\b(?:men|women|kids|boys|girls)\s+(.+?)\b/i, // e.g., "men's t-shirts"
  ],
  
  // Navigation intents
  navigate: [
    /\b(?:go to|open|take me to|navigate to)\s+(cart|checkout|collections|products|home|account|wishlist|contact|about)\b/i,
    /\b(?:show|open)\s+(cart|home|collections|products|account)\b/i,
  ],
  
  // Order/Cart intents
  order: [
    /\b(?:add to cart|buy|order|purchase)\s*(?:this|the)?\s*(.+?)?\b/i,
    /\bi want to (?:buy|order)\s+(.+?)\b/i,
  ],
  
  // Customer support intents - keywords trigger support routing
  support: [
    /\b(?:order|shipping|return|refund|track|delivery|help|support|contact|question|problem|issue)\b/i,
    /\b(?:where['\s]*is my|status of|track my)\s*(?:order)?\b/i,
  ],
};

// Navigation route mapping
const NAVIGATION_ROUTES = {
  'cart': '/cart',
  'checkout': '/cart', // Go to cart first
  'collections': '/collections',
  'products': '/products',
  'product': '/products',
  'home': '/',
  'account': '/account',
  'wishlist': '/wishlist',
  'contact': '/contact',
  'about': '/about',
};

// Route confirmation messages
const ROUTE_CONFIRMATIONS = {
  '/cart': 'Taking you to your cart',
  '/collections': 'Opening our collections page',
  '/products': 'Showing all products',
  '/account': 'Opening your account',
  '/wishlist': 'Taking you to your wishlist',
  '/contact': 'Opening contact page',
  '/about': 'Taking you to our about page',
};

const SampadaVoiceButton = ({ onToggleOpen }) => {
  const router = useRouter();
  const { onAdd } = useCartContext();

  // Hardcoded brand colors - NO CSS VARIABLES
  const COLORS = {
    gold: '#C9A227',
    goldMuted: '#B8941F',
    maroon: '#8B0000',
    maroonDark: '#6B0000',
    dark: '#1A1A1A',
    darkCard: '#1E1E2E',
    textLight: '#F5F0E8',
    textMuted: '#9E9E9E',
    border: 'rgba(201, 162, 39, 0.4)',
  };

  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // Notify parent of state change
  useEffect(() => {
    onToggleOpen?.(isOpen);
  }, [isOpen, onToggleOpen]);
  
  // Conversation state
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);
  
  // Support chat for customer service queries
  const { sendMessage: sendSupportMessage } = useSupportChat();
  
  // AI Generation (using Tier 3 for fast voice responses)
  const { generate: generateAI, loading: aiLoading } = useAIGeneration({
    tier: 3, // Llama 8B for speed
    temperature: 0.7,
  });

  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const messagesRef = useRef([]);

  // Initialize Speech APIs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthesisRef.current = window.speechSynthesis;

      // Check for Speech Recognition support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Indian English

        recognition.onstart = () => {
          setStatus('listening');
        };

        recognition.onresult = (event) => {
          const currentTranscript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          setTranscript(currentTranscript);

          if (event.results[0].isFinal) {
            handleVoiceInput(currentTranscript);
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setStatus('idle');
          
          if (event.error === 'not-allowed') {
            toast.error('Microphone access denied. Please enable microphone permissions.');
          } else if (event.error === 'no-speech') {
            toast('No speech detected. Try again!', { icon: '🎤' });
          }
        };

        recognition.onend = () => {
          if (status === 'listening') {
            setStatus('idle');
          }
        };

        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
        toast.error('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
      // Cleanup pending order state
      if (awaitingConfirmation) {
        setAwaitingConfirmation(false);
        setPendingProduct(null);
      }
    };
  }, [status, awaitingConfirmation]);

  // Cleanup pending order when widget is closed
  useEffect(() => {
    if (!isOpen && awaitingConfirmation) {
      setAwaitingConfirmation(false);
      setPendingProduct(null);
    }
  }, [isOpen, awaitingConfirmation]);

  // Text-to-Speech with female voice
  const speak = useCallback((text, onEnd) => {
    if (!synthesisRef.current || isMuted) {
      onEnd?.();
      return;
    }

    synthesisRef.current.cancel();
    setStatus('speaking');

    const utterance = new SpeechSynthesisUtterance(text);

    // Select best available voice (prefer female, English)
    const voices = synthesisRef.current.getVoices();
    const preferredVoice = voices.find(voice =>
      (voice.name.includes('Zira') || // Windows female
       voice.name.includes('Samantha') || // Mac female
       voice.name.includes('Google') || // Google voices
       voice.name.toLowerCase().includes('female')) &&
      voice.lang.startsWith('en')
    ) || voices.find(voice => voice.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setStatus('idle');
      onEnd?.();
    };

    utterance.onerror = () => {
      setStatus('idle');
      onEnd?.();
    };

    synthesisRef.current.speak(utterance);
  }, [isMuted]);

  // Detect intent from transcript
  const detectIntent = useCallback((text) => {
    // Check search intent
    for (const pattern of INTENT_PATTERNS.search) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return { type: 'search', query: match[1].trim() };
      }
    }

    // Check navigation intent
    for (const pattern of INTENT_PATTERNS.navigate) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const destination = match[1].toLowerCase();
        const route = NAVIGATION_ROUTES[destination];
        if (route) {
          return { type: 'navigate', route, destination };
        }
      }
    }

    // Check order/cart intent
    for (const pattern of INTENT_PATTERNS.order) {
      const match = text.match(pattern);
      if (match) {
        const productName = match[1]?.trim() || '';
        return { type: 'order', productName };
      }
    }

    // Check support intent
    for (const pattern of INTENT_PATTERNS.support) {
      if (pattern.test(text)) {
        return { type: 'support', query: text };
      }
    }

    // Default to general chat
    return { type: 'chat', query: text };
  }, []);

  // Search products by keyword
  const searchProducts = useCallback(async (query) => {
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search failed');
      
      const data = await res.json();
      const products = data.products || data.results || [];

      if (products.length === 0) {
        return {
          text: `I couldn't find any products matching "${query}". Would you like to try a different search term?`,
          products: [],
        };
      }

      const topProducts = products.slice(0, 3);
      const productList = topProducts
        .map((p, i) => `${i + 1}. ${p.name}${p.price ? ` - ₹${p.price}` : ''}`)
        .join('. ');

      return {
        text: `I found ${products.length} products. Here are the top 3: ${productList}. Would you like me to add any of these to your cart or take you to the products page?`,
        products: topProducts,
      };
    } catch (error) {
      console.error('Product search error:', error);
      return {
        text: `I found some products matching "${query}". Let me show you the results.`,
        products: [],
        fallback: true,
      };
    }
  }, []);

  // Handle voice input - main processing function
  const handleVoiceInput = useCallback(async (text) => {
    if (!text.trim()) return;

    setTranscript(text);
    setStatus('processing');

    try {
      const intent = detectIntent(text);
      console.log('Detected intent:', intent);

      switch (intent.type) {
        case 'search': {
          const result = await searchProducts(intent.query);
          setResponse(result.text);
          speak(result.text);
          
          if (result.fallback) {
            // Navigate to search page
            setTimeout(() => {
              router.push(`/products/search?q=${encodeURIComponent(intent.query)}`);
            }, 1500);
          }
          break;
        }

        case 'navigate': {
          const confirmation = ROUTE_CONFIRMATIONS[intent.route] || `Taking you to ${intent.destination}`;
          setResponse(confirmation);
          speak(confirmation, () => {
            router.push(intent.route);
          });
          break;
        }

        case 'order': {
          if (awaitingConfirmation && pendingProduct) {
            // Confirm the order
            const confirmText = text.toLowerCase();
            if (confirmText.includes('yes') || confirmText.includes('sure') || confirmText.includes('ok')) {
              onAdd(pendingProduct, 1);
              const successMsg = `Added ${pendingProduct.name} to your cart!`;
              setResponse(successMsg);
              speak(successMsg);
              setAwaitingConfirmation(false);
              setPendingProduct(null);
            } else {
              const cancelMsg = 'Okay, I won\'t add it to your cart.';
              setResponse(cancelMsg);
              speak(cancelMsg);
              setAwaitingConfirmation(false);
              setPendingProduct(null);
            }
          } else {
            // Need to find the product first
            const searchResult = await searchProducts(intent.productName);
            
            if (searchResult.products.length > 0) {
              const product = searchResult.products[0];
              setPendingProduct(product);
              const confirmMsg = `I found ${product.name}${product.price ? ` for ₹${product.price}` : ''}. Would you like me to add it to your cart?`;
              setResponse(confirmMsg);
              speak(confirmMsg);
              setAwaitingConfirmation(true);
            } else {
              const notFoundMsg = `I couldn't find "${intent.productName}". Could you try a different product name?`;
              setResponse(notFoundMsg);
              speak(notFoundMsg);
            }
          }
          break;
        }

        case 'support': {
          // Use support chat for customer service queries
          const supportResponse = await sendSupportMessage(intent.query);
          setResponse(supportResponse);
          speak(supportResponse);
          break;
        }

        case 'chat':
        default: {
          // Use general AI for other queries
          const aiResponse = await generateAI('chat', text, {
            context: 'You are Sampada, a friendly e-commerce shopping assistant. Keep responses concise (1-2 sentences) for voice interaction.',
          });
          setResponse(aiResponse);
          speak(aiResponse);
          break;
        }
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      const errorMsg = "I'm sorry, I couldn't process that. Could you try again?";
      setResponse(errorMsg);
      speak(errorMsg);
      toast.error('Voice processing failed');
    }
  }, [detectIntent, searchProducts, generateAI, sendSupportMessage, speak, router, onAdd, awaitingConfirmation, pendingProduct]);

  // Start listening
  const startListening = useCallback(() => {
    if (recognitionRef.current && status === 'idle') {
      setTranscript('');
      setResponse('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Recognition start error:', e);
      }
    }
  }, [status]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setStatus('idle');
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    toast.success(isMuted ? 'Sound enabled' : 'Sound muted');
  }, [isMuted]);

  // Quick actions
  const quickActions = [
    { label: "Men's T-shirts", icon: Search, text: "Show me men's t-shirts", type: 'search' },
    { label: 'What\'s on sale?', icon: Sparkles, text: "What's on sale?", type: 'search' },
    { label: 'Track order', icon: MessageCircle, text: 'Track my order', type: 'support' },
    { label: 'Go to cart', icon: ShoppingCart, text: 'Go to cart', type: 'navigate' },
  ];

  const handleQuickAction = useCallback((action) => {
    handleVoiceInput(action.text);
  }, [handleVoiceInput]);

  if (!isSupported) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 flex flex-col items-center"
      style={{ 
        transition: 'all 200ms cubic-bezier(0.23, 1, 0.32, 1)',
      }}
      aria-label="Voice assistant"
    >
      {/* Main Panel */}
      {isOpen && (
        <div 
          className="mb-3 w-[90vw] sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
          style={{
            maxHeight: 'min(600px, 80vh)',
            transform: 'translateY(0) scale(1)',
            opacity: 1,
            transition: 'transform 250ms cubic-bezier(0.23, 1, 0.32, 1), opacity 250ms cubic-bezier(0.23, 1, 0.32, 1)',
            animation: 'slideIn 250ms cubic-bezier(0.23, 1, 0.32, 1)',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="voice-assistant-title"
        >
          {/* Header - Sampada Gold Gradient */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{
              background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldMuted} 100%)`,
            }}
          >
            <div className="flex items-center gap-3">
              {/* Voice Avatar */}
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl">👩‍💼</span>
              </div>
              <div>
                <h3 id="voice-assistant-title" className="font-semibold text-white text-sm">
                  Sampada Voice
                </h3>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {status === 'listening' ? 'Listening…' : status === 'speaking' ? 'Speaking…' : 'Tap to speak'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ color: 'rgba(255,255,255,0.8)' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMute();
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                }}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ color: 'rgba(255,255,255,0.8)' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsOpen(false);
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                }}
                aria-label="Close voice assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4" style={{ backgroundColor: '#faf9f7' }}>
            {/* Status Indicator */}
            <div className="min-h-[80px] flex items-center justify-center mb-4" role="status" aria-live="polite">
              {status === 'listening' && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-2" aria-hidden="true">
                    <span className="w-1.5 h-8 rounded-full animate-bounce" style={{ backgroundColor: COLORS.gold, animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-8 rounded-full animate-bounce" style={{ backgroundColor: COLORS.gold, animationDelay: '100ms' }}></span>
                    <span className="w-1.5 h-8 rounded-full animate-bounce" style={{ backgroundColor: COLORS.gold, animationDelay: '200ms' }}></span>
                    <span className="w-1.5 h-8 rounded-full animate-bounce" style={{ backgroundColor: COLORS.gold, animationDelay: '300ms' }}></span>
                    <span className="w-1.5 h-8 rounded-full animate-bounce" style={{ backgroundColor: COLORS.gold, animationDelay: '400ms' }}></span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: COLORS.gold }}>Listening…</p>
                </div>
              )}

              {status === 'processing' && (
                <div className="text-center">
                  <div className="relative w-12 h-12 mx-auto mb-2" aria-hidden="true">
                    <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: `${COLORS.gold}30` }}></div>
                    <div className="absolute inset-0 rounded-full border-2 border-t-2 animate-spin" style={{ borderColor: `${COLORS.gold}30`, borderTopColor: COLORS.gold }}></div>
                  </div>
                  <p className="text-sm font-medium" style={{ color: COLORS.gold }}>Thinking…</p>
                </div>
              )}

              {status === 'speaking' && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mx-auto mb-2" aria-hidden="true">
                    <span className="w-1 h-4 rounded-full animate-pulse" style={{ backgroundColor: COLORS.gold, animationDelay: '0ms' }}></span>
                    <span className="w-1 h-6 rounded-full animate-pulse" style={{ backgroundColor: COLORS.gold, animationDelay: '100ms' }}></span>
                    <span className="w-1 h-4 rounded-full animate-pulse" style={{ backgroundColor: COLORS.gold, animationDelay: '200ms' }}></span>
                    <span className="w-1 h-6 rounded-full animate-pulse" style={{ backgroundColor: COLORS.gold, animationDelay: '300ms' }}></span>
                    <span className="w-1 h-4 rounded-full animate-pulse" style={{ backgroundColor: COLORS.gold, animationDelay: '400ms' }}></span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: COLORS.gold }}>Speaking…</p>
                </div>
              )}

              {status === 'idle' && (
                <div className="text-center">
                  <p className="text-base mb-1" style={{ color: '#374151' }}>👋 Hi! How can I help you today?</p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>Tap the microphone and start speaking</p>
                </div>
              )}
            </div>

            {/* Transcript Display */}
            {transcript && (
              <div
                className="p-3 rounded-xl mb-3 text-sm"
                style={{ backgroundColor: '#f3f4f6' }}
                aria-label="Your speech"
              >
                <strong style={{ color: COLORS.gold }}>You:</strong> {transcript}
              </div>
            )}

            {/* Response Display */}
            {response && (
              <div
                className="p-3 rounded-xl mb-4 text-sm"
                style={{ backgroundColor: `${COLORS.gold}15` }}
                aria-label="Assistant response"
              >
                <strong style={{ color: COLORS.goldMuted }}>Sampada:</strong> {response}
              </div>
            )}

            {/* Voice Control Button - Gold Gradient */}
            <button
              className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 active:scale-98 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                background: status === 'listening'
                  ? `linear-gradient(135deg, #ef4444 0%, #dc2626 100%)`
                  : `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldMuted} 100%)`,
                boxShadow: isHovering
                  ? `0 6px 20px ${COLORS.gold}80`
                  : `0 4px 14px ${COLORS.gold}60`,
              }}
              onClick={status === 'listening' ? stopListening : startListening}
              disabled={status === 'speaking'}
              aria-label={status === 'listening' ? 'Stop listening' : 'Start listening'}
              aria-pressed={status === 'listening'}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {status === 'listening' ? (
                <>
                  <MicOff className="w-6 h-6 animate-pulse" aria-hidden="true" />
                  <span>Tap to stop</span>
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6" aria-hidden="true" />
                  <span>{status === 'idle' ? 'Tap to speak' : status === 'processing' ? 'Processing…' : 'Speaking…'}</span>
                </>
              )}
            </button>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
              <p className="text-xs font-medium mb-2" style={{ color: '#6b7280' }}>Quick Actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(action)}
                    disabled={status !== 'idle'}
                    className="px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      borderColor: `${COLORS.gold}40`,
                      color: COLORS.goldMuted,
                      backgroundColor: '#fff',
                    }}
                    onMouseEnter={(e) => {
                      if (status === 'idle') {
                        e.currentTarget.style.backgroundColor = COLORS.gold;
                        e.currentTarget.style.color = '#1A1A1A';
                        e.currentTarget.style.borderColor = COLORS.gold;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fff';
                      e.currentTarget.style.color = COLORS.goldMuted;
                      e.currentTarget.style.borderColor = `${COLORS.gold}40`;
                    }}
                  >
                    <action.icon className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button - Positioned ABOVE chat widget */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        style={{
          position: 'fixed',
          bottom: '84px',
          right: '24px',
          zIndex: 9998,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldMuted} 100%)`,
          border: `2px solid ${COLORS.border}`,
          boxShadow: isHovering
            ? `0 0 12px ${COLORS.gold}80`
            : `0 4px 14px ${COLORS.gold}40`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        aria-label={isOpen ? 'Close voice assistant' : 'Open voice assistant'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X style={{ width: '20px', height: '20px', color: 'white' }} />
        ) : (
          <Mic style={{ width: '20px', height: '20px', color: COLORS.gold }} />
        )}
      </button>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SampadaVoiceButton;
