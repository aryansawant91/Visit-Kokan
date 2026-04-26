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

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  unit: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  vendorId?: string;       // optional — null for admin-added products
  vendorName?: string;     // optional — "Visit Kokan Team" for admin products
  addedByAdmin?: boolean;  // true when admin adds directly
  addedBy?: string;        // admin's uid for audit trail
  region: string;
  status: ProductStatus;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}