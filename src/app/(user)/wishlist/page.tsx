"use client";

import { Heart, MapPin, Compass } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl font-bold text-kokan-earth">My Wishlist</h1>
        <p className="text-kokan-earth/50 text-sm mt-1">Places and listings you've saved</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2">
        {["All", "Destinations", "Homestays", "Treks"].map((s) => (
          <button
            key={s}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              s === "All"
                ? "bg-kokan-green text-white"
                : "bg-white border border-kokan-sand/40 text-kokan-earth/60 hover:border-kokan-green/40"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="bg-white rounded-2xl p-12 border border-kokan-sand/30 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <Heart className="w-8 h-8 text-red-300" />
        </div>
        <div>
          <p className="font-semibold text-kokan-earth mb-1">Your wishlist is empty</p>
          <p className="text-sm text-kokan-earth/50">
            Save destinations and homestays you'd love to visit
          </p>
        </div>
        <div className="flex gap-3 mt-2">
          <Link
            href="/destinations"
            className="flex items-center gap-2 px-4 py-2 bg-kokan-green text-white rounded-xl text-sm font-medium hover:bg-kokan-green/90 transition-colors"
          >
            <MapPin className="w-4 h-4" /> Explore Destinations
          </Link>
          <Link
            href="/listings"
            className="flex items-center gap-2 px-4 py-2 border border-kokan-sand rounded-xl text-sm text-kokan-earth/60 hover:bg-kokan-sand/10 transition-colors"
          >
            <Compass className="w-4 h-4" /> Browse Listings
          </Link>
        </div>
      </div>
    </div>
  );
}