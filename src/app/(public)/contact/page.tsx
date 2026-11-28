"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

const QUICK_TOPICS = [
  "Trek & Batch Booking",
  "Homestay / Stay Inquiry",
  "Product Order Support",
  "Partner / Host Onboarding",
  "Custom Group Trip",
];

const FAQS = [
  {
    q: "How do I join my booked trek batch WhatsApp group?",
    a: "Once your booking is confirmed and assigned to a batch, our coordinator adds you or shares the group invite link from your My Bookings section.",
  },
  {
    q: "Can I book a custom group trek or corporate outing?",
    a: "Yes! Select 'Custom Group Trip' above or message us on WhatsApp with your preferred dates, group size, and pickup city.",
  },
  {
    q: "How can I list my Konkan homestay or cottage?",
    a: "Visit our Host Registration page — listing is completely free with 0% commission on direct guest bookings.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send inquiry.");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again or WhatsApp us.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#0d2a19] via-[#113822] to-[#1a4d2e] text-white">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#b8dc26]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-12 sm:pt-12 sm:pb-16 text-center">
          <div className="flex justify-start mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/80 hover:text-[#b8dc26] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b8dc26]/15 border border-[#b8dc26]/30 text-[#b8dc26] text-[11px] font-bold uppercase tracking-wider mb-3">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Local Konkan Support · Replies Within 24h</span>
          </div>

          <h1 className="font-playfair text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Contact Visit Kokan
          </h1>
          <p className="text-white/75 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Questions about upcoming Sahyadri trek batches, coastal homestays, local product
            deliveries, or partnerships? Our Ratnagiri team is ready to help.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Direct Channels & Social */}
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-6 border border-kokan-sand/30 shadow-xs space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-kokan-green">
                  Direct Channels
                </span>
                <h2 className="font-playfair text-xl font-bold text-kokan-earth mt-0.5">
                  Get in Touch
                </h2>
              </div>

              <div className="space-y-4">
                <a
                  href="mailto:hello@visitkokan.in"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-9 h-9 bg-emerald-50 text-kokan-green rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#113822] group-hover:text-[#b8dc26] transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-kokan-earth/50 font-medium">Email</p>
                    <p className="text-sm font-semibold text-kokan-earth group-hover:text-kokan-green transition-colors">
                      hello@visitkokan.in
                    </p>
                  </div>
                </a>

                <a href="tel:+918432587706" className="flex items-start gap-3 group">
                  <div className="w-9 h-9 bg-emerald-50 text-kokan-green rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#113822] group-hover:text-[#b8dc26] transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-kokan-earth/50 font-medium">Phone / WhatsApp</p>
                    <p className="text-sm font-semibold text-kokan-earth group-hover:text-kokan-green transition-colors">
                      +91 84325 87706
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-emerald-50 text-kokan-green rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-kokan-earth/50 font-medium">Base Location</p>
                    <p className="text-sm font-semibold text-kokan-earth">
                      Ratnagiri &amp; Sindhudurg, Maharashtra
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-emerald-50 text-kokan-green rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-kokan-earth/50 font-medium">Support Hours</p>
                    <p className="text-sm font-semibold text-kokan-earth">
                      Daily · 8:00 AM – 9:00 PM IST
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/918432587706?text=Hello%20Visit%20Kokan!%20I%20have%20a%20question."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>Chat with Concierge on WhatsApp</span>
              </a>
            </div>

            {/* Social */}
            <div className="bg-white rounded-3xl p-6 border border-kokan-sand/30 shadow-xs">
              <h2 className="font-semibold text-kokan-earth text-sm mb-3.5">Follow Our Journey</h2>
              <div className="space-y-2.5">
                {[
                  {
                    icon: <Instagram className="w-4 h-4" />,
                    label: "Instagram · @visitkokan",
                    href: "https://instagram.com/visitkokan",
                    color: "text-pink-600 bg-pink-50 hover:bg-pink-100",
                  },
                  {
                    icon: <Facebook className="w-4 h-4" />,
                    label: "Facebook · Visit Kokan",
                    href: "https://facebook.com/visitkokan",
                    color: "text-blue-600 bg-blue-50 hover:bg-blue-100",
                  },
                  {
                    icon: <Youtube className="w-4 h-4" />,
                    label: "YouTube · Coastal Trails",
                    href: "https://youtube.com/@visitkokan",
                    color: "text-red-600 bg-red-50 hover:bg-red-100",
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors ${social.color}`}
                  >
                    <span className="flex items-center gap-2.5 text-xs font-semibold">
                      {social.icon}
                      <span>{social.label}</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-kokan-sand/30 shadow-xs">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-14">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-kokan-green" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-kokan-earth">
                  Message Received!
                </h3>
                <p className="text-kokan-earth/65 text-sm max-w-sm leading-relaxed">
                  Thank you for reaching out to Visit Kokan. Our team will reply to{" "}
                  <strong className="text-kokan-earth">{form.email}</strong> within 24 hours.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", subject: "", message: "" });
                    }}
                    className="px-5 py-2.5 bg-[#113822] hover:bg-[#1a4d2e] text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                  <Link
                    href="/treks"
                    className="px-5 py-2.5 bg-[#faf7f2] hover:bg-kokan-sand/30 border border-kokan-sand/40 text-kokan-earth rounded-full text-xs font-semibold transition-colors"
                  >
                    Browse Treks
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-kokan-green">
                    Send an Inquiry
                  </span>
                  <h2 className="font-playfair text-2xl font-bold text-kokan-earth mt-0.5 flex items-center gap-2">
                    <span>How Can We Help You?</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-kokan-earth/60 mt-1">
                    Pick a quick topic or write your message below.
                  </p>
                </div>

                {/* Quick Topic Pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {QUICK_TOPICS.map((topic) => {
                    const active = form.subject === topic;
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, subject: topic }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          active
                            ? "bg-[#113822] text-[#b8dc26] border-[#113822]"
                            : "bg-[#faf7f2] text-kokan-earth/75 border-kokan-sand/35 hover:border-kokan-green/40"
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>

                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-xs flex items-center gap-2">
                    <span>⚠</span> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-kokan-earth/75 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        placeholder="e.g. Rohan Sawant"
                        className="w-full bg-[#faf7f2]/60 border border-kokan-sand/50 rounded-xl px-4 py-2.5 text-sm text-kokan-earth focus:outline-none focus:bg-white focus:ring-2 focus:ring-kokan-green/25 focus:border-kokan-green"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-kokan-earth/75 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        placeholder="you@example.com"
                        className="w-full bg-[#faf7f2]/60 border border-kokan-sand/50 rounded-xl px-4 py-2.5 text-sm text-kokan-earth focus:outline-none focus:bg-white focus:ring-2 focus:ring-kokan-green/25 focus:border-kokan-green"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-kokan-earth/75 mb-1.5">
                      Subject *
                    </label>
                    <input
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      required
                      placeholder="Trek batch, homestay listing, order ID, or feedback"
                      className="w-full bg-[#faf7f2]/60 border border-kokan-sand/50 rounded-xl px-4 py-2.5 text-sm text-kokan-earth focus:outline-none focus:bg-white focus:ring-2 focus:ring-kokan-green/25 focus:border-kokan-green"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-kokan-earth/75 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={5}
                      placeholder="Share your travel dates, group size, booking ID, or question..."
                      className="w-full bg-[#faf7f2]/60 border border-kokan-sand/50 rounded-xl px-4 py-2.5 text-sm text-kokan-earth focus:outline-none focus:bg-white focus:ring-2 focus:ring-kokan-green/25 focus:border-kokan-green resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#113822] hover:bg-[#1a4d2e] text-white rounded-2xl font-bold text-sm transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#b8dc26]" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Quick FAQ Strip */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-kokan-sand/30 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-kokan-green" />
              <h2 className="font-playfair text-xl font-bold text-kokan-earth">
                Quick Answers Before You Write
              </h2>
            </div>
            <Link
              href="/trip-planner"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-kokan-green hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Konkan Mitra AI →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FAQS.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl bg-[#faf7f2] border border-kokan-sand/25 p-4 space-y-1.5"
              >
                <h3 className="text-xs font-bold text-kokan-earth leading-snug">{item.q}</h3>
                <p className="text-xs text-kokan-earth/65 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
