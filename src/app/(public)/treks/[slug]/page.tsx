import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Ruler, Users, Sparkles, Package, ArrowLeft } from "lucide-react";
import { TREK_CATEGORIES } from "@/constants/trekConstants";
import TrekDifficultyBadge from "@/components/trek/TrekDifficultyBadge";
import TrekItinerary from "@/components/trek/TrekItinerary";
import TrekBookingWidget from "@/components/trek/TrekBookingWidget";

async function getTrek(slug: string) {
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
  if (!trek) return { title: "Trek Not Found" };
  return {
    title: `${trek.name} Trek — Visit Kokan`,
    description: trek.description,
    openGraph: { images: trek.images?.[0] ? [trek.images[0]] : [] },
  };
}

export default async function TrekPage({ params }: { params: { slug: string } }) {
  const trek = await getTrek(params.slug);
  if (!trek) notFound();

  const category  = TREK_CATEGORIES.find((c) => c.value === trek.category);
  const heroImage = trek.images?.[0] ??
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80";

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div className="relative h-[60vw] max-h-[520px] min-h-[280px] overflow-hidden">
        <Image src={heroImage} alt={trek.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/35 to-black/15" />

        {/* Back to Travel tab */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/?tab=travel"
            className="flex items-center gap-1.5 px-3 py-2 bg-white/15 backdrop-blur-md text-white rounded-full text-xs font-medium border border-white/25 hover:bg-white/25 transition-colors"
          >
            <ArrowLeft size={13} /> Travel
          </Link>
        </div>

        {/* Back to all treks */}
        <div className="absolute top-4 left-[5.5rem] z-10">
          <Link
            href="/treks"
            className="flex items-center gap-1.5 px-3 py-2 bg-white/15 backdrop-blur-md text-white rounded-full text-xs font-medium border border-white/25 hover:bg-white/25 transition-colors"
          >
            All Treks
          </Link>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 sm:px-8 sm:pb-10 md:px-14 md:pb-14">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/15 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
                {category?.emoji} {category?.label}
              </span>
              <TrekDifficultyBadge difficulty={trek.difficulty} />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-display text-white font-bold leading-tight">
              {trek.name}
            </h1>
            <div className="flex items-center gap-1.5 text-white/70 mt-2 text-sm">
              <MapPin size={13} /> {trek.region}, Maharashtra
            </div>

            {/* Quick stats — horizontal scroll on mobile */}
            <div className="flex gap-3 mt-3 overflow-x-auto scrollbar-hide">
              <span className="flex-shrink-0 flex items-center gap-1 text-white/70 text-xs bg-white/10 px-2.5 py-1.5 rounded-lg backdrop-blur-sm">
                <Clock size={12} /> {trek.duration}
              </span>
              <span className="flex-shrink-0 flex items-center gap-1 text-white/70 text-xs bg-white/10 px-2.5 py-1.5 rounded-lg backdrop-blur-sm">
                <Ruler size={12} /> {trek.distance}
              </span>
              {trek.groupSize && (
                <span className="flex-shrink-0 flex items-center gap-1 text-white/70 text-xs bg-white/10 px-2.5 py-1.5 rounded-lg backdrop-blur-sm">
                  <Users size={12} /> {trek.groupSize}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Image strip ───────────────────────────────────────────────────────── */}
      {trek.images?.length > 1 && (
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8 mt-4">
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            {trek.images.slice(1).map((img: string, i: number) => (
              <div key={i} className="relative w-32 h-20 sm:w-40 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden">
                <Image
                  src={img}
                  alt={`${trek.name} ${i + 2}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Content ───────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">

          {/* ── Left: trek details ────────────────────────────────────────────── */}
          <div className="lg:col-span-2 order-2 lg:order-1 space-y-8">

            {/* About */}
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-kokan-earth mb-3">
                About This Trek
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{trek.description}</p>
            </div>

            {/* Trek info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Duration",     value: trek.duration,     icon: "⏱" },
                { label: "Distance",     value: trek.distance,     icon: "📍" },
                { label: "Start Point",  value: trek.startPoint,   icon: "🚩" },
                { label: "End Point",    value: trek.endPoint,     icon: "🏁" },
                ...(trek.maxAltitude ? [{ label: "Max Altitude", value: trek.maxAltitude, icon: "⛰️" }] : []),
                { label: "Best Season",  value: trek.bestSeason,   icon: "🌤️" },
              ].map((item) => (
                <div key={item.label} className="p-3 sm:p-4 bg-kokan-cream/30 rounded-xl border border-kokan-sand/20">
                  <span className="text-lg sm:text-xl">{item.icon}</span>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{item.label}</p>
                  <p className="text-xs sm:text-sm font-semibold text-kokan-earth mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Highlights */}
            {trek.highlights?.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-kokan-earth mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-kokan-sand" /> Highlights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {trek.highlights.map((h: string) => (
                    <div key={h} className="flex items-center gap-3 p-3.5 bg-kokan-cream/40 rounded-xl border border-kokan-sand/20">
                      <div className="w-2 h-2 rounded-full bg-kokan-green flex-shrink-0" />
                      <span className="text-kokan-earth font-medium text-sm">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {trek.itinerary?.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-kokan-earth mb-5">
                  Day-by-Day Itinerary
                </h2>
                <TrekItinerary itinerary={trek.itinerary} />
              </div>
            )}

            {/* Things to bring */}
            {trek.thingsToBring?.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-kokan-earth mb-3 flex items-center gap-2">
                  <Package size={18} className="text-kokan-sand" /> What to Bring
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {trek.thingsToBring.map((item: string) => (
                    <div key={item} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <span className="text-kokan-green font-bold">✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile booking widget */}
            <div className="lg:hidden">
              <TrekBookingWidget
                trekId={trek.id}
                trekName={trek.name}
                trekSlug={trek.slug}
                pricePerPerson={trek.price ?? 0}
                maxCapacity={20}
              />
            </div>
          </div>

          {/* ── Right: booking widget (desktop) ───────────────────────────────── */}
          <div className="order-1 lg:order-2 hidden lg:block">
            <div className="sticky top-4">
              <TrekBookingWidget
                trekId={trek.id}
                trekName={trek.name}
                trekSlug={trek.slug}
                pricePerPerson={trek.price ?? 0}
                maxCapacity={20}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}