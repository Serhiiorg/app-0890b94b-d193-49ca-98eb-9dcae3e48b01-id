"use client";
import React from "react";
import Link from "next/link";
import {
  Send,
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary mr-2 relative">
                <div className="absolute top-0 right-0 w-3 h-3 bg-accent rounded-full"></div>
              </div>
              <span className="font-sans text-xl font-bold">
                Tomato Harvest
              </span>
            </div>

            <p className="text-secondary-foreground/80 mt-4">
              We grow and deliver the freshest, most flavorful tomatoes straight
              from our sustainable farms to your table.
            </p>

            <div className="flex space-x-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-secondary-foreground/80 hover:text-primary transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-secondary-foreground/80 hover:text-primary transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-secondary-foreground/80 hover:text-primary transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* About Us */}
          <div className="space-y-4">
            <h3 className="font-sans text-lg font-semibold border-b border-secondary-foreground/20 pb-2">
              About Us
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <span className="text-secondary-foreground/80">
                  Farm Tours (Coming soon!)
                </span>
              </li>
              <li>
                <span className="text-secondary-foreground/80">
                  Sustainability (Coming soon!)
                </span>
              </li>
              <li>
                <span className="text-secondary-foreground/80">
                  Blog (Coming soon!)
                </span>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-sans text-lg font-semibold border-b border-secondary-foreground/20 pb-2">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-secondary-foreground/80">
                  Terms of Service (Coming soon!)
                </span>
              </li>
              <li>
                <span className="text-secondary-foreground/80">
                  Privacy Policy (Coming soon!)
                </span>
              </li>
              <li>
                <span className="text-secondary-foreground/80">
                  Shipping Information (Coming soon!)
                </span>
              </li>
              <li>
                <span className="text-secondary-foreground/80">
                  FAQs (Coming soon!)
                </span>
              </li>
              <li>
                <span className="text-secondary-foreground/80">
                  Returns & Refunds (Coming soon!)
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Information and Newsletter */}
          <div className="space-y-4">
            <h3 className="font-sans text-lg font-semibold border-b border-secondary-foreground/20 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 text-primary" />
                <span className="text-secondary-foreground/80">
                  123 Tomato Lane, Farmville, CA 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-primary" />
                <span className="text-secondary-foreground/80">
                  (555) 123-4567
                </span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary" />
                <span className="text-secondary-foreground/80">
                  info@tomatoharvest.com
                </span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="font-sans font-medium mb-2">
                Subscribe to our newsletter
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 bg-secondary-foreground/10 text-secondary-foreground placeholder-secondary-foreground/50 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary w-full"
                />
                <button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-r-md flex items-center transition-colors"
                  aria-label="Subscribe"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-secondary-700 py-4">
        <div className="container mx-auto px-4 text-center text-secondary-foreground/70 text-sm">
          © {currentYear} Tomato Harvest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
