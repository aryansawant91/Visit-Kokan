"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
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
  ArrowLeftRight,
  Route,
  Fuel,
  Info,
  LocateFixed,
  Loader2,
  ChevronDown,
  Share2,
} from "lucide-react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  KONKAN_MAP_SPOTS,
  KonkanMapSpot,
  MapSpotCategory,
  MapDistrict,
} from "@/data/konkanMapLocations";

// ══════════════════════════════════════════════════════════════
// 1. STYLES & PRESETS (100% Free OpenFreeMap Vector Tiles)
// ══════════════════════════════════════════════════════════════
type VectorStyleKey = "liberty" | "bright" | "positron";

interface VectorStyleConfig {
  label: string;
  icon: string;
  url: string;
  description: string;
}

const VECTOR_STYLES: Record<VectorStyleKey, VectorStyleConfig> = {
  liberty: {
    label: "Google/Apple",
    icon: "🗺️",
    url: "https://tiles.openfreemap.org/styles/liberty",
    description: "Classic travel map with clear roads & green hills",
  },
  bright: {
    label: "Vibrant",
    icon: "🌿",
    url: "https://tiles.openfreemap.org/styles/bright",
    description: "High-contrast tourist landscape",
  },
  positron: {
    label: "Minimal",
    icon: "🏙️",
    url: "https://tiles.openfreemap.org/styles/positron",
    description: "Clean luxury light style",
  },
};

// Common Starting Points for Konkan Road Trips
export interface OriginPoint {
  id: string;
  name: string;
  shortName: string;
  lng: number;
  lat: number;
  tag?: string;
}

export const COMMON_START_HUBS: OriginPoint[] = [
  {
    id: "mumbai-dadar",
    name: "Mumbai (Dadar / Central)",
    shortName: "Mumbai",
    lng: 72.8478,
    lat: 19.0178,
    tag: "Capital Hub",
  },
  {
    id: "mumbai-vashi",
    name: "Navi Mumbai (Vashi / Atal Setu)",
    shortName: "Navi Mumbai",
    lng: 72.9992,
    lat: 19.0771,
    tag: "Fastest via MTHL",
  },
  {
    id: "mumbai-thane",
    name: "Thane (Eastern Exp Hwy)",
    shortName: "Thane",
    lng: 72.9781,
    lat: 19.2183,
  },
  {
    id: "pune-kothrud",
    name: "Pune (Kothrud / Chandani Chowk)",
    shortName: "Pune (West)",
    lng: 73.8166,
    lat: 18.5074,
    tag: "Via Tamhini / Varandha",
  },
  {
    id: "pune-hinjawadi",
    name: "Pune (Hinjawadi / Expressway)",
    shortName: "Pune (Exp)",
    lng: 73.728,
    lat: 18.5913,
  },
  {
    id: "kolhapur",
    name: "Kolhapur (Rankala / NH-48)",
    shortName: "Kolhapur",
    lng: 74.2433,
    lat: 16.705,
    tag: "South Konkan Gate",
  },
  {
    id: "panaji",
    name: "Goa (Panaji / Mapusa)",
    shortName: "Goa",
    lng: 73.8278,
    lat: 15.4909,
    tag: "Sindhudurg Border",
  },
];

interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  coordinates: [number, number][];
  summary: string;
}

// Marker Styling per Category
function getCategoryMarkerStyle(category: MapSpotCategory) {
  switch (category) {
    case "beach":
      return { bg: "#0284c7", emoji: "🏖️", border: "#38bdf8" };
    case "fort":
      return { bg: "#b45309", emoji: "🏰", border: "#f59e0b" };
    case "temple":
      return { bg: "#7e22ce", emoji: "🛕", border: "#c084fc" };
    case "waterfall":
      return { bg: "#059669", emoji: "💧", border: "#34d399" };
    case "ferry":
      return { bg: "#0f766e", emoji: "🚢", border: "#2dd4bf" };
    default:
      return { bg: "#334155", emoji: "📍", border: "#94a3b8" };
  }
}

export default function KonkanMapExplorer() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});

  // View Mode: Explore spots vs Directions / Routing
  const [activeTab, setActiveTab] = useState<"explore" | "directions">("explore");
  const [activeStyle, setActiveStyle] = useState<VectorStyleKey>("liberty");

  // Filters (Explore Mode)
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSpot, setSelectedSpot] = useState<KonkanMapSpot | null>(null);

  // Directions Mode State
  const [startPoint, setStartPoint] = useState<OriginPoint>(COMMON_START_HUBS[0]);
  const [destinationSpot, setDestinationSpot] = useState<KonkanMapSpot>(KONKAN_MAP_SPOTS[0]);
  const [isLocatingUser, setIsLocatingUser] = useState<boolean>(false);
  const [isRouting, setIsRouting] = useState<boolean>(false);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [showDirectionsDrawer, setShowDirectionsDrawer] = useState<boolean>(true);

  // District View Coordinates
  const districtViews: Record<string, { center: [number, number]; zoom: number; pitch: number }> = {
    all: { center: [73.35, 17.3], zoom: 8, pitch: 25 },
    Raigad: { center: [73.1, 18.35], zoom: 9.5, pitch: 35 },
    Ratnagiri: { center: [73.3, 17.3], zoom: 9, pitch: 35 },
    Sindhudurg: { center: [73.6, 16.1], zoom: 9, pitch: 35 },
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const view = districtViews[dist] || districtViews.all;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: view.center,
        zoom: view.zoom,
        pitch: view.pitch,
        duration: 1200,
        essential: true,
      });
    }
  };

  // Filtered Spots list
  const filteredSpots = useMemo(() => {
    return KONKAN_MAP_SPOTS.filter((spot) => {
      if (selectedCategory !== "all" && spot.category !== selectedCategory) return false;
      if (selectedDistrict !== "all" && spot.district !== selectedDistrict) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          spot.name.toLowerCase().includes(q) ||
          spot.tagline.toLowerCase().includes(q) ||
          spot.district.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, selectedDistrict, searchQuery]);

  // ══════════════════════════════════════════════════════════════
  // 2. INITIALIZE MAPLIBRE GL MAP
  // ══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: VECTOR_STYLES[activeStyle].url,
      center: [73.35, 17.3],
      zoom: 8,
      pitch: 25,
      bearing: 0,
      attributionControl: false,
    });

    // Add navigation controls (Zoom, Pitch, Compass)
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");

    // Add Attribution Control with OpenFreeMap & OSM credit
    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution:
          '<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      }),
      "bottom-left"
    );

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Style on change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setStyle(VECTOR_STYLES[activeStyle].url);
  }, [activeStyle]);

  // ══════════════════════════════════════════════════════════════
  // 3. RENDER MARKERS ON MAP
  // ══════════════════════════════════════════════════════════════
  const selectSpot = useCallback(
    (spot: KonkanMapSpot) => {
      setSelectedSpot(spot);
      if (activeTab === "directions") {
        setDestinationSpot(spot);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo({
          center: [spot.lng, spot.lat],
          zoom: 12,
          pitch: 45,
          duration: 1400,
          essential: true,
        });
      }
    },
    [activeTab]
  );

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing spot markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    filteredSpots.forEach((spot) => {
      const isSelected = selectedSpot?.id === spot.id;
      const isDestination = destinationSpot?.id === spot.id && activeTab === "directions";
      const style = getCategoryMarkerStyle(spot.category);

      const el = document.createElement("div");
      el.className = "konkan-vector-marker cursor-pointer group transition-transform";
      el.style.width = isSelected || isDestination ? "42px" : "32px";
      el.style.height = isSelected || isDestination ? "42px" : "32px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = isDestination ? "#10b981" : style.bg;
      el.style.border = isSelected || isDestination ? "3px solid #ffffff" : `2px solid ${style.border}`;
      el.style.boxShadow = isSelected || isDestination
        ? "0 0 0 4px rgba(16, 185, 129, 0.5), 0 8px 16px rgba(0,0,0,0.4)"
        : "0 4px 10px rgba(0,0,0,0.3)";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.fontSize = isSelected || isDestination ? "18px" : "14px";
      el.style.transition = "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)";
      el.innerHTML = `<span>${isDestination ? "🎯" : style.emoji}</span>`;

      el.addEventListener("click", () => {
        selectSpot(spot);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([spot.lng, spot.lat])
        .addTo(map);

      markersRef.current[spot.id] = marker;
    });
  }, [filteredSpots, selectedSpot, destinationSpot, activeTab, selectSpot]);

  // ══════════════════════════════════════════════════════════════
  // 4. POINT-TO-POINT ROUTING ENGINE (OSRM High-Speed Road API)
  // ══════════════════════════════════════════════════════════════
  const calculateRoute = useCallback(async () => {
    if (!startPoint || !destinationSpot) return;
    setIsRouting(true);
    setRouteError(null);

    const origin = [startPoint.lng, startPoint.lat];
    const dest = [destinationSpot.lng, destinationSpot.lat];

    try {
      // OSRM coordinates are in lng,lat format
      const url = `https://router.project-osrm.org/route/v1/driving/${origin[0]},${origin[1]};${dest[0]},${dest[1]}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Unable to fetch driving route from routing service");

      const data = await res.json();
      if (!data.routes || data.routes.length === 0) {
        throw new Error("No driving route found between these locations.");
      }

      const route = data.routes[0];
      const distKm = Math.round((route.distance / 1000) * 10) / 10;
      const durationMins = Math.round(route.duration / 60);

      const result: RouteResult = {
        distanceKm: distKm,
        durationMinutes: durationMins,
        coordinates: route.geometry.coordinates,
        summary: route.legs?.[0]?.summary || "NH-66 / Coastal Corridor",
      };

      setRouteResult(result);

      // Render route polyline on MapLibre map
      const map = mapInstanceRef.current;
      if (map) {
        const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: result.coordinates,
          },
        };

        if (map.getSource("route-source")) {
          (map.getSource("route-source") as maplibregl.GeoJSONSource).setData(geojson);
        } else {
          map.addSource("route-source", {
            type: "geojson",
            data: geojson,
          });

          // Route casing (dark emerald outline)
          map.addLayer({
            id: "route-casing",
            type: "line",
            source: "route-source",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#064e3b",
              "line-width": 9,
              "line-opacity": 0.85,
            },
          });

          // Route core (vibrant neon emerald road line)
          map.addLayer({
            id: "route-line",
            type: "line",
            source: "route-source",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#10b981",
              "line-width": 5,
            },
          });
        }

        // Fit map bounds to show full route comfortably
        const bounds = new maplibregl.LngLatBounds();
        result.coordinates.forEach((coord) => bounds.extend(coord));
        bounds.extend(origin as [number, number]);
        bounds.extend(dest as [number, number]);

        map.fitBounds(bounds, {
          padding: { top: 90, bottom: 220, left: 40, right: 40 },
          maxZoom: 14,
          duration: 1500,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Route calculation failed.";
      setRouteError(message);
    } finally {
      setIsRouting(false);
    }
  }, [startPoint, destinationSpot]);

  // Recalculate route whenever Start or Destination changes in Directions Mode
  useEffect(() => {
    if (activeTab === "directions") {
      calculateRoute();
    } else {
      // Clear route lines when in Explore Mode
      const map = mapInstanceRef.current;
      if (map && map.getSource("route-source")) {
        const emptyGeojson: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: [],
        };
        (map.getSource("route-source") as maplibregl.GeoJSONSource).setData(emptyGeojson);
      }
      setRouteResult(null);
    }
  }, [activeTab, startPoint, destinationSpot, calculateRoute]);

  // Locate User GPS
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingUser(false);
        const userLocation: OriginPoint = {
          id: "gps-current",
          name: "📍 My Current Location",
          shortName: "Current GPS",
          lng: pos.coords.longitude,
          lat: pos.coords.latitude,
          tag: "Live GPS",
        };
        setStartPoint(userLocation);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo({
            center: [pos.coords.longitude, pos.coords.latitude],
            zoom: 11,
            pitch: 30,
            duration: 1200,
          });
        }
      },
      (error) => {
        setIsLocatingUser(false);
        alert(`Could not get current location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Swap Start & Destination
  const handleSwapPoints = () => {
    const currentDest = destinationSpot;
    // Find closest spot to current start or use first spot
    const newDestSpot =
      KONKAN_MAP_SPOTS.find((s) => s.slug.includes(startPoint.id)) || KONKAN_MAP_SPOTS[0];
    const newStartPoint: OriginPoint = {
      id: currentDest.id,
      name: currentDest.name,
      shortName: currentDest.name.split(" ")[0],
      lng: currentDest.lng,
      lat: currentDest.lat,
    };
    setStartPoint(newStartPoint);
    setDestinationSpot(newDestSpot);
  };

  // Format Duration into Hrs & Mins
  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m} mins`;
    if (m === 0) return `${h} hrs`;
    return `${h} hrs ${m} mins`;
  };

  // Estimated Fuel Cost
  const fuelEstimate = useMemo(() => {
    if (!routeResult) return 0;
    const km = routeResult.distanceKm;
    // approx 14 km/L mileage @ ₹104/L petrol in Maharashtra
    return Math.round((km / 14) * 104);
  }, [routeResult]);

  // Smart Ro-Pax Ferry Alert
  const ferryAdvantage = useMemo(() => {
    if (!destinationSpot || !startPoint) return null;
    const isMumbaiOrigin =
      startPoint.id.includes("mumbai") ||
      (startPoint.lat > 18.9 && startPoint.lng < 73.1);

    // Mumbai -> Alibaug/Murud/Kashid
    if (isMumbaiOrigin && destinationSpot.district === "Raigad") {
      return {
        title: "Mandwa Ro-Pax Ferry Shortcut",
        text: "Save ~2.5 hrs & 75 km by boarding the Bhaucha Dhakka to Mandwa car ferry with your vehicle!",
        link: "/ferry#mandwa-bhauchadhakka",
      };
    }

    // Cross-creek trips (Dabhol-Dhopave / Jaigad-Tavsal)
    if (
      destinationSpot.name.includes("Guhagar") ||
      destinationSpot.name.includes("Jaigad") ||
      destinationSpot.name.includes("Ganpatipule")
    ) {
      return {
        title: "Jaigad & Dabhol Ferry Route",
        text: "Direct coastal Ro-Pax ferry bypasses 55+ km of winding mountain ghats across the creek.",
        link: "/ferry#jaigad-tavsal",
      };
    }

    return null;
  }, [destinationSpot, startPoint]);

  const categories: { id: string; label: string; icon: string }[] = [
    { id: "all", label: "All Spots", icon: "✨" },
    { id: "beach", label: "Beaches", icon: "🏖️" },
    { id: "fort", label: "Forts & Treks", icon: "🏰" },
    { id: "temple", label: "Temples", icon: "🛕" },
    { id: "ferry", label: "Ferry Crossings", icon: "🚢" },
    { id: "waterfall", label: "Waterfalls", icon: "💧" },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[600px] flex flex-col overflow-hidden bg-slate-950 font-sans">
      {/* ══════════════════════════════════════════════════════════════
          1. TOP APP BAR & MODE SWITCHER
         ══════════════════════════════════════════════════════════════ */}
      <div className="absolute top-3 inset-x-3 sm:inset-x-6 z-[100] space-y-2 pointer-events-none">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-auto">
          {/* Dual Mode Switcher: Explore vs Directions */}
          <div className="flex items-center bg-black/80 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveTab("explore")}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "explore"
                  ? "bg-[#b8dc26] text-emerald-950 shadow-md scale-102"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Compass size={15} />
              <span>Explore Spots</span>
              <span className="text-[10px] opacity-70">({KONKAN_MAP_SPOTS.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("directions");
                if (!destinationSpot && selectedSpot) {
                  setDestinationSpot(selectedSpot);
                }
              }}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "directions"
                  ? "bg-emerald-500 text-white shadow-md scale-102"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Route size={15} />
              <span>Route &amp; Distance</span>
              <span className="px-1.5 py-0.2 bg-emerald-900/60 text-[#b8dc26] text-[10px] rounded-full font-black uppercase">
                Live
              </span>
            </button>
          </div>

          {/* Right Controls: Style Switcher & District Jumps */}
          <div className="flex items-center gap-2">
            {/* Vector Style Toggle */}
            <div className="flex items-center bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-xl border border-gray-200 text-xs">
              {(["liberty", "bright", "positron"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveStyle(key)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeStyle === key
                      ? "bg-emerald-800 text-white shadow-xs"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={VECTOR_STYLES[key].description}
                >
                  <span>{VECTOR_STYLES[key].icon}</span>
                  <span className="hidden md:inline">{VECTOR_STYLES[key].label}</span>
                </button>
              ))}
            </div>

            {/* District Quick Jumps */}
            {activeTab === "explore" && (
              <div className="hidden sm:flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/20 text-xs overflow-x-auto no-scrollbar shadow-lg">
                {(["all", "Raigad", "Ratnagiri", "Sindhudurg"] as const).map((dist) => (
                  <button
                    key={dist}
                    type="button"
                    onClick={() => handleDistrictChange(dist)}
                    className={`px-3 py-1 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                      selectedDistrict === dist
                        ? "bg-[#b8dc26] text-emerald-950 shadow-xs"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {dist === "all" ? "Whole Konkan" : dist}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            MODE A: EXPLORE SUB-BAR (Search & Category Chips)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === "explore" && (
          <div className="space-y-2 pointer-events-auto animate-fadeIn">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-1 flex items-center">
                <Search className="w-4 h-4 text-emerald-800 ml-2.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search spots (e.g. Ganpatipule, Torna, Velas, Tarkarli...)"
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
            </div>

            {/* Category Pills Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
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
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. MAPLIBRE GL VECTOR MAP CANVAS
         ══════════════════════════════════════════════════════════════ */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0" />

      {/* ══════════════════════════════════════════════════════════════
          3. MODE B: GOOGLE MAPS-STYLE DIRECTIONS DRAWER
         ══════════════════════════════════════════════════════════════ */}
      {activeTab === "directions" && (
        <div className="absolute top-16 sm:top-20 left-3 sm:left-6 z-[100] w-[calc(100vw-24px)] sm:w-96 max-w-md pointer-events-auto animate-slideDown">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-emerald-600/30 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-[#113822] text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-[#b8dc26] flex items-center justify-center">
                  <Route size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">Trip Distance &amp; Directions</h3>
                  <p className="text-[10px] text-white/70">OSRM Road Routing along NH-66</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDirectionsDrawer(!showDirectionsDrawer)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 transition-colors"
                aria-label="Toggle Drawer"
              >
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    showDirectionsDrawer ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Collapsible Inputs & Summary */}
            {showDirectionsDrawer && (
              <div className="p-3.5 space-y-3 max-h-[75vh] overflow-y-auto no-scrollbar">
                {/* Inputs: Origin (A) -> Swap -> Destination (B) */}
                <div className="space-y-2 relative">
                  {/* Origin Point A */}
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:border-emerald-600 focus-within:bg-white transition-all">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                      A
                    </span>
                    <div className="flex-1 min-w-0">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Start Point (Origin)
                      </label>
                      <select
                        value={startPoint.id}
                        onChange={(e) => {
                          const found = COMMON_START_HUBS.find((h) => h.id === e.target.value);
                          if (found) setStartPoint(found);
                        }}
                        className="w-full bg-transparent font-bold text-xs text-gray-900 outline-none truncate cursor-pointer"
                      >
                        {startPoint.id === "gps-current" && (
                          <option value="gps-current">📍 My Current Location (GPS)</option>
                        )}
                        {COMMON_START_HUBS.map((hub) => (
                          <option key={hub.id} value={hub.id}>
                            {hub.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Geolocation Button */}
                    <button
                      type="button"
                      onClick={handleLocateMe}
                      disabled={isLocatingUser}
                      className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors shrink-0 cursor-pointer"
                      title="Use My Phone GPS"
                    >
                      {isLocatingUser ? (
                        <Loader2 size={15} className="animate-spin text-emerald-700" />
                      ) : (
                        <LocateFixed size={15} />
                      )}
                    </button>
                  </div>

                  {/* Swap Button */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                    <button
                      type="button"
                      onClick={handleSwapPoints}
                      className="w-7 h-7 rounded-full bg-white border-2 border-emerald-600 text-emerald-800 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
                      title="Swap Start & Destination"
                    >
                      <ArrowLeftRight size={12} className="rotate-90" />
                    </button>
                  </div>

                  {/* Destination Point B */}
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:border-emerald-600 focus-within:bg-white transition-all">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                      B
                    </span>
                    <div className="flex-1 min-w-0">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Destination (Konkan Spot)
                      </label>
                      <select
                        value={destinationSpot.id}
                        onChange={(e) => {
                          const found = KONKAN_MAP_SPOTS.find((s) => s.id === e.target.value);
                          if (found) setDestinationSpot(found);
                        }}
                        className="w-full bg-transparent font-bold text-xs text-gray-900 outline-none truncate cursor-pointer"
                      >
                        {KONKAN_MAP_SPOTS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.district})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Quick Start Hub Chips */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-[11px]">
                  <span className="text-[10px] uppercase font-bold text-gray-400 shrink-0">
                    Quick Start:
                  </span>
                  {COMMON_START_HUBS.slice(0, 4).map((hub) => (
                    <button
                      key={hub.id}
                      type="button"
                      onClick={() => setStartPoint(hub)}
                      className={`px-2 py-0.5 rounded-lg font-bold text-[10px] shrink-0 transition-colors ${
                        startPoint.id === hub.id
                          ? "bg-emerald-700 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {hub.shortName}
                    </button>
                  ))}
                </div>

                {/* Routing Status & Loader */}
                {isRouting && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center gap-2 text-emerald-900 text-xs font-bold">
                    <Loader2 size={16} className="animate-spin text-emerald-600" />
                    <span>Calculating real road distance via NH-66...</span>
                  </div>
                )}

                {routeError && (
                  <div className="p-3 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 text-xs">
                    <p className="font-bold">⚠️ Route Error</p>
                    <p className="text-[11px] mt-0.5">{routeError}</p>
                  </div>
                )}

                {/* Route Result Dashboard */}
                {routeResult && !isRouting && (
                  <div className="space-y-3 animate-fadeIn">
                    {/* Big Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-emerald-100/70 border border-emerald-200 rounded-2xl text-center">
                        <span className="text-[9px] uppercase font-bold text-emerald-800/80 block">
                          Road Distance
                        </span>
                        <span className="text-base sm:text-lg font-black text-emerald-950">
                          {routeResult.distanceKm} <span className="text-xs font-bold">km</span>
                        </span>
                      </div>

                      <div className="p-2.5 bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200 rounded-2xl text-center">
                        <span className="text-[9px] uppercase font-bold text-blue-800/80 block">
                          Drive Time
                        </span>
                        <span className="text-base sm:text-lg font-black text-blue-950">
                          {formatDuration(routeResult.durationMinutes)}
                        </span>
                      </div>

                      <div className="p-2.5 bg-gradient-to-br from-amber-50 to-amber-100/70 border border-amber-200 rounded-2xl text-center">
                        <span className="text-[9px] uppercase font-bold text-amber-800/80 block">
                          Est. Fuel
                        </span>
                        <span className="text-base sm:text-lg font-black text-amber-950">
                          ₹{fuelEstimate}
                        </span>
                      </div>
                    </div>

                    {/* Ferry Pro-Tip Alert */}
                    {ferryAdvantage && (
                      <div className="p-3 rounded-2xl bg-[#0f766e]/10 border border-[#0f766e]/30 space-y-1">
                        <div className="flex items-center gap-1.5 text-[#0f766e] font-bold text-xs">
                          <Ship size={14} />
                          <span>{ferryAdvantage.title}</span>
                        </div>
                        <p className="text-[11px] text-gray-700 leading-snug">
                          {ferryAdvantage.text}
                        </p>
                        <Link
                          href={ferryAdvantage.link}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0f766e] hover:underline pt-0.5"
                        >
                          <span>Check Ro-Pax Ferry Schedule</span>
                          <ArrowRight size={10} />
                        </Link>
                      </div>
                    )}

                    {/* Turn-by-Turn in Google Maps Hand-off */}
                    <div className="pt-1 flex items-center gap-2">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${startPoint.lat},${startPoint.lng}&destination=${destinationSpot.lat},${destinationSpot.lng}&travelmode=driving`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-[#113822] hover:bg-emerald-900 active:scale-98 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-950/20 transition-all cursor-pointer"
                      >
                        <Navigation size={14} className="text-[#b8dc26]" />
                        <span>Start Turn-by-Turn (Google Maps)</span>
                        <ExternalLink size={11} className="opacity-70" />
                      </a>

                      <Link
                        href={
                          destinationSpot.externalLink ||
                          (destinationSpot.type === "trek"
                            ? `/treks/${destinationSpot.slug}`
                            : `/destinations/${destinationSpot.slug}`)
                        }
                        className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition-colors cursor-pointer shrink-0"
                        title="View Full Spot Guide"
                      >
                        <Info size={16} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          4. MODE A: FLOATING SPOT PREVIEW CARD
         ══════════════════════════════════════════════════════════════ */}
      {selectedSpot && activeTab === "explore" && (
        <div className="absolute bottom-4 inset-x-3 sm:inset-x-auto sm:left-6 sm:w-96 z-[100] animate-slideUp">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-600/30 overflow-hidden flex flex-col">
            {/* Top Image Preview & Close */}
            <div className="relative h-36 w-full bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedSpot.image}
                alt={selectedSpot.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

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
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">
                    From Mumbai
                  </span>
                  <span className="font-bold text-[#113822]">
                    {selectedSpot.distanceFromMumbai}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-gray-200">
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">
                    From Pune
                  </span>
                  <span className="font-bold text-[#113822]">
                    {selectedSpot.distanceFromPune}
                  </span>
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
                {/* Switch to Directions Mode with this spot */}
                <button
                  type="button"
                  onClick={() => {
                    setDestinationSpot(selectedSpot);
                    setActiveTab("directions");
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                >
                  <Route size={14} />
                  <span>Get Driving Route</span>
                </button>

                <Link
                  href={
                    selectedSpot.externalLink ||
                    (selectedSpot.type === "trek"
                      ? `/treks/${selectedSpot.slug}`
                      : `/destinations/${selectedSpot.slug}`)
                  }
                  className="flex items-center justify-center gap-1 py-2.5 px-3 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 rounded-xl font-bold text-xs transition-colors cursor-pointer shrink-0"
                >
                  <span>Guide</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          5. BOTTOM RIGHT LEGEND & QUICK INFO
         ══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block absolute bottom-4 right-14 z-[100] bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-gray-200 shadow-xl text-[11px] text-gray-700 space-y-1.5 pointer-events-auto">
        <p className="font-black uppercase tracking-wider text-gray-400 text-[10px]">
          Konkan Map Explorer ({filteredSpots.length} spots)
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
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
            <span>Live Route</span>
          </div>
        </div>
      </div>
    </div>
  );
}
