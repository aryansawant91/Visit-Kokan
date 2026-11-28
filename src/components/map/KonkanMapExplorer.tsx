"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  MapPin,
  Navigation,
  Compass,
  Ship,
  ExternalLink,
  Search,
  X,
  ArrowRight,
  Star,
  ArrowLeftRight,
  Route,
  Info,
  LocateFixed,
  Loader2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  List,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  KONKAN_MAP_SPOTS,
  KonkanMapSpot,
  MapSpotCategory,
} from "@/data/konkanMapLocations";
import { FALLBACK_DESTINATION_IMAGE } from "@/lib/imageUtils";
import { trackGAEvent } from "@/lib/analytics";

// ══════════════════════════════════════════════════════════════
// 1. BULLETPROOF MAP STYLES (Fast CDN Raster + Satellite + Topo)
// ══════════════════════════════════════════════════════════════
type MapStyleKey = "street" | "satellite" | "terrain" | "osm";

interface MapStyleConfig {
  label: string;
  icon: string;
  description: string;
  style: maplibregl.StyleSpecification;
}

function buildRasterStyle(
  tiles: string[],
  attribution: string,
  tileSize = 256,
  overlayTiles?: string[]
): maplibregl.StyleSpecification {
  const sources: maplibregl.StyleSpecification["sources"] = {
    "base-raster": {
      type: "raster",
      tiles,
      tileSize,
      attribution,
    },
  };

  const layers: maplibregl.StyleSpecification["layers"] = [
    {
      id: "base-raster-layer",
      type: "raster",
      source: "base-raster",
      minzoom: 0,
      maxzoom: 20,
    },
  ];

  if (overlayTiles && overlayTiles.length > 0) {
    sources["labels-overlay"] = {
      type: "raster",
      tiles: overlayTiles,
      tileSize: 256,
    };
    layers.push({
      id: "labels-overlay-layer",
      type: "raster",
      source: "labels-overlay",
      minzoom: 0,
      maxzoom: 20,
    });
  }

  return {
    version: 8,
    sources,
    layers,
  };
}

const MAP_STYLES: Record<MapStyleKey, MapStyleConfig> = {
  street: {
    label: "Travel Map",
    icon: "🗺️",
    description: "Clear highways, coastal towns & beaches",
    style: buildRasterStyle(
      [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      ],
      'Tiles &copy; <a href="https://www.esri.com" target="_blank">Esri</a> &mdash; Source: Esri, HERE, Garmin, OpenStreetMap contributors',
      256
    ),
  },
  satellite: {
    label: "Satellite",
    icon: "🛰️",
    description: "Real aerial imagery with road & city labels",
    style: buildRasterStyle(
      [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      'Tiles &copy; <a href="https://www.esri.com" target="_blank">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics',
      256,
      [
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      ]
    ),
  },
  terrain: {
    label: "Terrain",
    icon: "⛰️",
    description: "Topographic elevation for Sahyadri forts & treks",
    style: buildRasterStyle(
      [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      ],
      'Tiles &copy; <a href="https://www.esri.com" target="_blank">Esri</a> &mdash; Esri, HERE, Garmin, USGS, NGA',
      256
    ),
  },
  osm: {
    label: "Classic",
    icon: "🧭",
    description: "Detailed OpenStreetMap street & trail view",
    style: buildRasterStyle(
      ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      256
    ),
  },
};

// Maritime Ro-Pax Ferry Crossings GeoJSON (drawn directly on the map)
const FERRY_ROUTES_GEOJSON: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Mumbai ⇄ Mandwa Ro-Pax" },
      geometry: {
        type: "LineString",
        coordinates: [
          [72.851, 18.953],
          [72.86, 18.88],
          [72.872, 18.805],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Agardanda ⇄ Dighi Ferry" },
      geometry: {
        type: "LineString",
        coordinates: [
          [73.012, 18.288],
          [72.987, 18.268],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Bagmandla ⇄ Bankot Ferry" },
      geometry: {
        type: "LineString",
        coordinates: [
          [73.035, 17.988],
          [73.043, 17.973],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Dabhol ⇄ Dhopave Ferry" },
      geometry: {
        type: "LineString",
        coordinates: [
          [73.175, 17.59],
          [73.18, 17.575],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Jaigad ⇄ Tavsal Ferry" },
      geometry: {
        type: "LineString",
        coordinates: [
          [73.225, 17.302],
          [73.218, 17.326],
        ],
      },
    },
  ],
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

interface RouteLegSummary {
  fromName: string;
  toName: string;
  distanceKm: number;
  durationMinutes: number;
}

interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  coordinates: [number, number][];
  summary: string;
  legs: RouteLegSummary[];
  isFallback?: boolean;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function totalPathKm(origin: { lat: number; lng: number }, stops: KonkanMapSpot[]): number {
  if (stops.length === 0) return 0;
  let total = haversineKm(origin.lat, origin.lng, stops[0].lat, stops[0].lng);
  for (let i = 0; i < stops.length - 1; i++) {
    total += haversineKm(stops[i].lat, stops[i].lng, stops[i + 1].lat, stops[i + 1].lng);
  }
  return total;
}

function computeBestStopOrder(
  origin: { lat: number; lng: number },
  stops: KonkanMapSpot[]
): {
  orderedStops: KonkanMapSpot[];
  savedKm: number;
  isAlreadyOptimal: boolean;
} {
  if (stops.length <= 1) {
    return { orderedStops: stops, savedKm: 0, isAlreadyOptimal: true };
  }

  const currentKm = totalPathKm(origin, stops);
  const remaining = [...stops];
  const ordered: KonkanMapSpot[] = [];
  let currLat = origin.lat;
  let currLng = origin.lng;

  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = haversineKm(currLat, currLng, remaining[i].lat, remaining[i].lng);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    const chosen = remaining.splice(bestIdx, 1)[0];
    ordered.push(chosen);
    currLat = chosen.lat;
    currLng = chosen.lng;
  }

  // 2-opt local refinement for open path from origin
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < ordered.length - 1; i++) {
      for (let j = i + 1; j < ordered.length; j++) {
        const candidate = [
          ...ordered.slice(0, i),
          ...ordered.slice(i, j + 1).reverse(),
          ...ordered.slice(j + 1),
        ];
        if (totalPathKm(origin, candidate) + 0.5 < totalPathKm(origin, ordered)) {
          ordered.splice(0, ordered.length, ...candidate);
          improved = true;
        }
      }
    }
  }

  const bestKm = totalPathKm(origin, ordered);
  const savedRoadKm = Math.max(0, Math.round((currentKm - bestKm) * 1.3));
  const sameOrder = ordered.every((s, idx) => s.id === stops[idx].id);

  return {
    orderedStops: ordered,
    savedKm: savedRoadKm,
    isAlreadyOptimal: sameOrder || savedRoadKm < 5,
  };
}

// Marker Styling per Category
function getCategoryMarkerStyle(category: MapSpotCategory) {
  switch (category) {
    case "beach":
      return { bg: "#0284c7", emoji: "🏖️", border: "#38bdf8", label: "Beach" };
    case "fort":
      return { bg: "#b45309", emoji: "🏰", border: "#f59e0b", label: "Fort / Trek" };
    case "temple":
      return { bg: "#7e22ce", emoji: "🛕", border: "#c084fc", label: "Temple" };
    case "waterfall":
      return { bg: "#059669", emoji: "💧", border: "#34d399", label: "Waterfall" };
    case "ferry":
      return { bg: "#0f766e", emoji: "🚢", border: "#2dd4bf", label: "Ferry" };
    default:
      return { bg: "#334155", emoji: "📍", border: "#94a3b8", label: "Spot" };
  }
}

export default function KonkanMapExplorer() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});
  const originMarkerRef = useRef<maplibregl.Marker | null>(null);
  const userGpsMarkerRef = useRef<maplibregl.Marker | null>(null);
  const routeCalloutMarkersRef = useRef<maplibregl.Marker[]>([]);
  const isInitialStyleMount = useRef(true);
  const styleReadyRef = useRef(false);
  const routeCoordinatesRef = useRef<[number, number][] | null>(null);
  const altRoutesCoordinatesRef = useRef<[number, number][][]>([]);

  // Map status
  const [isMapReady, setIsMapReady] = useState(false);

  // View Mode: Explore spots vs Directions / Routing
  const [activeTab, setActiveTab] = useState<"explore" | "directions">("explore");
  const [activeStyle, setActiveStyle] = useState<MapStyleKey>("street");

  // Desktop Sidebar State
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);

  // Filters (Explore Mode)
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSpot, setSelectedSpot] = useState<KonkanMapSpot | null>(null);
  const [failedPreviewImages, setFailedPreviewImages] = useState<Record<string, boolean>>({});

  // Directions Mode State (Multi-stop & Best Route support)
  const [startPoint, setStartPoint] = useState<OriginPoint>(COMMON_START_HUBS[0]);
  const [routeStops, setRouteStops] = useState<KonkanMapSpot[]>([KONKAN_MAP_SPOTS[0]]);
  const [isLocatingUser, setIsLocatingUser] = useState<boolean>(false);
  const [isRouting, setIsRouting] = useState<boolean>(false);
  const [routeOptions, setRouteOptions] = useState<RouteResult[]>([]);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState<number>(0);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [showDirectionsDrawer, setShowDirectionsDrawer] = useState<boolean>(true);

  const routeResult = routeOptions[selectedRouteIdx] ?? null;

  const bestOrderSuggestion = useMemo(
    () => computeBestStopOrder(startPoint, routeStops),
    [startPoint, routeStops]
  );

  // District View Coordinates
  const districtViews: Record<string, { center: [number, number]; zoom: number }> = {
    all: { center: [73.3, 17.3], zoom: 7.8 },
    Raigad: { center: [73.05, 18.4], zoom: 9.6 },
    Ratnagiri: { center: [73.3, 17.3], zoom: 9.1 },
    Sindhudurg: { center: [73.6, 16.08], zoom: 9.4 },
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const view = districtViews[dist] || districtViews.all;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: view.center,
        zoom: view.zoom,
        duration: 1100,
        essential: true,
      });
    }
  };

  const handleResetView = () => {
    setSelectedDistrict("all");
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedSpot(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: districtViews.all.center,
        zoom: districtViews.all.zoom,
        duration: 1000,
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
          spot.district.toLowerCase().includes(q) ||
          spot.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, selectedDistrict, searchQuery]);

  // Helper: Add custom overlay layers (Ferry Lines + Alt Routes + Google-Blue Best Route) safely
  const attachOverlayLayers = useCallback((map: maplibregl.Map) => {
    if (!styleReadyRef.current) return;

    try {
      // 1. Ferry Crossing Maritime Lines
      if (!map.getSource("ferry-routes-source")) {
        map.addSource("ferry-routes-source", {
          type: "geojson",
          data: FERRY_ROUTES_GEOJSON,
        });

        map.addLayer({
          id: "ferry-routes-line",
          type: "line",
          source: "ferry-routes-source",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#0f766e",
            "line-width": 3,
            "line-dasharray": [2, 2],
            "line-opacity": 0.85,
          },
        });
      }

      // 2. Alternative Routes Layer (Google Maps grey underneath the best route)
      const altCoordsList = altRoutesCoordinatesRef.current;
      const altGeojson: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: altCoordsList.map((coords) => ({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coords,
          },
        })),
      };

      if (!map.getSource("alt-route-source")) {
        map.addSource("alt-route-source", {
          type: "geojson",
          data: altGeojson,
        });

        map.addLayer({
          id: "alt-route-casing",
          type: "line",
          source: "alt-route-source",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#475569",
            "line-width": 7,
            "line-opacity": 0.75,
          },
        });

        map.addLayer({
          id: "alt-route-line",
          type: "line",
          source: "alt-route-source",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#cbd5e1",
            "line-width": 4.5,
            "line-opacity": 0.9,
          },
        });
      } else {
        (map.getSource("alt-route-source") as maplibregl.GeoJSONSource).setData(altGeojson);
      }

      // 3. Best / Selected Active Driving Route Polyline (Google Maps Blue on top)
      const coords = routeCoordinatesRef.current;
      const routeGeojson: GeoJSON.FeatureCollection = coords
        ? {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: coords,
                },
              },
            ],
          }
        : {
            type: "FeatureCollection",
            features: [],
          };

      if (!map.getSource("route-source")) {
        map.addSource("route-source", {
          type: "geojson",
          data: routeGeojson,
        });

        map.addLayer({
          id: "route-casing",
          type: "line",
          source: "route-source",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#174ea6",
            "line-width": 10,
            "line-opacity": 0.95,
          },
        });

        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route-source",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#1a73e8",
            "line-width": 6,
          },
        });
      } else {
        (map.getSource("route-source") as maplibregl.GeoJSONSource).setData(routeGeojson);
      }
    } catch {
      map.once("idle", () => attachOverlayLayers(map));
    }
  }, []);

  // ══════════════════════════════════════════════════════════════
  // 2. INITIALIZE MAPLIBRE GL MAP
  // ══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[activeStyle].style,
      center: [73.3, 17.3],
      zoom: 7.8,
      minZoom: 6,
      maxZoom: 18,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "bottom-right");
    map.addControl(
      new maplibregl.ScaleControl({ maxWidth: 100, unit: "metric" }),
      "bottom-right"
    );
    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
      }),
      "bottom-left"
    );

    map.on("load", () => {
      styleReadyRef.current = true;
      setIsMapReady(true);
      attachOverlayLayers(map);
      map.resize();
    });

    map.on("style.load", () => {
      styleReadyRef.current = true;
      attachOverlayLayers(map);
    });

    // Fallback: if a tile fails on terrain/satellite, don't crash UI
    map.on("error", (e) => {
      // Silently ignore transient tile 404/network hiccups so UI stays smooth
      if (e?.error) {
        console.warn("Map tile notice:", e.error.message || "tile load issue");
      }
    });

    mapInstanceRef.current = map;

    return () => {
      styleReadyRef.current = false;
      isInitialStyleMount.current = true;
      map.remove();
      mapInstanceRef.current = null;
      setIsMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resize map smoothly if sidebar toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      mapInstanceRef.current?.resize();
    }, 250);
    return () => clearTimeout(timer);
  }, [showSidebar]);

  // Update Style on user toggle (skip initial mount to avoid double-load)
  useEffect(() => {
    if (isInitialStyleMount.current) {
      isInitialStyleMount.current = false;
      return;
    }
    const map = mapInstanceRef.current;
    if (!map) return;

    styleReadyRef.current = false;
    map.setStyle(MAP_STYLES[activeStyle].style);
  }, [activeStyle]);

  // Multi-stop helpers
  const handleAddStop = () => {
    if (routeStops.length >= 8) return;
    const usedIds = new Set(routeStops.map((s) => s.id));
    const nextSpot =
      KONKAN_MAP_SPOTS.find((s) => !usedIds.has(s.id)) || KONKAN_MAP_SPOTS[0];
    setRouteStops((prev) => [...prev, nextSpot]);
  };

  const handleRemoveStop = (index: number) => {
    if (routeStops.length <= 1) return;
    setRouteStops((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeStop = (index: number, spotId: string) => {
    const found = KONKAN_MAP_SPOTS.find((s) => s.id === spotId);
    if (!found) return;
    setRouteStops((prev) => prev.map((s, i) => (i === index ? found : s)));
  };

  const handleMoveStop = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= routeStops.length) return;
    setRouteStops((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIdx];
      next[targetIdx] = temp;
      return next;
    });
  };

  // ══════════════════════════════════════════════════════════════
  // 3. RENDER SPOT MARKERS ON MAP
  // ══════════════════════════════════════════════════════════════
  const selectSpot = useCallback(
    (spot: KonkanMapSpot) => {
      setSelectedSpot(spot);
      setShowSearchDropdown(false);
      if (activeTab === "directions") {
        setRouteStops((prev) => {
          if (prev.some((s) => s.id === spot.id)) return prev;
          if (prev.length >= 8) return [...prev.slice(0, 7), spot];
          return [...prev, spot];
        });
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo({
          center: [spot.lng, spot.lat],
          zoom: Math.max(mapInstanceRef.current.getZoom(), 11.5),
          duration: 1100,
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
      const stopIndex =
        activeTab === "directions"
          ? routeStops.findIndex((s) => s.id === spot.id)
          : -1;
      const isStop = stopIndex !== -1;
      const stopLetter = isStop ? String.fromCharCode(66 + stopIndex) : "";
      const style = getCategoryMarkerStyle(spot.category);

      // Wrapper element containing pin + floating hover/active label
      const wrapper = document.createElement("div");
      wrapper.className = "konkan-marker-wrap group relative flex flex-col items-center cursor-pointer";
      wrapper.style.zIndex = isSelected || isStop ? "50" : "10";

      const pin = document.createElement("div");
      pin.style.width = isSelected || isStop ? "40px" : "30px";
      pin.style.height = isSelected || isStop ? "40px" : "30px";
      pin.style.borderRadius = "50%";
      pin.style.backgroundColor = isStop ? "#e11d48" : style.bg;
      pin.style.border = isSelected || isStop ? "3px solid #ffffff" : `2px solid ${style.border}`;
      pin.style.boxShadow =
        isSelected || isStop
          ? "0 0 0 4px rgba(16, 185, 129, 0.45), 0 8px 18px rgba(0,0,0,0.45)"
          : "0 3px 8px rgba(0,0,0,0.35)";
      pin.style.display = "flex";
      pin.style.alignItems = "center";
      pin.style.justifyContent = "center";
      pin.style.fontSize = isSelected || isStop ? "16px" : "13px";
      pin.style.transition = "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)";
      pin.innerHTML = `<span>${isStop ? stopLetter : style.emoji}</span>`;
      if (isStop) {
        pin.style.color = "#ffffff";
        pin.style.fontWeight = "900";
      }

      // Label tag (always visible if selected or in route, otherwise on hover)
      const label = document.createElement("div");
      label.textContent = isStop ? `${stopLetter}. ${spot.name}` : spot.name;
      label.className = `mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shadow-md border pointer-events-none transition-opacity duration-150 ${
        isSelected || isStop
          ? "opacity-100 bg-[#113822] text-white border-emerald-400"
          : "opacity-0 group-hover:opacity-100 bg-white/95 text-gray-900 border-gray-200"
      }`;

      wrapper.appendChild(pin);
      wrapper.appendChild(label);

      wrapper.addEventListener("mouseenter", () => {
        pin.style.transform = "scale(1.15)";
        wrapper.style.zIndex = "60";
      });
      wrapper.addEventListener("mouseleave", () => {
        pin.style.transform = "scale(1)";
        wrapper.style.zIndex = isSelected || isStop ? "50" : "10";
      });
      wrapper.addEventListener("click", (e) => {
        e.stopPropagation();
        selectSpot(spot);
      });

      const marker = new maplibregl.Marker({ element: wrapper, anchor: "center" })
        .setLngLat([spot.lng, spot.lat])
        .addTo(map);

      markersRef.current[spot.id] = marker;
    });
  }, [filteredSpots, selectedSpot, routeStops, activeTab, selectSpot]);

  // Render Origin "A" Marker in Directions Mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (originMarkerRef.current) {
      originMarkerRef.current.remove();
      originMarkerRef.current = null;
    }

    if (activeTab === "directions" && startPoint) {
      const el = document.createElement("div");
      el.className = "flex flex-col items-center pointer-events-none";
      el.innerHTML = `
        <div style="width:36px;height:36px;border-radius:50%;background:#059669;color:#fff;border:3px solid #fff;box-shadow:0 4px 14px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;">A</div>
        <div style="margin-top:4px;padding:2px 8px;border-radius:9999px;background:#064e3b;color:#fff;font-size:10px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${startPoint.shortName}</div>
      `;
      originMarkerRef.current = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([startPoint.lng, startPoint.lat])
        .addTo(map);
    }
  }, [activeTab, startPoint]);

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m} mins`;
    if (m === 0) return `${h} hrs`;
    return `${h} hrs ${m} mins`;
  };

  // Render floating Google-style route duration pills directly on the map
  const renderRouteCallouts = useCallback(
    (
      map: maplibregl.Map,
      options: RouteResult[],
      activeIdx: number,
      onSelect: (idx: number) => void
    ) => {
      routeCalloutMarkersRef.current.forEach((m) => m.remove());
      routeCalloutMarkersRef.current = [];

      if (options.length === 0) return;

      // Render alternative route pills first, then active route pill on top
      options.forEach((opt, idx) => {
        if (!opt.coordinates || opt.coordinates.length === 0) return;
        const isActive = idx === activeIdx;
        const midCoord =
          opt.coordinates[
            Math.floor(opt.coordinates.length * (isActive ? 0.5 : 0.35 + idx * 0.15))
          ] || opt.coordinates[0];

        const pill = document.createElement("button");
        pill.type = "button";
        pill.className = `px-2.5 py-1 rounded-full shadow-lg border text-[11px] font-black whitespace-nowrap cursor-pointer transition-transform hover:scale-105 flex items-center gap-1 ${
          isActive
            ? "bg-white text-[#174ea6] border-[#1a73e8] ring-2 ring-[#1a73e8]/25"
            : "bg-white/95 text-slate-700 border-slate-300 opacity-90 hover:opacity-100"
        }`;
        pill.style.zIndex = isActive ? "45" : "35";
        const minsDiff =
          options[0] && idx > 0 ? opt.durationMinutes - options[0].durationMinutes : 0;
        const labelText = isActive
          ? `🚗 ${formatDuration(opt.durationMinutes)} · ${opt.distanceKm} km`
          : minsDiff > 0
          ? `+${minsDiff} min · ${opt.distanceKm} km`
          : `${formatDuration(opt.durationMinutes)}`;
        pill.textContent = labelText;
        pill.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelect(idx);
        });

        const marker = new maplibregl.Marker({ element: pill, anchor: "center" })
          .setLngLat(midCoord)
          .addTo(map);
        routeCalloutMarkersRef.current.push(marker);
      });
    },
    []
  );

  // ══════════════════════════════════════════════════════════════
  // 4. MULTI-STOP POINT-TO-POINT ROUTING ENGINE (OSRM + Alternatives + Fallback)
  // ══════════════════════════════════════════════════════════════
  const syncRoutesToMap = useCallback(
    (
      options: RouteResult[],
      activeIdx: number,
      waypointsToFit?: { lng: number; lat: number }[]
    ) => {
      const selected = options[activeIdx];
      routeCoordinatesRef.current = selected ? selected.coordinates : null;
      altRoutesCoordinatesRef.current = options
        .filter((_, idx) => idx !== activeIdx)
        .map((r) => r.coordinates);

      const map = mapInstanceRef.current;
      if (!map) return;

      attachOverlayLayers(map);
      renderRouteCallouts(map, options, activeIdx, (clickedIdx) => {
        setSelectedRouteIdx(clickedIdx);
        syncRoutesToMap(options, clickedIdx);
      });

      if (selected && waypointsToFit) {
        const bounds = new maplibregl.LngLatBounds();
        selected.coordinates.forEach((coord) => bounds.extend(coord));
        waypointsToFit.forEach((w) => bounds.extend([w.lng, w.lat]));

        map.fitBounds(bounds, {
          padding: { top: 100, bottom: 100, left: 60, right: 60 },
          maxZoom: 14,
          duration: 1200,
        });
      }
    },
    [attachOverlayLayers, renderRouteCallouts]
  );

  const calculateRoute = useCallback(async () => {
    if (!startPoint || routeStops.length === 0) return;
    setIsRouting(true);
    setRouteError(null);

    const waypoints: { name: string; lng: number; lat: number }[] = [
      { name: startPoint.shortName, lng: startPoint.lng, lat: startPoint.lat },
      ...routeStops.map((s) => ({ name: s.name, lng: s.lng, lat: s.lat })),
    ];

    // Immediately draw connecting preview line on map while OSRM road geometry loads
    routeCoordinatesRef.current = waypoints.map((w) => [w.lng, w.lat]);
    altRoutesCoordinatesRef.current = [];
    if (mapInstanceRef.current) {
      attachOverlayLayers(mapInstanceRef.current);
    }

    try {
      const coordsParam = waypoints.map((w) => `${w.lng},${w.lat}`).join(";");
      const altsParam = routeStops.length === 1 ? "true" : "false";
      const url = `https://router.project-osrm.org/route/v1/driving/${coordsParam}?overview=full&geometries=geojson&alternatives=${altsParam}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Routing service unavailable");

      const data = await res.json();
      if (!data.routes || data.routes.length === 0) {
        throw new Error("No driving route found.");
      }

      const parsedOptions: RouteResult[] = data.routes
        .map(
          (route: {
            distance: number;
            duration: number;
            geometry: { coordinates: [number, number][] };
            legs?: { distance: number; duration: number; summary?: string }[];
          }) => {
            const distKm = Math.round((route.distance / 1000) * 10) / 10;
            const durationMins = Math.round(route.duration / 60);
            const legs: RouteLegSummary[] = (route.legs || []).map((leg, idx) => ({
              fromName: waypoints[idx]?.name || `Stop ${idx}`,
              toName: waypoints[idx + 1]?.name || `Stop ${idx + 1}`,
              distanceKm: Math.round((leg.distance / 1000) * 10) / 10,
              durationMinutes: Math.round(leg.duration / 60),
            }));
            return {
              distanceKm: distKm,
              durationMinutes: durationMins,
              coordinates: route.geometry.coordinates,
              summary: route.legs?.[0]?.summary || "NH-66 / Coastal Corridor",
              legs,
            };
          }
        )
        .sort((a: RouteResult, b: RouteResult) => a.durationMinutes - b.durationMinutes);

      setRouteOptions(parsedOptions);
      setSelectedRouteIdx(0);
      syncRoutesToMap(parsedOptions, 0, waypoints);
      if (parsedOptions[0]) {
        trackGAEvent("map_route_calculated", {
          origin: startPoint.shortName,
          destination: routeStops[routeStops.length - 1]?.name || "",
          stops_count: routeStops.length,
          distance_km: parsedOptions[0].distanceKm,
          duration_minutes: parsedOptions[0].durationMinutes,
        });
      }
    } catch {
      // Fallback: always draw connected path between waypoints on map even if OSRM is unreachable
      const fallbackCoords: [number, number][] = waypoints.map((w) => [w.lng, w.lat]);
      const fallbackLegs: RouteLegSummary[] = [];
      let totalKm = 0;
      for (let i = 0; i < waypoints.length - 1; i++) {
        const legKm =
          Math.round(
            haversineKm(
              waypoints[i].lat,
              waypoints[i].lng,
              waypoints[i + 1].lat,
              waypoints[i + 1].lng
            ) *
              1.3 *
              10
          ) / 10;
        totalKm += legKm;
        fallbackLegs.push({
          fromName: waypoints[i].name,
          toName: waypoints[i + 1].name,
          distanceKm: legKm,
          durationMinutes: Math.round((legKm / 48) * 60),
        });
      }
      const fallbackRoute: RouteResult = {
        distanceKm: Math.round(totalKm * 10) / 10,
        durationMinutes: Math.round((totalKm / 48) * 60),
        coordinates: fallbackCoords,
        summary: "Estimated Coastal Corridor",
        legs: fallbackLegs,
        isFallback: true,
      };
      setRouteOptions([fallbackRoute]);
      setSelectedRouteIdx(0);
      syncRoutesToMap([fallbackRoute], 0, waypoints);
      setRouteError("Live road server busy — showing direct connected estimate.");
    } finally {
      setIsRouting(false);
    }
  }, [startPoint, routeStops, attachOverlayLayers, syncRoutesToMap]);

  // Switch active route option when user picks an alternative
  const handleSelectRouteOption = (idx: number) => {
    setSelectedRouteIdx(idx);
    syncRoutesToMap(routeOptions, idx);
  };

  // Recalculate route whenever Start or Stops change in Directions Mode
  useEffect(() => {
    if (activeTab === "directions") {
      calculateRoute();
    } else {
      routeCoordinatesRef.current = null;
      altRoutesCoordinatesRef.current = [];
      routeCalloutMarkersRef.current.forEach((m) => m.remove());
      routeCalloutMarkersRef.current = [];
      const map = mapInstanceRef.current;
      if (map) {
        attachOverlayLayers(map);
      }
      setRouteOptions([]);
      setSelectedRouteIdx(0);
    }
  }, [activeTab, startPoint, routeStops, calculateRoute, attachOverlayLayers]);

  // Locate User GPS & render pulsing blue dot
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingUser(false);
        const { longitude, latitude } = pos.coords;

        if (activeTab === "directions") {
          setStartPoint({
            id: "gps-current",
            name: "📍 My Current Location",
            shortName: "Current GPS",
            lng: longitude,
            lat: latitude,
            tag: "Live GPS",
          });
        }

        const map = mapInstanceRef.current;
        if (map) {
          if (userGpsMarkerRef.current) {
            userGpsMarkerRef.current.remove();
          }
          const gpsEl = document.createElement("div");
          gpsEl.className = "relative flex items-center justify-center";
          gpsEl.innerHTML = `
            <span class="absolute w-8 h-8 rounded-full bg-sky-400/40 animate-ping"></span>
            <span class="relative w-4 h-4 rounded-full bg-sky-600 border-2 border-white shadow-lg"></span>
          `;
          userGpsMarkerRef.current = new maplibregl.Marker({ element: gpsEl })
            .setLngLat([longitude, latitude])
            .addTo(map);

          map.flyTo({
            center: [longitude, latitude],
            zoom: 11,
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

  // Swap Start & First Stop
  const handleSwapPoints = () => {
    if (routeStops.length === 0) return;
    const firstDest = routeStops[0];
    const newFirstDest =
      KONKAN_MAP_SPOTS.find((s) => s.slug.includes(startPoint.id)) || KONKAN_MAP_SPOTS[0];
    const newStartPoint: OriginPoint = {
      id: firstDest.id,
      name: firstDest.name,
      shortName: firstDest.name.split(" ")[0],
      lng: firstDest.lng,
      lat: firstDest.lat,
    };
    setStartPoint(newStartPoint);
    setRouteStops((prev) => [newFirstDest, ...prev.slice(1)]);
  };

  const fuelEstimate = useMemo(() => {
    if (!routeResult) return 0;
    return Math.round((routeResult.distanceKm / 14) * 104);
  }, [routeResult]);

  // Smart Ro-Pax Ferry Alert across all stops
  const ferryAdvantage = useMemo(() => {
    if (routeStops.length === 0 || !startPoint) return null;
    const isMumbaiOrigin =
      startPoint.id.includes("mumbai") ||
      (startPoint.lat > 18.9 && startPoint.lng < 73.1);

    if (isMumbaiOrigin && routeStops.some((s) => s.district === "Raigad")) {
      return {
        title: "Mandwa Ro-Pax Ferry Shortcut",
        text: "Save ~2.5 hrs & 75 km by boarding the Bhaucha Dhakka to Mandwa car ferry with your vehicle!",
        link: "/ferry#mandwa-bhauchadhakka",
      };
    }

    if (
      routeStops.some(
        (s) =>
          s.name.includes("Guhagar") ||
          s.name.includes("Jaigad") ||
          s.name.includes("Ganpatipule")
      )
    ) {
      return {
        title: "Jaigad & Dabhol Ferry Route",
        text: "Direct coastal Ro-Pax ferry bypasses 55+ km of winding mountain ghats across the creek.",
        link: "/ferry#jaigad-tavsal",
      };
    }

    return null;
  }, [routeStops, startPoint]);

  const categories: { id: string; label: string; icon: string }[] = [
    { id: "all", label: "All Spots", icon: "✨" },
    { id: "beach", label: "Beaches", icon: "🏖️" },
    { id: "fort", label: "Forts & Treks", icon: "🏰" },
    { id: "temple", label: "Temples", icon: "🛕" },
    { id: "ferry", label: "Ferry Crossings", icon: "🚢" },
    { id: "waterfall", label: "Waterfalls", icon: "💧" },
  ];

  const getSpotImage = (spot: KonkanMapSpot) => {
    if (failedPreviewImages[spot.id]) return FALLBACK_DESTINATION_IMAGE;
    return spot.image || FALLBACK_DESTINATION_IMAGE;
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[600px] flex overflow-hidden bg-[#e5ebe3] font-sans">
      {/* ══════════════════════════════════════════════════════════════
          LEFT EXPLORER SIDEBAR (Desktop / Laptop Only)
         ══════════════════════════════════════════════════════════════ */}
      {activeTab === "explore" && (
        <aside
          className={`hidden lg:flex flex-col bg-white border-r border-[#cadbc7] z-30 transition-all duration-300 shadow-xl ${
            showSidebar ? "w-[360px] xl:w-[390px]" : "w-0 overflow-hidden border-r-0"
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-[#e2ede0] bg-[#f7faf6] space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-base font-black text-[#0f2416] flex items-center gap-1.5">
                  <MapPin size={16} className="text-emerald-700" />
                  <span>Konkan Map Explorer</span>
                </h1>
                <p className="text-[11px] text-[#526b58] font-medium">
                  Showing {filteredSpots.length} of {KONKAN_MAP_SPOTS.length} coastal spots
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetView}
                className="p-1.5 rounded-xl bg-white hover:bg-[#edf3eb] border border-[#d6e2d4] text-[#2D6A4F] transition-colors cursor-pointer"
                title="Reset Map & Filters"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {/* District Selector */}
            <div className="grid grid-cols-4 gap-1 bg-[#e8f0e6] p-1 rounded-xl">
              {(["all", "Raigad", "Ratnagiri", "Sindhudurg"] as const).map((dist) => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => handleDistrictChange(dist)}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer truncate ${
                    selectedDistrict === dist
                      ? "bg-[#113822] text-white shadow-xs"
                      : "text-[#334637] hover:bg-white/60"
                  }`}
                >
                  {dist === "all" ? "All" : dist}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Spots List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#fafcf9]">
            {filteredSpots.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <p className="text-sm font-bold text-gray-700">No spots match your search</p>
                <button
                  type="button"
                  onClick={handleResetView}
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Show All Spots
                </button>
              </div>
            ) : (
              filteredSpots.map((spot) => {
                const isSelected = selectedSpot?.id === spot.id;
                const catStyle = getCategoryMarkerStyle(spot.category);
                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => selectSpot(spot)}
                    className={`w-full text-left p-2.5 rounded-2xl border transition-all flex gap-3 items-start cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/30"
                        : "bg-white hover:bg-[#f2f7f1] border-[#e0e9df] shadow-2xs"
                    }`}
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getSpotImage(spot)}
                        alt={spot.name}
                        loading="lazy"
                        onError={() =>
                          setFailedPreviewImages((prev) => ({ ...prev, [spot.id]: true }))
                        }
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] leading-none">
                        {catStyle.emoji}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-xs font-black text-[#0f2416] truncate">
                          {spot.name}
                        </h3>
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md shrink-0">
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          {spot.rating}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-[#2D6A4F] mt-0.5">
                        {spot.district} · {catStyle.label}
                      </p>
                      <p className="text-[11px] text-gray-600 line-clamp-2 mt-1 leading-snug">
                        {spot.tagline}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MAIN MAP VIEWPORT AREA
         ══════════════════════════════════════════════════════════════ */}
      <div className="relative flex-1 h-full overflow-hidden">
        {/* Sidebar Collapse Toggle (Desktop Explore Mode) */}
        {activeTab === "explore" && (
          <button
            type="button"
            onClick={() => setShowSidebar(!showSidebar)}
            aria-label={showSidebar ? "Collapse spots list" : "Expand spots list"}
            className="hidden lg:flex items-center gap-1.5 absolute top-24 left-3 z-[95] px-2.5 py-2 rounded-xl bg-white/95 hover:bg-white text-[#142607] border border-[#cadbc7] shadow-lg text-xs font-bold cursor-pointer transition-all"
          >
            {showSidebar ? <ChevronLeft size={16} /> : <List size={15} />}
            {!showSidebar && <span>Spots ({filteredSpots.length})</span>}
          </button>
        )}

        {/* ── 1. TOP APP BAR & MODE SWITCHER ── */}
        <div className="absolute top-3 inset-x-3 sm:inset-x-5 z-[90] space-y-2 pointer-events-none">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-auto">
            {/* Dual Mode Switcher: Explore vs Directions */}
            <div className="flex items-center bg-[#0f2416]/90 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-2xl">
              <button
                type="button"
                onClick={() => setActiveTab("explore")}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "explore"
                    ? "bg-[#b8dc26] text-emerald-950 shadow-md"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Compass size={15} />
                <span>Explore Spots</span>
                <span className="text-[10px] opacity-75">({KONKAN_MAP_SPOTS.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("directions");
                  if (routeStops.length === 0 && selectedSpot) {
                    setRouteStops([selectedSpot]);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "directions"
                    ? "bg-emerald-500 text-white shadow-md"
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

            {/* Right Controls: Map Style Switcher & Locate Me */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Map Style Toggle */}
              <div className="flex items-center bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-xl border border-gray-200 text-xs">
                {(["street", "satellite", "terrain", "osm"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveStyle(key)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      activeStyle === key
                        ? "bg-emerald-800 text-white shadow-xs"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    title={MAP_STYLES[key].description}
                  >
                    <span>{MAP_STYLES[key].icon}</span>
                    <span className="hidden md:inline">{MAP_STYLES[key].label}</span>
                  </button>
                ))}
              </div>

              {/* Locate Me Button */}
              <button
                type="button"
                onClick={handleLocateMe}
                disabled={isLocatingUser}
                title="Center on my location"
                className="w-9 h-9 rounded-2xl bg-white/95 hover:bg-white text-emerald-800 border border-gray-200 shadow-xl flex items-center justify-center cursor-pointer transition-all active:scale-95"
              >
                {isLocatingUser ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LocateFixed size={16} />
                )}
              </button>
            </div>
          </div>

          {/* ── MODE A: EXPLORE SUB-BAR (Search & Category Chips) ── */}
          {activeTab === "explore" && (
            <div className="space-y-2 pointer-events-auto">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-md">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-1 flex items-center">
                    <Search className="w-4 h-4 text-emerald-800 ml-2.5 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onFocus={() => setShowSearchDropdown(true)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSearchDropdown(true);
                      }}
                      placeholder="Search beaches, forts, ferries (e.g. Tarkarli, Murud)..."
                      className="w-full pl-2 pr-3 py-1.5 bg-transparent text-xs sm:text-sm text-gray-800 outline-none font-medium placeholder:text-gray-400"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setShowSearchDropdown(false);
                        }}
                        className="p-1 rounded-full hover:bg-gray-200 text-gray-500 mr-1 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Instant Search Autocomplete Dropdown */}
                  {showSearchDropdown && searchQuery.trim().length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-[#cadbc7] max-h-64 overflow-y-auto z-[120] divide-y divide-gray-100">
                      {filteredSpots.length === 0 ? (
                        <div className="p-3 text-xs text-gray-500 text-center">
                          No Konkan spots found for &ldquo;{searchQuery}&rdquo;
                        </div>
                      ) : (
                        filteredSpots.slice(0, 8).map((spot) => {
                          const cat = getCategoryMarkerStyle(spot.category);
                          return (
                            <button
                              key={spot.id}
                              type="button"
                              onClick={() => selectSpot(spot)}
                              className="w-full px-3.5 py-2.5 text-left hover:bg-[#edf3eb] flex items-center justify-between gap-2 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-base shrink-0">{cat.emoji}</span>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-[#0f2416] truncate">
                                    {spot.name}
                                  </p>
                                  <p className="text-[10px] text-[#526b58]">
                                    {spot.district} · {cat.label}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight size={14} className="text-gray-400 shrink-0" />
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile District Quick Filter */}
                <div className="flex lg:hidden items-center gap-1 bg-[#0f2416]/80 backdrop-blur-md p-1 rounded-2xl border border-white/20 text-xs overflow-x-auto no-scrollbar shadow-lg">
                  {(["all", "Raigad", "Ratnagiri", "Sindhudurg"] as const).map((dist) => (
                    <button
                      key={dist}
                      type="button"
                      onClick={() => handleDistrictChange(dist)}
                      className={`px-2.5 py-1 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                        selectedDistrict === dist
                          ? "bg-[#b8dc26] text-emerald-950 shadow-xs"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      {dist === "all" ? "All" : dist}
                    </button>
                  ))}
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
                        ? "bg-emerald-700 text-white border border-emerald-400"
                        : "bg-white/95 text-gray-800 hover:bg-white border border-gray-200"
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                    <span className="text-[10px] opacity-75 ml-0.5">
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

        {/* ── 2. MAPLIBRE GL VECTOR / RASTER MAP CANVAS ── */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Initial Tile Loading Overlay */}
        {!isMapReady && (
          <div className="absolute inset-0 z-10 bg-[#e5ebe3]/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 pointer-events-none">
            <Loader2 size={28} className="animate-spin text-emerald-800" />
            <p className="text-xs font-bold text-emerald-950">Loading Konkan Coastal Map...</p>
          </div>
        )}

        {/* ── 3. MODE B: GOOGLE MAPS-STYLE DIRECTIONS DRAWER ── */}
        {activeTab === "directions" && (
          <div className="absolute top-20 sm:top-20 left-3 sm:left-5 z-[95] w-[calc(100vw-24px)] sm:w-96 max-w-md pointer-events-auto">
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
                  className="p-1 rounded-lg hover:bg-white/10 text-white/80 transition-colors cursor-pointer"
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
                <div className="p-3.5 space-y-3 max-h-[72vh] overflow-y-auto no-scrollbar">
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

                      <button
                        type="button"
                        onClick={handleLocateMe}
                        disabled={isLocatingUser}
                        className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors shrink-0 cursor-pointer"
                        title="Use My GPS"
                      >
                        {isLocatingUser ? (
                          <Loader2 size={15} className="animate-spin text-emerald-700" />
                        ) : (
                          <LocateFixed size={15} />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleSwapPoints}
                        className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-emerald-800 transition-colors shrink-0 cursor-pointer"
                        title="Swap Start & First Stop"
                      >
                        <ArrowLeftRight size={14} className="rotate-90" />
                      </button>
                    </div>

                    {/* Multi-Stop Destinations: B, C, D... */}
                    {routeStops.map((stop, idx) => {
                      const stopLetter = String.fromCharCode(66 + idx);
                      return (
                        <div
                          key={`${stop.id}-${idx}`}
                          className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:border-emerald-600 focus-within:bg-white transition-all"
                        >
                          <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                            {stopLetter}
                          </span>
                          <div className="flex-1 min-w-0">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                              {idx === routeStops.length - 1
                                ? `Final Destination (${stopLetter})`
                                : `Stop ${idx + 1} (${stopLetter})`}
                            </label>
                            <select
                              value={stop.id}
                              onChange={(e) => handleChangeStop(idx, e.target.value)}
                              className="w-full bg-transparent font-bold text-xs text-gray-900 outline-none truncate cursor-pointer"
                            >
                              {KONKAN_MAP_SPOTS.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name} ({s.district})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Reorder & Remove Controls */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            {routeStops.length > 1 && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleMoveStop(idx, "up")}
                                  disabled={idx === 0}
                                  className="p-1 rounded-lg hover:bg-gray-200 disabled:opacity-30 text-gray-600 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveStop(idx, "down")}
                                  disabled={idx === routeStops.length - 1}
                                  className="p-1 rounded-lg hover:bg-gray-200 disabled:opacity-30 text-gray-600 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveStop(idx)}
                                  className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 cursor-pointer"
                                  title="Remove Stop"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Another Stop Button + Hint */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={handleAddStop}
                      disabled={routeStops.length >= 8}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 disabled:opacity-40 text-emerald-900 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Stop ({routeStops.length}/8)</span>
                    </button>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Or click pins on map
                    </span>
                  </div>

                  {/* Multi-Stop Best Order Optimizer Banner */}
                  {routeStops.length >= 2 && (
                    <div
                      className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 ${
                        bestOrderSuggestion.isAlreadyOptimal
                          ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                          : "bg-amber-50 border-amber-300 text-amber-950"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {bestOrderSuggestion.isAlreadyOptimal ? (
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        ) : (
                          <Sparkles size={16} className="text-amber-600 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-[11px] font-black leading-tight">
                            {bestOrderSuggestion.isAlreadyOptimal
                              ? "Optimal Coastal Route Order"
                              : `Better Route Found! Save ~${bestOrderSuggestion.savedKm} km`}
                          </p>
                          <p className="text-[10px] opacity-80 truncate">
                            {bestOrderSuggestion.isAlreadyOptimal
                              ? "Your stops are in the shortest driving sequence"
                              : "Reorder stops to avoid backtracking along NH-66"}
                          </p>
                        </div>
                      </div>

                      {!bestOrderSuggestion.isAlreadyOptimal && (
                        <button
                          type="button"
                          onClick={() => setRouteStops(bestOrderSuggestion.orderedStops)}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shrink-0 shadow-xs transition-colors cursor-pointer"
                        >
                          Apply Best
                        </button>
                      )}
                    </div>
                  )}

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
                        className={`px-2 py-0.5 rounded-lg font-bold text-[10px] shrink-0 transition-colors cursor-pointer ${
                          startPoint.id === hub.id
                            ? "bg-emerald-700 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {hub.shortName}
                      </button>
                    ))}
                  </div>

                  {isRouting && (
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center gap-2 text-emerald-900 text-xs font-bold">
                      <Loader2 size={16} className="animate-spin text-emerald-600" />
                      <span>Calculating multi-stop road route...</span>
                    </div>
                  )}

                  {routeError && (
                    <div className="p-2.5 bg-amber-50 text-amber-900 rounded-2xl border border-amber-200 text-[11px] font-medium">
                      ⚠️ {routeError}
                    </div>
                  )}

                  {routeResult && !isRouting && (
                    <div className="space-y-3">
                      {/* Alternative Routes Comparison ("Which Route is Best") */}
                      {routeOptions.length > 1 && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-black uppercase tracking-wider text-[#2D6A4F]">
                            Compare Routes on Map ({routeOptions.length} found)
                          </p>
                          <div className="grid grid-cols-1 gap-1.5">
                            {routeOptions.map((opt, idx) => {
                              const isBest = idx === 0;
                              const isActive = idx === selectedRouteIdx;
                              const extraMins =
                                opt.durationMinutes - routeOptions[0].durationMinutes;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleSelectRouteOption(idx)}
                                  className={`w-full text-left p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                                    isActive
                                      ? "bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500/30"
                                      : "bg-white hover:bg-gray-50 border-gray-200"
                                  }`}
                                >
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span
                                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                          isActive ? "bg-emerald-500" : "bg-amber-500"
                                        }`}
                                      />
                                      <span className="text-xs font-black text-gray-900 truncate">
                                        {isBest ? "★ Best Route (Fastest)" : `Alternative ${idx}`}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 truncate pl-4 mt-0.5">
                                      Via {opt.summary || "NH-66"}
                                    </p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-xs font-black text-emerald-950">
                                      {formatDuration(opt.durationMinutes)}
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-500">
                                      {opt.distanceKm} km
                                      {!isBest && extraMins > 0 ? ` (+${extraMins}m)` : ""}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-emerald-100/70 border border-emerald-200 rounded-2xl text-center">
                          <span className="text-[9px] uppercase font-bold text-emerald-800/80 block">
                            Total Distance
                          </span>
                          <span className="text-base font-black text-emerald-950">
                            {routeResult.distanceKm} <span className="text-xs font-bold">km</span>
                          </span>
                        </div>

                        <div className="p-2.5 bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200 rounded-2xl text-center">
                          <span className="text-[9px] uppercase font-bold text-blue-800/80 block">
                            Total Time
                          </span>
                          <span className="text-sm sm:text-base font-black text-blue-950">
                            {formatDuration(routeResult.durationMinutes)}
                          </span>
                        </div>

                        <div className="p-2.5 bg-gradient-to-br from-amber-50 to-amber-100/70 border border-amber-200 rounded-2xl text-center">
                          <span className="text-[9px] uppercase font-bold text-amber-800/80 block">
                            Est. Fuel
                          </span>
                          <span className="text-base font-black text-amber-950">
                            ₹{fuelEstimate}
                          </span>
                        </div>
                      </div>

                      {/* Leg-by-Leg Breakdown when multiple stops selected */}
                      {routeResult.legs && routeResult.legs.length > 1 && (
                        <div className="p-2.5 bg-[#f7faf6] rounded-2xl border border-[#dce7db] space-y-1.5">
                          <p className="text-[10px] font-black uppercase tracking-wider text-[#2D6A4F]">
                            Stop-by-Stop Breakdown ({routeResult.legs.length} legs)
                          </p>
                          <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                            {routeResult.legs.map((leg, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-[11px] bg-white px-2.5 py-1.5 rounded-xl border border-gray-100"
                              >
                                <span className="font-bold text-gray-800 truncate max-w-[175px]">
                                  {String.fromCharCode(65 + idx)} → {String.fromCharCode(66 + idx)}:{" "}
                                  {leg.toName}
                                </span>
                                <span className="font-bold text-emerald-800 shrink-0 ml-2">
                                  {leg.distanceKm} km · {formatDuration(leg.durationMinutes)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

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

                      <div className="pt-1 flex items-center gap-2">
                        {(() => {
                          const lastStop = routeStops[routeStops.length - 1];
                          const waypointStr =
                            routeStops.length > 1
                              ? `&waypoints=${routeStops
                                  .slice(0, -1)
                                  .map((s) => `${s.lat},${s.lng}`)
                                  .join("|")}`
                              : "";
                          const gmapsHref = `https://www.google.com/maps/dir/?api=1&origin=${startPoint.lat},${startPoint.lng}&destination=${lastStop.lat},${lastStop.lng}${waypointStr}&travelmode=driving`;
                          return (
                            <a
                              href={gmapsHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-[#113822] hover:bg-emerald-900 active:scale-98 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-950/20 transition-all cursor-pointer"
                            >
                              <Navigation size={14} className="text-[#b8dc26]" />
                              <span>Turn-by-Turn (Google Maps)</span>
                              <ExternalLink size={11} className="opacity-70" />
                            </a>
                          );
                        })()}

                        {routeStops.length > 0 && (
                          <Link
                            href={
                              routeStops[routeStops.length - 1].externalLink ||
                              (routeStops[routeStops.length - 1].type === "trek"
                                ? `/treks/${routeStops[routeStops.length - 1].slug}`
                                : `/destinations/${routeStops[routeStops.length - 1].slug}`)
                            }
                            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition-colors cursor-pointer shrink-0"
                            title="View Final Stop Guide"
                          >
                            <Info size={16} />
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 4. MODE A: FLOATING SPOT PREVIEW CARD ── */}
        {selectedSpot && activeTab === "explore" && (
          <div className="absolute bottom-4 inset-x-3 sm:inset-x-auto sm:left-5 z-[95] sm:w-96">
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-600/30 overflow-hidden flex flex-col">
              {/* Top Image Preview & Close */}
              <div className="relative h-36 w-full bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getSpotImage(selectedSpot)}
                  alt={selectedSpot.name}
                  onError={() =>
                    setFailedPreviewImages((prev) => ({
                      ...prev,
                      [selectedSpot.id]: true,
                    }))
                  }
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
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-black uppercase tracking-wider">
                      {selectedSpot.district} · {selectedSpot.category}
                    </span>
                    <h3 className="font-bold text-base sm:text-lg text-white leading-tight drop-shadow-sm mt-0.5">
                      {selectedSpot.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 bg-black/55 px-2 py-1 rounded-lg backdrop-blur-xs text-xs font-bold text-[#b8dc26]">
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

                <div className="flex flex-wrap gap-1">
                  {selectedSpot.highlights.slice(0, 3).map((h, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      ✓ {h}
                    </span>
                  ))}
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRouteStops([selectedSpot]);
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

        {/* ── 5. BOTTOM RIGHT LEGEND ── */}
        <div className="hidden lg:block absolute bottom-4 right-14 z-[90] bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-gray-200 shadow-xl text-[11px] text-gray-700 space-y-1.5 pointer-events-auto">
          <p className="font-black uppercase tracking-wider text-gray-400 text-[10px]">
            Map Legend ({filteredSpots.length} spots)
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
              <span className="w-4 h-1 rounded-full bg-[#1a73e8]" />
              <span>Best Route</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-1 rounded-full bg-[#94a3b8]" />
              <span>Alt Route</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-[#0f766e]" />
              <span>Ferry Route</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
