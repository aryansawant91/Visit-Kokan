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
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-3">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span className="font-playfair font-bold text-white text-base sm:text-lg leading-none">
            Visit<span className="text-kokan-sand">Kokan</span>
          </span>
        </Link>

        {/* Modern Pill Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 min-w-0 flex items-center bg-white rounded-full pl-2.5 sm:pl-3 pr-1 py-1 shadow-xs border border-white/80 focus-within:ring-2 focus-within:ring-emerald-400/30 transition-all"
        >
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2D6A4F] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search Kokan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-0 px-2 py-0.5 text-xs sm:text-sm text-gray-800 outline-none placeholder:text-gray-400 bg-transparent font-medium"
          />
          <button
            type="submit"
            className="hidden sm:inline-flex px-3.5 py-1.5 bg-gradient-to-r from-[#B7895A] to-[#C77B3F] hover:brightness-105 active:scale-95 text-white text-xs font-semibold rounded-full transition-all shadow-2xs flex-shrink-0 items-center justify-center"
          >
            Search
          </button>
        </form>

        {/* Cart + Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <div className="[&_svg]:text-white [&_span]:bg-white [&_span]:text-kokan-green flex items-center">
            <CartIcon />
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1 text-white text-xs font-medium bg-white/10 hover:bg-white/20 p-1 sm:px-2 sm:py-1 rounded-full transition-colors"
                aria-label="User Profile"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/25 flex items-center justify-center text-white text-xs font-bold">
                  {user.displayName?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="hidden md:block max-w-[80px] truncate">
                  {user.displayName?.split(" ")[0]}
                </span>
                <ChevronDown className="w-3 h-3 hidden sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border border-kokan-sand/20 overflow-hidden z-50">
                  <div className="px-4 py-2 border-b border-gray-100 bg-kokan-cream/50">
                    <p className="text-xs font-semibold text-kokan-earth truncate">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-[10px] text-gray-500 capitalize">{role || "Traveler"}</p>
                  </div>
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
              className="flex items-center gap-1 text-white text-xs font-semibold bg-white/20 hover:bg-white/30 px-2.5 sm:px-3 py-1.5 rounded-full transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}