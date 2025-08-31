// components/Product.jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '../lib/client'; // Import from the consolidated client.js

const Product = ({ product: { image, name, slug, price, discount } }) => {
  const hasDiscount = discount && discount > 0;
  const discountedPrice = hasDiscount ? price * (1 - (discount / 100)) : price;
      
  const firstImage = image && image[0] ? image[0] : null;
      
  // Use urlFor to get a higher quality image URL for better visibility
  const imageUrl = firstImage?.asset
    ? urlFor(firstImage).width(800).url() // Increased from 500px to 800px for better quality
    : '/asset/placeholder-image.jpg'; // Fallback placeholder
    
  return (
    <div className="product-card">
      <Link href={`/product/${slug?.current}`}>
        {/* This wrapper ensures the entire card content is clickable */}         
        {/* product-content-wrapper already has position: relative from your CSS */}
        <div className="product-content-wrapper"> 
          
          {/* Sale Badge - NOW POSITIONED ABSOLUTELY WITHIN product-content-wrapper */}             
          {hasDiscount && (               
            <div className="sale-badge">                 
               {discount}% OFF               
            </div>             
          )} 

          {/* Image Container: Made larger for better design visibility */}           
          <div className="product-image-container" style={{ 
              position: 'relative', // Essential for Next/Image fill prop
              width: '100%', 
              height: '240px', // Matches your desired height from CSS
              overflow: 'hidden', // Ensures image content stays within bounds and rounded corners apply
              display: 'flex', // Helps center the image visually if it's smaller
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f9f9f9' // Matches your CSS
            }}>
                        
            {/* Product Image (Next.js Image component) */}              
            <Image
              src={imageUrl}
              alt={name || 'Product Image'}
              fill // The fill prop makes the image fill its parent container (.product-image-container)
              sizes="(max-width: 768px) 100vw, 260px" // Adjusted sizes to match new card width
              className="product-image" // You can keep your class for additional styling
              priority // Prioritize loading for visible products
              style={{ 
                objectFit: 'contain', // THIS IS KEY: Preserve aspect ratio, fit inside the container
                objectPosition: 'center', // Center the image if it's smaller than the container
              }}
              onError={(e) => {
                console.error('Product card image load failed for:', name, 'from URL:', e.target.src);
                e.target.src = '/asset/placeholder-image.jpg'; // Fallback image
              }}
            />           
          </div>
                      
          {/* Product Name */}           
          <h2 className="product-card-name">{name}</h2>
                      
          {/* Price Display */}           
          {hasDiscount ? (             
            <div className="price-container">               
              <p className="original-price">                 
                ${price?.toFixed(2)}               
              </p>               
              <p className="discounted-price">                 
                ${discountedPrice?.toFixed(2)}               
              </p>             
            </div>           
          ) : (             
            <p className="price">               
              ${price?.toFixed(2)}             
            </p>           
          )}         
        </div>
      </Link>
    </div>
  );
};

export default Product;