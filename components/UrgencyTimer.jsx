// components/UrgencyTimer.jsx
// Urgency countdown timer for low-stock items
// Creates FOMO (fear of missing out) to boost conversions

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

/**
 * UrgencyTimer Component
 * Shows urgency messaging for low-stock or time-sensitive products
 *
 * Props:
 * @param {number} stock - Current stock quantity
 * @param {boolean} showCountdown - Show countdown timer
 * @param {number} countdownMinutes - Countdown duration in minutes (default 15)
 * @param {string} message - Custom urgency message
 */
export default function UrgencyTimer({
  stock,
  showCountdown = false,
  countdownMinutes = 15,
  message,
}) {
  const [timeLeft, setTimeLeft] = useState(countdownMinutes * 60);

  // Countdown timer
  useEffect(() => {
    if (!showCountdown || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showCountdown, timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine urgency level
  const getUrgencyLevel = () => {
    if (stock <= 2) return 'critical';
    if (stock <= 5) return 'high';
    if (stock <= 10) return 'medium';
    return 'none';
  };

  const urgencyLevel = getUrgencyLevel();

  // Don't show if no urgency
  if (urgencyLevel === 'none' && !showCountdown) return null;

  // Custom message or auto-generated
  const displayMessage = message || (
    urgencyLevel === 'critical' ? `🔥 Only ${stock} left! Order now before it's gone!` :
    urgencyLevel === 'high' ? `⚡ Only ${stock} items remaining in stock!` :
    urgencyLevel === 'medium' ? `👀 ${stock} people are looking at this right now` :
    ''
  );

  const colors = {
    critical: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', icon: '#EF4444' },
    high: { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', icon: '#F59E0B' },
    medium: { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534', icon: '#22C55E' },
  };

  const currentColors = colors[urgencyLevel] || colors.medium;

  return (
    <div
      style={{
        padding: '12px 16px',
        backgroundColor: currentColors.bg,
        border: `1px solid ${currentColors.border}`,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animation: 'pulse 2s ease-in-out infinite',
      }}
    >
      {/* Icon */}
      <div style={{ flexShrink: 0 }}>
        {urgencyLevel === 'critical' ? (
          <AlertTriangle size={20} color={currentColors.icon} />
        ) : (
          <Clock size={20} color={currentColors.icon} />
        )}
      </div>

      {/* Message */}
      <div style={{ flex: 1 }}>
        <p style={{
          margin: 0,
          fontSize: '13px',
          fontWeight: '600',
          color: currentColors.text,
          lineHeight: 1.4,
        }}>
          {displayMessage}
        </p>

        {/* Countdown timer */}
        {showCountdown && timeLeft > 0 && (
          <div style={{
            marginTop: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{
              fontSize: '11px',
              color: currentColors.text,
              opacity: 0.8,
            }}>
              Offer expires in:
            </span>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              fontWeight: '700',
              color: currentColors.icon,
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              padding: '2px 8px',
              borderRadius: '4px',
            }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}
