import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Ruler, Users, ArrowLeft, Sparkles, Package } from "lucide-react";
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

  const category = TREK_CATEGORIES.find((c) => c.value === trek.category);
  const heroImage = trek.images?.[0] ??
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80";

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="relative h-[70vh] overflow-hidden">
        <Image src={heroImage} alt={trek.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/treks"
            className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/20 hover:bg-white/25 transition-colors"
          >
            <ArrowLeft size={15} /> All Treks
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-md text-white text-sm font-medium rounded-full border border-white/20">
                {category?.emoji} {category?.label}
              </span>
              <TrekDifficultyBadge difficulty={trek.difficulty} />
            </div>
            <h1 className="text-5xl md:text-7xl font-display text-white font-bold leading-tight">
              {trek.name}
            </h1>
            <div className="flex items-center gap-2 text-white/70 mt-3 text-lg">
              <MapPin size={18} /> {trek.region}, Maharashtra
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4 mt-4">
              <span className="flex items-center gap-1.5 text-white/70 text-sm">
                <Clock size={15} /> {trek.duration}
              </span>
              <span className="flex items-center gap-1.5 text-white/70 text-sm">
                <Ruler size={15} /> {trek.distance}
              </span>
              {trek.groupSize && (
                <span className="flex items-center gap-1.5 text-white/70 text-sm">
                  <Users size={15} /> {trek.groupSize}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image gallery strip */}
      {trek.images?.length > 1 && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {trek.images.slice(1).map((img: string, i: number) => (
              <div key={i} className="relative w-40 h-28 flex-shrink-0 rounded-2xl overflow-hidden">
                <Image src={img} alt={`${trek.name} ${i + 2}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            <div>
              <h2 className="text-2xl font-display font-bold text-kokan-earth mb-4">About This Trek</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{trek.description}</p>
            </div>

            {/* Trek info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Duration", value: trek.duration, icon: "⏱" },
                { label: "Distance", value: trek.distance, icon: "📍" },
                { label: "Start", value: trek.startPoint, icon: "🚩" },
                { label: "End", value: trek.endPoint, icon: "🏁" },
                ...(trek.maxAltitude ? [{ label: "Max Altitude", value: trek.maxAltitude, icon: "⛰️" }] : []),
                { label: "Best Season", value: trek.bestSeason, icon: "🌤️" },
              ].map((item) => (
                <div key={item.label} className="p-4 bg-kokan-cream/30 rounded-2xl border border-kokan-sand/20">
                  <span className="text-xl">{item.icon}</span>
                  <p className="text-xs text-gray-400 mt-1">{item.label}</p>
                  <p className="text-sm font-semibold text-kokan-earth mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Highlights */}
            {trek.highlights?.length > 0 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-kokan-earth mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-kokan-sand" /> Highlights
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {trek.highlights.map((h: string) => (
                    <div key={h} className="flex items-center gap-3 p-4 bg-kokan-cream/40 rounded-2xl border border-kokan-sand/20">
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
                <h2 className="text-2xl font-display font-bold text-kokan-earth mb-6">
                  Day-by-Day Itinerary
                </h2>
                <TrekItinerary itinerary={trek.itinerary} />
              </div>
            )}

            {/* Things to bring */}
            {trek.thingsToBring?.length > 0 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-kokan-earth mb-4 flex items-center gap-2">
                  <Package size={20} className="text-kokan-sand" /> What to Bring
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {trek.thingsToBring.map((item: string) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-kokan-green">✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div>
            <TrekBookingWidget
              trekName={trek.name}
              price={trek.price}
              groupSize={trek.groupSize}
              duration={trek.duration}
            />
          </div>
        </div>
      </div>
    </div>
  );
}