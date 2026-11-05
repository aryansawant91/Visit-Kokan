"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";

export default function BusinessListingBanner() {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#12301f] via-[#1a402a] to-[#122d1d] text-white p-3.5 sm:p-4.5 border border-emerald-900/40 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Left: Icon & Pitch */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center justify-center text-lg sm:text-xl shrink-0">
          🏡
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-xs sm:text-sm text-white truncate">
              Own a Homestay, Cottage, or Business in Konkan?
            </h3>
            <span className="hidden md:inline-block text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
              0% Commission
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-white/70 truncate">
            List your stay or service on Visit Kokan and reach thousands of verified travelers.
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0 pt-0.5 sm:pt-0">
        <Link
          href="/register?tab=vendor"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#b8dc26] hover:bg-[#aed422] text-[#122e1b] shadow-2xs transition-all whitespace-nowrap active:scale-95 text-center"
        >
          <span>List Your Business</span>
          <ArrowRight size={13} />
        </Link>
        <Link
          href="/login?redirect=/vendor/dashboard"
          className="inline-flex items-center justify-center px-3 py-2 rounded-full text-xs font-semibold text-white/90 bg-white/10 hover:bg-white/20 border border-white/15 transition-all whitespace-nowrap active:scale-95 text-center"
        >
          Partner Login
        </Link>
      </div>
    </div>
  );
}
