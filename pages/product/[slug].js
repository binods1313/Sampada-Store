// pages/product/[slug].js
import React, { useState, useEffect, useCallback, Fragment } from 'react'; // Import Fragment
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { BsCheckCircleFill } from 'react-icons/bs'; // For stock/availability icon
import { IoCloseCircleOutline } from "react-icons/io5"; // For out of stock icon
import { IoClose } from 'react-icons/io5'; // For modal close button
import { client, urlFor } from '../../lib/client';
import { useCartContext } from '../../context/CartContext';
import { useUIContext } from '../../context/StateContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ErrorPage from 'next/error';

const ProductDetails = ({ product, products }) => {
  if (!product) {
    return <ErrorPage statusCode={404} title="Product not found" />;
  }

  // Destructure specifications from product
  const { _id, name, details, specialty, pros, cons, bestUseCases, variants, sizeChart, image, price, discount, inventory, specifications } = product;
  const basePrice = price || 0;
  const baseDiscount = discount || 0;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const { decQty, incQty, qty, onAdd, resetQty } = useCartContext();
  const { setShowCart } = useUIContext();

  const [showSizeChartModal, setShowSizeChartModal] = useState(false);

  // --- Initial selection of variants ---
  useEffect(() => {
    resetQty();

    if (variants && variants.length > 0) {
      const uniqueColors = Array.from(new Set(variants.map(v => v.colorName))).filter(Boolean);

      if (uniqueColors.length > 0) {
        setSelectedColor(uniqueColors[0]);
        const variantsForFirstColor = variants.filter(v => v.colorName === uniqueColors[0]);
        const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'];
        const sortedSizes = variantsForFirstColor.map(v => v.size).sort((a, b) => {
          return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
        });
        setSelectedSize(sortedSizes.length > 0 ? sortedSizes[0] : null);
      } else {
        setSelectedColor(null);
        setSelectedSize(null);
      }
    } else {
      setSelectedColor(null);
      setSelectedSize(null);
    }
  }, [product._id, variants, resetQty]); // Added resetQty to dependency array

  // --- Update selectedVariant whenever selectedColor or selectedSize changes ---
  useEffect(() => {
    if (selectedColor && selectedSize && variants) {
      const foundVariant = variants.find(
        v => v.colorName === selectedColor && v.size === selectedSize
      );
      setSelectedVariant(foundVariant);

      if (foundVariant && foundVariant.variantImage && foundVariant.variantImage.asset) {
        setCurrentImageIndex(0); // Reset to first image if variant has its own image
      } else {
        // If no specific variant image, keep the current default image or reset to 0
        // setCurrentImageIndex(0); // Or maintain currentImageIndex from default images
      }
    } else {
      setSelectedVariant(null);
      // Optionally reset image index when no variant is fully selected
      // setCurrentImageIndex(0);
    }
  }, [selectedColor, selectedSize, variants]);

  const currentPrice = selectedVariant?.variantPrice ?? basePrice;
  const currentDiscount = selectedVariant?.variantDiscount ?? baseDiscount;
  const displayPrice = currentPrice * (1 - (currentDiscount / 100));

  const currentStock = variants && variants.length > 0
                       ? (selectedVariant?.variantStock ?? 0)
                       : (inventory ?? 0);

  // --- Handlers for variant selection ---
  const handleColorSelect = useCallback((colorName) => {
    setSelectedColor(colorName);
    const variantsForColor = (variants || []).filter(v => v.colorName === colorName);
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'];
    const sortedSizes = variantsForColor.map(v => v.size).sort((a, b) => {
        return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
    });
    setSelectedSize(sortedSizes.length > 0 ? sortedSizes[0] : null);
  }, [variants]);

  const handleSizeSelect = useCallback((size) => {
    setSelectedSize(size);
  }, []);

  const uniqueColors = Array.from(new Map(
    (variants || []).map(v => [v.colorName, { colorName: v.colorName, colorHex: v.colorHex, variantImage: v.variantImage }])
  ).values());

  const availableSizesForSelectedColor = selectedColor
    ? (variants || []).filter(v => v.colorName === selectedColor)
             .map(v => ({ size: v.size, stock: v.variantStock }))
             .sort((a, b) => {
                const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'];
                return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
              })
    : [];

  const mainProductImageSource = selectedVariant?.variantImage?.asset
                               ? urlFor(selectedVariant.variantImage).width(600).url()
                               : (image?.[currentImageIndex]?.asset
                                 ? urlFor(image[currentImageIndex]).width(600).url()
                                 : '/asset/placeholder-image.jpg');

  const getItemDetailsForCart = () => {
    if (variants && variants.length > 0) {
      if (!selectedVariant) {
        return null;
      }
      return {
        _id: _id,
        name: name,
        baseImage: image, // Keep base product image for context if needed
        basePrice: price,
        baseDiscount: discount,

        _key: selectedVariant._key, // Variant specific key
        colorName: selectedVariant.colorName,
        size: selectedVariant.size,
        variantPrice: selectedVariant.variantPrice,
        variantDiscount: selectedVariant.variantDiscount,
        variantImage: selectedVariant.variantImage,
        variantStock: selectedVariant.variantStock,
      };
    } else { // Product without variants
      return {
        _id: _id,
        name: name,
        image: image, // Use the main image array
        price: price,
        discount: discount,
        inventory: inventory,
      };
    }
  };

  const handleAddToCart = () => {
    const itemDetails = getItemDetailsForCart();

    if (variants && variants.length > 0 && !itemDetails) {
      toast.error("Please select a color and size.");
      return;
    }

    if (currentStock === 0) {
      toast.error("This product/variant is out of stock.");
      return;
    }

    onAdd(itemDetails, qty);
  };

  const handleBuyNow = () => {
    const itemDetails = getItemDetailsForCart();

    if (variants && variants.length > 0 && !itemDetails) {
      toast.error("Please select a color and size.");
      return;
    }

    if (currentStock === 0) {
      toast.error("This product/variant is out of stock.");
      return;
    }

    onAdd(itemDetails, qty);
    setShowCart(true);
  };

  // Render functions for specialty, pros, cons, use cases (no changes needed here)
  const renderSpecialtyItem = (item) => {
    let icon = null;
    if (item.toLowerCase().includes('nova-pulse') || item.toLowerCase().includes('energy core')) {
      icon = <span style={{ color: '#0066cc', marginRight: '8px', fontWeight: 'bold' }}>◆</span>;
      const words = item.split(' ');
      const highlightedItem = words.map((word, i) => {
        if (word.toLowerCase().includes('nova-pulse') || word.toLowerCase().includes('energy') || word.toLowerCase().includes('core')) {
          return <strong key={i} style={{ fontWeight: 'bold', backgroundColor: '#e6f0ff', padding: '0 3px' }}>{word} </strong>;
        }
        return word + ' ';
      });
      return <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px', backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px' }} key={item}>{icon}<span>{highlightedItem}</span></li>;
    } else if (item.toLowerCase().includes('shielding')) {
      icon = <span style={{ color: '#339933', marginRight: '8px', fontWeight: 'bold' }}>●</span>;
      const words = item.split(' ');
      const highlightedItem = words.map((word, i) => {
        if (word.toLowerCase().includes('shielding') || word.toLowerCase().includes('absorbs') || word.toLowerCase().includes('redirects')) {
          return <strong key={i} style={{ fontWeight: 'bold', backgroundColor: '#e6ffe6', padding: '0 3px' }}>{word} </strong>;
        }
        return word + ' ';
      });
      return <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px', backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px' }} key={item}>{icon}<span>{highlightedItem}</span></li>;
    } else if (item.toLowerCase().includes('lightweight') || item.toLowerCase().includes('plating')) {
      icon = <span style={{ color: '#666666', marginRight: '8px', fontWeight: 'bold' }}>◆</span>;
      const words = item.split(' ');
      const highlightedItem = words.map((word, i) => {
        if (word.toLowerCase().includes('lightweight') || word.toLowerCase().includes('plating') || word.toLowerCase().includes('speed')) {
          return <strong key={i} style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', padding: '0 3px' }}>{word} </strong>;
        }
        return word + ' ';
      });
      return <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px', backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px' }} key={item}>{icon}<span>{highlightedItem}</span></li>;
    }
    return <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px' }} key={item}><span style={{ marginRight: '8px', fontWeight: 'bold' }}>•</span><span>{item}</span></li>;
  };

  const renderProItem = (item) => {
    const words = item.split(' ');
    const highlightedItem = words.map((word, i) => {
      if (word.toLowerCase().includes('rapid') || word.toLowerCase().includes('motion') || word.toLowerCase().includes('auto-reactive') || word.toLowerCase().includes('thermo') || word.toLowerCase().includes('regenerative') || word.toLowerCase().includes('zero-g')) {
        return <strong key={i} style={{ fontWeight: 'bold', backgroundColor: '#dff0d8', padding: '0 3px' }}>{word} </strong>;
      }
      return word + ' ';
    });
    return <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px', backgroundColor: '#f8fbf8', padding: '8px', borderRadius: '4px' }} key={item}><span style={{ color: 'green', marginRight: '8px', marginTop: '2px', fontWeight: 'bold' }}>✓</span><span>{highlightedItem}</span></li>;
  };

  const renderConItem = (item) => {
    const words = item.split(' ');
    const highlightedItem = words.map((word, i) => {
      if (word.toLowerCase().includes('energy-intensive') || word.toLowerCase().includes('advanced') || word.toLowerCase().includes('skill') || word.toLowerCase().includes('limited') || word.toLowerCase().includes('heavy')) {
        return <strong key={i} style={{ fontWeight: 'bold', backgroundColor: '#f2dede', padding: '0 3px' }}>{word} </strong>;
      }
      return word + ' ';
    });
    return <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px', backgroundColor: '#fbf8f8', padding: '8px', borderRadius: '4px' }} key={item}><span style={{ color: 'red', marginRight: '8px', marginTop: '2px', fontWeight: 'bold' }}>✗</span><span>{highlightedItem}</span></li>;
  };

  const renderUseCaseItem = (item) => {
    let icon = null;
    if (item.toLowerCase().includes('elite') || item.toLowerCase().includes('strike')) {
      icon = <span style={{ color: '#ffc107', marginRight: '8px', fontSize: '16px', fontWeight: 'bold' }}>🏹</span>;
    } else if (item.toLowerCase().includes('interstellar') || item.toLowerCase().includes('reconnaissance')) {
      icon = <span style={{ color: '#0099ff', marginRight: '8px', fontSize: '16px', fontWeight: 'bold' }}>🚀</span>;
    } else if (item.toLowerCase().includes('high-speed') || item.toLowerCase().includes('tactical')) {
      icon = <span style={{ color: '#666666', marginRight: '8px', fontSize: '16px', fontWeight: 'bold' }}>👤</span>;
    }
    const words = item.split(' ');
    const highlightedItem = words.map((word, i) => {
      if (word.toLowerCase().includes('elite') || word.toLowerCase().includes('strike') || word.toLowerCase().includes('interstellar') || word.toLowerCase().includes('reconnaissance') || word.toLowerCase().includes('high-speed') || word.toLowerCase().includes('tactical')) {
        return <strong key={i} style={{ fontWeight: 'bold', backgroundColor: '#fff3cd', padding: '0 3px' }}>{word} </strong>;
      }
      return word + ' ';
    });
    return (
      <li style={{
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '15px',
        backgroundColor: '#f8f9fa',
        padding: '8px',
        borderRadius: '4px'
      }} key={item}>
        {icon}
        <span>{highlightedItem}</span>
      </li>
    );
  };


  return (
    <div className="product-page-container">
      {/* Main product container */}
      <div className="product-detail-container" style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Left side - Product image */}
        <div style={{
          flex: '1 1 40%',
          minWidth: '300px'
        }}>
          <div className="image-container" style={{
            backgroundColor: '#f1f1f1',
            borderRadius: '0px', // Keep as 0px if intended
            padding: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '10px',
            height: '500px', // Fixed height for main image
            position: 'relative'
          }}>
            <img
              src={mainProductImageSource}
              className="product-detail-image"
              alt={name || 'Product Image'}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                objectPosition: 'center'
              }}
              onError={(e) => {
                console.error('Product details main image load failed for:', name, 'from URL:', e.target.src);
                e.target.src = '/asset/placeholder-image.jpg';
                // Ensure placeholder styles are consistent
                e.target.style.maxWidth = '100%';
                e.target.style.maxHeight = '100%';
                e.target.style.width = 'auto';
                e.target.style.height = 'auto';
                e.target.style.objectFit = 'contain';
              }}
            />
          </div>
          {/* Small images (thumbnails) */}
          <div className="small-images-container" style={{
            display: 'flex',
            gap: '10px',
            marginTop: '10px',
            justifyContent: 'center',
            marginBottom: '20px' // Added margin for spacing
          }}>
            {variants && variants.length > 0 && uniqueColors.length > 0 ? (
                // Thumbnails for color variants (using variantImage if available)
                <Fragment>
                    {uniqueColors.map((colorItem) => (
                        <div
                            key={colorItem.colorName}
                            className={`color-option ${selectedColor === colorItem.colorName ? 'selected' : ''}`}
                            onClick={() => handleColorSelect(colorItem.colorName)}
                            style={{
                                width: '60px',
                                height: '60px',
                                cursor: 'pointer',
                                border: selectedColor === colorItem.colorName ? '2px solid #f02d34' : '1px solid #d0d0d0',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'border-color 0.3s ease, background-color 0.3s ease',
                                backgroundColor: colorItem.colorHex || '#f1f1f1', // Use hex for background if no image
                                boxShadow: selectedColor === colorItem.colorName ? '0 0 0 2px #f02d34 inset' : 'none' // Example focus style
                            }}
                        >
                            {colorItem.variantImage && colorItem.variantImage.asset ? (
                                <img
                                    src={urlFor(colorItem.variantImage).width(60).height(60).url()}
                                    alt={colorItem.colorName}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                      console.error('Variant thumbnail load failed for:', colorItem.colorName, 'from URL:', e.target.src);
                                      e.target.src = '/asset/placeholder-image.jpg';
                                      e.target.style.width = '100%';
                                      e.target.style.height = '100%';
                                      e.target.style.objectFit = 'contain'; // Changed to contain for placeholder
                                    }}
                                />
                            ) : (
                                // Fallback if no variant image, show color name or just hex background
                                <span style={{ color: selectedColor === colorItem.colorName ? 'white' : '#333', fontSize: '0.7em', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                                    {colorItem.colorName}
                                </span>
                            )}
                        </div>
                    ))}
                </Fragment>
              ) : (
                // Thumbnails for default product images
                <Fragment>
                    {image?.map((item, i) => (
                        <div
                            key={item._key || i} // Ensure unique key
                            style={{
                                width: '60px',
                                height: '60px',
                                cursor: 'pointer',
                                backgroundColor: i === currentImageIndex ? '#f02d34' : '#f1f1f1', // Highlight active image
                                borderRadius: '0px', // Consistent with main image container
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.3s ease',
                                border: i === currentImageIndex ? '2px solid #f02d34' : '2px solid transparent' // Border for active
                            }}
                            onMouseEnter={() => setCurrentImageIndex(i)} // Change main image on hover/click
                            className="thumbnail-image" // For potential global styling
                            // Optional: hover effect for non-active thumbnails
                            onMouseOver={(e) => {
                                if (i !== currentImageIndex) {
                                    e.currentTarget.style.backgroundColor = '#ff8a85'; // Lighter red for hover
                                }
                            }}
                            onMouseOut={(e) => {
                                if (i !== currentImageIndex) {
                                    e.currentTarget.style.backgroundColor = '#f1f1f1'; // Revert to default
                                }
                            }}
                        >
                            <img
                                src={item.asset ? urlFor(item).width(60).url() : '/asset/placeholder-image.jpg'}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    width: 'auto',
                                    height: 'auto',
                                    objectFit: 'contain'
                                }}
                                alt={`${name || 'Product'} - view ${i+1}`}
                                onError={(e) => {
                                    console.error('Product thumbnail load failed for:', name, 'from URL:', e.target.src);
                                    e.target.src = '/asset/placeholder-image.jpg';
                                    e.target.style.width = '100%';
                                    e.target.style.height = '100%';
                                    e.target.style.objectFit = 'contain';
                                }}
                            />
                        </div>
                    ))}
                </Fragment>
              )}
          </div>
        </div>

        {/* Right side - Product details */}
        <div className="product-detail-desc" style={{
          flex: '1 1 50%',
          minWidth: '300px'
        }}>
          <h1 style={{
            fontSize: '2rem', // Responsive font size if needed
            fontWeight: 'bold',
            marginBottom: '10px',
            display: 'flex', // For aligning icons
            alignItems: 'center'
          }}>
            <span style={{ color: '#f0ad4e', marginRight: '8px' }}>⚡</span> {/* Example Icon */}
            {name}
            <span style={{ color: '#f0ad4e', marginLeft: '8px' }}>⚡</span> {/* Example Icon */}
          </h1>

          <div className="reviews" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ color: '#f02d34', fontSize: '1.2rem', display: 'flex' }}>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p style={{ marginLeft: '5px' }}>(20)</p>
          </div>

          <div className="details-section" style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>Details:</h4>
            <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#4a4a4a' }}>{details}</p>
          </div>

          {/* Price Section - Moved before Specifications */}
          <p className="price" style={{
             fontSize: '1.75rem',
             fontWeight: 'bold',
             color: '#f02d34',
             marginBottom: '20px',
             display: 'flex',
             alignItems: 'baseline',
             flexWrap: 'wrap' // Allow wrapping for smaller screens
          }}>
            ${displayPrice.toFixed(2)}
            {currentDiscount > 0 && (
              <>
                <span style={{
                  fontSize: '0.8rem', // Smaller font for original price
                  color: '#999',
                  marginLeft: '10px',
                  textDecoration: 'line-through',
                  whiteSpace: 'nowrap' // Prevent breaking
                }}>
                  ${currentPrice.toFixed(2)}
                </span>
                <span style={{
                  fontSize: '0.8rem', // Consistent size
                  color: '#e53935', // More vibrant red for discount
                  marginLeft: '8px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}>
                  (-{currentDiscount}%)
                </span>
              </>
            )}
          </p>

          {/* Product Variants (Colors & Sizes) */}
          {variants && variants.length > 0 && (
            <div className="product-variants-section" style={{ marginBottom: '30px' }}>
              {/* Color Selection */}
              <div className="color-selector" style={{ marginBottom: '20px' }}>
                <h3 style={{ marginRight: '10px', fontWeight: '500', marginBottom: '10px' }}>
                  Color: <span style={{ fontWeight: 'bold' }}>{selectedColor || 'Select Color'}</span>
                </h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {uniqueColors.map((colorItem) => (
                    <div
                      key={colorItem.colorName}
                      className={`color-option ${selectedColor === colorItem.colorName ? 'selected' : ''}`}
                      onClick={() => handleColorSelect(colorItem.colorName)}
                      title={colorItem.colorName} // Accessibility
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '4px', // Slightly rounded
                        cursor: 'pointer',
                        border: selectedColor === colorItem.colorName ? '2px solid #f02d34' : '1px solid #d0d0d0',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'border-color 0.3s ease, background-color 0.3s ease',
                        backgroundColor: colorItem.colorHex || '#f1f1f1',
                        boxShadow: selectedColor === colorItem.colorName ? '0 0 0 2px #f02d34 inset' : 'none' // Inner shadow for selection
                      }}
                    >
                        {colorItem.variantImage && colorItem.variantImage.asset ? (
                            <img
                                src={urlFor(colorItem.variantImage).width(50).height(50).url()}
                                alt={colorItem.colorName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                  console.error('Variant color swatch image load failed for:', colorItem.colorName, 'from URL:', e.target.src);
                                  e.target.src = '/asset/placeholder-image.jpg';
                                  e.target.style.width = '100%';
                                  e.target.style.height = '100%';
                                  e.target.style.objectFit = 'contain';
                                }}
                            />
                        ) : (
                            // Fallback text if no image, ensure good contrast with hex background
                            <span style={{ color: selectedColor === colorItem.colorName ? 'white' : '#333', fontSize: '0.7em', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                                {colorItem.colorName}
                            </span>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="size-selector" style={{ marginBottom: '20px' }}>
                <h3 style={{ marginRight: '10px', fontWeight: '500', marginBottom: '10px' }}>
                  Size: <span style={{ fontWeight: 'bold' }}>{selectedSize || 'Select Size'}</span>
                </h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {availableSizesForSelectedColor.length > 0 ? (
                    availableSizesForSelectedColor.map((sizeItem) => (
                      <button
                        key={sizeItem.size}
                        className={`size-option ${selectedSize === sizeItem.size ? 'selected' : ''} ${sizeItem.stock === 0 ? 'out-of-stock' : ''}`}
                        onClick={() => handleSizeSelect(sizeItem.size)}
                        disabled={sizeItem.stock === 0}
                        style={{
                          padding: '10px 15px',
                          border: selectedSize === sizeItem.size ? '2px solid #f02d34' : '1px solid #d0d0d0',
                          backgroundColor: selectedSize === sizeItem.size ? '#f02d34' : (sizeItem.stock === 0 ? '#e0e0e0' : '#f1f1f1'), // Grey out if out of stock
                          color: selectedSize === sizeItem.size ? 'white' : (sizeItem.stock === 0 ? '#aaa' : '#333'),
                          borderRadius: '4px',
                          cursor: sizeItem.stock === 0 ? 'not-allowed' : 'pointer',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                          opacity: sizeItem.stock === 0 ? 0.6 : 1,
                          position: 'relative' // For out-of-stock line
                        }}
                      >
                        {sizeItem.size}
                        {sizeItem.stock === 0 && (
                          <span style={{
                            position: 'absolute',
                            top: '50%',
                            left: '0', // Start from left edge
                            width: '100%', // Span full width
                            height: '2px',
                            backgroundColor: '#f02d34', // Red line for out of stock
                            transform: 'translateY(-50%) rotate(-10deg)', // Slight angle for strikethrough
                            pointerEvents: 'none' // Ensure button is still clickable if needed (though it's disabled)
                          }}></span>
                        )}
                      </button>
                    ))
                  ) : (
                    <p style={{ color: '#888' }}>{selectedColor ? 'No sizes available for this color.' : 'Select a color to see available sizes.'}</p>
                  )}
                </div>
              </div>

              {/* Size Chart Button */}
              {sizeChart && sizeChart.asset && (
                <button
                  type="button"
                  onClick={() => setShowSizeChartModal(true)}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: 'transparent',
                    color: '#007bff', // Standard link color
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    textDecoration: 'underline',
                    marginBottom: '15px' // Added margin
                  }}
                >
                  Size Chart
                </button>
              )}

              {/* Selected Variant Summary and Stock Status */}
              <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  Selected: {selectedColor || 'Color'} / {selectedSize || 'Size'}
                </h4>
                {selectedVariant ? (
                  <p style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                    {currentStock > 0 ? (
                      <>
                        <BsCheckCircleFill style={{ color: 'green', marginRight: '5px' }} />
                        In Stock ({currentStock} items)
                      </>
                    ) : (
                      <>
                        <IoCloseCircleOutline style={{ color: '#f02d34', marginRight: '5px' }} />
                        Out of Stock
                      </>
                    )}
                  </p>
                ) : (
                  <p style={{ color: '#888', marginTop: '5px' }}>Please select a variant to see availability.</p>
                )}
              </div>
            </div>
          )}
          {(!variants || variants.length === 0) && ( // Fallback for products without variants
            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px', marginBottom: '30px' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Availability:</h4>
              <p style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                {currentStock > 0 ? (
                  <>
                    <BsCheckCircleFill style={{ color: 'green', marginRight: '5px' }} />
                    In Stock ({currentStock} items)
                  </>
                ) : (
                  <>
                    <IoCloseCircleOutline style={{ color: '#f02d34', marginRight: '5px' }} />
                    Out of Stock
                  </>
                )}
              </p>
            </div>
          )}

          {/* Quantity Controls with Enhanced Styling */}          <div className="quantity" style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '30px',
            position: 'relative',
            zIndex: 2,
            opacity: currentStock === 0 ? 0.6 : 1
          }}>
            <h3 style={{
              marginRight: '20px',
              fontWeight: '600',
              fontSize: '1.1rem'
            }}>
              Quantity:
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#fff',
              padding: '8px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <button
                onClick={decQty}
                type="button"
                disabled={currentStock === 0}
                aria-label="Decrease quantity"
                style={{
                  width: '48px',
                  height: '48px',
                  cursor: currentStock === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  background: '#ffebee',
                  color: '#d32f2f',
                  border: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    e.currentTarget.style.backgroundColor = '#ffcdd2';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    e.currentTarget.style.backgroundColor = '#ffebee';
                  }
                }}
              >
                <AiOutlineMinus />
              </button>
              <span style={{
                width: '60px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: '0 10px',
                background: currentStock === 0 ? '#f5f5f5' : '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                {qty}
              </span>              <button                onClick={() => incQty(currentStock)}
                type="button"
                disabled={currentStock === 0}
                aria-label="Increase quantity"
                style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentStock === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '20px',
                  background: '#e8f5e8',
                  color: currentStock === 0 ? '#8aa98e' : '#2e7d32',
                  border: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    e.currentTarget.style.backgroundColor = '#c8e6c9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    e.currentTarget.style.backgroundColor = '#e8f5e8';
                  }
                }}
              >
                <AiOutlinePlus />
              </button>
            </div>
          </div>

          {/* Action Buttons with Enhanced Styling */}
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '40px',
            flexWrap: 'wrap',
            marginTop: '30px'
          }}>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={(variants && variants.length > 0 && !selectedVariant) || currentStock === 0}
              style={{
                width: '200px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #f02d34',
                backgroundColor: 'white',
                color: '#f02d34',
                fontSize: '16px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderRadius: '12px',
                cursor: ((variants && variants.length > 0 && !selectedVariant) || currentStock === 0) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(240, 45, 52, 0.15)',
                opacity: ((variants && variants.length > 0 && !selectedVariant) || currentStock === 0) ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(240, 45, 52, 0.25)';
                  e.currentTarget.style.backgroundColor = '#fff5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(240, 45, 52, 0.15)';
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={(variants && variants.length > 0 && !selectedVariant) || currentStock === 0}
              style={{
                width: '200px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f02d34',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: 'none',
                borderRadius: '12px',
                cursor: ((variants && variants.length > 0 && !selectedVariant) || currentStock === 0) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(240, 45, 52, 0.3)',
                opacity: ((variants && variants.length > 0 && !selectedVariant) || currentStock === 0) ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(240, 45, 52, 0.4)';
                  e.currentTarget.style.backgroundColor = '#e01e24';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(240, 45, 52, 0.3)';
                  e.currentTarget.style.backgroundColor = '#f02d34';
                }
              }}
            >
              Buy Now
            </button>
          </div>

          {/* --- MOVED: Product Specifications Section --- */}
          {specifications && specifications.length > 0 && (
            <div className="specifications-section" style={{ 
                marginBottom: '25px', // Space before Product Insights
                borderTop: '1px solid #e0e0e0', 
                paddingTop: '20px' // Space after border
                // marginTop is implicitly handled by buttons' marginBottom
            }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
                Product Specifications
              </h4>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {specifications.map((spec, index) => (
                  <li key={spec._key || index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: index < specifications.length - 1 ? '1px dashed #f0f0f0' : 'none',
                    fontSize: '0.95rem',
                    lineHeight: '1.4',
                  }}>
                    <strong style={{ color: '#444', marginRight: '15px', flexBasis: '40%', minWidth: '120px', fontWeight: '500' }}>{spec.feature}:</strong>
                    <span style={{ color: '#666', flexBasis: '60%', textAlign: 'left' }}>{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* --- END MOVED: Product Specifications Section --- */}

          {/* Product Insights Section with Icons */}
          <div className="product-insights" style={{ marginTop: '20px' }}> {/* This marginTop creates space after Specifications */}
            {specialty && specialty.length > 0 && (
              <div className="specialty" style={{ marginBottom: '25px' }}>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px',
                  color: '#333',
                  borderBottom: '1px solid #eee', // Subtle separator
                  paddingBottom: '8px'
                }}>
                  <span style={{ color: '#f0ad4e', marginRight: '8px' }}>⚡</span> Specialty
                </h4>
                <ul className="specialty-list" style={{ paddingLeft: '5px', listStyle: 'none' }}>
                  {typeof specialty === 'string' // Handle if specialty is a single string
                    ? renderSpecialtyItem(specialty)
                    : specialty.map(item => renderSpecialtyItem(item))
                  }
                </ul>
              </div>
            )}

            {/* Pros and Cons section side by side */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive columns
              gap: '30px',
              marginBottom: '30px'
            }}>
              {pros && pros.length > 0 && (
                <div className="pros">
                  <h4 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '12px',
                    color: '#333',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '8px'
                  }}>
                    <span style={{
                      backgroundColor: '#dff0d8',
                      color: '#3c763d',
                      marginRight: '8px',
                      borderRadius: '3px',
                      padding: '0 5px',
                      border: '1px solid #d6e9c6'
                    }}>✓</span> Pros
                  </h4>
                  <ul className="pros-list" style={{ paddingLeft: '5px', listStyle: 'none' }}>
                    {typeof pros === 'string'
                      ? renderProItem(pros)
                      : pros.map(pro => renderProItem(pro))
                    }
                  </ul>
                </div>
              )}

              {cons && cons.length > 0 && (
                <div className="cons">
                  <h4 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '12px',
                    color: '#333',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '8px'
                  }}>
                    <span style={{
                      backgroundColor: '#f2dede',
                      color: '#a94442',
                      marginRight: '8px',
                      borderRadius: '3px',
                      padding: '0 5px',
                      border: '1px solid #ebccd1'
                    }}>✗</span> Cons
                  </h4>
                  <ul className="cons-list" style={{ paddingLeft: '5px', listStyle: 'none' }}>
                    {typeof cons === 'string'
                      ? renderConItem(cons)
                      : cons.map(con => renderConItem(con))
                    }
                  </ul>
                </div>
              )}
            </div>

            {bestUseCases && bestUseCases.length > 0 && (
              <div className="best-use-cases">
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px',
                  color: '#333',
                  borderBottom: '1px solid #eee',
                  paddingBottom: '8px'
                }}>
                  <span style={{ color: '#d9534f', marginRight: '8px' }}>🎯</span> Best Use Cases
                </h4>
                <ul className="use-cases-list" style={{ paddingLeft: '5px', listStyle: 'none' }}>
                  {typeof bestUseCases === 'string'
                    ? renderUseCaseItem(bestUseCases)
                    : bestUseCases.map(useCase => renderUseCaseItem(useCase))
                  }
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Section with fixed product cards */}
      {products && products.length > 0 && (
        <div className="maylike-products-wrapper" style={{
          margin: '50px 0',
          padding: '0 20px', // Adjusted padding for smaller screens
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '1.75rem',
            fontWeight: 'bold',
            marginBottom: '30px'
          }}>You may also like</h2>
          <div className="marquee"> {/* This class name might imply animation, ensure it's handled or static */}
            <div className="maylike-products-container track" style={{ // 'track' also implies animation
              display: 'flex',
              gap: '20px',
              flexWrap: 'nowrap', // Important for horizontal scrolling
              overflowX: 'auto', // Enable horizontal scrolling
              paddingBottom: '15px', // Space for scrollbar
              paddingLeft: '10px', // Padding for start of scroll
              paddingRight: '10px', // Padding for end of scroll
              scrollPadding: '20px', // Ensures items don't snap too close to edges
              WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
              scrollbarWidth: 'thin', // For Firefox
              scrollbarColor: '#ccc transparent' // For Firefox
            }}>
              {products.map((item) => (
                // Ensure item and item.slug exist before creating Link
                item && item.slug && item.slug.current ? (
                  <Link href={`/product/${item.slug.current}`} key={item._id || `product-${Math.random()}`}>
                    <div className="product-card" style={{
                      flexShrink: 0, // Prevent cards from shrinking
                      width: '220px', // Fixed width
                      height: '300px', // Fixed height
                      padding: '10px',
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      position: 'relative', // For discount badge
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      overflow: 'hidden' // Clip content if it overflows
                    }}
                    // Hover effects
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                    }}>
                      {item.discount > 0 && (
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          backgroundColor: '#e53935', // Red for discount
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '5px',
                          fontSize: '0.75em',
                          fontWeight: 'bold',
                          zIndex: 10, // Above image
                          lineHeight: '1', // Ensure single line
                          whiteSpace: 'nowrap' // Prevent wrapping
                        }}>
                          {item.discount}% OFF
                        </div>
                      )}
                      <div style={{
                        height: '180px', // Fixed height for image container
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '10px',
                        overflow: 'hidden', // Ensure image fits
                        backgroundColor: '#f9f9f9', // Light background for image area
                        borderRadius: '4px' // Rounded corners for image area
                      }}>
                        <img
                          src={
                            item.image && item.image[0] && item.image[0].asset
                              ? urlFor(item.image[0]).width(200).url() // Optimized image size
                              : '/asset/placeholder-image.jpg'
                          }
                          alt={item.name || 'Product Image'}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain', // Ensure entire image is visible
                            objectPosition: 'center'
                          }}
                          onError={(e) => {
                            console.error('Related product image load failed for:', item.name, 'from URL:', e.target.src);
                            e.target.src = '/asset/placeholder-image.jpg';
                            // Ensure placeholder styles are consistent
                            e.target.style.maxWidth = '100%';
                            e.target.style.maxHeight = '100%';
                            e.target.style.width = 'auto';
                            e.target.style.height = 'auto';
                            e.target.style.objectFit = 'contain';
                          }}
                        />
                      </div>
                      <div style={{
                        padding: '0 5px', // Padding for text content
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1, // Allow this section to take remaining space
                        justifyContent: 'space-between', // Pushes price to bottom
                        minHeight: '90px' // Ensure consistent height for text area
                      }}>
                        <p style={{
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          color: '#333',
                          marginBottom: '5px',
                          textAlign: 'center',
                          width: '100%',
                          lineHeight: '1.3em', // Control line height
                          maxHeight: `calc(1.3em * 2)`, // Limit to 2 lines
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box', // For multi-line ellipsis
                          WebkitLineClamp: 2, // Number of lines
                          WebkitBoxOrient: 'vertical',
                        }}>
                          {item.name && item.name.includes('Radiant') && <span style={{ marginRight: '5px' }}>⚡</span>}
                          {item.name && item.name.includes('HyperVision') && <span style={{ marginRight: '5px' }}>🔥</span>}
                          {item.name && item.name.includes('Titan') && <span style={{ marginRight: '5px' }}>⚡</span>}
                          {item.name && item.name.includes('Quantum') && <span style={{ marginRight: '5px' }}>🔵</span>}
                          {item.name && item.name.includes('Nexus') && <span style={{ marginRight: '5px' }}>🔵</span>}
                          {item.name || 'Product'}
                        </p>
                        <p style={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          color: '#f02d34', // Red price
                          textAlign: 'center',
                          display: 'flex', // For aligning original price and discount
                          justifyContent: 'center',
                          alignItems: 'baseline',
                          flexWrap: 'wrap', // Allow wrapping if needed
                          gap: '5px' // Space between current and original price
                        }}>
                          ${(item.discount > 0 && item.price
                            ? (item.price * (1 - (item.discount || 0) / 100))
                            : item.price || 0
                          ).toFixed(2)}

                          {item.discount > 0 && item.price && (
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "#999",
                                textDecoration: "line-through",
                                whiteSpace: 'nowrap' // Prevent breaking
                              }}
                            >
                              ${item.price.toFixed(2)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : null // Return null if item or slug is missing
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {showSizeChartModal && sizeChart && sizeChart.asset && (
        <div
          className="size-chart-modal-overlay"
          onClick={() => setShowSizeChartModal(false)} // Close on overlay click
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000, // Ensure it's on top
            backdropFilter: 'blur(5px)', // Optional: blur background
            WebkitBackdropFilter: 'blur(5px)' // For Safari
          }}
        >
          <div
            className="size-chart-modal-content"
            onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              position: 'relative',
              maxWidth: '90%', // Responsive width
              maxHeight: '90%', // Responsive height
              overflow: 'auto', // Scroll if content is too large
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            }}
          >
            <button
              className="close-modal-btn"
              aria-label="Close size chart" // Accessibility
              onClick={() => setShowSizeChartModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem', // Larger close icon
                cursor: 'pointer',
                color: '#333', // Darker color for better visibility
                padding: '5px' // Easier to click
              }}
            >
              <IoClose />
            </button>
            <h3 style={{ marginBottom: '15px', color: '#333', textAlign: 'center' }}>Size Chart</h3>
            <img
              src={urlFor(sizeChart).url()}
              alt={`${name || 'Product'} Size Chart`}
              style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} // Center image
              onError={(e) => {
                console.error('Size chart image load failed for:', name, 'from URL:', e.target.src);
                e.target.src = '/asset/placeholder-size-chart.jpg'; // Fallback placeholder
                e.target.style.maxWidth = '100%';
                e.target.style.height = 'auto';
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
};

export const getStaticPaths = async () => {
  const query = `*[_type == "product" && defined(slug.current)] { slug { current } }`; // Ensure slug is defined
  const productsData = await client.fetch(query);

  const paths = productsData
    .filter(p => p.slug && p.slug.current) // Additional safety check
    .map((p) => ({
      params: { slug: p.slug.current }
    }));

  return { paths, fallback: 'blocking' }
};

export const getStaticProps = async ({ params: { slug } }) => {
  try {
    if (typeof slug !== 'string' || !slug) { // Check for empty slug too
      console.warn('Invalid or missing slug:', slug);
      return {
        notFound: true // Use notFound directly
      };
    }

    // UPDATED QUERY: Added 'specifications'
    const currentProductQuery = `*[_type == "product" && slug.current == '${slug}'][0]{
      _id,
      name,
      details,
      price,
      discount,
      inventory,
      image[]{
        _key, asset->{_id, url}
      },
      specialty, pros, cons, bestUseCases,
      "variants": variants[]{
        _key,
        colorName,
        colorHex,
        size,
        variantPrice,
        variantDiscount,
        variantStock,
        variantImage{
          _key, asset->{_id, url}
        }
      },
      sizeChart{
        _key, asset->{_id, url}
      },
      specifications[]{_key, feature, value} // Fetch specifications here
    }`;

    const allProductsQuery = `*[_type == "product" && defined(slug.current)]{
      _id,
      name,
      slug,
      price,
      discount,
      image[]{
        _key, asset->{_id, url}
      }
    }`; // Filter for products with defined slugs for related items

    const fetchedProduct = await client.fetch(currentProductQuery);
    const fetchedProducts = await client.fetch(allProductsQuery);

    if (!fetchedProduct) {
      console.warn('Product not found for slug:', slug);
      return { notFound: true };
    }

    return {
      props: {
        product: fetchedProduct,
        products: fetchedProducts.filter(p => p._id !== fetchedProduct._id) || [] // Exclude current product from related
      },
      revalidate: 60 // Increased revalidate time
    };
  } catch (error) {
    console.error('Error fetching product in getStaticProps for slug', slug, ':', error);
    return { notFound: true }; // Return notFound on error
  }
};

export default ProductDetails;