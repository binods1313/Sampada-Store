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
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex flex-row items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-black">
            Sampada
          </Link>

          {/* Nav Links - horizontal */}
          <nav className="hidden md:flex flex-row items-center gap-6">
            <Link href="/" className="text-sm text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link href="/collections/mens-tshirts" className="text-sm text-gray-700 hover:text-gray-900">
              Men's Clothing
            </Link>
            <Link href="/collections/womens-tshirts" className="text-sm text-gray-700 hover:text-gray-900">
              Women's Clothing
            </Link>
            <Link href="/collections/his-hers" className="text-sm text-gray-700 hover:text-gray-900">
              His & Hers
            </Link>
            <Link href="/category/accessories" className="text-sm text-gray-700 hover:text-gray-900">
              Accessories
            </Link>
            <Link href="/collections/home-living" className="text-sm text-gray-700 hover:text-gray-900">
              Home & Living
            </Link>
            <Link href="/stories" className="text-sm text-gray-700 hover:text-gray-900">
              Sampada Stories
            </Link>
            <Link href="/contact" className="text-sm text-gray-700 hover:text-gray-900">
              Contact
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex flex-row items-center gap-4">
            {!session && !loading && (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Sign In
              </button>
            )}
            {session?.user && (
              <Link
                href="/account"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                {session.user.name || "Account"}
              </Link>
            )}

            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full"
              aria-label="Open Cart"
            >
              <AiOutlineShopping className="h-5 w-5" />
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
