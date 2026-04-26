import Link from 'next/link'
import { ArrowRight, Star, MapPin } from 'lucide-react'

const listings = [
  {
    title: 'Kokan Pearl Homestay',
    slug: 'kokan-pearl-homestay',
    category: 'Homestay',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    location: 'Tarkarli',
    rating: 4.8,
    reviews: 124,
    price: 2200,
  },
  {
    title: 'Malvan Fish Feast',
    slug: 'malvan-fish-feast',
    category: 'Food Experience',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    location: 'Malvan',
    rating: 4.9,
    reviews: 89,
    price: 650,
  },
  {
    title: 'Seaside Tent Camp',
    slug: 'seaside-tent-camp',
    category: 'Camping',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
    location: 'Dapoli',
    rating: 4.7,
    reviews: 56,
    price: 1800,
  },
  {
    title: 'Konkan Kayaking Tour',
    slug: 'konkan-kayaking-tour',
    category: 'Experience',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    location: 'Ganpatipule',
    rating: 4.6,
    reviews: 43,
    price: 1200,
  },
]

export default function PopularListings() {
  return (
    <section className="py-20 bg-kokan-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-kokan-sand text-sm font-medium tracking-widest uppercase mb-2">
              Top Picks
            </p>
            <h2 className="text-4xl md:text-5xl font-display text-kokan-earth font-bold">
              Popular Listings
            </h2>
          </div>
          <Link
            href="/listings"
            className="flex items-center gap-2 text-kokan-green font-medium hover:gap-3 transition-all"
          >
            Browse all <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Link
              key={listing.slug}
              href={`/listings/${listing.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${listing.image})` }}
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-white/90 text-kokan-earth text-xs font-medium rounded-full">
                    {listing.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-display font-bold text-kokan-earth text-base mb-1 group-hover:text-kokan-green transition-colors line-clamp-1">
                  {listing.title}
                </h3>

                <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                  <MapPin size={12} />
                  {listing.location}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-gray-700">{listing.rating}</span>
                    <span className="text-xs text-gray-400">({listing.reviews})</span>
                  </div>
                  <div className="text-right">
                    <p className="text-kokan-green font-bold text-sm">
                      ₹{listing.price.toLocaleString()}
                      <span className="text-xs text-gray-400 font-normal">/night</span>
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}