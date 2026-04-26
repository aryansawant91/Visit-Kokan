export type BlogCategory =
  | "travel-tips"
  | "food-culture"
  | "trek-guides"
  | "beach-guides"
  | "festivals"
  | "local-life"
  | "nature"
  | "history";

export type BlogStatus = "pending" | "approved" | "rejected";

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: BlogCategory;
  tags: string[];
  authorId: string;
  authorName: string;
  authorRole: "admin" | "vendor" | "user";
  status: BlogStatus;
  approved: boolean;
  readTime: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}