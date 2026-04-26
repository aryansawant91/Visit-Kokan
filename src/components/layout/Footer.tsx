import Link from 'next/link'

const links = {
  Explore: [
    { label: 'Destinations', href: '/destinations' },
    { label: 'Treks', href: '/treks' },
    { label: 'Listings', href: '/listings' },
    { label: 'Blogs', href: '/blogs' },
  ],
  Plan: [
    { label: 'Trip Planner', href: '/trip-planner' },
    { label: 'Search', href: '/search' },
    { label: 'Contact', href: '/contact' },
    { label: 'About', href: '/about' },
  ],
  Partner: [
    { label: 'List your business', href: '/vendor/register' },
    { label: 'Vendor login', href: '/login' },
    { label: 'Vendor dashboard', href: '/vendor/dashboard' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-kokan-earth text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-display font-bold mb-4">
              Visit<span className="text-kokan-sand">Kokan</span>
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Your guide to the pristine Konkan coast — beaches, forts, food and unforgettable experiences.
            </p>
            <div className="flex gap-3">
              {['Instagram', 'Facebook', 'YouTube'].map((s) => (
                <span
                  key={s}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs hover:bg-kokan-sand transition-colors cursor-pointer"
                >
                  {s[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-sm font-medium tracking-widest uppercase text-kokan-sand mb-5">{group}</h4>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-white/60 text-sm hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} VisitKokan. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-white/40 text-sm hover:text-white/70 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-white/40 text-sm hover:text-white/70 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}