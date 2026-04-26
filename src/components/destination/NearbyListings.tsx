"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ArrowRight } from "lucide-react";

interface Props {
  region: string;
  currentSlug: string;
}

const CATEGORY_EMOJI: Record<string, string> = {
  homestay: "🏡",
  hotel: "🏨",
  restaurant: "🍽️",
  activity: "🚣",
  transport: "🚗",
  shop: "🛍️",
  other: "📍",
};

export default function NearbyListings({ region, currentSlug }: Props) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/listings?region=${encodeURIComponent(region)}&limit=4`)
      .then((r) => r.json())
      .then((data) => {
        setListings(Array.isArray(data) ? data.slice(0, 4) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [region]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-2xl text-center border border-gray-100">
        <p className="text-gray-400 text-sm">No listings found nearby yet</p>
        <Link
          href="/listings"
          className="text-kokan-green text-sm font-medium hover:underline mt-1 inline-block"
        >
          Browse all listings →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {listings.map((listing) => (
        <Link
          key={listing.id}
          href={`/listings/${listing.slug}`}
          className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 hover:border-kokan-green/30 hover:shadow-md transition-all group"
        >
          {/* Image */}
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-kokan-sand/20 flex-shrink-0">
            {listing.images?.[0] ? (
              <Image src={listing.images[0]} alt={listing.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                {CATEGORY_EMOJI[listing.category] ?? "📍"}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-kokan-earth text-sm truncate group-hover:text-kokan-green transition-colors">
              {listing.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-400">
                {CATEGORY_EMOJI[listing.category]} {listing.category}
              </span>
              {listing.rating > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
                  <Star size={10} fill="currentColor" /> {listing.rating.toFixed(1)}
                </span>
              )}
            </div>
            {listing.price && (
              <p className="text-xs text-kokan-green font-semibold mt-0.5">
                ₹{listing.price.toLocaleString("en-IN")}{" "}
                <span className="text-gray-400 font-normal">{listing.priceUnit}</span>
              </p>
            )}
          </div>

          <ArrowRight size={14} className="text-gray-300 group-hover:text-kokan-green transition-colors flex-shrink-0" />
        </Link>
      ))}

      <Link
        href={`/listings?region=${encodeURIComponent(region)}`}
        className="flex items-center justify-center gap-2 py-3 text-sm text-kokan-green font-medium hover:underline"
      >
        View all in {region} <ArrowRight size={14} />
      </Link>
    </div>
  );
}