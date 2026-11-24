import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Sun, Sparkles, Mountain, Calendar, ShieldCheck, MessageCircle
} from "lucide-react";
import { DESTINATION_CATEGORIES } from "@/constants/destinationConstants";
import DestinationJsonLd from "@/components/destination/DestinationJsonLd";
import HeroCarousel from "@/components/destination/HeroCarousel";
import DestinationTabs from "@/components/destination/DestinationTabs";
import { adminDb } from "@/lib/firebaseAdmin";

// Enable ISR on Vercel Edge CDN for sub-50ms TTFB
export const revalidate = 3600;

// Pre-generate top popular destination routes on Vercel Edge at build time
export async function generateStaticParams() {
  try {
    if (adminDb) {
      const snap = await adminDb
        .collection("destinations")
        .where("approved", "==", true)
        .limit(25)
        .get();
      return snap.docs
        .map((doc) => ({ slug: doc.data().slug }))
        .filter((item) => Boolean(item.slug));
    }
  } catch {
    // If building offline or without db access, fallback cleanly to on-demand ISR
  }
  return [];
}

// In-memory cache for rapid lookup
const destMemoryCache = new Map<string, { data: any; time: number }>();
const CACHE_TTL_MS = 60_000 * 15; // 15 mins

async function getDestination(slug: string) {
  const cached = destMemoryCache.get(slug);
  if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
    return cached.data;
  }

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

      // Check -fort variants if still empty
      if (snap.empty && slug.endsWith("-fort")) {
        snap = await adminDb
          .collection("destinations")
          .where("slug", "==", slug.replace(/-fort$/, ""))
          .where("approved", "==", true)
          .limit(1)
          .get();
      } else if (snap.empty && !slug.endsWith("-fort")) {
        snap = await adminDb
          .collection("destinations")
          .where("slug", "==", `${slug}-fort`)
          .where("approved", "==", true)
          .limit(1)
          .get();
      }

      // Specific known aliases
      if (snap.empty) {
        const aliasMap: Record<string, string> = {
          "devgad": "devgad-beach",
          "vijaydurg": "vijaydurg-fort",
          "korlai": "korlai-fort",
          "revdanda": "revdanda-fort-beach",
          "revdanda-beach": "revdanda-fort-beach",
          "korlai-revdanda": "korlai-fort",
          "harihareshwar-beach": "harihareshwar",
          "anjarle-beach": "anjarle",
          "velas": "velas-beach",
          "bankot": "bankot-fort",
          "kelshi": "kelshi-beach",
          "shrivardhan-beach": "shrivardhan",
          "devbag-beach": "devbag",
          "tarkarli-beach": "tarkarli",
          "bhogwe": "bhogwe-beach",
          "bhogave": "bhogwe-beach",
          "bhogave-beach": "bhogwe-beach",
          "velneshwar-beach": "velneshwar",
          "harnai-beach": "harnai",
          "achara": "achra",
          "achara-beach": "achra",
          "achra-beach": "achra",
          "aare-ware": "aare-ware-beach",
          "are-ware": "aare-ware-beach",
          "are-ware-beach": "aare-ware-beach",
          "parshuram-temple-chiplun": "chiplun-parshuram",
          "parshuram-temple": "chiplun-parshuram",
          "parshuram": "chiplun-parshuram",
          "chiplun": "chiplun-parshuram",
          "marleshwar-temple-waterfall": "marleshwar",
          "marleshwar-temple": "marleshwar",
          "marleshwar-waterfall": "marleshwar",
          "amboli-hill-station": "amboli",
          "kashid-beach": "kashid",
          "guhagar-beach": "guhagar",
          "murud-janjira-fort": "murud-janjira",
        };
        const targetAlias = aliasMap[slug];
        if (targetAlias) {
          snap = await adminDb
            .collection("destinations")
            .where("slug", "==", targetAlias)
            .where("approved", "==", true)
            .limit(1)
            .get();
        }
      }

      if (!snap.empty) {
        const doc = snap.docs[0];
        const data = doc.data();
        // Convert any Firestore Timestamps and non-plain values into plain JSON-serializable types
        const result = JSON.parse(
          JSON.stringify({ id: doc.id, ...data }, (_k, v) => {
            if (v && typeof v === "object" && typeof v.toDate === "function") {
              return v.toDate().toISOString();
            }
            if (v && typeof v === "object" && typeof v._seconds === "number") {
              return new Date(v._seconds * 1000).toISOString();
            }
            return v;
          })
        ) as any;
        destMemoryCache.set(slug, { data: result, time: Date.now() });
        return result;
      }
    }
  } catch (err: any) {
    console.warn("Direct adminDb lookup failed, falling back to API:", err.message);
  }

  // Fallback to internal API
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://visitkokan.in");
    const res = await fetch(
      `${baseUrl}/api/destinations?slug=${slug}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const result = await res.json();
    destMemoryCache.set(slug, { data: result, time: Date.now() });
    return result;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const dest = await getDestination(slug);
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

export default async function DestinationPage({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any;
}) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const dest = await getDestination(slug);
  if (!dest) notFound();

  const fromSlug = resolvedSearchParams?.from;
  const fromPage = resolvedSearchParams?.fromPage || resolvedSearchParams?.page;
  const backHref = fromSlug
    ? `/destinations/${fromSlug}`
    : fromPage
    ? `/destinations?page=${fromPage}`
    : "/destinations";

  const category = DESTINATION_CATEGORIES.find((c) => c.value === dest.category);
  const rawImages = [
    ...(dest.coverImage ? [dest.coverImage] : []),
    ...(Array.isArray(dest.images) ? dest.images : []),
  ];
  const allImages: string[] = rawImages
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((v, i, a) => v.length > 0 && a.indexOf(v) === i); // dedupe & strip empty/invalid strings

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    dest.name + " " + dest.region + " Maharashtra"
  )}`;

  const season = parseSeason(dest.bestSeason);

  return (
    <div className="min-h-screen bg-[#dce5da] sm:py-6 sm:px-4 lg:py-8 lg:px-8 flex justify-center items-start">
      <DestinationJsonLd
        name={dest.name}
        description={dest.description}
        image={allImages[0]}
        region={dest.region}
        slug={dest.slug}
      />

      {/* ── Outer App-Style Canvas Frame (Phone canvas on mobile, luxury 12-col desktop layout on lg+) ── */}
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-7xl min-h-screen sm:min-h-0 bg-[#edf3eb] lg:bg-transparent relative sm:rounded-[44px] lg:rounded-none sm:shadow-2xl lg:shadow-none sm:overflow-hidden lg:overflow-visible sm:border sm:border-black/10 lg:border-0 pb-28 lg:pb-16">

        {/* ── DUAL-COLUMN GRID FOR DESKTOP / SINGLE COLUMN CANVAS FOR MOBILE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ════ LEFT COLUMN: Main Destination Experience (7-8 cols on lg+) ════ */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">

            {/* 1. Hero: Curved bottom on mobile, luxurious rounded card on desktop */}
            <div className="lg:rounded-[36px] overflow-hidden lg:shadow-xl lg:border lg:border-[#cadbc7]/70 bg-white">
              <HeroCarousel
                images={allImages}
                name={dest.name}
                backHref={backHref}
                fromSlug={fromSlug}
                fromPage={fromPage}
                category={category}
                region={dest.region}
                slug={dest.slug}
              />
            </div>

            {/* 2. Content Section (Immediately below hero) */}
            <div id="destination-details" className="px-5 pt-7 lg:px-0 lg:pt-0 space-y-5">

              {/* Title & Info Card on Desktop, natural flow on mobile */}
              <div className="lg:bg-white lg:rounded-3xl lg:p-7 lg:border lg:border-[#cadbc7] lg:shadow-sm space-y-4">
                {/* Region / Category Eyebrow & Name Title */}
                <div>
                  <div className="flex items-center gap-1.5 text-[#1f422b] text-[11px] font-extrabold tracking-[0.2em] uppercase mb-1">
                    <Mountain size={13} className="text-[#2D6A4F]" />
                    <span>
                      {dest.region} {category ? `· ${category.label}` : ""}
                    </span>
                  </div>

                  {/* Clean, prominent destination name */}
                  <h1 className="text-2xl sm:text-[28px] lg:text-3xl font-black text-[#0f2416] tracking-tight leading-tight">
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
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white lg:bg-[#edf3eb] rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
                    <MapPin size={13} className="text-[#2D6A4F]" /> {dest.region}, MH
                  </span>
                  {season.short && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white lg:bg-[#edf3eb] rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
                      <Sun size={13} className="text-[#2D6A4F]" /> {season.short}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white lg:bg-[#edf3eb] rounded-full text-xs font-bold text-[#142e1b] shadow-sm border border-[#d6e2d4] shrink-0">
                    <Calendar size={13} className="text-[#2D6A4F]" /> 2-3 Days Trip
                  </span>
                </div>
              </div>

              {/* ── 3. Managed Interactive Tabs ── */}
              <DestinationTabs
                dest={dest}
                category={category}
                season={season}
                mapsUrl={mapsUrl}
              />

            </div>

          </div>

          {/* ════ RIGHT COLUMN: Sticky Travel Planning & Action Panel (Desktop / Laptop Only) ════ */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-5">
            
            {/* Quick Trip Planner & Action Card */}
            <div className="bg-white rounded-3xl border-2 border-[#2D6A4F]/25 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-br from-[#122c1b] via-[#1a442a] to-[#245838] p-5 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-400/30">
                    {category?.label || "Kokan Destination"}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-200 flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-300" /> Kokan Verified
                  </span>
                </div>

                <h2 className="text-2xl font-black tracking-tight leading-tight">
                  {dest.name}
                </h2>

                <p className="text-xs text-emerald-100/80 mt-1 flex items-center gap-1.5">
                  <MapPin size={12} className="text-emerald-300 shrink-0" />
                  <span>{dest.region}, Maharashtra</span>
                </p>

                {/* Season & Trip Badge */}
                <div className="mt-4 p-3.5 bg-black/25 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/70 block">
                      Best Time to Visit
                    </span>
                    <span className="text-sm font-black text-[#b8dc26] mt-0.5 block">
                      {season.short || "Oct — Mar"}
                    </span>
                  </div>
                  <div className="text-right border-l border-white/15 pl-4">
                    <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                      Duration
                    </span>
                    <span className="text-sm font-black text-white mt-0.5 block">
                      2-3 Days Trip
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 space-y-3 bg-[#f8faf7] border-b border-[#e2ede0]">
                <Link
                  href={`/trip-planner?destination=${encodeURIComponent(dest.name)}`}
                  className="w-full py-3.5 px-4 bg-[#b8dc26] hover:bg-[#aed422] text-[#142607] font-black text-sm rounded-2xl shadow-md shadow-[#b8dc26]/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Sparkles size={16} className="text-[#142607]" />
                  <span>Plan My Trip to {dest.name}</span>
                </Link>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-white hover:bg-[#edf3eb] text-[#142607] font-bold text-xs rounded-xl border border-[#cadbc7] transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-[0.98]"
                >
                  <MapPin size={14} className="text-[#2D6A4F]" />
                  <span>Open Location in Google Maps</span>
                </a>
              </div>

              {/* Highlights List if available */}
              {dest.highlights && dest.highlights.length > 0 && (
                <div className="p-5 space-y-2.5">
                  <p className="text-[11px] font-black uppercase tracking-wider text-[#2D6A4F]">
                    Key Highlights
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {dest.highlights.slice(0, 6).map((h: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-[#edf3eb] rounded-lg text-xs font-semibold text-[#142e1b] border border-[#d6e2d4]"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Have Questions / Local Lead Assistance Card */}
            <div className="bg-white rounded-2xl p-4 border border-[#cadbc7] shadow-xs flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#0f2416]">Planning a visit?</p>
                <p className="text-[11px] text-[#526b58]">Get local guidance on homestays & ferries</p>
              </div>
              <a
                href={`https://wa.me/918432587706?text=${encodeURIComponent(
                  `Hello Visit Kokan! I am planning a trip to "${dest.name}" in ${dest.region}. Can you assist with stay options and recommendations?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1f4e38] text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
              >
                <MessageCircle size={14} className="text-emerald-600" />
                <span>WhatsApp Us</span>
              </a>
            </div>

          </div>

        </div>

        {/* ── 4. Sticky Bottom Action Bar (Mobile Only: lg:hidden) ── */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#d6e2d4] py-2.5 px-4 shadow-lg lg:hidden">
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