"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin, Sun, Navigation, Sparkles,
  ChevronRight, Compass, TreePine, Waves,
  Mountain, Tent, Camera, Footprints,
  Wind, Umbrella, Castle, Calendar, Clock,
  Package, Ruler, Users, Check, Flag,
  ShieldCheck, Bus, Utensils, MessageCircle,
  HelpCircle, AlertCircle
} from "lucide-react";
import { Trek } from "@/types/trek";
import WeatherWidget from "@/components/destination/WeatherWidget";
import NearbyListings from "@/components/destination/NearbyListings";
import TrekHeroCarousel from "@/components/trek/TrekHeroCarousel";
import TrekStickyBar from "@/components/trek/TrekStickyBar";
import TrekBookingWidget from "@/components/trek/TrekBookingWidget";
import DurgTrekGuide from "@/components/trek/DurgTrekGuide";

interface Props {
  trek: Trek;
  category?: { emoji: string; label: string; value: string } | null;
  difficultyInfo?: { label: string; value: string; color: string } | null;
  allImages: string[];
  mapsUrl: string;
}

function HighlightIcon({ text }: { text: string }) {
  const t = text.toLowerCase();
  if (t.includes("fort") || t.includes("ruin") || t.includes("castle") || t.includes("histor") || t.includes("temple"))
    return <Castle size={20} className="text-[#173722]" />;
  if (t.includes("view") || t.includes("sunset") || t.includes("sunrise") || t.includes("scenic") || t.includes("photo") || t.includes("point"))
    return <Camera size={20} className="text-[#173722]" />;
  if (t.includes("forest") || t.includes("nature") || t.includes("green") || t.includes("grove") || t.includes("jungle") || t.includes("tree"))
    return <TreePine size={20} className="text-[#173722]" />;
  if (t.includes("mountain") || t.includes("hill") || t.includes("peak") || t.includes("cliff") || t.includes("summit") || t.includes("ridge") || t.includes("climb"))
    return <Mountain size={20} className="text-[#173722]" />;
  if (t.includes("camp") || t.includes("stay") || t.includes("night") || t.includes("star") || t.includes("tent") || t.includes("village"))
    return <Tent size={20} className="text-[#173722]" />;
  if (t.includes("waterfall") || t.includes("stream") || t.includes("river") || t.includes("rain") || t.includes("monsoon") || t.includes("water"))
    return <Umbrella size={20} className="text-[#173722]" />;
  if (t.includes("beach") || t.includes("sea") || t.includes("coast") || t.includes("sand") || t.includes("ocean"))
    return <Waves size={20} className="text-[#173722]" />;
  if (t.includes("wind") || t.includes("breeze") || t.includes("air"))
    return <Wind size={20} className="text-[#173722]" />;
  if (t.includes("walk") || t.includes("trail") || t.includes("hike") || t.includes("step"))
    return <Footprints size={20} className="text-[#173722]" />;
  return <Compass size={20} className="text-[#173722]" />;
}

export default function TrekDetailClientView({
  trek,
  category,
  difficultyInfo,
  allImages,
  mapsUrl
}: Props) {
  const [mobileTab, setMobileTab] = useState<"guide" | "booking">("guide");

  // Listen to open-trek-booking custom event from Sticky Bar
  useEffect(() => {
    const handleOpenBooking = () => {
      setMobileTab("booking");
      setTimeout(() => {
        const el = document.getElementById("booking-card-panel") || document.getElementById("booking-section");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    };

    window.addEventListener("open-trek-booking", handleOpenBooking);
    return () => window.removeEventListener("open-trek-booking", handleOpenBooking);
  }, []);

  const whatsappInquiryUrl = `https://wa.me/918432587706?text=${encodeURIComponent(
    `Hello Visit Kokan! I have questions regarding the "${trek.name}" trek expedition (₹1,499).`
  )}`;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-6 pb-32">
      {/* ── MOBILE SEGMENTED MODE SWITCHER (< lg screens) ── */}
      <div className="lg:hidden sticky top-2 z-30 mb-4 p-1.5 bg-[#edf3eb]/95 backdrop-blur-md rounded-2xl border border-[#cadbc7] shadow-md flex gap-2">
        <button
          type="button"
          onClick={() => setMobileTab("guide")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === "guide"
              ? "bg-[#1E4D38] text-white shadow-sm"
              : "text-[#2c4031] hover:bg-white/60"
          }`}
        >
          <Castle size={14} />
          <span>Fort Guide &amp; Routes</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("booking")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === "booking"
              ? "bg-[#1E4D38] text-white shadow-sm"
              : "text-[#2c4031] hover:bg-white/60"
          }`}
        >
          <Calendar size={14} />
          <span>Book Expedition (₹1,499)</span>
        </button>
      </div>

      {/* ── RESPONSIVE DUAL-COLUMN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ══════════════════════════════════════════════════════════════════════
            LEFT COLUMN (7 cols on lg): COMPREHENSIVE FORT & TRAIL GUIDE
            "For those who want information get it"
           ══════════════════════════════════════════════════════════════════════ */}
        <div className={`lg:col-span-7 xl:col-span-8 space-y-6 ${mobileTab === "booking" ? "hidden lg:block" : "block"}`}>
          
          {/* Hero Carousel with authentic fort photography */}
          <div className="rounded-3xl sm:rounded-[36px] overflow-hidden shadow-lg border border-[#cadbc7]/70 bg-white">
            <TrekHeroCarousel
              images={allImages}
              name={trek.name}
              backHref="/treks"
              category={category}
              difficulty={trek.difficulty}
              region={trek.region}
              slug={trek.slug}
            />
          </div>

          {/* Fort Title & Key Specs Header */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cadbc7] shadow-sm">
            <div className="flex items-center gap-1.5 text-[#1f422b] text-[11px] font-extrabold tracking-[0.2em] uppercase mb-1.5">
              <Mountain size={14} className="text-[#2D6A4F]" />
              <span>
                {trek.region} {category ? `· ${category.label}` : ""} {trek.difficulty ? `· ${trek.difficulty.toUpperCase()}` : ""}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#0f2416] tracking-tight leading-tight">
              {trek.name}
            </h1>

            {/* Quick Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-3 scrollbar-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#edf3eb] rounded-full text-xs font-bold text-[#142e1b] border border-[#d6e2d4] shrink-0">
                <MapPin size={13} className="text-[#2D6A4F]" /> {trek.region}, MH
              </span>
              {trek.duration && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#edf3eb] rounded-full text-xs font-bold text-[#142e1b] border border-[#d6e2d4] shrink-0">
                  <Clock size={13} className="text-[#2D6A4F]" /> {trek.duration}
                </span>
              )}
              {trek.distance && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#edf3eb] rounded-full text-xs font-bold text-[#142e1b] border border-[#d6e2d4] shrink-0">
                  <Ruler size={13} className="text-[#2D6A4F]" /> {trek.distance}
                </span>
              )}
              {trek.maxAltitude && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#edf3eb] rounded-full text-xs font-bold text-[#142e1b] border border-[#d6e2d4] shrink-0">
                  <Mountain size={13} className="text-[#2D6A4F]" /> {trek.maxAltitude}
                </span>
              )}
            </div>

            {/* Highlights horizontal list */}
            {trek.highlights && trek.highlights.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#edf3eb]">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#2D6A4F] mb-2.5">
                  Trail Highlights
                </p>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                  {trek.highlights.map((h: string, idx: number) => (
                    <div
                      key={idx}
                      className="bg-[#dce7da] rounded-2xl p-3 flex flex-col justify-between min-w-[120px] max-w-[180px] h-[86px] border border-[#cadbc7] shadow-2xs shrink-0"
                    >
                      <HighlightIcon text={h} />
                      <span className="text-[11px] font-bold text-[#142e1b] line-clamp-2 leading-tight">
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── DURG APP STYLE GUIDE (Multiple Base Villages, History, How to Reach, Attractions) ── */}
          <DurgTrekGuide trek={trek} />

          {/* Day-by-Day Expedition Itinerary */}
          {trek.itinerary && trek.itinerary.length > 0 && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cadbc7] shadow-sm">
              <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#2D6A4F] mb-4 flex items-center gap-1.5">
                <Calendar size={14} className="text-[#2D6A4F]" /> Full Expedition Schedule
              </h3>
              <div className="space-y-4">
                {trek.itinerary.map((day, i) => (
                  <div key={i} className="flex gap-3.5">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#1b3d26] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                        {day.day}
                      </div>
                      {i < trek.itinerary.length - 1 && (
                        <div className="w-0.5 bg-[#d6e2d4] flex-1 mt-1.5" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <h4 className="text-sm font-bold text-[#102416]">{day.title}</h4>
                      <p className="text-[13px] text-[#3d5343] mt-1 leading-relaxed whitespace-pre-line">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What to Bring Checklist */}
          {trek.thingsToBring && trek.thingsToBring.length > 0 && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cadbc7] shadow-sm">
              <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#2D6A4F] mb-3 flex items-center gap-1.5">
                <Package size={14} className="text-[#2D6A4F]" /> Packing &amp; Gear Checklist
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {trek.thingsToBring.map((item: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 bg-[#edf3eb] rounded-xl text-xs font-semibold text-[#142e1b] border border-[#dce7da]"
                  >
                    <Check size={14} className="text-[#2D6A4F] shrink-0 stroke-[2.5]" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Google Maps Location Card */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 p-4 bg-white rounded-3xl border border-[#cadbc7] shadow-sm active:scale-[0.99] transition-transform group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#dce7da] flex items-center justify-center shrink-0">
              <MapPin size={22} className="text-[#2D6A4F]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#102416] truncate">{trek.startPoint || trek.name}</p>
              <p className="text-xs text-[#526b58]">{trek.region}, Maharashtra</p>
              <p className="text-xs font-bold text-[#2D6A4F] mt-1 group-hover:underline flex items-center gap-1">
                Open Trail Location in Google Maps <ChevronRight size={13} />
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#edf3eb] flex items-center justify-center shrink-0 group-hover:bg-[#dce7da] transition-colors">
              <ChevronRight size={16} className="text-[#2D6A4F]" />
            </div>
          </a>

          {/* Regional Weather Widget */}
          <WeatherWidget region={trek.region} bestSeason={trek.bestSeason} />

          {/* Nearby Stays in Region */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-[#102416] mb-3">
              Nearby Stays &amp; Homestays in {trek.region}
            </h3>
            <NearbyListings region={trek.region} currentSlug={trek.slug} />
          </div>

          {/* Mobile "Switch to Booking" banner at the end of the guide */}
          <div className="lg:hidden p-5 bg-gradient-to-r from-[#173722] to-[#2D6A4F] text-white rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 block">
                Ready for the Summit?
              </span>
              <h4 className="text-base font-black mt-0.5">
                Join our 10:00 PM Mumbai Weekend Batch
              </h4>
              <p className="text-xs text-white/80 mt-0.5">
                All-inclusive expedition for just ₹1,499 per person (₹750 advance).
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileTab("booking");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-6 py-3 bg-[#b8dc26] hover:bg-[#aed422] text-[#142607] font-black text-xs rounded-full shadow-md transition-all shrink-0 cursor-pointer text-center"
            >
              Book Expedition Now →
            </button>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            RIGHT COLUMN (5 cols on lg, sticky): DEDICATED EXPEDITION BOOKING PANEL
            "Make booking panel completely different with earlier content"
           ══════════════════════════════════════════════════════════════════════ */}
        <div
          id="booking-card-panel"
          className={`lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-4 ${
            mobileTab === "guide" ? "hidden lg:block" : "block"
          }`}
        >
          {/* Main Booking Card */}
          <div className="bg-white rounded-3xl border-2 border-[#2D6A4F]/25 shadow-xl overflow-hidden">
            
            {/* Top Emerald Header Banner */}
            <div className="bg-gradient-to-br from-[#122c1b] via-[#1a442a] to-[#245838] p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-400/30">
                  Weekend 1D 1N Trek
                </span>
                <span className="text-[11px] font-bold text-emerald-200 flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-300" /> Kokan Verified
                </span>
              </div>

              <h2 className="text-xl font-black tracking-tight leading-tight">
                {trek.name} Expedition
              </h2>

              <p className="text-xs text-emerald-100/80 mt-1 flex items-center gap-1.5">
                <Clock size={12} className="text-emerald-300" />
                <span>Departs Mumbai at <strong>10:00 PM Every Saturday</strong></span>
              </p>

              {/* Price Banner */}
              <div className="mt-4 p-3 bg-black/25 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-white/70 block">
                    Expedition Fare
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-[#b8dc26]">
                      ₹{trek.price?.toLocaleString("en-IN") ?? "1,499"}
                    </span>
                    <span className="text-xs text-white/70 font-medium">/person</span>
                  </div>
                </div>

                <div className="text-right border-l border-white/15 pl-4">
                  <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                    Advance to Reserve
                  </span>
                  <span className="text-base font-black text-white mt-0.5 block">
                    ₹{trek.advanceAmount?.toLocaleString("en-IN") ?? "750"}
                  </span>
                </div>
              </div>
            </div>

            {/* Inclusions & Pickup Summary */}
            <div className="p-4 bg-[#f8faf7] border-b border-[#e2ede0] space-y-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-[#2D6A4F] mb-1.5 flex items-center gap-1.5">
                  <Bus size={13} /> Mumbai 10:00 PM Pickups
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#2c4031] font-semibold">
                  <span className="truncate">📍 Borivali (NP): 10:00 PM</span>
                  <span className="truncate">📍 Andheri: 10:25 PM</span>
                  <span className="truncate">📍 Sion Circle: 10:50 PM</span>
                  <span className="truncate">📍 Chembur: 11:10 PM</span>
                  <span className="truncate">📍 Vashi Toll: 11:35 PM</span>
                  <span className="truncate">📍 Panvel Circle: 11:55 PM</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#cadbc7]/60">
                <p className="text-[11px] font-black uppercase tracking-wider text-[#2D6A4F] mb-1.5 flex items-center gap-1.5">
                  <Utensils size={13} /> Expedition Inclusions
                </p>
                <div className="space-y-1 text-[11px] text-[#3d5343] font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check size={12} className="text-[#2D6A4F] shrink-0" />
                    <span>Private AC Bus (Mumbai ➔ Base ➔ Mumbai)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check size={12} className="text-[#2D6A4F] shrink-0" />
                    <span>Morning Breakfast &amp; Hot Masala Chai</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check size={12} className="text-[#2D6A4F] shrink-0" />
                    <span>Traditional Maharashtrian Village Feast Lunch</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check size={12} className="text-[#2D6A4F] shrink-0" />
                    <span>Certified Trek Leaders &amp; Emergency First Aid</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check size={12} className="text-[#2D6A4F] shrink-0" />
                    <span>Forest Dept &amp; Fort Entry Permits</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Interactive Booking Form */}
            <div id="booking-section" className="p-4 sm:p-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#102416] mb-3">
                Select Date &amp; Reserve Slots
              </h3>
              
              <TrekBookingWidget
                trekId={trek.id}
                trekName={trek.name}
                trekSlug={trek.slug}
                pricePerPerson={trek.price ?? 1499}
                maxCapacity={20}
                advanceAmount={trek.advanceAmount ?? 750}
                whatsappGroupLink={trek.whatsappGroupLink}
                scheduledDate={trek.scheduledDate ?? undefined}
                hideStickyBar={true}
              />
            </div>
          </div>

          {/* Quick Help & WhatsApp Lead Connect Card */}
          <div className="bg-white rounded-2xl p-4 border border-[#cadbc7] shadow-xs flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#0f2416]">Have Questions?</p>
              <p className="text-[11px] text-[#526b58]">Chat directly with our trek lead</p>
            </div>
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1f4e38] text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <MessageCircle size={14} className="text-emerald-600" />
              <span>WhatsApp Lead</span>
            </a>
          </div>

        </div>

      </div>

      {/* ── STICKY BOTTOM ACTION BAR (Smooth trigger for booking on mobile & desktop) ── */}
      <TrekStickyBar
        price={trek.price ?? 1499}
        scheduledDate={trek.scheduledDate}
        whatsappGroupLink={trek.whatsappGroupLink}
        trekName={trek.name}
      />
    </div>
  );
}
