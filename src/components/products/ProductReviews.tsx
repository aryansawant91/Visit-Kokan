"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Star, ThumbsUp, ImageIcon, Send, Filter } from "lucide-react";
import { ProductReview } from "@/types/product";
import Image from "next/image";

interface Props {
  productId: string;
  rating: number;
  reviewCount: number;
}

type FilterType = "latest" | "highest" | "images";

export default function ProductReviews({ productId, rating, reviewCount }: Props) {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("latest");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [myRating, setMyRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await fetch(`/api/products/reviews?productId=${productId}`);
    const data = await res.json();
    setReviews(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const filtered = [...reviews].sort((a, b) => {
    if (filter === "highest") return b.rating - a.rating;
    if (filter === "images") return (b.images?.length ?? 0) - (a.images?.length ?? 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }).filter((r) => filter === "images" ? (r.images?.length ?? 0) > 0 : true);

  const handleSubmit = async () => {
    if (!user || !comment.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/products/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userId: user.uid,
          userName: profile?.displayName ?? user.email,
          rating: myRating,
          comment,
          images: [],
        }),
      });
      setSuccess(true);
      setComment("");
      setMyRating(5);
      setShowForm(false);
      await fetchReviews();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Rating breakdown
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
    percent: reviews.length > 0
      ? (reviews.filter((r) => Math.round(r.rating) === star).length / reviews.length) * 100
      : 0,
  }));

  return (
    <div className="space-y-6">
      <h2 className="font-playfair text-2xl font-bold text-kokan-earth">
        Reviews & Ratings
      </h2>

      {/* Rating summary */}
      <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30">
        <div className="flex items-start gap-8">
          {/* Big rating */}
          <div className="text-center flex-shrink-0">
            <p className="text-5xl font-bold text-kokan-earth">{rating.toFixed(1)}</p>
            <div className="flex items-center justify-center gap-0.5 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-kokan-sand"}`}
                />
              ))}
            </div>
            <p className="text-xs text-kokan-earth/50">{reviewCount} reviews</p>
          </div>

          {/* Breakdown bars */}
          <div className="flex-1 space-y-2">
            {breakdown.map(({ star, count, percent }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-kokan-earth/60 w-4">{star}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                <div className="flex-1 bg-kokan-sand/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs text-kokan-earth/40 w-5">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write review button */}
        {user ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-kokan-green text-white rounded-xl text-sm font-semibold hover:bg-kokan-green/90 transition-colors"
          >
            <Star className="w-4 h-4" />
            Write a Review
          </button>
        ) : (
          <p className="mt-4 text-sm text-kokan-earth/50">
            <a href="/login" className="text-kokan-green underline">Login</a> to write a review
          </p>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-kokan-green/30 space-y-4">
          <h3 className="font-semibold text-kokan-earth">Your Review</h3>

          {/* Star picker */}
          <div>
            <p className="text-xs text-kokan-earth/50 mb-2">Your Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setMyRating(s)}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      s <= (hoverRating || myRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-kokan-sand"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-kokan-earth/50 mb-2">Your Comment</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              className="w-full border border-kokan-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 resize-none"
            />
          </div>

          {success && (
            <p className="text-sm text-kokan-green font-medium">✓ Review submitted successfully!</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-kokan-sand rounded-xl text-sm text-kokan-earth/60 hover:bg-kokan-sand/10"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !comment.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-kokan-green text-white rounded-xl text-sm font-semibold hover:bg-kokan-green/90 disabled:opacity-60"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Send className="w-4 h-4" /> Submit</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-kokan-earth/40" />
        {(["latest", "highest", "images"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
              filter === f
                ? "bg-kokan-green text-white"
                : "bg-white border border-kokan-sand/40 text-kokan-earth/60"
            }`}
          >
            {f === "images" ? "With Photos" : f === "highest" ? "Top Rated" : "Latest"}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-28 animate-pulse border border-kokan-sand/30" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-kokan-sand/30 text-center">
          <p className="text-kokan-earth/40 text-sm">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-5 border border-kokan-sand/30 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-kokan-green/10 flex items-center justify-center text-kokan-green font-bold text-sm">
                    {review.userName?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <div>
                    <p className="font-medium text-kokan-earth text-sm">{review.userName}</p>
                    <p className="text-xs text-kokan-earth/40">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-kokan-sand"}`}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-kokan-earth/70 leading-relaxed">{review.comment}</p>
              )}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {review.images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image src={img} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}