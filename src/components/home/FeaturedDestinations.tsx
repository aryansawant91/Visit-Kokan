"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

const FALLBACK = [
  { name: "Tarkarli", region: "Sindhudurg", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", slug: "tarkarli", tag: "Beach + Scuba" },
  { name: "Alibaug", region: "Raigad", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", slug: "alibaug", tag: "Forts + Beaches" },
  { name: "Ganpatipule", region: "Ratnagiri", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", slug: "ganpatipule", tag: "Temple + Sea" },
  { name: "Malvan", region: "Sindhudurg", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80", slug: "malvan", tag: "Seafood + History" },
  { name: "Dapoli", region: "Ratnagiri", image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80", slug: "dapoli", tag: "Offbeat + Serene" },
  { name: "Harihareshwar", region: "Raigad", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80", slug: "harihareshwar", tag: "Spiritual + Coast" },
];

export default function FeaturedDestinations() {
  const [destinations, setDestinations] = useState(FALLBACK);

  useEffect(() => {
    fetch("/api/destinations")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.slice(0, 6).map((d: any) => ({
            name: d.name,
            region: d.region,
            image: d.images?.[0] ?? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
            slug: d.slug,
            tag: d.category ?? "Explore",
          }));
          setDestinations(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-kokan-sand text-sm font-medium tracking-widest uppercase mb-2">
              Explore the Coast
            </p>
            <h2 className="text-4xl md:text-5xl font-display text-kokan-earth font-bold">
              Top Destinations
            </h2>
          </div>
          <Link
            href="/destinations"
            className="flex items-center gap-2 text-kokan-green font-medium hover:gap-3 transition-all"
          >
            View all destinations <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, i) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className={`group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ${
                i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""
              }`}
              style={{ minHeight: i === 0 ? "480px" : "240px" }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${dest.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-kokan-sand/90 text-white text-xs font-medium rounded-full">
                  {dest.tag}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-display text-2xl font-bold">{dest.name}</h3>
                <div className="flex items-center gap-1 text-white/70 text-sm mt-1">
                  <MapPin size={13} /> {dest.region}, Maharashtra
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}