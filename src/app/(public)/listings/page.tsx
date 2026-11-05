"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import CartIcon from "@/components/cart/CartIcon";
import { Listing } from "@/types/listing";
import { LISTING_CATEGORIES, LISTING_REGIONS } from "@/constants/listingConstants";
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowLeft,
  MapPin,
  Star,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Check,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

function ListingCard({
  listing,
  page = 1,
  onCardClick,
}: {
  listing: Listing;
  page?: number;
  onCardClick?: () => void;
}) {
  const category = LISTING_CATEGORIES.find((c) => c.value === listing.category);
  const image =
    listing.images?.[0] ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";

  return (
    <Link
      href={`/listings/${listing.slug}?fromPage=${page}`}
      onClick={onCardClick}
      className="group bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Visual Image Banner */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={listing.name}
          fill
          unoptimized={Boolean(image && !image.startsWith("/"))}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-0.5 bg-white/95 backdrop-blur-md text-[11px] font-bold text-kokan-earth rounded-full shadow-2xs">
            {category?.emoji} {category?.label || "Stay"}
          </span>
          {listing.featured && (
            <span className="px-2 py-0.5 bg-amber-400 text-amber-950 text-[10px] font-extrabold rounded-full shadow-2xs flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> Featured
            </span>
          )}
        </div>

        {listing.addedByAdmin && (
          <div className="absolute top-2.5 right-2.5">
            <span className="px-2 py-0.5 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full flex items-center gap-0.5 border border-emerald-400/30">
              <ShieldCheck className="w-3 h-3" /> Verified Host
            </span>
          </div>
        )}

        {/* Bottom Overlay Info */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
          <span className="text-xs font-semibold flex items-center gap-1 drop-shadow-sm">
            <MapPin className="w-3 h-3 text-emerald-300" /> {listing.region}, Maharashtra
          </span>
          {listing.rating > 0 && (
            <span className="text-[11px] font-bold bg-black/45 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
              <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
              {listing.rating.toFixed(1)}
              {listing.reviewCount > 0 && (
                <span className="text-white/70 text-[10px]">({listing.reviewCount})</span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-display font-bold text-kokan-earth text-base sm:text-lg leading-snug line-clamp-1 group-hover:text-kokan-green transition-colors">
            {listing.name}
          </h3>

          <p className="text-gray-500 text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>

          {/* Curated Amenities Pills */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {listing.amenities.slice(0, 3).map((a) => (
                <span
                  key={a}
                  className="text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-full"
                >
                  ✓ {a}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & CTA Row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          {listing.price ? (
            <div>
              <span className="text-kokan-green font-black text-lg">
                ₹{listing.price.toLocaleString("en-IN")}
              </span>
              <span className="text-gray-400 text-xs ml-1 font-normal">
                /{listing.priceUnit || "night"}
              </span>
            </div>
          ) : (
            <span className="text-gray-400 text-xs font-medium">Price on request</span>
          )}

          <span className="inline-flex items-center gap-1 text-kokan-green text-xs font-bold bg-kokan-green/10 hover:bg-kokan-green/20 px-3 py-1.5 rounded-full transition-all group-hover:gap-1.5">
            View Details <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ListingsContent() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "budget" | "mid" | "luxury">("all");
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "price-asc" | "price-desc">("recommended");
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const featuredScrollerRef = useRef<HTMLDivElement | null>(null);

  // Restore navigation state on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const catParam = sp.get("category");
    if (catParam) setSelectedCategory(catParam);
    const regParam = sp.get("region");
    if (regParam) setSelectedRegion(regParam);

    const pParam = sp.get("page") || sp.get("fromPage");
    const savedPage = pParam
      ? parseInt(pParam, 10)
      : parseInt(sessionStorage.getItem("listings_currentPage") || "1", 10);

    if (savedPage && savedPage > 1) {
      setCurrentPage(savedPage);
    }
  }, []);

  const saveNavState = (pageToSave = currentPage) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("listings_currentPage", String(pageToSave));
      sessionStorage.setItem("listings_scrollY", String(window.scrollY));
      if (featuredScrollerRef.current) {
        sessionStorage.setItem(
          "listings_featured_scroll",
          String(featuredScrollerRef.current.scrollLeft)
        );
      }
    }
  };

  useEffect(() => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((data) => {
        setListings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filtering
  const filtered = listings
    .filter((l) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.region.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        (l.amenities && l.amenities.some((a) => a.toLowerCase().includes(q)));

      const matchCat = selectedCategory === "all" || l.category === selectedCategory;
      const matchRegion = selectedRegion === "all" || l.region.toLowerCase() === selectedRegion.toLowerCase();

      let matchPrice = true;
      if (priceFilter === "budget") matchPrice = (l.price ?? 0) <= 2000;
      else if (priceFilter === "mid") matchPrice = (l.price ?? 0) > 2000 && (l.price ?? 0) <= 3500;
      else if (priceFilter === "luxury") matchPrice = (l.price ?? 0) > 3500;

      return matchSearch && matchCat && matchRegion && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sortBy === "price-asc") return (a.price ?? 0) - (b.price ?? 0);
      if (sortBy === "price-desc") return (b.price ?? 0) - (a.price ?? 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedRegion, priceFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedListings = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hasFilters =
    selectedCategory !== "all" ||
    selectedRegion !== "all" ||
    priceFilter !== "all" ||
    sortBy !== "recommended" ||
    Boolean(search.trim());

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedRegion !== "all" ? 1 : 0) +
    (priceFilter !== "all" ? 1 : 0) +
    (sortBy !== "recommended" ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedRegion("all");
    setPriceFilter("all");
    setSortBy("recommended");
    setCurrentPage(1);
  };

  const featuredListings = listings.filter((l) => l.featured);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    saveNavState(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* 1. Sticky Emerald Navbar */}
      <header className="sticky top-0 z-40 bg-kokan-green text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 -ml-1 rounded-full hover:bg-white/10 text-white transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {/* Search Bar Pill */}
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-white/70" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search homestays, wadas, regions..."
              className="w-full bg-white/15 text-white placeholder-white/60 rounded-full pl-9 pr-8 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 p-1 text-white/70 hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Modal Trigger */}
          <button
            onClick={() => setShowFilterSheet(true)}
            className="relative p-2 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center text-white"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {activeFilterCount}
              </span>
            )}
          </button>

          <CartIcon />
        </div>
      </header>

      {/* 2. Category Pill Filter Strip */}
      <div className="sticky top-[52px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === "all"
                ? "bg-kokan-green text-white shadow-xs"
                : "bg-gray-100 text-kokan-earth/70 hover:bg-gray-200"
            }`}
          >
            All Stays & Spots
          </button>
          {LISTING_CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === c.value
                  ? "bg-kokan-green text-white shadow-xs"
                  : "bg-gray-100 text-kokan-earth/70 hover:bg-gray-200"
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.label}</span>
            </button>
          ))}

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex-shrink-0 ml-auto flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <X size={12} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Sleek Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#122b1c] via-[#1c3d28] to-[#0d1e13] text-white p-6 sm:p-8 mb-8 shadow-sm border border-emerald-900/40">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md text-amber-300 font-extrabold text-[11px] rounded-full uppercase tracking-wider mb-3">
              <span>🏡</span> Handpicked Konkan Stays & Experiences
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black leading-tight text-white mb-2">
              Authentic Homestays, Beach Cottages & Heritage Wadas
            </h1>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-4">
              Immerse yourself in authentic Konkani village hospitality. Enjoy home-cooked Malvani meals, lush mango orchards, and secluded coastal living with 100% verified local hosts.
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] text-white/90 font-medium">
              <span className="bg-white/10 px-2.5 py-1 rounded-full">✓ Verified Local Families</span>
              <span className="bg-white/10 px-2.5 py-1 rounded-full">✓ Home-Cooked Malvani Food</span>
              <span className="bg-white/10 px-2.5 py-1 rounded-full">✓ Direct Host Pricing</span>
            </div>
          </div>
        </div>

        {/* Featured Showcase Carousel (When no search active) */}
        {!hasFilters && featuredListings.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-lg sm:text-xl text-kokan-earth flex items-center gap-2">
                  <span>⭐</span> Curated Featured Stays
                </h2>
                <p className="text-xs text-gray-500">Top-rated coastal properties recommended by Visit Kokan</p>
              </div>
            </div>

            <div
              ref={featuredScrollerRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
            >
              {featuredListings.map((listing) => (
                <div key={listing.id} className="w-72 sm:w-80 flex-shrink-0 snap-start">
                  <ListingCard
                    listing={listing}
                    page={currentPage}
                    onCardClick={() => saveNavState(currentPage)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-kokan-earth">
              {selectedCategory === "all"
                ? "All Available Stays & Experiences"
                : `${LISTING_CATEGORIES.find((c) => c.value === selectedCategory)?.label || "Stays"} in Konkan`}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + (filtered.length > 0 ? 1 : 0)} –{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} properties
            </p>
          </div>

          {/* Quick Sort Selector */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-bold text-kokan-earth bg-white border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-kokan-green cursor-pointer"
            >
              <option value="recommended">Featured First</option>
              <option value="rating">Top Rated ⭐</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Grid Loading / Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-2xs animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="pt-2 flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
            <div className="text-5xl mb-3">🏡</div>
            <h3 className="text-xl font-display font-bold text-kokan-earth mb-1">
              No stays found matching your criteria
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-5 max-w-md mx-auto">
              Try adjusting your category, region, or price filters to see more authentic Konkan properties.
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 bg-kokan-green text-white text-xs sm:text-sm rounded-full font-bold hover:bg-emerald-800 transition-all shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {/* 10-Item Paginated Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {paginatedListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  page={currentPage}
                  onCardClick={() => saveNavState(currentPage)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200/80 pt-6">
                <span className="text-xs text-gray-500">
                  Page {currentPage} of {totalPages} ({filtered.length} total properties)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-200 bg-white text-kokan-earth hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                          pageNum === currentPage
                            ? "bg-kokan-green text-white shadow-xs"
                            : "bg-white text-kokan-earth hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-200 bg-white text-kokan-earth hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* 4. Airbnb / SaffronStays Host Onboarding Partner Card */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#122b1c] via-[#1c3d28] to-[#0d1e13] text-white shadow-md border border-emerald-900/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md text-amber-300 font-extrabold text-[11px] rounded-full uppercase tracking-wider mb-3">
                <span>🏡</span> Host on Visit Kokan · Verified Partner Network
              </div>
              <h2 className="text-xl sm:text-3xl font-display font-black leading-tight text-white mb-2">
                Turn Your Konkan Home or Wada into an Unforgettable Stay
              </h2>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-4">
                Do you own a coastal cottage, ancestral wada, or farm stay in Sindhudurg, Ratnagiri, or Raigad? Partner with Visit Kokan. Connect directly with travelers and families without high commissions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-white/90 font-semibold">
                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                  <span>💰</span> Zero Listing Fees
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                  <span>🛡️</span> 100% Verified Guests
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                  <span>🤝</span> 24/7 Concierge Support
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <a
                href={`https://wa.me/918432587706?text=${encodeURIComponent(
                  "Hi Visit Kokan Team! I own a homestay/cottage in Konkan and would like to partner with Visit Kokan to list my property.\n• Property Name:\n• Location:\n• Contact Number:"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-black bg-[#b8dc26] hover:bg-[#aed422] text-[#142607] shadow-sm transition-all text-center whitespace-nowrap active:scale-95"
              >
                <span>Partner with Us as Host (WhatsApp)</span>
                <ChevronRight size={15} />
              </a>

              <a
                href={`https://wa.me/918432587706?text=${encodeURIComponent(
                  "Hi Visit Kokan Concierge! I need help finding a verified authentic homestay in Konkan for my upcoming trip.\n• Preferred Region:\n• Travel Dates:\n• Number of Guests:"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-all text-center whitespace-nowrap active:scale-95"
              >
                <span>Request Custom Stay Itinerary</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Filter Bottom Sheet Modal */}
      {showFilterSheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up"
            role="dialog"
            aria-modal="true"
          >
            {/* Sheet Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-kokan-earth">
                  Filter Properties
                </h3>
                <p className="text-xs text-gray-400">Refine stays by region, price & category</p>
              </div>
              <button
                onClick={() => setShowFilterSheet(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sheet Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
              {/* Region */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-kokan-earth/70 mb-2">
                  Region
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedRegion("all")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedRegion === "all"
                        ? "bg-kokan-green text-white"
                        : "bg-gray-100 text-kokan-earth hover:bg-gray-200"
                    }`}
                  >
                    All Regions
                  </button>
                  {LISTING_REGIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRegion(r)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selectedRegion === r
                          ? "bg-kokan-green text-white"
                          : "bg-gray-100 text-kokan-earth hover:bg-gray-200"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-kokan-earth/70 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                      selectedCategory === "all"
                        ? "bg-kokan-green text-white"
                        : "bg-gray-100 text-kokan-earth hover:bg-gray-200"
                    }`}
                  >
                    All Categories
                  </button>
                  {LISTING_CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setSelectedCategory(c.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all flex items-center gap-1.5 ${
                        selectedCategory === c.value
                          ? "bg-kokan-green text-white"
                          : "bg-gray-100 text-kokan-earth hover:bg-gray-200"
                      }`}
                    >
                      <span>{c.emoji}</span>
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Tier */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-kokan-earth/70 mb-2">
                  Price per Night
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "all", label: "Any Price" },
                    { id: "budget", label: "Under ₹2,000" },
                    { id: "mid", label: "₹2,000 – ₹3,500" },
                    { id: "luxury", label: "₹3,500+" },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setPriceFilter(tier.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        priceFilter === tier.id
                          ? "bg-kokan-green text-white"
                          : "bg-gray-100 text-kokan-earth hover:bg-gray-200"
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-kokan-earth/70 mb-2">
                  Sort By
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "recommended", label: "⭐ Featured First" },
                    { id: "rating", label: "Top Rated" },
                    { id: "price-asc", label: "Price: Low to High" },
                    { id: "price-desc", label: "Price: High to Low" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSortBy(s.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        sortBy === s.id
                          ? "bg-kokan-green text-white"
                          : "bg-gray-100 text-kokan-earth hover:bg-gray-200"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sheet Actions */}
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-full transition-all"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilterSheet(false)}
                className="flex-1 py-3 text-xs font-bold text-white bg-kokan-green hover:bg-emerald-800 rounded-full transition-all shadow-xs"
              >
                Apply ({filtered.length} Stays)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl animate-bounce mb-2">🏡</div>
            <p className="text-sm font-semibold text-kokan-earth/60">Loading Konkan Stays...</p>
          </div>
        </div>
      }
    >
      <ListingsContent />
    </Suspense>
  );
}
