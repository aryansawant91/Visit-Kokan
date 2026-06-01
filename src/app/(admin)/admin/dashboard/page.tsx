"use client";

import { useEffect, useState } from "react";
import {
  Users, Store, Package, BookOpen,
  TrendingUp, Clock, ArrowUpRight, Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  collection, getDocs, query, where,
  orderBy, limit, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DashStats {
  totalUsers: number;
  activeVendors: number;
  pendingVendors: number;
  productsListed: number;
  productsAwaitingReview: number;
  publishedBlogs: number;
  pendingBlogs: number;
  pendingOrders: number;
}

interface ActivityItem {
  action: string;
  name: string;
  time: string;
  status: "new" | "pending" | "approved" | "rejected" | "alert";
  createdAt: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} days ago`;
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    new:      "bg-[#2ecc71]/10 text-[#2ecc71]",
    pending:  "bg-yellow-500/10 text-yellow-400",
    approved: "bg-[#2ecc71]/10 text-[#2ecc71]",
    rejected: "bg-red-500/10 text-red-400",
    alert:    "bg-red-500/10 text-red-400",
  };
  return map[status] ?? "bg-white/5 text-white/40";
}

function tsToMs(val: any): number {
  if (!val) return 0;
  if (val instanceof Timestamp) return val.toDate().getTime();
  if (typeof val === "string")  return new Date(val).getTime();
  if (typeof val === "number")  return val;
  return 0;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [stats, setStats]       = useState<DashStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // ── Parallel fetches ────────────────────────────────────────────────
        const [
          usersSnap,
          vendorsSnap,
          pendingVendorsSnap,
          productsSnap,
          pendingProductsSnap,
          publishedBlogsSnap,
          pendingBlogsSnap,
          pendingOrdersSnap,
          // Activity sources
          recentUsersSnap,
          recentVendorAppsSnap,
          recentProductsSnap,
          recentOrdersSnap,
        ] = await Promise.all([
          // Stats
          getDocs(collection(db, "users")),
          getDocs(query(collection(db, "users"), where("role", "==", "vendor"), where("vendorStatus", "==", "approved"))),
          getDocs(query(collection(db, "users"), where("vendorStatus", "==", "pending"))),
          getDocs(query(collection(db, "products"), where("approved", "==", true))),
          getDocs(query(collection(db, "products"), where("approved", "==", false))),
          getDocs(query(collection(db, "blogs"), where("published", "==", true))),
          getDocs(query(collection(db, "blogs"), where("published", "==", false))),
          getDocs(query(collection(db, "orders"), where("status", "==", "pending"))),
          // Activity — last 3 of each type
          getDocs(query(collection(db, "users"),    orderBy("createdAt", "desc"), limit(3))),
          getDocs(query(collection(db, "users"),    where("vendorStatus", "==", "pending"), orderBy("createdAt", "desc"), limit(3))),
          getDocs(query(collection(db, "products"), where("approved", "==", false), orderBy("createdAt", "desc"), limit(3))),
          getDocs(query(collection(db, "orders"),   orderBy("createdAt", "desc"), limit(3))),
        ]);

        // ── Stats ───────────────────────────────────────────────────────────
        setStats({
          totalUsers:             usersSnap.size,
          activeVendors:          vendorsSnap.size,
          pendingVendors:         pendingVendorsSnap.size,
          productsListed:         productsSnap.size,
          productsAwaitingReview: pendingProductsSnap.size,
          publishedBlogs:         publishedBlogsSnap.size,
          pendingBlogs:           pendingBlogsSnap.size,
          pendingOrders:          pendingOrdersSnap.size,
        });

        // ── Activity feed ───────────────────────────────────────────────────
        const items: ActivityItem[] = [];

        recentUsersSnap.docs.forEach((d) => {
          const data = d.data();
          items.push({
            action:    "New user registered",
            name:      data.displayName || data.email || "Unknown",
            status:    "new",
            createdAt: tsToMs(data.createdAt),
            time:      "",
          });
        });

        recentVendorAppsSnap.docs.forEach((d) => {
          const data = d.data();
          items.push({
            action:    "Vendor application submitted",
            name:      data.businessName || data.displayName || "Unknown",
            status:    "pending",
            createdAt: tsToMs(data.createdAt),
            time:      "",
          });
        });

        recentProductsSnap.docs.forEach((d) => {
          const data = d.data();
          items.push({
            action:    "Product submitted for review",
            name:      data.name || "Unnamed product",
            status:    "pending",
            createdAt: tsToMs(data.createdAt),
            time:      "",
          });
        });

        recentOrdersSnap.docs.forEach((d) => {
          const data = d.data();
          items.push({
            action:    data.status === "cancelled" ? "Order cancelled" : "New order placed",
            name:      data.trekName ?? data.items?.[0]?.name ?? `Order #${d.id.slice(0, 6)}`,
            status:    data.status === "cancelled" ? "rejected" : "new",
            createdAt: tsToMs(data.createdAt),
            time:      "",
          });
        });

        // Sort by most recent, take top 8
        items.sort((a, b) => b.createdAt - a.createdAt);
        const top8 = items.slice(0, 8).map((i) => ({ ...i, time: timeAgo(i.createdAt) }));
        setActivity(top8);

      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-white text-xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-white/30 text-sm mt-0.5">Loading live data…</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#141414] border border-white/5 rounded-xl p-5 h-32 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="bg-[#141414] border border-white/5 rounded-xl h-56 animate-pulse" />
          <div className="xl:col-span-2 bg-[#141414] border border-white/5 rounded-xl h-56 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // ── Derived display data ───────────────────────────────────────────────────
  const statCards = [
    {
      label:  "Total Users",
      value:  stats.totalUsers.toLocaleString("en-IN"),
      change: stats.totalUsers > 0 ? `${stats.totalUsers} registered` : "No users yet",
      up:     true,
      icon:   Users,
      href:   "/admin/users",
      color:  "#2ecc71",
    },
    {
      label:  "Active Vendors",
      value:  stats.activeVendors.toLocaleString("en-IN"),
      change: stats.pendingVendors > 0
        ? `+${stats.pendingVendors} pending approval`
        : "No pending applications",
      up:     stats.pendingVendors > 0,
      icon:   Store,
      href:   "/admin/vendors",
      color:  "#3498db",
    },
    {
      label:  "Products Listed",
      value:  stats.productsListed.toLocaleString("en-IN"),
      change: stats.productsAwaitingReview > 0
        ? `${stats.productsAwaitingReview} awaiting review`
        : "All products reviewed",
      up:     stats.productsAwaitingReview > 0,
      icon:   Package,
      href:   "/admin/products",
      color:  "#e67e22",
    },
    {
      label:  "Published Blogs",
      value:  stats.publishedBlogs.toLocaleString("en-IN"),
      change: stats.pendingBlogs > 0
        ? `${stats.pendingBlogs} drafts pending`
        : "No pending drafts",
      up:     false,
      icon:   BookOpen,
      href:   "/admin/blogs",
      color:  "#9b59b6",
    },
  ];

  const pendingItems = [
    { label: "Vendor Applications", count: stats.pendingVendors,         href: "/admin/vendors",  color: "#3498db" },
    { label: "Products to Review",  count: stats.productsAwaitingReview, href: "/admin/products", color: "#e67e22" },
    { label: "Blog Drafts",         count: stats.pendingBlogs,           href: "/admin/blogs",    color: "#9b59b6" },
    { label: "Pending Orders",      count: stats.pendingOrders,          href: "/admin/orders",   color: "#e74c3c" },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-white/30 text-sm mt-0.5">Welcome back. Here's what needs your attention.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-[#141414] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <ArrowUpRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
            </div>
            <div className="text-2xl font-semibold text-white">{stat.value}</div>
            <div className="text-white/40 text-xs mt-1">{stat.label}</div>
            <div className={`text-xs mt-2 ${stat.up ? "text-[#2ecc71]" : "text-yellow-400"}`}>
              {stat.change}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Pending Actions */}
        <div className="bg-[#141414] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} className="text-white/40" />
            <h2 className="text-white/80 text-sm font-medium">Pending Actions</h2>
          </div>
          <div className="space-y-1">
            {pendingItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/5 transition-all group"
              >
                <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                  {item.label}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-all ${
                    item.count === 0 ? "bg-white/5 text-white/20" : ""
                  }`}
                  style={item.count > 0 ? { backgroundColor: `${item.color}15`, color: item.color } : {}}
                >
                  {item.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="xl:col-span-2 bg-[#141414] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-white/40" />
            <h2 className="text-white/80 text-sm font-medium">Recent Activity</h2>
          </div>

          {activity.length === 0 ? (
            <div className="text-center py-8 text-white/20 text-sm">
              No recent activity
            </div>
          ) : (
            <div className="space-y-1">
              {activity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/5 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-white/70 text-sm truncate">{item.action}</div>
                    <div className="text-white/30 text-xs mt-0.5 truncate">{item.name}</div>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(item.status)}`}>
                      {item.status}
                    </span>
                    <span className="text-white/25 text-xs">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}