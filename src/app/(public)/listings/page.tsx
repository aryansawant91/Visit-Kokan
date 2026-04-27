"use client";

import { useEffect, useState } from "react";
import { Listing } from "@/types/listing";
import { LISTING_CATEGORIES, LISTING_REGIONS } from "@/constants/listingConstants";
import Link from "next/link";
import Image from "next/image";
import { Search, X, MapPin, Star, ArrowRight } from "lucide-react";

function ListingCard({ listing }: { listing: Listing }) {
  const category = LISTING_CATEGORIES.find((c) => c.value === listing.category);
  const image = listing.images?.[0] ??
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={image}
          alt={listing.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-kokan-earth rounded-full">
            {category?.emoji} {category?.label}
          </span>
          {listing.featured && (
            <span className="px-2.5 py-1 bg-kokan-sand text-white text-xs font-semibold rounded-full">
              ⭐ Featured
            </span>
          )}
        </div>
        {listing.addedByAdmin && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 bg-kokan-green text-white text-xs font-semibold rounded-full">
              Official
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-kokan-earth text-lg leading-tight group-hover:text-kokan-green transition-colors">
            {listing.name}
          </h3>
          {listing.rating > 0 && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-kokan-earth">{listing.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({listing.reviewCount})</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
          <MapPin size={12} /> {listing.region}, Maharashtra
        </div>

        <p className="text-gray-500 text-sm mt-2 line-clamp-2 flex-1">
          {listing.description}
        </p>

        {listing.amenities && listing.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
                {listing.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="text-xs bg-kokan-cream/60 text-kokan-earth/70 px-2 py-0.5 rounded-full">
                        {a}
                    </span>
                ))}
            </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          {listing.price ? (
            <div>
              <span className="text-kokan-green font-bold text-lg">
                ₹{listing.price.toLocaleString("en-IN")}
              </span>
              <span className="text-gray-400 text-xs ml-1">{listing.priceUnit}</span>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">Price on request</span>
          )}
          <span className="flex items-center gap-1 text-kokan-green text-sm font-medium group-hover:gap-2 transition-all">
            View <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion]     = useState("all");

  useEffect(() => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((data) => { setListings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = listings.filter((l) => {
    const matchSearch = !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.region.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase());
    const matchCat    = selectedCategory === "all" || l.category === selectedCategory;
    const matchRegion = selectedRegion === "all" || l.region === selectedRegion;
    return matchSearch && matchCat && matchRegion;
  });

  const hasFilters = selectedCategory !== "all" || selectedRegion !== "all" || search;
  const clearFilters = () => { setSearch(""); setSelectedCategory("all"); setSelectedRegion("all"); };
  const featured = filtered.filter((l) => l.featured);
  const rest     = filtered.filter((l) => !l.featured);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="relative h-[400px] md:h-[480px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-kokan-sand text-sm font-semibold tracking-widest uppercase mb-3">
            Stay, Eat & Explore
          </p>
          <h1 className="text-5xl md:text-7xl font-display text-white font-bold mb-4 leading-tight">
            Konkan Listings
          </h1>
          <p className="text-white/70 text-lg max-w-xl">
            Discover the best homestays, restaurants, and activities across the Konkan coast
          </p>

          <div className="mt-8 w-full max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search listings..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-kokan-earth bg-white/95 backdrop-blur-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-kokan-green/40 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === "all" ? "bg-kokan-earth text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {LISTING_CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === c.value ? "bg-kokan-earth text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}

          <div className="flex-shrink-0 flex items-center gap-2 ml-auto">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border-none focus:outline-none cursor-pointer"
            >
              <option value="all">All Regions</option>
              {LISTING_REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-full text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 h-80 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏡</div>
            <h3 className="text-2xl font-display font-bold text-kokan-earth mb-2">No listings found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters</p>
            <button onClick={clearFilters} className="px-6 py-3 bg-kokan-green text-white rounded-xl font-medium hover:bg-kokan-green/90">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {featured.length > 0 && !hasFilters && (
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-kokan-earth mb-6">
                  ⭐ Featured Listings
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">
                {filtered.length} listing{filtered.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(hasFilters ? filtered : rest).map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}