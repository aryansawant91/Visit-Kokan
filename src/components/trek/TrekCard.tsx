import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Ruler, Users } from "lucide-react";
import { Trek } from "@/types/trek";
import { TREK_CATEGORIES } from "@/constants/trekConstants";
import TrekDifficultyBadge from "./TrekDifficultyBadge";

interface Props {
  trek: Trek;
  featured?: boolean;
}

export default function TrekCard({ trek, featured = false }: Props) {
  const category = TREK_CATEGORIES.find((c) => c.value === trek.category);
  const image = trek.images?.[0] ??
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";

  return (
    <Link
      href={`/treks/${trek.slug}`}
      className={`group relative overflow-hidden rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 block ${
        featured ? "min-h-[480px]" : "min-h-[320px]"
      }`}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <span className="px-3 py-1.5 bg-white/15 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
          {category?.emoji} {category?.label}
        </span>
        {trek.featured && (
          <span className="px-3 py-1.5 bg-kokan-sand/90 text-white text-xs font-semibold rounded-full">
            ⭐ Featured
          </span>
        )}
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <TrekDifficultyBadge difficulty={trek.difficulty} size="sm" />
        <h3 className={`text-white font-display font-bold leading-tight mt-2 ${
          featured ? "text-3xl" : "text-xl"
        }`}>
          {trek.name}
        </h3>
        <div className="flex items-center gap-1 text-white/60 text-sm mt-1">
          <MapPin size={12} /> {trek.region}, Maharashtra
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className="flex items-center gap-1 text-white/70 text-xs">
            <Clock size={11} /> {trek.duration}
          </span>
          <span className="flex items-center gap-1 text-white/70 text-xs">
            <Ruler size={11} /> {trek.distance}
          </span>
          {trek.groupSize && (
            <span className="flex items-center gap-1 text-white/70 text-xs">
              <Users size={11} /> {trek.groupSize}
            </span>
          )}
          {trek.price && (
            <span className="ml-auto text-kokan-sand font-bold text-sm">
              ₹{trek.price.toLocaleString("en-IN")}
              <span className="text-white/50 font-normal text-xs">/person</span>
            </span>
          )}
        </div>

        {/* Hover CTA */}
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-kokan-sand text-sm font-semibold">
            View trek details →
          </span>
        </div>
      </div>
    </Link>
  );
}