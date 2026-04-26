"use client";

import { useEffect, useState } from "react";
import { Destination, DestinationCategory } from "@/types/destination";
import { DESTINATION_CATEGORIES, DESTINATION_REGIONS } from "@/constants/destinationConstants";
import DestinationCard from "@/components/destination/DestinationCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("/api/destinations")
      .then((r) => r.json())
      .then((data) => {
        setDestinations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = destinations.filter((d) => {
    const matchSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.region.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "all" || d.category === selectedCategory;
    const matchRegion = selectedRegion === "all" || d.region === selectedRegion;
    return matchSearch && matchCat && matchRegion;
  });

  const featured = filtered.filter((d) => d.featured);
  const rest = filtered.filter((d) => !d.featured);
  const hasFilters = selectedCategory !== "all" || selectedRegion !== "all" || search;

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedRegion("all");
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="relative h-[420px] md:h-[520px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-kokan-sand text-sm font-semibold tracking-widest uppercase mb-3">
            Discover Konkan
          </p>
          <h1 className="text-5xl md:text-7xl font-display text-white font-bold mb-4 leading-tight">
            Every Shore,<br />
            <span className="text-kokan-sand">A Story</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl">
            From pristine beaches to ancient forts — explore the untouched beauty of the Konkan coast
          </p>

          {/* Search bar */}
          <div className="mt-8 w-full max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destinations..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-kokan-earth bg-white/95 backdrop-blur-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-kokan-green/40 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">

          {/* Category pills */}
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-kokan-earth text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {DESTINATION_CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === c.value
                  ? "bg-kokan-earth text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}

          {/* Region filter */}
          <div className="flex-shrink-0 ml-auto">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border-none focus:outline-none focus:ring-2 focus:ring-kokan-green/30 cursor-pointer"
            >
              <option value="all">All Regions</option>
              {DESTINATION_REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-full text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

        {loading ? (
          /* Skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`rounded-3xl bg-gray-100 animate-pulse ${
                  i === 0 ? "min-h-[520px]" : "min-h-[280px]"
                }`}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏖️</div>
            <h3 className="text-2xl font-display font-bold text-kokan-earth mb-2">
              No destinations found
            </h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-kokan-green text-white rounded-xl font-medium hover:bg-kokan-green/90"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured section */}
            {featured.length > 0 && !hasFilters && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">⭐</span>
                  <h2 className="text-2xl font-display font-bold text-kokan-earth">
                    Featured Destinations
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featured.map((d, i) => (
                    <div
                      key={d.id}
                      className={i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}
                    >
                      <DestinationCard destination={d} featured={i === 0} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">
                {hasFilters
                  ? `${filtered.length} destination${filtered.length !== 1 ? "s" : ""} found`
                  : `${rest.length} destination${rest.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(hasFilters ? filtered : rest).map((d, i) => (
                <div
                  key={d.id}
                  className={
                    !hasFilters && i % 7 === 0
                      ? "sm:col-span-2 lg:col-span-2"
                      : ""
                  }
                >
                  <DestinationCard
                    destination={d}
                    featured={!hasFilters && i % 7 === 0}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}