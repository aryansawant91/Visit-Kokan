"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Store, MapPin, Package,
  BookOpen, BarChart3, LogOut, ChevronLeft, ChevronRight,
  Bell, Settings, ShieldCheck, Plus,Mountain,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/vendors", label: "Vendors", icon: Store },
  { href: "/admin/listings", label: "Listings", icon: MapPin },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/treks",label: "Treks",icon: Mountain },
  { href: "/admin/blogs", label: "Blogs", icon: BookOpen },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

// Pages that get an action button in the top bar
const pageActions: Record<string, { label: string; href: string }> = {
  "/admin/products": { label: "Add Product", href: "/admin/products/new" },
  "/admin/destinations": { label: "Add Destination", href: "/admin/destinations/new" },
  "/admin/treks":        { label: "Add Trek",        href: "/admin/treks/new" },
  "/admin/listings":     { label: "Add Listing",     href: "/admin/listings/new" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const currentAction = pageActions[pathname];

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex font-['DM_Sans',sans-serif]">
      {/* Sidebar */}
      <aside className={`relative flex flex-col bg-[#141414] border-r border-white/5 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-[#2ecc71] flex items-center justify-center shrink-0">
            <ShieldCheck size={16} className="text-black" />
          </div>
          {!collapsed && (
            <span className="text-white font-semibold text-sm tracking-wide truncate">Kokan Admin</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative ${
                  active
                    ? "bg-[#2ecc71]/10 text-[#2ecc71]"
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <Icon size={16} className="shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
                {collapsed && (
                  <div className="absolute left-16 bg-[#1a1a1a] text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-white/10">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-3 border-t border-white/5 space-y-0.5">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
          >
            <Settings size={16} />
            {!collapsed && <span>Settings</span>}
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={16} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#1e1e1e] border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-[#141414] border-b border-white/5 flex items-center justify-between px-6">
          <p className="text-white/30 text-sm">
            {navItems.find((n) => pathname.startsWith(n.href))?.label ?? "Admin"}
          </p>
          <div className="flex items-center gap-4">

            {/* ← ADD PRODUCT BUTTON — only shows on /admin/products */}
            {currentAction && (
              <Link
                href={currentAction.href}
                className="flex items-center gap-1.5 bg-[#2ecc71] text-black text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#2ecc71]/90 transition-colors"
              >
                <Plus size={13} />
                {currentAction.label}
              </Link>
            )}

            <button className="relative text-white/40 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#2ecc71] rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#2ecc71]/20 flex items-center justify-center text-[#2ecc71] text-xs font-semibold">
                {user?.email?.[0]?.toUpperCase() ?? "A"}
              </div>
              <span className="text-white/60 text-xs">{user?.email}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}