import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TREK_CATEGORIES, TREK_DIFFICULTIES } from "@/constants/trekConstants";
import { Trek } from "@/types/trek";
import TrekJsonLd from "@/components/trek/TrekJsonLd";
import TrekDetailClientView from "@/components/trek/TrekDetailClientView";
import { adminDb } from "@/lib/firebaseAdmin";

// Enable ISR (Incremental Static Regeneration) on Vercel Edge CDN for sub-50ms TTFB
export const revalidate = 3600; // 1 hour edge cache

// Pre-generate top popular trek routes on Vercel Edge at build time
export async function generateStaticParams() {
  try {
    if (adminDb) {
      const snap = await adminDb
        .collection("treks")
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

// In-memory cache for fast repeated lookups during server rendering
const trekMemoryCache = new Map<string, { data: Trek | null; time: number }>();
let allApprovedTreksCache: { data: Trek[]; time: number } | null = null;
const CACHE_TTL_MS = 60_000 * 15; // 15 mins

const TREK_ALIAS_MAP: Record<string, string> = {
  "raigad": "raigad-fort",
  "raigad-trek": "raigad-fort",
  "raigad-fort-trek": "raigad-fort",
  "kalavantin": "kalavantin-durg-trek",
  "kalavantin-durg": "kalavantin-durg-trek",
  "kalavantin-durg-pinnacle": "kalavantin-durg-trek",
  "rajmachi": "rajmachi-fort-trek",
  "rajmachi-fort": "rajmachi-fort-trek",
  "harishchandragad": "harishchandragad-trek",
  "kokan-kada": "kokan-kada-ridge-walk",
  "konkan-kada": "kokan-kada-ridge-walk",
  "torna": "torna-fort",
  "torna-trek": "torna-fort",
  "torna-fort-trek": "torna-fort",
  "prachitgad": "prachitgad-trek",
  "prachitgad-fort": "prachitgad-trek",
  "tamhini": "tamhini-ghat-waterfall-trek",
  "tamhini-ghat": "tamhini-ghat-waterfall-trek",
  "devkund": "devkund-waterfall-trek",
  "devkund-waterfall": "devkund-waterfall-trek",
  "sindhudurg-trek": "sindhudurg-coastal-trek",
  "bankot-trek": "bankot-fort-coastal-trek",
  "amboli-trek": "amboli-sunset-night-trek",
  "vasota": "vasota-fort-trek",
  "vasota-fort": "vasota-fort-trek",
  "mahipatgad": "mahipatgad-fort-trek",
  "sudhagad": "sudhagad-fort-trek",
  "karnala": "karnala-fort-trek",
  "sarasgad": "sarasgad-fort-trek",
  "korigad": "korigad-fort-trek",
  "visapur": "visapur-fort-trek",
  "lohagad": "lohagad-fort-trek",
  "ratangad": "ratangad-fort-trek",
  "kalsubai": "kalsubai-peak-trek",
};

function serializeDoc<T>(id: string, data: FirebaseFirestore.DocumentData): T {
  return JSON.parse(
    JSON.stringify({ id, ...data }, (_k, v) => {
      if (v && typeof v === "object" && typeof v.toDate === "function") {
        return v.toDate().toISOString();
      }
      if (v && typeof v === "object" && typeof v._seconds === "number") {
        return new Date(v._seconds * 1000).toISOString();
      }
      return v;
    })
  ) as T;
}

async function getTrek(rawSlug: string): Promise<Trek | null> {
  const slug = decodeURIComponent(rawSlug || "").trim().toLowerCase();
  if (!slug) return null;

  const cached = trekMemoryCache.get(slug);
  if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    // Direct Firestore query with smart slug variant & alias resolution
    if (adminDb) {
      const candidateSlugs = Array.from(
        new Set([
          slug,
          ...(TREK_ALIAS_MAP[slug] ? [TREK_ALIAS_MAP[slug]] : []),
          slug.replace(/-expedition$/, ""),
          slug.replace(/-trek$/, ""),
          `${slug}-trek`,
          `${slug}-fort`,
          `${slug}-fort-trek`,
          slug.replace(/-fort-trek$/, "-fort"),
          slug.replace(/-fort$/, "-fort-trek"),
        ])
      ).filter(Boolean);

      for (const candidate of candidateSlugs) {
        const snap = await adminDb
          .collection("treks")
          .where("slug", "==", candidate)
          .where("approved", "==", true)
          .limit(1)
          .get();

        if (!snap.empty) {
          const doc = snap.docs[0];
          const result = serializeDoc<Trek>(doc.id, doc.data());
          trekMemoryCache.set(slug, { data: result, time: Date.now() });
          return result;
        }
      }

      // Fuzzy token fallback against approved treks to eliminate 404s on slight slug variations
      if (!allApprovedTreksCache || Date.now() - allApprovedTreksCache.time >= CACHE_TTL_MS) {
        const allSnap = await adminDb
          .collection("treks")
          .where("approved", "==", true)
          .get();
        allApprovedTreksCache = {
          data: allSnap.docs.map((d) => serializeDoc<Trek>(d.id, d.data())),
          time: Date.now(),
        };
      }

      const stopWords = new Set(["trek", "fort", "expedition", "walk", "trail", "peak", "waterfall", "ghat", "the", "and", "of"]);
      const queryTokens = slug
        .split("-")
        .filter((t) => t.length > 2 && !stopWords.has(t));

      if (queryTokens.length > 0) {
        const fuzzyMatch = allApprovedTreksCache.data.find((t) => {
          const target = `${t.slug || ""} ${t.name || ""}`.toLowerCase();
          return queryTokens.every((tok) => target.includes(tok));
        }) || allApprovedTreksCache.data.find((t) => {
          const target = (t.slug || "").toLowerCase();
          return target.startsWith(queryTokens[0]) || queryTokens[0].length >= 5 && target.includes(queryTokens[0]);
        });

        if (fuzzyMatch) {
          trekMemoryCache.set(slug, { data: fuzzyMatch, time: Date.now() });
          return fuzzyMatch;
        }
      }
    }
  } catch (err: any) {
    console.warn("Direct adminDb lookup failed for trek, falling back to API:", err.message);
  }

  // Fallback to internal API with edge revalidation
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://visitkokan.in");
    const res = await fetch(
      `${baseUrl}/api/treks?slug=${slug}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const result = await res.json();
    trekMemoryCache.set(slug, { data: result, time: Date.now() });
    return result;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const trek = await getTrek(slug);
  if (!trek) return { title: "Trek Not Found" };
  return {
    title: `${trek.name} Trek Expedition`,
    description: trek.description || `Explore ${trek.name} trek in ${trek.region}, Maharashtra.`,
    openGraph: {
      images: trek.images?.[0] ? [trek.images[0]] : [],
    },
  };
}

export default async function TrekPage({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any;
}) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const trek = await getTrek(slug);
  if (!trek) notFound();

  const fromPage = resolvedSearchParams?.fromPage || resolvedSearchParams?.page;
  const backHref = fromPage ? `/treks?page=${fromPage}` : "/treks";

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
    <div className="min-h-screen bg-[#dce5da]">
      <TrekJsonLd
        name={trek.name}
        description={trek.description}
        image={allImages[0]}
        region={trek.region}
        slug={trek.slug}
        price={trek.price}
        difficulty={trek.difficulty}
        duration={trek.duration}
        bestSeason={trek.bestSeason}
      />

      {/* Main dual-column client view with Durg trail guide and dedicated booking panel */}
      <TrekDetailClientView
        trek={trek}
        category={category}
        difficultyInfo={difficultyInfo}
        allImages={allImages}
        mapsUrl={mapsUrl}
        backHref={backHref}
        fromPage={fromPage}
      />
    </div>
  );
}
