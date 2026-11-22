import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TREK_CATEGORIES, TREK_DIFFICULTIES } from "@/constants/trekConstants";
import { Trek } from "@/types/trek";
import TrekJsonLd from "@/components/trek/TrekJsonLd";
import TrekDetailClientView from "@/components/trek/TrekDetailClientView";
import { adminDb } from "@/lib/firebaseAdmin";

// Enable ISR (Incremental Static Regeneration) on Vercel Edge CDN for sub-50ms TTFB
export const revalidate = 3600; // 1 hour edge cache

// In-memory cache for fast repeated lookups during server rendering
const trekMemoryCache = new Map<string, { data: Trek | null; time: number }>();
const CACHE_TTL_MS = 60_000 * 15; // 15 mins

async function getTrek(slug: string): Promise<Trek | null> {
  const cached = trekMemoryCache.get(slug);
  if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
    return cached.data;
  }

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
        ) as Trek;

        trekMemoryCache.set(slug, { data: result, time: Date.now() });
        return result;
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
  if (!trek) return { title: "Trek Not Found — Visit Kokan" };
  return {
    title: `${trek.name} Trek Expedition — Visit Kokan`,
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
