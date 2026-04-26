export type DestinationCategory =
  | "beach"
  | "fort"
  | "waterfall"
  | "temple"
  | "village"
  | "island"
  | "trek"
  | "other";

export interface Destination {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: DestinationCategory;
  region: string;
  images: string[];
  highlights: string[];   // e.g. ["Sunset views", "Snorkeling"]
  bestSeason: string;     // e.g. "October to March"
  howToReach: string;
  addedBy: string;        // admin uid
  approved: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}