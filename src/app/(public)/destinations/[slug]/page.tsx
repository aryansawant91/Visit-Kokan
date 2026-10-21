import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Sun, Sparkles, Mountain, Calendar
} from "lucide-react";
import { DESTINATION_CATEGORIES } from "@/constants/destinationConstants";
import DestinationJsonLd from "@/components/destination/DestinationJsonLd";
import HeroCarousel from "@/components/destination/HeroCarousel";
import DestinationTabs from "@/components/destination/DestinationTabs";
import { adminDb } from "@/lib/firebaseAdmin";

async function getDestination(slug: string) {
  try {
    // Try direct Firestore query first for fast SSR
    if (adminDb) {
      let snap = await adminDb
        .collection("destinations")
        .where("slug", "==", slug)
        .where("approved", "==", true)
        .limit(1)
        .get();

      if (snap.empty && slug.endsWith("-beach")) {
        snap = await adminDb
          .collection("destinations")
          .where("slug", "==", slug.replace(/-beach$/, ""))
          .where("approved", "==", true)
          .limit(1)
          .get();
      } else if (snap.empty && !slug.endsWith("-beach")) {
        snap = await adminDb
          .collection("destinations")
          .where("slug", "==", `${slug}-beach`)
          .where("approved", "==", true)
          .limit(1)
          .get();
      }

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

function parseSeason(rawSeason?: string) {
  if (!rawSeason) return { short: "Oct — Mar", detail: "" };
  const parts = rawSeason.split(/\s*(?:—|–| - |:)\s*/);
  if (parts.length > 1) {
    return {
      short: parts[0].trim(),
      detail: parts.slice(1).join(" — ").trim(),
    };
  }
  return { short: rawSeason.trim(), detail: "" };
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

  const season = parseSeason(dest.bestSeason);

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
        <div id="destination-details" className="px-5 pt-7 space-y-5">

          {/* Region / Category Eyebrow & Name Title */}
          <div>
            <div className="flex items-center gap-1.5 text-[#1f422b] text-[11px] font-extrabold tracking-[0.2em] uppercase mb-1">
              <Mountain size={13} className="text-[#2D6A4F]" />
              <span>
                {dest.region} {category ? `· ${category.label}` : ""}
              </span>
            </div>

            {/* Clean, prominent destination name */}
            <h1 className="text-2xl sm:text-[28px] font-black text-[#0f2416] tracking-tight leading-tight">
              {dest.name}
            </h1>

            {/* Tagline as an elegant accent quote */}
            {dest.tagline && (
              <p className="text-[12px] font-semibold text-[#2D6A4F] italic mt-1 leading-snug flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#B7895A] shrink-0" />
                <span>&ldquo;{dest.tagline}&rdquo;</span>
              </p>
            )}

            {/* Introduction paragraph in clean, readable typography */}
            {dest.shortDescription && (
              <p className="text-[13px] text-[#3d5343] leading-relaxed mt-2.5">
                {dest.shortDescription}
              </p>
            )}
          </div>

          {/* Key Info Pills (Row of rounded white pill badges with compact season) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
              <MapPin size={13} className="text-[#2D6A4F]" /> {dest.region}, MH
            </span>
            {season.short && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
                <Sun size={13} className="text-[#2D6A4F]" /> {season.short}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
              <Calendar size={13} className="text-[#2D6A4F]" /> 2-3 Days Trip
            </span>
          </div>

          {/* ── 3. Managed Interactive Tabs (Eliminates excessive downward scroll) ── */}
          <DestinationTabs
            dest={dest}
            category={category}
            season={season}
            mapsUrl={mapsUrl}
          />

        </div>

        {/* ── 4. Sticky Bottom Action Bar (Flipkart Style Dual Action) ── */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#d6e2d4] py-2.5 px-4 shadow-lg">
          <div className="max-w-md sm:max-w-lg mx-auto flex items-center gap-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 bg-white hover:bg-[#f7faf6] active:scale-[0.98] border border-[#cfddce] text-[#142607] font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5"
            >
              <MapPin size={14} className="text-[#2D6A4F]" />
              <span>View Map</span>
            </a>

            <Link
              href={`/trip-planner?destination=${encodeURIComponent(dest.name)}`}
              className="flex-1 py-2.5 px-3 bg-[#b8dc26] hover:bg-[#aed422] active:scale-[0.98] text-[#142607] font-black text-xs sm:text-sm rounded-xl shadow-sm shadow-[#b8dc26]/30 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Plan My Trip</span>
              <Sparkles size={14} className="text-[#142607]" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}