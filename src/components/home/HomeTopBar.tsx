"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, User, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import CartIcon from "@/components/cart/CartIcon";

export default function HomeTopBar() {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const dashboardHref =
    role === "admin" ? "/admin/dashboard" :
    role === "vendor" ? "/vendor/dashboard" :
    "/dashboard";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <div className="bg-kokan-green sticky top-0 z-50 shadow-md">
      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-3 py-2.5 flex items-center gap-3">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span className="font-playfair font-bold text-white text-lg leading-none">
            Visit<span className="text-kokan-sand">Kokan</span>
          </span>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center bg-white rounded-lg overflow-hidden shadow-sm">
          <Search className="w-4 h-4 text-kokan-earth/40 ml-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search products, treks, destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 text-sm text-kokan-earth outline-none placeholder:text-kokan-earth/40 bg-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-kokan-sand text-white text-xs font-semibold hover:bg-kokan-earth transition-colors"
          >
            Search
          </button>
        </form>

        {/* Cart + Profile */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="[&_svg]:text-white [&_span]:bg-white [&_span]:text-kokan-green">
            <CartIcon />
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 text-white text-xs font-medium"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                  {user.displayName?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="hidden sm:block max-w-[80px] truncate">
                  {user.displayName?.split(" ")[0]}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border border-kokan-sand/20 overflow-hidden z-50">
                  <Link
                    href={dashboardHref}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-kokan-earth hover:bg-kokan-cream transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 text-white text-xs font-medium bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors"
            >
              <User className="w-3.5 h-3.5" /> Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}