"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Ship,
  Clock,
  MapPin,
  Car,
  Bike,
  Users,
  Compass,
  ArrowRight,
  Phone,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Fuel,
  TrendingDown,
  HelpCircle,
} from "lucide-react";
import { KONKAN_FERRY_ROUTES, FerryRoute } from "@/data/ferryRoutes";

export default function FerryClientView() {
  const [districtFilter, setDistrictFilter] = useState<"All" | "Raigad" | "Ratnagiri">("All");
  const [vehicleFilter, setVehicleFilter] = useState<"All" | "Car" | "Bike">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  // Per-route fare calculation states
  const [routeVehicles, setRouteVehicles] = useState<Record<string, "none" | "bike" | "carSmall" | "carSuv">>({});
  const [routePassengers, setRoutePassengers] = useState<Record<string, number>>({});

  const filteredRoutes = useMemo(() => {
    return KONKAN_FERRY_ROUTES.filter((r) => {
      if (districtFilter !== "All" && r.district !== districtFilter) return false;
      if (vehicleFilter === "Car" && !r.vehicleTypes.includes("Cars & SUVs")) return false;
      if (vehicleFilter === "Bike" && !r.vehicleTypes.includes("Bikes & Scooters")) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = r.name.toLowerCase().includes(q);
        const inTagline = r.tagline.toLowerCase().includes(q);
        const inFrom = r.fromPort.name.toLowerCase().includes(q) || r.fromPort.location.toLowerCase().includes(q);
        const inTo = r.toPort.name.toLowerCase().includes(q) || r.toPort.location.toLowerCase().includes(q);
        const inDest =
          r.fromPort.nearbyDestinations.some((d) => d.name.toLowerCase().includes(q)) ||
          r.toPort.nearbyDestinations.some((d) => d.name.toLowerCase().includes(q));
        if (!inName && !inTagline && !inFrom && !inTo && !inDest) return false;
      }
      return true;
    });
  }, [districtFilter, vehicleFilter, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedRouteId((curr) => (curr === id ? null : id));
  };

  const getVehicleChoice = (routeId: string) => routeVehicles[routeId] || "carSmall";
  const getPassengerCount = (routeId: string) => routePassengers[routeId] ?? 2;

  const calculateFare = (route: FerryRoute) => {
    const v = getVehicleChoice(route.id);
    const p = getPassengerCount(route.id);

    let vehicleCost = 0;
    if (v === "bike") vehicleCost = route.fares.twoWheeler;
    if (v === "carSmall") vehicleCost = route.fares.carSmall;
    if (v === "carSuv") vehicleCost = route.fares.carSuv;

    // For M2M, vehicle fare doesn't include driver; for creek ferries passenger fee applies
    const passengerCost = p * route.fares.passengerAdult;
    return vehicleCost + passengerCost;
  };

  const faqs = [
    {
      q: "Can I drive my own Car or SUV directly onto Konkan ferries?",
      a: "Yes! All 5 major ferry services listed here (Mumbai-Mandwa Ro-Pax, Bagmandla-Bankot, Dighi-Agardanda, Dabhol-Dhopave, and Jaigad-Tavsal) are specifically designed Roll-on/Roll-off (Ro-Ro) vessels capable of carrying passenger cars, SUVs, motorcycles, scooters, and cycles.",
    },
    {
      q: "Do I need to book creek ferry tickets in advance?",
      a: "For the creek ferries (Bagmandla, Dighi, Dabhol, and Jaigad), NO advance booking is required. Ferries operate on a continuous first-come, first-served basis every 30 to 45 minutes. You drive up to the ramp and purchase your ticket on the spot via UPI or Cash. For the Mumbai ⇄ Mandwa Ro-Pax (M2M), advance online booking is advisable during peak weekend rush.",
    },
    {
      q: "Do these coastal ferries operate during the monsoon season?",
      a: "Yes! Creek ferries (Bagmandla-Bankot, Dabhol-Dhopave, Jaigad-Tavsal) operate year-round because they sail within sheltered river estuaries rather than open sea. The large Mumbai-Mandwa Ro-Pax (M2M) also sails throughout the monsoon. Small speedboats and passenger catamarans suspend operations between June and September.",
    },
    {
      q: "How much driving time and fuel do these coastal ferries save?",
      a: "They save 1.5 to 3.5 hours per crossing and between 55 km to 105 km of winding ghat road detours. For instance, the Bagmandla-Bankot ferry saves an 85 km detour through Mahad, and the Dabhol-Dhopave ferry avoids an 80 km inland detour through Chiplun.",
    },
    {
      q: "Are pets allowed on board?",
      a: "Yes, dogs and household pets are permitted on board. On vehicle creek ferries, pets can remain inside your vehicle or on the open deck on a leash. On Mumbai-Mandwa Ro-Ro, pets are allowed on the open-air sundeck with a nominal pet pass.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#14291c] pb-16">
      {/* ══════════════════════════════════════════════════════════════
          1. HERO HEADER BANNER
         ══════════════════════════════════════════════════════════════ */}
      <div className="relative bg-gradient-to-br from-[#0c2617] via-[#123822] to-[#1c5535] text-white pt-10 sm:pt-14 pb-14 sm:pb-18 px-4 overflow-hidden border-b border-emerald-500/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#b8dc26_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/15 backdrop-blur-md">
            <Ship className="w-3.5 h-3.5 text-[#b8dc26]" />
            <span>Official Coastal Ro-Ro &amp; Vehicle Ferry Directory</span>
          </div>

          <h1 className="font-playfair text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Konkan Coastal Ferry <br className="hidden sm:inline" />
            <span className="text-[#b8dc26]">&amp; Ro-Ro Timetables 2026</span>
          </h1>

          <p className="text-emerald-100/80 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Drive your car or bike straight onto the ferry and cross coastal estuaries in 15 minutes. Save 2–3 hours of mountain highway detours across Raigad and Ratnagiri.
          </p>

          {/* Quick Metrics Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-emerald-100">
            <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
              <Sparkles size={14} className="text-[#b8dc26]" />
              <span>5 Major Coastal Ferry Routes</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
              <TrendingDown size={14} className="text-[#b8dc26]" />
              <span>Saves 50–100 km per Crossing</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
              <Car size={14} className="text-[#b8dc26]" />
              <span>Cars, SUVs &amp; Bikes Boarding</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. FILTER & SEARCH CONTROL BAR
         ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 -mt-7 relative z-20 space-y-4">
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xl border border-[#cadbc7] space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by destination or jetty (e.g. Mandwa, Velas, Harihareshwar, Guhagar, Ganpatipule...)"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-xs sm:text-sm text-gray-800 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* District & Vehicle Filter Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            {/* District Pills */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-gray-500 text-[11px] uppercase tracking-wider mr-1 hidden sm:inline">
                District:
              </span>
              {(["All", "Raigad", "Ratnagiri"] as const).map((dist) => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => setDistrictFilter(dist)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    districtFilter === dist
                      ? "bg-[#163a23] text-white shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {dist === "All" ? "All Districts" : dist}
                </button>
              ))}
            </div>

            {/* Vehicle Mode Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-gray-500 text-[11px] uppercase tracking-wider mr-1 hidden sm:inline">
                Vehicle:
              </span>
              <button
                type="button"
                onClick={() => setVehicleFilter("All")}
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  vehicleFilter === "All"
                    ? "bg-[#163a23] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setVehicleFilter("Car")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  vehicleFilter === "Car"
                    ? "bg-[#163a23] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Car size={12} />
                <span>Cars &amp; SUVs</span>
              </button>
              <button
                type="button"
                onClick={() => setVehicleFilter("Bike")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  vehicleFilter === "Bike"
                    ? "bg-[#163a23] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Bike size={12} />
                <span>Bikes</span>
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            3. ROUTE CARDS GRID
           ══════════════════════════════════════════════════════════════ */}
        <div className="space-y-6 pt-2">
          {filteredRoutes.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 space-y-3">
              <p className="font-bold text-gray-700 text-sm">No ferry routes match your search filters.</p>
              <button
                type="button"
                onClick={() => {
                  setDistrictFilter("All");
                  setVehicleFilter("All");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredRoutes.map((route) => {
              const isExpanded = expandedRouteId === route.id;
              const vehicleChoice = getVehicleChoice(route.id);
              const passengerCount = getPassengerCount(route.id);
              const totalFare = calculateFare(route);

              return (
                <div
                  key={route.id}
                  id={route.id}
                  className="bg-white rounded-3xl border-2 border-[#cadbc7] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Top Highlight Banner */}
                  <div className="bg-gradient-to-r from-[#102d1a] to-[#1c4d2d] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                        {route.district} District · {route.waterBody}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#b8dc26] text-emerald-950 text-[11px] font-black uppercase tracking-wider shadow-xs">
                        ⚡ Saves {route.detourTimeSaved}
                      </span>
                      <span className="text-[11px] text-emerald-100 font-semibold hidden sm:inline">
                        (Avoids {route.detourKmSaved} km detour)
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-7 space-y-5">
                    {/* Route Title & Ports */}
                    <div>
                      <h2 className="text-lg sm:text-2xl font-black text-[#113822] tracking-tight">
                        {route.name}
                      </h2>
                      <p className="text-xs text-gray-600 mt-1">{route.tagline}</p>
                    </div>

                    {/* From ⇄ To Terminal Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Port A */}
                      <div className="p-4 rounded-2xl bg-[#f5f8f4] border border-[#dce7db] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            Terminal A
                          </span>
                          <a
                            href={route.fromPort.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                          >
                            <MapPin size={12} />
                            <span>Jetty Maps</span>
                            <ExternalLink size={10} />
                          </a>
                        </div>
                        <p className="font-bold text-sm text-[#113822]">{route.fromPort.name}</p>
                        <p className="text-[11px] text-gray-500">{route.fromPort.location}</p>

                        {/* Nearby links */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {route.fromPort.nearbyDestinations.map((dest, i) => (
                            <Link
                              key={i}
                              href={`/destinations/${dest.slug}`}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-gray-200 text-emerald-800 hover:border-emerald-400"
                            >
                              📍 {dest.name}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Port B */}
                      <div className="p-4 rounded-2xl bg-[#f5f8f4] border border-[#dce7db] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            Terminal B
                          </span>
                          <a
                            href={route.toPort.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                          >
                            <MapPin size={12} />
                            <span>Jetty Maps</span>
                            <ExternalLink size={10} />
                          </a>
                        </div>
                        <p className="font-bold text-sm text-[#113822]">{route.toPort.name}</p>
                        <p className="text-[11px] text-gray-500">{route.toPort.location}</p>

                        {/* Nearby links */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {route.toPort.nearbyDestinations.map((dest, i) => (
                            <Link
                              key={i}
                              href={`/destinations/${dest.slug}`}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-gray-200 text-emerald-800 hover:border-emerald-400"
                            >
                              📍 {dest.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Specs Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-2xs">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Transit Time</span>
                        <span className="font-bold text-[#113822] text-sm">⏱️ {route.durationMins} Minutes</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-2xs">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Frequency</span>
                        <span className="font-bold text-[#113822] text-xs leading-snug">{route.frequencyText}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-2xs">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Daily Hours</span>
                        <span className="font-bold text-[#113822] text-xs">
                          {route.firstFerry} – {route.lastFerry}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-2xs">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Ticketing</span>
                        <span className="font-bold text-emerald-700 text-xs">On the Spot (UPI/Cash)</span>
                      </div>
                    </div>

                    {/* ══════════════════════════════════════════════════
                        INTERACTIVE FARE CALCULATOR WIDGET
                       ══════════════════════════════════════════════════ */}
                    <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 rounded-2xl p-4 sm:p-5 border border-emerald-200/80 space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                            ₹
                          </span>
                          <h3 className="font-black text-xs sm:text-sm text-[#113822]">
                            Instant One-Way Fare Calculator
                          </h3>
                        </div>
                        <span className="text-[11px] text-emerald-900 font-bold bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                          One-Way Sea Crossing
                        </span>
                      </div>

                      {/* Controls */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Vehicle Selector */}
                        <div>
                          <label className="text-[11px] font-bold text-gray-700 block mb-1">
                            Your Vehicle:
                          </label>
                          <select
                            value={vehicleChoice}
                            onChange={(e) =>
                              setRouteVehicles((prev) => ({
                                ...prev,
                                [route.id]: e.target.value as any,
                              }))
                            }
                            className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-emerald-300 text-gray-800 outline-none focus:ring-2 focus:ring-emerald-500/30"
                          >
                            <option value="none">No Vehicle (Foot Passenger only)</option>
                            <option value="bike">Two-Wheeler / Scooter / Bike (₹{route.fares.twoWheeler})</option>
                            <option value="carSmall">Hatchback / Small Car (₹{route.fares.carSmall})</option>
                            <option value="carSuv">SUV / Large Car (₹{route.fares.carSuv})</option>
                          </select>
                        </div>

                        {/* Passenger Count */}
                        <div>
                          <label className="text-[11px] font-bold text-gray-700 block mb-1">
                            Total Passengers (Adults):
                          </label>
                          <div className="flex items-center gap-2">
                            <select
                              value={passengerCount}
                              onChange={(e) =>
                                setRoutePassengers((prev) => ({
                                  ...prev,
                                  [route.id]: Number(e.target.value),
                                }))
                              }
                              className="flex-1 text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-emerald-300 text-gray-800 outline-none focus:ring-2 focus:ring-emerald-500/30"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                <option key={n} value={n}>
                                  {n} {n === 1 ? "Person" : "People"} (₹{route.fares.passengerAdult} ea.)
                                </option>
                              ))}
                            </select>

                            <div className="text-right px-3 py-1.5 bg-white rounded-xl border border-emerald-300 min-w-[120px]">
                              <span className="text-[9px] uppercase font-bold text-gray-400 block">Total Fare</span>
                              <span className="text-base font-black text-emerald-800">
                                ₹{totalFare.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Comparative Fuel Savings Callout */}
                      <div className="flex items-center gap-2 text-[11px] text-emerald-900 bg-white/70 p-2.5 rounded-xl border border-emerald-200/60">
                        <Fuel size={14} className="text-emerald-700 shrink-0" />
                        <span>
                          <strong>Road Trip Pro-Tip:</strong> Driving the {route.detourKmSaved} km highway detour consumes ~₹600–₹850 of fuel plus ghat driving stress. The ferry costs ₹{totalFare} and saves {route.detourTimeSaved}!
                        </span>
                      </div>
                    </div>

                    {/* Expandable Details Button */}
                    <div className="pt-1 flex items-center justify-between border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => toggleExpand(route.id)}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 cursor-pointer py-1"
                      >
                        <span>{isExpanded ? "Hide Full Departure Schedule & Guidelines" : "View Full Timetable & Boarding Rules"}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      <a
                        href={`tel:${route.helpline.replace(/\s+/g, "")}`}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
                        title="Contact jetty master / ferry operator"
                      >
                        <Phone size={11} className="text-emerald-700" />
                        <span>Jetty Helpline</span>
                      </a>
                    </div>

                    {/* ══════════════════════════════════════════════════
                        EXPANDED SCHEDULE & BOARDING GUIDELINES
                       ══════════════════════════════════════════════════ */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-gray-100 space-y-4 text-xs animate-fadeIn">
                        {/* Timetable Grids */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                            <span className="font-black text-[11px] uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                              <Clock size={12} /> From {route.fromPort.name}
                            </span>
                            <div className="grid grid-cols-3 gap-1.5 text-[11px] text-gray-700 font-semibold">
                              {route.schedule.departureFromA.map((t, idx) => (
                                <span key={idx} className="bg-white p-1 rounded-md border text-center border-gray-200">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                            <span className="font-black text-[11px] uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                              <Clock size={12} /> From {route.toPort.name}
                            </span>
                            <div className="grid grid-cols-3 gap-1.5 text-[11px] text-gray-700 font-semibold">
                              {route.schedule.departureFromB.map((t, idx) => (
                                <span key={idx} className="bg-white p-1 rounded-md border text-center border-gray-200">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Boarding Tips & Notice */}
                        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
                          <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#123822] flex items-center gap-1.5">
                            <ShieldCheck size={13} className="text-emerald-700" /> Essential Vehicle Boarding Tips
                          </h4>
                          <ul className="space-y-1 pl-4 list-disc text-gray-700 marker:text-emerald-600">
                            {route.boardingTips.map((tip, idx) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                          <p className="text-[11px] text-emerald-900/80 pt-1 border-t border-emerald-200/50">
                            <strong>Operational Notice:</strong> {route.operationalNotice}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            4. FREQUENTLY ASKED QUESTIONS (WITH ACCORDION)
           ══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5 mt-10">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Traveler Guidelines
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#113822]">
              Konkan Ferry &amp; Ro-Ro FAQs
            </h3>
            <p className="text-xs text-gray-500">
              Everything you need to know about driving cars, bikes, and planning coastal crossings.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group p-4 bg-gray-50 hover:bg-gray-50/80 rounded-2xl border border-gray-200 transition-colors"
              >
                <summary className="font-bold text-xs sm:text-sm text-gray-800 cursor-pointer list-none flex items-center justify-between gap-3 select-none">
                  <span className="flex items-center gap-2">
                    <HelpCircle size={15} className="text-emerald-700 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown size={14} className="text-gray-400 group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <p className="text-xs text-gray-600 leading-relaxed mt-2.5 pl-6 pt-2 border-t border-gray-200/70">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            5. WHATSAPP CONCIERGE ASSISTANCE CARD
           ══════════════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-br from-[#122c1b] via-[#1a442a] to-[#255e39] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b8dc26]">
              Real-Time Coastal Navigation Support
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Unsure about tide times or jetty vehicle queues?
            </h3>
            <p className="text-xs text-emerald-100/75 max-w-xl">
              Chat directly with our verified Konkan travel concierge on WhatsApp for live route recommendations and vehicle crossing updates.
            </p>
          </div>

          <a
            href={`https://wa.me/918432587706?text=${encodeURIComponent(
              "Hi Visit Kokan Concierge! I'm planning a coastal road trip and need ferry timing updates for my route."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#25D366]/20 transition-all active:scale-95 shrink-0"
          >
            <span>Ask on WhatsApp (+91 84325 87706)</span>
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          6. JSON-LD STRUCTURED DATA SCHEMA FOR SEO
         ══════════════════════════════════════════════════════════════ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.a,
              },
            })),
          }),
        }}
      />
    </div>
  );
}

