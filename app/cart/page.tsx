"use client";
import React, { useEffect, useState } from "react";
import { ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartItem } from "@/components/cartitem";
import { Product, CartItem as CartItemType } from "@/app/types";
import Link from "next/link";

export default function Cart() {
  const [cartData, setCartData] = useState<{
    cart: { id: string } | null;
    items: (CartItemType & { name: string; price: number; imageUrl: string })[];
  }>({ cart: null, items: [] });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCartData() {
      setIsLoading(true);
      try {
        // For demo purposes, using a placeholder user ID
        const userId = "user-1";
        const response = await fetch(`/api/cart?userId=${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }

        const data = await response.json();
        setCartData(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Something went wrong. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCartData();
  }, []);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      // Find the current item to get its productId
      const item = cartData.items.find((item) => item.id === itemId);
      if (!item) return;

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "user-1", // Placeholder user ID
          productId: item.productId,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }

      // Update local state to reflect changes
      setCartData((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        ),
      }));
    } catch (error) {
      console.error("Error updating cart:", error);
      setError("Failed to update item quantity. Please try again.");
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart?cartItemId=${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      // Update local state
      setCartData((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId),
      }));
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Failed to remove item. Please try again.");
    }
  };

  // Calculate totals
  const subtotal = cartData.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shippingCost;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header cartItemCount={cartData.items.length} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-sans">Shopping Cart</h1>
          <p className="text-muted-foreground mt-1">
            Review and modify your selected items
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-6 bg-destructive/10 border border-destructive rounded-lg text-center">
            <p className="text-foreground mb-4">{error}</p>
            <Link
              href="/shop"
              className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors"
            >
              Return to Shop
            </Link>
          </div>
        ) : cartData.items.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-sans font-semibold mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Looks like you haven&apos;t added any tomatoes to your cart yet.
              Browse our selection of fresh tomatoes to find your favorites.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors"
            >
              Browse Tomatoes
              <ShoppingCart size={18} className="ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-sm p-6">
                <h2 className="font-sans font-semibold text-xl mb-4">
                  Cart Items ({cartData.items.length})
                </h2>

                <div className="divide-y divide-border">
                  {cartData.items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      product={{
                        id: item.productId,
                        name: item.name,
                        price: item.price,
                        imageUrl: item.imageUrl,
                        description: "",
                        categoryId: "",
                        stock: 0,
                        isActive: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      }}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="font-sans font-semibold text-xl mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    {shippingCost === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      <span>{formatCurrency(shippingCost)}</span>
                    )}
                  </div>

                  {shippingCost > 0 && (
                    <div className="text-sm text-muted-foreground bg-muted p-2 rounded text-center">
                      Add {formatCurrency(50 - subtotal)} more for free shipping
                    </div>
                  )}

                  <div className="border-t border-border pt-3 mt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg">{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    className="w-full inline-flex justify-center items-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors"
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} className="ml-2" />
                  </Link>

                  <Link
                    href="/shop"
                    className="w-full inline-flex justify-center items-center px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-md font-medium transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
