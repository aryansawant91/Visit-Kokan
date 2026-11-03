"use client";

import React, { useEffect } from "react";
import {
  MapPin,
  Clock,
  Sparkles,
  Mountain,
  Footprints,
} from "lucide-react";
import { Trek } from "@/types/trek";
import TrekHeroCarousel from "@/components/trek/TrekHeroCarousel";
import TrekStickyBar from "@/components/trek/TrekStickyBar";
import TrekTabs from "@/components/trek/TrekTabs";

interface Props {
  trek: Trek;
  category?: { emoji: string; label: string; value: string } | null;
  difficultyInfo?: { label: string; value: string; color?: string } | null;
  allImages: string[];
  mapsUrl: string;
  backHref?: string;
  fromPage?: string;
}

export default function TrekDetailClientView({
  trek,
  category,
  difficultyInfo,
  allImages,
  mapsUrl,
  backHref = "/treks",
  fromPage,
}: Props) {
  // Listen to open-trek-booking custom event from Sticky Bar
  useEffect(() => {
    const handleOpenBooking = () => {
      const el = document.getElementById("section-enquire");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("open-trek-booking", handleOpenBooking);
    return () => window.removeEventListener("open-trek-booking", handleOpenBooking);
  }, []);

  const elevation = trek.elevation || trek.maxAltitude || "1,403 m (4,603 ft)";

  return (
    <div className="w-full max-w-md sm:max-w-lg min-h-screen sm:min-h-0 bg-[#edf3eb] relative sm:rounded-[44px] sm:shadow-2xl sm:overflow-hidden sm:border sm:border-black/10 pb-28">
      {/* ── 1. Curved Hero Carousel with frosted glass buttons, dots & favorite FAB ── */}
      <TrekHeroCarousel
        images={allImages}
        name={trek.name}
        backHref={backHref}
        fromPage={fromPage}
        category={category}
        difficulty={difficultyInfo?.label || trek.difficulty}
        region={trek.region}
        slug={trek.slug}
      />

      {/* ── 2. Content Section (Immediately below hero curve with soft mint background) ── */}
      <div id="trek-details" className="px-5 pt-7 space-y-5">
        {/* Eyebrow & Title */}
        <div>
          <div className="flex items-center gap-1.5 text-[#1f422b] text-[11px] font-extrabold tracking-[0.2em] uppercase mb-1">
            <Mountain size={13} className="text-[#2D6A4F]" />
            <span>
              {trek.region} {category ? `· ${category.label}` : "· Sahyadri Fort"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-[28px] font-black text-[#0f2416] tracking-tight leading-tight">
            {trek.name}
          </h1>

          {trek.highlights && trek.highlights[0] && (
            <p className="text-[12px] font-semibold text-[#2D6A4F] italic mt-1 leading-snug flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#B7895A] shrink-0" />
              <span>&ldquo;{trek.highlights[0].replace(/^[\s\S]*?(?:🚩|🦅|🌳|⭐)?\s*/, "")}&rdquo;</span>
            </p>
          )}

          {trek.description && (
            <p className="text-[13px] text-[#3d5343] leading-relaxed mt-2.5">
              {trek.description.slice(0, 180)}...
            </p>
          )}
        </div>

        {/* Key Info Stat Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
            <MapPin size={13} className="text-[#2D6A4F]" /> {trek.region}, MH
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
            <Mountain size={13} className="text-[#2D6A4F]" /> {elevation}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
            <Clock size={13} className="text-[#2D6A4F]" /> {trek.duration || "1 Day"}
          </span>
          {difficultyInfo && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
              <Footprints size={13} className="text-[#2D6A4F]" /> {difficultyInfo.label}
            </span>
          )}
        </div>

        {/* ── 3. Managed Interactive Tabs (mirroring DestinationTabs) ── */}
        <TrekTabs
          trek={trek}
          category={category}
          difficultyInfo={difficultyInfo}
          mapsUrl={mapsUrl}
        />
      </div>

      {/* ── 4. Sticky Bottom Action Bar ── */}
      <TrekStickyBar
        price={trek.price || 1499}
        scheduledDate={trek.scheduledDate}
        whatsappGroupLink={trek.whatsappGroupLink}
        trekName={trek.name}
      />
    </div>
  );
}
