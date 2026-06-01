"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Instagram, Facebook, Youtube } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-kokan-cream/20">
      {/* Hero */}
      <div className="bg-kokan-green py-14 text-center px-4">
        <h1 className="font-playfair text-4xl font-bold text-white mb-2">Contact Us</h1>
        <p className="text-white/70 text-sm max-w-md mx-auto">
          Have a question, suggestion or want to partner with us? We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact info */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30 space-y-5">
            <h2 className="font-semibold text-kokan-earth">Get in Touch</h2>
            {[
              { icon: <Mail className="w-4 h-4 text-kokan-green" />, label: "Email", value: "hello@visitkokan.in" },
              { icon: <Phone className="w-4 h-4 text-kokan-green" />, label: "Phone", value: "+91 98765 43210" },
              { icon: <MapPin className="w-4 h-4 text-kokan-green" />, label: "Location", value: "Ratnagiri, Maharashtra" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-kokan-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-kokan-earth/40">{item.label}</p>
                  <p className="text-sm font-medium text-kokan-earth">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social */}
          <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30">
            <h2 className="font-semibold text-kokan-earth mb-4">Follow Us</h2>
            <div className="space-y-3">
              {[
                { icon: <Instagram className="w-4 h-4" />, label: "Instagram", href: "https://instagram.com/visitkokan", color: "text-pink-500 bg-pink-50" },
                { icon: <Facebook className="w-4 h-4" />, label: "Facebook", href: "https://facebook.com/visitkokan", color: "text-blue-600 bg-blue-50" },
                { icon: <Youtube className="w-4 h-4" />, label: "YouTube", href: "https://youtube.com/@visitkokan", color: "text-red-500 bg-red-50" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors hover:opacity-80 ${social.color}`}
                >
                  {social.icon}
                  <span className="text-sm font-medium">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-kokan-sand/30">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
              <div className="w-16 h-16 bg-kokan-green/10 rounded-full flex items-center justify-center">
                <Send className="w-8 h-8 text-kokan-green" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-kokan-earth">Message Sent!</h3>
              <p className="text-kokan-earth/50 text-sm max-w-xs">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="px-5 py-2 bg-kokan-green text-white rounded-xl text-sm font-medium"
              >
                Send Another
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-semibold text-kokan-earth mb-5 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-kokan-green" /> Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Your Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      placeholder="Rohan Sawant"
                      className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      placeholder="you@example.com"
                      className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Subject</label>
                  <input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                    placeholder="How can we help?"
                    className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={5}
                    placeholder="Tell us more..."
                    className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-kokan-green text-white rounded-xl font-semibold text-sm hover:bg-kokan-green/90 transition-colors disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}