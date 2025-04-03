"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TruckIcon, Leaf, Clock, ChevronRight } from "lucide-react";
import { ProductGrid } from "@/components/productgrid";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Product } from "@/app/types";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const response = await fetch("/api/products?limit=4");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[500px] flex items-center">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1594057687713-5fd14eed1c17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
              alt="Fresh tomatoes on the vine"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-foreground/40"></div>
          </div>

          <div className="container mx-auto px-4 z-10">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-4 font-sans">
                Fresh Tomatoes Delivered to Your Door
              </h1>
              <p className="text-xl text-background/90 mb-8">
                Experience the garden-fresh taste of our sustainably grown
                tomatoes, harvested at peak ripeness and delivered directly to
                you.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors"
              >
                Shop Now
                <ChevronRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold font-sans">
                Featured Tomatoes
              </h2>
              <Link
                href="/shop"
                className="text-primary hover:text-primary/80 font-medium inline-flex items-center transition-colors"
              >
                View All
                <ChevronRight size={20} className="ml-1" />
              </Link>
            </div>

            {isLoading ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  Loading featured products...
                </p>
              </div>
            ) : (
              <ProductGrid products={featuredProducts} />
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-sans">
              Why Choose Tomato Harvest?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-lg shadow-md flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <TruckIcon size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 font-sans">
                  Fast Delivery
                </h3>
                <p className="text-muted-foreground">
                  From our farm to your table in under 48 hours, ensuring
                  maximum freshness and flavor.
                </p>
              </div>

              <div className="bg-card p-8 rounded-lg shadow-md flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Leaf size={32} className="text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 font-sans">
                  Sustainable Practices
                </h3>
                <p className="text-muted-foreground">
                  Our tomatoes are grown using eco-friendly methods that protect
                  the soil and environment.
                </p>
              </div>

              <div className="bg-card p-8 rounded-lg shadow-md flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Clock size={32} className="text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3 font-sans">
                  Harvested at Peak Ripeness
                </h3>
                <p className="text-muted-foreground">
                  We pick our tomatoes at the perfect moment for optimal flavor
                  and nutritional value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-sans">
              What Our Customers Say
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold mr-3">
                    S
                  </div>
                  <div>
                    <h4 className="font-medium">Sarah Johnson</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-500 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "These are the tastiest tomatoes I've ever had! They remind me
                  of the ones my grandmother grew in her garden. Will definitely
                  order again."
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold mr-3">
                    M
                  </div>
                  <div>
                    <h4 className="font-medium">Michael Chen</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-500 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "As a chef, I'm extremely particular about my ingredients.
                  Tomato Harvest delivers consistently excellent produce that
                  makes my dishes shine."
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold mr-3">
                    J
                  </div>
                  <div>
                    <h4 className="font-medium">Jessica Lopez</h4>
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-500 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                      <svg
                        className="w-4 h-4 text-gray-300 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Great quality and flavor. The delivery was quick and
                  everything arrived in perfect condition. I appreciate their
                  sustainable farming practices too."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 font-sans">
              Ready to Taste the Difference?
            </h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Experience the incredible flavor of farm-fresh tomatoes delivered
              directly to your doorstep.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium text-lg transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
