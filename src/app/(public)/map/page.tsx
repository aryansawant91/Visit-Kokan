import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Compass, MapPin } from "lucide-react";

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

const KonkanMapExplorer = dynamic(
  () => import("@/components/map/KonkanMapExplorer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[calc(100vh-64px)] min-h-[600px] bg-slate-900 flex flex-col items-center justify-center text-white space-y-3">
        <div className="w-12 h-12 border-4 border-[#b8dc26] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-emerald-200">
          Loading Interactive Konkan Coastal Map...
        </p>
      </div>
    ),
  }
);

export default function MapPage() {
  return <KonkanMapExplorer />;
}

