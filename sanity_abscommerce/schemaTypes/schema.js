// schemaTypes/schema.js
import product from './product';         // Your updated product schema
import banner from './banner';
import order from './order';
import user from './user';             // For NextAuth JWT
import category from './category';       // Your new category schema
// Optional: Keep if product descriptions or other fields use it
// import blockContent from './blockContent';

export default {
  name: 'default',
  types: [
    // Add 'category' to the list
    product,
    category, // Add category here
    banner,
    order,
    user,
    // blockContent, // Add back if needed
  ],
};