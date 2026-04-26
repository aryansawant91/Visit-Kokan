"use client";

import { useEffect, useState } from "react";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters, { FilterState } from "@/components/products/ProductFilters";
import CartIcon from "@/components/cart/CartIcon";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Product } from "@/types/product";

const DEFAULT_FILTERS: FilterState = {
  category: "",
  region: "",
  minPrice: 0,
  maxPrice: 5000,
  sortBy: "newest",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
  fetch("/api/products")
    .then((r) => r.json())
    .then((data) => {
      const list = Array.isArray(data) ? data : [];
      setProducts(list);
      setFiltered(list);
      setLoading(false);
    })
    .catch(() => {
      setProducts([]);
      setFiltered([]);
      setLoading(false);
    });
}, []);

  useEffect(() => {
    let result = [...products];

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.region) {
      result = result.filter((p) => p.region === filters.region);
    }
    result = result.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    if (filters.sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (filters.sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (filters.sortBy === "price_desc") result.sort((a, b) => b.price - a.price);

    setFiltered(result);
  }, [products, filters, search]);

  return (
    <div className="min-h-screen bg-kokan-cream/30">
      {/* Header */}
      <div className="bg-white border-b border-kokan-sand/40 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-kokan-earth/40" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-kokan-sand text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-kokan-earth/40" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 border border-kokan-sand rounded-xl text-sm text-kokan-earth"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <CartIcon />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-60 flex-shrink-0">
          <div className="bg-white rounded-2xl p-5 border border-kokan-sand/30 sticky top-24">
            <ProductFilters filters={filters} onChange={setFilters} />
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        {showMobileFilters && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowMobileFilters(false)} />
            <div className="fixed inset-y-0 left-0 w-72 bg-white z-50 p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-kokan-earth">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="w-5 h-5 text-kokan-earth" />
                </button>
              </div>
              <ProductFilters filters={filters} onChange={(f) => { setFilters(f); setShowMobileFilters(false); }} />
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold text-kokan-earth font-playfair">
              Kokan Products
            </h1>
            <span className="text-sm text-kokan-earth/50">
              {filtered.length} products
            </span>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}