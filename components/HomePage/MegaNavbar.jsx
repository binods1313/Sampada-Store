// components/HomePage/MegaNavbar.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCartContext } from "../../context/CartContext";
import { useUIContext } from "../../context/StateContext";
import LoginModal from "../LoginModal";
import { AiOutlineShopping } from "react-icons/ai";

const menuItems = {
  "Men's Clothing": {
    href: "/collections/mens-tshirts",
    sections: {
      "SHOP BY PRODUCT": [
        "T-shirts", "Hoodies", "Sweatshirts", "Long Sleeves",
        "Tank Tops", "Sportswear", "Bottoms", "Swimwear",
        "Shoes", "Outerwear"
      ]
    }
  },
  "Women's Clothing": {
    href: "/collections/womens-tshirts",
    sections: {
      "SHOP BY PRODUCT": [
        "T-shirts", "Hoodies", "Sweatshirts", "Long Sleeves",
        "Tank Tops", "Skirts & Dresses", "Sportswear",
        "Bottoms", "Swimwear", "Shoes", "Outerwear"
      ]
    }
  },
  "His & Hers": {
    href: "/collections/his-hers",
    sections: {
      "SHOP BY PRODUCT": [
        "Matching Sets", "Couples T-shirts", "Hoodies",
        "Sweatshirts", "Bottoms", "Accessories"
      ]
    }
  },
  "Accessories": {
    href: "/category/accessories",
    sections: {
      "SHOP BY PRODUCT": [
        "Jewelry", "Phone Cases", "Bags", "Socks", "Hats",
        "Underwear", "Baby Accessories", "Mouse Pads"
      ],
      "MORE": [
        "Tech Accessories", "Travel Accessories",
        "Stationery", "Sports & Games",
        "Face Masks", "Kitchen Accessories",
        "Car Accessories", "Other"
      ]
    }
  },
  "Home & Living": {
    href: "/collections/home-living",
    sections: {
      "SHOP BY PRODUCT": [
        "Mugs", "Candles", "Posters", "Canvas",
        "Blankets", "Pillows & Covers", "Towels",
        "Journals & Notebooks"
      ],
      "MORE": [
        "Home Decor", "Glassware", "Bottles & Tumblers",
        "Rugs & Mats", "Bedding", "Bathroom",
        "Seasonal Decorations", "Food - Health - Beauty"
      ]
    }
  }
};

export default function MegaNavbar() {
  const { setShowCart } = useUIContext();
  const { totalQuantities = 0 } = useCartContext();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex flex-row items-center justify-between">

          {/* Logo */}
          <Link href="/" className="font-extrabold text-2xl text-black shrink-0 mr-8">
            Sampada
          </Link>

          {/* Nav */}
          <nav className="flex flex-row items-center gap-1 flex-1">

            {/* Simple link — Home */}
            <Link href="/"
                  className="px-3 py-5 text-sm font-bold text-gray-800 hover:text-black whitespace-nowrap transition-colors">
              Home
            </Link>

            {/* Mega dropdown items */}
            {Object.entries(menuItems).map(([label, data]) => (
              <div key={label} className="relative group">
                <Link href={data.href}
                      className="px-3 py-5 text-sm font-bold text-gray-800
                                 hover:text-black whitespace-nowrap flex items-center gap-1 transition-colors">
                  {label}
                  <span className="text-xs">▾</span>
                </Link>

                {/* Dropdown panel */}
                <div className="absolute top-full left-0 hidden group-hover:flex
                                bg-white border border-gray-200 shadow-2xl
                                p-8 gap-12 z-50 min-w-[400px]">
                  {Object.entries(data.sections).map(([sectionTitle, items]) => (
                    <div key={sectionTitle}>
                      <h3 className="text-xs font-extrabold text-gray-900
                                     uppercase tracking-wider mb-4">
                        {sectionTitle}
                      </h3>
                      <ul className="flex flex-col gap-2">
                        {items.map(item => (
                          <li key={item}>
                            <Link href={`${data.href}/${item.toLowerCase().replace(/[ &]/g, '-').replace(/--/g, '-')}`}
                                  className="text-sm text-gray-600 hover:text-black hover:underline transition-colors">
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Simple links — Stories, Contact */}
            <Link href="/stories"
                  className="px-3 py-5 text-sm font-bold text-gray-800 hover:text-black whitespace-nowrap transition-colors">
              Sampada Stories
            </Link>
            <Link href="/contact"
                  className="px-3 py-5 text-sm font-bold text-gray-800 hover:text-black whitespace-nowrap transition-colors">
              Contact
            </Link>
          </nav>

          {/* RIGHT — Actions */}
          <div className="flex flex-row items-center gap-3 shrink-0">
            {!session && !loading && (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md
                           text-sm font-semibold hover:bg-red-700 whitespace-nowrap transition-colors"
              >
                Sign In
              </button>
            )}
            {session?.user && (
              <Link
                href="/account"
                className="text-sm font-semibold text-gray-800 hover:text-black whitespace-nowrap transition-colors"
              >
                {session.user.name || "Account"}
              </Link>
            )}

            <button
              onClick={() => setShowCart(true)}
              className="relative text-2xl p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Open Cart"
            >
              <AiOutlineShopping />
              {totalQuantities > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {totalQuantities}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
