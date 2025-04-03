"use client";
import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType, Product } from "@/app/types";

interface CartItemProps {
  item: CartItemType;
  product: Product;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export function CartItem({
  item,
  product,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="flex items-center py-4 border-b border-border">
      {/* Product Image */}
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Product Details */}
      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="font-sans font-medium text-foreground">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatPrice(product.price)} each
            </p>
          </div>
          <p className="text-base font-medium text-foreground">
            {formatPrice(product.price * item.quantity)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-border rounded-md">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="p-1.5 text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="px-3 py-1 font-medium">{item.quantity}</span>
            <button
              onClick={handleIncrement}
              className="p-1.5 text-foreground hover:bg-muted"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="flex items-center text-sm text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={18} className="mr-1" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
