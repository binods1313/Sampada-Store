// sanity_abscommerce/structure.js
import { 
  PackageIcon, 
  BillIcon, 
  ComposeIcon, 
  UsersIcon, 
  MenuIcon, 
  DocumentsIcon, 
  InfoOutlineIcon,
  HelpCircleIcon,
  BookIcon,
  EnvelopeIcon,
  CogIcon,
  TagIcon,
  HeartIcon,
  HomeIcon,
  UserIcon
} from '@sanity/icons';

// Define your custom desk structure
export const structure = (S) =>
  S.list()
    .title('Content Management')
    .items([
      // --- ORDERS ---
      S.listItem()
        .title('Orders')
        .schemaType('order')
        .icon(BillIcon)
        .child(
          S.documentTypeList('order')
            .title('Customer Orders')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
        ),

      S.divider(),

      // --- E-COMMERCE CONTENT ---
      S.listItem()
        .title('Products')
        .schemaType('product')
        .icon(PackageIcon)
        .child(S.documentTypeList('product').title('Products')),

      S.listItem()
        .title('Categories')
        .schemaType('category')
        .icon(TagIcon)
        .child(S.documentTypeList('category').title('Categories')),

      S.listItem()
        .title('Banners')
        .schemaType('banner')
        .icon(ComposeIcon)
        .child(S.documentTypeList('banner').title('Banners')),

      S.divider(),

      // --- PAGES ---
      S.listItem()
        .title('Pages')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('About Us')
                .schemaType('aboutUs')
                .icon(InfoOutlineIcon)
                .child(S.documentTypeList('aboutUs').title('About Us')),
              S.listItem()
                .title('Company Page')
                .schemaType('company')
                .icon(HomeIcon)
                .child(S.documentTypeList('company').title('Company Page')),
              S.listItem()
                .title('Support Page')
                .schemaType('support')
                .icon(HelpCircleIcon)
                .child(S.documentTypeList('support').title('Support Page')),
              S.listItem()
                .title('Team Page')
                .schemaType('team')
                .icon(UsersIcon)
                .child(S.documentTypeList('team').title('Team Page')),
              S.listItem()
                .title('Sampada Stories Page')
                .schemaType('storiesPage')
                .icon(BookIcon)
                .child(S.documentTypeList('storiesPage').title('Sampada Stories Page')),
              S.listItem()
                .title('Contact Page')
                .schemaType('contactPage')
                .icon(EnvelopeIcon)
                .child(S.documentTypeList('contactPage').title('Contact Page')),
            ])
        ),

      S.listItem()
        .title('Stories')
        .schemaType('story')
        .icon(BookIcon)
        .child(S.documentTypeList('story').title('Stories')),

      S.divider(),

      // --- COMMUNICATIONS ---
      S.listItem()
        .title('Communications')
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title('Communications')
            .items([
              S.listItem()
                .title('Contact Messages')
                .schemaType('contactMessage')
                .icon(EnvelopeIcon)
                .child(S.documentTypeList('contactMessage').title('Contact Messages')),
              S.listItem()
                .title('Newsletter Subscribers')
                .schemaType('newsletterSubscriber')
                .icon(HeartIcon)
                .child(S.documentTypeList('newsletterSubscriber').title('Newsletter Subscribers')),
            ])
        ),

      S.divider(),

      // --- SYSTEM & NAVIGATION ---
      S.listItem()
        .title('Navigation Menu')
        .schemaType('navigation')
        .icon(MenuIcon)
        .child(S.documentTypeList('navigation').title('Navigation Menu')),

      S.listItem()
        .title('Footer Settings')
        .schemaType('footerSettings')
        .icon(CogIcon)
        .child(S.documentTypeList('footerSettings').title('Footer Settings')),

      S.listItem()
        .title('Users')
        .schemaType('user')
        .icon(UserIcon)
        .child(S.documentTypeList('user').title('Users')),
    ]);
