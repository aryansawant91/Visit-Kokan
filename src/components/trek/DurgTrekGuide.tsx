"use client";

import React, { useState } from "react";
import {
  Compass,
  MapPin,
  Navigation,
  Mountain,
  Clock,
  Ruler,
  Wind,
  Umbrella,
  Sun,
  Eye,
  Train,
  Bus,
  Car,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Castle,
  Calendar,
  CheckCircle2,
  Package,
  Layers,
  Flag,
  Share2,
  Route
} from "lucide-react";
import { Trek, BaseVillageInfo } from "@/types/trek";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useMarathiReader } from "@/hooks/useMarathiReader";

interface Props {
  trek: Trek;
}

export default function DurgTrekGuide({ trek }: Props) {
  const [activeTab, setActiveTab] = useState<"about" | "routes" | "reach" | "trail" | "itinerary">("about");
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [selectedVillageIndex, setSelectedVillageIndex] = useState(0);

  const baseVillages: BaseVillageInfo[] = trek.baseVillages && trek.baseVillages.length > 0
    ? trek.baseVillages
    : [
        {
          name: trek.baseVillage || trek.startPoint || "Base Village",
          marathiName: "मुख्य पायथा गाव",
          isPrimary: true,
          difficulty: trek.difficulty || "Moderate",
          distanceFromBase: trek.distance || "5.0 km",
          trailDuration: trek.duration || "3 - 4 Hours",
          popularFor: "Main standard trekking trail to the summit",
          routeDescription: `Starting point for ${trek.name}. The trail ascends via the main historic path with marked stone stairs and scenic viewpoints.`,
          coordinates: trek.coordinates || { lat: 18.2758, lng: 73.6231 }
        }
      ];

  const currentVillage = baseVillages[selectedVillageIndex] || baseVillages[0];

  // Professional Marathi Reader Hook
  const { isMarathi, loading: translating, toggleLanguage, getField } = useMarathiReader(
    {
      description: trek.description,
      history: trek.history,
      byRoad: trek.howToReach?.byRoad,
      byTrain: trek.howToReach?.byTrain,
      byBus: trek.howToReach?.byBus,
      popularFor: currentVillage.popularFor,
      routeDescription: currentVillage.routeDescription,
    },
    `${trek.name} Fort Sahyadri Expedition Guide`
  );

  // Dynamic Navigation URL for selected base village
  const navUrl = currentVillage.coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${currentVillage.coordinates.lat},${currentVillage.coordinates.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${currentVillage.name} ${trek.name} Maharashtra`)}`;

  const weather = trek.weatherStats || {
    temp: "25°C",
    wind: "18 km/h Wind",
    rainProb: "15% Rain (24h)",
    uv: "UV 6",
    visibility: "16 km Visibility"
  };

  const elevation = trek.elevation || trek.maxAltitude || "Sahyadri Peak";
  const trailDistance = currentVillage.distanceFromBase || trek.distance || "5.0 Km";
  const trailDuration = currentVillage.trailDuration || trek.trailDuration || "3 to 4 Hrs";

  return (
    <div className="space-y-5">
      {/* ── 1. DURG APP STYLE TRAIL METRICS & WEATHER CARD ── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cadbc7] shadow-sm overflow-hidden">
        
        {/* Header & Badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[#2D6A4F] text-[11px] font-extrabold uppercase tracking-widest">
              <Castle size={14} />
              <span>Durg Sahyadri Fort Guide</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#0f2416] tracking-tight mt-0.5">
              {trek.name}
            </h3>
            <p className="text-xs text-[#526b58] font-medium flex items-center gap-1 mt-1">
              <MapPin size={13} className="text-[#2D6A4F]" /> {trek.region}, Maharashtra
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <LanguageToggle
              isMarathi={isMarathi}
              onToggle={toggleLanguage}
              loading={translating}
              variant="compact"
            />
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
              Weekend 10 PM Batch
            </span>
          </div>
        </div>

        {/* 4-Column Trail Metrics Strip (Durg App style) */}
        <div className="grid grid-cols-4 gap-2 py-3.5 px-3 bg-[#f3f7f2] rounded-2xl border border-[#d6e3d3] text-center mb-3">
          <div className="border-r border-[#cadbc7]/60 pr-1">
            <p className="text-[10px] text-[#69846f] font-bold uppercase tracking-wider">Distance</p>
            <p className="text-xs sm:text-sm font-black text-[#0f2416] mt-0.5 truncate">{trailDistance}</p>
          </div>
          <div className="border-r border-[#cadbc7]/60 pr-1">
            <p className="text-[10px] text-[#69846f] font-bold uppercase tracking-wider">Elevation</p>
            <p className="text-xs sm:text-sm font-black text-[#0f2416] mt-0.5 truncate">{elevation.split(" ")[0]}</p>
          </div>
          <div className="border-r border-[#cadbc7]/60 pr-1">
            <p className="text-[10px] text-[#69846f] font-bold uppercase tracking-wider">Ascent</p>
            <p className="text-xs sm:text-sm font-black text-[#0f2416] mt-0.5 truncate">{trailDuration.split(" ")[0] + " " + (trailDuration.split(" ")[1] || "Hrs")}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#69846f] font-bold uppercase tracking-wider">Type</p>
            <p className="text-xs sm:text-sm font-black text-[#2D6A4F] mt-0.5 truncate">Fort</p>
          </div>
        </div>

        {/* Live Weather Metrics Strip */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#3d5343] py-2 px-3.5 bg-[#edf3eb] rounded-xl border border-[#d6e3d3] overflow-x-auto gap-2 scrollbar-none mb-4">
          <span className="flex items-center gap-1 font-bold text-[#0f2416] shrink-0">
            <Sun size={13} className="text-amber-500" /> {weather.temp || "25°C"}
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1 shrink-0">
            <Wind size={13} className="text-blue-500" /> {weather.wind || "18 km/h"}
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1 shrink-0">
            <Umbrella size={13} className="text-indigo-500" /> {weather.rainProb || "15% Rain"}
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1 shrink-0">
            <Eye size={13} className="text-teal-600" /> {weather.visibility || "16 km Vis"}
          </span>
        </div>

        {/* ── INTERACTIVE MULTIPLE BASE VILLAGES SELECTOR ── */}
        <div className="p-4 bg-gradient-to-br from-emerald-50/90 via-[#edf6ee] to-teal-50/80 rounded-2xl border border-emerald-200">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center text-xs font-bold">
                <Flag size={12} />
              </span>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#142e1b]">
                  Base Villages &amp; Trailheads
                </h4>
                <p className="text-[11px] text-[#526b58]">
                  {baseVillages.length > 1
                    ? `This fort has ${baseVillages.length} distinct ascent routes. Select a base village below:`
                    : "Primary base village and trailhead"}
                </p>
              </div>
            </div>

            {baseVillages.length > 1 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#142e1b] text-[10px] font-black shrink-0">
                {baseVillages.length} Routes
              </span>
            )}
          </div>

          {/* Base Village Selection Pills */}
          {baseVillages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none">
              {baseVillages.map((village, idx) => {
                const isSelected = idx === selectedVillageIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedVillageIndex(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer border ${
                      isSelected
                        ? "bg-[#1E4D38] text-white border-[#1E4D38] shadow-sm"
                        : "bg-white text-[#1f422b] border-[#cadbc7] hover:bg-[#e4eee3]"
                    }`}
                  >
                    <span>{isSelected ? "📍" : "⚪"}</span>
                    <span>{village.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                      isSelected ? "bg-white/20 text-white" : "bg-emerald-50 text-[#2D6A4F]"
                    }`}>
                      {village.difficulty.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Village Details Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3.5 border border-[#cadbc7]/70 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-black text-[#0f2416]">
                    {currentVillage.name}
                  </h5>
                  {currentVillage.marathiName && (
                    <span className="text-xs text-[#526b58] font-semibold">
                      ({currentVillage.marathiName})
                    </span>
                  )}
                  {currentVillage.isPrimary && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                      Primary Route
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#2c4031] font-medium mt-0.5">
                  🌟 {getField("popularFor") || currentVillage.popularFor}
                </p>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-[#edf3eb] text-[#142e1b] text-[11px] font-bold border border-[#d6e3d3]">
                  📏 {currentVillage.distanceFromBase}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#edf3eb] text-[#142e1b] text-[11px] font-bold border border-[#d6e3d3]">
                  ⏱️ {currentVillage.trailDuration}
                </span>
              </div>
            </div>

            <p className="text-[12px] text-[#3d5343] leading-relaxed border-t border-[#edf3eb] pt-2">
              {getField("routeDescription") || currentVillage.routeDescription}
            </p>

            {/* Direct Google Maps Navigation to this specific village */}
            <div className="pt-1 flex flex-col sm:flex-row items-center gap-2.5">
              <a
                href={navUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 px-4 py-2.5 bg-gradient-to-r from-[#1E4D38] to-[#2D6A4F] hover:brightness-110 active:scale-98 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Navigation size={14} className="text-emerald-300 group-hover:rotate-45 transition-transform" />
                <span>Start Navigation to {currentVillage.name} Base</span>
                <ChevronRight size={13} className="opacity-70" />
              </a>

              <span className="text-[11px] text-[#526b58] font-medium text-center">
                GPS: {currentVillage.coordinates?.lat.toFixed(4)}, {currentVillage.coordinates?.lng.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. DURG KNOWLEDGE BASE TABS (For Those Seeking Full Information) ── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cadbc7] shadow-sm">
        
        {/* Segmented Navigation Tab Bar */}
        <div className="flex gap-1.5 p-1 bg-[#edf3eb] rounded-2xl border border-[#d6e3d3] mb-5 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("about")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "about"
                ? "bg-white text-[#1b3d26] shadow-sm border border-[#cadbc7]"
                : "text-[#526b58] hover:text-[#0f2416]"
            }`}
          >
            <Sparkles size={13} className={activeTab === "about" ? "text-amber-500" : ""} />
            <span>History &amp; Heritage</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reach")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "reach"
                ? "bg-white text-[#1b3d26] shadow-sm border border-[#cadbc7]"
                : "text-[#526b58] hover:text-[#0f2416]"
            }`}
          >
            <Navigation size={13} className={activeTab === "reach" ? "text-blue-500" : ""} />
            <span>How to Reach</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("trail")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "trail"
                ? "bg-white text-[#1b3d26] shadow-sm border border-[#cadbc7]"
                : "text-[#526b58] hover:text-[#0f2416]"
            }`}
          >
            <Castle size={13} className={activeTab === "trail" ? "text-teal-600" : ""} />
            <span>Fort Sights</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("itinerary")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "itinerary"
                ? "bg-white text-[#1b3d26] shadow-sm border border-[#cadbc7]"
                : "text-[#526b58] hover:text-[#0f2416]"
            }`}
          >
            <Calendar size={13} className={activeTab === "itinerary" ? "text-emerald-600" : ""} />
            <span>10 PM Plan</span>
          </button>
        </div>

        {/* ── TAB 1: DEEP HISTORY & MARATHA HERITAGE (Durg App format) ── */}
        {activeTab === "about" && (
          <div className="space-y-4">
            {isMarathi && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold">
                <span>🚩</span>
                <span>मराठी भाषांतर सक्रिय (माहिती शुद्ध मराठीत वाचत आहात)</span>
              </div>
            )}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2D6A4F] mb-1.5 flex items-center gap-1.5">
                <Castle size={14} /> {isMarathi ? "किल्ल्याचा परिचय" : "Citadel Overview"}
              </h4>
              <p className="text-[13px] text-[#2c4031] leading-relaxed">
                {getField("description") || trek.description}
              </p>
            </div>

            {/* Deep Historical Chronicle */}
            {trek.history && (
              <div className="p-4 bg-[#f8faf7] rounded-2xl border border-[#dce7da]">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#142e1b] mb-2 flex items-center gap-1.5">
                  <span>📜</span> {isMarathi ? "किल्ल्याचा इतिहास व मराठा पराक्रम" : "Fort History & Maratha Chronicles"}
                </h4>
                <div className={`text-[13px] text-[#3d5343] leading-relaxed ${!historyExpanded ? "line-clamp-5" : ""}`}>
                  {getField("history") || trek.history}
                </div>
                <button
                  type="button"
                  onClick={() => setHistoryExpanded(!historyExpanded)}
                  className="mt-2 text-xs font-bold text-[#2D6A4F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {historyExpanded ? (
                    <>
                      <span>{isMarathi ? "कमी दाखवा" : "Show Less"}</span> <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      <span>{isMarathi ? "...संपूर्ण इतिहास वाचा" : "...See More History"}</span> <ChevronDown size={14} />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Highlights Chips */}
            {trek.highlights && trek.highlights.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] mb-2.5">
                  Key Historical Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {trek.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[#edf3eb] rounded-xl border border-[#cadbc7] text-xs font-semibold text-[#142e1b] flex items-center gap-2"
                    >
                      <CheckCircle2 size={14} className="text-[#2D6A4F] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: HOW TO REACH (Road, Train, Bus) ── */}
        {activeTab === "reach" && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2D6A4F] mb-1">
                Transit Directions to {currentVillage.name}
              </h4>
              <p className="text-xs text-[#526b58]">
                Clear step-by-step route directions from Mumbai and Pune.
              </p>
            </div>

            {/* By Road */}
            <div className="p-4 bg-[#f8faf7] rounded-2xl border border-[#dce7da]">
              <div className="flex items-center gap-2 mb-2 text-[#142e1b] font-bold text-xs">
                <div className="w-6 h-6 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center">
                  <Car size={13} />
                </div>
                <span>{isMarathi ? "रस्त्याने (स्वतःची गाडी किंवा ट्रॅव्हलर)" : "By Road (Self Drive & Private Bus)"}</span>
              </div>
              <p className="text-[12px] text-[#3d5343] leading-relaxed">
                {getField("byRoad") ||
                  trek.howToReach?.byRoad ||
                  `From Mumbai (${trek.distance || "180 km"}): Drive via National Highway directly to ${currentVillage.name}. Roads are paved with safe village parking available at the base.`}
              </p>
            </div>

            {/* By Train */}
            <div className="p-4 bg-[#f8faf7] rounded-2xl border border-[#dce7da]">
              <div className="flex items-center gap-2 mb-2 text-[#142e1b] font-bold text-xs">
                <div className="w-6 h-6 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center">
                  <Train size={13} />
                </div>
                <span>{isMarathi ? "रेल्वेने (लोकल किंवा एक्सप्रेस गाडी)" : "By Train (Suburban & Express Railway)"}</span>
              </div>
              <p className="text-[12px] text-[#3d5343] leading-relaxed">
                {getField("byTrain") ||
                  trek.howToReach?.byTrain ||
                  `Take train from Mumbai to nearest railhead, then connect via shared auto or local ST bus to ${currentVillage.name}.`}
              </p>
            </div>

            {/* By State Transport Bus */}
            <div className="p-4 bg-[#f8faf7] rounded-2xl border border-[#dce7da]">
              <div className="flex items-center gap-2 mb-2 text-[#142e1b] font-bold text-xs">
                <div className="w-6 h-6 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center">
                  <Bus size={13} />
                </div>
                <span>{isMarathi ? "एसटी बसने (लालपरी)" : "By MSRTC State Transport Bus"}</span>
              </div>
              <p className="text-[12px] text-[#3d5343] leading-relaxed">
                {getField("byBus") ||
                  trek.howToReach?.byBus ||
                  `Regular MSRTC red buses operate from major bus depots directly or via connecting shuttles to ${currentVillage.name}.`}
              </p>
            </div>

            {/* 1-Click GPS Navigation */}
            <a
              href={navUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#edf3eb] hover:bg-[#e2ede0] text-[#1b3d26] text-xs font-bold rounded-xl border border-[#cadbc7] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Navigation size={14} className="text-[#2D6A4F] group-hover:rotate-45 transition-transform" />
              <span>Open Turn-by-Turn GPS Navigation in Google Maps</span>
            </a>
          </div>
        )}

        {/* ── TAB 3: FORT ATTRACTIONS & SUMMIT SIGHTS ── */}
        {activeTab === "trail" && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2D6A4F] mb-1">
                Historic Fort Points &amp; Summit Sights
              </h4>
              <p className="text-xs text-[#526b58]">
                Significant gates, bastions, temples, and natural viewpoints to explore.
              </p>
            </div>

            {trek.fortAttractions && trek.fortAttractions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {trek.fortAttractions.map((pt, i) => (
                  <div
                    key={i}
                    className="p-3 bg-[#edf3eb] rounded-xl border border-[#d6e3d3] flex items-center gap-3 text-xs font-bold text-[#102416]"
                  >
                    <span className="w-6 h-6 rounded-lg bg-white border border-[#cadbc7] flex items-center justify-center text-[11px] font-black text-[#2D6A4F] shrink-0">
                      {i + 1}
                    </span>
                    <span className="truncate">{pt}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-[#edf3eb] rounded-xl text-xs text-center text-[#526b58]">
                Summit features ancient caves, water tanks, rock bastions, and panoramic viewpoints.
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: 1-NIGHT EXPEDITION PLAN (10 PM Mumbai Departure) ── */}
        {activeTab === "itinerary" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2D6A4F]">
                  Weekend Expedition Itinerary
                </h4>
                <p className="text-[11px] text-[#526b58]">
                  Departs Mumbai 10:00 PM Saturday · Returns Sunday Night
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#142e1b] text-[10px] font-black">
                1D 1N
              </span>
            </div>

            <div className="space-y-3">
              {trek.itinerary && trek.itinerary.length > 0 ? (
                trek.itinerary.map((day, idx) => (
                  <div key={idx} className="p-3.5 bg-[#f8faf7] rounded-2xl border border-[#dce7da] flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1b3d26] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {day.day}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-[#0f2416] mb-1">
                        {day.title}
                      </h5>
                      <p className="text-[12px] text-[#3d5343] leading-relaxed whitespace-pre-line">
                        {day.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-500 text-center">
                  Itinerary schedule being confirmed with trek leads.
                </div>
              )}
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 font-semibold flex items-center gap-2">
              <span>💡</span>
              <span>All transport leaves Mumbai at 10:00 PM with pickups: Borivali, Andheri, Sion, Chembur, Vashi, and Panvel.</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
