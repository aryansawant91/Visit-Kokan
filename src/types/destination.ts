export type DestinationCategory =
  | "beach"
  | "fort"
  | "waterfall"
  | "temple"
  | "village"
  | "island"
  | "trek"
  | "other";

export interface HowToReachDetails {
  byTrain?: string;
  byRoad?: string;
  byFerry?: string;
  tip?: string;
}

export interface NearbyPlace {
  name: string;
  distance: string;
  why: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  coverImage?: string;
  description: string;
  category: DestinationCategory;
  region: string;
  images: string[];
  highlights: string[];   // e.g. ["Sunset views", "Snorkeling"]
  bestSeason: string;     // e.g. "October to March"
  howToReach: string | HowToReachDetails;
  thingsToDo?: string[];
  foodToTry?: string[];
  nearbyPlaces?: NearbyPlace[];
  stayOptions?: string;
  entryFee?: string;
  timings?: string;
  bestTimeToVisit?: string;
  warnings?: string[];
  tags?: string[];
  addedBy?: string;        // admin uid
  approved: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  shortDescription?: string;
}