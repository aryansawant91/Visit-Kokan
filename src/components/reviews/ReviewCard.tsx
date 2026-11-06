"use client";

import React, { useState } from "react";
import { Star, ThumbsUp, CheckCircle, Calendar, UserCheck } from "lucide-react";
import { Review } from "@/types/review";

interface Props {
  review: Review;
}

export default function ReviewCard({ review }: Props) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleHelpful = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setHelpfulCount((c) => c + 1);

    try {
      await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: review.id, action: "helpful" }),
      });
    } catch {
      // optimistic state retained
    }
  };

  const initial = review.userName?.[0]?.toUpperCase() || "T";

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e2ede0] shadow-xs space-y-3 transition-all hover:border-[#cadbc7]">
      {/* Top Header: Avatar, Name, Rating & Badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#1b4329] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
            {initial}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-sm text-[#102416] truncate">{review.userName}</h4>
              {review.verifiedBooking && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle size={10} className="text-emerald-600" /> Verified Traveler
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#526b58] mt-0.5 flex-wrap">
              {review.travelerType && (
                <span className="bg-[#f0f5ee] px-2 py-0.5 rounded-md font-medium text-[#2d5037]">
                  {review.travelerType}
                </span>
              )}
              {review.visitMonth && (
                <span className="flex items-center gap-1">
                  <Calendar size={11} className="text-[#2D6A4F]" /> Visited in {review.visitMonth}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Star Rating Badge */}
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs shrink-0">
          <Star size={12} className="fill-amber-400 text-amber-500" />
          <span>{review.rating}.0</span>
        </div>
      </div>

      {/* Review Title */}
      {review.title && (
        <h5 className="font-bold text-sm sm:text-base text-[#102416] leading-snug">
          {review.title}
        </h5>
      )}

      {/* Review Comment Body */}
      <p className="text-xs sm:text-[13px] text-[#3d5343] leading-relaxed">
        {review.comment}
      </p>

      {/* Bottom Footer: Helpful Thumbs-Up */}
      <div className="flex items-center justify-between pt-2 border-t border-[#f0f4ef] text-xs">
        <span className="text-[11px] text-gray-400">
          {new Date(review.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>

        <button
          onClick={handleHelpful}
          disabled={hasLiked}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            hasLiked
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 text-gray-600 border border-gray-200"
          }`}
          title="Was this review helpful?"
        >
          <ThumbsUp size={12} className={hasLiked ? "fill-emerald-600 text-emerald-600" : ""} />
          <span>Helpful ({helpfulCount})</span>
        </button>
      </div>
    </div>
  );
}
