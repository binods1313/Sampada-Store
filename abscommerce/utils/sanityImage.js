// utils/sanityImage.js
import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanityClient';

// Setup image URL builder
const builder = imageUrlBuilder(client);

// Function to generate image URLs
export function urlFor(source) {
  return builder.image(source);
}

// Function to generate image props with blur data URL
export function getImageProps(image) {
  if (!image) return null;
  
  // Generate the main image URL
  const imageUrl = urlFor(image).url();
  
  // Generate a small, blurred version for the placeholder
  const blurUrl = urlFor(image)
    .width(20)
    .height(20)
    .blur(10)
    .url();
  
  return {
    src: imageUrl,
    blurDataURL: blurUrl,
    placeholder: 'blur'
  };
}