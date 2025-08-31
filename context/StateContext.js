// context/StateContext.js
import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [showCart, setShowCart] = useState(false);

  const toggleCartVisibility = () => {
    setShowCart((prev) => !prev);
  };

  return (
    <UIContext.Provider value={{ 
      showCart, 
      toggleCartVisibility,
      setShowCart 
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => useContext(UIContext);