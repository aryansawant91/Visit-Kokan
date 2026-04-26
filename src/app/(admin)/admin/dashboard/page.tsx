"use client";

import {
  Users, Store, Package, BookOpen,
  TrendingUp, Clock, ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface StatsCard {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: React.ElementType;
  href: string;
  color: string;
}

const stats: StatsCard[] = [
  { label: "Total Users", value: "1,284", change: "+12% this month", up: true, icon: Users, href: "/admin/users", color: "#2ecc71" },
  { label: "Active Vendors", value: "87", change: "+4 pending approval", up: true, icon: Store, href: "/admin/vendors", color: "#3498db" },
  { label: "Products Listed", value: "342", change: "18 awaiting review", up: true, icon: Package, href: "/admin/products", color: "#e67e22" },
  { label: "Published Blogs", value: "56", change: "3 drafts pending", up: false, icon: BookOpen, href: "/admin/blogs", color: "#9b59b6" },
];

const recentActivity = [
  { type: "user", action: "New user registered", name: "Priya Malkar", time: "2 min ago", status: "new" },
  { type: "vendor", action: "Vendor application submitted", name: "Malvan Spices Co.", time: "15 min ago", status: "pending" },
  { type: "product", action: "Product submitted for review", name: "Kokum Sherbet 500ml", time: "1 hr ago", status: "pending" },
  { type: "user", action: "User account flagged", name: "anonymous_user_44", time: "2 hr ago", status: "alert" },
  { type: "vendor", action: "Vendor approved", name: "Sindhudurg Homestays", time: "3 hr ago", status: "approved" },
  { type: "product", action: "Product rejected", name: "Fake Hapus Mango", time: "5 hr ago", status: "rejected" },
];

const pendingItems = [
  { label: "Vendor Applications", count: 4, href: "/admin/vendors", color: "#3498db" },
  { label: "Products to Review", count: 18, href: "/admin/products", color: "#e67e22" },
  { label: "Blog Drafts", count: 3, href: "/admin/blogs", color: "#9b59b6" },
  { label: "Flagged Users", count: 2, href: "/admin/users", color: "#e74c3c" },
];

function statusBadge(status: string) {
  const map: Record<string, string> = {
    new: "bg-[#2ecc71]/10 text-[#2ecc71]",
    pending: "bg-yellow-500/10 text-yellow-400",
    approved: "bg-[#2ecc71]/10 text-[#2ecc71]",
    rejected: "bg-red-500/10 text-red-400",
    alert: "bg-red-500/10 text-red-400",
  };
  return map[status] ?? "bg-white/5 text-white/40";
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-white/30 text-sm mt-0.5">Welcome back. Here's what needs your attention.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
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
          <div className="space-y-3">
            {pendingItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/5 transition-all group"
              >
                <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">{item.label}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
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
          <div className="space-y-1">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/5 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="text-white/70 text-sm truncate">{item.action}</div>
                  <div className="text-white/30 text-xs mt-0.5">{item.name}</div>
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
        </div>
      </div>
    </div>
  );
}