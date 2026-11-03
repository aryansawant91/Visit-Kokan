"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Sun,
  Calendar,
  Clock,
  Navigation,
  Utensils,
  AlertTriangle,
  Car,
  Train,
  Bus,
  Footprints,
  Camera,
  TreePine,
  Mountain,
  Tent,
  Wind,
  Umbrella,
  Castle,
  CheckCircle2,
  Package,
  Layers,
  Flag,
  ShieldCheck,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Ruler
} from "lucide-react";
import { Trek, BaseVillageInfo } from "@/types/trek";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useMarathiReader } from "@/hooks/useMarathiReader";
import TrekEnquiryWidget from "@/components/trek/TrekEnquiryWidget";

interface TrekTabsProps {
  trek: Trek;
  category?: { emoji: string; label: string; value: string } | null;
  difficultyInfo?: { label: string; value: string; color?: string } | null;
  mapsUrl: string;
}

export default function TrekTabs({
  trek,
  category,
  difficultyInfo,
  mapsUrl,
}: TrekTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("section-trail");
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [selectedVillageIndex, setSelectedVillageIndex] = useState(0);

  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const isClickingRef = useRef(false);

  // Normalize base villages
  const baseVillages: BaseVillageInfo[] =
    trek.baseVillages && trek.baseVillages.length > 0
      ? trek.baseVillages
      : [
          {
            name: trek.baseVillage || trek.startPoint || "Velhe, Pune",
            marathiName: "वेल्हे (मुख्य पायथा गाव)",
            isPrimary: true,
            difficulty: trek.difficulty || "Moderate",
            distanceFromBase: trek.distance || "5.2 km",
            trailDuration: trek.duration || "3 - 4 Hours",
            popularFor: "Main scenic historic ascent to the citadel",
            routeDescription: `Starting point for ${trek.name}. The trail ascends via the main historic path with marked stone stairs and scenic viewpoints.`,
            coordinates: trek.coordinates || { lat: 18.2758, lng: 73.6231 },
          },
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
    `${trek.name} Sahyadri Fort Expedition Guide`
  );

  const tabs = useMemo(
    () => [
      { id: "section-trail", label: "Trail Guide" },
      { id: "section-citadel", label: "Fort Citadel" },
      { id: "section-reach", label: "How to Reach" },
      { id: "section-food", label: "Food & Stay" },
      { id: "section-season", label: "Season & Gear" },
      { id: "section-enquire", label: "Enquire / Batches" },
    ],
    []
  );

  const ensureTabVisible = (id: string) => {
    const btn = tabRefs.current[id];
    const container = tabContainerRef.current;
    if (!btn || !container) return;

    const btnLeft = btn.offsetLeft;
    const btnRight = btnLeft + btn.offsetWidth;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.offsetWidth;

    if (btnLeft < scrollLeft + 30) {
      container.scrollTo({ left: Math.max(0, btnLeft - 30), behavior: "smooth" });
    } else if (btnRight > scrollLeft + containerWidth - 30) {
      container.scrollTo({
        left: btnRight - containerWidth + 30,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isClickingRef.current) return;
      const scrollY = window.pageYOffset;
      const headerOffset = 120;

      for (let i = tabs.length - 1; i >= 0; i--) {
        const sectionId = tabs[i].id;
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.getBoundingClientRect().top + scrollY - headerOffset;
          if (scrollY >= top - 20) {
            if (activeTab !== sectionId) {
              setActiveTab(sectionId);
              ensureTabVisible(sectionId);
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
      const stickyBarOffset = 64;
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

  const navUrl = currentVillage.coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${currentVillage.coordinates.lat},${currentVillage.coordinates.lng}`
    : mapsUrl;

  const elevation = trek.elevation || trek.maxAltitude || "1,403 m (4,603 ft)";

  return (
    <div className="space-y-4">
      {/* ── Sticky Pill Tabs Bar with Language Switcher ── */}
      <div className="sticky top-0 z-30 bg-[#edf3eb]/95 backdrop-blur-md py-2.5 -mx-5 px-5 border-b border-[#d6e2d4]/80 shadow-xs flex items-center justify-between gap-2">
        <div
          ref={tabContainerRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none scroll-smooth pb-0.5 flex-1 min-w-0"
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
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
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

        {/* Marathi Reader Switch */}
        <LanguageToggle
          variant="compact"
          isMarathi={isMarathi}
          onToggle={toggleLanguage}
          loading={translating}
          className="shrink-0"
        />
      </div>

      {/* ── 1. SECTION: TRAIL GUIDE ── */}
      <section id="section-trail" className="scroll-mt-20 space-y-3.5">
        {isMarathi && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold">
            <span>🚩</span>
            <span>माहिती शुद्ध मराठीत वाचत आहात (Reading in Marathi)</span>
          </div>
        )}

        {/* Trail Metrics Box */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#d6e2d4] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] flex items-center gap-1.5">
              <Mountain size={14} className="text-[#2D6A4F]" />
              <span>{isMarathi ? "ट्रेक आणि पायवाट तपशील" : "Trail Overview & Metrics"}</span>
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {difficultyInfo?.label || trek.difficulty || "Moderate"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 mb-4">
            <div className="bg-[#f7faf6] rounded-xl p-2.5 border border-[#e1ece0]">
              <span className="text-[10px] text-[#556e5b] font-medium block">Elevation</span>
              <span className="text-xs font-black text-[#142607]">{elevation}</span>
            </div>
            <div className="bg-[#f7faf6] rounded-xl p-2.5 border border-[#e1ece0]">
              <span className="text-[10px] text-[#556e5b] font-medium block">Trail Distance</span>
              <span className="text-xs font-black text-[#142607]">{trek.distance || currentVillage.distanceFromBase || "5.2 km"}</span>
            </div>
            <div className="bg-[#f7faf6] rounded-xl p-2.5 border border-[#e1ece0]">
              <span className="text-[10px] text-[#556e5b] font-medium block">Duration</span>
              <span className="text-xs font-black text-[#142607]">{trek.duration || "1 Day (3-4h climb)"}</span>
            </div>
            <div className="bg-[#f7faf6] rounded-xl p-2.5 border border-[#e1ece0]">
              <span className="text-[10px] text-[#556e5b] font-medium block">Base Village</span>
              <span className="text-xs font-black text-[#142607] truncate block">{currentVillage.name.split(",")[0]}</span>
            </div>
          </div>

          <p className="text-[13px] text-[#3d5343] leading-relaxed">
            {getField("description") || trek.description}
          </p>
        </div>

        {/* Base Village Route Selector (if multiple) */}
        {baseVillages.length > 1 && (
          <div className="bg-white rounded-2xl p-4 border border-[#d6e2d4] shadow-xs">
            <h3 className="text-xs font-bold text-[#142607] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <MapPin size={13} className="text-[#2D6A4F]" />
              <span>Select Base Village Route</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {baseVillages.map((village, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedVillageIndex(idx)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    selectedVillageIndex === idx
                      ? "bg-[#142607] text-white border-[#142607] shadow-sm"
                      : "bg-[#f7faf6] hover:bg-[#eef5ed] text-[#223d29] border-[#d6e2d4]"
                  }`}
                >
                  <div className="font-bold text-xs">{village.name}</div>
                  <div className={`text-[11px] mt-0.5 ${selectedVillageIndex === idx ? "text-emerald-200" : "text-[#556e5b]"}`}>
                    {village.marathiName} · {village.distanceFromBase}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trail Highlights */}
        {trek.highlights && trek.highlights.length > 0 && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#d6e2d4] shadow-xs">
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] mb-3 flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#B7895A]" />
              <span>Key Trail Highlights</span>
            </h3>
            <div className="space-y-2">
              {trek.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[12px] text-[#334637]">
                  <span className="w-5 h-5 rounded-full bg-[#edf3eb] text-[#2D6A4F] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── 2. SECTION: FORT CITADEL & HISTORY ── */}
      <section id="section-citadel" className="scroll-mt-20 space-y-3.5">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#d6e2d4] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] flex items-center gap-1.5">
              <Castle size={14} className="text-[#2D6A4F]" />
              <span>{isMarathi ? "ऐतिहासिक दुर्ग व माच्या" : "Historical Citadel & Machis"}</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
              1646 AD · Swarajya First Fort
            </span>
          </div>

          <p className="text-[13px] text-[#3d5343] leading-relaxed">
            {getField("history") ||
              trek.history ||
              `${trek.name} holds supreme historical significance in the Sahyadri mountains. In 1646, at the young age of 16, Chhatrapati Shivaji Maharaj captured this colossal citadel as the foundation stone of the Maratha Empire (Hindavi Swarajya). Renamed Prachandagad for its massive scale, it features legendary fortified wings including Zunjar Machi and Budhla Machi.`}
          </p>

          {/* Key Architectural & Historic Attractions */}
          <div className="mt-4 pt-3.5 border-t border-[#edf3eb] space-y-2.5">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#142607]">
              Fort Ramparts & Landmark Spots
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#f7faf6] rounded-xl border border-[#e1ece0]">
                <span className="font-bold text-[#142607] block mb-0.5">🚩 Zunjar Machi</span>
                <span className="text-[#556e5b] text-[11px]">Dramatic razor-sharp fortified ridge on the western slope with sheer drops and bastions.</span>
              </div>
              <div className="p-2.5 bg-[#f7faf6] rounded-xl border border-[#e1ece0]">
                <span className="font-bold text-[#142607] block mb-0.5">🦅 Budhla Machi</span>
                <span className="text-[#556e5b] text-[11px]">Vessel-shaped stone pinnacle commanding panoramic views across Rajgad and Bhatghar backwaters.</span>
              </div>
              <div className="p-2.5 bg-[#f7faf6] rounded-xl border border-[#e1ece0]">
                <span className="font-bold text-[#142607] block mb-0.5">⛩️ Bini Darwaja & Kothi</span>
                <span className="text-[#556e5b] text-[11px]">Intact Maratha stone entrance gates engineered with military curve defenses.</span>
              </div>
              <div className="p-2.5 bg-[#f7faf6] rounded-xl border border-[#e1ece0]">
                <span className="font-bold text-[#142607] block mb-0.5">🛕 Menghai Devi Temple</span>
                <span className="text-[#556e5b] text-[11px]">Historic shrine at the summit providing shelter for overnight trekkers.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SECTION: HOW TO REACH ── */}
      <section id="section-reach" className="scroll-mt-20 space-y-3.5">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#d6e2d4] shadow-xs">
          <h2 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] mb-3 flex items-center gap-1.5">
            <Navigation size={14} className="text-[#2D6A4F]" />
            <span>{isMarathi ? "कसे पोहोचावे (How to Reach)" : "How to Reach Base Village"}</span>
          </h2>

          <div className="space-y-3">
            {/* By Road */}
            <div className="p-3 bg-[#f7faf6] rounded-xl border border-[#e1ece0]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#142607] mb-1">
                <Car size={15} className="text-[#2D6A4F]" />
                <span>By Road (Drive / Private Cab)</span>
              </div>
              <p className="text-[12px] text-[#425948] leading-relaxed">
                {getField("byRoad") ||
                  trek.howToReach?.byRoad ||
                  "From Mumbai (210 km, ~4.5 - 5 hrs): Mumbai-Pune Expressway ➔ Katraj Bypass ➔ NH48 towards Satara ➔ Turn right at Nasrapur Phata onto SH65 ➔ Velhe base village. Parking available near Velhe police station. From Pune (65 km, ~2 hrs): Swargate ➔ Anandnagar ➔ Khed Shivapur ➔ Nasrapur ➔ Velhe."}
              </p>
            </div>

            {/* By Bus */}
            <div className="p-3 bg-[#f7faf6] rounded-xl border border-[#e1ece0]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#142607] mb-1">
                <Bus size={15} className="text-[#2D6A4F]" />
                <span>State Transport (MSRTC Bus)</span>
              </div>
              <p className="text-[12px] text-[#425948] leading-relaxed">
                {getField("byBus") ||
                  trek.howToReach?.byBus ||
                  "Frequent MSRTC State Transport buses ply directly from Pune Swargate Bus Depot to Velhe starting from 06:00 AM (approx. every hour, ~2 hrs journey). Shared local jeeps also connect Nasrapur Phata to Velhe."}
              </p>
            </div>

            {/* By Train */}
            <div className="p-3 bg-[#f7faf6] rounded-xl border border-[#e1ece0]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#142607] mb-1">
                <Train size={15} className="text-[#2D6A4F]" />
                <span>Nearest Railway Station</span>
              </div>
              <p className="text-[12px] text-[#425948] leading-relaxed">
                {getField("byTrain") ||
                  trek.howToReach?.byTrain ||
                  "Pune Junction (PUNE) is the nearest major railway hub (65 km). From Pune station, take an auto or city bus to Swargate Bus Stand (5 km), then an ST bus directly to Velhe."}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <a
              href={navUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-[#142607] hover:bg-[#1f3a0b] active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Navigation size={14} className="text-emerald-400" />
              <span>Get GPS Directions to {currentVillage.name}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── 4. SECTION: FOOD & STAY ── */}
      <section id="section-food" className="scroll-mt-20 space-y-3.5">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#d6e2d4] shadow-xs">
          <h2 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] mb-3 flex items-center gap-1.5">
            <Utensils size={14} className="text-[#2D6A4F]" />
            <span>Authentic Food & Local Stay</span>
          </h2>

          <div className="space-y-3">
            {/* Rustic Maharashtrian Food */}
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
              <span className="font-bold text-xs text-amber-950 block mb-1">
                🌾 अस्सल गावरान जेवण (Rustic Maharashtrian Fare at Base)
              </span>
              <p className="text-[12px] text-amber-900 leading-relaxed">
                Fort base villages like Velhe serve hot, freshly cooked village food:
              </p>
              <ul className="mt-2 space-y-1 text-[11px] text-amber-950 font-medium list-disc list-inside">
                <li>Pithla Bhakri (hot Jowar/Bajra Bhakri with gram flour curry)</li>
                <li>Fiery spicy Thecha (green chilli & garlic mortar crush)</li>
                <li>Zunka Bhakri & crushed Shenga (peanut) chutney</li>
                <li>Gavran Country Chicken Rassa / Sukka</li>
                <li>Fresh spiced Taak (buttermilk) & morning Kanda Poha / Chai</li>
              </ul>
            </div>

            {/* Stay Options */}
            <div className="p-3 bg-[#f7faf6] rounded-xl border border-[#e1ece0]">
              <span className="font-bold text-xs text-[#142607] block mb-1">
                🏡 Homestays & Summit Shelters
              </span>
              <p className="text-[12px] text-[#425948] leading-relaxed">
                Base village homestays in Velhe offer clean washrooms, basic bedding, and warm hospitality from local families. On the fort summit, the spacious Menghai Devi temple can shelter 25–30 trekkers overnight with carry-along sleeping mats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SECTION: SEASON & GEAR ── */}
      <section id="section-season" className="scroll-mt-20 space-y-3.5">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#d6e2d4] shadow-xs">
          <h2 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] mb-3 flex items-center gap-1.5">
            <Sun size={14} className="text-[#2D6A4F]" />
            <span>Best Season & Packing Checklist</span>
          </h2>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-[#f7faf6] rounded-xl border border-[#e1ece0]">
                <span className="font-bold text-[#142607] block mb-1">🌤️ Oct to March</span>
                <span className="text-[#556e5b] text-[11px]">Clear skies, pleasant cool winds, crisp mountain views. Best for summit camping & photography.</span>
              </div>
              <div className="p-3 bg-[#f7faf6] rounded-xl border border-[#e1ece0]">
                <span className="font-bold text-[#142607] block mb-1">🌧️ Monsoon (Jun–Sep)</span>
                <span className="text-[#556e5b] text-[11px]">Lush green slopes, gushing streams & fog. Rock patches can get slippery; good grip shoes compulsory.</span>
              </div>
            </div>

            {/* Things to Bring */}
            <div className="pt-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#142607] mb-2">
                Essential Trekking Checklist
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                {[
                  "Trekking shoes with deep lug grip (No flat soles)",
                  "2–3 Liters of drinking water per trekker",
                  "Rain poncho / waterproof jacket in monsoon",
                  "Torch / headlamp with spare batteries",
                  "Energy snacks (dates, glucose, nuts)",
                  "Personal basic first aid & medications",
                  "Identity proof & power bank"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[12px] text-[#334637]">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Warning */}
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2 text-[11px] text-amber-900">
              <AlertTriangle size={14} className="text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Safety Caution:</strong> The ridge towards Zunjar Machi has narrow exposed rock steps with steep cliff drops. Always maintain 3 points of contact and avoid risky selfies near cliff edges.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. SECTION: ENQUIRE & BATCHES ── */}
      <section id="section-enquire" className="scroll-mt-20 space-y-3.5">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#d6e2d4] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 block">
                ⏳ Opening for Batches
              </span>
              <h2 className="text-base font-black text-[#0f2416]">
                Expedition Package & Enquiries
              </h2>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-[#0f2416] leading-none block">
                ₹{trek.price?.toLocaleString("en-IN") || "1,499"}
              </span>
              <span className="text-[10px] text-[#556e5b]">/person (₹750 advance)</span>
            </div>
          </div>

          <div className="p-3 bg-[#f7faf6] rounded-xl border border-[#e1ece0] mb-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#142607] mb-2 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>Package Inclusions</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-[#425948]">
              <div>✓ Certified local Sahyadri mountain leads</div>
              <div>✓ Traditional village breakfast & hot tea</div>
              <div>✓ Unlimited rustic lunch (Pithla Bhakri / Gavran Thali)</div>
              <div>✓ Forest permits & safety ropes / first aid kit</div>
            </div>
          </div>

          {/* Interactive Enquiry Widget */}
          <TrekEnquiryWidget
            trekId={trek.id}
            trekName={trek.name}
            trekSlug={trek.slug}
            pricePerPerson={trek.price || 1499}
            advanceAmount={trek.advanceAmount || 750}
            whatsappGroupLink={trek.whatsappGroupLink}
          />
        </div>
      </section>
    </div>
  );
}
