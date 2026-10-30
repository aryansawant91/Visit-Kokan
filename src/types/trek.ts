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

export interface TrekHowToReach {
  byTrain?: string;
  byBus?: string;
  byRoad?: string;
  distanceFromMumbai?: string;
  nearestRailwayStation?: string;
}

export interface TrekWeatherStats {
  temp?: string;
  wind?: string;
  rainProb?: string;
  uv?: string;
  visibility?: string;
}

export interface BaseVillageInfo {
  name: string;
  marathiName: string;
  isPrimary?: boolean;
  difficulty: string;
  distanceFromBase: string;
  trailDuration: string;
  popularFor: string;
  routeDescription: string;
  coordinates: {
    lat: number;
    lng: number;
  };
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
  baseVillage?: string;
  baseVillages?: BaseVillageInfo[];
  elevation?: string;
  trailType?: string;
  trailDistance?: string;
  trailDuration?: string;
  history?: string;
  howToReach?: TrekHowToReach;
  fortAttractions?: string[];
  weatherStats?: TrekWeatherStats;
  coordinates?: {
    lat: number;
    lng: number;
  };
  images: string[];
  highlights: string[];
  itinerary: TrekItineraryDay[];
  thingsToBring: string[];
  bestSeason: string;
  price?: number;  
  scheduledDate?: string | null;        // base price per person
  advanceAmount?: number;
  whatsappGroupLink?: string;
  groupSize?: string;      // e.g. "2-15 people"
  addedBy: string;
  approved: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
