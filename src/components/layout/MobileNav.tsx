"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Mountain, ShoppingBag, Sparkles } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  // Hide mobile nav on admin or vendor dashboards
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/vendor")) {
    return null;
  }

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Destinations",
      href: "/destinations",
      icon: Compass,
      isActive: pathname?.startsWith("/destinations"),
    },
    {
      label: "Treks",
      href: "/treks",
      icon: Mountain,
      isActive: pathname?.startsWith("/treks"),
    },
    {
      label: "Products",
      href: "/products",
      icon: ShoppingBag,
      isActive: pathname?.startsWith("/products"),
    },
    {
      label: "Plan Trip",
      href: "/trip-planner",
      icon: Sparkles,
      isActive: pathname?.startsWith("/trip-planner"),
      highlight: true,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e2ede4] shadow-lg py-1 px-2 pb-[env(safe-area-inset-bottom,4px)] flex items-center justify-around"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.isActive;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all rounded-xl select-none ${
              active
                ? "text-[#2D6A4F] font-bold"
                : "text-gray-500 hover:text-gray-900 font-medium"
            }`}
          >
            <div
              className={`relative flex items-center justify-center w-9 h-7 rounded-full transition-all ${
                active
                  ? item.highlight
                    ? "bg-[#b8dc26]/30 text-[#142607]"
                    : "bg-[#2D6A4F]/10 text-[#2D6A4F]"
                  : ""
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${
                  active ? "scale-110" : "scale-100"
                } ${item.highlight && active ? "text-[#142607]" : ""}`}
              />
            </div>
            <span
              className={`text-[10px] tracking-tight leading-tight mt-0.5 truncate max-w-[64px] ${
                active ? "font-bold text-[#2D6A4F]" : "text-gray-500"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

