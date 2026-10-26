import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Sun, Navigation, Sparkles,
  ChevronRight, Compass, TreePine, Waves,
  Mountain, Tent, Camera, Footprints,
  Wind, Umbrella, Castle, Calendar, Clock,
  Package, Ruler, Users, Check, Flag
} from "lucide-react";
import { TREK_CATEGORIES, TREK_DIFFICULTIES } from "@/constants/trekConstants";
import { Trek } from "@/types/trek";
import WeatherWidget from "@/components/destination/WeatherWidget";
import NearbyListings from "@/components/destination/NearbyListings";
import TrekHeroCarousel from "@/components/trek/TrekHeroCarousel";
import TrekStickyBar from "@/components/trek/TrekStickyBar";
import TrekJsonLd from "@/components/trek/TrekJsonLd";
import TrekBookingWidget from "@/components/trek/TrekBookingWidget";
import { adminDb } from "@/lib/firebaseAdmin";

async function getTrek(slug: string): Promise<Trek | null> {
  try {
    // Direct Firestore query first for fast SSR
    if (adminDb) {
      const snap = await adminDb
        .collection("treks")
        .where("slug", "==", slug)
        .where("approved", "==", true)
        .limit(1)
        .get();

      if (!snap.empty) {
        const doc = snap.docs[0];
        const data = doc.data();
        return JSON.parse(
          JSON.stringify({ id: doc.id, ...data }, (_k, v) => {
            if (v && typeof v === "object" && typeof v.toDate === "function") {
              return v.toDate().toISOString();
            }
            if (v && typeof v === "object" && typeof v._seconds === "number") {
              return new Date(v._seconds * 1000).toISOString();
            }
            return v;
          })
        ) as Trek;
      }
    }
  } catch (err: any) {
    console.warn("Direct adminDb lookup failed for trek, falling back to API:", err.message);
  }

  // Fallback to internal API
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/treks?slug=${slug}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const trek = await getTrek(params.slug);
  if (!trek) return { title: "Trek Not Found — Visit Kokan" };
  return {
    title: `${trek.name} Trek — Visit Kokan`,
    description: trek.description || `Explore ${trek.name} trek in ${trek.region}, Maharashtra.`,
    openGraph: {
      images: trek.images?.[0] ? [trek.images[0]] : [],
    },
  };
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

export default async function TrekPage({ params }: { params: { slug: string } }) {
  const trek = await getTrek(params.slug);
  if (!trek) notFound();

  const category = TREK_CATEGORIES.find((c) => c.value === trek.category);
  const difficultyInfo = TREK_DIFFICULTIES.find((d) => d.value === trek.difficulty);
  const allImages: string[] = (trek.images ?? []).filter(
    (v: string, i: number, a: string[]) => a.indexOf(v) === i
  );

  const mapsQuery = trek.startPoint
    ? `${trek.startPoint} ${trek.region} Maharashtra`
    : `${trek.name} Trek ${trek.region} Maharashtra`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

  return (
    <div className="min-h-screen bg-[#dce5da] sm:py-6 sm:px-4 flex justify-center items-start">
      <TrekJsonLd
        name={trek.name}
        description={trek.description}
        image={allImages[0]}
        region={trek.region}
        slug={trek.slug}
        price={trek.price}
      />

      {/* ── Outer App-Style Canvas Frame (Full-bleed on mobile, luxury phone card on desktop) ── */}
      <div className="w-full max-w-md sm:max-w-lg min-h-screen sm:min-h-0 bg-[#edf3eb] relative sm:rounded-[44px] sm:shadow-2xl sm:overflow-hidden sm:border sm:border-black/10 pb-28">

        {/* ── 1. Hero: Curved bottom, frosted glass buttons, dots capsule & Star FAB ── */}
        <TrekHeroCarousel
          images={allImages}
          name={trek.name}
          backHref="/treks"
          category={category}
          difficulty={trek.difficulty}
          region={trek.region}
          slug={trek.slug}
        />

        {/* ── 2. Content Section (Immediately below hero curve with soft mint background) ── */}
        <div id="trek-details" className="px-5 pt-8 space-y-6">

          {/* Region / Category Eyebrow & Main Title */}
          <div>
            <div className="flex items-center gap-1.5 text-[#1f422b] text-[11px] font-extrabold tracking-[0.2em] uppercase mb-1">
              <Mountain size={13} className="text-[#2D6A4F]" />
              <span>
                {trek.region} {category ? `· ${category.label}` : ""} {trek.difficulty ? `· ${trek.difficulty.toUpperCase()}` : ""}
              </span>
            </div>
            <h2 className="text-[22px] sm:text-[24px] font-black text-[#0f2416] tracking-tight leading-tight">
              {trek.name} Expedition
            </h2>
          </div>

          {/* Key Info Pills (Row of rounded white pill badges with subtle border & shadow) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
              <MapPin size={13} className="text-[#2D6A4F]" /> {trek.region}, MH
            </span>
            {trek.duration && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
                <Clock size={13} className="text-[#2D6A4F]" /> {trek.duration}
              </span>
            )}
            {trek.distance && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
                <Ruler size={13} className="text-[#2D6A4F]" /> {trek.distance}
              </span>
            )}
            {trek.maxAltitude && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
                <Mountain size={13} className="text-[#2D6A4F]" /> {trek.maxAltitude}
              </span>
            )}
            {trek.groupSize && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
                <Users size={13} className="text-[#2D6A4F]" /> {trek.groupSize}
              </span>
            )}
            {trek.bestSeason && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
                <Sun size={13} className="text-[#2D6A4F]" /> {trek.bestSeason}
              </span>
            )}
          </div>

          {/* Highlight Cards (Rounded rectangular pastel chips) */}
          {trek.highlights && trek.highlights.length > 0 && (
            <div>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {trek.highlights.map((h: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-[#dce7da] rounded-2xl p-3.5 flex flex-col justify-between min-w-[108px] h-[84px] border border-[#cadbc7] shadow-sm shrink-0 hover:bg-[#d4e1d1] transition-colors"
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

          {/* ── Detailed Content Cards ── */}

          {/* About Section */}
          {trek.description && (
            <div className="bg-white rounded-3xl p-5 border border-[#d6e2d4] shadow-sm">
              <h3 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] mb-2 flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#B7895A]" /> About This Trek
              </h3>
              <p className="text-[13px] text-[#3d5343] leading-relaxed">
                {trek.description}
              </p>
            </div>
          )}

          {/* Quick Trek Facts / Specs (2x2 or 2x3 Grid) */}
          <div className="grid grid-cols-2 gap-2.5">
            {trek.duration && (
              <div className="bg-white rounded-2xl p-4 border border-[#d6e2d4] shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#dce7da] flex items-center justify-center shrink-0">
                  <Clock size={17} className="text-[#2D6A4F]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#69846f] font-bold uppercase tracking-wider">Duration</p>
                  <p className="text-xs font-bold text-[#102416] mt-0.5 leading-snug">{trek.duration}</p>
                </div>
              </div>
            )}

            {trek.distance && (
              <div className="bg-white rounded-2xl p-4 border border-[#d6e2d4] shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#dce7da] flex items-center justify-center shrink-0">
                  <Ruler size={17} className="text-[#2D6A4F]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#69846f] font-bold uppercase tracking-wider">Distance</p>
                  <p className="text-xs font-bold text-[#102416] mt-0.5 leading-snug">{trek.distance}</p>
                </div>
              </div>
            )}

            {trek.startPoint && (
              <div className="bg-white rounded-2xl p-4 border border-[#d6e2d4] shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#dce7da] flex items-center justify-center shrink-0">
                  <Flag size={17} className="text-[#2D6A4F]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#69846f] font-bold uppercase tracking-wider">Start Point</p>
                  <p className="text-xs font-bold text-[#102416] mt-0.5 leading-snug truncate">{trek.startPoint}</p>
                </div>
              </div>
            )}

            {trek.endPoint && (
              <div className="bg-white rounded-2xl p-4 border border-[#d6e2d4] shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#dce7da] flex items-center justify-center shrink-0">
                  <MapPin size={17} className="text-[#2D6A4F]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#69846f] font-bold uppercase tracking-wider">End Point</p>
                  <p className="text-xs font-bold text-[#102416] mt-0.5 leading-snug truncate">{trek.endPoint}</p>
                </div>
              </div>
            )}

            {trek.maxAltitude && (
              <div className="bg-white rounded-2xl p-4 border border-[#d6e2d4] shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#dce7da] flex items-center justify-center shrink-0">
                  <Mountain size={17} className="text-[#2D6A4F]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#69846f] font-bold uppercase tracking-wider">Altitude</p>
                  <p className="text-xs font-bold text-[#102416] mt-0.5 leading-snug">{trek.maxAltitude}</p>
                </div>
              </div>
            )}

            {trek.bestSeason && (
              <div className="bg-white rounded-2xl p-4 border border-[#d6e2d4] shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#dce7da] flex items-center justify-center shrink-0">
                  <Sun size={17} className="text-[#2D6A4F]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#69846f] font-bold uppercase tracking-wider">Best Season</p>
                  <p className="text-xs font-bold text-[#102416] mt-0.5 leading-snug">{trek.bestSeason}</p>
                </div>
              </div>
            )}
          </div>

          {/* Day-by-Day Itinerary */}
          {trek.itinerary && trek.itinerary.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-[#d6e2d4] shadow-sm">
              <h3 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] mb-4 flex items-center gap-1.5">
                <Calendar size={14} className="text-[#2D6A4F]" /> Day-by-Day Itinerary
              </h3>
              <div className="space-y-4">
                {trek.itinerary.map((day, i) => (
                  <div key={i} className="flex gap-3.5">
                    {/* Timeline indicator */}
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-[#1b3d26] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                        {day.day}
                      </div>
                      {i < trek.itinerary.length - 1 && (
                        <div className="w-0.5 bg-[#d6e2d4] flex-1 mt-1.5" />
                      )}
                    </div>

                    {/* Step details */}
                    <div className="flex-1 pb-4">
                      <h4 className="text-xs font-bold text-[#102416]">{day.title}</h4>
                      <p className="text-[12px] text-[#3d5343] mt-1 leading-relaxed">{day.description}</p>
                      {(day.distance || day.duration) && (
                        <div className="flex gap-2 mt-2">
                          {day.distance && (
                            <span className="text-[10px] font-bold text-[#2D6A4F] bg-[#edf3eb] px-2 py-0.5 rounded-full border border-[#d6e2d4]">
                              📍 {day.distance}
                            </span>
                          )}
                          {day.duration && (
                            <span className="text-[10px] font-bold text-[#2D6A4F] bg-[#edf3eb] px-2 py-0.5 rounded-full border border-[#d6e2d4]">
                              ⏱ {day.duration}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What to Bring Checklist */}
          {trek.thingsToBring && trek.thingsToBring.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-[#d6e2d4] shadow-sm">
              <h3 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] mb-3 flex items-center gap-1.5">
                <Package size={14} className="text-[#2D6A4F]" /> Packing &amp; Gear Checklist
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {trek.thingsToBring.map((item: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 bg-[#edf3eb] rounded-xl text-xs font-semibold text-[#142e1b] border border-[#dce7da]"
                  >
                    <Check size={13} className="text-[#2D6A4F] shrink-0 stroke-[2.5]" />
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
            className="flex items-center gap-3.5 p-4 bg-white rounded-3xl border border-[#d6e2d4] shadow-sm active:scale-[0.98] transition-transform group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#dce7da] flex items-center justify-center shrink-0">
              <MapPin size={22} className="text-[#2D6A4F]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#102416] truncate">{trek.startPoint || trek.name}</p>
              <p className="text-xs text-[#526b58]">{trek.region}, Maharashtra</p>
              <p className="text-xs font-bold text-[#2D6A4F] mt-1 group-hover:underline flex items-center gap-1">
                Open in Google Maps <ChevronRight size={13} />
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#edf3eb] flex items-center justify-center shrink-0 group-hover:bg-[#dce7da] transition-colors">
              <ChevronRight size={16} className="text-[#2D6A4F]" />
            </div>
          </a>

          {/* Weather Widget */}
          <div>
            <WeatherWidget region={trek.region} bestSeason={trek.bestSeason} />
          </div>

          {/* Booking & Registration Section */}
          <div id="booking-section" className="scroll-mt-24 pt-2">
            <h3 className="text-sm font-bold text-[#102416] mb-3">
              Reserve Your Slot
            </h3>
            <TrekBookingWidget
              trekId={trek.id}
              trekName={trek.name}
              trekSlug={trek.slug}
              pricePerPerson={trek.price ?? 0}
              maxCapacity={20}
              advanceAmount={trek.advanceAmount ?? 0}
              whatsappGroupLink={trek.whatsappGroupLink}
              scheduledDate={trek.scheduledDate ?? undefined}
              hideStickyBar={true}
            />
          </div>

          {/* Nearby Stays & Activities */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-[#102416] mb-3">
              Nearby Stays &amp; Experiences in {trek.region}
            </h3>
            <NearbyListings region={trek.region} currentSlug={trek.slug} />
          </div>

        </div>

        {/* ── 3. Sticky Bottom Action Bar (Matching destination slug exactly) ── */}
        <TrekStickyBar
          price={trek.price}
          scheduledDate={trek.scheduledDate}
          whatsappGroupLink={trek.whatsappGroupLink}
          trekName={trek.name}
        />

      </div>
    </div>
  );
}