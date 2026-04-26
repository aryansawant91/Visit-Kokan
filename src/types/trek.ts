export type TrekDifficulty = "easy" | "moderate" | "hard" | "expert";

export type TrekCategory =
  | "coastal"
  | "forest"
  | "waterfall"
  | "fort"
  | "village"
  | "night"
  | "other";

export interface TrekItineraryDay {
  day: number;
  title: string;
  description: string;
  distance?: string;
  duration?: string;
}

export interface Trek {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: TrekCategory;
  region: string;
  difficulty: TrekDifficulty;
  duration: string;        // e.g. "1 Day", "2 Days 1 Night"
  distance: string;        // e.g. "12 km"
  maxAltitude?: string;    // e.g. "800m"
  startPoint: string;
  endPoint: string;
  images: string[];
  highlights: string[];
  itinerary: TrekItineraryDay[];
  thingsToBring: string[];
  bestSeason: string;
  price?: number;          // base price per person
  groupSize?: string;      // e.g. "2-15 people"
  addedBy: string;
  approved: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}