// components/HomePage/MegaNavbar.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCartContext } from "../../context/CartContext";
import { useUIContext } from "../../context/StateContext";
import LoginModal from "../LoginModal";
import { AiOutlineShopping } from "react-icons/ai";

export default function MegaNavbar() {
  const { setShowCart } = useUIContext();
  const { totalQuantities = 0 } = useCartContext();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200
                         sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16
                        flex flex-row items-center justify-between">

          {/* Logo */}
          <Link href="/"
                className="font-extrabold text-2xl text-black tracking-tight shrink-0">
            Sampada
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex flex-row items-center gap-5
                          text-sm font-semibold text-gray-700">
            <Link href="/" className="hover:text-black whitespace-nowrap">Home</Link>
            <Link href="/collections/mens-tshirts" className="hover:text-black whitespace-nowrap">Men's Clothing</Link>
            <Link href="/collections/womens-tshirts" className="hover:text-black whitespace-nowrap">Women's Clothing</Link>
            <Link href="/collections/his-hers" className="hover:text-black whitespace-nowrap">His & Hers</Link>
            <Link href="/category/accessories" className="hover:text-black whitespace-nowrap">Accessories</Link>
            <Link href="/collections/home-living" className="hover:text-black whitespace-nowrap">Home & Living</Link>
            <Link href="/stories" className="hover:text-black whitespace-nowrap">Sampada Stories</Link>
            <Link href="/contact" className="hover:text-black whitespace-nowrap">Contact</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex flex-row items-center gap-3 shrink-0">
            {!session && !loading && (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md
                           text-sm font-semibold hover:bg-red-700 whitespace-nowrap"
              >
                Sign In
              </button>
            )}
            {session?.user && (
              <Link
                href="/account"
                className="text-sm font-semibold text-gray-700 hover:text-black whitespace-nowrap"
              >
                {session.user.name || "Account"}
              </Link>
            )}

            <button
              onClick={() => setShowCart(true)}
              className="relative text-xl p-2 hover:bg-gray-100 rounded-full"
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
