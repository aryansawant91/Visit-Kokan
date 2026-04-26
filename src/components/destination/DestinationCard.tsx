import Link from "next/link";
import { MapPin, Sun } from "lucide-react";
import { Destination } from "@/types/destination";
import { DESTINATION_CATEGORIES } from "@/constants/destinationConstants";

interface Props {
  destination: Destination;
  featured?: boolean;
}

export default function DestinationCard({ destination: d, featured = false }: Props) {
  const category = DESTINATION_CATEGORIES.find((c) => c.value === d.category);
  const image = d.images?.[0] ?? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";

  return (
    <Link
      href={`/destinations/${d.slug}`}
      className={`group relative overflow-hidden rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 block ${
        featured ? "min-h-[520px]" : "min-h-[280px]"
      }`}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <span className="px-3 py-1.5 bg-white/15 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
          {category?.emoji} {category?.label ?? d.category}
        </span>
        {d.featured && (
          <span className="px-3 py-1.5 bg-kokan-sand/90 text-white text-xs font-semibold rounded-full">
            ⭐ Featured
          </span>
        )}
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {d.bestSeason && (
          <div className="flex items-center gap-1.5 text-white/60 text-xs mb-2">
            <Sun size={11} />
            Best: {d.bestSeason}
          </div>
        )}
        <h3 className={`text-white font-display font-bold leading-tight ${featured ? "text-3xl" : "text-xl"}`}>
          {d.name}
        </h3>
        <div className="flex items-center gap-1 text-white/70 text-sm mt-1">
          <MapPin size={13} /> {d.region}, Maharashtra
        </div>

        {/* Highlights pills */}
        {d.highlights?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {d.highlights.slice(0, 3).map((h) => (
              <span
                key={h}
                className="px-2 py-0.5 bg-white/10 backdrop-blur-sm text-white/80 text-xs rounded-full border border-white/15"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Hover CTA */}
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-kokan-sand text-sm font-semibold">
            Explore destination →
          </span>
        </div>
      </div>
    </Link>
  );
}