"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin, Clock, ChevronRight, ArrowRight, Star, Compass
} from "lucide-react";
import { Trek } from "@/types/trek";

const TRAVEL_CATEGORIES = [
  { label: "All", emoji: "🗺️", value: "all" },
  { label: "Beaches", emoji: "🏖️", value: "beaches" },
  { label: "Forts", emoji: "🏰", value: "forts" },
  { label: "Treks", emoji: "🧗", value: "treks" },
  { label: "Homestays", emoji: "🏡", value: "homestays" },
  { label: "Food Tours", emoji: "🍛", value: "food" },
  { label: "Water Sports", emoji: "🤿", value: "water" },
  { label: "Temples", emoji: "🛕", value: "temples" },
];

const DESTINATIONS = [
  { name: "Tarkarli", region: "Sindhudurg", tag: "Beach + Scuba", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80", slug: "tarkarli", rating: 4.8 },
  { name: "Alibaug", region: "Raigad", tag: "Forts + Beach", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80", slug: "alibaug", rating: 4.6 },
  { name: "Ganpatipule", region: "Ratnagiri", tag: "Temple + Sea", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", slug: "ganpatipule", rating: 4.7 },
  { name: "Malvan", region: "Sindhudurg", tag: "Seafood + History", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80", slug: "malvan", rating: 4.9 },
  { name: "Dapoli", region: "Ratnagiri", tag: "Offbeat + Serene", image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400&q=80", slug: "dapoli", rating: 4.5 },
  { name: "Harihareshwar", region: "Raigad", tag: "Spiritual + Coast", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80", slug: "harihareshwar", rating: 4.6 },
];

const BANNERS = [
  {
    title: "Top Destinations",
    sub: "Explore 50+ Coastal Gems",
    cta: "Explore",
    href: "/destinations",
    image: "/images/banners/explore-destinations.jpg",
  },
  {
    title: "Trek Season is Here",
    sub: "Lush Sahyadri Forts & Trails",
    cta: "Explore",
    href: "/treks",
    image: "/images/banners/monsoon-treks.jpg",
  },
  {
    title: "Hidden Beach Stays",
    sub: "Authentic Coastal Homestays",
    cta: "Explore",
    href: "/listings",
    image: "/images/banners/coastal-getaways.jpg",
  },
  {
    title: "Untouched Kokan",
    sub: "Historic Forts & Secret Coves",
    cta: "Explore",
    href: "/trip-planner",
    image: "/images/banners/travel-art.jpg",
  },
];

const difficultyColor: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  moderate: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
  expert: "bg-red-200 text-red-800",
  // capitalised fallbacks (just in case)
  Easy: "bg-green-100 text-green-700",
  Moderate: "bg-amber-100 text-amber-700",
  Hard: "bg-red-100 text-red-700",
};

function HorizontalScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
      {children}
    </div>
  );
}

function DestinationCard({ dest }: { dest: typeof DESTINATIONS[0] }) {
  return (
    <Link href={`/destinations/${dest.slug}`} className="flex-shrink-0 snap-start">
      <div className="w-40 sm:w-48 rounded-2xl overflow-hidden border border-kokan-sand/20 hover:shadow-md transition-all">
        <div className="relative h-28">
          <Image src={dest.image} alt={dest.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-2">
            <p className="text-white font-semibold text-sm">{dest.name}</p>
            <p className="text-white/70 text-xs flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5" /> {dest.region}
            </p>
          </div>
          <div className="absolute top-2 right-2 bg-white/90 text-xs font-bold text-yellow-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
            {dest.rating}
          </div>
        </div>
        <div className="bg-white px-3 py-2">
          <span className="text-xs text-kokan-earth/60 bg-kokan-sand/20 px-2 py-0.5 rounded-full">{dest.tag}</span>
        </div>
      </div>
    </Link>
  );
}

function TrekCard({ trek }: { trek: Trek }) {
  return (
    <Link href={`/treks/${trek.slug}`} className="flex-shrink-0 snap-start">
      <div className="w-48 sm:w-56 bg-white rounded-2xl overflow-hidden border border-kokan-sand/20 hover:shadow-md transition-all">
        <div className="relative h-32">
          {trek.images?.[0] ? (
            <Image src={trek.images[0]} alt={trek.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-kokan-sand/20 flex items-center justify-center text-3xl">🥾</div>
          )}
          <div className="absolute top-2 left-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor[trek.difficulty] ?? "bg-gray-100 text-gray-600"}`}>
              {trek.difficulty}
            </span>
          </div>
        </div>
        <div className="p-3">
          <p className="font-semibold text-kokan-earth text-sm line-clamp-1">{trek.name}</p>
          <div className="flex items-center gap-3 text-xs text-kokan-earth/50 mt-1">
            {trek.duration && (
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" /> {trek.duration}
              </span>
            )}
            <span className="flex items-center gap-0.5">
              <MapPin className="w-3 h-3" /> {trek.region}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-kokan-green font-bold text-sm">
              ₹{trek.price?.toLocaleString("en-IN")}
              <span className="text-[11px] text-kokan-earth/40 font-normal"> / person</span>
            </span>
            <span className="text-xs font-bold text-kokan-green bg-kokan-green/10 px-2 py-0.5 rounded-md">
              Book
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function TrekCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-48 sm:w-56 bg-white rounded-2xl overflow-hidden border border-kokan-sand/20">
      <div className="h-32 bg-kokan-sand/20 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-kokan-sand/20 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-kokan-sand/20 rounded animate-pulse w-1/2" />
        <div className="h-4 bg-kokan-sand/20 rounded animate-pulse w-1/3" />
      </div>
    </div>
  );
}

export default function TravelTab() {
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [treks, setTreks] = useState<Trek[]>([]);
  const [treksLoading, setTreksLoading] = useState(true);

  // Auto-rotate banner
  useEffect(() => {
    const timer = setInterval(() => setActiveBanner((i) => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  // Fetch seeded treks from Firestore via API
  useEffect(() => {
    fetch("/api/treks")
      .then((r) => r.json())
      .then((data) => {
        setTreks(Array.isArray(data) ? data.slice(0, 6) : []);
        setTreksLoading(false);
      })
      .catch(() => setTreksLoading(false));
  }, []);

  return (
    <div className="bg-kokan-cream/20">
      {/* Category pills */}
      <div className="bg-white border-b border-kokan-sand/20 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {TRAVEL_CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setActiveCategory(c.value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${activeCategory === c.value
                  ? "bg-kokan-green text-white"
                  : "bg-kokan-sand/20 text-kokan-earth/70 hover:bg-kokan-sand/30"
                }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5 space-y-8">

        {/* Banner */}
        <div>
          <div className="relative h-48 sm:h-56 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
            {BANNERS.map((banner, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  i === activeBanner ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Background image */}
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority={i === 0}
                  className="object-cover"
                />

                {/* Left gradient overlay — keeps text readable while right side stays completely vibrant */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                {/* Content: Name on left side top, Explore button at bottom */}
                <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between items-start max-w-[70%] sm:max-w-sm">
                  {/* Left Top */}
                  <div>
                    <span className="text-amber-300/95 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] drop-shadow-sm block mb-1">
                      {banner.sub}
                    </span>
                    <h3 className="text-white font-display font-bold text-xl sm:text-3xl leading-[1.15] drop-shadow-md tracking-tight">
                      {banner.title}
                    </h3>
                  </div>

                  {/* Left Bottom: Frosted transparent explore button */}
                  <Link
                    href={banner.href}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/35 shadow-sm transition-all hover:scale-105 active:scale-95"
                  >
                    {banner.cta} <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-1.5 mt-2.5">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                aria-label={`Go to banner ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === activeBanner
                    ? "w-5 h-1.5 bg-kokan-green"
                    : "w-1.5 h-1.5 bg-kokan-sand/40 hover:bg-kokan-sand/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Destinations */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-kokan-earth flex items-center gap-2">
              🏖️ Top Destinations
            </h2>
            <Link href="/destinations" className="text-xs text-kokan-green flex items-center gap-1 font-medium">
              See all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <HorizontalScroll>
            {DESTINATIONS.map((dest) => (
              <DestinationCard key={dest.slug} dest={dest} />
            ))}
          </HorizontalScroll>
        </div>

        {/* Treks — live from Firestore */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-kokan-earth flex items-center gap-2">
              🧗 Popular Treks
            </h2>
            <Link href="/treks" className="text-xs text-kokan-green flex items-center gap-1 font-medium">
              See all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <HorizontalScroll>
            {treksLoading
              ? Array.from({ length: 4 }).map((_, i) => <TrekCardSkeleton key={i} />)
              : treks.length > 0
                ? treks.map((trek) => <TrekCard key={trek.id} trek={trek} />)
                : (
                  <p className="text-sm text-kokan-earth/40 py-4">No treks available right now.</p>
                )
            }
          </HorizontalScroll>
        </div>

        {/* Quick links grid */}
        <div>
          <h2 className="font-semibold text-kokan-earth mb-3 flex items-center gap-2">
            <Compass className="w-4 h-4 text-kokan-green" /> Explore by Type
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Beaches", emoji: "🏖️", href: "/destinations?category=beach" },
              { label: "Treks", emoji: "🧗", href: "/treks" },
              { label: "Homestays", emoji: "🏡", href: "/listings?category=homestay" },
              { label: "Food Tours", emoji: "🍛", href: "/listings?category=food" },
              { label: "Water Sports", emoji: "🤿", href: "/listings?category=water" },
              { label: "Forts", emoji: "🏰", href: "/destinations?category=fort" },
              { label: "Temples", emoji: "🛕", href: "/destinations?category=temple" },
              { label: "Blogs", emoji: "📝", href: "/blogs" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-kokan-sand/30 hover:border-kokan-green/40 hover:bg-kokan-green/5 transition-all"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs text-kokan-earth/70 text-center leading-tight font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Plan your trip CTA */}
        <div className="bg-kokan-green rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">🗺️</div>
          <h3 className="font-playfair font-bold text-white text-xl mb-2">Plan Your Kokan Trip</h3>
          <p className="text-white/70 text-sm mb-4">Tell us your dates and budget — we&apos;ll build the perfect itinerary</p>
          <Link
            href="/trip-planner"
            className="inline-block bg-white text-kokan-green font-bold px-6 py-2.5 rounded-full text-sm hover:bg-kokan-cream transition-colors"
          >
            Start Planning →
          </Link>
        </div>

        {/* View all CTAs */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/destinations"
            className="flex items-center justify-center gap-2 py-3 border-2 border-kokan-green text-kokan-green rounded-2xl font-semibold text-sm hover:bg-kokan-green hover:text-white transition-colors"
          >
            All Destinations <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/treks"
            className="flex items-center justify-center gap-2 py-3 bg-kokan-green text-white rounded-2xl font-semibold text-sm hover:bg-kokan-green/90 transition-colors"
          >
            All Treks <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}