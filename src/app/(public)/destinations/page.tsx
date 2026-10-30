import CartIcon from "@/components/cart/CartIcon";
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Destination } from "@/types/destination";
import { DESTINATION_CATEGORIES, DESTINATION_REGIONS } from "@/constants/destinationConstants";
import { Search, X, SlidersHorizontal, ArrowLeft, MapPin, Star, ChevronRight, ChevronLeft } from "lucide-react";

function DestinationCard({
  destination,
  featured = false,
  page = 1,
  onCardClick,
}: {
  destination: Destination;
  featured?: boolean;
  page?: number;
  onCardClick?: () => void;
}) {
  return (
    <Link
      href={`/destinations/${destination.slug}?fromPage=${page}`}
      onClick={onCardClick}
      className="block group"
    >
      <div className={`relative rounded-2xl overflow-hidden shadow-sm ${featured ? "h-52 sm:h-64" : "h-44 sm:h-52"}`}>
        {destination.coverImage || destination.images?.[0] ? (
          <Image
            src={destination.coverImage ?? destination.images[0]}
            alt={destination.name}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-4xl">🏖️</div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Featured badge */}
        {destination.featured && (
          <div className="absolute top-2.5 left-2.5 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
            ⭐ Featured
          </div>
        )}

        {/* Category badge */}
        {destination.category && (
          <div className="absolute top-2.5 right-2.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/30">
            {DESTINATION_CATEGORIES.find(c => c.value === destination.category)?.emoji}{" "}
            {DESTINATION_CATEGORIES.find(c => c.value === destination.category)?.label ?? destination.category}
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold text-sm sm:text-base leading-tight">{destination.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-0.5 text-white/70 text-[11px]">
              <MapPin className="w-3 h-3" /> {destination.region}
            </div>
            {(destination.rating ?? 0) > 0 && (
              <div className="flex items-center gap-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" /> {destination.rating?.toFixed(1)}
              </div>
            )}
          </div>
          {featured && destination.shortDescription && (
            <p className="text-white/70 text-[11px] mt-1 line-clamp-1">{destination.shortDescription}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function DestinationsPage() {
  const [destinations, setDestinations]         = useState<Destination[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [search, setSearch]                     = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion]     = useState("all");
  const [showFilterSheet, setShowFilterSheet]   = useState(false);
  const [currentPage, setCurrentPage]           = useState(1);
  const featuredScrollerRef                     = useRef<HTMLDivElement | null>(null);

  const ITEMS_PER_PAGE = 10;

  const saveNavState = (pageToSave = currentPage) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("destinations_currentPage", String(pageToSave));
      sessionStorage.setItem("destinations_scrollY", String(window.scrollY));
      if (featuredScrollerRef.current) {
        sessionStorage.setItem(
          "destinations_featured_scroll",
          String(featuredScrollerRef.current.scrollLeft)
        );
      }
    }
  };

  // Restore page from query param or sessionStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const pParam = sp.get("page") || sp.get("fromPage");
    const savedPage = pParam
      ? parseInt(pParam, 10)
      : parseInt(sessionStorage.getItem("destinations_currentPage") || "1", 10);

    if (savedPage && savedPage > 1) {
      setCurrentPage(savedPage);
    }
  }, []);

  // Restore scroll position after destinations finish loading
  useEffect(() => {
    if (loading || typeof window === "undefined") return;

    const savedY = parseInt(sessionStorage.getItem("destinations_scrollY") || "0", 10);
    const savedFeaturedScroll = parseInt(
      sessionStorage.getItem("destinations_featured_scroll") || "0",
      10
    );

    if (savedY > 0 || savedFeaturedScroll > 0) {
      const timer = setTimeout(() => {
        if (savedY > 0) {
          window.scrollTo({ top: savedY, behavior: "instant" as ScrollBehavior });
        }
        if (savedFeaturedScroll > 0 && featuredScrollerRef.current) {
          featuredScrollerRef.current.scrollLeft = savedFeaturedScroll;
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    fetch("/api/destinations")
      .then((r) => r.json())
      .then((data) => { setDestinations(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = destinations.filter((d) => {
    const matchSearch   = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.region.toLowerCase().includes(search.toLowerCase());
    const matchCat      = selectedCategory === "all" || d.category === selectedCategory;
    const matchRegion   = selectedRegion === "all" || d.region === selectedRegion;
    return matchSearch && matchCat && matchRegion;
  });

  const featured   = filtered.filter((d) => d.featured);
  const rest       = filtered.filter((d) => !d.featured);
  const hasFilters = selectedCategory !== "all" || selectedRegion !== "all" || !!search;
  const activeCount = [selectedCategory !== "all", selectedRegion !== "all"].filter(Boolean).length;

  // Include all filtered destinations in pagination so the full catalog is browsable
  const itemsToPaginate = filtered;
  const totalPages = Math.max(1, Math.ceil(itemsToPaginate.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = itemsToPaginate.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("destinations_currentPage", String(newPage));
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(newPage));
      window.history.replaceState(null, "", url.toString());
    }
    const el = document.getElementById("destinations-grid-top");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 320, behavior: "smooth" });
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedRegion("all");
    setShowFilterSheet(false);
    setCurrentPage(1);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("destinations_currentPage", "1");
      const url = new URL(window.location.href);
      url.searchParams.delete("page");
      window.history.replaceState(null, "", url.toString());
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3]">

      {/* ── Brand Emerald Top Navbar ── */}
      <div className="sticky top-0 z-40 bg-kokan-green border-b border-emerald-900/30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 py-2.5 flex items-center gap-2.5 sm:gap-3">

          {/* Back button */}
          <Link
            href="/?tab=travel"
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/15 text-white rounded-full text-xs font-semibold hover:bg-white/25 transition-colors border border-white/20"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          {/* Search Pill */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2D6A4F]" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search destinations..."
              className="w-full pl-9 pr-8 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm bg-white border border-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 text-gray-800 placeholder:text-gray-400 shadow-xs font-medium"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilterSheet(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-bold bg-[#B7895A] hover:bg-[#a37546] text-white transition-all shadow-xs relative"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-emerald-900 text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                {activeCount}
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
              onClick={() => {
                setSelectedCategory("all");
                setCurrentPage(1);
              }}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-white text-kokan-green font-bold shadow-xs"
                  : "bg-white/15 text-white/90 hover:bg-white/25 border border-white/10"
              }`}
            >
              All
            </button>
            {DESTINATION_CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => {
                  setSelectedCategory(selectedCategory === c.value ? "all" : c.value);
                  setCurrentPage(1);
                }}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === c.value
                    ? "bg-white text-kokan-green font-bold shadow-xs"
                    : "bg-white/15 text-white/90 hover:bg-white/25 border border-white/10"
                }`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero banner (below navbar, above content) ── */}
      {!hasFilters && (
        <div className="relative h-40 sm:h-56 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"
            alt="Konkan Coast"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-10">
            <p className="text-amber-300 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Discover Konkan</p>
            <h1 className="text-white font-display font-bold text-2xl sm:text-4xl leading-tight">
              Every Shore,<br />
              <span className="text-amber-300">A Story</span>
            </h1>
            <p className="text-white/70 text-xs mt-1 hidden sm:block">Pristine beaches · Ancient forts · Untouched villages</p>
          </div>
        </div>
      )}

      {/* ── Active filter chips ── */}
      {hasFilters && (
        <div className="max-w-7xl mx-auto px-3 pt-3 flex flex-wrap gap-2">
          {selectedCategory !== "all" && (
            <span className="flex items-center gap-1 bg-kokan-earth/10 text-kokan-earth text-xs font-medium px-2.5 py-1 rounded-full border border-kokan-earth/20">
              {DESTINATION_CATEGORIES.find(c => c.value === selectedCategory)?.emoji}{" "}
              {DESTINATION_CATEGORIES.find(c => c.value === selectedCategory)?.label}
              <button onClick={() => setSelectedCategory("all")}><X size={11} /></button>
            </span>
          )}
          {selectedRegion !== "all" && (
            <span className="flex items-center gap-1 bg-kokan-earth/10 text-kokan-earth text-xs font-medium px-2.5 py-1 rounded-full border border-kokan-earth/20">
              📍 {selectedRegion}
              <button onClick={() => setSelectedRegion("all")}><X size={11} /></button>
            </span>
          )}
          {search && (
            <span className="flex items-center gap-1 bg-kokan-earth/10 text-kokan-earth text-xs font-medium px-2.5 py-1 rounded-full border border-kokan-earth/20">
              🔍 &quot;{search}&quot;
              <button onClick={() => setSearch("")}><X size={11} /></button>
            </span>
          )}
          <button onClick={clearFilters} className="text-xs text-red-500 font-semibold px-2 py-1">Clear all</button>
        </div>
      )}

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6">

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`rounded-2xl bg-kokan-sand/30 animate-pulse ${i === 0 ? "col-span-2 h-52" : "h-44"}`} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏖️</div>
            <h3 className="text-xl font-display font-bold text-kokan-earth mb-2">No destinations found</h3>
            <p className="text-kokan-earth/50 text-sm mb-5">Try adjusting your filters</p>
            <button onClick={clearFilters} className="px-6 py-2.5 bg-kokan-green text-white rounded-xl font-semibold text-sm">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured — horizontal scroll mobile, grid desktop */}
            {featured.length > 0 && !hasFilters && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-kokan-earth flex items-center gap-1.5">
                    <span>⭐</span> Featured Destinations
                  </h2>
                  <span className="text-xs text-kokan-earth/40">{featured.length} places</span>
                </div>
                <div
                  ref={featuredScrollerRef}
                  className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:overflow-visible"
                >
                  {featured.map((d) => (
                    <div key={d.id} className="flex-shrink-0 w-[68vw] sm:w-auto">
                      <DestinationCard
                        destination={d}
                        featured
                        page={currentPage}
                        onCardClick={() => saveNavState(currentPage)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results header */}
            <div id="destinations-grid-top" className="flex items-center justify-between mb-3 scroll-mt-24">
              <p className="text-xs font-semibold text-kokan-earth/50">
                {itemsToPaginate.length} destination{itemsToPaginate.length !== 1 ? "s" : ""}
                {totalPages > 1 && (
                  <span className="ml-1 text-kokan-green font-bold">
                    (Page {currentPage} of {totalPages})
                  </span>
                )}
              </p>
            </div>

            {/* Main grid — 2 col mobile, 3 col sm, 4 col desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {paginatedItems.map((d, i) => (
                <div key={d.id} className={i === 0 && !hasFilters && currentPage === 1 ? "col-span-2 sm:col-span-1" : ""}>
                  <DestinationCard
                    destination={d}
                    page={currentPage}
                    onCardClick={() => saveNavState(currentPage)}
                  />
                </div>
              ))}
            </div>

            {/* ── Pagination Controls: Previous & Next with Page Numbers ── */}
            {totalPages > 1 && (
              <div className="mt-8 pt-6 border-t border-[#e8d5bc]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-kokan-earth/60 font-medium order-2 sm:order-1">
                  Showing <span className="font-bold text-kokan-earth">{startIndex + 1}</span> to{" "}
                  <span className="font-bold text-kokan-earth">
                    {Math.min(startIndex + ITEMS_PER_PAGE, itemsToPaginate.length)}
                  </span>{" "}
                  of <span className="font-bold text-kokan-earth">{itemsToPaginate.length}</span> destinations
                </p>

                <div className="flex items-center gap-1.5 order-1 sm:order-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#e8d5bc] text-kokan-earth hover:bg-kokan-cream transition-colors disabled:opacity-40 disabled:pointer-events-none shadow-sm"
                  >
                    <ChevronLeft size={15} /> Previous
                  </button>

                  <div className="flex items-center gap-1 mx-1">
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                          p === currentPage
                            ? "bg-kokan-green text-white shadow-sm"
                            : "bg-white text-kokan-earth/70 border border-[#e8d5bc] hover:bg-kokan-cream"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-kokan-green text-white hover:bg-kokan-teal transition-colors disabled:opacity-40 disabled:pointer-events-none shadow-sm"
                  >
                    Next <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Filter bottom sheet ── */}
      {showFilterSheet && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilterSheet(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-2xl max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
              <h3 className="font-bold text-kokan-earth text-base">Filter Destinations</h3>
              <button onClick={() => setShowFilterSheet(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="px-5 py-4 space-y-5">
              <div>
                <p className="text-[11px] font-bold text-kokan-earth/40 uppercase tracking-widest mb-2.5">Region</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedRegion("all");
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedRegion === "all" ? "bg-kokan-earth text-white" : "bg-gray-100 text-gray-600"}`}
                  >
                    All Regions
                  </button>
                  {DESTINATION_REGIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setSelectedRegion(r);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedRegion === r ? "bg-kokan-earth text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 pb-8 pt-2 flex gap-3">
              <button onClick={clearFilters} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600">
                Clear All
              </button>
              <button onClick={() => setShowFilterSheet(false)} className="flex-1 py-3 rounded-xl bg-kokan-green text-white text-sm font-semibold">
                Show {filtered.length} Places
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}