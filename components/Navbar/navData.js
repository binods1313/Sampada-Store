// components/Navbar/navData.js
// Navigation data - extracted to prevent recreation on every render

export const navData = [
  {
    title: "Men's Clothing",
    link: "/collections/mens-clothing",
    subcategories: [
      { name: "Sweatshirts", link: "/collections/mens-sweatshirts" },
      { name: "Hoodies", link: "/collections/mens-hoodies" },
      { name: "T-Shirts", link: "/collections/mens-tshirts" },
      { name: "Long Sleeves", link: "/collections/mens-long-sleeves" },
      { name: "Outerwear", link: "/collections/mens-outerwear" },
    ]
  },
  {
    title: "Women's Clothing",
    link: "/collections/womens-clothing",
    subcategories: [
      { name: "Sweatshirts", link: "/collections/womens-sweatshirts" },
      { name: "Hoodies", link: "/collections/womens-hoodies" },
      { name: "T-Shirts", link: "/collections/womens-tshirts" },
      { name: "Skirts & Dresses", link: "/collections/womens-dresses" },
      { name: "Outerwear", link: "/collections/womens-outerwear" },
    ]
  },
  {
    title: "His & Hers",
    link: "/collections/his-hers",
    subcategories: [
      { name: "Casuals - Fixed Designs", link: "/collections/his-hers-casuals" },
      { name: "Customized - Personalized", link: "/collections/his-hers-customized" },
    ]
  },
  {
    title: "Home & Living",
    link: "/collections/home-living",
    subcategories: [
      { name: "Mugs", link: "/collections/mugs" },
      { name: "Candles", link: "/collections/candles" },
      { name: "Decor", link: "/collections/home-decor" },
      { name: "Pillows", link: "/collections/pillows" },
      { name: "Bedding", link: "/collections/bedding" },
    ]
  },
  {
    title: "Sampada Stories",
    link: "/stories",
    subcategories: [
      { name: "Fashion", link: "/stories/fashion" },
      { name: "Trends", link: "/stories/trends" },
      { name: "Behind-the-Scenes", link: "/stories/behind-the-scenes" },
      { name: "Product Stories", link: "/stories/product-stories" },
    ]
  }
];
