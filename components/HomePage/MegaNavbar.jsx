// components/HomePage/MegaNavbar.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCartContext } from "../../context/CartContext";
import { useUIContext } from "../../context/StateContext";
import LoginModal from "../LoginModal";
import { AiOutlineShopping } from "react-icons/ai";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  TrendingUp,
  Star,
  Shirt,
  Heart,
  Home,
  Gift,
  Smartphone,
  Baby,
  Pet,
  Car,
  Plane,
  BookOpen,
  Coffee,
  Music,
  Gamepad2,
} from "lucide-react";

// Helper to generate slug from label
const toSlug = (label) =>
  label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

// Category data with subcategories
const CATEGORIES = [
  {
    label: "Men's Clothing",
    href: "/collections/mens-tshirts",
    subcategories: [
      "Sweatshirts",
      "Hoodies",
      "T-shirts",
      "Long Sleeves",
      "Tank Tops",
      "Sportswear",
      "Bottoms",
      "Swimwear",
      "Shoes",
      "Outerwear",
    ],
    icon: Shirt,
  },
  {
    label: "Women's Clothing",
    href: "/collections/womens-tshirts",
    subcategories: [
      "Sweatshirts",
      "T-shirts",
      "Hoodies",
      "Long Sleeves",
      "Tank Tops",
      "Skirts & Dresses",
      "Sportswear",
      "Bottoms",
      "Swimwear",
      "Shoes",
      "Outerwear",
    ],
    icon: Heart,
  },
  {
    label: "His & Hers",
    href: "/collections/his-hers",
    subcategories: [
      "Matching Sets",
      "Couples T-shirts",
      "Hoodies",
      "Sweatshirts",
      "Bottoms",
      "Accessories",
    ],
    icon: Gift,
  },
  {
    label: "Accessories",
    href: "/category/accessories",
    subcategories: [
      "Jewelry",
      "Phone Cases",
      "Bags",
      "Socks",
      "Hats",
      "Underwear",
      "Baby Accessories",
      "Mouse Pads",
      "Pets",
      "Kitchen Accessories",
      "Car Accessories",
      "Tech Accessories",
      "Travel Accessories",
      "Stationery Accessories",
      "Sports & Games",
      "Face Masks",
      "Other",
    ],
    icon: Smartphone,
  },
  {
    label: "Home & Living",
    href: "/collections/home-living",
    subcategories: [
      "Mugs",
      "Candles",
      "Ornaments",
      "Seasonal Decorations",
      "Glassware",
      "Bottles & Tumblers",
      "Canvas",
      "Posters",
      "Postcards",
      "Journals & Notebooks",
      "Magnets & Stickers",
      "Home Decor",
      "Blankets",
      "Pillows & Covers",
      "Towels",
      "Bathroom",
      "Rugs & Mats",
      "Bedding",
      "Food - Health - Beauty",
    ],
    icon: Home,
  },
];

// Icon mapping for Accessories subcategories
const ACCESSORY_ICONS = {
  "Baby Accessories": Baby,
  Pets: Pet,
  "Car Accessories": Car,
  "Travel Accessories": Plane,
  "Stationery Accessories": BookOpen,
  "Kitchen Accessories": Coffee,
  "Tech Accessories": Smartphone,
  "Sports & Games": Gamepad2,
};

// Left panel content component
const LeftPanel = ({ category }) => {
  const IconComponent = category.icon || Shirt;

  return (
    <div className="flex flex-col gap-3 w-[280px] pr-6">
      <div className="mb-2">
        <h4 className="text-sm font-semibold mb-3">Explore</h4>
        <div className="flex items-center gap-2 text-muted-foreground">
          <IconComponent className="h-4 w-4" />
          <span className="text-xs">{category.label}</span>
        </div>
      </div>

      <Separator />

      {/* New Arrivals Card */}
      <Link href="/new-arrivals" passHref legacyBehavior>
        <NavigationMenuLink asChild>
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">New Arrivals</p>
                <p className="text-xs text-muted-foreground">
                  Latest products
                </p>
              </div>
            </CardContent>
          </Card>
        </NavigationMenuLink>
      </Link>

      {/* Bestsellers Card */}
      <Link href="/bestsellers" passHref legacyBehavior>
        <NavigationMenuLink asChild>
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">Bestsellers</p>
                <p className="text-xs text-muted-foreground">
                  Customer favorites
                </p>
              </div>
            </CardContent>
          </Card>
        </NavigationMenuLink>
      </Link>
    </div>
  );
};

// Right panel content component
const RightPanel = ({ category }) => {
  return (
    <div className="flex-1 pl-6 border-l">
      <h4 className="text-sm font-semibold mb-4">Categories</h4>
      <ScrollArea className="h-[280px] pr-4">
        <div className="grid grid-cols-2 gap-2">
          {category.subcategories.map((sub) => {
            const slug = toSlug(sub);
            const IconComponent =
              category.label === "Accessories"
                ? ACCESSORY_ICONS[sub]
                : null;

            return (
              <Link
                key={sub}
                href={`/category/${slug}`}
                passHref
                legacyBehavior
              >
                <NavigationMenuLink
                  asChild
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm cursor-pointer"
                >
                  <div>
                    {IconComponent && (
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{sub}</span>
                  </div>
                </NavigationMenuLink>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

// Mega dropdown content component
const MegaDropdown = ({ category }) => {
  return (
    <div className="flex w-[700px] p-4">
      <LeftPanel category={category} />
      <RightPanel category={category} />
    </div>
  );
};

const MegaNavbar = () => {
  const { setShowCart } = useUIContext();
  const { totalQuantities = 0 } = useCartContext();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const staticLinks = [
    { label: "Home", href: "/" },
    { label: "Sampada Stories", href: "/stories" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 text-xl font-bold">
              Sampada
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {/* Static Links */}
                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Home
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  {/* Category Dropdowns */}
                  {CATEGORIES.map((category) => (
                    <NavigationMenuItem key={category.label}>
                      <NavigationMenuTrigger className="text-sm">
                        {category.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <MegaDropdown category={category} />
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}

                  {/* Static Links */}
                  <NavigationMenuItem>
                    <Link
                      href="/stories"
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Sampada Stories
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link
                      href="/contact"
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Contact
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Sign In / User */}
              {!session && !loading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hidden sm:inline-flex"
                >
                  Sign In
                </Button>
              )}
              {session?.user && (
                <Link
                  href="/account"
                  className="text-sm font-medium hover:underline hidden sm:inline-block"
                >
                  {session.user.name || "Account"}
                </Link>
              )}

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCart(true)}
                className="relative"
                aria-label="Open Cart"
              >
                <AiOutlineShopping className="h-5 w-5" />
                {totalQuantities > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                    {totalQuantities}
                  </span>
                )}
              </Button>

              {/* Mobile Menu Trigger */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Toggle menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <ScrollArea className="h-full py-6">
                    <div className="flex flex-col gap-4">
                      {/* Logo in mobile menu */}
                      <Link
                        href="/"
                        className="text-xl font-bold mb-4"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sampada
                      </Link>
                      <Separator />

                      {/* Static Links */}
                      {staticLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="text-sm font-medium py-2 hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}

                      <Separator />

                      {/* Category Links with Subcategories */}
                      {CATEGORIES.map((category) => (
                        <div key={category.label} className="space-y-2">
                          <Link
                            href={category.href}
                            className="text-base font-semibold py-2 block"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {category.label}
                          </Link>
                          <div className="pl-4 space-y-1 border-l-2 border-muted">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub}
                                href={`/category/${toSlug(sub)}`}
                                className="text-sm text-muted-foreground py-1 block hover:text-foreground transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {sub}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}

                      <Separator />

                      {/* Auth in mobile */}
                      {!session && (
                        <Button
                          variant="default"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setIsLoginModalOpen(true);
                          }}
                          className="w-full"
                        >
                          Sign In
                        </Button>
                      )}
                      {session?.user && (
                        <Link
                          href="/account"
                          className="text-sm font-medium py-2 text-muted-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {session.user.name || "Account"}
                        </Link>
                      )}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default MegaNavbar;
