"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Category } from "@/app/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories = [],
  selectedCategory = null,
  onSelectCategory = () => {},
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectCategory = (categoryId: string | null) => {
    onSelectCategory(categoryId);
    setIsOpen(false);
  };

  return (
    <div className="mb-6">
      <h2 className="font-sans text-lg font-semibold mb-3">Categories</h2>

      {/* Mobile dropdown */}
      <div className="md:hidden relative">
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between px-4 py-2 bg-card border border-border rounded-md"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="flex items-center">
            <Filter size={18} className="mr-2 text-muted-foreground" />
            <span>
              {selectedCategory
                ? categories.find((cat) => cat.id === selectedCategory)?.name ||
                  "Selected Category"
                : "All Categories"}
            </span>
          </span>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg">
            <ul className="py-1">
              <li
                className={`px-4 py-2 cursor-pointer hover:bg-muted ${
                  selectedCategory === null ? "text-primary font-medium" : ""
                }`}
                onClick={() => handleSelectCategory(null)}
              >
                All Categories
              </li>

              {categories.map((category) => (
                <li
                  key={category.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-muted ${
                    selectedCategory === category.id
                      ? "text-primary font-medium"
                      : ""
                  }`}
                  onClick={() => handleSelectCategory(category.id)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Desktop horizontal list */}
      <div className="hidden md:block">
        <ul className="flex flex-wrap gap-2">
          <li>
            <button
              onClick={() => onSelectCategory(null)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedCategory === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border hover:bg-muted"
              }`}
            >
              All Categories
            </button>
          </li>

          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => onSelectCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:bg-muted"
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
