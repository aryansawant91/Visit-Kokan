export type ProductCategory =
  | "fruits"
  | "nuts"
  | "spices"
  | "beverages"
  | "pickles"
  | "homestay"
  | "activity"
  | "other";

export type ProductStatus = "pending" | "approved" | "rejected";

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
}

export interface ProductCoupon {
  code: string;
  discount: number;
  type: "percent" | "flat";
  minOrder?: number;
  label: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  unit: string;
  images: string[];
  videoUrl?: string;
  rating: number;
  reviewCount: number;
  stock: number;
  features?: string[];
  specifications?: Record<string, string>;
  coupons?: ProductCoupon[];
  vendorId?: string;
  vendorName?: string;
  addedByAdmin?: boolean;
  addedBy?: string;
  region: string;
  status: ProductStatus;
  approved: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  // Trending
  isFeaturedTrending?: boolean;
  trendingPriority?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}