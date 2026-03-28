// schemaTypes/schema.js
import product from './product';
import banner from './banner';
import order from './order';
import user from './user';
import category from './category';
import aboutUs from './aboutUs';
import contactMessage from './contactMessage';
import footerSettings from './footerSettings';
import newsletterSubscriber from './newsletterSubscriber';

export default {
  name: 'default',
  types: [
    product,
    category,
    banner,
    order,
    user,
    aboutUs,
    contactMessage,
    footerSettings,
    newsletterSubscriber,  // Newsletter subscribers schema
  ],
};