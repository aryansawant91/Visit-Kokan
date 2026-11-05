"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  MessageCircle,
  Send,
  X,
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const WHATSAPP_NUMBER = "918432587706";

const DESTINATIONS = [
  { name: "Tarkarli & Malvan", icon: "🌊", region: "Sindhudurg" },
  { name: "Alibaug & Kashid", icon: "🏖️", region: "Raigad" },
  { name: "Ganpatipule", icon: "🥥", region: "Ratnagiri" },
  { name: "Dapoli & Guhagar", icon: "🌴", region: "Ratnagiri" },
  { name: "Murud-Janjira", icon: "🏰", region: "Raigad" },
  { name: "Any Konkan Beach", icon: "✨", region: "Konkan" },
];

export default function PersonalizedTripPlanningBox() {
  const { user, profile } = useAuth();
  const [selectedDest, setSelectedDest] = useState(DESTINATIONS[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [stayPreference, setStayPreference] = useState("Beachfront Homestay");
  const [dates, setDates] = useState("Upcoming Weekend");
  const [guests, setGuests] = useState("2-4 Guests");
  const [name, setName] = useState(profile?.displayName || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const directMessage = `Hi Visit Kokan! 👋 Can you arrange or find a homestay for me in ${selectedDest.name}?`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    directMessage
  )}`;

  const getCustomWhatsappUrl = () => {
    const text = `Hi Visit Kokan! 👋 Can you arrange or find a homestay for me in ${selectedDest.name}?\n\n• Destination: ${selectedDest.name} (${selectedDest.region})\n• Preference: ${stayPreference}\n• Dates: ${dates}\n• Guests: ${guests}\n• Notes: ${notes || "Looking for verified stay with good homecooked food"}\n\nName: ${name || "Traveler"}\nPhone: ${phone || "Not specified"}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
          destination: selectedDest.name,
          tripType: `Homestay in ${selectedDest.name}`,
          dates,
          guests,
          message: `Can you arrange or find a homestay for me in ${selectedDest.name}? Preference: ${stayPreference}. Notes: ${notes.trim()}`,
          source: `home_destination_box_${selectedDest.name}`,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      setSubmitted(true);
    } catch {
      setError("Unable to submit right now. You can also send directly via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* ── Main Destination Homestay Arrangement Card ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#102d1d] via-[#18422b] to-[#0c2216] text-white p-5 sm:p-7 shadow-sm border border-emerald-900/40">
        {/* Soft background glow */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Destination Selector Tabs */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-300" />
                <span>Select a destination to find or arrange a stay</span>
              </span>
              <span className="text-[11px] text-white/60 hidden sm:inline">
                Verified Local Stays
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {DESTINATIONS.map((dest) => (
                <button
                  key={dest.name}
                  type="button"
                  onClick={() => setSelectedDest(dest)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedDest.name === dest.name
                      ? "bg-[#b8dc26] text-[#122e1b] shadow-xs scale-102"
                      : "bg-white/10 hover:bg-white/20 text-white/85 border border-white/10"
                  }`}
                >
                  <span>{dest.icon}</span>
                  <span>{dest.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Core Prompt Box: "Can you arrange or find a homestay for me in {selectedDest.name}?" */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-amber-300 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1 mb-1">
                  <span>💬 Direct Concierge Request</span>
                </p>
                <h3 className="text-lg sm:text-xl font-display font-black text-white leading-snug">
                  &ldquo;Can you arrange or find a homestay for me in {selectedDest.name}?&rdquo;
                </h3>
                <p className="text-white/80 text-xs mt-1 leading-relaxed">
                  Looking for a stay in {selectedDest.name}? Send us a direct message. Our local team
                  will personally arrange or find verified beach cottages, heritage wadas, or local
                  family stays with homecooked Malvani meals.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex flex-col sm:flex-row items-center gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xs transition-all active:scale-95 text-center"
              >
                <MessageCircle size={16} />
                <span>Ask on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setModalOpen(true);
                }}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white text-[#122e1b] hover:bg-emerald-50 transition-all shadow-xs active:scale-95 cursor-pointer text-center"
              >
                <Send size={14} className="text-[#122e1b]" />
                <span>Message via Web App</span>
              </button>
            </div>
          </div>

          {/* Discreet Host Link at Bottom */}
          <div className="flex items-center justify-between text-xs text-white/60 pt-1">
            <span>Are you a homestay or property owner in Konkan?</span>
            <Link
              href="/register?tab=vendor"
              className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1"
            >
              <span>List your property</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Interactive Web App Message Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#122e1b] to-[#1e4a2d] text-white p-4.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm leading-tight">
                  Find Homestay in {selectedDest.name}
                </h3>
                <p className="text-[10px] text-white/70">
                  Direct inquiry to Visit Kokan concierge
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-3.5">
              {submitted ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-kokan-green flex items-center justify-center mx-auto text-xl">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-kokan-earth">
                      Message Sent!
                    </h4>
                    <p className="text-xs text-kokan-earth/70 max-w-xs mx-auto mt-1 leading-relaxed">
                      We received your request for{" "}
                      <span className="font-semibold text-kokan-green">{selectedDest.name}</span>.
                      Our team will find and arrange the best verified options for you shortly.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href={getCustomWhatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#25D366] text-white hover:bg-[#20ba59] transition-all shadow-xs"
                    >
                      <MessageCircle size={15} />
                      <span>Continue on WhatsApp Now</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-950 font-medium">
                    <span className="font-bold text-emerald-900 block mb-0.5">💬 Message:</span>
                    &ldquo;Can you arrange or find a homestay for me in {selectedDest.name}?&rdquo;
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2 text-xs">
                      {error}
                    </div>
                  )}

                  {/* Preference */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-kokan-earth">Stay Preference</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Beachfront Cottage",
                        "Heritage Wada",
                        "Budget Homestay",
                        "Private Villa",
                      ].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setStayPreference(t)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                            stayPreference === t
                              ? "bg-kokan-green text-white font-bold"
                              : "bg-gray-100 text-kokan-earth/75 hover:bg-gray-200"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dates & Guests */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-kokan-earth flex items-center gap-1">
                        <Calendar size={12} className="text-kokan-green" /> Dates
                      </label>
                      <input
                        type="text"
                        value={dates}
                        onChange={(e) => setDates(e.target.value)}
                        placeholder="e.g. This Weekend"
                        className="w-full text-xs px-2.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-kokan-green bg-gray-50/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-kokan-earth flex items-center gap-1">
                        <Users size={12} className="text-kokan-green" /> Guests
                      </label>
                      <input
                        type="text"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        placeholder="e.g. 2 Adults"
                        className="w-full text-xs px-2.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-kokan-green bg-gray-50/50"
                      />
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-kokan-earth">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full text-xs px-2.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-kokan-green bg-gray-50/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-kokan-earth">
                        WhatsApp / Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone number"
                        className="w-full text-xs px-2.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-kokan-green bg-gray-50/50"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-kokan-earth">
                      Notes / Requests (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Near beach, homemade Malvani food, AC room"
                      className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:border-kokan-green bg-gray-50/50 resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-1 flex flex-col gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-kokan-green text-white hover:bg-emerald-800 transition-all shadow-xs disabled:opacity-60 cursor-pointer"
                    >
                      {submitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={13} />
                          <span>Send Message to Arrange Stay</span>
                        </>
                      )}
                    </button>

                    <a
                      href={getCustomWhatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-emerald-800 hover:text-emerald-950"
                    >
                      <MessageCircle size={13} />
                      <span>Or send directly via WhatsApp</span>
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
