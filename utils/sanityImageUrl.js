// Check if your existing sanityImageUrl.js has similar functionality
// If not, add this function to handle blur placeholders

import { client } from './sanityClient'
import imageUrlBuilder from '@sanity/image-url'

// Setup the image URL builder (if not already set up in your file)
const builder = imageUrlBuilder(client)

// Function to get image URL from Sanity image reference
export function urlFor(source) {
  return builder.image(source)
}

// Add this function to your existing sanityImageUrl.js
export function getImageProps(image) {
  // Safely extract dimensions if they exist
  const dimensions = image?.asset?.metadata?.dimensions || { width: 1160, height: 870 }
  const { width, height } = dimensions
  
  // Create the URL
  const imageUrl = urlFor(image)
    .width(1160)
    .height(870)
    .auto('format')
    .url()
  
  // Create a very small image URL for blur placeholder
  const blurUrl = urlFor(image)
    .width(20)  // Tiny image for blur
    .height(20)
    .blur(10)
    .url()
  
  return {
    src: imageUrl,
    width,
    height,
    alt: image.alt || '',
    placeholder: 'blur',
    blurDataURL: blurUrl,
  }
}