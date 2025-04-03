"use client";
import React from "react";
import { ProductCard } from "@/components/productcard";
import { Product } from "@/app/types";

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export function ProductGrid({
  products = [],
  onAddToCart = () => {},
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <h3 className="text-lg font-medium text-muted-foreground">
          No products found
        </h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
