"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Package,
  Calendar,
  BarChart3,
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Plus,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const vendorNavItems = [
  { href: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vendor/listings", label: "My Stays & Homestays", icon: MapPin },
  { href: "/vendor/products", label: "Regional Products", icon: Package },
  { href: "/vendor/bookings", label: "Bookings & Inquiries", icon: Calendar },
  { href: "/vendor/analytics", label: "Performance", icon: BarChart3 },
  { href: "/vendor/profile", label: "Host Profile & Payouts", icon: Building2 },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Standalone pages that do not use the host dashboard chrome
  if (pathname === "/vendor/register" || pathname === "/vendor/pending") {
    return <>{children}</>;
  }

  const hostName =
    profile?.businessName ||
    profile?.displayName ||
    user?.displayName ||
    "Host Partner";

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col lg:flex-row font-['DM_Sans',sans-serif]">
      {/* ── Mobile Top Bar ── */}
      <header className="lg:hidden bg-[#141414] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/vendor/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2ecc71] flex items-center justify-center text-black font-bold text-base">
              🏡
            </div>
            <div>
              <span className="font-bold text-sm text-white block leading-tight">
                Kokan Host
              </span>
              <span className="text-[10px] text-[#2ecc71] font-semibold block leading-tight">
                Host Portal
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/vendor/listings/new"
            className="px-3 py-1.5 rounded-full bg-[#2ecc71] text-black text-xs font-bold flex items-center gap-1 hover:bg-[#27ae60] transition-colors"
          >
            <Plus size={14} />
            <span>Add Stay</span>
          </Link>
        </div>
      </header>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-xs flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 bg-[#141414] h-full flex flex-col p-4 shadow-2xl border-r border-white/10 animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2ecc71] flex items-center justify-center text-black font-bold text-sm">
                  🏡
                </div>
                <div>
                  <p className="font-bold text-sm text-white truncate max-w-[150px]">
                    {hostName}
                  </p>
                  <p className="text-[10px] text-[#2ecc71] font-medium flex items-center gap-1">
                    <ShieldCheck size={11} /> Verified Host
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {vendorNavItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-[#2ecc71]/15 text-[#2ecc71] font-bold"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink size={14} /> Visit Public Site
                </span>
                <span>↗</span>
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col bg-[#141414] border-r border-white/10 shrink-0 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } sticky top-0 h-screen`}
      >
        {/* Host Brand Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
          <Link href="/vendor/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#2ecc71] flex items-center justify-center text-black text-lg font-bold shrink-0 shadow-xs shadow-[#2ecc71]/20">
              🏡
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="text-white font-bold text-sm tracking-tight block truncate">
                  Kokan Host
                </span>
                <span className="text-[10px] text-[#2ecc71] font-bold uppercase tracking-wider block">
                  Partner Portal
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle collapse"
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Host Identity Card */}
        {!collapsed && (
          <div className="px-4 py-3 mx-3 my-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2ecc71]/20 text-[#2ecc71] font-bold text-xs flex items-center justify-center shrink-0">
              {hostName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {hostName}
              </p>
              <p className="text-[10px] text-[#2ecc71] font-semibold flex items-center gap-1 mt-0.5">
                <Sparkles size={10} /> Verified Partner
              </p>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {vendorNavItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  active
                    ? "bg-[#2ecc71]/15 text-[#2ecc71] font-bold"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
                {collapsed && (
                  <div className="absolute left-16 bg-[#1f1f1f] text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-white/10 shadow-lg">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Shortcuts */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {!collapsed ? (
            <div className="space-y-1.5">
              <Link
                href="/vendor/listings/new"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#2ecc71] hover:bg-[#27ae60] text-black font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus size={15} />
                <span>Add Homestay / Stay</span>
              </Link>
              <Link
                href="/vendor/products/new"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white/5 hover:bg-white/10 text-white/80 font-semibold text-xs rounded-xl transition-colors cursor-pointer border border-white/10"
              >
                <Plus size={14} />
                <span>Add Regional Product</span>
              </Link>
            </div>
          ) : (
            <Link
              href="/vendor/listings/new"
              className="w-full flex items-center justify-center py-2.5 bg-[#2ecc71] text-black rounded-xl cursor-pointer"
              title="Add Stay"
            >
              <Plus size={16} />
            </Link>
          )}

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
              title="Visit site"
            >
              <ExternalLink size={13} />
              {!collapsed && <span>Visit Site</span>}
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1"
              title="Logout"
            >
              <LogOut size={13} />
              {!collapsed && <span>Exit</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Dashboard Workspace ── */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
