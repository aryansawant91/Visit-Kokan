"use client";

import { useEffect, useState, useRef } from "react";
import ProductFilters, { FilterState } from "@/components/products/ProductFilters";
import ProductCard from "@/components/products/ProductCard";
import TrendingNow from "@/components/TrendingNow";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types/product";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";
import Link from "next/link";
import { getUserCategoryAffinity } from "@/lib/ml/categoryAffinity";
import { useAuth } from "@/context/AuthContext";

const DEFAULT_FILTERS: FilterState = {
  category: "",
  region: "",
  minPrice: 0,
  maxPrice: 5000,
  sortBy: "newest",
};

const SORT_LABELS: Record<string, string> = {
  newest: "Newest",
  rating: "Top Rated",
  price_asc: "Price ↑",
  price_desc: "Price ↓",
};

const BANNERS = [
  {
    id: 1,
    bg: "from-kokan-green to-kokan-green/80",
    emoji: "🥭",
    title: "Alphonso Season is Here!",
    subtitle: "Fresh Ratnagiri Hapus — direct from farm",
    cta: "Shop Fruits",
    category: "fruits",
    accent: "bg-kokan-sand",
  },
  {
    id: 2,
    bg: "from-kokan-earth to-kokan-earth/80",
    emoji: "🌶️",
    title: "Authentic Malvani Spices",
    subtitle: "Stone-ground masalas — traditional recipes",
    cta: "Shop Spices",
    category: "spices",
    accent: "bg-kokan-green",
  },
  {
    id: 3,
    bg: "from-kokan-sand to-kokan-sand/80",
    emoji: "🥜",
    title: "Premium Konkan Cashews",
    subtitle: "W180 grade — straight from Sindhudurg farms",
    cta: "Shop Nuts",
    category: "nuts",
    accent: "bg-kokan-earth",
  },
  {
    id: 4,
    bg: "from-kokan-ocean to-kokan-green/70",
    emoji: "🍹",
    title: "Pure Kokum Sherbet",
    subtitle: "Natural summer coolant — no sugar added",
    cta: "Shop Beverages",
    category: "beverages",
    accent: "bg-kokan-sand",
  },
];

export default function ProductsPage() {
  const [products, setProducts]         = useState<Product[]>([]);
  const [filtered, setFiltered]         = useState<Product[]>([]);
  const [filters, setFilters]           = useState<FilterState>(DEFAULT_FILTERS);
  const [search, setSearch]             = useState("");
  const [loading, setLoading]           = useState(true);
  const [showFilters, setShowFilters]   = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [bannerIndex, setBannerIndex]   = useState(0);

  const { user } = useAuth();
  const [affinityOrder, setAffinityOrder] = useState<string[]>([]);

  // Affinity-sorted categories
  const sortedCategories = affinityOrder.length > 0
  ? [
      ...affinityOrder
        .map(cat => PRODUCT_CATEGORIES.find(c => c.value === cat))
        .filter((c): c is typeof PRODUCT_CATEGORIES[number] => Boolean(c)),
      ...PRODUCT_CATEGORIES.filter(c => !affinityOrder.includes(c.value)),
    ]
  : PRODUCT_CATEGORIES;

  // Load user category affinity
  useEffect(() => {
    if (!user?.uid) return;
    getUserCategoryAffinity(user.uid).then(setAffinityOrder);
  }, [user?.uid]);

  // Auto-rotate banner
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((i) => (i + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setProducts(list);
        setFiltered(list);
        setLoading(false);
      })
      .catch(() => { setProducts([]); setFiltered([]); setLoading(false); });
  }, []);

  useEffect(() => {
    let result = [...products];
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (filters.category) result = result.filter((p) => p.category === filters.category);
    if (filters.region) result = result.filter((p) => p.region === filters.region);
    result = result.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    if (filters.sortBy === "rating")     result.sort((a, b) => b.rating - a.rating);
    else if (filters.sortBy === "price_asc")  result.sort((a, b) => a.price - b.price);
    else if (filters.sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    setFiltered(result);
  }, [products, filters, search]);

  const activeFilterCount = [
    filters.category !== "",
    filters.region !== "",
    filters.maxPrice < 5000,
    filters.sortBy !== "newest",
  ].filter(Boolean).length;

  const banner = BANNERS[bannerIndex];

  return (
    <div className="min-h-screen bg-kokan-cream/40">

      {/* ── Top Navbar ── */}
      <div className="bg-kokan-green sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 py-2.5 flex items-center gap-3">
          <Link href="/" className="hidden sm:block flex-shrink-0">
            <span className="text-white font-display font-bold text-lg">
              Visit<span className="text-kokan-sand">Kokan</span>
            </span>
          </Link>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-kokan-earth/50" />
            <input
              type="text"
              placeholder="Search Kokan products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 rounded-lg text-sm focus:outline-none shadow-sm text-kokan-earth"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-kokan-earth/40" />
              </button>
            )}
          </div>
        </div>

        {/* Category strip */}
        <div className="border-t border-white/20">
          <div className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setFilters((f) => ({ ...f, category: "" }))}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                filters.category === ""
                  ? "bg-white text-kokan-green"
                  : "text-white/80 hover:text-white hover:bg-white/15"
              }`}
            >
              All
            </button>
            {sortedCategories.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilters((f) => ({ ...f, category: f.category === c.value ? "" : c.value }))}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filters.category === c.value
                    ? "bg-white text-kokan-green"
                    : "text-white/80 hover:text-white hover:bg-white/15"
                }`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Banner ── */}
      <div className="max-w-7xl mx-auto px-3 pt-4">
        <div className={`relative rounded-2xl bg-gradient-to-r ${banner.bg} overflow-hidden h-36 sm:h-48 transition-all duration-500`}>
          <div className="absolute inset-0 flex items-center px-6 sm:px-10 gap-6">
            <div className="text-5xl sm:text-7xl flex-shrink-0 drop-shadow-lg">{banner.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs sm:text-sm font-medium uppercase tracking-widest mb-1">
                Limited Season Offer
              </p>
              <h2 className="text-white font-display font-bold text-xl sm:text-3xl leading-tight">
                {banner.title}
              </h2>
              <p className="text-white/80 text-xs sm:text-sm mt-1 hidden sm:block">{banner.subtitle}</p>
              <button
                onClick={() => setFilters((f) => ({ ...f, category: banner.category }))}
                className={`mt-3 px-4 py-1.5 ${banner.accent} text-white text-xs sm:text-sm font-bold rounded-full hover:opacity-90 transition-opacity`}
              >
                {banner.cta} →
              </button>
            </div>
          </div>
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -right-4 -bottom-8 w-24 h-24 rounded-full bg-white/10" />
          <button
            onClick={() => setBannerIndex((i) => (i - 1 + BANNERS.length) % BANNERS.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
          >
            <ChevronLeft size={14} className="text-white" />
          </button>
          <button
            onClick={() => setBannerIndex((i) => (i + 1) % BANNERS.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
          >
            <ChevronRight size={14} className="text-white" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setBannerIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === bannerIndex ? "bg-white w-4" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Trending Now ── */}
      {!filters.category && !search && <TrendingNow />}

      {/* ── Mobile Filter + Sort bar ── */}
      <div className="bg-white border-b border-kokan-sand/30 lg:hidden sticky top-[88px] z-30 mx-0 mt-3">
        <div className="flex items-center divide-x divide-kokan-sand/30">
          <button
            onClick={() => setShowFilters(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-kokan-earth hover:bg-kokan-cream/30 active:bg-kokan-cream/50"
          >
            <SlidersHorizontal size={15} className="text-kokan-green" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-kokan-green text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <div className="relative flex-1">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-kokan-earth hover:bg-kokan-cream/30"
            >
              <span className="text-kokan-green font-semibold">Sort:</span>
              {SORT_LABELS[filters.sortBy]}
              <ChevronDown size={14} className={`text-kokan-earth/50 transition-transform ${showSortMenu ? "rotate-180" : ""}`} />
            </button>
            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                <div className="absolute top-full left-0 right-0 bg-white border border-kokan-sand/30 rounded-b-xl shadow-xl z-50">
                  {[
                    { value: "newest",     label: "Newest First" },
                    { value: "rating",     label: "Top Rated" },
                    { value: "price_asc",  label: "Price: Low to High" },
                    { value: "price_desc", label: "Price: High to Low" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setFilters((f) => ({ ...f, sortBy: opt.value as FilterState["sortBy"] })); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                        filters.sortBy === opt.value
                          ? "text-kokan-green font-semibold bg-kokan-cream/40"
                          : "text-kokan-earth hover:bg-kokan-cream/20"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filters Drawer ── */}
      {showFilters && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowFilters(false)} />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[90vw] bg-white z-50 overflow-y-auto shadow-2xl">
            <div className="p-4">
              <ProductFilters
                filters={filters}
                onChange={setFilters}
                onClose={() => setShowFilters(false)}
              />
              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-4 py-3 bg-kokan-green text-white rounded-xl font-semibold text-sm hover:bg-kokan-green/90"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-3 py-4 flex gap-5">

        {/* Desktop sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-xl p-4 border border-kokan-sand/30 shadow-sm sticky top-[140px]">
            <ProductFilters filters={filters} onChange={setFilters} />
          </div>
        </div>

        {/* Products */}
        <div className="flex-1 min-w-0">

          {/* Results header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-base font-bold text-kokan-earth font-playfair">
                {filters.category
                  ? PRODUCT_CATEGORIES.find((c) => c.value === filters.category)?.label + " Products"
                  : "All Kokan Products"}
              </h1>
              <p className="text-xs text-kokan-earth/40 mt-0.5">
                {loading ? "Loading..." : `${filtered.length} products`}
              </p>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-xs text-red-400 font-semibold hover:text-red-600 flex items-center gap-1"
              >
                <X size={12} /> Clear all
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {(filters.category || filters.region || filters.maxPrice < 5000) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {filters.category && (
                <span className="flex items-center gap-1 bg-kokan-green/10 text-kokan-green text-xs font-medium px-2.5 py-1 rounded-full border border-kokan-green/20">
                  {PRODUCT_CATEGORIES.find((c) => c.value === filters.category)?.emoji}{" "}
                  {PRODUCT_CATEGORIES.find((c) => c.value === filters.category)?.label}
                  <button onClick={() => setFilters((f) => ({ ...f, category: "" }))}><X size={11} /></button>
                </span>
              )}
              {filters.region && (
                <span className="flex items-center gap-1 bg-kokan-green/10 text-kokan-green text-xs font-medium px-2.5 py-1 rounded-full border border-kokan-green/20">
                  📍 {filters.region}
                  <button onClick={() => setFilters((f) => ({ ...f, region: "" }))}><X size={11} /></button>
                </span>
              )}
              {filters.maxPrice < 5000 && (
                <span className="flex items-center gap-1 bg-kokan-green/10 text-kokan-green text-xs font-medium px-2.5 py-1 rounded-full border border-kokan-green/20">
                  Under ₹{filters.maxPrice.toLocaleString("en-IN")}
                  <button onClick={() => setFilters((f) => ({ ...f, maxPrice: 5000 }))}><X size={11} /></button>
                </span>
              )}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-kokan-sand/20">
                  <div className="bg-kokan-sand/20 animate-pulse" style={{ paddingBottom: "100%" }} />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-kokan-sand/20 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-kokan-sand/20 rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-kokan-sand/20 rounded animate-pulse w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-kokan-sand/20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-bold text-kokan-earth text-lg mb-1">No products found</h3>
              <p className="text-kokan-earth/50 text-sm mb-4">Try adjusting your filters or search</p>
              <button
                onClick={() => { setFilters(DEFAULT_FILTERS); setSearch(""); }}
                className="px-6 py-2.5 bg-kokan-green text-white rounded-xl text-sm font-semibold hover:bg-kokan-green/90"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}