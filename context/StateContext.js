// context/StateContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Only run on client side to prevent SSR issues
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    // Default to 'light' during SSR
    return 'light';
  });

  // Apply the initial theme as soon as possible to avoid FOUC (Flash of Unstyled Content)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Apply initial theme immediately to prevent FOUC
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme ||
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    const root = document.documentElement;

    // Apply initial theme
    if (initialTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    console.log('Initial theme applied:', initialTheme);
  }, []); // Run once on mount

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Apply theme to document and save to localStorage
    console.log('Theme changed:', theme);
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log('Applied dark theme - added dark class to html element');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log('Applied light theme - removed dark class from html element');
    }

    // Additional verification
    console.log('Current theme class on html element:', root.classList.contains('dark') ? 'dark' : 'light');
    console.log('Theme saved to localStorage:', theme);
  }, [theme]);

  const toggleCartVisibility = () => {
    setShowCart((prev) => !prev);
  };

  const toggleTheme = () => {
    console.log('Toggling theme - current theme:', theme);
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('New theme will be:', newTheme);
      return newTheme;
    });
  };

  // For hydration-safe rendering
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <UIContext.Provider value={{
      showCart,
      toggleCartVisibility,
      setShowCart,
      theme,
      toggleTheme,
      isDarkMode: mounted ? theme === 'dark' : false, // Don't determine theme until client is mounted
      isClient: mounted
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => useContext(UIContext);