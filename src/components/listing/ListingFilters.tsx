"use client";

import { LISTING_CATEGORIES, LISTING_REGIONS } from "@/constants/listingConstants";
import { Search, X } from "lucide-react";

interface Props {
  search: string;
  selectedCategory: string;
  selectedRegion: string;
  onSearch: (v: string) => void;
  onCategory: (v: string) => void;
  onRegion: (v: string) => void;
  onClear: () => void;
  hasFilters: boolean;
}

export default function ListingFilters({
  search, selectedCategory, selectedRegion,
  onSearch, onCategory, onRegion, onClear, hasFilters,
}: Props) {
  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => onCategory("all")}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === "all" ? "bg-kokan-earth text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {LISTING_CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => onCategory(c.value)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === c.value ? "bg-kokan-earth text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}

        <div className="flex-shrink-0 flex items-center gap-2 ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-4 py-2 rounded-full text-sm bg-gray-100 text-gray-600 border-none focus:outline-none focus:ring-2 focus:ring-kokan-green/30 w-36"
            />
          </div>
          <select
            value={selectedRegion}
            onChange={(e) => onRegion(e.target.value)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border-none focus:outline-none cursor-pointer"
          >
            <option value="all">All Regions</option>
            {LISTING_REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {hasFilters && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 px-3 py-2 rounded-full text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}