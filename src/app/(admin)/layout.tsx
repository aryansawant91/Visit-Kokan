"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  MapPin,
  Package,
  BookOpen,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  ShieldCheck,
  Plus,
  Mountain,
  ShoppingBag,
  Flame,
  Tag,
  IndianRupee,
  Megaphone,
  CalendarDays,
  Send,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SubNavItem {
  href: string;
  label: string;
  icon?: any;
}

interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon: any;
  subItems?: SubNavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "OPERATIONS",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "orders",
        label: "Orders & Batches",
        href: "/admin/orders",
        icon: ShoppingBag,
      },
    ],
  },
  {
    title: "TRAVEL & EXPEDITIONS",
    items: [
      {
        id: "travel",
        label: "Travel & Treks",
        icon: Mountain,
        subItems: [
          { href: "/admin/treks", label: "Treks Management", icon: Mountain },
          { href: "/admin/destinations", label: "Destinations", icon: MapPin },
          { href: "/admin/listings", label: "Homestays & Stays", icon: Store },
        ],
      },
      {
        id: "ecommerce",
        label: "Shop & Products",
        icon: Package,
        subItems: [
          { href: "/admin/products", label: "Products Catalog", icon: Package },
          { href: "/admin/vendors", label: "Vendors & Artisans", icon: Store },
        ],
      },
    ],
  },
  {
    title: "MARKETING & GROWTH",
    items: [
      {
        id: "marketing",
        label: "Marketing Suite",
        icon: Megaphone,
        subItems: [
          { href: "/admin/marketing", label: "Marketing Hub", icon: BarChart3 },
          { href: "/admin/marketing/messages", label: "Send Trek Messages", icon: Send },
          { href: "/admin/marketing/content-calendar", label: "Content Calendar", icon: CalendarDays },
          { href: "/admin/marketing/leads", label: "Trek Enquiries", icon: Users },
          { href: "/admin/coupons", label: "Coupons & Deals", icon: Tag },
        ],
      },
      {
        id: "media",
        label: "Content & Trending",
        icon: BookOpen,
        subItems: [
          { href: "/admin/blogs", label: "Blogs & Stories", icon: BookOpen },
          { href: "/admin/trending", label: "Trending Highlights", icon: Flame },
        ],
      },
    ],
  },
  {
    title: "ADMIN & FINANCE",
    items: [
      {
        id: "finance_reports",
        label: "Finance & Accounts",
        icon: IndianRupee,
        subItems: [
          { href: "/admin/finance", label: "Finance & P&L", icon: IndianRupee },
          { href: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
          { href: "/admin/users", label: "Users & Customers", icon: Users },
        ],
      },
    ],
  },
];

const pageActions: Record<string, { label: string; href: string }> = {
  "/admin/products": { label: "Add Product", href: "/admin/products/new" },
  "/admin/destinations": { label: "Add Destination", href: "/admin/destinations/new" },
  "/admin/treks": { label: "Add Trek", href: "/admin/treks/new" },
  "/admin/listings": { label: "Add Listing", href: "/admin/listings/new" },
  "/admin/marketing/content-calendar": { label: "Schedule Post", href: "/admin/marketing/content-calendar" },
  "/admin/marketing/messages": { label: "Compose Message", href: "/admin/marketing/messages" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Collapsible state for each grouped menu
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => ({
    travel:
      pathname.startsWith("/admin/treks") ||
      pathname.startsWith("/admin/destinations") ||
      pathname.startsWith("/admin/listings"),
    ecommerce: pathname.startsWith("/admin/products") || pathname.startsWith("/admin/vendors"),
    marketing: pathname.startsWith("/admin/marketing") || pathname.startsWith("/admin/coupons"),
    media: pathname.startsWith("/admin/blogs") || pathname.startsWith("/admin/trending"),
    finance_reports:
      pathname.startsWith("/admin/finance") ||
      pathname.startsWith("/admin/reports") ||
      pathname.startsWith("/admin/users"),
  }));

  // Auto-expand group when navigating
  useEffect(() => {
    setOpenGroups((prev) => ({
      ...prev,
      travel:
        prev.travel ||
        pathname.startsWith("/admin/treks") ||
        pathname.startsWith("/admin/destinations") ||
        pathname.startsWith("/admin/listings"),
      ecommerce:
        prev.ecommerce || pathname.startsWith("/admin/products") || pathname.startsWith("/admin/vendors"),
      marketing:
        prev.marketing || pathname.startsWith("/admin/marketing") || pathname.startsWith("/admin/coupons"),
      media: prev.media || pathname.startsWith("/admin/blogs") || pathname.startsWith("/admin/trending"),
      finance_reports:
        prev.finance_reports ||
        pathname.startsWith("/admin/finance") ||
        pathname.startsWith("/admin/reports") ||
        pathname.startsWith("/admin/users"),
    }));
  }, [pathname]);

  const toggleGroup = (groupId: string) => {
    if (collapsed) {
      setCollapsed(false);
      setOpenGroups((prev) => ({ ...prev, [groupId]: true }));
    } else {
      setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
    }
  };

  const currentAction = pageActions[pathname];

  const getHeaderTitle = () => {
    if (pathname === "/admin/dashboard") return "Dashboard";
    if (pathname === "/admin/orders") return "Orders & Trip Batches";
    if (pathname === "/admin/treks") return "Travel / Treks Management";
    if (pathname === "/admin/destinations") return "Travel / Destinations";
    if (pathname === "/admin/listings") return "Travel / Homestays & Stays";
    if (pathname === "/admin/products") return "Shop / Products Catalog";
    if (pathname === "/admin/vendors") return "Shop / Vendors & Artisans";
    if (pathname === "/admin/marketing") return "Marketing / Overview";
    if (pathname === "/admin/marketing/messages") return "Marketing / Send Trek Messages";
    if (pathname === "/admin/marketing/content-calendar") return "Marketing / Content Calendar";
    if (pathname === "/admin/marketing/leads") return "Marketing / Trek Enquiries";
    if (pathname === "/admin/coupons") return "Marketing / Coupons & Deals";
    if (pathname === "/admin/blogs") return "Content / Blogs & Stories";
    if (pathname === "/admin/trending") return "Content / Trending Highlights";
    if (pathname === "/admin/finance") return "Finance / Accounts & P&L";
    if (pathname === "/admin/reports") return "Finance / Reports & Analytics";
    if (pathname === "/admin/users") return "Admin / Users & Customers";
    if (pathname === "/admin/settings") return "Settings";
    return "Admin";
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex font-['DM_Sans',sans-serif]">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside
        className={`relative flex flex-col bg-[#141414] border-r border-white/5 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="w-8 h-8 rounded-xl bg-[#2ecc71] flex items-center justify-center shrink-0 shadow-sm shadow-[#2ecc71]/20">
            <ShieldCheck size={16} className="text-black" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="text-white font-bold text-sm tracking-wide block truncate">
                Kokan Admin
              </span>
              <span className="text-[10px] text-white/40 block font-mono">Platform Management</span>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Sections */}
        <nav className="flex-1 px-2.5 py-3 space-y-4 overflow-y-auto">
          {navSections.map((section, sIdx) => (
            <div key={section.title} className="space-y-1">
              {/* Section Title Header */}
              {!collapsed ? (
                <div className="px-3 pt-1 pb-1 text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center justify-between">
                  <span>{section.title}</span>
                </div>
              ) : sIdx > 0 ? (
                <div className="h-[1px] bg-white/5 my-2 mx-2" />
              ) : null}

              {/* Section Items */}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const hasSub = Array.isArray(item.subItems) && item.subItems.length > 0;
                  const Icon = item.icon;

                  // ── CASE 1: Group with Sub-Items (Accordion) ──────────
                  if (hasSub) {
                    const isGroupOpen = Boolean(openGroups[item.id]);
                    const isAnySubActive = item.subItems?.some(
                      (sub) => pathname === sub.href || pathname.startsWith(`${sub.href}/`)
                    );

                    return (
                      <div key={item.id} className="relative group">
                        {/* Parent Group Header Button */}
                        <button
                          type="button"
                          onClick={() => toggleGroup(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                            isAnySubActive
                              ? "bg-[#2ecc71]/10 text-[#2ecc71] font-bold"
                              : "text-white/60 hover:text-white hover:bg-white/5 font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              size={15}
                              className={`shrink-0 ${isAnySubActive ? "text-[#2ecc71]" : "text-white/40"}`}
                            />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                          </div>

                          {!collapsed && (
                            <ChevronDown
                              size={13}
                              className={`transition-transform text-white/30 group-hover:text-white/60 ${
                                isGroupOpen ? "rotate-0" : "-rotate-90"
                              }`}
                            />
                          )}
                        </button>

                        {/* Collapsed Mode Flyout / Tooltip Popover */}
                        {collapsed && (
                          <div className="absolute left-16 top-0 bg-[#181818] border border-white/10 rounded-xl p-2 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50 min-w-[190px] space-y-1">
                            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/5 mb-1">
                              {item.label}
                            </div>
                            {item.subItems?.map((sub) => {
                              const subActive = pathname === sub.href;
                              const SubIcon = sub.icon;
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                                    subActive
                                      ? "bg-[#2ecc71]/20 text-[#2ecc71] font-bold"
                                      : "text-white/70 hover:text-white hover:bg-white/5"
                                  }`}
                                >
                                  {SubIcon && <SubIcon size={12} className="shrink-0" />}
                                  <span>{sub.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}

                        {/* Expanded Sub-Menu Links */}
                        {!collapsed && isGroupOpen && (
                          <div className="ml-4 pl-2.5 border-l border-white/10 space-y-0.5 mt-0.5 py-0.5">
                            {item.subItems?.map((sub) => {
                              const subActive =
                                pathname === sub.href || pathname.startsWith(`${sub.href}/`);
                              const SubIcon = sub.icon;
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                                    subActive
                                      ? "bg-[#2ecc71]/15 text-[#2ecc71] font-bold shadow-xs"
                                      : "text-white/40 hover:text-white/80 hover:bg-white/5 font-medium"
                                  }`}
                                >
                                  {SubIcon && (
                                    <SubIcon
                                      size={12}
                                      className={`shrink-0 ${
                                        subActive ? "text-[#2ecc71]" : "text-white/30"
                                      }`}
                                    />
                                  )}
                                  <span className="truncate">{sub.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // ── CASE 2: Single Direct Link Item ──────────────────
                  const active = pathname === item.href;
                  return (
                    <div key={item.id} className="relative group">
                      <Link
                        href={item.href || "#"}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                          active
                            ? "bg-[#2ecc71]/10 text-[#2ecc71] font-bold"
                            : "text-white/60 hover:text-white hover:bg-white/5 font-medium"
                        }`}
                      >
                        <Icon
                          size={15}
                          className={`shrink-0 ${active ? "text-[#2ecc71]" : "text-white/40"}`}
                        />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>

                      {/* Tooltip for collapsed mode */}
                      {collapsed && (
                        <div className="absolute left-16 top-1 bg-[#1a1a1a] text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-white/10 shadow-lg">
                          {item.label}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer / Account Section */}
        <div className="px-2.5 py-3 border-t border-white/5 space-y-0.5">
          <Link
            href="/admin/settings"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <Settings size={15} className="shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut size={15} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#1e1e1e] border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors z-10 cursor-pointer shadow-md"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* ── Main App Shell ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 bg-[#141414] border-b border-white/5 flex items-center justify-between px-6 shrink-0">
          <p className="text-white/40 text-xs font-medium tracking-wide">
            {getHeaderTitle()}
          </p>

          <div className="flex items-center gap-3">
            {currentAction && (
              <Link
                href={currentAction.href}
                className="flex items-center gap-1.5 bg-[#2ecc71] text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#2ecc71]/90 transition-colors shadow-sm"
              >
                <Plus size={13} />
                <span>{currentAction.label}</span>
              </Link>
            )}

            <button
              type="button"
              className="relative p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2ecc71] rounded-full" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="w-7 h-7 rounded-lg bg-[#2ecc71]/20 flex items-center justify-center text-[#2ecc71] text-xs font-bold">
                {user?.email?.[0]?.toUpperCase() ?? "A"}
              </div>
              <span className="text-white/70 text-xs font-medium hidden sm:inline">
                {user?.email}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
