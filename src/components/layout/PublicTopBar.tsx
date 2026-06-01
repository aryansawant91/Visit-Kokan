"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import CartIcon from "@/components/cart/CartIcon";
import { useState } from "react";

export default function PublicTopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  // Detect if this is a detail page (has slug)
  const segments = pathname.split("/").filter(Boolean);
  const isDetailPage = segments.length >= 2;

  const dashboardHref =
    role === "admin" ? "/admin/dashboard" :
    role === "vendor" ? "/vendor/dashboard" :
    "/dashboard";

  // Back label based on current page
  const backLabel = () => {
    if (pathname.includes("/destinations/")) return "Destinations";
    if (pathname.includes("/products/")) return "Products";
    if (pathname.includes("/treks/")) return "Treks";
    if (pathname.includes("/blogs/")) return "Blogs";
    if (pathname.includes("/listings/")) return "Listings";
    return "Back";
  };

  return (
    <div className="bg-kokan-green sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-3 py-2.5 flex items-center gap-3">

        {/* Left: Back button on detail pages, Logo on browse pages */}
        {isDetailPage ? (
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-white flex-shrink-0 hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{backLabel()}</span>
          </button>
        ) : (
          <Link href="/" className="flex-shrink-0">
            <span className="font-playfair font-bold text-white text-lg leading-none">
              Visit<span className="text-kokan-sand">Kokan</span>
            </span>
          </Link>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: Cart + Profile */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="[&_svg]:text-white [&_span]:bg-white [&_span]:text-kokan-green">
            <CartIcon />
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1 text-white"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                  {user.displayName?.[0]?.toUpperCase() ?? "U"}
                </div>
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