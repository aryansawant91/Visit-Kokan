"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, ShoppingBag, Package, Heart,
  User, LogOut, ChevronRight, Waves, Menu, X,BookOpen
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/bookings", label: "My Bookings", icon: ShoppingBag },
  { href: "/orders", label: "My Orders", icon: Package },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/dashboard/blogs", label: "My Blogs", icon: BookOpen },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { profile, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !profile) router.replace("/login");
  }, [loading, profile]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-kokan-cream/30 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-kokan-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = profile.displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

  return (
    <div className="min-h-screen bg-kokan-cream/20">
      {/* Mobile top bar */}
      <div className="lg:hidden bg-white border-b border-kokan-sand/40 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <span>🌿</span>
          <span className="font-playfair font-bold text-kokan-earth">Visit Kokan</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5 text-kokan-earth" /> : <Menu className="w-5 h-5 text-kokan-earth" />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className={`
          lg:block lg:w-72 flex-shrink-0
          ${mobileOpen ? "block fixed inset-0 z-40 bg-black/40" : "hidden"}
        `}>
          <div className={`
            lg:static lg:bg-transparent lg:p-0
            ${mobileOpen ? "absolute left-0 top-0 h-full w-72 bg-white p-4 overflow-y-auto" : ""}
          `}>
            {/* Profile card */}
            <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30 mb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-kokan-green flex items-center justify-center text-white font-bold text-xl">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-kokan-earth truncate">{profile.displayName}</p>
                  <p className="text-xs text-kokan-earth/50 truncate">{profile.email}</p>
                  <span className="inline-block mt-1 text-xs bg-kokan-green/10 text-kokan-green px-2 py-0.5 rounded-full font-medium capitalize">
                    {profile.role}
                  </span>
                </div>
              </div>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full py-2 border border-kokan-sand rounded-xl text-sm text-kokan-earth/60 hover:bg-kokan-sand/10 transition-colors"
              >
                <Waves className="w-3.5 h-3.5" />
                Back to Homepage
              </Link>
            </div>

            {/* Nav */}
            <div className="bg-white rounded-2xl border border-kokan-sand/30 overflow-hidden">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-5 py-3.5 text-sm transition-colors border-b border-kokan-sand/20 last:border-0 ${
                      active
                        ? "bg-kokan-green/5 text-kokan-green font-medium"
                        : "text-kokan-earth/60 hover:text-kokan-earth hover:bg-kokan-sand/10"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    {active && <ChevronRight className="w-4 h-4" />}
                  </Link>
                );
              })}
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full mt-4 px-5 py-3 rounded-2xl border border-kokan-sand/30 bg-white text-sm text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}