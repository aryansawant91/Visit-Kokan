"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";

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
    fetch(`/api/listings?region=${encodeURIComponent(region)}&limit=6`)
      .then((r) => r.json())
      .then((data) => {
        setListings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [region]);

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-[140px] h-[190px] bg-white/70 rounded-xl animate-pulse border border-[#d6e2d4] shrink-0"
          />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="p-4 bg-white rounded-xl text-center border border-[#d6e2d4]">
        <p className="text-[#647c69] text-xs">No listings found nearby yet</p>
        <Link
          href="/listings"
          className="text-[#2D6A4F] text-xs font-bold hover:underline mt-1 inline-block"
        >
          Browse all listings →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Flipkart-Style Horizontal Cards Row (Similar to Screenshot 2) */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/listings/${listing.slug}`}
            className="w-[142px] bg-white rounded-xl border border-[#d6e2d4] overflow-hidden shrink-0 shadow-2xs hover:shadow-sm hover:border-[#2D6A4F]/50 transition-all flex flex-col group"
          >
            {/* Image + Rating Tag (Just like Flipkart) */}
            <div className="relative w-full h-[105px] bg-[#f0f4ef] overflow-hidden">
              {listing.images?.[0] ? (
                <Image
                  src={listing.images[0]}
                  alt={listing.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  {CATEGORY_EMOJI[listing.category] ?? "📍"}
                </div>
              )}

              {/* Flipkart-style Rating Badge */}
              <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-[#1b4329]/90 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-0.5 shadow-sm">
                <span>{listing.rating ? listing.rating.toFixed(1) : "4.2"}</span>
                <Star size={9} className="fill-current text-[#facc15]" />
              </div>
            </div>

            {/* Content Details */}
            <div className="p-2.5 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#698470]">
                  {CATEGORY_EMOJI[listing.category]} {listing.category}
                </p>
                <p className="font-bold text-[#142607] text-xs line-clamp-2 leading-tight mt-0.5 group-hover:text-[#2D6A4F] transition-colors">
                  {listing.name}
                </p>
              </div>

              <div className="mt-2 pt-1 border-t border-[#f0f4ef]">
                {listing.price ? (
                  <p className="text-xs font-black text-[#142607]">
                    ₹{listing.price.toLocaleString("en-IN")}{" "}
                    <span className="text-[10px] text-[#698470] font-normal">
                      /{listing.priceUnit || "night"}
                    </span>
                  </p>
                ) : (
                  <span className="text-[11px] font-bold text-[#2D6A4F] flex items-center gap-0.5">
                    View details <ArrowRight size={10} />
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-end pt-0.5">
        <Link
          href={`/listings?region=${encodeURIComponent(region)}`}
          className="text-xs font-bold text-[#2D6A4F] hover:underline flex items-center gap-1"
        >
          View all in {region} <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}