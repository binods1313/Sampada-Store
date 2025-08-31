// context/CartContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cartItems from localStorage, or an empty array if nothing is stored
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined') { // Check if running in browser
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return []; // Default to empty array on server-side render
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  const calculateItemPrice = useCallback((item) => {
    if (item.variantPrice !== undefined && item.variantPrice !== null) {
      const price = item.variantPrice;
      const discount = item.variantDiscount !== undefined && item.variantDiscount !== null ? item.variantDiscount : (item.baseDiscount || 0);
      return price * (1 - (discount / 100));
    }
    const price = item.basePrice || item.price;
    const discount = item.baseDiscount || item.discount || 0;
    return price * (1 - (discount / 100));
  }, []);

  // Recalculate totals and persist to localStorage whenever cartItems change
  useEffect(() => {
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    const totalAmount = cartItems.reduce((total, item) => {
      const actualPrice = calculateItemPrice(item);
      return total + (actualPrice * item.quantity);
    }, 0);
    
    setTotalQuantities(totalQuantity);
    setTotalPrice(totalAmount);

    // Persist cart to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }  }, [cartItems, calculateItemPrice]); // Depend on cartItems and calculateItemPrice

  const resetQty = useCallback(() => setQty(1), []);
  
  const incQty = useCallback((maxStock) => {
    if (maxStock === 0) {
      toast.error('This item is out of stock');
      return;
    }
    setQty(prevQty => {
      if (maxStock !== undefined && prevQty >= maxStock) {
        toast.error(`Only ${maxStock} items in stock`);
        return prevQty;
      }
      return prevQty + 1;
    });
  }, []);

  const decQty = () => setQty(prevQty => Math.max(1, prevQty - 1));

  const onAdd = useCallback((itemDetails, quantity) => {
    // Generate a unique ID for this specific cart item (product ID + variant _key if applicable)
    const cartUniqueId = itemDetails._key ? `${itemDetails._id}_${itemDetails._key}` : itemDetails._id;

    const existingCartItemIndex = cartItems.findIndex(item => item.cartUniqueId === cartUniqueId);
    
    if (existingCartItemIndex > -1) {
      const updatedCartItems = [...cartItems];
      const currentAvailableStock = itemDetails.variantStock !== undefined ? itemDetails.variantStock : (itemDetails.inventory || 0);
      if (updatedCartItems[existingCartItemIndex].quantity + quantity > currentAvailableStock) {
        toast.error(`Cannot add more. Only ${currentAvailableStock} in stock.`);
        return;
      }
      updatedCartItems[existingCartItemIndex].quantity += quantity;
      setCartItems(updatedCartItems); // useEffect will handle localStorage
    } else {
      const currentAvailableStock = itemDetails.variantStock !== undefined ? itemDetails.variantStock : (itemDetails.inventory || 0);
      if (quantity > currentAvailableStock) {
        toast.error(`Cannot add ${quantity} items. Only ${currentAvailableStock} in stock.`);
        return;
      }
      setCartItems([...cartItems, { ...itemDetails, quantity, cartUniqueId }]); // useEffect will handle localStorage
    }
    toast.success(`${quantity} ${itemDetails.name} added`);
  }, [cartItems, calculateItemPrice]); // Add calculateItemPrice to deps

  const updateCartItemQuantity = useCallback((cartUniqueId, newQuantity) => {
    setCartItems(items => items.map(item => {
        if (item.cartUniqueId === cartUniqueId) {
            const currentAvailableStock = item.variantStock !== undefined ? item.variantStock : (item.inventory || 0);
            if (newQuantity > currentAvailableStock) {
                toast.error(`Cannot update to ${newQuantity}. Only ${currentAvailableStock} in stock.`);
                return { ...item, quantity: currentAvailableStock };
            }
            return { ...item, quantity: newQuantity };
        }
        return item;
    }));
  }, []); // cartItems implicit dependency through setter function

  const removeFromCart = useCallback(cartUniqueId => {
    setCartItems(items => items.filter(item => item.cartUniqueId !== cartUniqueId));
  }, []); // cartItems implicit dependency through setter function

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        resetQty,
        onAdd,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        calculateItemPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);