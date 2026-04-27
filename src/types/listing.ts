export type ListingCategory =
  | "homestay"
  | "hotel"
  | "restaurant"
  | "activity"
  | "transport"
  | "shop"
  | "other";

export type ListingStatus = "pending" | "approved" | "rejected";

export interface Listing {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ListingCategory;
  region: string;
  address: string;
  images: string[];
  price?: number;
  priceUnit?: string;
  rating: number;
  reviewCount: number;
  phone?: string;
  website?: string;
  amenities?: string[];
  vendorId?: string;
  vendorName?: string;
  addedByAdmin?: boolean;
  addedBy?: string;
  status: ListingStatus;
  approved: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}