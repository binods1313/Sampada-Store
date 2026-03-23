import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanityClient';

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  if (!source) {
    console.warn('urlFor received an invalid source:', source);
    return null; // Return null or a placeholder image URL
  }
  return builder.image(source);
}