"use client";

import { PRODUCT_CATEGORIES, PRODUCT_REGIONS } from "@/constants/productCategories";

export interface FilterState {
  category: string;
  region: string;
  minPrice: number;
  maxPrice: number;
  sortBy: "rating" | "price_asc" | "price_desc" | "newest";
}

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function ProductFilters({ filters, onChange }: Props) {
  const set = (key: keyof FilterState, value: any) =>
    onChange({ ...filters, [key]: value });

  return (
    <aside className="w-full space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold text-kokan-earth mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value=""
              checked={filters.category === ""}
              onChange={() => set("category", "")}
              className="accent-kokan-green"
            />
            <span className="text-sm text-kokan-earth">All</span>
          </label>
          {PRODUCT_CATEGORIES.map((c) => (
            <label key={c.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={c.value}
                checked={filters.category === c.value}
                onChange={() => set("category", c.value)}
                className="accent-kokan-green"
              />
              <span className="text-sm text-kokan-earth">{c.emoji} {c.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Region */}
      <div>
        <h3 className="text-sm font-semibold text-kokan-earth mb-3">Region</h3>
        <select
          value={filters.region}
          onChange={(e) => set("region", e.target.value)}
          className="w-full border border-kokan-sand rounded-lg px-3 py-2 text-sm text-kokan-earth focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
        >
          <option value="">All Regions</option>
          {PRODUCT_REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-kokan-earth mb-3">
          Price Range: ₹{filters.minPrice} — ₹{filters.maxPrice}
        </h3>
        <input
          type="range"
          min={0}
          max={5000}
          step={100}
          value={filters.maxPrice}
          onChange={(e) => set("maxPrice", Number(e.target.value))}
          className="w-full accent-kokan-green"
        />
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold text-kokan-earth mb-3">Sort By</h3>
        <select
          value={filters.sortBy}
          onChange={(e) => set("sortBy", e.target.value as FilterState["sortBy"])}
          className="w-full border border-kokan-sand rounded-lg px-3 py-2 text-sm text-kokan-earth focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
        >
          <option value="newest">Newest</option>
          <option value="rating">Top Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({ category: "", region: "", minPrice: 0, maxPrice: 5000, sortBy: "newest" })}
        className="w-full text-sm text-red-400 hover:text-red-600 transition-colors"
      >
        Reset Filters
      </button>
    </aside>
  );
}