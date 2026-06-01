import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Sun, Navigation, ArrowLeft, Sparkles } from "lucide-react";
import { DESTINATION_CATEGORIES } from "@/constants/destinationConstants";
import DestinationGallery from "@/components/destination/DestinationGallery";
import DestinationMap from "@/components/destination/DestinationMap";
import WeatherWidget from "@/components/destination/WeatherWidget";
import NearbyListings from "@/components/destination/NearbyListings";
import DestinationJsonLd from "@/components/destination/DestinationJsonLd";

async function getDestination(slug: string) {
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

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const dest = await getDestination(params.slug);
  if (!dest) return { title: "Destination Not Found" };
  return {
    title: `${dest.name} — Visit Kokan`,
    description: dest.description,
    openGraph: {
      images: dest.images?.[0] ? [dest.images[0]] : [],
    },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: { slug: string };
}) {
  const dest = await getDestination(params.slug);
  if (!dest) notFound();

  const category = DESTINATION_CATEGORIES.find((c) => c.value === dest.category);
  const heroImage =
    dest.images?.[0] ??
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80";

  return (
    <div className="min-h-screen bg-white">

      {/* SEO */}
      <DestinationJsonLd
        name={dest.name}
        description={dest.description}
        image={dest.images?.[0]}
        region={dest.region}
        slug={dest.slug}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div className="relative h-[60vw] max-h-[520px] min-h-[280px] overflow-hidden">
        <Image
          src={heroImage}
          alt={dest.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/15" />

        {/* Back button — top left */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/?tab=travel"
            className="flex items-center gap-1.5 px-3 py-2 bg-white/15 backdrop-blur-md text-white rounded-full text-xs font-medium border border-white/25 hover:bg-white/25 transition-colors"
          >
            <ArrowLeft size={13} /> Travel
          </Link>
        </div>

        {/* Breadcrumb back to destinations list */}
        <div className="absolute top-4 left-[5.5rem] z-10">
          <Link
            href="/destinations"
            className="flex items-center gap-1.5 px-3 py-2 bg-white/15 backdrop-blur-md text-white rounded-full text-xs font-medium border border-white/25 hover:bg-white/25 transition-colors"
          >
            All Destinations
          </Link>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 sm:px-8 sm:pb-10 md:px-14 md:pb-14">
          <div className="max-w-6xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20 mb-3">
              {category?.emoji} {category?.label}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-display text-white font-bold leading-tight">
              {dest.name}
            </h1>
            <div className="flex items-center gap-1.5 text-white/70 mt-2 text-sm sm:text-base">
              <MapPin size={14} /> {dest.region}, Maharashtra
            </div>
          </div>
        </div>
      </div>

      {/* ── Image gallery strip ───────────────────────────────────────────────── */}
      {dest.images?.length > 1 && (
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8 mt-4 sm:mt-6">
          <DestinationGallery images={dest.images} name={dest.name} />
        </div>
      )}

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-10">

        {/* Mobile: sidebar cards first (sticky-style info), then content */}
        {/* Desktop: 2/3 + 1/3 grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">

          {/* ── Left: main content ────────────────────────────────────────────── */}
          <div className="lg:col-span-2 order-2 lg:order-1 space-y-8">

            {/* About */}
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-kokan-earth mb-3">
                About {dest.name}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {dest.description}
              </p>
            </div>

            {/* Highlights */}
            {dest.highlights?.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-kokan-earth mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-kokan-sand" />
                  Highlights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {dest.highlights.map((h: string) => (
                    <div
                      key={h}
                      className="flex items-center gap-3 p-3.5 bg-kokan-cream/40 rounded-xl border border-kokan-sand/20"
                    >
                      <div className="w-2 h-2 rounded-full bg-kokan-green flex-shrink-0" />
                      <span className="text-kokan-earth font-medium text-sm">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to reach */}
            {dest.howToReach && (
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-kokan-earth mb-3 flex items-center gap-2">
                  <Navigation size={18} className="text-kokan-sand" />
                  How to Reach
                </h2>
                <div className="p-4 sm:p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{dest.howToReach}</p>
                </div>
              </div>
            )}

            {/* Map */}
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-kokan-earth mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-kokan-sand" />
                Location
              </h2>
              <DestinationMap name={dest.name} region={dest.region} />
            </div>

            {/* Nearby stays & activities (mobile: below map) */}
            <div className="lg:hidden">
              <h3 className="font-display font-bold text-kokan-earth mb-3 text-base">
                Nearby Stays & Activities
              </h3>
              <NearbyListings region={dest.region} currentSlug={dest.slug} />
            </div>
          </div>

          {/* ── Right sidebar ─────────────────────────────────────────────────── */}
          <div className="order-1 lg:order-2 space-y-3 sm:space-y-4">

            {/* Info cards — horizontal scroll on mobile */}
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide lg:flex-col lg:overflow-visible">

              {/* Best season */}
              <div className="flex-shrink-0 w-44 lg:w-auto p-4 bg-gradient-to-br from-kokan-green/5 to-kokan-green/10 rounded-2xl border border-kokan-green/20">
                <div className="flex items-center gap-1.5 text-kokan-green font-semibold mb-1.5 text-sm">
                  <Sun size={15} /> Best Season
                </div>
                <p className="text-kokan-earth font-semibold text-sm">{dest.bestSeason}</p>
              </div>

              {/* Region */}
              <div className="flex-shrink-0 w-44 lg:w-auto p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-500 font-semibold mb-1.5 text-sm">
                  <MapPin size={15} /> Region
                </div>
                <p className="text-kokan-earth font-semibold text-sm">{dest.region}, Maharashtra</p>
              </div>

              {/* Weather widget */}
              <div className="flex-shrink-0 w-56 lg:w-auto">
                <WeatherWidget region={dest.region} bestSeason={dest.bestSeason} />
              </div>
            </div>

            {/* CTA */}
            <div className="p-5 bg-kokan-earth rounded-2xl text-center">
              <p className="text-white/70 text-xs mb-3">
                Planning a trip to {dest.name}?
              </p>
              <Link
                href="/trip-planner"
                className="block w-full py-2.5 bg-kokan-sand text-white rounded-xl font-semibold hover:bg-kokan-sand/90 transition-colors text-sm"
              >
                Plan My Trip ✨
              </Link>
            </div>

            {/* Nearby — desktop only */}
            <div className="hidden lg:block">
              <h3 className="font-display font-bold text-kokan-earth mb-3 text-base">
                Nearby Stays & Activities
              </h3>
              <NearbyListings region={dest.region} currentSlug={dest.slug} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}