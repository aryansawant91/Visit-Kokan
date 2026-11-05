"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  MessageCircle,
  Send,
  X,
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";

const WHATSAPP_NUMBER = "918432587706";

const REGIONS = [
  "Any / Recommend for me",
  "Alibaug & Kashid",
  "Dapoli & Guhagar",
  "Ganpatipule & Ratnagiri",
  "Tarkarli & Malvan",
  "Sindhudurg Coast",
];

const TRIP_STYLES = [
  "Beachfront Homestay",
  "Family Getaway",
  "Couples Retreat",
  "Friends & Adventure",
  "Heritage Wada & Culture",
];

export default function PersonalizedTripPlanningBox() {
  const { user, profile } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [region, setRegion] = useState("Any / Recommend for me");
  const [tripStyle, setTripStyle] = useState("Beachfront Homestay");
  const [dates, setDates] = useState("Upcoming Weekend");
  const [guests, setGuests] = useState("2-4 Guests");
  const [name, setName] = useState(profile?.displayName || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const defaultWhatsappMessage =
    "Hi Visit Kokan! 👋 I would like help planning my trip to Konkan. Could you please curate a personalized itinerary and verified homestays for me?";

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    defaultWhatsappMessage
  )}`;

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Please provide your name and contact phone number.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/trip-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: user?.email || "",
          destination: region,
          tripType: tripStyle,
          dates,
          guests,
          message: notes.trim(),
          source: "home_concierge_box",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit inquiry");
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError("Unable to submit right now. You can also message directly on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const getCustomWhatsappUrl = () => {
    const text = `Hi Visit Kokan! 👋 I'm planning a Konkan trip:\n• Destination: ${region}\n• Style: ${tripStyle}\n• Dates: ${dates}\n• Group: ${guests}\n• Notes: ${notes || "Looking for great stays & local food"}\n\nName: ${name || "Traveler"}\nPhone: ${phone || "Not specified"}\n\nPlease help plan this trip for me!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-4">
      {/* ── Main Personalized Planning Box ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#102d1d] via-[#18422b] to-[#0c2216] text-white p-6 sm:p-8 shadow-sm border border-emerald-900/40">
        {/* Soft background aesthetic glow */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 font-extrabold text-[11px] tracking-wide uppercase">
              <Sparkles size={13} className="text-amber-300" />
              <span>Personalized Kokan Concierge</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-black leading-tight text-white">
              Want a Custom Itinerary or Verified Homestay?
            </h2>

            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Tell our local Konkan travel specialists what you have in mind. We will handpick
              authentic beach cottages, heritage wadas, private pool stays, and secret coastal spots
              tailored to your dates and budget.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-white/90 font-medium">
              <span className="bg-white/10 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                🏡 Handpicked Local Stays
              </span>
              <span className="bg-white/10 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                🍛 Homemade Malvani Meals
              </span>
              <span className="bg-white/10 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                ⚡ 100% Free Concierge Planning
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            {/* WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md transition-all active:scale-95 whitespace-nowrap text-center"
            >
              <MessageCircle size={18} className="fill-white text-[#25D366]" />
              <span>Plan on WhatsApp</span>
            </a>

            {/* In-App Direct Message CTA */}
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-white text-[#122e1b] hover:bg-emerald-50 transition-all shadow-md active:scale-95 whitespace-nowrap cursor-pointer text-center"
            >
              <Send size={15} className="text-[#122e1b]" />
              <span>Message via Web App</span>
            </button>

            {/* AI Trip Planner Shortcut */}
            <Link
              href="/trip-planner"
              className="inline-flex items-center justify-center gap-1.5 text-[11px] text-amber-300 hover:text-amber-200 transition-colors py-1 text-center font-semibold"
            >
              <span>Instant AI Trip Planner</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Host / Property Owner Compact Ribbon ── */}
      <div className="rounded-2xl bg-white border border-kokan-sand/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-kokan-green/10 flex items-center justify-center text-xl shrink-0">
            🏡
          </div>
          <div>
            <h3 className="font-bold text-kokan-earth text-sm">
              Own a Homestay, Beach Villa, or Ancestral Wada in Konkan?
            </h3>
            <p className="text-xs text-kokan-earth/60">
              List your property with zero fees, verified guests, and a dedicated host dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
          <Link
            href="/register?tab=vendor"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-kokan-green text-white hover:bg-emerald-800 transition-all shadow-2xs whitespace-nowrap active:scale-95 text-center"
          >
            <span>List Your Homestay</span>
            <ArrowRight size={13} />
          </Link>
          <Link
            href="/login?redirect=/vendor/dashboard"
            className="inline-flex items-center justify-center px-3.5 py-2 rounded-full text-xs font-bold text-kokan-earth bg-gray-100 hover:bg-gray-200 transition-all whitespace-nowrap active:scale-95 text-center"
          >
            Host Login
          </Link>
        </div>
      </div>

      {/* ── Interactive In-App Concierge Modal / Drawer ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#122e1b] to-[#1e4a2d] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-amber-300">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">
                    Personalized Konkan Planning
                  </h3>
                  <p className="text-[11px] text-white/70">
                    Direct message to our local travel specialists
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-kokan-green flex items-center justify-center mx-auto text-2xl">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-kokan-earth">
                      Request Received!
                    </h4>
                    <p className="text-xs text-kokan-earth/70 max-w-sm mx-auto mt-1 leading-relaxed">
                      Our local concierge has received your details for{" "}
                      <span className="font-semibold text-kokan-green">{region}</span>. We will
                      review and reach out via WhatsApp / phone shortly.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <a
                      href={getCustomWhatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#25D366] text-white hover:bg-[#20ba59] transition-all shadow-xs"
                    >
                      <MessageCircle size={15} />
                      <span>Continue on WhatsApp Now</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-full text-xs font-bold bg-gray-100 text-kokan-earth hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3.5 py-2.5 text-xs">
                      {error}
                    </div>
                  )}

                  {/* Destination */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-kokan-earth flex items-center gap-1">
                      <MapPin size={13} className="text-kokan-green" />
                      <span>Where would you like to travel?</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {REGIONS.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRegion(r)}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                            region === r
                              ? "bg-kokan-green text-white shadow-2xs font-bold"
                              : "bg-gray-100 text-kokan-earth/75 hover:bg-gray-200"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trip Style */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-kokan-earth flex items-center gap-1">
                      <Compass size={13} className="text-kokan-green" />
                      <span>Trip Style / Preference</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {TRIP_STYLES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setTripStyle(s)}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                            tripStyle === s
                              ? "bg-kokan-green text-white shadow-2xs font-bold"
                              : "bg-gray-100 text-kokan-earth/75 hover:bg-gray-200"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dates & Guests row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-kokan-earth flex items-center gap-1">
                        <Calendar size={13} className="text-kokan-green" />
                        <span>Dates / Timing</span>
                      </label>
                      <input
                        type="text"
                        value={dates}
                        onChange={(e) => setDates(e.target.value)}
                        placeholder="e.g. Nov 15-17 or This Weekend"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-kokan-green bg-gray-50/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-kokan-earth flex items-center gap-1">
                        <Users size={13} className="text-kokan-green" />
                        <span>Guests / Group Size</span>
                      </label>
                      <input
                        type="text"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        placeholder="e.g. 2 Adults, 1 Child"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-kokan-green bg-gray-50/50"
                      />
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-kokan-earth">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rohan Patil"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-kokan-green bg-gray-50/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-kokan-earth">
                        WhatsApp / Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-kokan-green bg-gray-50/50"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-kokan-earth">
                      Special Requests / Preferences (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Need sea-facing room with homemade Malvani surmai thali & watersports guidance"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-kokan-green bg-gray-50/50 resize-none"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold bg-kokan-green text-white hover:bg-emerald-800 transition-all shadow-xs disabled:opacity-60 cursor-pointer"
                    >
                      {submitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={14} />
                          <span>Send Message to Concierge</span>
                        </>
                      )}
                    </button>

                    <a
                      href={getCustomWhatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-bold bg-[#25D366] text-white hover:bg-[#20ba59] transition-all shadow-xs"
                    >
                      <MessageCircle size={15} />
                      <span>Send via WhatsApp</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
