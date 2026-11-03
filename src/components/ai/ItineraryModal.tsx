"use client";

import React, { useState } from "react";
import {
  Sparkles,
  MapPin,
  Clock,
  Navigation,
  Utensils,
  Castle,
  Waves,
  Tent,
  Train,
  Car,
  Ship,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Printer,
  Calendar,
  Ticket,
  ChevronRight,
  ArrowRight,
  Compass,
  Mountain,
  Footprints,
  Phone
} from "lucide-react";
import toast from "react-hot-toast";

export interface Stop {
  time: string;
  place: string;
  type: "transport" | "sightseeing" | "food" | "stay" | "activity";
  description?: string;
  cost?: string;
  mapsQuery?: string;
  duration?: string;
  trainNumber?: string;
  trainName?: string;
  departStation?: string;
  arriveStation?: string;
  departTime?: string;
  arriveTime?: string;
}

export interface Day {
  day: number;
  title: string;
  stops: Stop[];
}

export interface ItineraryData {
  title: string;
  subtitle: string;
  days: Day[];
  tips?: string[];
  totalBudget?: string;
  transportSummary?: {
    type: "train" | "road" | "ferry";
    name?: string;
    number?: string;
    from: string;
    to: string;
    duration: string;
    cost?: string;
    departs?: string;
    arrives?: string;
  };
}

function StopIcon({ type, place }: { type: Stop["type"]; place: string }) {
  const p = place.toLowerCase();
  if (type === "transport") return <Train size={16} className="text-[#2D6A4F]" />;
  if (type === "food" || p.includes("dhaba") || p.includes("lunch") || p.includes("dinner") || p.includes("breakfast"))
    return <Utensils size={16} className="text-[#B7895A]" />;
  if (type === "stay" || p.includes("homestay") || p.includes("resort") || p.includes("hotel") || p.includes("camp"))
    return <Tent size={16} className="text-purple-700" />;
  if (type === "activity" || p.includes("scuba") || p.includes("water") || p.includes("boat") || p.includes("beach"))
    return <Waves size={16} className="text-teal-600" />;
  if (p.includes("fort") || p.includes("gad") || p.includes("temple") || p.includes("mandir"))
    return <Castle size={16} className="text-[#142607]" />;
  if (p.includes("trek") || p.includes("climb") || p.includes("peak"))
    return <Mountain size={16} className="text-[#2D6A4F]" />;
  return <Compass size={16} className="text-[#2D6A4F]" />;
}

function TransportCard({ data }: { data: ItineraryData["transportSummary"] }) {
  if (!data) return null;

  const isRoad = data.type === "road";
  const isTrain = data.type === "train";
  const isFerry = data.type === "ferry";

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    data.from
  )}&destination=${encodeURIComponent(data.to)}&travelmode=${isRoad ? "driving" : "transit"}`;

  const pnrUrl = isTrain ? "https://www.railyatri.in/pnr-status" : null;
  const liveTrainUrl = isTrain ? "https://konkanrailway.com/VisualTrain/" : null;
  const irctcUrl = isTrain ? "https://www.irctc.co.in/nget/train-search" : null;
  const ferryUrl = isFerry ? "https://m2mferries.com" : null;

  return (
    <div className="bg-gradient-to-br from-[#122b1b] via-[#1a3d28] to-[#153421] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-900/40 mb-4">
      {/* Top Bar: Transit Type & Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-emerald-300">
            {isTrain ? <Train size={17} /> : isFerry ? <Ship size={17} /> : <Car size={17} />}
          </span>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#B7895A]">
              Transit Connection
            </div>
            <div className="text-sm font-black text-white">
              {isTrain ? data.name || "Konkan Railway" : isFerry ? "Coastal Ferry Service" : "Scenic Highway Route"}
              {data.number && (
                <span className="ml-2 text-xs font-semibold text-emerald-200">
                  #{data.number}
                </span>
              )}
            </div>
          </div>
        </div>

        {isTrain && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            LIVE TRAIN
          </span>
        )}
      </div>

      {/* Boarding Pass Route */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center justify-between gap-3 my-3">
        <div className="flex-1">
          <div className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">Departure</div>
          <div className="text-sm font-black text-white">{data.departs || "05:25 AM"}</div>
          <div className="text-xs text-white/80 font-medium truncate">{data.from}</div>
        </div>

        <div className="flex flex-col items-center justify-center px-2">
          <span className="text-[10px] text-emerald-300/80 font-semibold">{data.duration}</span>
          <div className="w-16 sm:w-24 h-px bg-white/20 relative my-1">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#b8dc26]" />
          </div>
          <span className="text-[9px] uppercase tracking-wider text-white/50">Direct</span>
        </div>

        <div className="flex-1 text-right">
          <div className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">Arrival</div>
          <div className="text-sm font-black text-white">{data.arrives || "01:55 PM"}</div>
          <div className="text-xs text-white/80 font-medium truncate">{data.to}</div>
        </div>
      </div>

      {/* Fare & Direct Action Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-white/10">
        {data.cost && (
          <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
            <span>💰 Fare:</span>
            <span>{data.cost}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 ml-auto flex-wrap">
          {irctcUrl && (
            <a
              href={irctcUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#b8dc26] hover:bg-[#aed422] text-[#142607] text-[11px] font-black transition-all shadow-xs flex items-center gap-1"
            >
              <Ticket size={12} />
              <span>IRCTC</span>
            </a>
          )}
          {ferryUrl && (
            <a
              href={ferryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#b8dc26] hover:bg-[#aed422] text-[#142607] text-[11px] font-black transition-all shadow-xs flex items-center gap-1"
            >
              <Ship size={12} />
              <span>Book Ferry</span>
            </a>
          )}
          {liveTrainUrl && (
            <a
              href={liveTrainUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition-colors flex items-center gap-1"
            >
              <span>Live Tracking</span>
            </a>
          )}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition-colors flex items-center gap-1"
          >
            <Navigation size={11} className="text-emerald-300" />
            <span>Route</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function StopCard({ stop, index, total }: { stop: Stop; index: number; total: number }) {
  const mapsUrl = stop.mapsQuery
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop.mapsQuery)}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${stop.place}, Maharashtra`)}`;

  const contactSearchUrl = stop.mapsQuery
    ? `https://www.google.com/search?q=${encodeURIComponent(`${stop.place} contact phone booking`)}`
    : null;

  const isLast = index === total - 1;

  const typeBadgeColors: Record<Stop["type"], string> = {
    transport: "bg-blue-50 text-blue-800 border-blue-200",
    sightseeing: "bg-amber-50 text-amber-900 border-amber-200",
    food: "bg-orange-50 text-orange-900 border-orange-200",
    stay: "bg-purple-50 text-purple-900 border-purple-200",
    activity: "bg-teal-50 text-teal-900 border-teal-200",
  };

  return (
    <div className="relative flex items-start gap-3.5 group">
      {/* ── Connected Vertical Timeline Track ── */}
      <div className="flex flex-col items-center shrink-0 self-stretch">
        <div className="w-8 h-8 rounded-full bg-white border-2 border-[#2D6A4F] shadow-sm flex items-center justify-center shrink-0 z-10">
          <StopIcon type={stop.type} place={stop.place} />
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-[#2D6A4F] to-[#cadbc7] my-1" />
        )}
      </div>

      {/* ── Content Card (Destination Luxury Card Style) ── */}
      <div className="flex-1 bg-white rounded-2xl p-4 border border-[#d6e2d4] shadow-xs hover:border-[#2D6A4F]/40 transition-all mb-4">
        {/* Top Eyebrow: Time & Category */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
          <div className="flex items-center gap-1.5">
            {stop.time && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#edf3eb] text-[#142607] font-bold text-[11px] border border-[#d6e2d4]">
                <Clock size={11} className="text-[#2D6A4F]" />
                <span>{stop.time}</span>
              </span>
            )}
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                typeBadgeColors[stop.type] || "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              {stop.type}
            </span>
          </div>

          {stop.duration && (
            <span className="text-[11px] text-[#556e5b] font-medium">
              ~{stop.duration}
            </span>
          )}
        </div>

        {/* Place Title */}
        <h4 className="text-sm sm:text-base font-black text-[#0f2416] tracking-tight leading-snug">
          {stop.place}
        </h4>

        {/* Description */}
        {stop.description && (
          <p className="text-[12px] text-[#3d5343] leading-relaxed mt-1.5">
            {stop.description}
          </p>
        )}

        {/* Cost & Action Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-2 mt-3 pt-2.5 border-t border-[#edf3eb]">
          {stop.cost ? (
            <span className="text-xs font-bold text-[#2D6A4F] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
              💰 {stop.cost}
            </span>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {contactSearchUrl && stop.type !== "transport" && (
              <a
                href={contactSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-[#f7faf6] hover:bg-[#edf3eb] text-[#334637] text-xs font-semibold border border-[#d6e2d4] transition-colors flex items-center gap-1"
                title="Search contact details"
              >
                <Phone size={11} className="text-[#556e5b]" />
                <span>Contact</span>
              </a>
            )}

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-lg bg-[#142607] hover:bg-[#1f3a0b] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-95"
            >
              <Navigation size={11} className="text-emerald-400" />
              <span>Directions</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ItineraryModal({
  data,
  onClose,
}: {
  data: ItineraryData;
  onClose: () => void;
}) {
  const [activeDay, setActiveDay] = useState(0);
  const [copied, setCopied] = useState(false);

  const getFormattedItineraryText = () => {
    let text = `🌊 *${data.title}*\n${data.subtitle ? `📍 _${data.subtitle}_\n` : ""}`;
    if (data.totalBudget) text += `💰 *Est. Budget:* ${data.totalBudget}\n`;

    if (data.transportSummary) {
      const t = data.transportSummary;
      text += `\n${t.type === "train" ? "🚂" : t.type === "ferry" ? "⛴️" : "🚗"} *Transport:* ${
        t.name || t.type
      } ${t.number ? `(#${t.number})` : ""}\n`;
      text += `   ${t.from} (${t.departs || "--"}) ➔ ${t.to} (${t.arrives || "--"})\n`;
      if (t.cost) text += `   Fare: ${t.cost}\n`;
    }

    text += `\n━━━━━━━━━━━━━━━━━━━━\n`;

    data.days.forEach((d) => {
      text += `\n📅 *Day ${d.day} — ${d.title}*\n`;
      d.stops.forEach((s) => {
        text += `• ${s.time ? `*${s.time}* ` : ""}${s.place}${s.cost ? ` (💰 ${s.cost})` : ""}\n`;
        if (s.description) text += `  ${s.description}\n`;
      });
    });

    if (data.tips && data.tips.length > 0) {
      text += `\n💡 *Local Konkan Tips:*\n`;
      data.tips.forEach((tip) => {
        text += `• ${tip}\n`;
      });
    }

    text += `\n🌴 Planned via Visit Kokan · https://visitkokan.in`;
    return text;
  };

  const handleWhatsAppShare = () => {
    const text = getFormattedItineraryText();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  const handleCopyPlan = () => {
    const text = getFormattedItineraryText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Itinerary copied to clipboard! 📋");
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDay = data.days[activeDay] || data.days[0];

  // Compute Google Maps multi-stop navigation route for current day
  const stopsList = currentDay.stops
    .map((s) => s.mapsQuery || `${s.place}, Maharashtra`)
    .filter(Boolean);
  const dayNavigationUrl =
    stopsList.length >= 2
      ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
          stopsList[0]
        )}&destination=${encodeURIComponent(stopsList[stopsList.length - 1])}${
          stopsList.length > 2
            ? `&waypoints=${stopsList
                .slice(1, -1)
                .map((w) => encodeURIComponent(w))
                .join("|")}`
            : ""
        }&travelmode=driving`
      : stopsList.length === 1
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stopsList[0])}`
      : null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* ── Frosted Backdrop ── */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* ── Luxury App Canvas Modal (Matching Destination Page styling) ── */}
      <div
        className="relative w-full sm:max-w-xl bg-[#edf3eb] rounded-t-[36px] sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-black/10 z-10"
        style={{ maxHeight: "92vh" }}
      >
        {/* ── 1. Hero Header Banner (Deep Forest Gradient with Gold Accents) ── */}
        <div className="bg-gradient-to-br from-[#102818] via-[#1a4227] to-[#122e1b] text-white p-5 sm:p-6 rounded-b-[28px] shadow-md relative">
          {/* Eyebrow & Close Button */}
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#B7895A]">
              <Sparkles size={12} className="text-[#B7895A]" />
              <span>Visit Kokan Concierge Itinerary</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all text-sm cursor-pointer"
              aria-label="Close Itinerary"
            >
              ✕
            </button>
          </div>

          {/* Title & Subtitle */}
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            {data.title}
          </h2>

          {data.subtitle && (
            <p className="text-xs sm:text-[13px] text-emerald-100/90 font-medium mt-1 leading-snug">
              {data.subtitle}
            </p>
          )}

          {/* Quick Stat Badges */}
          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/15 flex-wrap">
            {data.totalBudget && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-bold">
                <span>💰</span> Est. {data.totalBudget}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-emerald-200 text-xs font-bold">
              <Calendar size={12} />
              <span>
                {data.days.length} {data.days.length === 1 ? "Day Trip" : "Days Expedition"}
              </span>
            </span>

            {/* Header Action Pills */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={handleWhatsAppShare}
                className="px-3 py-1 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-full transition-all shadow-xs flex items-center gap-1 active:scale-95 cursor-pointer"
                title="Share to WhatsApp"
              >
                <Share2 size={12} />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleCopyPlan}
                className="px-2.5 py-1 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                title="Copy itinerary text"
              >
                {copied ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. Sticky Day Tabs Bar ── */}
        <div className="sticky top-0 z-20 bg-[#edf3eb]/95 backdrop-blur-md px-5 py-2.5 border-b border-[#d6e2d4] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none scroll-smooth flex-1 min-w-0">
            {data.days.map((day, idx) => {
              const isActive = activeDay === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveDay(idx)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#142607] text-white shadow-sm"
                      : "bg-white text-[#334637] border border-[#d6e2d4] hover:bg-[#edf3eb]"
                  }`}
                >
                  Day {day.day}
                  <span className={`ml-1.5 text-[10px] ${isActive ? "text-emerald-300" : "text-[#556e5b]"}`}>
                    ({day.stops.length} stops)
                  </span>
                </button>
              );
            })}
          </div>

          {/* Full Day Navigation Button */}
          {dayNavigationUrl && (
            <a
              href={dayNavigationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#142607] hover:bg-[#1f3a0b] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0 active:scale-95"
            >
              <Navigation size={12} className="text-emerald-400" />
              <span>Full Route</span>
            </a>
          )}
        </div>

        {/* ── 3. Scrollable Itinerary Journey Timeline ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
          {/* Day Title Banner */}
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#2D6A4F] mb-3">
            <Calendar size={13} className="text-[#2D6A4F]" />
            <span>
              Day {currentDay.day}: {currentDay.title}
            </span>
          </div>

          {/* Transport Card — Shown at top of Day 1 */}
          {activeDay === 0 && data.transportSummary && (
            <TransportCard data={data.transportSummary} />
          )}

          {/* Stops List as a Connected Timeline */}
          <div className="pt-1">
            {currentDay.stops.map((stop, i) => (
              <StopCard
                key={i}
                stop={stop}
                index={i}
                total={currentDay.stops.length}
              />
            ))}
          </div>

          {/* Local Tips (Shown on the last day) */}
          {activeDay === data.days.length - 1 && data.tips && data.tips.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-[#d6e2d4] shadow-xs mt-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B7895A] mb-2.5">
                <Sparkles size={13} />
                <span>Kokan Mitra Local Recommendations</span>
              </div>
              <div className="space-y-1.5 text-[12px] text-[#3d5343]">
                {data.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[#2D6A4F] font-bold mt-0.5">•</span>
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety & Real-time Info Advisory */}
          <div className="p-3 bg-white/70 rounded-xl border border-[#d6e2d4] text-center mt-4 mb-2">
            <p className="text-[11px] text-[#556e5b]">
              💡 <em>Check local road conditions & timings on arrival. For official assistance, WhatsApp our concierge team at +91 84325 87706.</em>
            </p>
          </div>
        </div>

        {/* ── 4. Bottom Sticky Action Bar ── */}
        <div className="bg-white/95 backdrop-blur-md px-5 py-3 border-t border-[#d6e2d4] flex items-center justify-between gap-3">
          <button
            onClick={handleWhatsAppShare}
            className="flex-1 py-2.5 px-3 bg-[#142607] hover:bg-[#1f3a0b] active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 size={14} className="text-[#25D366]" />
            <span>Forward to WhatsApp</span>
          </button>

          <a
            href="https://www.irctc.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 bg-[#b8dc26] hover:bg-[#aed422] active:scale-[0.98] text-[#142607] font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Ticket size={14} />
            <span>Book Tickets</span>
          </a>
        </div>
      </div>
    </div>
  );
}
