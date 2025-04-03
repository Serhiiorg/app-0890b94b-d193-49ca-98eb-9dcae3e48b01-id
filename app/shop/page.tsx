"use client";
import React, { useEffect, useState } from "react";
import {
  SlidersHorizontal,
  Search,
  ArrowDownAZ,
  ArrowUpZA,
  Clock,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductGrid } from "@/components/productgrid";
import { CategoryFilter } from "@/components/categoryfilter";
import { Product, Category } from "@/app/types";

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        if (!categoriesResponse.ok)
          throw new Error("Failed to fetch categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch products
        const productsResponse = await fetch("/api/products?limit=50");
        if (!productsResponse.ok) throw new Error("Failed to fetch products");
        const productsData = await productsResponse.json();
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Filter and sort products based on current selections
    let result = [...products];

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(
        (product) => product.categoryId === selectedCategory,
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query),
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, sortOption]);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      // For demonstration, we'll use a placeholder userId
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "user-1", // This would typically come from authentication
          productId: product.id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        alert(`${product.name} added to cart!`);
      } else {
        throw new Error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header cartItemCount={0} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold font-sans mb-2">Our Tomatoes</h1>
          <p className="text-muted-foreground">
            Discover our selection of farm-fresh, sustainably grown tomatoes.
          </p>
        </section>

        {/* Filters and Search Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-auto md:min-w-[300px]">
              <input
                type="text"
                placeholder="Search tomatoes..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 pl-10 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
            </div>

            {/* Filters Button (Mobile) and Sort Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={toggleFilterMenu}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>

              <div className="relative flex-grow md:flex-grow-0">
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="w-full md:w-auto appearance-none px-4 py-2 pr-8 rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {sortOption === "price-low-high" ? (
                    <ArrowDownAZ size={18} className="text-primary" />
                  ) : sortOption === "price-high-low" ? (
                    <ArrowUpZA size={18} className="text-primary" />
                  ) : (
                    <Clock size={18} className="text-primary" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filters (Expandable) */}
          <div
            className={`md:hidden mt-4 overflow-hidden transition-all duration-300 ${
              isFilterMenuOpen ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="p-4 bg-muted rounded-md">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
              />
            </div>
          </div>

          {/* Desktop Category Filter */}
          <div className="hidden md:block mt-6">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </div>
        </section>

        {/* Products Grid Section */}
        <section>
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-muted-foreground">
                Showing {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </div>
              <ProductGrid
                products={filteredProducts}
                onAddToCart={handleAddToCart}
              />
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
