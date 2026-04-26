'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, MapPin, ChevronDown } from 'lucide-react'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80',
    title: 'Where the Sahyadris',
    highlight: 'Meet the Sea',
    sub: 'Discover the untouched beauty of the Konkan coast',
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
    title: 'Ancient Forts,',
    highlight: 'Endless Horizons',
    sub: 'Trek through history along the Konkan shoreline',
  },
  {
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80',
    title: 'Taste the Soul',
    highlight: 'of Konkan',
    sub: 'Fresh seafood, kokum curries and coastal warmth',
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[current]

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">

      {/* Background image */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(${s.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-3">
          <span className="inline-block px-4 py-1 bg-kokan-sand/80 text-white text-xs font-medium rounded-full tracking-widest uppercase">
            Discover Konkan
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-display text-white font-bold leading-tight mb-4">
          {slide.title}
          <br />
          <span className="text-kokan-sand">{slide.highlight}</span>
        </h1>

        <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto">
          {slide.sub}
        </p>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8">
          <div className="flex-1 flex items-center gap-3 bg-white rounded-full px-5 py-3 shadow-xl">
            <MapPin size={18} className="text-kokan-sand shrink-0" />
            <input
              type="text"
              placeholder="Where in Kokan do you want to go?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-gray-700 text-sm outline-none bg-transparent placeholder:text-gray-400"
            />
          </div>
          <Link
            href={`/search?q=${search}`}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-kokan-sand text-white rounded-full font-medium hover:bg-kokan-sunset transition-colors shadow-xl"
          >
            <Search size={16} />
            Explore
          </Link>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-3">
          {['Beaches', 'Forts', 'Homestays', 'Treks', 'Food Tours'].map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${tag}`}
              className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full text-sm hover:bg-white/30 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-8 h-2 bg-kokan-sand' : 'w-2 h-2 bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown size={28} className="text-white/60" />
      </div>
    </section>
  )
}