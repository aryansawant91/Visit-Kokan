'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react'
import CartIcon from '@/components/cart/CartIcon'

const navLinks = [
  { label: 'Destinations', href: '/destinations' },
  { label: 'Treks', href: '/treks' },
  { label: 'Listings', href: '/listings' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Products', href: '/products' },
  { label: 'Trip Planner', href: '/trip-planner' },
]

export default function Navbar() {
  const { user, role, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  console.log(role);
  const dashboardHref =
    role === 'admin' ? '/admin/dashboard' :
    role === 'vendor' ? '/vendor/dashboard' :
    '/dashboard'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className={`text-2xl font-display font-bold tracking-wide ${
            scrolled ? 'text-kokan-green' : 'text-white'
          }`}>
            Visit<span className="text-kokan-sand">Kokan</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide hover:text-kokan-sand transition-colors ${
                scrolled ? 'text-gray-700' : 'text-white/90'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-4">

          {/* Cart */}
          <div className={scrolled ? '' : '[&_svg]:text-white [&_span]:bg-white [&_span]:text-kokan-green'}>
            <CartIcon />
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-2 text-sm font-medium ${
                  scrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-kokan-green text-white flex items-center justify-center text-xs font-bold">
                  {user.displayName?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <span>{user.displayName?.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-kokan-cream transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <LayoutDashboard size={15} />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-kokan-cream transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User size={15} />
                    Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setProfileOpen(false) }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className={`text-sm font-medium ${
                  scrolled ? 'text-gray-700' : 'text-white'
                } hover:text-kokan-sand transition-colors`}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 bg-kokan-sand text-white rounded-full text-sm font-medium hover:bg-kokan-sunset transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile — cart + hamburger */}
        <div className="lg:hidden flex items-center gap-3">
          <div className={scrolled ? '' : '[&_svg]:text-white [&_span]:bg-white [&_span]:text-kokan-green'}>
            <CartIcon />
          </div>
          <button
            className={scrolled ? 'text-gray-800' : 'text-white'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 font-medium py-2 border-b border-gray-50"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="flex-1 py-2 border border-kokan-green text-kokan-green rounded-full text-sm text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false) }}
                  className="flex-1 py-2 border border-red-300 text-red-600 rounded-full text-sm"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex-1 py-2 border border-kokan-green text-kokan-green rounded-full text-sm text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="flex-1 py-2 bg-kokan-sand text-white rounded-full text-sm text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}