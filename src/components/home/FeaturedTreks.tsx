import Link from 'next/link'
import { ArrowRight, Clock, Users, TrendingUp } from 'lucide-react'

const treks = [
  {
    title: 'Vijaydurg Fort Trek',
    slug: 'vijaydurg-fort-trek',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    duration: '1 Day',
    difficulty: 'Easy',
    groupSize: '2–15',
    price: 799,
    region: 'Sindhudurg',
  },
  {
    title: 'Kaldurg Night Trek',
    slug: 'kaldurg-night-trek',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    duration: '2 Days',
    difficulty: 'Moderate',
    groupSize: '4–20',
    price: 1499,
    region: 'Raigad',
  },
  {
    title: 'Coastal Trail — Tarkarli',
    slug: 'coastal-trail-tarkarli',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    duration: '3 Days',
    difficulty: 'Easy',
    groupSize: '2–12',
    price: 2999,
    region: 'Sindhudurg',
  },
]

const difficultyColor: Record<string, string> = {
  Easy: 'bg-green-100 text-green-700',
  Moderate: 'bg-amber-100 text-amber-700',
  Hard: 'bg-red-100 text-red-700',
}

export default function FeaturedTreks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-kokan-sand text-sm font-medium tracking-widest uppercase mb-2">
              Get Moving
            </p>
            <h2 className="text-4xl md:text-5xl font-display text-kokan-earth font-bold">
              Featured Treks
            </h2>
          </div>
          <Link
            href="/treks"
            className="flex items-center gap-2 text-kokan-green font-medium hover:gap-3 transition-all"
          >
            All treks <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {treks.map((trek) => (
            <Link
              key={trek.slug}
              href={`/treks/${trek.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${trek.image})` }}
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColor[trek.difficulty]}`}>
                    {trek.difficulty}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 bg-white/90 rounded-full text-xs font-medium text-kokan-earth">
                    {trek.region}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-display font-bold text-kokan-earth text-lg mb-3 group-hover:text-kokan-green transition-colors">
                  {trek.title}
                </h3>

                <div className="flex items-center gap-4 text-gray-500 text-xs mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> {trek.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={13} /> {trek.groupSize}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp size={13} /> {trek.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400">From</span>
                    <p className="text-kokan-green font-bold text-lg">
                      ₹{trek.price.toLocaleString()}
                      <span className="text-xs text-gray-400 font-normal"> /person</span>
                    </p>
                  </div>
                  <span className="px-4 py-2 bg-kokan-green text-white text-xs font-medium rounded-full group-hover:bg-kokan-teal transition-colors">
                    Book Now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}