import { useState, useEffect, useCallback } from "react";
import { Review, ReviewStats } from "@/types/review";

export function useReviews(targetType: string, targetId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!targetId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reviews?targetType=${targetType}&targetId=${targetId}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
        setStats(data.stats || null);
      } else {
        setError(data.error || "Failed to load reviews");
      }
    } catch {
      setError("Network error loading reviews");
    } finally {
      setLoading(false);
    }
  }, [targetType, targetId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, stats, loading, error, refetch: fetchReviews };
}
