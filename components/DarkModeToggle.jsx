// components/DarkModeToggle.jsx
import React from 'react';
import { useUIContext } from '../context/StateContext';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
  const { toggleTheme, isDarkMode, isClient } = useUIContext();

  // Don't render until client side to avoid hydration issues
  if (!isClient) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-gray-500"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
};

export default DarkModeToggle;