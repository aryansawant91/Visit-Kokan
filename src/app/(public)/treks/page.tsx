"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Trek } from "@/types/trek";
import { TREK_CATEGORIES, TREK_DIFFICULTIES, TREK_REGIONS } from "@/constants/trekConstants";
import { Search, X, SlidersHorizontal, ArrowLeft, MapPin, Clock, Mountain, ChevronRight, Star, Zap } from "lucide-react";

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
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-kokan-sand/30 flex items-center justify-center text-4xl">🥾</div>
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
            <span className="flex items-center gap-0.5 bg-white/15 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-lg">
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

  const clearFilters = () => {
    setSearch(""); setSelectedCategory("all"); setSelectedDifficulty("all"); setSelectedRegion("all"); setShowFilterSheet(false);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3]">

      {/* ── Sandy Navbar ── */}
      <div className="sticky top-0 z-40 bg-[#f5ede0] border-b border-[#e8d5bc] shadow-sm">
        <div className="max-w-7xl mx-auto px-3 py-2.5 flex items-center gap-3">

          {/* Back */}
          <Link
            href="/?tab=travel"
            className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-kokan-earth/10 text-kokan-earth rounded-xl text-xs font-semibold hover:bg-kokan-earth/20 transition-colors border border-kokan-earth/15"
          >
            <ArrowLeft size={14} /> Travel
          </Link>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-kokan-earth/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search treks or regions..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl text-sm bg-white border border-[#e8d5bc] focus:outline-none focus:ring-2 focus:ring-kokan-earth/20 text-kokan-earth placeholder:text-kokan-earth/40 shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-kokan-earth/40" />
              </button>
            )}
          </div>

          {/* Filter */}
          <button
            onClick={() => setShowFilterSheet(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-kokan-earth text-white hover:bg-kokan-earth/90 transition-colors relative"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-kokan-green text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Category strip */}
        <div className="border-t border-[#e8d5bc]/60">
          <div className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-kokan-earth text-white"
                  : "bg-white text-kokan-earth/70 border border-[#e8d5bc] hover:border-kokan-earth/40"
              }`}
            >
              All
            </button>
            {TREK_CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(selectedCategory === c.value ? "all" : c.value)}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === c.value
                    ? "bg-kokan-earth text-white"
                    : "bg-white text-kokan-earth/70 border border-[#e8d5bc] hover:border-kokan-earth/40"
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
              <button onClick={() => setSelectedCategory("all")}><X size={11} /></button>
            </span>
          )}
          {selectedDifficulty !== "all" && (
            <span className="flex items-center gap-1 bg-kokan-earth/10 text-kokan-earth text-xs font-medium px-2.5 py-1 rounded-full border border-kokan-earth/20">
              {DIFFICULTY_CONFIG[selectedDifficulty]?.emoji} {selectedDifficulty}
              <button onClick={() => setSelectedDifficulty("all")}><X size={11} /></button>
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
              🔍 "{search}"
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

            {/* Results count */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-kokan-earth/50">
                {hasFilters ? filtered.length : rest.length} trek{(hasFilters ? filtered.length : rest.length) !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {(hasFilters ? filtered : rest).map((t, i) => (
                <div key={t.id} className={i === 0 && !hasFilters ? "col-span-2 sm:col-span-1" : ""}>
                  <TrekCard trek={t} />
                </div>
              ))}
            </div>
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
                    onClick={() => setSelectedDifficulty("all")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedDifficulty === "all" ? "bg-kokan-earth text-white" : "bg-gray-100 text-gray-600"}`}
                  >
                    All Levels
                  </button>
                  {TREK_DIFFICULTIES.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setSelectedDifficulty(d.value)}
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
                    onClick={() => setSelectedRegion("all")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedRegion === "all" ? "bg-kokan-earth text-white" : "bg-gray-100 text-gray-600"}`}
                  >
                    All Regions
                  </button>
                  {TREK_REGIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRegion(r)}
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