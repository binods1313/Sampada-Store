// components/NeumorphicToggle.jsx
import React from 'react';
import { useUIContext } from '../context/StateContext';
import { Sun, Moon } from 'lucide-react';

const NeumorphicToggle = () => {
  const { toggleTheme, isDarkMode, isClient } = useUIContext();

  // Don't render until client side to avoid hydration issues
  if (!isClient) {
    return (
      <div 
        className="w-16 h-8 rounded-full bg-gray-200 dark:bg-gray-700"
        style={{
          boxShadow: 'inset 4px 4px 8px rgba(134, 134, 134, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.3)'
        }}
      />
    );
  }

  // Neumorphic styles
  const neumorphicBaseStyle = {
    width: '4rem',  // 64px
    height: '2rem', // 32px
    borderRadius: '9999px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'all 0.3s ease',
  };

  // Light mode neumorphic styles
  const lightModeStyle = {
    ...neumorphicBaseStyle,
    backgroundColor: '#e0e0e0',
    boxShadow: '4px 4px 8px rgba(134, 134, 134, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.3)',
  };

  // Dark mode neumorphic styles
  const darkModeStyle = {
    ...neumorphicBaseStyle,
    backgroundColor: '#333333',
    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5), -4px -4px 8px rgba(60, 60, 60, 0.3)',
  };

  // Slider styles
  const sliderStyle = {
    position: 'absolute',
    width: '1.5rem', // 24px
    height: '1.5rem', // 24px
    borderRadius: '50%',
    backgroundColor: isDarkMode ? '#f0f0f0' : '#ffffff',
    transition: 'transform 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: isDarkMode 
      ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.3), 0px 2px 4px rgba(0, 0, 0, 0.3)' 
      : 'inset 2px 2px 4px rgba(134, 134, 134, 0.3), inset -2px -2px 4px rgba(255, 255, 255, 0.3), 0px 2px 4px rgba(0, 0, 0, 0.1)',
    transform: isDarkMode ? 'translateX(20px)' : 'translateX(4px)',
  };

  // Icon styles
  const iconStyle = {
    width: '0.875rem', // 14px
    height: '0.875rem', // 14px
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-gray-500"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      style={isDarkMode ? darkModeStyle : lightModeStyle}
    >
      <div style={sliderStyle}>
        {isDarkMode ? (
          <Sun 
            style={{ 
              ...iconStyle, 
              color: '#fbbf24' // yellow-400
            }} 
          />
        ) : (
          <Moon 
            style={{ 
              ...iconStyle, 
              color: '#374151' // gray-600
            }} 
          />
        )}
      </div>
    </button>
  );
};

export default NeumorphicToggle;