"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  MapPin, Calendar, Users, Wallet, Loader2, Sparkles, ArrowRight,
  AlertTriangle, Share2, RotateCcw, Compass, Check, ChevronRight,
  Clock, ShieldCheck, Heart, Info, ArrowLeft, Sun, Mountain
} from "lucide-react";
import PublicTopBar from "@/components/layout/PublicTopBar";
import Footer from "@/components/layout/Footer";

const INTERESTS = [
  { label: "Beaches", emoji: "🏖️", desc: "Sun, sand & pristine shores" },
  { label: "Trekking", emoji: "🧗", desc: "Forts, peaks & nature trails" },
  { label: "Food", emoji: "🍛", desc: "Authentic Malvani & seafood" },
  { label: "History", emoji: "🏰", desc: "Sea forts & Maratha heritage" },
  { label: "Nature", emoji: "🌿", desc: "Waterfalls, groves & backwaters" },
  { label: "Water Sports", emoji: "🤿", desc: "Scuba, parasailing & boating" },
  { label: "Photography", emoji: "📸", desc: "Vistas, cliffs & sunsets" },
  { label: "Temples", emoji: "🛕", desc: "Sacred shrines & architecture" },
];

const REGIONS = [
  { id: "all", label: "All of Konkan", sub: "Best overall recommendations", emoji: "🌊" },
  { id: "raigad", label: "Raigad", sub: "Alibaug, Kashid, Murud, Diveagar", emoji: "🏰" },
  { id: "ratnagiri", label: "Ratnagiri", sub: "Ganpatipule, Dapoli, Guhagar", emoji: "🏖️" },
  { id: "sindhudurg", label: "Sindhudurg", sub: "Tarkarli, Malvan, Vengurla", emoji: "🤿" },
];

const BUDGET_TIERS = [
  {
    id: "budget",
    title: "Budget",
    badge: "Homestays & Lodges",
    price: "₹1,200 – ₹2,000 / night",
    desc: "Authentic village homestays, delicious home-cooked thalis, and local transport.",
    emoji: "🏡",
  },
  {
    id: "medium",
    title: "Comfort",
    badge: "Most Popular",
    price: "₹2,500 – ₹4,500 / night",
    desc: "Beach cottages, comfortable sea-view hotels, coastal dining, and private cab.",
    emoji: "🏨",
  },
  {
    id: "luxury",
    title: "Luxury",
    badge: "Resorts & Villas",
    price: "₹6,000 – ₹12,000+ / night",
    desc: "Premium beachfront resorts, curated seafood experiences, and private chauffeur.",
    emoji: "🏝️",
  },
];

interface PlanStop {
  kind: "destination" | "trek";
  slot: string;
  name: string;
  href: string;
  image: string | null;
  tag: string;
  blurb: string;
  extras?: string[];
  price?: string;
  note?: string;
  bookable?: boolean;
}

interface PlanDay {
  day: number;
  date: string | null;
  title: string;
  area: string;
  notes: string[];
  stops: PlanStop[];
  stay: { area: string; type: string; estimate: string; note?: string } | null;
  food: { estimate: string; hints: string[] };
}

interface TripPlan {
  summary: string;
  startDate: string | null;
  endDate: string | null;
  areas: string[];
  days: PlanDay[];
  budget: {
    items: { label: string; min: number; max: number }[];
    totalMin: number;
    totalMax: number;
    perPersonMin: number;
    perPersonMax: number;
    note: string;
  };
  tips: string[];
  warnings: string[];
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const rangeOf = (min: number, max: number) => (min === max ? inr(min) : `${inr(min)} – ${inr(max)}`);
const fmtDate = (iso: string | null) =>
  iso
    ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })
    : "";

function TripPlannerContent() {
  const searchParams = useSearchParams();
  const prefilledDest = searchParams?.get("destination") || "";
  const prefilledRegion = searchParams?.get("region")?.toLowerCase() || "";

  const [form, setForm] = useState({
    startDate: "",
    days: "3",
    persons: "2",
    budget: "medium" as "budget" | "medium" | "luxury",
    interests: ["Beaches", "Food"] as string[],
    region: "all",
  });

  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle pre-filled destination query parameter
  useEffect(() => {
    if (prefilledRegion && ["raigad", "ratnagiri", "sindhudurg"].includes(prefilledRegion)) {
      setForm((prev) => ({ ...prev, region: prefilledRegion }));
    }
  }, [prefilledRegion]);

  const toggleInterest = (interest: string) =>
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));

  const generatePlan = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/trip-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not build a plan.");
      setPlan(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const shareOnWhatsApp = () => {
    if (!plan) return;
    const lines = [
      `🌴 My ${plan.days.length}-Day Kokan Trip Plan (${plan.areas.join(" & ")})`,
      "",
      ...plan.days.map((d) => `• Day ${d.day}: ${d.title} (${d.area})`),
      "",
      `💰 Budget Estimate: ${rangeOf(plan.budget.totalMin, plan.budget.totalMax)} (${rangeOf(plan.budget.perPersonMin, plan.budget.perPersonMax)}/person)`,
      "",
      `Plan your Kokan trip on Visit Kokan: ${typeof window !== "undefined" ? window.location.origin : ""}/trip-planner`,
    ];
    window.open(`https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* ── Public Top Bar (Website header) ── */}
      <PublicTopBar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* ── Breadcrumbs & Back ── */}
        <div className="flex items-center gap-2 text-xs font-semibold text-kokan-earth/60">
          <Link href="/destinations" className="flex items-center gap-1 hover:text-kokan-green transition-colors">
            <ArrowLeft size={14} /> Back to Destinations
          </Link>
          <span>/</span>
          <span className="text-kokan-earth">Trip Planner</span>
        </div>

        {/* ── Hero Banner ── */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1C4631] via-[#2D6A4F] to-[#163524] text-white p-6 sm:p-10 shadow-xl border border-white/10">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold mb-3 border border-white/15">
              <Sparkles size={13} />
              <span>Personalized Kokan Itinerary Generator</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Plan Your Dream Kokan Journey
            </h1>
            <p className="mt-2 text-white/80 text-xs sm:text-sm sm:leading-relaxed">
              Curated day-by-day travel routes featuring pristine beaches, ancient sea forts, scenic treks, local homestays, and authentic coastal dining.
            </p>

            {prefilledDest && (
              <div className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-semibold">
                <span>📍 Planning around: <strong>{prefilledDest}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* ── Main Form (When plan is not generated yet) ── */}
        {!plan ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC9] shadow-sm space-y-8">
            {/* Step 1: Destination & Duration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#F0E9DA]">
                <div className="w-7 h-7 rounded-full bg-kokan-green/10 text-kokan-green flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h2 className="font-bold text-kokan-earth text-base sm:text-lg">Where & How Long?</h2>
              </div>

              {/* Region Selection Cards */}
              <div>
                <label className="block text-xs font-bold text-kokan-earth/70 uppercase tracking-wider mb-2.5">
                  Select Region in Konkan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {REGIONS.map((r) => {
                    const isSelected = form.region === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setForm({ ...form, region: r.id })}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-md shadow-[#2D6A4F]/20"
                            : "bg-white text-kokan-earth border-[#E8DFC9] hover:border-kokan-green/40 hover:bg-[#FAF8F5]"
                        }`}
                      >
                        <div className="text-2xl mb-1.5">{r.emoji}</div>
                        <p className="font-bold text-xs sm:text-sm leading-snug">{r.label}</p>
                        <p className={`text-[11px] mt-0.5 line-clamp-1 ${isSelected ? "text-white/80" : "text-kokan-earth/50"}`}>
                          {r.sub}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration Buttons */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-kokan-earth/70 uppercase tracking-wider mb-2">
                  Duration (Number of Days)
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => {
                    const isSelected = form.days === String(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setForm({ ...form, days: String(d) })}
                        className={`flex-1 min-w-[70px] py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all ${
                          isSelected
                            ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-sm"
                            : "bg-white text-kokan-earth border-[#E8DFC9] hover:bg-[#F9F7F2]"
                        }`}
                      >
                        {d} {d === 1 ? "Day" : "Days"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Travel Date */}
              <div className="pt-2 max-w-sm">
                <label className="block text-xs font-bold text-kokan-earth/70 uppercase tracking-wider mb-1.5">
                  Tentative Start Date <span className="font-normal text-kokan-earth/40">(optional, helps check season & batches)</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-kokan-earth/40" />
                  <input
                    type="date"
                    value={form.startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC9] rounded-xl text-xs sm:text-sm font-medium text-kokan-earth focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/25"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Travellers & Budget */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#F0E9DA]">
                <div className="w-7 h-7 rounded-full bg-kokan-green/10 text-kokan-green flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h2 className="font-bold text-kokan-earth text-base sm:text-lg">Travellers & Budget Level</h2>
              </div>

              {/* Travellers Selector */}
              <div>
                <label className="block text-xs font-bold text-kokan-earth/70 uppercase tracking-wider mb-2">
                  Number of Travellers
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {[1, 2, 3, 4, 5, 6, 8, 10, 15].map((n) => {
                    const isSelected = form.persons === String(n);
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm({ ...form, persons: String(n) })}
                        className={`flex-1 min-w-[64px] py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all ${
                          isSelected
                            ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-sm"
                            : "bg-white text-kokan-earth border-[#E8DFC9] hover:bg-[#F9F7F2]"
                        }`}
                      >
                        {n} {n === 1 ? "Person" : "People"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget Tier Cards */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-kokan-earth/70 uppercase tracking-wider mb-2.5">
                  Preferred Budget Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {BUDGET_TIERS.map((tier) => {
                    const isSelected = form.budget === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setForm({ ...form, budget: tier.id as any })}
                        className={`p-4 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? "bg-[#FAF8F3] border-[#2D6A4F] ring-2 ring-[#2D6A4F]/20 shadow-sm"
                            : "bg-white border-[#E8DFC9] hover:border-kokan-green/40 hover:bg-[#FCFBF8]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{tier.emoji}</span>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-kokan-green/10 text-kokan-green">
                            {tier.badge}
                          </span>
                        </div>
                        <p className="font-bold text-sm text-kokan-earth">{tier.title}</p>
                        <p className="text-xs font-semibold text-kokan-green mt-0.5">{tier.price}</p>
                        <p className="text-[11px] text-kokan-earth/60 mt-1.5 leading-snug">{tier.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Interests */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#F0E9DA]">
                <div className="w-7 h-7 rounded-full bg-kokan-green/10 text-kokan-green flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h2 className="font-bold text-kokan-earth text-base sm:text-lg">What Interests You?</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {INTERESTS.map((interest) => {
                  const isChecked = form.interests.includes(interest.label);
                  return (
                    <button
                      key={interest.label}
                      type="button"
                      onClick={() => toggleInterest(interest.label)}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                        isChecked
                          ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-sm"
                          : "bg-white text-kokan-earth border-[#E8DFC9] hover:border-kokan-green/30 hover:bg-[#FAF8F5]"
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{interest.emoji}</span>
                      <div className="min-w-0">
                        <p className="font-bold text-xs sm:text-sm leading-tight">{interest.label}</p>
                        <p className={`text-[10px] mt-0.5 line-clamp-1 ${isChecked ? "text-white/80" : "text-kokan-earth/50"}`}>
                          {interest.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm font-medium text-red-600 flex items-center gap-2">
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={generatePlan}
                disabled={loading}
                className="w-full py-4 bg-[#B8DC26] hover:bg-[#AED422] active:scale-[0.99] text-[#142607] font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-[#B8DC26]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Curating your Kokan itinerary…</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate My Trip Plan ✨</span>
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-kokan-earth/50 mt-2">
                100% Free · Real Kokan Destinations · Instant Custom Breakdown
              </p>
            </div>
          </div>
        ) : (
          /* ── Generated Plan Results ── */
          <div className="space-y-6">
            {/* Overview Banner */}
            <div className="bg-gradient-to-br from-[#1C4631] via-[#2D6A4F] to-[#163524] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10 relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-bold border border-white/20">
                    <Sparkles size={12} />
                    <span>Itinerary Ready</span>
                  </div>
                  <button
                    onClick={() => setPlan(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs font-bold text-white transition-colors"
                  >
                    <RotateCcw size={12} /> Modify Preferences
                  </button>
                </div>

                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                    {plan.days.length}-Day {plan.areas.join(" & ")} Journey
                  </h2>
                  <p className="text-white/80 text-xs sm:text-sm mt-1">{plan.summary}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/15">
                  <span className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold">
                    💰 {rangeOf(plan.budget.totalMin, plan.budget.totalMax)} total estimate
                  </span>
                  <span className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold">
                    👤 {rangeOf(plan.budget.perPersonMin, plan.budget.perPersonMax)} / person
                  </span>
                  <span className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold">
                    👥 {form.persons} {Number(form.persons) === 1 ? "traveller" : "travellers"}
                  </span>
                  {plan.startDate && plan.endDate && (
                    <span className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold">
                      📅 {fmtDate(plan.startDate)} → {fmtDate(plan.endDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Warnings & Heads Up */}
            {plan.warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-2">
                <p className="text-xs sm:text-sm font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle size={15} /> Travel Advisory & Seasonal Notes
                </p>
                <div className="space-y-1">
                  {plan.warnings.map((w, i) => (
                    <p key={i} className="text-xs text-amber-800 leading-relaxed">• {w}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Day by Day Plan */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-kokan-earth text-lg sm:text-xl flex items-center gap-2">
                <span>🗓️</span> Day-by-Day Route & Stops
              </h3>

              {plan.days.map((day) => (
                <div key={day.day} className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DFC9] shadow-sm space-y-4">
                  {/* Day Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-[#F0E9DA]">
                    <div className="w-10 h-10 rounded-2xl bg-[#2D6A4F] text-white flex items-center justify-center font-black text-sm shadow-sm">
                      D{day.day}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-kokan-earth text-base sm:text-lg leading-tight truncate">
                        {day.title}
                      </h4>
                      <p className="text-xs text-kokan-earth/50 mt-0.5">
                        {[fmtDate(day.date), day.area].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {day.notes.length > 0 && (
                    <div className="space-y-1 bg-[#FAF8F5] p-3 rounded-xl border border-[#F0E9DA]">
                      {day.notes.map((n, i) => (
                        <p key={i} className="text-xs text-kokan-earth/65 italic leading-relaxed">• {n}</p>
                      ))}
                    </div>
                  )}

                  {/* Stops List */}
                  <div className="space-y-3">
                    {day.stops.map((stop, i) => (
                      <div
                        key={`${day.day}-${i}`}
                        className="flex flex-col sm:flex-row gap-4 p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D5] hover:border-kokan-green/30 transition-all group"
                      >
                        {stop.image ? (
                          <div className="relative w-full sm:w-32 h-36 sm:h-28 rounded-xl overflow-hidden bg-kokan-sand/20 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={stop.image}
                              alt={stop.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="w-full sm:w-32 h-28 rounded-xl bg-[#E8DFC9]/40 flex items-center justify-center text-3xl shrink-0">
                            {stop.kind === "trek" ? "🥾" : "📍"}
                          </div>
                        )}

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F]">
                              {stop.kind === "trek" ? "🥾 Trek Activity" : "📍 Destination Visit"}
                            </span>
                            {stop.tag && <span className="text-xs text-kokan-earth/50">· {stop.tag}</span>}
                          </div>

                          <Link
                            href={stop.href}
                            className="font-bold text-sm sm:text-base text-kokan-earth hover:text-kokan-green transition-colors block"
                          >
                            {stop.name}
                          </Link>

                          {stop.blurb && (
                            <p className="text-xs text-kokan-earth/70 leading-relaxed line-clamp-2">
                              {stop.blurb}
                            </p>
                          )}

                          {stop.extras && stop.extras.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {stop.extras.map((x) => (
                                <span key={x} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-[#E8DFC9] text-kokan-earth">
                                  {x}
                                </span>
                              ))}
                            </div>
                          )}

                          {stop.price && (
                            <p className="text-xs font-bold text-kokan-green pt-1">{stop.price}</p>
                          )}

                          {stop.note && (
                            <p className="text-[11px] text-amber-700 italic pt-0.5">{stop.note}</p>
                          )}

                          <div className="pt-2">
                            <Link
                              href={stop.href}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-kokan-green hover:underline"
                            >
                              <span>Explore details</span>
                              <ChevronRight size={13} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stay & Food Recommendations */}
                  <div className={`grid gap-3 pt-2 ${day.stay ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                    {day.stay && (
                      <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFC9]">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-kokan-earth/50">
                          🏡 Recommended Stay · {day.stay.area}
                        </p>
                        <p className="font-bold text-xs sm:text-sm text-kokan-earth mt-1">{day.stay.type}</p>
                        <p className="text-xs font-semibold text-kokan-green mt-0.5">{day.stay.estimate}</p>
                        {day.stay.note && (
                          <p className="text-[11px] text-kokan-earth/50 mt-1 italic">{day.stay.note}</p>
                        )}
                      </div>
                    )}

                    <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFC9]">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-kokan-earth/50">
                        🍛 Food & Dining
                      </p>
                      <p className="text-xs font-semibold text-kokan-green mt-1">{day.food.estimate}</p>
                      {day.food.hints.length > 0 && (
                        <p className="text-[11px] text-kokan-earth/65 mt-1 leading-snug">
                          Try: <strong>{day.food.hints.join(" · ")}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Budget Breakdown */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DFC9] shadow-sm space-y-4">
              <h3 className="font-display font-bold text-kokan-earth text-lg flex items-center gap-2">
                <span>💰</span> Approximate Budget Breakdown
              </h3>

              <div className="divide-y divide-[#F0E9DA]">
                {plan.budget.items.map((it) => (
                  <div key={it.label} className="py-2.5 flex justify-between gap-4 text-xs sm:text-sm text-kokan-earth">
                    <span className="font-medium text-kokan-earth/75">{it.label}</span>
                    <span className="font-bold text-kokan-earth shrink-0">{rangeOf(it.min, it.max)}</span>
                  </div>
                ))}

                <div className="pt-3 pb-1 flex justify-between gap-4 text-sm sm:text-base font-black text-kokan-earth">
                  <span>Estimated Total</span>
                  <span className="text-[#2D6A4F]">{rangeOf(plan.budget.totalMin, plan.budget.totalMax)}</span>
                </div>

                <div className="pt-2 flex justify-between gap-4 text-xs font-bold text-kokan-green">
                  <span>Per Person</span>
                  <span>{rangeOf(plan.budget.perPersonMin, plan.budget.perPersonMax)}</span>
                </div>
              </div>

              <p className="text-[11px] text-kokan-earth/50 leading-relaxed pt-2">
                * {plan.budget.note}
              </p>
            </div>

            {/* Travel Tips */}
            <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 border border-[#E8DFC9] space-y-3">
              <h3 className="font-display font-bold text-kokan-earth text-lg flex items-center gap-2">
                <span>💡</span> Local Kokan Travel Tips
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {plan.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-kokan-earth/75 bg-white p-3 rounded-xl border border-[#E8DFC9]/70">
                    <Check size={14} className="text-[#2D6A4F] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPlan(null)}
                className="py-3.5 px-4 rounded-2xl border border-kokan-sand/50 bg-white font-bold text-xs sm:text-sm text-kokan-earth hover:bg-kokan-cream transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <RotateCcw size={15} /> Plan Another Trip
              </button>

              <button
                type="button"
                onClick={shareOnWhatsApp}
                className="py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Share2 size={15} /> Share on WhatsApp
              </button>

              <Link
                href="/destinations"
                className="py-3.5 px-4 rounded-2xl bg-[#2D6A4F] hover:bg-[#245740] text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Browse All Destinations</span>
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}

export default function TripPlannerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="flex items-center gap-2 text-kokan-earth font-semibold text-sm">
          <Loader2 className="animate-spin text-kokan-green" size={20} />
          <span>Loading Trip Planner…</span>
        </div>
      </div>
    }>
      <TripPlannerContent />
    </Suspense>
  );
}