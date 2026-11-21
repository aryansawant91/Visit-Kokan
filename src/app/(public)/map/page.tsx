import { Metadata } from "next";
import KonkanMap from "./KonkanMap";

export const metadata: Metadata = {
  title: "Interactive Konkan Visual Route Map 2026 — Beaches, Forts & Ferries | Visit Kokan",
  description:
    "Interactive map of coastal Maharashtra. Explore 48 destinations, 60 Sahyadri forts & mountain treks, and 5 vehicle ferry shortcuts across Raigad, Ratnagiri, and Sindhudurg.",
  keywords: [
    "Konkan interactive map",
    "Maharashtra coastal route map",
    "Ratnagiri beach map",
    "Sindhudurg tourist map",
    "Raigad forts map",
    "Konkan ferry routes map",
  ],
  openGraph: {
    title: "Interactive Konkan Coastal Map Explorer 2026 | Visit Kokan",
    description:
      "Explore the entire 720 km Konkan coastline on an interactive map. Pinpoint beaches, sea forts, waterfalls, ferry crossings and driving distances.",
    url: "https://visitkokan.in/map",
    type: "website",
  },
};

export default function MapPage() {
  return <KonkanMap />;
}

