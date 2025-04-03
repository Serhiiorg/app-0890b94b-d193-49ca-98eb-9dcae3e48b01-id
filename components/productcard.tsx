"use client";
import React from "react";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/app/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({
  product,
  onAddToCart = () => {},
}: ProductCardProps) {
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {!product.isActive && (
          <div className="absolute inset-0 bg-foreground/70 flex items-center justify-center">
            <span className="bg-destructive px-3 py-1 rounded-full text-white font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-sans font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 flex-grow">
          {truncateDescription(product.description)}
        </p>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl font-semibold text-foreground">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-muted-foreground">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.isActive || product.stock <= 0}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
