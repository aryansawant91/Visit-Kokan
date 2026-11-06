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
  // Extended MMT/Agoda-style host fields
  stayType?: string;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  weekendPrice?: number;
  extraGuestPrice?: number;
  mealsAvailable?: string[];
  distanceToBeach?: string;
  landmark?: string;
  checkInTime?: string;
  checkOutTime?: string;
  cancellationPolicy?: string;
  houseRules?: string[];
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