"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  MapPin,
  Sun,
  Calendar,
  Clock,
  Navigation,
  Utensils,
  AlertTriangle,
  Bed,
  Ticket,
  Car,
  Train,
  Ship,
  Info,
  ChevronRight,
  Compass,
  Waves,
  Castle,
  Footprints,
  Camera,
  TreePine,
  Mountain,
  Tent,
  Fish,
  Wind,
  Umbrella,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import WeatherWidget from "./WeatherWidget";
import NearbyListings from "./NearbyListings";

interface DestinationTabsProps {
  dest: any;
  category?: { emoji: string; label: string; value: string } | null;
  season: { short: string; detail: string };
  mapsUrl: string;
}

function HighlightIcon({ text }: { text: string }) {
  const t = text.toLowerCase();
  if (t.includes("beach") || t.includes("shore") || t.includes("coast") || t.includes("sand"))
    return <Waves size={15} className="text-[#1b4329]" />;
  if (t.includes("fort") || t.includes("castle") || t.includes("histor") || t.includes("temple"))
    return <Castle size={15} className="text-[#1b4329]" />;
  if (t.includes("trek") || t.includes("hike") || t.includes("walk") || t.includes("trail"))
    return <Footprints size={15} className="text-[#1b4329]" />;
  if (t.includes("view") || t.includes("sunset") || t.includes("scenic") || t.includes("photo"))
    return <Camera size={15} className="text-[#1b4329]" />;
  if (t.includes("forest") || t.includes("nature") || t.includes("green") || t.includes("grove"))
    return <TreePine size={15} className="text-[#1b4329]" />;
  if (t.includes("mountain") || t.includes("hill") || t.includes("peak") || t.includes("cliff"))
    return <Mountain size={15} className="text-[#1b4329]" />;
  if (t.includes("boat") || t.includes("ferry") || t.includes("cruise") || t.includes("backwater"))
    return <Ship size={15} className="text-[#1b4329]" />;
  if (t.includes("camp") || t.includes("stay") || t.includes("night") || t.includes("resort"))
    return <Tent size={15} className="text-[#1b4329]" />;
  if (t.includes("fish") || t.includes("seafood") || t.includes("scuba") || t.includes("snorkel") || t.includes("coral"))
    return <Fish size={15} className="text-[#1b4329]" />;
  if (t.includes("wind") || t.includes("breeze") || t.includes("air"))
    return <Wind size={15} className="text-[#1b4329]" />;
  if (t.includes("rain") || t.includes("monsoon") || t.includes("waterfall") || t.includes("water"))
    return <Umbrella size={15} className="text-[#1b4329]" />;
  return <Compass size={15} className="text-[#1b4329]" />;
}

export default function DestinationTabs({
  dest,
  category,
  season,
  mapsUrl,
}: DestinationTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("section-overview");
  const isClickingRef = useRef(false);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const tabContainerRef = useRef<HTMLDivElement | null>(null);

  // Tab definitions inspired by Flipkart product specs & details navigation
  const tabs = [
    { id: "section-overview", label: "Overview" },
    { id: "section-specs", label: "Specifications" },
    { id: "section-activities", label: "To-Do & Food" },
    { id: "section-transit", label: "How to Reach" },
    ...(dest.warnings && dest.warnings.length > 0
      ? [{ id: "section-advisory", label: "Advisory" }]
      : []),
    { id: "section-stays", label: "Stays & Nearby" },
  ];

  // Auto-scroll active tab into horizontal view so it never gets cut off
  const ensureTabVisible = (tabId: string) => {
    const btn = tabRefs.current[tabId];
    if (btn && tabContainerRef.current) {
      btn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  // ScrollSpy: observe sections as user scrolls vertically
  useEffect(() => {
    const handleScroll = () => {
      if (isClickingRef.current) return;
      const scrollPosition = window.scrollY + 140;

      for (let i = tabs.length - 1; i >= 0; i--) {
        const el = document.getElementById(tabs[i].id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            if (activeTab !== tabs[i].id) {
              setActiveTab(tabs[i].id);
              ensureTabVisible(tabs[i].id);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab, tabs]);

  const scrollToSection = (id: string) => {
    isClickingRef.current = true;
    setActiveTab(id);
    ensureTabVisible(id);

    const element = document.getElementById(id);
    if (element) {
      const stickyBarOffset = 64; // Height of sticky bar + small buffer
      const y =
        element.getBoundingClientRect().top +
        window.pageYOffset -
        stickyBarOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    setTimeout(() => {
      isClickingRef.current = false;
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* ── Flipkart-Style Sticky Pill Tabs Bar ── */}
      {/* Sticks cleanly beneath header, full horizontal scroll without awkward cutoffs */}
      <div className="sticky top-0 z-30 bg-[#edf3eb]/95 backdrop-blur-md py-2.5 -mx-5 px-5 border-b border-[#d6e2d4]/80 shadow-xs">
        <div
          ref={tabContainerRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none scroll-smooth pb-0.5"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                onClick={() => scrollToSection(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#142607] text-white shadow-sm"
                    : "bg-white text-[#334637] border border-[#d6e2d4] hover:bg-[#edf3eb]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 1. SECTION: OVERVIEW (Flipkart "Description" Box) ── */}
      <section id="section-overview" className="scroll-mt-20 space-y-3.5">
        {dest.description && (
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#d6e2d4] shadow-xs">
            <h2 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] mb-2 flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#B7895A]" /> About {dest.name}
            </h2>
            <p className="text-[13px] text-[#3d5343] leading-relaxed">
              {dest.description}
            </p>
          </div>
        )}
      </section>

      {/* ── 2. SECTION: SPECIFICATIONS & DETAILS (Flipkart 2-Column Specs Table) ── */}
      <section id="section-specs" className="scroll-mt-20 space-y-3.5">
        <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#d6e2d4] shadow-xs">
          <h2 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] mb-3 flex items-center gap-1.5">
            <Info size={13} className="text-[#2D6A4F]" /> Key Details & Specifications
          </h2>
          <div className="divide-y divide-[#edf3eb] text-xs">
            {/* Region */}
            <div className="py-2.5 flex items-start justify-between gap-3">
              <span className="text-[#68826e] font-medium w-28 shrink-0 flex items-center gap-1.5">
                <MapPin size={13} className="text-[#2D6A4F]" /> Region
              </span>
              <span className="font-semibold text-[#102416] text-right">
                {dest.region}, Konkan (MH)
              </span>
            </div>

            {/* Category */}
            {category && (
              <div className="py-2.5 flex items-start justify-between gap-3">
                <span className="text-[#68826e] font-medium w-28 shrink-0 flex items-center gap-1.5">
                  <Compass size={13} className="text-[#2D6A4F]" /> Category
                </span>
                <span className="font-semibold text-[#102416] text-right">
                  {category.emoji} {category.label}
                </span>
              </div>
            )}

            {/* Best Season */}
            <div className="py-2.5 flex items-start justify-between gap-3">
              <span className="text-[#68826e] font-medium w-28 shrink-0 flex items-center gap-1.5">
                <Sun size={13} className="text-[#2D6A4F]" /> Best Season
              </span>
              <div className="text-right">
                <span className="font-semibold text-[#102416] block">{season.short}</span>
                {season.detail && (
                  <span className="text-[11px] text-[#5c7762] block mt-0.5 line-clamp-2">
                    {season.detail}
                  </span>
                )}
              </div>
            </div>

            {/* Ideal Duration */}
            <div className="py-2.5 flex items-start justify-between gap-3">
              <span className="text-[#68826e] font-medium w-28 shrink-0 flex items-center gap-1.5">
                <Calendar size={13} className="text-[#2D6A4F]" /> Ideal Stay
              </span>
              <span className="font-semibold text-[#102416] text-right">
                2–3 Days Trip
              </span>
            </div>

            {/* Timings */}
            {dest.timings && (
              <div className="py-2.5 flex items-start justify-between gap-3">
                <span className="text-[#68826e] font-medium w-28 shrink-0 flex items-center gap-1.5">
                  <Clock size={13} className="text-[#2D6A4F]" /> Timings
                </span>
                <span className="font-semibold text-[#102416] text-right">
                  {dest.timings}
                </span>
              </div>
            )}

            {/* Entry / Fee */}
            {dest.entryFee && (
              <div className="py-2.5 flex items-start justify-between gap-3">
                <span className="text-[#68826e] font-medium w-28 shrink-0 flex items-center gap-1.5">
                  <Ticket size={13} className="text-[#2D6A4F]" /> Entry / Fee
                </span>
                <span className="font-semibold text-[#102416] text-right max-w-[200px]">
                  {dest.entryFee}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Top Highlights (Compact cards carousel) */}
        {dest.highlights && dest.highlights.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#4d6b53]">
                Top Highlights
              </span>
              <span className="text-[10px] text-[#69846f]">Scroll →</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {dest.highlights.map((h: string, idx: number) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-2.5 flex flex-col justify-between min-w-[130px] h-[78px] border border-[#d6e2d4] shadow-2xs shrink-0 hover:bg-[#f6faf5] transition-colors"
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

        {/* Tags */}
        {dest.tags && dest.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-0.5">
            {dest.tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-white rounded-full text-[11px] font-semibold text-[#2f4a36] border border-[#d6e2d4]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ── 3. SECTION: TO-DO & FOOD (Compact List Blocks) ── */}
      <section id="section-activities" className="scroll-mt-20 space-y-3.5">
        {/* Things to Do */}
        {dest.thingsToDo && dest.thingsToDo.length > 0 && (
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#d6e2d4] shadow-xs">
            <h2 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] mb-3 flex items-center gap-1.5">
              <Compass size={13} className="text-[#2D6A4F]" /> Top Things to Do
            </h2>
            <div className="space-y-2">
              {dest.thingsToDo.map((todo: string, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 bg-[#f8faf7] rounded-xl border border-[#e2eae0] flex items-start gap-2.5"
                >
                  <div className="w-5 h-5 rounded-full bg-[#dce7da] text-[#142e1b] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="text-xs text-[#334637] leading-relaxed font-medium">
                    {todo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Local Food to Try */}
        {dest.foodToTry && dest.foodToTry.length > 0 && (
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#d6e2d4] shadow-xs">
            <h2 className="text-xs font-bold tracking-wider uppercase text-[#B7895A] mb-3 flex items-center gap-1.5">
              <Utensils size={13} className="text-[#B7895A]" /> Authentic Food to Taste
            </h2>
            <div className="space-y-2">
              {dest.foodToTry.map((food: string, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 bg-[#fcf9f5] rounded-xl border border-[#efe6dc] text-xs text-[#423326] leading-relaxed flex items-start gap-2.5"
                >
                  <span className="text-sm">🍽️</span>
                  <span className="font-medium text-[#2d2116]">{food}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── 4. SECTION: HOW TO REACH & MAP ── */}
      <section id="section-transit" className="scroll-mt-20 space-y-3.5">
        {dest.howToReach && (
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#d6e2d4] shadow-xs space-y-3">
            <h2 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] flex items-center gap-1.5">
              <Navigation size={13} className="text-[#2D6A4F]" /> How to Reach
            </h2>
            {typeof dest.howToReach === "string" ? (
              <p className="text-[13px] text-[#3d5343] leading-relaxed">
                {dest.howToReach}
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                {dest.howToReach.byRoad && (
                  <div className="p-2.5 bg-[#f8faf7] rounded-xl border border-[#e2eae0] flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#dce7da] flex items-center justify-center shrink-0 mt-0.5">
                      <Car size={13} className="text-[#2D6A4F]" />
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-[#142e1b] block mb-0.5">By Road</span>
                      <p className="text-[#3d5343] leading-relaxed">{dest.howToReach.byRoad}</p>
                    </div>
                  </div>
                )}
                {dest.howToReach.byTrain && (
                  <div className="p-2.5 bg-[#f8faf7] rounded-xl border border-[#e2eae0] flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#dce7da] flex items-center justify-center shrink-0 mt-0.5">
                      <Train size={13} className="text-[#2D6A4F]" />
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-[#142e1b] block mb-0.5">By Train</span>
                      <p className="text-[#3d5343] leading-relaxed">{dest.howToReach.byTrain}</p>
                    </div>
                  </div>
                )}
                {dest.howToReach.byFerry && (
                  <div className="p-2.5 bg-[#f8faf7] rounded-xl border border-[#e2eae0] flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#dce7da] flex items-center justify-center shrink-0 mt-0.5">
                      <Ship size={13} className="text-[#2D6A4F]" />
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-[#142e1b] block mb-0.5">By Ferry</span>
                      <p className="text-[#3d5343] leading-relaxed">{dest.howToReach.byFerry}</p>
                    </div>
                  </div>
                )}
                {dest.howToReach.tip && (
                  <div className="p-2.5 bg-[#fefce8] rounded-xl border border-[#fef08a] flex items-start gap-2">
                    <Info size={13} className="text-[#a16207] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#713f12] leading-snug">
                      <span className="font-bold">Insider Tip: </span>
                      {dest.howToReach.tip}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Google Maps Location Card */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#d6e2d4] shadow-xs active:scale-[0.98] transition-transform group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#dce7da] flex items-center justify-center shrink-0">
            <MapPin size={16} className="text-[#2D6A4F]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#102416] truncate">{dest.name}</p>
            <p className="text-[11px] text-[#526b58]">{dest.region}, Maharashtra</p>
            <p className="text-[11px] font-bold text-[#2D6A4F] mt-0.5 group-hover:underline flex items-center gap-1">
              Open in Google Maps <ChevronRight size={11} />
            </p>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#edf3eb] flex items-center justify-center shrink-0 group-hover:bg-[#dce7da] transition-colors">
            <ChevronRight size={13} className="text-[#2D6A4F]" />
          </div>
        </a>
      </section>

      {/* ── 5. SECTION: IMPORTANT TRAVELER ADVISORY (Compact Flipkart Alert Box) ── */}
      {dest.warnings && dest.warnings.length > 0 && (
        <section id="section-advisory" className="scroll-mt-20">
          <div className="bg-[#fffbeb] rounded-xl p-3 sm:p-3.5 border border-[#fed7aa] shadow-xs">
            <h2 className="text-xs font-bold tracking-wider uppercase text-[#c2410c] mb-2 flex items-center gap-1.5">
              <AlertTriangle size={13} className="text-[#ea580c]" /> Important Traveler Advisory
            </h2>
            <ul className="space-y-1.5">
              {dest.warnings.map((warning: string, idx: number) => (
                <li
                  key={idx}
                  className="text-xs text-[#7c2d12] flex items-start gap-2 leading-relaxed"
                >
                  <span className="text-[#ea580c] font-black text-xs leading-none mt-0.5">
                    •
                  </span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── 6. SECTION: STAYS & NEARBY PLACES (Flipkart "Similar" Style) ── */}
      <section id="section-stays" className="scroll-mt-20 space-y-3.5">
        {/* Where to Stay */}
        {dest.stayOptions && (
          <div className="bg-white rounded-xl p-3.5 border border-[#d6e2d4] shadow-xs">
            <h2 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] mb-1.5 flex items-center gap-1.5">
              <Bed size={13} className="text-[#2D6A4F]" /> Stay Options
            </h2>
            <p className="text-xs text-[#3d5343] leading-relaxed">
              {dest.stayOptions}
            </p>
          </div>
        )}

        {/* Nearby Places to Visit */}
        {dest.nearbyPlaces && dest.nearbyPlaces.length > 0 && (
          <div className="bg-white rounded-xl p-3.5 border border-[#d6e2d4] shadow-xs">
            <h2 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] mb-2.5 flex items-center gap-1.5">
              <Compass size={13} className="text-[#2D6A4F]" /> Nearby Places to Visit
            </h2>
            <div className="space-y-2">
              {dest.nearbyPlaces.map((place: any, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 bg-[#f8faf7] rounded-xl border border-[#e0e9df] flex items-start justify-between gap-2.5"
                >
                  <div>
                    <p className="text-xs font-bold text-[#142e1b]">{place.name}</p>
                    <p className="text-[11px] text-[#556e5a] mt-0.5 leading-snug">{place.why}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-white text-[#2D6A4F] font-bold text-[10px] rounded-md border border-[#d6e2d4] shrink-0">
                    {place.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weather Widget */}
        <WeatherWidget region={dest.region} bestSeason={season.short} />

        {/* Nearby Stays & Experiences (Flipkart Horizontal Cards Carousel) */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#102416]">
              Nearby Stays & Experiences
            </h2>
            <span className="text-[10px] text-[#69846f]">Scroll →</span>
          </div>
          <NearbyListings region={dest.region} currentSlug={dest.slug} />
        </div>
      </section>
    </div>
  );
}
