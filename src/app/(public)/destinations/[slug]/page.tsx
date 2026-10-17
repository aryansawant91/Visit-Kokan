import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Sun, Navigation, Sparkles,
  ChevronRight, Compass, TreePine, Waves,
  Mountain, Tent, Camera, Ship, Footprints,
  Wind, Umbrella, Fish, Castle, Calendar, Clock
} from "lucide-react";
import { DESTINATION_CATEGORIES } from "@/constants/destinationConstants";
import WeatherWidget from "@/components/destination/WeatherWidget";
import NearbyListings from "@/components/destination/NearbyListings";
import DestinationJsonLd from "@/components/destination/DestinationJsonLd";
import HeroCarousel from "@/components/destination/HeroCarousel";
import { adminDb } from "@/lib/firebaseAdmin";

async function getDestination(slug: string) {
  try {
    // Try direct Firestore query first for fast SSR
    if (adminDb) {
      const snap = await adminDb
        .collection("destinations")
        .where("slug", "==", slug)
        .where("approved", "==", true)
        .limit(1)
        .get();

      if (!snap.empty) {
        const doc = snap.docs[0];
        return { id: doc.id, ...doc.data() } as any;
      }
    }
  } catch (err: any) {
    console.warn("Direct adminDb lookup failed, falling back to API:", err.message);
  }

  // Fallback to internal API
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/destinations?slug=${slug}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const dest = await getDestination(params.slug);
  if (!dest) return { title: "Destination Not Found — Visit Kokan" };
  return {
    title: `${dest.name} — Visit Kokan`,
    description: dest.description || dest.shortDescription || `Discover ${dest.name} in ${dest.region}, Maharashtra.`,
    openGraph: {
      images: dest.images?.[0] ? [dest.images[0]] : dest.coverImage ? [dest.coverImage] : [],
    },
  };
}

function HighlightIcon({ text }: { text: string }) {
  const t = text.toLowerCase();
  if (t.includes("beach") || t.includes("shore") || t.includes("coast") || t.includes("sand"))
    return <Waves size={20} className="text-[#173722]" />;
  if (t.includes("fort") || t.includes("castle") || t.includes("histor") || t.includes("temple"))
    return <Castle size={20} className="text-[#173722]" />;
  if (t.includes("trek") || t.includes("hike") || t.includes("walk") || t.includes("trail"))
    return <Footprints size={20} className="text-[#173722]" />;
  if (t.includes("view") || t.includes("sunset") || t.includes("scenic") || t.includes("photo"))
    return <Camera size={20} className="text-[#173722]" />;
  if (t.includes("forest") || t.includes("nature") || t.includes("green") || t.includes("grove"))
    return <TreePine size={20} className="text-[#173722]" />;
  if (t.includes("mountain") || t.includes("hill") || t.includes("peak") || t.includes("cliff"))
    return <Mountain size={20} className="text-[#173722]" />;
  if (t.includes("boat") || t.includes("ferry") || t.includes("cruise") || t.includes("backwater"))
    return <Ship size={20} className="text-[#173722]" />;
  if (t.includes("camp") || t.includes("stay") || t.includes("night") || t.includes("resort"))
    return <Tent size={20} className="text-[#173722]" />;
  if (t.includes("fish") || t.includes("seafood") || t.includes("scuba") || t.includes("snorkel") || t.includes("coral"))
    return <Fish size={20} className="text-[#173722]" />;
  if (t.includes("wind") || t.includes("breeze") || t.includes("air"))
    return <Wind size={20} className="text-[#173722]" />;
  if (t.includes("rain") || t.includes("monsoon") || t.includes("waterfall") || t.includes("water"))
    return <Umbrella size={20} className="text-[#173722]" />;
  return <Compass size={20} className="text-[#173722]" />;
}

export default async function DestinationPage({ params }: { params: { slug: string } }) {
  const dest = await getDestination(params.slug);
  if (!dest) notFound();

  const category = DESTINATION_CATEGORIES.find((c) => c.value === dest.category);
  const allImages: string[] = [
    ...(dest.coverImage ? [dest.coverImage] : []),
    ...(dest.images ?? []),
  ].filter((v: string, i: number, a: string[]) => a.indexOf(v) === i); // dedupe

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    dest.name + " " + dest.region + " Maharashtra"
  )}`;

  return (
    <div className="min-h-screen bg-[#dce5da] sm:py-6 sm:px-4 flex justify-center items-start">
      <DestinationJsonLd
        name={dest.name}
        description={dest.description}
        image={allImages[0]}
        region={dest.region}
        slug={dest.slug}
      />

      {/* ── Outer App-Style Canvas Frame (Full-bleed on mobile, luxury phone card on desktop) ── */}
      <div className="w-full max-w-md sm:max-w-lg min-h-screen sm:min-h-0 bg-[#edf3eb] relative sm:rounded-[44px] sm:shadow-2xl sm:overflow-hidden sm:border sm:border-black/10 pb-28">

        {/* ── 1. Hero: Curved bottom, frosted glass buttons, dots capsule & Star FAB ── */}
        <HeroCarousel
          images={allImages}
          name={dest.name}
          backHref="/destinations"
          category={category}
          region={dest.region}
          slug={dest.slug}
        />

        {/* ── 2. Content Section (Immediately below hero curve with soft mint background) ── */}
        <div id="destination-details" className="px-5 pt-8 space-y-6">

          {/* Region / Category Eyebrow & Main Title */}
          <div>
            <div className="flex items-center gap-1.5 text-[#1f422b] text-[11px] font-extrabold tracking-[0.2em] uppercase mb-1">
              <Mountain size={13} className="text-[#2D6A4F]" />
              <span>
                {dest.region} {category ? `· ${category.label}` : ""}
              </span>
            </div>
            <h2 className="text-[22px] sm:text-[24px] font-black text-[#0f2416] tracking-tight leading-tight">
              {dest.shortDescription || `${dest.name} Experience`}
            </h2>
          </div>

          {/* Key Info Pills (Row of rounded white pill badges) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
              <MapPin size={13} className="text-[#2D6A4F]" /> {dest.region}, MH
            </span>
            {dest.bestSeason && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
                <Sun size={13} className="text-[#2D6A4F]" /> {dest.bestSeason}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
              <Calendar size={13} className="text-[#2D6A4F]" /> 2-3 Days Trip
            </span>
          </div>

          {/* Highlight / Amenity Cards (Rounded rectangular pastel chips) */}
          {dest.highlights && dest.highlights.length > 0 && (
            <div>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {dest.highlights.map((h: string, idx: number) => (
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
          {dest.description && (
            <div className="bg-white rounded-3xl p-5 border border-[#d6e2d4] shadow-sm">
              <h3 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] mb-2 flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#B7895A]" /> About {dest.name}
              </h3>
              <p className="text-[13px] text-[#3d5343] leading-relaxed">
                {dest.description}
              </p>
            </div>
          )}

          {/* Quick Travel Facts */}
          <div className="grid grid-cols-2 gap-2.5">
            {dest.bestSeason && (
              <div className="bg-white rounded-2xl p-4 border border-[#d6e2d4] shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#dce7da] flex items-center justify-center shrink-0">
                  <Sun size={17} className="text-[#2D6A4F]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#69846f] font-bold uppercase tracking-wider">Best Season</p>
                  <p className="text-xs font-bold text-[#102416] mt-0.5 leading-snug">{dest.bestSeason}</p>
                </div>
              </div>
            )}
            <div className="bg-white rounded-2xl p-4 border border-[#d6e2d4] shadow-sm flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#dce7da] flex items-center justify-center shrink-0">
                <MapPin size={17} className="text-[#2D6A4F]" />
              </div>
              <div>
                <p className="text-[10px] text-[#69846f] font-bold uppercase tracking-wider">Region</p>
                <p className="text-xs font-bold text-[#102416] mt-0.5 leading-snug">{dest.region}, Konkan</p>
              </div>
            </div>
          </div>

          {/* How to Reach */}
          {dest.howToReach && (
            <div className="bg-white rounded-3xl p-5 border border-[#d6e2d4] shadow-sm">
              <h3 className="text-xs font-bold tracking-wider uppercase text-[#2D6A4F] mb-2 flex items-center gap-1.5">
                <Navigation size={14} className="text-[#2D6A4F]" /> How to Reach
              </h3>
              <p className="text-[13px] text-[#3d5343] leading-relaxed">
                {dest.howToReach}
              </p>
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
              <p className="text-sm font-bold text-[#102416] truncate">{dest.name}</p>
              <p className="text-xs text-[#526b58]">{dest.region}, Maharashtra</p>
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
            <WeatherWidget region={dest.region} bestSeason={dest.bestSeason} />
          </div>

          {/* Nearby Stays & Activities */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-[#102416] mb-3">
              Nearby Stays & Experiences
            </h3>
            <NearbyListings region={dest.region} currentSlug={dest.slug} />
          </div>

        </div>

        {/* ── 3. Sticky Bottom Action Bar (Matching the reference design exactly) ── */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#edf3eb]/95 backdrop-blur-md border-t border-[#d6e2d4] py-3.5 px-5">
          <div className="max-w-md sm:max-w-lg mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#526b58]">Best Season</span>
              <span className="text-[15px] sm:text-base font-black text-[#0f2416] leading-tight">
                {dest.bestSeason || "Oct — Mar"}
              </span>
            </div>

            <Link
              href={`/trip-planner?destination=${encodeURIComponent(dest.name)}`}
              className="px-7 py-3.5 bg-[#b8dc26] hover:bg-[#aed422] active:scale-95 text-[#142607] font-black text-sm rounded-full shadow-md shadow-[#b8dc26]/30 transition-all flex items-center gap-1.5 shrink-0"
            >
              Plan My Trip ✨
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}