"use client";

import { useEffect, useState } from "react";
import ProductFilters, { FilterState } from "@/components/products/ProductFilters";
import ProductCard from "@/components/products/ProductCard";
import TrendingNow from "@/components/TrendingNow";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Product } from "@/types/product";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";
import Link from "next/link";
import { getUserCategoryAffinity } from "@/lib/ml/categoryAffinity";
import { useAuth } from "@/context/AuthContext";
import CartIcon from "@/components/cart/CartIcon";

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
          .map((cat) => PRODUCT_CATEGORIES.find((c) => c.value === cat))
          .filter((c): c is typeof PRODUCT_CATEGORIES[number] => Boolean(c)),
        ...PRODUCT_CATEGORIES.filter((c) => !affinityOrder.includes(c.value)),
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
      .catch(() => {
        setProducts([]);
        setFiltered([]);
        setLoading(false);
      });
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
    <div className="min-h-screen bg-[#fdf8f3]">

      {/* ── Brand Emerald Top Navbar ── */}
      <div className="sticky top-0 z-40 bg-kokan-green border-b border-emerald-900/30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 py-2.5 flex items-center gap-2.5 sm:gap-3">
          {/* Back button */}
          <Link
            href="/?tab=products"
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/15 text-white rounded-full text-xs font-semibold hover:bg-white/25 transition-colors border border-white/20"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          {/* Search Pill */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2D6A4F]" />
            <input
              type="text"
              placeholder="Search products (cashews, spices, hapus)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm bg-white border border-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 text-gray-800 placeholder:text-gray-400 shadow-xs font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilters(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-bold bg-[#B7895A] hover:bg-[#a37546] text-white transition-all shadow-xs relative"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-emerald-900 text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <div className="flex items-center gap-2 flex-shrink-0 [&_svg]:text-white [&_span]:bg-white [&_span]:text-kokan-green">
            <CartIcon />
          </div>
        </div>

        {/* Category strip */}
        <div className="border-t border-white/15 bg-black/10 backdrop-blur-xs">
          <div className="max-w-7xl mx-auto px-3 py-1.5 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setFilters((f) => ({ ...f, category: "" }))}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                filters.category === ""
                  ? "bg-white text-kokan-green font-bold shadow-xs"
                  : "bg-white/15 text-white/90 hover:bg-white/25 border border-white/10"
              }`}
            >
              All
            </button>
            {sortedCategories.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilters((f) => ({ ...f, category: f.category === c.value ? "" : c.value }))}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filters.category === c.value
                    ? "bg-white text-kokan-green font-bold shadow-xs"
                    : "bg-white/15 text-white/90 hover:bg-white/25 border border-white/10"
                }`}
              >
                <span>{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Banner ── */}
      <div className="max-w-7xl mx-auto px-3 pt-4">
        <div className={`relative rounded-2xl bg-gradient-to-r ${banner.bg} overflow-hidden h-36 sm:h-48 transition-all duration-500 shadow-sm`}>
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
            aria-label="Previous Banner"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
          >
            <ChevronLeft size={14} className="text-white" />
          </button>
          <button
            onClick={() => setBannerIndex((i) => (i + 1) % BANNERS.length)}
            aria-label="Next Banner"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
          >
            <ChevronRight size={14} className="text-white" />
          </button>
        </div>
      </div>

      {/* ── Trending Now ── */}
      {!filters.category && !search && <TrendingNow />}

      {/* ── Quick Sort bar ── */}
      <div className="max-w-7xl mx-auto px-3 mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">{filtered.length}</span> Kokan authentic products
        </div>

        {/* Sort Pill Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:border-kokan-green shadow-2xs transition-colors"
          >
            <span>Sort:</span>
            <span className="text-kokan-green font-bold">{SORT_LABELS[filters.sortBy]}</span>
            <ChevronDown size={13} className={`transition-transform ${showSortMenu ? "rotate-180" : ""}`} />
          </button>
          {showSortMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                {[
                  { value: "newest",     label: "Newest First" },
                  { value: "rating",     label: "Top Rated" },
                  { value: "price_asc",  label: "Price: Low to High" },
                  { value: "price_desc", label: "Price: High to Low" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFilters((f) => ({ ...f, sortBy: opt.value as FilterState["sortBy"] }));
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                      filters.sortBy === opt.value
                        ? "text-kokan-green font-bold bg-emerald-50"
                        : "text-gray-700 hover:bg-gray-50"
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

      {/* ── Mobile Filters Drawer ── */}
      {showFilters && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)} />
          <div className="fixed inset-y-0 right-0 w-80 max-w-[90vw] bg-white z-50 overflow-y-auto shadow-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Filter Products</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                  <X size={15} />
                </button>
              </div>
              <ProductFilters
                filters={filters}
                onChange={setFilters}
                onClose={() => setShowFilters(false)}
              />
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="w-full mt-4 py-3 bg-kokan-green text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-kokan-green/90 shadow-md active:scale-98 transition-all"
            >
              Show {filtered.length} Products
            </button>
          </div>
        </>
      )}

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-3 py-4 flex gap-5">

        {/* Desktop sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs sticky top-[130px]">
            <ProductFilters filters={filters} onChange={setFilters} />
          </div>
        </div>

        {/* Products */}
        <div className="flex-1 min-w-0">

          {/* Active filter chips */}
          {(filters.category || filters.region || filters.maxPrice < 5000) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {filters.category && (
                <span className="flex items-center gap-1 bg-emerald-50 text-kokan-green text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                  {PRODUCT_CATEGORIES.find((c) => c.value === filters.category)?.emoji}{" "}
                  {PRODUCT_CATEGORIES.find((c) => c.value === filters.category)?.label}
                  <button onClick={() => setFilters((f) => ({ ...f, category: "" }))}><X size={11} /></button>
                </span>
              )}
              {filters.region && (
                <span className="flex items-center gap-1 bg-emerald-50 text-kokan-green text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                  📍 {filters.region}
                  <button onClick={() => setFilters((f) => ({ ...f, region: "" }))}><X size={11} /></button>
                </span>
              )}
              {filters.maxPrice < 5000 && (
                <span className="flex items-center gap-1 bg-emerald-50 text-kokan-green text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                  Under ₹{filters.maxPrice.toLocaleString("en-IN")}
                  <button onClick={() => setFilters((f) => ({ ...f, maxPrice: 5000 }))}><X size={11} /></button>
                </span>
              )}
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-xs text-red-500 font-semibold hover:underline px-2 py-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-2xs">
                  <div className="bg-gray-100 animate-pulse" style={{ paddingBottom: "100%" }} />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-xs">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="font-bold text-gray-800 text-base mb-1">No products found</h3>
              <p className="text-gray-500 text-xs mb-4">Try clearing your filters or changing your search terms</p>
              <button
                onClick={() => { setFilters(DEFAULT_FILTERS); setSearch(""); }}
                className="px-5 py-2 bg-kokan-green text-white rounded-full text-xs font-semibold hover:bg-emerald-800 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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
