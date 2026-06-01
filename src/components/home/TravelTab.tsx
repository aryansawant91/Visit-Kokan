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
  { title: "Monsoon Special", highlight: "Trek Season is Here", sub: "Best treks in Sahyadri range", cta: "Explore Treks", href: "/treks", bg: "from-emerald-700 to-kokan-green", emoji: "🧗" },
  { title: "Weekend Getaway", highlight: "Hidden Beach Stays", sub: "Beachside homestays from ₹999/night", cta: "Find Homestays", href: "/listings", bg: "from-kokan-earth to-amber-700", emoji: "🏡" },
  { title: "Explore Kokan", highlight: "Top Destinations", sub: "Discover 50+ coastal gems", cta: "View Destinations", href: "/destinations", bg: "from-blue-600 to-teal-600", emoji: "🏖️" },
];

const difficultyColor: Record<string, string> = {
  easy:     "bg-green-100 text-green-700",
  moderate: "bg-amber-100 text-amber-700",
  hard:     "bg-red-100 text-red-700",
  expert:   "bg-red-200 text-red-800",
  // capitalised fallbacks (just in case)
  Easy:     "bg-green-100 text-green-700",
  Moderate: "bg-amber-100 text-amber-700",
  Hard:     "bg-red-100 text-red-700",
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
            </span>
            <span className="text-xs text-kokan-earth/40">/ person</span>
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
  const [activeBanner, setActiveBanner]     = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [treks, setTreks]                   = useState<Trek[]>([]);
  const [treksLoading, setTreksLoading]     = useState(true);

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
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                activeCategory === c.value
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
          {BANNERS.map((banner, i) => (
            <div key={i} className={i === activeBanner ? "block" : "hidden"}>
              <div className={`bg-gradient-to-r ${banner.bg} p-6 rounded-2xl flex items-center justify-between`}>
                <div>
                  <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">{banner.title}</p>
                  <h3 className="text-white font-playfair font-bold text-xl mb-2">{banner.highlight}</h3>
                  <p className="text-white/70 text-xs mb-3">{banner.sub}</p>
                  <Link
                    href={banner.href}
                    className="inline-block bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                  >
                    {banner.cta}
                  </Link>
                </div>
                <div className="text-6xl">{banner.emoji}</div>
              </div>
            </div>
          ))}
          <div className="flex justify-center gap-1.5 mt-2">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                className={`rounded-full transition-all ${i === activeBanner ? "w-5 h-1.5 bg-kokan-green" : "w-1.5 h-1.5 bg-kokan-sand/40"}`}
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
              { label: "Beaches",     emoji: "🏖️", href: "/destinations?category=beach" },
              { label: "Treks",       emoji: "🧗", href: "/treks" },
              { label: "Homestays",   emoji: "🏡", href: "/listings?category=homestay" },
              { label: "Food Tours",  emoji: "🍛", href: "/listings?category=food" },
              { label: "Water Sports",emoji: "🤿", href: "/listings?category=water" },
              { label: "Forts",       emoji: "🏰", href: "/destinations?category=fort" },
              { label: "Temples",     emoji: "🛕", href: "/destinations?category=temple" },
              { label: "Blogs",       emoji: "📝", href: "/blogs" },
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
          <p className="text-white/70 text-sm mb-4">Tell us your dates and budget — we'll build the perfect itinerary</p>
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