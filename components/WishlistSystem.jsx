// components/WishlistSystem.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '../lib/client';

// Wishlist Context
const WishlistContext = createContext();

// Wishlist Provider
export const WishlistProvider = ({ children }) => {
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

  const addToWishlist = (product) => {
    setIsLoading(true);
    setWishlistItems(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        return prev; // Already in wishlist
      }
      return [...prev, { ...product, addedAt: new Date().toISOString() }];
    });
    setTimeout(() => setIsLoading(false), 200);
  };

  const removeFromWishlist = (productId) => {
    setIsLoading(true);
    setWishlistItems(prev => prev.filter(item => item._id !== productId));
    setTimeout(() => setIsLoading(false), 200);
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    isLoading,
    wishlistCount: wishlistItems.length
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Hook to use wishlist
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

// Wishlist Button Component
export const WishlistButton = ({ product, className = '', size = 'medium' }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoading } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  const sizeClasses = {
    small: 'w-6 h-6 text-sm',
    medium: 'w-8 h-8 text-base',
    large: 'w-10 h-10 text-lg'
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`wishlist-btn ${inWishlist ? 'in-wishlist' : 'not-in-wishlist'} ${sizeClasses[size]} ${className}`}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {inWishlist ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
};

// Wishlist Icon for Navigation
export const WishlistIcon = ({ className = '' }) => {
  const { wishlistCount } = useWishlist();

  return (
    <Link href="/wishlist">
      <div className={`wishlist-icon ${className}`}>
        <FaHeart />
        {wishlistCount > 0 && (
          <span className="wishlist-count">{wishlistCount}</span>
        )}
      </div>
    </Link>
  );
};

// Wishlist Item Component
export const WishlistItem = ({ item }) => {
  const { removeFromWishlist } = useWishlist();
  
  const hasDiscount = item.discount && item.discount > 0;
  const discountedPrice = hasDiscount ? item.price * (1 - (item.discount / 100)) : item.price;
  const firstImage = item.image && item.image[0] ? item.image[0] : null;
  
  const imageUrl = firstImage?.asset
    ? urlFor(firstImage).width(300).url()
    : '/asset/placeholder-image.jpg';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="wishlist-item">
      <Link href={`/product/${item.slug?.current}`}>
        <div className="wishlist-item-image">
          <Image
            src={imageUrl}
            alt={item.name}
            width={120}
            height={120}
            style={{ objectFit: 'contain' }}
          />
          {hasDiscount && (
            <div className="discount-badge">{item.discount}% OFF</div>
          )}
        </div>
      </Link>
      
      <div className="wishlist-item-info">
        <Link href={`/product/${item.slug?.current}`}>
          <h3 className="wishlist-item-name">{item.name}</h3>
        </Link>
        
        <div className="wishlist-item-price">
          {hasDiscount ? (
            <>
              <span className="discounted-price">${discountedPrice?.toFixed(2)}</span>
              <span className="original-price">${item.price?.toFixed(2)}</span>
            </>
          ) : (
            <span className="price">${item.price?.toFixed(2)}</span>
          )}
        </div>
        
        <p className="added-date">Added {formatDate(item.addedAt)}</p>
        
        <div className="wishlist-item-actions">
          <Link href={`/product/${item.slug?.current}`}>
            <button className="add-to-cart-btn">
              <FaShoppingCart /> Add to Cart
            </button>
          </Link>
          
          <button 
            className="remove-btn"
            onClick={() => removeFromWishlist(item._id)}
            aria-label="Remove from wishlist"
          >
            <FaTrash /> Remove
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Wishlist Page Component
export const WishlistPage = () => {
  const { wishlistItems, clearWishlist, wishlistCount } = useWishlist();

  if (wishlistCount === 0) {
    return (
      <div className="empty-wishlist">
        <div className="empty-wishlist-content">
          <FaRegHeart className="empty-heart-icon" />
          <h2>Your wishlist is empty</h2>
          <p>Save items you love for later. Start adding products to your wishlist!</p>
          <Link href="/">
            <button className="continue-shopping-btn">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div className="wishlist-title">
          <h1>My Wishlist</h1>
          <span className="item-count">({wishlistCount} item{wishlistCount !== 1 ? 's' : ''})</span>
        </div>
        
        <button 
          className="clear-wishlist-btn"
          onClick={clearWishlist}
        >
          Clear All
        </button>
      </div>
      
      <div className="wishlist-grid">
        {wishlistItems.map(item => (
          <WishlistItem key={item._id} item={item} />
        ))}
      </div>
      
      <div className="wishlist-actions">
        <Link href="/">
          <button className="continue-shopping-btn">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

// Wishlist Summary Component (for other pages)
export const WishlistSummary = ({ maxItems = 3 }) => {
  const { wishlistItems, wishlistCount } = useWishlist();
  
  if (wishlistCount === 0) return null;
  
  const displayItems = wishlistItems.slice(0, maxItems);
  const remainingCount = wishlistCount - maxItems;

  return (
    <div className="wishlist-summary">
      <h3>Your Wishlist ({wishlistCount})</h3>
      
      <div className="wishlist-preview">
        {displayItems.map(item => {
          const firstImage = item.image && item.image[0] ? item.image[0] : null;
          const imageUrl = firstImage?.asset
            ? urlFor(firstImage).width(60).url()
            : '/asset/placeholder-image.jpg';
            
          return (
            <Link key={item._id} href={`/product/${item.slug?.current}`}>
              <div className="wishlist-preview-item">
                <Image
                  src={imageUrl}
                  alt={item.name}
                  width={40}
                  height={40}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </Link>
          );
        })}
        
        {remainingCount > 0 && (
          <div className="remaining-count">+{remainingCount}</div>
        )}
      </div>
      
      <Link href="/wishlist">
        <button className="view-all-btn">View All</button>
      </Link>
    </div>
  );
};

export default {
  WishlistProvider,
  useWishlist,
  WishlistButton,
  WishlistIcon,
  WishlistItem,
  WishlistPage,
  WishlistSummary
};