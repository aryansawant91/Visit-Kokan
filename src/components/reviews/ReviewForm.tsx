"use client";

import React, { useState } from "react";
import { Star, X, Loader2, Send, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Review } from "@/types/review";

interface Props {
  targetType: "destination" | "trek" | "listing" | "product";
  targetId: string;
  targetName?: string;
  onSuccess: (newReview: Review) => void;
  onClose?: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Terrible 😞",
  2: "Poor 😐",
  3: "Average 🙂",
  4: "Very Good! 😊",
  5: "Exceptional! 🌟",
};

const TRAVELER_TYPES: Review["travelerType"][] = [
  "Family",
  "Couple",
  "Friends Group",
  "Solo",
  "Backpacker",
];

export default function ReviewForm({
  targetType,
  targetId,
  targetName,
  onSuccess,
  onClose,
}: Props) {
  const { user, profile } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userName, setUserName] = useState<string>(
    profile?.displayName || user?.displayName || ""
  );
  const [travelerType, setTravelerType] = useState<Review["travelerType"]>("Family");
  const [visitMonth, setVisitMonth] = useState<string>("October");
  const [title, setTitle] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const activeRating = hoverRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Please write a few words about your experience.");
      return;
    }
    if (!userName.trim()) {
      setError("Please provide your name.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          targetName,
          userId: user?.uid || null,
          userName: userName.trim(),
          rating,
          title: title.trim(),
          comment: comment.trim(),
          travelerType,
          visitMonth,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess(data.review);
      } else {
        setError(data.error || "Failed to submit review");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cadbc7] shadow-lg relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      )}

      <div className="mb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold tracking-wide uppercase mb-1">
          <Sparkles size={11} className="text-emerald-600" /> Share Your Experience
        </div>
        <h3 className="text-lg font-black text-[#102416]">
          Review {targetName || "This Experience"}
        </h3>
        <p className="text-xs text-[#526b58] mt-0.5">
          Your authentic feedback helps fellow travelers discover the beauty of Konkan
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating Selector */}
        <div>
          <label className="block text-xs font-bold text-[#102416] mb-1.5">
            Overall Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  aria-label={`${star} Stars`}
                >
                  <Star
                    size={28}
                    className={
                      star <= activeRating
                        ? "fill-amber-400 text-amber-500"
                        : "fill-gray-100 text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-extrabold text-[#2D6A4F] ml-2">
              {RATING_LABELS[activeRating] || ""}
            </span>
          </div>
        </div>

        {/* Traveler Type Chips */}
        <div>
          <label className="block text-xs font-bold text-[#102416] mb-1.5">
            Who did you travel with?
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TRAVELER_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTravelerType(type)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  travelerType === type
                    ? "bg-[#1b4329] text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Name & Visit Month in 2 Cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#102416] mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Ramesh Sawant"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#cadbc7] bg-[#fbfdfa] text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#102416] mb-1">
              Month of Visit
            </label>
            <select
              value={visitMonth}
              onChange={(e) => setVisitMonth(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#cadbc7] bg-[#fbfdfa] text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
            >
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Review Title */}
        <div>
          <label className="block text-xs font-bold text-[#102416] mb-1">
            Review Title <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Breathtaking sea views & amazing local Malvani thali!"
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#cadbc7] bg-[#fbfdfa] text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
          />
        </div>

        {/* Detailed Comment */}
        <div>
          <label className="block text-xs font-bold text-[#102416] mb-1">
            Detailed Review &amp; Tips <span className="text-red-500">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Share helpful tips for other travelers: Best time for sunset, food to try, road condition, what to carry..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#cadbc7] bg-[#fbfdfa] text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 leading-relaxed font-medium resize-none"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-2 pt-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#1b4329] hover:bg-[#143520] active:scale-95 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Posting Review...</span>
              </>
            ) : (
              <>
                <Send size={13} />
                <span>Post Traveler Review</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
