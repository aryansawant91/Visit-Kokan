"use client";

import React, { useState, useEffect } from "react";
import { Review, ReviewStats } from "@/types/review";
import RatingSummary from "./RatingSummary";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { Filter, Star, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

interface Props {
  targetType: "destination" | "trek" | "listing" | "product";
  targetId: string;
  targetName?: string;
}

type FilterOption = "all" | "5star" | "family" | "couple";

export default function ReviewList({ targetType, targetId, targetName }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 4.9,
    totalReviews: 0,
    breakdown: [5, 4, 3, 2, 1].map((s) => ({ star: s, count: 0, percent: 0 })),
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [targetType, targetId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?targetType=${targetType}&targetId=${targetId}`);
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSuccess = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
    setStats((prev) => {
      const newTotal = prev.totalReviews + 1;
      const sum = prev.averageRating * prev.totalReviews + newReview.rating;
      return {
        ...prev,
        totalReviews: newTotal,
        averageRating: Math.round((sum / newTotal) * 10) / 10,
      };
    });
    setShowForm(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === "5star") return r.rating === 5;
    if (activeFilter === "family") return r.travelerType?.toLowerCase().includes("family");
    if (activeFilter === "couple") return r.travelerType?.toLowerCase().includes("couple");
    return true;
  });

  return (
    <div className="space-y-5" id="reviews-section">
      {/* Success Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Thank you! Your traveler review has been posted and is now live.</span>
        </div>
      )}

      {/* 1. Rating Summary Banner */}
      <RatingSummary
        stats={stats}
        onWriteReview={() => setShowForm(!showForm)}
        title={targetName ? `Reviews for ${targetName}` : "Traveler Reviews"}
      />

      {/* 2. Review Form (Collapsible or Triggered) */}
      {showForm && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <ReviewForm
            targetType={targetType}
            targetId={targetId}
            targetName={targetName}
            onSuccess={handleReviewSuccess}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}

      {/* 3. Review Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
          <Filter size={12} /> Filter:
        </span>
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            activeFilter === "all"
              ? "bg-[#1b4329] text-white shadow-xs"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          All Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveFilter("5star")}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            activeFilter === "5star"
              ? "bg-[#1b4329] text-white shadow-xs"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Star size={11} className="fill-amber-400 text-amber-500" />
          5-Star Experiences
        </button>
        <button
          onClick={() => setActiveFilter("family")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            activeFilter === "family"
              ? "bg-[#1b4329] text-white shadow-xs"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          Families
        </button>
        <button
          onClick={() => setActiveFilter("couple")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            activeFilter === "couple"
              ? "bg-[#1b4329] text-white shadow-xs"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          Couples
        </button>
      </div>

      {/* 4. List of Reviews */}
      {loading ? (
        <div className="flex items-center justify-center p-8 text-gray-400 gap-2">
          <Loader2 size={18} className="animate-spin text-[#2D6A4F]" />
          <span className="text-xs font-medium">Loading traveler reviews...</span>
        </div>
      ) : filteredReviews.length > 0 ? (
        <div className="space-y-3">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-3xl border border-[#e2ede0] p-6">
          <div className="text-2xl mb-1">✍️</div>
          <p className="text-xs font-bold text-[#102416]">No reviews match this filter</p>
          <p className="text-[11px] text-[#526b58] mt-0.5">
            Switch back to &quot;All Reviews&quot; to read other traveler experiences.
          </p>
        </div>
      )}
    </div>
  );
}
