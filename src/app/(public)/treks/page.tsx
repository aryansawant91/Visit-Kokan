import CartIcon from "@/components/cart/CartIcon";
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Trek } from "@/types/trek";
import { TREK_CATEGORIES, TREK_DIFFICULTIES, TREK_REGIONS } from "@/constants/trekConstants";
import { Search, X, SlidersHorizontal, ArrowLeft, MapPin, Clock, ChevronRight, ChevronLeft } from "lucide-react";

const VALID_COUPONS = [
  { code: "TREK50",   discount: 50,  description: "₹50 off on any trek" },
  { code: "FIRST100", discount: 100, description: "₹100 off on your first booking" },
  { code: "KOKAN200", discount: 200, description: "₹200 off above ₹999" },
  { code: "MONSOON",  discount: 150, description: "Monsoon special — ₹150 off" },
];

const DIFFICULTY_CONFIG: Record<string, { color: string; bg: string; emoji: string }> = {
  easy:     { color: "text-green-700",  bg: "bg-green-100",  emoji: "🟢" },
  moderate: { color: "text-yellow-700", bg: "bg-yellow-100", emoji: "🟡" },
  hard:     { color: "text-orange-700", bg: "bg-orange-100", emoji: "🟠" },
  expert:   { color: "text-red-700",    bg: "bg-red-100",    emoji: "🔴" },
};

function TrekCard({ trek, featured = false }: { trek: Trek; featured?: boolean }) {
  const diff = DIFFICULTY_CONFIG[trek.difficulty] ?? { color: "text-gray-600", bg: "bg-gray-100", emoji: "⚪" };

  return (
    <Link href={`/treks/${trek.slug}`} className="block group">
      <div className={`relative rounded-2xl overflow-hidden shadow-sm ${featured ? "h-52 sm:h-64" : "h-44 sm:h-52"}`}>
        {trek.images?.[0] ? (
          <Image
            src={trek.images[0]}
            alt={trek.name}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-4xl">🥾</div>
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Featured badge */}
        {trek.featured && (
          <div className="absolute top-2.5 left-2.5 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
            ⭐ Featured
          </div>
        )}

        {/* Difficulty badge */}
        <div className={`absolute top-2.5 right-2.5 ${diff.bg} ${diff.color} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
          {diff.emoji} {trek.difficulty}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold text-sm sm:text-base leading-tight line-clamp-1">{trek.name}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <div className="flex items-center gap-0.5 text-white/70 text-[11px]">
              <MapPin className="w-3 h-3" /> {trek.region}
            </div>
            {trek.duration && (
              <div className="flex items-center gap-0.5 text-white/70 text-[11px]">
                <Clock className="w-3 h-3" /> {trek.duration}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-white font-bold text-sm">
              ₹{trek.price?.toLocaleString("en-IN")}
              <span className="text-white/60 font-normal text-[11px]">/person</span>
            </span>
            <span className="flex items-center gap-0.5 bg-white/15 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-lg group-hover:bg-white/25 transition-colors">
              Book <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function TreksPageInner() {
  const searchParams = useSearchParams();

  const [treks, setTreks]                           = useState<Trek[]>([]);
  const [loading, setLoading]                       = useState(true);
  const [search, setSearch]                         = useState("");
  const [selectedCategory, setSelectedCategory]     = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedRegion, setSelectedRegion]         = useState("all");
  const [showFilterSheet, setShowFilterSheet]       = useState(false);
  const [currentPage, setCurrentPage]               = useState(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const cat  = searchParams.get("category");
    const diff = searchParams.get("difficulty");
    const reg  = searchParams.get("region");
    const q    = searchParams.get("q");
    if (cat)  setSelectedCategory(cat);
    if (diff) setSelectedDifficulty(diff);
    if (reg)  setSelectedRegion(reg);
    if (q)    setSearch(q);
  }, []); // eslint-disable-line

  useEffect(() => {
    fetch("/api/treks")
      .then((r) => r.json())
      .then((data) => { setTreks(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = treks.filter((t) => {
    const matchSearch   = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.region.toLowerCase().includes(search.toLowerCase());
    const matchCat      = selectedCategory === "all" || t.category === selectedCategory;
    const matchDiff     = selectedDifficulty === "all" || t.difficulty === selectedDifficulty;
    const matchRegion   = selectedRegion === "all" || t.region === selectedRegion;
    return matchSearch && matchCat && matchDiff && matchRegion;
  });

  const featured    = filtered.filter((t) => t.featured);
  const rest        = filtered.filter((t) => !t.featured);
  const hasFilters  = selectedCategory !== "all" || selectedDifficulty !== "all" || selectedRegion !== "all" || !!search;
  const activeCount = [selectedCategory !== "all", selectedDifficulty !== "all", selectedRegion !== "all"].filter(Boolean).length;

  const itemsToPaginate = hasFilters ? filtered : rest;
  const totalPages = Math.max(1, Math.ceil(itemsToPaginate.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = itemsToPaginate.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const el = document.getElementById("treks-grid-top");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 320, behavior: "smooth" });
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setSelectedRegion("all");
    setShowFilterSheet(false);
    setCurrentPage(1);
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
              placeholder="Search treks or regions..."
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
            {TREK_CATEGORIES.map((c) => (
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

      {/* ── Coupon strip ── */}
      <div className="bg-kokan-green/8 border-b border-kokan-green/15">
        <div className="flex gap-2 px-3 py-2 overflow-x-auto scrollbar-hide items-center">
          <span className="flex-shrink-0 text-[11px] font-bold text-kokan-green">🎟 Offers:</span>
          {VALID_COUPONS.map((c) => (
            <span key={c.code} className="flex-shrink-0 px-3 py-1 rounded-full bg-white border border-kokan-green/25 text-[11px] font-medium text-kokan-earth whitespace-nowrap">
              <span className="font-bold text-kokan-green">{c.code}</span> — {c.description}
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero banner ── */}
      {!hasFilters && (
        <div className="relative h-40 sm:h-56 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
            alt="Konkan Treks"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-10">
            <p className="text-amber-300 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Explore on Foot</p>
            <h1 className="text-white font-display font-bold text-2xl sm:text-4xl leading-tight">
              Konkan Treks
            </h1>
            <p className="text-white/70 text-xs mt-1 hidden sm:block">Coastal cliffs · Ancient forts · Hidden trails</p>
          </div>
        </div>
      )}

      {/* ── Active filter chips ── */}
      {hasFilters && (
        <div className="max-w-7xl mx-auto px-3 pt-3 flex flex-wrap gap-2">
          {selectedCategory !== "all" && (
            <span className="flex items-center gap-1 bg-kokan-earth/10 text-kokan-earth text-xs font-medium px-2.5 py-1 rounded-full border border-kokan-earth/20">
              {TREK_CATEGORIES.find(c => c.value === selectedCategory)?.emoji}{" "}
              {TREK_CATEGORIES.find(c => c.value === selectedCategory)?.label}
              <button onClick={() => { setSelectedCategory("all"); setCurrentPage(1); }}><X size={11} /></button>
            </span>
          )}
          {selectedDifficulty !== "all" && (
            <span className="flex items-center gap-1 bg-kokan-earth/10 text-kokan-earth text-xs font-medium px-2.5 py-1 rounded-full border border-kokan-earth/20">
              {DIFFICULTY_CONFIG[selectedDifficulty]?.emoji} {selectedDifficulty}
              <button onClick={() => { setSelectedDifficulty("all"); setCurrentPage(1); }}><X size={11} /></button>
            </span>
          )}
          {selectedRegion !== "all" && (
            <span className="flex items-center gap-1 bg-kokan-earth/10 text-kokan-earth text-xs font-medium px-2.5 py-1 rounded-full border border-kokan-earth/20">
              📍 {selectedRegion}
              <button onClick={() => { setSelectedRegion("all"); setCurrentPage(1); }}><X size={11} /></button>
            </span>
          )}
          {search && (
            <span className="flex items-center gap-1 bg-kokan-earth/10 text-kokan-earth text-xs font-medium px-2.5 py-1 rounded-full border border-kokan-earth/20">
              🔍 &quot;{search}&quot;
              <button onClick={() => { setSearch(""); setCurrentPage(1); }}><X size={11} /></button>
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
            <div className="text-5xl mb-4">🥾</div>
            <h3 className="text-xl font-display font-bold text-kokan-earth mb-2">No treks found</h3>
            <p className="text-kokan-earth/50 text-sm mb-5">Try adjusting your filters</p>
            <button onClick={clearFilters} className="px-6 py-2.5 bg-kokan-green text-white rounded-xl font-semibold text-sm">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && !hasFilters && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-kokan-earth flex items-center gap-1.5">
                    <span>⭐</span> Featured Treks
                  </h2>
                  <span className="text-xs text-kokan-earth/40">{featured.length} treks</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:overflow-visible">
                  {featured.map((t) => (
                    <div key={t.id} className="flex-shrink-0 w-[68vw] sm:w-auto">
                      <TrekCard trek={t} featured />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results header */}
            <div id="treks-grid-top" className="flex items-center justify-between mb-3 scroll-mt-24">
              <p className="text-xs font-semibold text-kokan-earth/50">
                {itemsToPaginate.length} trek{itemsToPaginate.length !== 1 ? "s" : ""}
                {totalPages > 1 && (
                  <span className="ml-1 text-kokan-green font-bold">
                    (Page {currentPage} of {totalPages})
                  </span>
                )}
              </p>
            </div>

            {/* Main grid — 2 col mobile, 3 col sm, 4 col desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {paginatedItems.map((t, i) => (
                <div key={t.id} className={i === 0 && !hasFilters && currentPage === 1 ? "col-span-2 sm:col-span-1" : ""}>
                  <TrekCard trek={t} />
                </div>
              ))}
            </div>

            {/* ── Pagination Controls: Previous & Next with Page Numbers (After 10 treks slide right) ── */}
            {totalPages > 1 && (
              <div className="mt-8 pt-6 border-t border-[#e8d5bc]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-kokan-earth/60 font-medium order-2 sm:order-1">
                  Showing <span className="font-bold text-kokan-earth">{startIndex + 1}</span> to{" "}
                  <span className="font-bold text-kokan-earth">
                    {Math.min(startIndex + ITEMS_PER_PAGE, itemsToPaginate.length)}
                  </span>{" "}
                  of <span className="font-bold text-kokan-earth">{itemsToPaginate.length}</span> treks
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
          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
              <h3 className="font-bold text-kokan-earth text-base">Filter Treks</h3>
              <button onClick={() => setShowFilterSheet(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="px-5 py-4 space-y-5">
              <div>
                <p className="text-[11px] font-bold text-kokan-earth/40 uppercase tracking-widest mb-2.5">Difficulty</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedDifficulty("all");
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedDifficulty === "all" ? "bg-kokan-earth text-white" : "bg-gray-100 text-gray-600"}`}
                  >
                    All Levels
                  </button>
                  {TREK_DIFFICULTIES.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => {
                        setSelectedDifficulty(d.value);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedDifficulty === d.value ? "bg-kokan-earth text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      {d.emoji} {d.label}
                    </button>
                  ))}
                </div>
              </div>
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
                  {TREK_REGIONS.map((r) => (
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
                Show {filtered.length} Treks
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function TreksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdf8f3] animate-pulse" />}>
      <TreksPageInner />
    </Suspense>
  );
}