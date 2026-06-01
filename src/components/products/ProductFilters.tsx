"use client";

import { PRODUCT_CATEGORIES, PRODUCT_REGIONS } from "@/constants/productCategories";
import { X } from "lucide-react";

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
  onClose?: () => void;
}

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest First" },
  { value: "rating",     label: "Top Rated" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function ProductFilters({ filters, onChange, onClose }: Props) {
  const set = (key: keyof FilterState, value: any) =>
    onChange({ ...filters, [key]: value });

  const reset = () =>
    onChange({ category: "", region: "", minPrice: 0, maxPrice: 5000, sortBy: "newest" });

  const activeCount = [
    filters.category !== "",
    filters.region !== "",
    filters.maxPrice < 5000,
    filters.sortBy !== "newest",
  ].filter(Boolean).length;

  return (
    <div className="w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-kokan-sand/30">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-kokan-earth text-base">Filters</h3>
          {activeCount > 0 && (
            <span className="bg-kokan-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button onClick={reset} className="text-kokan-green text-xs font-semibold hover:underline">
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-kokan-cream/40">
              <X size={18} className="text-kokan-earth/50" />
            </button>
          )}
        </div>
      </div>

      {/* Sort */}
      <div className="mb-5">
        <h4 className="text-xs font-bold text-kokan-earth/50 uppercase tracking-wider mb-2.5">Sort By</h4>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => set("sortBy", opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filters.sortBy === opt.value
                  ? "bg-kokan-green text-white border-kokan-green"
                  : "bg-white text-kokan-earth border-kokan-sand hover:border-kokan-green hover:text-kokan-green"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="mb-5">
        <h4 className="text-xs font-bold text-kokan-earth/50 uppercase tracking-wider mb-2.5">Category</h4>
        <div className="space-y-2">
          {[{ value: "", label: "All Categories", emoji: "🛒" }, ...PRODUCT_CATEGORIES].map((c) => (
            <label key={c.value} className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                filters.category === c.value
                  ? "border-kokan-green bg-kokan-green"
                  : "border-kokan-sand group-hover:border-kokan-green"
              }`}>
                {filters.category === c.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <input
                type="radio"
                name="category"
                value={c.value}
                checked={filters.category === c.value}
                onChange={() => set("category", c.value)}
                className="hidden"
              />
              <span className="text-sm text-kokan-earth group-hover:text-kokan-green transition-colors">
                {c.emoji} {c.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Region */}
      <div className="mb-5">
        <h4 className="text-xs font-bold text-kokan-earth/50 uppercase tracking-wider mb-2.5">Region</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => set("region", "")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filters.region === ""
                ? "bg-kokan-green text-white border-kokan-green"
                : "bg-white text-kokan-earth border-kokan-sand hover:border-kokan-green"
            }`}
          >
            All
          </button>
          {PRODUCT_REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => set("region", r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filters.region === r
                  ? "bg-kokan-green text-white border-kokan-green"
                  : "bg-white text-kokan-earth border-kokan-sand hover:border-kokan-green"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-5">
        <h4 className="text-xs font-bold text-kokan-earth/50 uppercase tracking-wider mb-2.5">
          Price Range
        </h4>
        <div className="flex items-center justify-between text-xs text-kokan-earth/50 mb-2">
          <span>₹0</span>
          <span className="font-semibold text-kokan-green">
            Up to ₹{filters.maxPrice.toLocaleString("en-IN")}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={5000}
          step={100}
          value={filters.maxPrice}
          onChange={(e) => set("maxPrice", Number(e.target.value))}
          className="w-full accent-kokan-green h-1.5 rounded-full appearance-none cursor-pointer"
        />
        <div className="flex items-center justify-between mt-3 gap-2">
          <div className="flex-1 border border-kokan-sand/40 rounded-lg px-2 py-1.5 text-center">
            <p className="text-[10px] text-kokan-earth/40">Min</p>
            <p className="text-xs font-semibold text-kokan-earth">₹0</p>
          </div>
          <div className="text-kokan-sand text-sm">—</div>
          <div className="flex-1 border border-kokan-green/40 rounded-lg px-2 py-1.5 text-center bg-kokan-green/5">
            <p className="text-[10px] text-kokan-green">Max</p>
            <p className="text-xs font-semibold text-kokan-green">
              ₹{filters.maxPrice.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={reset}
        className="w-full text-sm text-red-400 hover:text-red-600 transition-colors py-2 border border-red-100 rounded-xl hover:bg-red-50"
      >
        Reset Filters
      </button>
    </div>
  );
}