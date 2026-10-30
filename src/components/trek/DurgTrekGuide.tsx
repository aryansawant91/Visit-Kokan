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
  Share2
} from "lucide-react";
import { Trek } from "@/types/trek";

interface Props {
  trek: Trek;
}

export default function DurgTrekGuide({ trek }: Props) {
  const [activeTab, setActiveTab] = useState<"about" | "reach" | "itinerary" | "trail">("about");
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [reachExpanded, setReachExpanded] = useState(false);

  const baseVillageName = trek.baseVillage || trek.startPoint || "Base Village";
  
  // Navigation URL
  const navUrl = trek.coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${trek.coordinates.lat},${trek.coordinates.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${baseVillageName} ${trek.name} Maharashtra`)}`;

  const weather = trek.weatherStats || {
    temp: "25°C",
    wind: "18 km/h Wind",
    rainProb: "15% Rain (24h)",
    uv: "UV 6",
    visibility: "16 km Visibility"
  };

  const elevation = trek.elevation || trek.maxAltitude || "Sahyadri Peak";
  const trailDistance = trek.trailDistance || trek.distance || "5.0 Km";
  const trailDuration = trek.trailDuration || "3 to 4 Hrs Ascent";
  const trailType = trek.trailType || (trek.category === "fort" ? "Historical Hill Fort" : "Sahyadri Mountain Trail");

  return (
    <div className="space-y-4">
      {/* ── DURG APP STYLE TRAIL METRICS CARD ── */}
      <div className="bg-white rounded-3xl p-5 border border-[#cadbc7] shadow-sm overflow-hidden">
        
        {/* Top Header: Title & Offline Trail Guide Pill */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[#2D6A4F] text-[11px] font-extrabold uppercase tracking-widest">
              <Castle size={13} />
              <span>Durg Sahyadri Expedition Guide</span>
            </div>
            <h3 className="text-lg font-black text-[#0f2416] mt-0.5">
              {trek.name}
            </h3>
            <p className="text-xs text-[#526b58] font-medium flex items-center gap-1 mt-0.5">
              <MapPin size={12} className="text-[#2D6A4F]" /> {trek.region}, Maharashtra
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#1f4e38] text-[10px] font-extrabold border border-emerald-200 shadow-2xs flex items-center gap-1">
              <Compass size={11} className="animate-spin text-[#2D6A4F]" /> Verified Trail
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
              Weekend 10 PM Batch
            </span>
          </div>
        </div>

        {/* 4-Column Trail Metrics Strip (exact Durg App style) */}
        <div className="grid grid-cols-4 gap-2 py-3 px-2.5 bg-[#f3f7f2] rounded-2xl border border-[#d6e3d3] text-center mb-3">
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

        {/* Live Weather Metrics Strip (Durg App exact reproduction) */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#3d5343] py-2 px-3 bg-[#edf3eb] rounded-xl border border-[#d6e3d3] overflow-x-auto gap-2 scrollbar-none mb-4">
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

        {/* Base Village Spotlight with direct link & Start Navigation button */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-[#edf6ee] to-teal-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D6A4F] block">
              Base Village
            </span>
            <span className="text-sm font-black text-[#0f2416] flex items-center gap-1.5 mt-0.5">
              <Flag size={14} className="text-emerald-600" /> {baseVillageName}
            </span>
            {trek.distance && (
              <p className="text-[11px] text-[#526b58] font-medium mt-0.5">
                📍 {trek.distance}
              </p>
            )}
          </div>

          {/* Durg App Style Primary Navigation Button */}
          <a
            href={navUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-[#1E4D38] to-[#2D6A4F] hover:brightness-110 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Navigation size={14} className="text-emerald-300 group-hover:rotate-45 transition-transform" />
            <span>Start Navigation</span>
            <ChevronRight size={13} className="opacity-70" />
          </a>
        </div>
      </div>

      {/* ── INTERACTIVE DURG GUIDE TABS (Exact UX for full trek info) ── */}
      <div className="bg-white rounded-3xl p-5 border border-[#cadbc7] shadow-sm">
        
        {/* Segmented Tab Header Bar */}
        <div className="flex gap-1.5 p-1 bg-[#edf3eb] rounded-2xl border border-[#d6e3d3] mb-5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center justify-center gap-1.5 ${
              activeTab === "about"
                ? "bg-white text-[#1b3d26] shadow-sm border border-[#cadbc7]"
                : "text-[#526b58] hover:text-[#0f2416]"
            }`}
          >
            <Sparkles size={13} className={activeTab === "about" ? "text-amber-500" : ""} />
            <span>About &amp; History</span>
          </button>

          <button
            onClick={() => setActiveTab("reach")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center justify-center gap-1.5 ${
              activeTab === "reach"
                ? "bg-white text-[#1b3d26] shadow-sm border border-[#cadbc7]"
                : "text-[#526b58] hover:text-[#0f2416]"
            }`}
          >
            <Navigation size={13} className={activeTab === "reach" ? "text-blue-500" : ""} />
            <span>How to Reach</span>
          </button>

          <button
            onClick={() => setActiveTab("itinerary")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center justify-center gap-1.5 ${
              activeTab === "itinerary"
                ? "bg-white text-[#1b3d26] shadow-sm border border-[#cadbc7]"
                : "text-[#526b58] hover:text-[#0f2416]"
            }`}
          >
            <Calendar size={13} className={activeTab === "itinerary" ? "text-emerald-600" : ""} />
            <span>1-Night Plan</span>
          </button>

          <button
            onClick={() => setActiveTab("trail")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center justify-center gap-1.5 ${
              activeTab === "trail"
                ? "bg-white text-[#1b3d26] shadow-sm border border-[#cadbc7]"
                : "text-[#526b58] hover:text-[#0f2416]"
            }`}
          >
            <Castle size={13} className={activeTab === "trail" ? "text-teal-600" : ""} />
            <span>Key Sights</span>
          </button>
        </div>

        {/* ── TAB 1: ABOUT & DEEP HISTORY (Durg App style) ── */}
        {activeTab === "about" && (
          <div className="space-y-4">
            {/* Overview Intro */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2D6A4F] mb-1.5 flex items-center gap-1.5">
                <Castle size={14} /> Overview
              </h4>
              <p className="text-[13px] text-[#2c4031] leading-relaxed">
                {trek.description}
              </p>
            </div>

            {/* Deep Historical Chronicle */}
            {trek.history && (
              <div className="p-4 bg-[#f8faf7] rounded-2xl border border-[#dce7da]">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#142e1b] mb-2 flex items-center gap-1.5">
                  <span>📜</span> Fort History &amp; Maratha Heritage
                </h4>
                <div className={`text-[13px] text-[#3d5343] leading-relaxed ${!historyExpanded ? "line-clamp-4" : ""}`}>
                  {trek.history}
                </div>
                <button
                  onClick={() => setHistoryExpanded(!historyExpanded)}
                  className="mt-2 text-xs font-bold text-[#2D6A4F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {historyExpanded ? (
                    <>
                      <span>Show Less</span> <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      <span>...See More History</span> <ChevronDown size={14} />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* High Altitude & Sahyadri Facts */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-[#2D6A4F] block">Summit Altitude</span>
                <span className="text-xs font-bold text-[#102416] mt-0.5 block">{elevation}</span>
              </div>
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-[#2D6A4F] block">Trek Difficulty</span>
                <span className="text-xs font-bold text-[#102416] mt-0.5 block uppercase">{trek.difficulty || "Moderate"}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: HOW TO REACH (Durg App exact format) ── */}
        {activeTab === "reach" && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2D6A4F] mb-1">
                Route to {baseVillageName}
              </h4>
              <p className="text-xs text-[#526b58]">
                Clear transit options from Mumbai and Pune to the trek starting base.
              </p>
            </div>

            {/* By Road (Driving / Trek Bus) */}
            <div className="p-4 bg-[#f8faf7] rounded-2xl border border-[#dce7da]">
              <div className="flex items-center gap-2 mb-2 text-[#142e1b] font-bold text-xs">
                <div className="w-6 h-6 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center">
                  <Car size={13} />
                </div>
                <span>By Road (Car / Private Bus)</span>
              </div>
              <p className="text-[12px] text-[#3d5343] leading-relaxed">
                {trek.howToReach?.byRoad ||
                  `From Mumbai (${trek.distance || "200 km"}): Drive via National Highway directly to ${baseVillageName}. Roads are paved with safe village parking.`}
              </p>
            </div>

            {/* By Train */}
            <div className="p-4 bg-[#f8faf7] rounded-2xl border border-[#dce7da]">
              <div className="flex items-center gap-2 mb-2 text-[#142e1b] font-bold text-xs">
                <div className="w-6 h-6 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center">
                  <Train size={13} />
                </div>
                <span>By Train (Public Railway)</span>
              </div>
              <p className="text-[12px] text-[#3d5343] leading-relaxed">
                {trek.howToReach?.byTrain ||
                  `Take suburban or express train from Mumbai to nearest major railhead, then connect via shared auto or local ST bus to ${baseVillageName}.`}
              </p>
            </div>

            {/* By State Transport Bus */}
            <div className="p-4 bg-[#f8faf7] rounded-2xl border border-[#dce7da]">
              <div className="flex items-center gap-2 mb-2 text-[#142e1b] font-bold text-xs">
                <div className="w-6 h-6 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center">
                  <Bus size={13} />
                </div>
                <span>By MSRTC State Transport Bus</span>
              </div>
              <p className="text-[12px] text-[#3d5343] leading-relaxed">
                {trek.howToReach?.byBus ||
                  `Regular MSRTC red buses operate from major bus depots (Swargate / Kalyan / Panvel / Mahad) directly to ${baseVillageName}.`}
              </p>
            </div>

            {/* Open Google Maps Button */}
            <a
              href={navUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#edf3eb] hover:bg-[#e2ede0] text-[#1b3d26] text-xs font-bold rounded-xl border border-[#cadbc7] transition-all flex items-center justify-center gap-2 group"
            >
              <Navigation size={14} className="text-[#2D6A4F] group-hover:rotate-45 transition-transform" />
              <span>Open Turn-by-Turn GPS Navigation</span>
            </a>
          </div>
        )}

        {/* ── TAB 3: 1-NIGHT ITINERARY (10 PM Mumbai Departure) ── */}
        {activeTab === "itinerary" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2D6A4F]">
                  Weekend Expedition Itinerary
                </h4>
                <p className="text-[11px] text-[#526b58]">
                  Departs Mumbai at 10:00 PM Saturday · Returns Sunday Night
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
              <span>All transport leaves Mumbai at 10:00 PM with pickups from Borivali, Andheri, Sion, Chembur, and Vashi.</span>
            </div>
          </div>
        )}

        {/* ── TAB 4: FORT ATTRACTIONS & KEY SIGHTS (Durg Style) ── */}
        {activeTab === "trail" && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2D6A4F] mb-1">
                Historic Fort Points &amp; Sights
              </h4>
              <p className="text-xs text-[#526b58]">
                Significant gates, bastions, temples, and viewpoints on the summit.
              </p>
            </div>

            {trek.fortAttractions && trek.fortAttractions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {trek.fortAttractions.map((pt, i) => (
                  <div
                    key={i}
                    className="p-3 bg-[#edf3eb] rounded-xl border border-[#d6e3d3] flex items-center gap-2.5 text-xs font-bold text-[#102416]"
                  >
                    <span className="w-6 h-6 rounded-lg bg-white border border-[#cadbc7] flex items-center justify-center text-[10px] text-[#2D6A4F] shrink-0">
                      {i + 1}
                    </span>
                    <span className="truncate">{pt}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-[#edf3eb] rounded-xl text-xs text-center text-[#526b58]">
                Summit features natural caves, water tanks, rock bastions, and panoramic viewpoints.
              </div>
            )}

            {/* What to Bring checklist preview */}
            {trek.thingsToBring && trek.thingsToBring.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-bold text-[#2D6A4F] uppercase tracking-wider block mb-2">
                  🎒 Required Trek Gear
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {trek.thingsToBring.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white rounded-lg text-[11px] font-semibold text-[#142e1b] border border-[#cadbc7]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
