"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  Send,
  X,
  CheckCircle2,
  Calendar,
  Users,
  Home,
  Sparkles,
  ShieldCheck,
  Phone,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const WHATSAPP_NUMBER = "918432587706";

interface Props {
  destinationName: string;
  region: string;
  variant?: "card" | "compact";
}

export default function DestinationStayEnquiryBox({
  destinationName,
  region,
  variant = "card",
}: Props) {
  const { user, profile } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState(profile?.displayName || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [dates, setDates] = useState("Upcoming Weekend");
  const [guests, setGuests] = useState("2-4 Guests");
  const [stayType, setStayType] = useState("Beachfront Homestay");
  const [specialRequest, setSpecialRequest] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const defaultWhatsappMessage = `Hi Visit Kokan! 👋 Can you arrange or find a homestay for me in ${destinationName} (${region})?`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    defaultWhatsappMessage
  )}`;

  const getCustomWhatsappUrl = () => {
    const text = `Hi Visit Kokan! 👋 Can you arrange or find a homestay for me in ${destinationName}?\n\n• Destination: ${destinationName} (${region})\n• Stay Type: ${stayType}\n• Dates: ${dates}\n• Guests: ${guests}\n• Notes: ${specialRequest || "Need clean verified stay with good local food"}\n\nName: ${name || "Traveler"}\nPhone: ${phone || "Not specified"}`;
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
          destination: `${destinationName} (${region})`,
          tripType: `Homestay in ${destinationName}`,
          dates,
          guests,
          message: `Can you arrange or find a homestay for me in ${destinationName}? Preference: ${stayType}. Notes: ${specialRequest.trim()}`,
          source: `destination_page_${destinationName}`,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      setSubmitted(true);
    } catch {
      setError("Unable to send message right now. Please tap WhatsApp to send directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-[#122e1b] via-[#1b4329] to-[#0c2214] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-900/40 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          {/* Eyebrow */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 font-extrabold text-[10px] tracking-wide uppercase border border-white/10">
              <Sparkles size={11} className="text-amber-300" />
              <span>Direct Local Stay Arrangement</span>
            </span>
            <span className="text-[10px] text-white/60 font-medium">
              100% Verified Local Hosts
            </span>
          </div>

          {/* Heading */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              Looking for a stay in {destinationName}?
            </h3>
            <p className="text-white/80 text-xs mt-1 leading-relaxed">
              Our team personally connects with verified coastal cottages, heritage wadas, and local
              families in {region}. Tell us what you need and we will arrange or find the ideal stay for
              you.
            </p>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap gap-2 text-[10px] text-emerald-100 font-medium">
            <span className="bg-white/10 px-2 py-0.5 rounded-md">✓ Verified Local Homestays</span>
            <span className="bg-white/10 px-2 py-0.5 rounded-md">✓ Home-cooked Malvani Meals</span>
            <span className="bg-white/10 px-2 py-0.5 rounded-md">✓ Direct Host Rates</span>
          </div>

          {/* Action buttons */}
          <div className="pt-1 flex flex-col sm:flex-row gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xs transition-all active:scale-95 text-center"
            >
              <MessageCircle size={15} />
              <span>Ask on WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setModalOpen(true);
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-white text-[#122e1b] hover:bg-emerald-50 transition-all shadow-xs active:scale-95 cursor-pointer text-center"
            >
              <Send size={13} className="text-[#122e1b]" />
              <span>Message via Web App</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Direct Web App Message Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#122e1b] to-[#1e4a2d] text-white p-4.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-amber-300">
                  <Home size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">
                    Find Homestay in {destinationName}
                  </h3>
                  <p className="text-[10px] text-white/70">
                    Direct message to Visit Kokan concierge
                  </p>
                </div>
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
                      Message Sent Successfully!
                    </h4>
                    <p className="text-xs text-kokan-earth/70 max-w-xs mx-auto mt-1 leading-relaxed">
                      We have received your request for{" "}
                      <span className="font-semibold text-kokan-green">{destinationName}</span>.
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
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Pre-filled Message Banner */}
                  <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-950 font-medium">
                    <span className="font-bold text-emerald-900 block mb-0.5">💬 Your Request:</span>
                    &ldquo;Can you arrange or find a homestay for me in {destinationName}?&rdquo;
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2 text-xs">
                      {error}
                    </div>
                  )}

                  {/* Stay Preference */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-kokan-earth">Stay Preference</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Beachfront Cottage",
                        "Family Wada",
                        "Budget Homestay",
                        "Private Villa",
                      ].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setStayType(t)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                            stayType === t
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
                        placeholder="e.g. Nov 15-17"
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

                  {/* Additional notes */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-kokan-earth">
                      Specific Requirements (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      placeholder="e.g. Close to beach, homecooked Malvani surmai thali, AC room"
                      className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:border-kokan-green bg-gray-50/50 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
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
    </>
  );
}

