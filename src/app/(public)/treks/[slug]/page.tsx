import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TREK_CATEGORIES, TREK_DIFFICULTIES } from "@/constants/trekConstants";
import { Trek } from "@/types/trek";
import TrekJsonLd from "@/components/trek/TrekJsonLd";
import TrekDetailClientView from "@/components/trek/TrekDetailClientView";
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
  params: { slug: string };
  searchParams?: { from?: string; fromPage?: string; page?: string };
}) {
  const trek = await getTrek(params.slug);
  if (!trek) notFound();

  const fromPage = searchParams?.fromPage || searchParams?.page;
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
    <div className="min-h-screen bg-[#dce5da] sm:py-6 sm:px-4 flex justify-center items-start">
      <TrekJsonLd
        name={trek.name}
        description={trek.description}
        image={allImages[0]}
        region={trek.region}
        slug={trek.slug}
        price={trek.price}
      />

      {/* Main client view matching destination phone canvas layout */}
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
