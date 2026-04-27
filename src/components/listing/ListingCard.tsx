import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { Listing } from "@/types/listing";
import { LISTING_CATEGORIES } from "@/constants/listingConstants";

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const category = LISTING_CATEGORIES.find((c) => c.value === listing.category);
  const image = listing.images?.[0] ??
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={image}
          alt={listing.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-kokan-earth rounded-full">
            {category?.emoji} {category?.label}
          </span>
          {listing.featured && (
            <span className="px-2.5 py-1 bg-kokan-sand text-white text-xs font-semibold rounded-full">
              ⭐ Featured
            </span>
          )}
        </div>
        {listing.addedByAdmin && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 bg-kokan-green text-white text-xs font-semibold rounded-full">
              Official
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-kokan-earth text-lg leading-tight group-hover:text-kokan-green transition-colors">
            {listing.name}
          </h3>
          {listing.rating > 0 && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-kokan-earth">{listing.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({listing.reviewCount})</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
          <MapPin size={12} /> {listing.region}, Maharashtra
        </div>

        <p className="text-gray-500 text-sm mt-2 line-clamp-2 flex-1">{listing.description}</p>

        {listing.amenities && listing.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {listing.amenities.slice(0, 3).map((a) => (
              <span key={a} className="text-xs bg-kokan-cream/60 text-kokan-earth/70 px-2 py-0.5 rounded-full">
                {a}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          {listing.price ? (
            <div>
              <span className="text-kokan-green font-bold text-lg">
                ₹{listing.price.toLocaleString("en-IN")}
              </span>
              <span className="text-gray-400 text-xs ml-1">{listing.priceUnit}</span>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">Price on request</span>
          )}
          <span className="flex items-center gap-1 text-kokan-green text-sm font-medium group-hover:gap-2 transition-all">
            View <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}