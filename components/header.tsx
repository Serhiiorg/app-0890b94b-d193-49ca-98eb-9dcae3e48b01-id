"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X } from "lucide-react";

interface HeaderProps {
  cartItemCount?: number;
}

export function Header({ cartItemCount = 0 }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-background transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary mr-2 relative">
                <div className="absolute top-0 right-0 w-3 h-3 bg-secondary rounded-full"></div>
              </div>
              <span className="font-sans text-xl font-bold">
                Tomato Harvest
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="font-sans font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="font-sans font-medium text-foreground hover:text-primary transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="font-sans font-medium text-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center">
            <div className="relative mr-6">
              <input
                type="text"
                placeholder="Search products..."
                className="w-64 px-4 py-2 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary">
                <Search size={18} />
              </button>
            </div>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative flex items-center text-foreground hover:text-primary transition-colors"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            {/* Mobile Cart Icon */}
            <Link
              href="/cart"
              className="relative flex items-center text-foreground hover:text-primary transition-colors"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleMenu}
              className="text-foreground hover:text-primary transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="font-sans font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="font-sans font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="font-sans font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              {/* Mobile Search */}
              <div className="relative mt-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary">
                  <Search size={18} />
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
