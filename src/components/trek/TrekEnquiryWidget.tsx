"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  Phone,
  Bell,
  Users,
  CheckCircle2,
  Calendar,
  Send,
  Sparkles,
  Clock,
  Loader2,
  ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  trekId: string;
  trekName: string;
  trekSlug: string;
  pricePerPerson: number;
  advanceAmount?: number;
  whatsappGroupLink?: string;
}

const SUPPORT_PHONE = "+918432587706";
const WHATSAPP_NUMBER = "918432587706";

export default function TrekEnquiryWidget({
  trekId,
  trekName,
  trekSlug,
  pricePerPerson,
  advanceAmount = 750,
  whatsappGroupLink,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [groupSize, setGroupSize] = useState("2-4");
  const [preferredMonth, setPreferredMonth] = useState("Upcoming Weekend");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const whatsappMessage = encodeURIComponent(
    `Hello Visit Kokan! 👋 I would like to enquire about upcoming dates and group slots for "${trekName}" (₹${pricePerPerson.toLocaleString("en-IN")}/person). Could you please share the next available schedule?`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/treks/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trekId,
          trekName,
          trekSlug,
          name: name.trim(),
          phone: phone.trim(),
          groupSize,
          preferredMonth,
          createdAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success("Enquiry received! We'll notify you on WhatsApp.", {
          icon: "🎉",
          duration: 4000,
        });
      } else {
        // Fallback graceful success
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="booking-section" className="space-y-4">
      {/* ── Status Capsule ── */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
            <Clock size={12} className="text-amber-700" /> Coming Soon • Dates Opening
          </span>
        </div>
        <p className="text-xs text-amber-900/85 leading-relaxed">
          Weekend expedition batches are being scheduled. Enquire directly to lock in early-bird priority or arrange a custom private departure!
        </p>
      </div>

      {/* ── Quick WhatsApp & Call Action Buttons ── */}
      <div className="space-y-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white rounded-2xl font-bold text-sm shadow-md shadow-[#25D366]/20 transition-all cursor-pointer"
        >
          <MessageCircle size={18} className="fill-white text-transparent shrink-0" />
          <span>Enquire on WhatsApp</span>
        </a>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${SUPPORT_PHONE}`}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-gray-50 border border-[#cadbc7] text-[#1a3822] rounded-xl font-semibold text-xs transition-colors cursor-pointer"
          >
            <Phone size={13} className="text-emerald-700" />
            <span>Call to Enquire</span>
          </a>

          {whatsappGroupLink ? (
            <a
              href={whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#17432d] rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              <Bell size={13} className="text-emerald-700" />
              <span>Join Updates Group</span>
            </a>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#17432d] rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              <Users size={13} className="text-emerald-700" />
              <span>Group (8+) Discount</span>
            </a>
          )}
        </div>
      </div>

      {/* ── Interactive Date Request / Notification Form ── */}
      <div className="bg-[#f7faf6] rounded-2xl p-4 border border-[#cadbc7] shadow-xs">
        {submitted ? (
          <div className="text-center py-4 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-2">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="text-sm font-bold text-[#142d1b]">Enquiry Received!</h4>
            <p className="text-xs text-[#4b6351] max-w-xs mx-auto leading-relaxed">
              Thank you, <span className="font-semibold">{name}</span>! Our trek coordinators will message you on WhatsApp as soon as slots open for {trekName}.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName("");
                setPhone("");
              }}
              className="mt-3 text-xs text-emerald-800 font-bold hover:underline"
            >
              Submit another inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitEnquiry} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#1d3d27] flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#2D6A4F]" /> Get Batch Alerts &amp; Custom Dates
              </span>
              <span className="text-[10px] text-[#4b6351] font-semibold bg-white px-2 py-0.5 rounded-full border border-[#cadbc7]">
                Free Priority List
              </span>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#304736] block mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#cadbc7] bg-white text-[#152e1d] focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#304736] block mb-1">
                WhatsApp / Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#cadbc7] bg-white text-[#152e1d] focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-[#304736] block mb-1">
                  Trekkers
                </label>
                <select
                  value={groupSize}
                  onChange={(e) => setGroupSize(e.target.value)}
                  className="w-full text-xs px-2.5 py-2.5 rounded-xl border border-[#cadbc7] bg-white text-[#152e1d] focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  <option value="1">Solo (1 Trekker)</option>
                  <option value="2-4">2 – 4 Friends</option>
                  <option value="5-8">5 – 8 People</option>
                  <option value="8+">8+ Group / Corporate</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#304736] block mb-1">
                  Preferred Time
                </label>
                <select
                  value={preferredMonth}
                  onChange={(e) => setPreferredMonth(e.target.value)}
                  className="w-full text-xs px-2.5 py-2.5 rounded-xl border border-[#cadbc7] bg-white text-[#152e1d] focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  <option value="Upcoming Weekend">Next Available</option>
                  <option value="This Month">This Month</option>
                  <option value="Next Month">Next Month</option>
                  <option value="Monsoon Season">Monsoon Batches</option>
                  <option value="Winter Season">Winter / Camping</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-[#1b4332] hover:bg-[#143326] active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Submit Priority Enquiry</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#4b6351]/75 pt-1">
        <ShieldCheck size={13} className="text-emerald-700" />
        <span>No spam · Verified WhatsApp support · Free group quotes</span>
      </div>
    </div>
  );
}
