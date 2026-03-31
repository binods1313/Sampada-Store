/**
 * SupportChatWidget - Minimalist Rebuild
 * HARDCODED colors only - NO CSS variables
 * 
 * Features:
 * - Pretext-powered 60fps message height calculation
 * - Zero layout shift during AI streaming
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSupportChat } from '@/hooks/useAI';
import { MessageCircle, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDebouncedTextHeight } from '../hooks/usePretext';

// Hardcoded brand colors - NO CSS VARIABLES
const COLORS = {
  bgDark: '#1E1E2E',
  bgDarker: '#13131F',
  gold: '#C9A227',
  goldLight: '#F0C93A',
  textWhite: '#F5F0E8',
  textMuted: '#9E9E9E',
  userBubble: '#8B0000',
  botBubble: '#2A2A3E',
  border: 'rgba(201, 162, 39, 0.25)',
  green: '#22C55E',
};

const SupportChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { messages, loading, error, sendMessage } = useSupportChat();

  const quickActions = [
    { label: 'Track Order', text: 'Track my order' },
    { label: 'Returns', text: 'What is your return policy?' },
    { label: 'Shipping', text: 'Shipping information' },
    { label: 'Products', text: 'Product inquiry' },
  ];

  // Stop pulse after 3s
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;
    setHasInteracted(true);
    const message = input.trim();
    setInput('');
    try {
      await sendMessage(message);
    } catch (err) {
      // handled by hook
    }
  }, [input, loading, sendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (text) => {
    setHasInteracted(true);
    sendMessage(text);
  };

  // Chat message component with Pretext height calculation
  const ChatMessage = React.memo(({ message, isStreaming = false }) => {
    // Use debounced measurement for smooth 60fps during streaming
    const { height } = useDebouncedTextHeight(
      message.content,
      {
        font: '13px Inter, system-ui, sans-serif',
        maxWidth: 220, // ~80% of 320px chat width minus padding
        lineHeight: 19.5, // 13px * 1.5
        whiteSpace: 'pre-wrap',
      },
      isStreaming ? 100 : 0 // Debounce while streaming, instant when done
    );

    return (
      <div
        style={{
          alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
          display: 'flex',
          justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
        }}
      >
        <div
          style={{
            maxWidth: '80%',
            padding: '10px 14px',
            borderRadius: message.role === 'user' 
              ? '12px 12px 4px 12px' 
              : '12px 12px 12px 4px',
            background: message.role === 'user' ? COLORS.userBubble : COLORS.botBubble,
            color: COLORS.textWhite,
            fontSize: '13px',
            lineHeight: 1.5,
            // Pretext-calculated height for zero layout shift
            minHeight: height ? `${height}px` : 'auto',
            transition: isStreaming ? 'none' : 'height 0.2s ease',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}
        >
          {message.content}
        </div>
      </div>
    );
  });

  ChatMessage.displayName = 'ChatMessage';

  // COLLAPSED - Just the button
  if (!isOpen) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
        }}
      >
        {/* Tooltip */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: 0,
            background: COLORS.bgDark,
            color: COLORS.textWhite,
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            border: `1px solid ${COLORS.border}`,
            pointerEvents: 'none',
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
        >
          Chat with Sampada
        </div>

        {/* Button */}
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
            boxShadow: showPulse
              ? `0 4px 20px rgba(201, 162, 39, 0.4), 0 0 0 8px rgba(201, 162, 39, 0.2)`
              : `0 4px 20px rgba(201, 162, 39, 0.4)`,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            animation: showPulse ? 'pulse 1.5s ease-in-out infinite' : 'none',
          }}
          aria-label="Open support chat"
        >
          <MessageCircle style={{ width: '24px', height: '24px', color: 'white' }} />
        </button>

        <style>{`
          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 4px 20px rgba(201, 162, 39, 0.4), 0 0 0 0 rgba(201, 162, 39, 0.2);
            }
            50% {
              box-shadow: 0 4px 20px rgba(201, 162, 39, 0.6), 0 0 0 12px rgba(201, 162, 39, 0);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            @keyframes pulse {
              0%, 100% {
                box-shadow: 0 4px 20px rgba(201, 162, 39, 0.4);
              }
            }
          }
        `}</style>
      </div>
    );
  }

  // EXPANDED
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '88px',
        right: '24px',
        width: '320px',
        maxHeight: '460px',
        background: COLORS.bgDark,
        borderRadius: '20px',
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'expandIn 200ms cubic-bezier(0.23, 1, 0.32, 1)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
    >
      {/* HEADER - 48px */}
      <div
        style={{
          height: '48px',
          background: COLORS.bgDarker,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '10px',
          borderBottom: `2px solid ${COLORS.gold}`,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ color: COLORS.bgDarker, fontSize: '12px', fontWeight: 'bold' }}>स</span>
        </div>

        {/* Title + Dot */}
        <div style={{ flex: 1 }}>
          <h3
            id="chat-title"
            style={{
              color: COLORS.textWhite,
              fontSize: '14px',
              fontWeight: 500,
              margin: 0,
            }}
          >
            Sampada Support
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: COLORS.green,
                boxShadow: `0 0 6px ${COLORS.green}`,
              }}
            />
            <span style={{ color: COLORS.textMuted, fontSize: '11px' }}>Online</span>
          </div>
        </div>

        {/* Close × */}
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto',
          }}
          aria-label="Close chat"
        >
          <X style={{ width: '18px', height: '18px', color: COLORS.textMuted }} />
        </button>
      </div>

      {/* MESSAGES AREA */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          background: COLORS.bgDark,
          minHeight: '180px',
        }}
        role="log"
        aria-live="polite"
      >
        {!hasInteracted && messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: COLORS.textWhite, fontSize: '13px', margin: 0 }}>
              Hi! How can we help you today? 👋
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((msg, idx) => (
              <ChatMessage 
                key={idx} 
                message={msg} 
                isStreaming={loading && idx === messages.length - 1 && msg.role === 'assistant'}
              />
            ))}
            {loading && messages.length === 0 && (
              <div style={{ display: 'flex', gap: '4px', padding: '10px 14px', background: COLORS.botBubble, borderRadius: '12px', maxWidth: '60px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: COLORS.gold,
                    animation: 'bounce 1s infinite',
                  }}
                />
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: COLORS.gold,
                    animation: 'bounce 1s 0.15s infinite',
                  }}
                />
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: COLORS.gold,
                    animation: 'bounce 1s 0.3s infinite',
                  }}
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* QUICK REPLIES - horizontal scroll */}
      <div
        style={{
          padding: '8px 12px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          borderTop: `1px solid rgba(201, 162, 39, 0.1)`,
          scrollbarWidth: 'none',
        }}
      >
        <style>{`
          div[style*="overflowX: auto"]::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickAction(action.text)}
            style={{
              background: 'transparent',
              border: `1px solid rgba(201, 162, 39, 0.4)`,
              color: COLORS.gold,
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `rgba(201, 162, 39, 0.1)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* INPUT ROW */}
      <div
        style={{
          height: '48px',
          background: COLORS.bgDarker,
          borderTop: `1px solid rgba(201, 162, 39, 0.15)`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          gap: '8px',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          disabled={loading}
          style={{
            flex: 1,
            background: COLORS.botBubble,
            color: COLORS.textWhite,
            border: `1px solid rgba(201, 162, 39, 0.2)`,
            borderRadius: '20px',
            padding: '8px 14px',
            fontSize: '13px',
            outline: 'none',
          }}
          aria-label="Message input"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: COLORS.gold,
            border: 'none',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          aria-label="Send message"
        >
          <Send style={{ width: '16px', height: '16px', color: COLORS.bgDarker }} />
        </button>
      </div>

      {/* FOOTER */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '10px',
          color: '#555',
          padding: '4px 0 8px',
        }}
      >
        Powered by AI • Responses may vary
      </div>

      <style>{`
        @keyframes expandIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
        @media (max-width: 640px) {
          @supports (padding-bottom: env(safe-area-inset-bottom)) {
            div[style*="position: fixed"] {
              right: 12px !important;
              bottom: calc(24px + env(safe-area-inset-bottom)) !important;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default SupportChatWidget;
