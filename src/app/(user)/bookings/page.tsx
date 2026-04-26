"use client";

import { ShoppingBag, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl font-bold text-kokan-earth">My Bookings</h1>
        <p className="text-kokan-earth/50 text-sm mt-1">Your trek and homestay bookings</p>
      </div>

      {/* Status filter */}
      <div className="flex gap-2">
        {["All", "Upcoming", "Completed", "Cancelled"].map((s) => (
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
        <div className="w-16 h-16 bg-kokan-sand/20 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-kokan-sand" />
        </div>
        <div>
          <p className="font-semibold text-kokan-earth mb-1">No bookings yet</p>
          <p className="text-sm text-kokan-earth/50">
            Explore treks and homestays and make your first booking
          </p>
        </div>
        <div className="flex gap-3 mt-2">
          <Link
            href="/treks"
            className="flex items-center gap-2 px-4 py-2 bg-kokan-green text-white rounded-xl text-sm font-medium hover:bg-kokan-green/90 transition-colors"
          >
            <MapPin className="w-4 h-4" /> Browse Treks
          </Link>
          <Link
            href="/listings"
            className="flex items-center gap-2 px-4 py-2 border border-kokan-sand rounded-xl text-sm text-kokan-earth/60 hover:bg-kokan-sand/10 transition-colors"
          >
            <Calendar className="w-4 h-4" /> Find Homestays
          </Link>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-kokan-green/5 border border-kokan-green/20 rounded-2xl p-5 flex items-start gap-3">
        <Clock className="w-5 h-5 text-kokan-green flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-kokan-earth">Booking system coming soon</p>
          <p className="text-xs text-kokan-earth/50 mt-1">
            Full booking flow with Razorpay payments is being built. Once live, all your confirmed bookings will appear here with status tracking.
          </p>
        </div>
      </div>
    </div>
  );
}