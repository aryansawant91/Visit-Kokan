"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Props {
  listingId: string;
  rating: number;
  reviewCount: number;
}

export default function ListingReviews({ listingId, rating, reviewCount }: Props) {
  const { user } = useAuth();
  const [reviews] = useState<Review[]>([]);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || !selectedStar || !comment.trim()) return;
    setSubmitting(true);
    // Reviews API to be built in reviews feature
    setTimeout(() => {
      setSubmitting(false);
      setSelectedStar(0);
      setComment("");
      alert("Review submitted! It will appear after approval.");
    }, 1000);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-kokan-earth">{rating.toFixed(1)}</div>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={14}
                className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
              />
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-1">{reviewCount} reviews</p>
        </div>
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-2xl mb-6">
          <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
        </div>
      )}

      {/* Write review */}
      {user ? (
        <div className="bg-kokan-cream/30 rounded-2xl p-5 border border-kokan-sand/20">
          <h4 className="font-semibold text-kokan-earth mb-3">Write a Review</h4>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHoveredStar(s)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setSelectedStar(s)}
              >
                <Star
                  size={24}
                  className={s <= (hoveredStar || selectedStar)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-300 fill-gray-300"
                  }
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 resize-none bg-white mb-3"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !selectedStar || !comment.trim()}
            className="px-6 py-2.5 bg-kokan-green text-white rounded-xl text-sm font-semibold hover:bg-kokan-green/90 disabled:opacity-50 transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
          <p className="text-gray-500 text-sm">
            <a href="/login" className="text-kokan-green font-medium hover:underline">Login</a> to write a review
          </p>
        </div>
      )}
    </div>
  );
}