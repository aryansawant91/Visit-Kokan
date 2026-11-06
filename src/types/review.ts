export interface Review {
  id: string;
  targetType: "destination" | "trek" | "listing" | "product";
  targetId: string; // id or slug
  targetName?: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  travelerType?: "Solo" | "Couple" | "Family" | "Friends Group" | "Backpacker";
  visitMonth?: string;
  verifiedBooking?: boolean;
  helpfulCount?: number;
  tags?: string[];
  createdAt: string;
  approved?: boolean;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  breakdown: {
    star: number;
    count: number;
    percent: number;
  }[];
}
