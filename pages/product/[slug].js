// pages/product/[slug].js
import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { BsCheckCircleFill } from 'react-icons/bs';
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoClose } from 'react-icons/io5';
import { ShoppingBag, Zap } from 'lucide-react';
import { client, urlFor } from '../../lib/client';
import { useCartContext } from '../../context/CartContext';
import { useUIContext } from '../../context/StateContext';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { ReviewSystem } from '../../components/ReviewSystem';
import { WishlistButton } from '../../components/WishlistSystem';
import RelatedProductsCarousel from '../../components/RelatedProductsCarousel';
import ProductRecommendations from '../../components/Recommendations/ProductRecommendations';
import { trackViewItem, trackAddToCart } from '../../lib/analytics';
import '../../styles/sampada-premium-brand.css';


const ProductDetails = ({ product, products, slug }) => {
  // All hooks must be called before any early returns
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showSizeChartModal, setShowSizeChartModal] = useState(false);

  const { decQty, incQty, qty, onAdd, resetQty } = useCartContext();
  const { setShowCart } = useUIContext();

  // --- Initial selection of variants ---
  useEffect(() => {
    if (!product) return; // Guard clause

    resetQty();

    if (product.variants && product.variants.length > 0) {
      const uniqueColors = Array.from(new Set(product.variants.map(v => v.colorName))).filter(Boolean);

      if (uniqueColors.length > 0) {
        setSelectedColor(uniqueColors[0]);
        const variantsForFirstColor = product.variants.filter(v => v.colorName === uniqueColors[0]);
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
  }, [product, resetQty]); // Updated dependencies

  // 🎯 GA4: Track product view
  useEffect(() => {
    if (product) {
      trackViewItem({
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        currency: 'USD'
      });
    }
  }, [product]);

  // --- Update selectedVariant whenever selectedColor or selectedSize changes ---
  useEffect(() => {
    if (!product) return; // Guard clause

    if (selectedColor && selectedSize && product.variants) {
      const foundVariant = product.variants.find(
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
  }, [selectedColor, selectedSize, product]);

  // --- Handlers for variant selection ---
  const handleColorSelect = useCallback((colorName) => {
    if (!product) return;

    setSelectedColor(colorName);
    const variantsForColor = (product.variants || []).filter(v => v.colorName === colorName);
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'];
    const sortedSizes = variantsForColor.map(v => v.size).sort((a, b) => {
      return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
    });
    setSelectedSize(sortedSizes.length > 0 ? sortedSizes[0] : null);
  }, [product]);

  const handleSizeSelect = useCallback((size) => {
    setSelectedSize(size);
  }, []);

  // Early return after all hooks are called
  if (!product) {
    return <ErrorPage statusCode={404} title="Product not found" />;
  }

  // Destructure specifications from product
  const { _id, name, details, specialty, pros, cons, bestUseCases, variants, sizeChart, image, price, discount, inventory, specifications } = product;
  const basePrice = price || 0;
  const baseDiscount = discount || 0;

  const currentPrice = selectedVariant?.variantPrice ?? basePrice;
  const currentDiscount = selectedVariant?.variantDiscount ?? baseDiscount;
  const displayPrice = currentPrice * (1 - (currentDiscount / 100));

  const currentStock = variants && variants.length > 0
    ? (selectedVariant?.variantStock ?? 0)
    : (inventory ?? 0);

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

    // 🎯 GA4: Track add to cart event
    trackAddToCart([{
      id: _id,
      name: name,
      category: product.category?.name || '',
      price: currentPrice,
      quantity: qty,
      currency: 'USD'
    }]);
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
      <Head>
        <title>{`${name} – Sampada Custom Print`}</title>
        <meta name="description" content={`Shop Sampada custom ${name}. Premium print-on-demand with prosperity-inspired designs. Ships via Printify | Stripe Secure Checkout.`} />
      </Head>

      {/* Main product container with consistent spacing */}
      <div className="product-detail-container" style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Left side - Product image */}
        <div style={{
          flex: '1 1 40%',
          minWidth: '300px'
        }}>
          <div className="image-container" style={{
            backgroundColor: '#f1f1f1',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '16px',
            height: '500px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Image
              src={mainProductImageSource}
              className="product-detail-image"
              alt={name || 'Product Image'}
              width={600}
              height={500}
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
              }}
            />
          </div>
          {/* Small images (thumbnails) */}
          <div className="small-images-container" style={{
            display: 'flex',
            gap: '12px',
            marginTop: '16px',
            justifyContent: 'center',
            marginBottom: '24px'
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
                      <Image
                        src={urlFor(colorItem.variantImage).width(60).height(60).url()}
                        alt={colorItem.colorName}
                        width={60}
                        height={60}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          console.error('Variant thumbnail load failed for:', colorItem.colorName, 'from URL:', e.target.src);
                          e.target.src = '/asset/placeholder-image.jpg';
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
                    <Image
                      src={item.asset ? urlFor(item).width(60).url() : '/asset/placeholder-image.jpg'}
                      alt={`${name || 'Product'} - view ${i + 1}`}
                      width={60}
                      height={60}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        console.error('Product thumbnail load failed for:', name, 'from URL:', e.target.src);
                        e.target.src = '/asset/placeholder-image.jpg';
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
          <h1 className="product-title" style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#1a1a1a',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ color: '#C9A84C', fontSize: '24px' }}>⚡</span>
            {name}
          </h1>

          {/* Reviews */}
          <div className="reviews" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ color: '#C9A84C', fontSize: '18px', display: 'flex', gap: '2px' }}>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p style={{ marginLeft: '8px', color: '#666', fontSize: '14px' }}>(20)</p>
          </div>

          {/* Details section */}
          <div className="details-section" style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Details:</h4>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#4a4a4a' }}>{details}</p>
          </div>

          {/* Price Section */}
          <p className="product-price-sale" style={{
            fontSize: '26px',
            fontWeight: '800',
            color: '#8B1A1A',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            ${displayPrice.toFixed(2)}
            {currentDiscount > 0 && (
              <>
                <span style={{
                  fontSize: '16px',
                  color: '#999',
                  textDecoration: 'line-through'
                }}>
                  ${currentPrice.toFixed(2)}
                </span>
                <span style={{
                  fontSize: '11px',
                  color: '#ffffff',
                  fontWeight: '700',
                  background: '#8B1A1A',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  letterSpacing: '0.08em'
                }}>
                  -{currentDiscount}%
                </span>
              </>
            )}
          </p>

          {/* Printify/Stripe Trust Badge */}
          <div className="ships-via-banner" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            padding: '12px 16px',
            background: 'rgba(201, 168, 76, 0.08)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            borderRadius: '4px',
            fontSize: '13px',
            color: '#555'
          }}>
            <span style={{ fontSize: '16px' }}>📦</span>
            <span><strong>Ships via Printify</strong> | <strong>Stripe Secure Checkout</strong></span>
          </div>

          {/* Product Variants (Colors & Sizes) */}
          {variants && variants.length > 0 && (
            <div className="product-variants-section" style={{ marginBottom: '32px' }}>
              {/* Color Selection */}
              <div className="color-selector" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '12px', color: '#1a1a1a', fontSize: '14px' }}>
                  Color: <span style={{ fontWeight: '700', color: '#8B1A1A' }}>{selectedColor || 'Select Color'}</span>
                </h3>
                <div className="color-swatch-container" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
                        <Image
                          src={urlFor(colorItem.variantImage).width(50).height(50).url()}
                          alt={colorItem.colorName}
                          width={50}
                          height={50}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            console.error('Variant color swatch image load failed for:', colorItem.colorName, 'from URL:', e.target.src);
                            e.target.src = '/asset/placeholder-image.jpg';
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
              <div className="size-selector" style={{ marginTop: '20px', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '12px', color: '#1a1a1a', fontSize: '14px' }}>
                  Size: <span style={{ fontWeight: '700', color: '#8B1A1A' }}>{selectedSize || 'Select Size'}</span>
                </h3>
                <div className="size-selector-container" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                  className="size-chart-link"
                  style={{
                    marginTop: '12px',
                    background: 'none',
                    border: 'none',
                    color: '#C9A84C',
                    fontSize: '12px',
                    fontWeight: '600',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    letterSpacing: '0.05em'
                  }}
                >
                  Size Chart
                </button>
              )}

              {/* Selected Variant Summary and Stock Status */}
              <div className="selected-variant-display" style={{ 
                marginTop: '20px', 
                padding: '12px', 
                backgroundColor: 'rgba(201, 168, 76, 0.08)', 
                borderRadius: '4px',
                borderLeft: '3px solid #C9A84C'
              }}>
                <h4 style={{ fontWeight: '700', marginBottom: '8px', fontSize: '13px', color: '#1a1a1a' }}>
                  Selected: {selectedColor || 'Color'} / {selectedSize || 'Size'}
                </h4>
                {selectedVariant ? (
                  <p style={{ display: 'flex', alignItems: 'center', marginTop: '8px', fontSize: '13px' }}>
                    {currentStock > 0 ? (
                      <>
                        <BsCheckCircleFill style={{ color: '#2d7a2d', marginRight: '8px', fontSize: '16px' }} />
                        <span style={{ color: '#2d7a2d', fontWeight: '600' }}>In Stock ({currentStock} items)</span>
                      </>
                    ) : (
                      <>
                        <IoCloseCircleOutline style={{ color: '#8B1A1A', marginRight: '8px', fontSize: '16px' }} />
                        <span style={{ color: '#8B1A1A', fontWeight: '600' }}>Out of Stock</span>
                      </>
                    )}
                  </p>
                ) : (
                  <p style={{ color: '#888', marginTop: '8px', fontSize: '13px' }}>Please select a color and size to check availability.</p>
                )}
              </div>
            </div>
          )}
          {(!variants || variants.length === 0) && (
            <div className="selected-variant-display" style={{ 
              marginTop: '20px', 
              padding: '12px', 
              backgroundColor: 'rgba(201, 168, 76, 0.08)', 
              borderRadius: '4px',
              borderLeft: '3px solid #C9A84C',
              marginBottom: '24px'
            }}>
              <h4 style={{ fontWeight: '700', marginBottom: '8px', fontSize: '13px', color: '#1a1a1a' }}>Availability:</h4>
              <p style={{ display: 'flex', alignItems: 'center', fontSize: '13px' }}>
                {currentStock > 0 ? (
                  <>
                    <BsCheckCircleFill style={{ color: '#2d7a2d', marginRight: '8px', fontSize: '16px' }} />
                    <span style={{ color: '#2d7a2d', fontWeight: '600' }}>In Stock ({currentStock} items)</span>
                  </>
                ) : (
                  <>
                    <IoCloseCircleOutline style={{ color: '#8B1A1A', marginRight: '8px', fontSize: '16px' }} />
                    <span style={{ color: '#8B1A1A', fontWeight: '600' }}>Out of Stock</span>
                  </>
                )}
              </p>
            </div>
          )}

          {/* Quantity Controls with Premium Styling */}
          <div className="quantity-container" style={{
            display: 'inline-flex',
            alignItems: 'center',
            marginBottom: '30px',
            opacity: currentStock === 0 ? 0.6 : 1
          }}>
            <button
              onClick={decQty}
              type="button"
              disabled={currentStock === 0}
              aria-label="Decrease quantity"
              className="qty-btn"
              style={{
                width: '40px',
                height: '40px',
                cursor: currentStock === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '700',
                background: 'transparent',
                color: '#8B1A1A',
                border: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <AiOutlineMinus />
            </button>
            <span className="qty-display" style={{
              width: '48px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              fontWeight: '600',
              color: '#1a1a1a',
              borderLeft: '1px solid rgba(201, 168, 76, 0.4)',
              borderRight: '1px solid rgba(201, 168, 76, 0.4)',
              background: 'rgba(201, 168, 76, 0.05)'
            }}>
              {qty}
            </span>
            <button
              onClick={() => incQty(currentStock)}
              type="button"
              disabled={currentStock === 0}
              aria-label="Increase quantity"
              className="qty-btn"
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentStock === 0 ? 'not-allowed' : 'pointer',
                fontSize: '18px',
                fontWeight: '700',
                background: 'transparent',
                color: '#8B1A1A',
                border: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <AiOutlinePlus />
            </button>
          </div>

          {/* Action Buttons with Premium Styling */}
          <div className="action-buttons-container" style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '40px',
            flexWrap: 'wrap',
            marginTop: '30px',
            alignItems: 'center'
          }}>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={(variants && variants.length > 0 && !selectedVariant) || currentStock === 0}
              className="add-to-cart-btn"
              style={{
                minWidth: '200px',
                height: '56px',
                opacity: ((variants && variants.length > 0 && !selectedVariant) || currentStock === 0) ? 0.6 : 1
              }}
            >
              <ShoppingBag size={20} />
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={(variants && variants.length > 0 && !selectedVariant) || currentStock === 0}
              className="buy-now-btn"
              style={{
                minWidth: '200px',
                height: '56px',
                opacity: ((variants && variants.length > 0 && !selectedVariant) || currentStock === 0) ? 0.6 : 1
              }}
            >
              <Zap size={20} />
              Buy Now
            </button>
          </div>

          {/* Wishlist Button */}
          <div style={{ marginLeft: '10px', marginTop: '12px' }}>
            <WishlistButton
              product={{ _id, name, slug: { current: slug }, price, discount, image }}
              size="large"
            />
          </div>

          {/* Enhanced Virtual Try-On - Temporarily disabled for debugging */}
          {/* {process.env.NEXT_PUBLIC_FEATURE_ENHANCED_TRYON === 'true' && (
            <div style={{ marginBottom: '30px' }}>
              <EnhancedTryOn
                productId={_id}
                color={selectedColor}
                size={selectedSize}
              />
            </div>
          )} */}

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

      {/* Product Reviews Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '60px auto 0',
        padding: '0 20px'
      }}>
        <ReviewSystem
          productId={_id}
          reviews={[]} // You can fetch actual reviews from your CMS
          onAddReview={async (reviewData) => {
            // Handle review submission - integrate with your backend
            console.log('Review submitted:', reviewData);
            toast.success('Review submitted successfully!');
          }}
          onUpdateReview={async (reviewId, updateData) => {
            // Handle review updates (helpful votes, replies)
            console.log('Review updated:', reviewId, updateData);
          }}
        />
      </div>

      {/* Related Products Section - Auto-scrolling carousel */}
      {products && products.length > 0 && (
        <div style={{
          margin: '50px 0',
          padding: '0 20px',
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '1.75rem',
            fontWeight: 'bold',
            marginBottom: '30px',
          }}>
            You may also like
          </h2>

          {/* Outer: clips overflow, hides scrollbar */}
          <div style={{
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
          }}>
            {/* Inner: actual scrolling track */}
            <RelatedProductsCarousel products={products} />
          </div>
        </div>
      )}

      {/* Product Recommendations - Same Category (NEW) */}
      {product.category?._ref && (
        <ProductRecommendations
          categoryId={product.category._ref}
          currentProductId={product._id}
        />
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
            <Image
              src={urlFor(sizeChart).url()}
              alt={`${name || 'Product'} Size Chart`}
              width={800}
              height={600}
              style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} // Center image
              onError={(e) => {
                console.error('Size chart image load failed for:', name, 'from URL:', e.target.src);
                e.target.src = '/asset/placeholder-size-chart.jpg'; // Fallback placeholder
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
      category->{
        _id,
        _ref,
        name,
        "slug": slug.current
      },
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
      },
      category
    }`;

    const fetchedProduct = await client.fetch(currentProductQuery);
    const allFetchedProducts = await client.fetch(allProductsQuery);

    if (!fetchedProduct) {
      console.warn('Product not found for slug:', slug);
      return { notFound: true };
    }

    // Filter related products: same category first, then fill with others
    let relatedProducts = allFetchedProducts
      .filter(p => p._id !== fetchedProduct._id)
      .filter(p => p.category && fetchedProduct.category && p.category._ref === fetchedProduct.category._ref);

    // If same category has < 8 products, fill with other products
    if (relatedProducts.length < 8) {
      const otherProducts = allFetchedProducts
        .filter(p => p._id !== fetchedProduct._id && !relatedProducts.find(rp => rp._id === p._id));
      relatedProducts = [...relatedProducts, ...otherProducts].slice(0, 8);
    }

    return {
      props: {
        product: fetchedProduct,
        products: relatedProducts || [],
        slug
      },
      revalidate: 60
    };
  } catch (error) {
    console.error('Error fetching product in getStaticProps for slug', slug, ':', error);
    return { notFound: true }; // Return notFound on error
  }
};

export default ProductDetails;