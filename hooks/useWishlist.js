// hooks/useWishlist.js
import { useState, useCallback, useEffect } from 'react';

// Mock wishlist hook - in a real app, this might integrate with a backend service
export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('abscommerce-wishlist');
      if (saved) {
        try {
          setWishlistItems(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading wishlist:', error);
        }
      }
    }
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('abscommerce-wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems]);

  const addToWishlist = useCallback((product) => {
    setIsLoading(true);
    setWishlistItems(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        return prev; // Already in wishlist
      }
      return [...prev, { ...product, addedAt: new Date().toISOString() }];
    });
    setTimeout(() => setIsLoading(false), 200);
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setIsLoading(true);
    setWishlistItems(prev => prev.filter(item => item._id !== productId));
    setTimeout(() => setIsLoading(false), 200);
  }, []);

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item._id === productId);
  }, [wishlistItems]);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const toggleWishlist = useCallback((product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    toggleWishlist,
    isLoading,
    wishlistCount: wishlistItems.length
  };
};

export default useWishlist;