// context/StateContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  
  // Theme is already set by _document.js script, just read it
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      // Read from window.__INITIAL_THEME__ set by _document.js
      return window.__INITIAL_THEME__ || 
             (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    }
    return 'light'; // Default during SSR
  });

  // Track if component is mounted (client-side)
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply theme changes to DOM and localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleCartVisibility = () => {
    setShowCart((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <UIContext.Provider value={{
      showCart,
      toggleCartVisibility,
      setShowCart,
      theme,
      toggleTheme,
      isDarkMode: mounted ? theme === 'dark' : false,
      isClient: mounted
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => useContext(UIContext);