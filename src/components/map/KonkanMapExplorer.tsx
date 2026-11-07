"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Navigation,
  Compass,
  Ship,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Search,
  X,
  Layers,
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  Info,
} from "lucide-react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { KONKAN_MAP_SPOTS, KonkanMapSpot, MapSpotCategory, MapDistrict } from "@/data/konkanMapLocations";

// Helper component to programmatically pan/fly the map
function MapController({
  center,
  zoom,
}: {
  center: [number, number] | null;
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom Category Marker Icons
function createCustomIcon(category: MapSpotCategory, isSelected: boolean) {
  let bg = "#0284c7"; // default blue
  let emoji = "📍";

  switch (category) {
    case "beach":
      bg = "#0284c7";
      emoji = "🏖️";
      break;
    case "fort":
      bg = "#b45309";
      emoji = "🏰";
      break;
    case "temple":
      bg = "#7e22ce";
      emoji = "🛕";
      break;
    case "waterfall":
      bg = "#059669";
      emoji = "💧";
      break;
    case "ferry":
      bg = "#0f766e";
      emoji = "🚢";
      break;
    case "town":
      bg = "#334155";
      emoji = "🏘️";
      break;
    default:
      bg = "#166534";
      emoji = "📍";
  }

  const size = isSelected ? 42 : 32;
  const border = isSelected ? "3px solid #b8dc26" : "2px solid #ffffff";
  const shadow = isSelected
    ? "0 0 16px rgba(184, 220, 38, 0.9), 0 4px 10px rgba(0,0,0,0.4)"
    : "0 2px 6px rgba(0,0,0,0.3)";

  const html = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      background: ${bg};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: ${border};
      box-shadow: ${shadow};
      font-size: ${isSelected ? 20 : 15}px;
      transition: all 0.2s ease;
      cursor: pointer;
    ">
      <span>${emoji}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-leaflet-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

export default function KonkanMapExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSpot, setSelectedSpot] = useState<KonkanMapSpot | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>([17.3, 73.4]);
  const [mapZoom, setMapZoom] = useState<number>(8);

  // District Jump Coordinates
  const districtCenters: Record<string, { center: [number, number]; zoom: number }> = {
    all: { center: [17.3, 73.4], zoom: 8 },
    Raigad: { center: [18.35, 73.1], zoom: 9.5 },
    Ratnagiri: { center: [17.3, 73.3], zoom: 9 },
    Sindhudurg: { center: [16.1, 73.6], zoom: 9 },
    "Western Ghats": { center: [18.8, 73.6], zoom: 9 },
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const target = districtCenters[dist] || districtCenters.all;
    setMapCenter(target.center);
    setMapZoom(target.zoom);
  };

  const filteredSpots = useMemo(() => {
    return KONKAN_MAP_SPOTS.filter((spot) => {
      if (selectedCategory !== "all" && spot.category !== selectedCategory) return false;
      if (selectedDistrict !== "all" && spot.district !== selectedDistrict) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = spot.name.toLowerCase().includes(q);
        const inTag = spot.tagline.toLowerCase().includes(q);
        const inDist = spot.district.toLowerCase().includes(q);
        if (!inName && !inTag && !inDist) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedDistrict, searchQuery]);

  const selectSpotOnMap = (spot: KonkanMapSpot) => {
    setSelectedSpot(spot);
    setMapCenter([spot.lat, spot.lng]);
    setMapZoom(12);
  };

  const categories = [
    { id: "all", label: "All Spots", icon: "✨" },
    { id: "beach", label: "Beaches", icon: "🏖️" },
    { id: "fort", label: "Forts & Treks", icon: "🏰" },
    { id: "temple", label: "Temples", icon: "🛕" },
    { id: "ferry", label: "Ferry Crossings", icon: "🚢" },
    { id: "waterfall", label: "Waterfalls & Nature", icon: "💧" },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[600px] flex flex-col overflow-hidden bg-slate-900">
      {/* ══════════════════════════════════════════════════════════════
          1. TOP OVERLAY FILTER BAR
         ══════════════════════════════════════════════════════════════ */}
      <div className="absolute top-3 inset-x-3 sm:inset-x-6 z-[1000] space-y-2 pointer-events-none">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-auto">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-1 flex items-center">
            <Search className="w-4 h-4 text-emerald-800 ml-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spots (e.g. Ganpatipule, Torna, Velas, Mandwa...)"
              className="w-full pl-2 pr-3 py-1.5 bg-transparent text-xs sm:text-sm text-gray-800 outline-none font-medium placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 rounded-full hover:bg-gray-200 text-gray-500 mr-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* District Quick Jumps */}
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/20 text-xs overflow-x-auto no-scrollbar shadow-lg">
            {(["all", "Raigad", "Ratnagiri", "Sindhudurg"] as const).map((dist) => (
              <button
                key={dist}
                type="button"
                onClick={() => handleDistrictChange(dist)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                  selectedDistrict === dist
                    ? "bg-[#b8dc26] text-emerald-950 shadow-xs"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {dist === "all" ? "Whole Konkan" : dist}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pointer-events-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-md backdrop-blur-md cursor-pointer ${
                selectedCategory === c.id
                  ? "bg-emerald-600 text-white border border-emerald-400"
                  : "bg-white/90 text-gray-800 hover:bg-white border border-gray-200"
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
              <span className="text-[10px] opacity-70 ml-0.5">
                (
                {
                  KONKAN_MAP_SPOTS.filter(
                    (s) => c.id === "all" || s.category === c.id
                  ).length
                }
                )
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. LEAFLET MAP CONTAINER
         ══════════════════════════════════════════════════════════════ */}
      <div className="relative flex-1 w-full h-full z-0">
        <MapContainer
          center={[17.3, 73.4]}
          zoom={8}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%", background: "#0f172a" }}
        >
          <MapController center={mapCenter} zoom={mapZoom} />

          {/* CartoDB Voyager Tile Layer (Modern, crisp, luxury travel aesthetic) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />

          {/* Markers */}
          {filteredSpots.map((spot) => {
            const isSelected = selectedSpot?.id === spot.id;
            return (
              <Marker
                key={spot.id}
                position={[spot.lat, spot.lng]}
                icon={createCustomIcon(spot.category, isSelected)}
                eventHandlers={{
                  click: () => {
                    selectSpotOnMap(spot);
                  },
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 space-y-1 text-xs">
                    <p className="font-bold text-gray-900 text-sm">{spot.name}</p>
                    <p className="text-gray-500 text-[11px]">{spot.tagline}</p>
                    <button
                      type="button"
                      onClick={() => selectSpotOnMap(spot)}
                      className="text-emerald-700 font-bold text-[11px] hover:underline"
                    >
                      View Details →
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. FLOATING SPOT PREVIEW CARD
         ══════════════════════════════════════════════════════════════ */}
      {selectedSpot && (
        <div className="absolute bottom-4 inset-x-3 sm:inset-x-auto sm:left-6 sm:w-96 z-[1000] animate-slideUp">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-600/30 overflow-hidden flex flex-col">
            {/* Top Image Preview & Close */}
            <div className="relative h-36 w-full bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedSpot.image}
                alt={selectedSpot.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedSpot(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors cursor-pointer"
                aria-label="Close Preview"
              >
                <X size={14} />
              </button>

              <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-end justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-white text-[10px] font-black uppercase tracking-wider">
                    {selectedSpot.district} · {selectedSpot.category}
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-white leading-tight drop-shadow-sm mt-0.5">
                    {selectedSpot.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-lg backdrop-blur-xs text-xs font-bold text-[#b8dc26]">
                  <Star size={12} className="fill-[#b8dc26]" />
                  <span>{selectedSpot.rating}</span>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3 bg-[#fafcf9]">
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                {selectedSpot.tagline}
              </p>

              {/* Transit Distance Badges */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-gray-600">
                <div className="p-2 bg-white rounded-xl border border-gray-200">
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">From Mumbai</span>
                  <span className="font-bold text-[#113822]">{selectedSpot.distanceFromMumbai}</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-gray-200">
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">From Pune</span>
                  <span className="font-bold text-[#113822]">{selectedSpot.distanceFromPune}</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap gap-1">
                {selectedSpot.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"
                  >
                    ✓ {h}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <Link
                  href={
                    selectedSpot.externalLink ||
                    (selectedSpot.type === "trek"
                      ? `/treks/${selectedSpot.slug}`
                      : `/destinations/${selectedSpot.slug}`)
                  }
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-kokan-green hover:bg-emerald-800 active:scale-98 text-white rounded-xl font-bold text-xs shadow-md shadow-kokan-green/20 transition-all cursor-pointer"
                >
                  <span>Explore Guide</span>
                  <ArrowRight size={13} />
                </Link>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.lat},${selectedSpot.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 rounded-xl font-bold text-xs transition-colors cursor-pointer shrink-0"
                  title="Open driving directions in Google Maps"
                >
                  <Navigation size={13} className="text-emerald-700" />
                  <span>Navigate</span>
                  <ExternalLink size={10} className="text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          4. BOTTOM RIGHT MAP LEGEND
         ══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block absolute bottom-4 right-4 z-[1000] bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-gray-200 shadow-lg text-[11px] text-gray-700 space-y-1.5 pointer-events-auto">
        <p className="font-black uppercase tracking-wider text-gray-400 text-[10px]">
          Map Legend ({filteredSpots.length} spots visible)
        </p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
            <span>Beaches</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b45309]" />
            <span>Forts &amp; Treks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7e22ce]" />
            <span>Temples</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0f766e]" />
            <span>Ferry Crossings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
            <span>Waterfalls</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#334155]" />
            <span>Towns &amp; Ports</span>
          </div>
        </div>
      </div>
    </div>
  );
}
