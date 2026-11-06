"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MessageCircle,
  Phone,
  User,
  ShieldCheck,
  Clock,
  Sparkles,
  MapPin,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function VendorBookingsPage() {
  const { profile } = useAuth();
  const hostPhone = profile?.phone || "";

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Calendar className="text-purple-400" size={24} />
          <span>Guest Bookings &amp; Inquiries</span>
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Direct guest communication, reservations, and group inquiries for your properties
        </p>
      </div>

      {/* ── 0% Commission Direct Booking Guarantee Banner ── */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#1d1633] to-[#141414] border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
            <ShieldCheck size={16} />
            <span>Direct Traveler WhatsApp &amp; Call Inquiries</span>
          </div>
          <p className="text-xs text-white/70 max-w-xl leading-relaxed">
            Visit Kokan connects tourists directly with you. You take 100% of guest payments directly via UPI, cash, or bank transfer with zero middleman commissions.
          </p>
        </div>
        <Link
          href="/vendor/profile"
          className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30 font-bold text-xs rounded-xl transition-colors shrink-0 text-center"
        >
          Verify Phone &amp; WhatsApp
        </Link>
      </div>

      {/* ── Guidance on Receiving Bookings ── */}
      <div className="bg-[#141414] rounded-3xl p-6 sm:p-8 border border-white/5 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl">
            💬
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              How Traveler Reservations Work on Visit Kokan
            </h2>
            <p className="text-xs text-white/40">
              Simplified 3-step host reservation workflow
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#1a1a1a] p-4.5 rounded-2xl border border-white/5 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-[#2ecc71] font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-sm text-white">Traveler Discovers Stay</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Tourists exploring Konkan beach and heritage destinations find your property and tap &ldquo;Chat on WhatsApp&rdquo; or &ldquo;Call Host&rdquo;.
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-4.5 rounded-2xl border border-white/5 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-sm text-white">Agree on Dates &amp; Meals</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Confirm check-in dates, group headcount, homemade Konkani meals (veg/non-veg), and vehicle parking details directly.
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-4.5 rounded-2xl border border-white/5 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-sm text-white">Collect Payment Directly</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Request a small advance via GPay/PhonePe to lock the room, and collect the balance upon arrival. 100% of the money stays with you.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#2ecc71] shrink-0" />
            <span>
              Current Active Host Phone:{" "}
              <strong className="text-white">
                {hostPhone || "Not set yet"}
              </strong>
            </span>
          </div>
          <Link
            href="/vendor/profile"
            className="text-[#2ecc71] hover:underline font-bold shrink-0"
          >
            Update Host Phone →
          </Link>
        </div>
      </div>
    </div>
  );
}
