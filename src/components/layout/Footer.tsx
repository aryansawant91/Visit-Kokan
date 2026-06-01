import Link from 'next/link'
import { Instagram, Facebook, Youtube, MapPin } from 'lucide-react'

const links = {
  Explore: [
    { label: 'Destinations', href: '/destinations' },
    { label: 'Treks', href: '/treks' },
    { label: 'Listings', href: '/listings' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Products', href: '/products' },
  ],
  Plan: [
    { label: 'Trip Planner', href: '/trip-planner' },
    { label: 'Search', href: '/search' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'About', href: '/about' },
  ],
  Partner: [
    { label: 'List Your Business', href: '/vendor/register' },
    { label: 'Vendor Login', href: '/login' },
    { label: 'Vendor Dashboard', href: '/vendor/dashboard' },
  ],
}

const socials = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/visitkokan' },
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/visitkokan' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@visitkokan' },
]

export default function Footer() {
  return (
    <footer className="bg-kokan-earth text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-12">

        {/* Mobile: brand left, links right */}
        <div className="flex gap-4 md:grid md:grid-cols-4 md:gap-8">

          {/* Brand */}
          <div className="flex-shrink-0 w-36 md:w-auto md:col-span-1">
            <h3 className="text-base md:text-2xl font-playfair font-bold mb-1 md:mb-3">
              Visit<span className="text-kokan-sand">Kokan</span>
            </h3>
            <p className="text-white/60 text-xs leading-snug mb-2 hidden md:block">
              Your guide to the pristine Konkan coast — beaches, forts, food and unforgettable experiences.
            </p>
            <div className="flex items-center gap-1 text-white/40 text-xs mb-2">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span>Ratnagiri, MH</span>
            </div>
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-kokan-sand transition-colors"
                >
                  <Icon className="w-3 h-3 md:w-4 md:h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links — scroll horizontally on mobile */}
          <div className="flex gap-5 overflow-x-auto flex-1 md:contents scrollbar-none">
            {Object.entries(links).map(([group, items]) => (
              <div key={group} className="min-w-max md:min-w-0">
                <h4 className="text-xs font-semibold tracking-widest uppercase text-kokan-sand mb-2 md:mb-4">
                  {group}
                </h4>
                <ul className="space-y-1 md:space-y-2.5">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-white/60 text-xs hover:text-white transition-colors whitespace-nowrap">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-4 md:mt-10 pt-3 md:pt-6 flex flex-row justify-between items-center gap-2">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Visit Kokan
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-white/40 text-xs hover:text-white/70 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-white/40 text-xs hover:text-white/70 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}