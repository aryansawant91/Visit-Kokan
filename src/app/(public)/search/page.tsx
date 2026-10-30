"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  Package,
  BookOpen,
  Mountain,
  Loader2,
  X,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Compass,
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  href: string;
  type: "destination" | "product" | "blog" | "trek";
  emoji: string;
  badge?: string;
}

const POPULAR_SEARCHES = [
  "Raigad Fort",
  "Tarkarli",
  "Alibaug",
  "Murud Janjira",
  "Kashid Beach",
  "Malvan",
  "Devgad Mango",
  "Diveagar",
];

// Reliable image component with graceful fallback to prevent broken <img> icons
function ResultThumbnail({
  src,
  alt,
  emoji,
  type,
}: {
  src?: string;
  alt: string;
  emoji: string;
  type: string;
}) {
  const [hasError, setHasError] = useState(false);

  const bgGradients: Record<string, string> = {
    destination: "from-emerald-500/10 to-teal-500/20 text-emerald-800",
    trek: "from-amber-500/10 to-orange-500/20 text-amber-800",
    product: "from-lime-500/10 to-emerald-500/20 text-lime-800",
    blog: "from-sky-500/10 to-indigo-500/20 text-sky-800",
  };

  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${
          bgGradients[type] || "from-gray-100 to-gray-200"
        } rounded-xl border border-black/5 select-none`}
      >
        <span className="text-2xl sm:text-3xl filter drop-shadow-xs">{emoji}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="80px"
      unoptimized
      onError={() => setHasError(true)}
      className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
    />
  );
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    if (initialQ) {
      setQuery(initialQ);
      doSearch(initialQ);
    }
  }, [initialQ]);

  const doSearch = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const [destinations, products, blogs, treks] = await Promise.all([
        fetch("/api/destinations").then((r) => r.json()).catch(() => []),
        fetch("/api/products").then((r) => r.json()).catch(() => []),
        fetch("/api/blogs").then((r) => r.json()).catch(() => []),
        fetch("/api/treks").then((r) => r.json()).catch(() => []),
      ]);

      const lower = q.toLowerCase();

      const all: SearchResult[] = [
        ...((Array.isArray(destinations) ? destinations : [])
          .filter(
            (d: any) =>
              d.name?.toLowerCase().includes(lower) ||
              d.region?.toLowerCase().includes(lower) ||
              d.category?.toLowerCase().includes(lower) ||
              d.description?.toLowerCase().includes(lower)
          )
          .map((d: any) => ({
            id: d.id || d.slug,
            title: d.name,
            subtitle: d.region ? `${d.region}, Maharashtra` : "Konkan, Maharashtra",
            image: d.images?.[0] || d.heroImage || d.image,
            href: `/destinations/${d.slug}`,
            type: "destination" as const,
            emoji: "🏖️",
            badge: "Destination",
          }))),

        ...((Array.isArray(treks) ? treks : [])
          .filter(
            (t: any) =>
              t.name?.toLowerCase().includes(lower) ||
              t.region?.toLowerCase().includes(lower)
          )
          .map((t: any) => ({
            id: t.id || t.slug,
            title: t.name,
            subtitle: `${t.region || "Konkan"} · ${t.duration || "Trek"}`,
            image: t.images?.[0] || t.heroImage,
            href: `/treks/${t.slug}`,
            type: "trek" as const,
            emoji: "🧗",
            badge: "Trek",
          }))),

        ...((Array.isArray(products) ? products : [])
          .filter(
            (p: any) =>
              p.name?.toLowerCase().includes(lower) ||
              p.category?.toLowerCase().includes(lower)
          )
          .map((p: any) => ({
            id: p.id || p.slug,
            title: p.name,
            subtitle: `₹${p.price} ${p.unit ? `per ${p.unit}` : ""}`,
            image: p.images?.[0] || p.image,
            href: `/products/${p.slug}`,
            type: "product" as const,
            emoji: "🛍️",
            badge: "Farm Product",
          }))),

        ...((Array.isArray(blogs) ? blogs : [])
          .filter(
            (b: any) =>
              b.title?.toLowerCase().includes(lower) ||
              b.excerpt?.toLowerCase().includes(lower)
          )
          .map((b: any) => ({
            id: b.id || b.slug,
            title: b.title,
            subtitle: b.excerpt?.slice(0, 65) + "...",
            image: b.coverImage || b.image,
            href: `/blogs/${b.slug}`,
            type: "blog" as const,
            emoji: "📝",
            badge: "Travel Guide",
          }))),
      ];

      setResults(all);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.replace(`/search?q=${encodeURIComponent(query.trim())}`);
    doSearch(query.trim());
  };

  const handleQuickSearch = (keyword: string) => {
    setQuery(keyword);
    router.replace(`/search?q=${encodeURIComponent(keyword)}`);
    doSearch(keyword);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    router.replace("/search");
  };

  const counts = useMemo(() => {
    return {
      all: results.length,
      destination: results.filter((r) => r.type === "destination").length,
      trek: results.filter((r) => r.type === "trek").length,
      product: results.filter((r) => r.type === "product").length,
      blog: results.filter((r) => r.type === "blog").length,
    };
  }, [results]);

  const filteredResults = useMemo(() => {
    if (selectedType === "all") return results;
    return results.filter((r) => r.type === selectedType);
  }, [results, selectedType]);

  const tabs = [
    { id: "all", label: "All Results", icon: Sparkles, count: counts.all },
    { id: "destination", label: "Destinations", icon: MapPin, count: counts.destination },
    { id: "trek", label: "Treks", icon: Mountain, count: counts.trek },
    { id: "product", label: "Products", icon: Package, count: counts.product },
    { id: "blog", label: "Stories", icon: BookOpen, count: counts.blog },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      {/* ── Modern Search Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#143321] via-[#1b4329] to-[#245838] pt-8 pb-10 sm:pt-12 sm:pb-14 px-4 shadow-md">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-[#B7895A]" />
            <span>Discover Konkan</span>
          </div>

          <h1 className="font-playfair text-2xl sm:text-4xl font-bold text-white mb-2 leading-tight">
            Search Visit <span className="text-[#B7895A]">Kokan</span>
          </h1>
          <p className="text-white/75 text-xs sm:text-sm mb-6 max-w-md mx-auto">
            Find beaches, island & hill forts, homestays, authentic seafood, and Sahyadri treks
          </p>

          {/* ── Sleek Rounded-Full Search Bar ── */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-white rounded-full p-1.5 sm:p-2 shadow-xl shadow-black/15 border border-white/80 focus-within:ring-4 focus-within:ring-emerald-400/20 transition-all text-left"
          >
            {/* Search Icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#2D6A4F] shrink-0 ml-1">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            {/* Input field */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, forts, beaches, products..."
              className="flex-1 px-3 py-2 text-sm sm:text-base text-gray-800 placeholder:text-gray-400 outline-none bg-transparent font-medium"
            />

            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center shrink-0 transition-colors mr-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="px-5 sm:px-7 py-2.5 bg-gradient-to-r from-[#B7895A] to-[#C77B3F] hover:brightness-105 active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-full shadow-sm flex items-center gap-1.5 transition-all shrink-0"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline-block" />
            </button>
          </form>

          {/* ── Popular Search Pills ── */}
          <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 mt-4 text-xs">
            <span className="text-white/60 font-medium mr-1 text-[11px] sm:text-xs">
              Popular:
            </span>
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickSearch(tag)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/90 border border-white/15 backdrop-blur-xs transition-colors text-[11px] sm:text-xs font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-[#2D6A4F]">
            <Loader2 className="w-9 h-9 animate-spin mb-3 text-[#2D6A4F]" />
            <p className="text-xs sm:text-sm font-semibold text-[#2D6A4F]">
              Searching across Konkan...
            </p>
          </div>
        )}

        {/* Empty Search Prompt */}
        {!loading && !query && (
          <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-[#e4ede3] p-8 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#2D6A4F] flex items-center justify-center mx-auto text-3xl mb-4">
              🌊
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              What are you looking for in Konkan?
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
              Search for iconic sea & hill forts, tranquil beaches, Scuba diving, Alphonso mangoes, or Sahyadri treks.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickSearch(tag)}
                  className="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#1e5237] border border-emerald-200 text-xs font-semibold transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Results Found */}
        {!loading && query && results.length === 0 && (
          <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-[#e4ede3] p-8 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto text-3xl mb-4">
              🔍
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              No results found for &quot;{query}&quot;
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
              Check your spelling or try exploring these popular Konkan destinations:
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickSearch(tag)}
                  className="px-3.5 py-1.5 rounded-full bg-[#f4f7f4] hover:bg-emerald-50 text-[#2D6A4F] border border-[#dce7db] text-xs font-semibold transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {!loading && results.length > 0 && (
          <div className="space-y-6">
            {/* ── Filter Tabs & Counter ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e6ede4] pb-4">
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Showing results for{" "}
                  <span className="font-bold text-gray-900">&quot;{query}&quot;</span>
                </p>
                <p className="text-xs text-[#2D6A4F] font-semibold mt-0.5">
                  {filteredResults.length} matches found
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {tabs
                  .filter((t) => t.id === "all" || t.count > 0)
                  .map((tab) => {
                    const isActive = selectedType === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSelectedType(tab.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                          isActive
                            ? "bg-[#142607] text-white shadow-xs"
                            : "bg-white text-[#334637] border border-[#d6e2d4] hover:bg-[#edf3eb]"
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-emerald-50 text-[#2D6A4F]"
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 gap-3">
              {filteredResults.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.href}
                  className="group block bg-white rounded-2xl p-3 sm:p-4 border border-[#e4ede3] hover:border-[#2D6A4F]/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    {/* Thumbnail Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 shadow-2xs">
                      <ResultThumbnail
                        src={result.image}
                        alt={result.title}
                        emoji={result.emoji}
                        type={result.type}
                      />
                    </div>

                    {/* Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#1e5237] border border-emerald-200">
                          {result.emoji} {result.badge || result.type}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-[#2D6A4F] transition-colors truncate">
                        {result.title}
                      </h3>

                      <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{result.subtitle}</span>
                      </p>
                    </div>

                    {/* View Action Pill */}
                    <div className="shrink-0 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-emerald-50 group-hover:text-[#2D6A4F] text-gray-400 flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
