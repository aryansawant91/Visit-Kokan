"use client";

import React from "react";
import { Star, ShieldCheck, Sparkles, MessageSquarePlus } from "lucide-react";
import { ReviewStats } from "@/types/review";

interface Props {
  stats: ReviewStats;
  onWriteReview: () => void;
  title?: string;
}

export default function RatingSummary({ stats, onWriteReview, title = "Traveler Reviews" }: Props) {
  const { averageRating, totalReviews, breakdown } = stats;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cadbc7] shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#e2ede0]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold tracking-wide uppercase mb-1.5 border border-emerald-200">
            <Sparkles size={11} className="text-emerald-600" /> Verified Traveler Community
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#102416] tracking-tight">{title}</h3>
          <p className="text-xs text-[#526b58] mt-0.5">
            Real experiences from travelers who visited this place
          </p>
        </div>

        <button
          onClick={onWriteReview}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#1b4329] hover:bg-[#143520] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <MessageSquarePlus size={15} />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Main Score & Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 items-center">
        {/* Left Column: Big Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#f7faf6] border border-[#e2ede0]">
          <span className="text-4xl sm:text-5xl font-black text-[#102416] tracking-tight">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className={
                  star <= Math.round(averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
          </div>
          <p className="text-xs font-semibold text-[#526b58]">
            Based on <strong>{totalReviews}</strong> {totalReviews === 1 ? "review" : "traveler ratings"}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-2">
            <ShieldCheck size={13} />
            <span>100% Verified Feedback</span>
          </div>
        </div>

        {/* Right Column: Star Bars */}
        <div className="md:col-span-8 space-y-2">
          {breakdown.map(({ star, count, percent }) => (
            <div key={star} className="flex items-center gap-2.5 text-xs text-[#526b58]">
              <span className="w-10 font-bold text-[#102416] flex items-center gap-0.5 shrink-0">
                {star} <Star size={11} className="fill-amber-400 text-amber-400 inline" />
              </span>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-12 text-right text-[11px] font-medium text-gray-500 shrink-0">
                {count} ({percent}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
