/**
 * AI-Powered Customer Support Chatbot Widget
 * 
 * Features:
 * - Floating chat widget on all pages
 * - AI-powered responses using OpenRouter
 * - Beautiful chat interface with message bubbles
 * - Typing indicators and loading states
 * - Chat history persistence (localStorage)
 * - Minimize/maximize functionality
 * - Sound notifications (optional)
 * - Mobile-responsive design
 * - WCAG 2.1 AA accessibility
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSupportChat } from '@/hooks/useAI';
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2,
  Loader2,
  RefreshCw,
  Zap,
  Clock,
  Bot,
  User,
  Trash2,
  Volume2,
  VolumeX
} from 'lucide-react';

// Quick reply suggestions
const QUICK_REPLIES = [
  'Where is my order?',
  'What is your return policy?',
  'How do I track my package?',
  'Do you offer international shipping?',
  'How do I contact support?',
];

// Welcome message
const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "👋 Hi there! I'm your AI support assistant. I can help you with:\n\n• Order tracking & status\n• Return & refund policies\n• Shipping information\n• Product questions\n• General inquiries\n\nHow can I help you today?"
};

const SupportChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const { messages, loading, error, sendMessage, clearChat } = useSupportChat({
    enableModelFallback: true,
  });

  // Initialize with welcome message
  useEffect(() => {
    const savedMessages = localStorage.getItem('support_chat_messages');
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      // Only restore if messages exist and chat was previously opened
      if (parsed.length > 0) {
        // Don't auto-load messages, start fresh with welcome
      }
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('support_chat_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = useCallback(async (message) => {
    if (!message.trim() || loading) return;

    try {
      await sendMessage(message);
      setInputValue('');

      // Play notification sound (if enabled)
      if (soundEnabled) {
        playNotificationSound();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }, [loading, sendMessage, soundEnabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleQuickReply = (reply) => {
    handleSendMessage(reply);
  };

  const handleClearChat = () => {
    clearChat();
    localStorage.removeItem('support_chat_messages');
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      setIsMinimized(!isMinimized);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Simple notification sound (beep)
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (err) {
      // Silently fail if audio not supported
    }
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // If chat is closed, show floating button
  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: 'var(--admin-space-6, 24px)',
          right: 'var(--admin-space-6, 24px)',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--admin-gold, #C9A84C) 0%, var(--admin-gold-active, #a8882e) 100%)',
          border: 'none',
          boxShadow: 'var(--admin-shadow-gold, 0 4px 20px rgba(201, 168, 76, 0.4))',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 28px rgba(201, 168, 76, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = 'var(--admin-shadow-gold, 0 4px 20px rgba(201, 168, 76, 0.4))';
        }}
        aria-label="Open support chat"
      >
        <MessageCircle className="w-7 h-7" style={{ color: 'var(--admin-text-primary, #ffffff)' }} />
        {/* Notification badge */}
        <span style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          width: '18px',
          height: '18px',
          backgroundColor: 'var(--admin-error-text, #ff6b6b)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: '700',
          color: 'var(--admin-text-primary, #ffffff)',
          border: '2px solid var(--admin-text-primary, #ffffff)',
        }}>
          1
        </span>
      </button>
    );
  }

  // If chat is open but minimized, show small bar
  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 'var(--admin-space-6, 24px)',
          right: 'var(--admin-space-6, 24px)',
          width: '320px',
          backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
          borderRadius: 'var(--admin-radius-xl, 12px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
          zIndex: 9999,
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        onClick={toggleChat}
      >
        <div style={{
          padding: 'var(--admin-space-3, 12px) var(--admin-space-4, 16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.15) 0%, rgba(139, 26, 26, 0.15) 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-2, 10px)' }}>
            <Bot className="w-5 h-5" style={{ color: 'var(--admin-gold, #C9A84C)' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-text-primary, #ffffff)' }}>
              Sampada Support
            </span>
          </div>
          <Maximize2 className="w-4 h-4" style={{ color: 'var(--admin-text-secondary, #888888)' }} />
        </div>
      </div>
    );
  }

  // Full chat widget
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--admin-space-6, 24px)',
        right: 'var(--admin-space-6, 24px)',
        width: '380px',
        maxHeight: '600px',
        height: 'calc(100vh - 48px)',
        backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
        borderRadius: 'var(--admin-radius-2xl, 16px)',
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.5)',
        border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      role="dialog"
      aria-label="Support chat"
    >
      {/* Chat Header */}
      <div style={{
        padding: 'var(--admin-space-4, 16px) var(--admin-space-5, 20px)',
        background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.2) 0%, rgba(139, 26, 26, 0.2) 100%)',
        borderBottom: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-3, 12px)' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--admin-gold, #C9A84C), var(--admin-gold-active, #a8882e))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Bot className="w-6 h-6" style={{ color: 'var(--admin-text-primary, #ffffff)' }} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--admin-text-primary, #ffffff)' }}>
              Sampada Support
            </div>
            <div style={{ fontSize: '12px', color: 'var(--admin-success, #2d7a2d)', display: 'flex', alignItems: 'center', gap: 'var(--admin-space-1, 4px)' }}>
              <span style={{
                width: '6px',
                height: '6px',
                backgroundColor: 'var(--admin-success, #2d7a2d)',
                borderRadius: '50%',
                display: 'inline-block'
              }}></span>
              Online now
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--admin-space-2, 8px)' }}>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              padding: 'var(--admin-space-1, 6px)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: 'var(--admin-radius-sm, 6px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s',
            }}
            aria-label={soundEnabled ? 'Mute notifications' : 'Enable notifications'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" style={{ color: 'var(--admin-gold, #C9A84C)' }} />
            ) : (
              <VolumeX className="w-4 h-4" style={{ color: 'var(--admin-text-secondary, #888888)' }} />
            )}
          </button>

          <button
            onClick={handleClearChat}
            style={{
              padding: 'var(--admin-space-1, 6px)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: 'var(--admin-radius-sm, 6px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s',
            }}
            aria-label="Clear chat history"
          >
            <Trash2 className="w-4 h-4" style={{ color: 'var(--admin-error-text, #ff6b6b)' }} />
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            style={{
              padding: 'var(--admin-space-1, 6px)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: 'var(--admin-radius-sm, 6px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s',
            }}
            aria-label="Minimize chat"
          >
            <Minimize2 className="w-4 h-4" style={{ color: 'var(--admin-text-secondary, #888888)' }} />
          </button>

          <button
            onClick={handleClose}
            style={{
              padding: 'var(--admin-space-1, 6px)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: 'var(--admin-radius-sm, 6px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s',
            }}
            aria-label="Close chat"
          >
            <X className="w-4 h-4" style={{ color: 'var(--admin-text-secondary, #888888)' }} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--admin-space-5, 20px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--admin-space-4, 16px)',
          backgroundColor: 'var(--admin-surface-0, #0f0f0f)',
        }}
      >
        {messages.length === 0 && (
          <div style={{
            padding: 'var(--admin-space-5, 20px)',
            backgroundColor: 'var(--admin-gold-subtle, rgba(201, 168, 76, 0.05))',
            borderRadius: 'var(--admin-radius-xl, 12px)',
            border: '1px solid var(--admin-gold-border, rgba(201, 168, 76, 0.15))',
          }}>
            <p style={{
              fontSize: '14px',
              color: '#e0e0e0',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6',
              margin: 0
            }}>
              {WELCOME_MESSAGE.content}
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              gap: 'var(--admin-space-2, 10px)',
              alignItems: 'flex-end',
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                : 'linear-gradient(135deg, var(--admin-gold, #C9A84C), var(--admin-gold-active, #a8882e))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {msg.role === 'user' ? (
                <User className="w-4 h-4" style={{ color: 'var(--admin-text-primary, #ffffff)' }} />
              ) : (
                <Bot className="w-4 h-4" style={{ color: 'var(--admin-text-primary, #ffffff)' }} />
              )}
            </div>

            {/* Message Bubble */}
            <div style={{
              maxWidth: '75%',
              padding: 'var(--admin-space-3, 12px) var(--admin-space-4, 16px)',
              backgroundColor: msg.role === 'user' ? '#6366f1' : 'var(--admin-surface-2, #1a1a1a)',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              border: msg.role === 'user' ? 'none' : '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
            }}>
              <p style={{
                fontSize: '14px',
                color: msg.role === 'user' ? 'var(--admin-text-primary, #ffffff)' : '#e0e0e0',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5',
                margin: '0 0 var(--admin-space-1, 6px) 0'
              }}>
                {msg.content}
              </p>
              <div style={{
                fontSize: '11px',
                color: msg.role === 'user' ? 'rgba(255, 255, 255, 0.7)' : 'var(--admin-text-muted, #666666)',
                textAlign: msg.role === 'user' ? 'right' : 'left',
              }}>
                {formatTime(new Date())}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 'var(--admin-space-2, 10px)',
            alignItems: 'flex-end',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--admin-gold, #C9A84C), var(--admin-gold-active, #a8882e))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Bot className="w-4 h-4" style={{ color: 'var(--admin-text-primary, #ffffff)' }} />
            </div>
            <div style={{
              padding: 'var(--admin-space-3, 12px) var(--admin-space-4, 16px)',
              backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
              borderRadius: '16px 16px 16px 4px',
              border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--admin-space-2, 8px)',
            }}>
              <div style={{ display: 'flex', gap: 'var(--admin-space-1, 4px)' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'var(--admin-gold, #C9A84C)',
                  borderRadius: '50%',
                  animation: 'bounce 0.6s infinite',
                  animationDelay: '0ms',
                  display: 'inline-block'
                }}></span>
                <span style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'var(--admin-gold, #C9A84C)',
                  borderRadius: '50%',
                  animation: 'bounce 0.6s infinite',
                  animationDelay: '150ms',
                  display: 'inline-block'
                }}></span>
                <span style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'var(--admin-gold, #C9A84C)',
                  borderRadius: '50%',
                  animation: 'bounce 0.6s infinite',
                  animationDelay: '300ms',
                  display: 'inline-block'
                }}></span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--admin-text-secondary, #888888)' }}>
                Typing...
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            padding: 'var(--admin-space-3, 12px) var(--admin-space-4, 16px)',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            borderRadius: 'var(--admin-radius-xl, 12px)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--admin-space-2, 10px)',
          }}>
            <X className="w-4 h-4" style={{ color: 'var(--admin-error-text, #ff6b6b)' }} />
            <span style={{ fontSize: '13px', color: 'var(--admin-error-text, #ff6b6b)' }}>
              {error}
            </span>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginLeft: 'auto',
                padding: 'var(--admin-space-1, 4px) var(--admin-space-2, 8px)',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 107, 107, 0.5)',
                borderRadius: 'var(--admin-radius-sm, 4px)',
                color: 'var(--admin-error-text, #ff6b6b)',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Quick Replies (show after first message) */}
        {messages.length === 1 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--admin-space-2, 8px)',
            marginTop: 'var(--admin-space-2, 8px)',
          }}>
            {QUICK_REPLIES.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                disabled={loading}
                style={{
                  padding: 'var(--admin-space-2, 8px) var(--admin-space-3, 12px)',
                  backgroundColor: 'var(--admin-gold-subtle, rgba(201, 168, 76, 0.1))',
                  border: '1px solid var(--admin-gold-border-strong, rgba(201, 168, 76, 0.3))',
                  borderRadius: '20px',
                  color: 'var(--admin-gold, #C9A84C)',
                  fontSize: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: loading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = 'var(--admin-bg-selected, rgba(201, 168, 76, 0.2))';
                    e.target.style.borderColor = 'var(--admin-gold, #C9A84C)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--admin-gold-subtle, rgba(201, 168, 76, 0.1))';
                  e.target.style.borderColor = 'var(--admin-gold-border-strong, rgba(201, 168, 76, 0.3))';
                }}
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: 'var(--admin-space-4, 16px) var(--admin-space-5, 20px)',
          backgroundColor: 'var(--admin-surface-2, #1a1a1a)',
          borderTop: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
          display: 'flex',
          gap: 'var(--admin-space-2, 10px)',
          alignItems: 'center',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          style={{
            flex: 1,
            padding: 'var(--admin-space-3, 12px) var(--admin-space-4, 16px)',
            backgroundColor: 'var(--admin-surface-1, #141414)',
            border: '1px solid var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))',
            borderRadius: '24px',
            color: 'var(--admin-text-primary, #ffffff)',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--admin-gold, #C9A84C)';
            e.target.style.boxShadow = 'var(--admin-focus-ring, 0 0 0 3px rgba(201, 168, 76, 0.1))';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--admin-gold-border-default, rgba(201, 168, 76, 0.2))';
            e.target.style.boxShadow = 'none';
          }}
          aria-label="Message input"
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: loading || !inputValue.trim()
              ? 'rgba(201, 168, 76, 0.2)'
              : 'linear-gradient(135deg, var(--admin-gold, #C9A84C), var(--admin-gold-active, #a8882e))',
            border: 'none',
            cursor: loading || !inputValue.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          aria-label="Send message"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--admin-text-secondary, #888888)' }} />
          ) : (
            <Send className="w-5 h-5" style={{ color: 'var(--admin-text-primary, #ffffff)' }} />
          )}
        </button>
      </form>

      {/* Powered by */}
      <div style={{
        padding: 'var(--admin-space-2, 8px) var(--admin-space-5, 20px)',
        backgroundColor: 'var(--admin-surface-0, #0f0f0f)',
        borderTop: '1px solid var(--admin-gold-border, rgba(201, 168, 76, 0.1))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--admin-space-1, 6px)',
      }}>
        <Zap className="w-3 h-3" style={{ color: 'var(--admin-gold, #C9A84C)' }} />
        <span style={{ fontSize: '11px', color: 'var(--admin-text-muted, #666666)' }}>
          Powered by AI • Sampada Support
        </span>
      </div>
    </div>
  );
};

export default SupportChatWidget;
