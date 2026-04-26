export type ListingCategory =
  | "homestay"
  | "hotel"
  | "restaurant"
  | "activity"
  | "transport"
  | "shop"
  | "other";

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
  rating?: number;
  reviewCount?: number;
  phone?: string;
  website?: string;
  vendorId?: string;
  vendorName?: string;
  approved: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}