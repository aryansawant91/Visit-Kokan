"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  ShoppingBag, Package, Heart, MapPin,
  ArrowRight, Calendar, Star, Waves
} from "lucide-react";

export default function DashboardPage() {
  const { profile } = useAuth();

  const stats = [
    { label: "Bookings", value: "0", icon: ShoppingBag, color: "bg-blue-50 text-blue-500", href: "/bookings" },
    { label: "Orders", value: "0", icon: Package, color: "bg-purple-50 text-purple-500", href: "/orders" },
    { label: "Wishlist", value: "0", icon: Heart, color: "bg-red-50 text-red-500", href: "/wishlist" },
    { label: "Trips Planned", value: "0", icon: MapPin, color: "bg-kokan-green/10 text-kokan-green", href: "/trip-planner" },
  ];

  const quickLinks = [
    { href: "/destinations", label: "Explore Destinations", emoji: "🏖️" },
    { href: "/treks", label: "Book a Trek", emoji: "🧗" },
    { href: "/listings", label: "Find Homestays", emoji: "🏡" },
    { href: "/products", label: "Order Products", emoji: "🥭" },
  ];

  const firstName = profile?.displayName?.split(" ")[0] ?? "Traveller";

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative bg-kokan-green rounded-2xl p-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white -translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Waves className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-sm">Welcome back</span>
          </div>
          <h1 className="font-playfair text-2xl font-bold text-white mb-1">
            Hey, {firstName}! 👋
          </h1>
          <p className="text-white/70 text-sm">
            Ready for your next Kokan adventure?
          </p>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 mt-4 bg-white text-kokan-green px-4 py-2 rounded-xl text-sm font-semibold hover:bg-kokan-cream transition-colors"
          >
            Explore Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl p-5 border border-kokan-sand/30 hover:border-kokan-green/30 hover:shadow-sm transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-kokan-earth">{stat.value}</p>
            <p className="text-xs text-kokan-earth/50 mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30">
        <h2 className="font-semibold text-kokan-earth mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-kokan-sand" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 p-4 rounded-xl border border-kokan-sand/30 hover:border-kokan-green/30 hover:bg-kokan-green/5 transition-all group"
            >
              <span className="text-2xl">{link.emoji}</span>
              <span className="text-sm text-kokan-earth/70 group-hover:text-kokan-earth font-medium transition-colors">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30">
        <h2 className="font-semibold text-kokan-earth mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-kokan-sand" />
          Recent Activity
        </h2>
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
          <div className="text-4xl">🌊</div>
          <p className="text-kokan-earth/50 text-sm">No activity yet</p>
          <p className="text-kokan-earth/30 text-xs">
            Your bookings and orders will appear here
          </p>
          <Link
            href="/destinations"
            className="mt-2 text-sm text-kokan-green font-medium hover:text-kokan-green/70 transition-colors"
          >
            Start exploring →
          </Link>
        </div>
      </div>
    </div>
  );
}