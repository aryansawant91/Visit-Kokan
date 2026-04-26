import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'

const blogs = [
  {
    title: '10 Hidden Beaches in Kokan You\'ve Never Heard Of',
    slug: '10-hidden-beaches-kokan',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    category: 'Travel Guide',
    readTime: 6,
    excerpt: 'Beyond Tarkarli and Ganpatipule lies a string of secret beaches waiting to be discovered.',
  },
  {
    title: 'The Complete Malvani Food Guide for First-Timers',
    slug: 'malvani-food-guide',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    category: 'Food',
    readTime: 8,
    excerpt: 'From Sol Kadhi to Bombil Fry — everything you must eat on your first Konkan trip.',
  },
  {
    title: 'Monsoon Trekking in Kokan: What to Know',
    slug: 'monsoon-trekking-kokan',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    category: 'Trekking',
    readTime: 5,
    excerpt: 'The rains transform Kokan into a green paradise — here\'s how to trek it safely.',
  },
]

export default function LatestBlogs() {
  return (
    <section className="py-20 bg-kokan-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-kokan-sand text-sm font-medium tracking-widest uppercase mb-2">
              Stories from the Coast
            </p>
            <h2 className="text-4xl md:text-5xl font-display text-kokan-earth font-bold">
              Latest from the Blog
            </h2>
          </div>
          <Link
            href="/blogs"
            className="flex items-center gap-2 text-kokan-green font-medium hover:gap-3 transition-all"
          >
            All stories <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {blogs.map((blog, i) => (
            <Link
              key={blog.slug}
              href={`/blogs/${blog.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className={`relative overflow-hidden ${i === 0 ? 'h-56' : 'h-44'}`}>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${blog.image})` }}
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-white/90 text-kokan-earth text-xs font-medium rounded-full">
                    {blog.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-display font-bold text-kokan-earth text-base mb-2 group-hover:text-kokan-green transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{blog.excerpt}</p>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Clock size={12} />
                  {blog.readTime} min read
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}