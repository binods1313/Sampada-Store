// sanity_abscommerce/structure.js
// Optional: Import icons
// Install if needed: npm install @sanity/icons
import { PackageIcon, BillIcon, ComposeIcon, UsersIcon } from '@sanity/icons';

// Define your custom desk structure
export const structure = (S) =>
  S.list()
    .title('Content Management')
    .items([
      // --- ORDERS ---
      S.listItem()
        .title('Orders')
        .schemaType('order')
        .icon(BillIcon) // Optional
        .child(
          S.documentTypeList('order')
            .title('Customer Orders')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
        ),

      S.divider(), // Optional

      // --- E-COMMERCE CONTENT ---
      S.listItem()
        .title('Products')
        .schemaType('product')
        .icon(PackageIcon) // Optional
        .child(S.documentTypeList('product').title('Products')),

      S.listItem()
        .title('Banners')
        .schemaType('banner')
        .icon(ComposeIcon) // Optional
        .child(S.documentTypeList('banner').title('Banners')),

      S.listItem()
        .title('Categories')
        .schemaType('category')
        .icon(PackageIcon) // You can use a different icon if you want
        .child(S.documentTypeList('category').title('Categories')),

      S.divider(), // Optional

      // --- USERS (if you kept the user schema) ---
      // Keep this section ONLY if you kept schemas/user.js and included 'user' in schemaTypes/schema.js
      S.listItem()
        .title('Users') // User profiles (potentially created by adapter on first login)
        .schemaType('user')
        .icon(UsersIcon) // Optional
        .child(S.documentTypeList('user').title('Users')),
      // ---------------------------------------------


      // --- REMOVED ADAPTER-SPECIFIC ITEMS ---
      // S.listItem()
      //   .title('Accounts') // Removed as schema type 'account' was deleted
      //   .schemaType('account')
      //   .icon(LockIcon)
      //   .child(S.documentTypeList('account').title('Accounts')),
      //
      // S.listItem()
      //   .title('Sessions') // Removed as schema type 'session' was deleted
      //   .schemaType('session')
      //   .icon(CogIcon)
      //   .child( /* ... */ ),
      //
      // S.listItem()
      //   .title('Verification Tokens') // Removed as schema type 'verificationToken' was deleted
      //   .schemaType('verificationToken')
      //   .icon(EnvelopeIcon)
      //   .child( /* ... */ ),
      // --------------------------------------
    ]);