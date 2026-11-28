import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import {
  FileText,
  Mountain,
  RefreshCcw,
  Home,
  ShoppingBag,
  Sparkles,
  AlertTriangle,
  Scale,
  Mail,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Visit Kokan",
  description:
    "Read the Visit Kokan Terms of Service covering Sahyadri trek bookings, weather & safety guidelines, cancellations, homestay hosts, and local product orders.",
};

const HIGHLIGHTS = [
  {
    icon: Mountain,
    title: "Trek Safety First",
    desc: "Routes and schedules may adapt to Sahyadri weather or safety conditions.",
  },
  {
    icon: RefreshCcw,
    title: "Clear Refund Rules",
    desc: "Eligible Razorpay refunds are processed back to source within 5–7 business days.",
  },
  {
    icon: Home,
    title: "Verified Hosts",
    desc: "Homestay partners commit to accurate pricing, photos, and guest hospitality.",
  },
];

const SECTIONS = [
  {
    id: "acceptance",
    number: "01",
    icon: CheckCircle2,
    title: "Acceptance of Terms & Eligibility",
    intro:
      "By browsing Visit Kokan, creating an account, booking a trek batch, reserving a stay, or ordering Konkan products, you agree to be bound by these Terms of Service:",
    bullets: [
      {
        label: "Eligibility",
        text: "You must be at least 18 years old to create an account or make bookings. Minors participating in treks must be accompanied or authorized by a parent or legal guardian.",
      },
      {
        label: "Account Responsibility",
        text: "You are responsible for maintaining accurate contact details (especially mobile numbers for trek batch updates) and safeguarding your login credentials.",
      },
    ],
  },
  {
    id: "trek-bookings",
    number: "02",
    icon: Mountain,
    title: "Trek & Expedition Bookings, Safety & Weather",
    intro:
      "Sahyadri and Konkan treks take place in natural outdoor terrain where weather and trail conditions can change rapidly:",
    bullets: [
      {
        label: "Leader Instructions & Discipline",
        text: "Participants must follow the instructions of assigned Visit Kokan Trek Leaders at all times, stay with the group, and avoid littering or alcohol/intoxicants during treks.",
      },
      {
        label: "Fitness & Medical Disclosure",
        text: "Participants must self-assess their fitness for the trek difficulty grade and inform coordinators in advance of any relevant medical conditions.",
      },
      {
        label: "Weather & Route Changes",
        text: "For participant safety during heavy monsoon rain, landslides, or forest-department restrictions, Visit Kokan reserves the right to modify itineraries, change pickup timings, or reschedule a batch.",
      },
    ],
  },
  {
    id: "cancellations-refunds",
    number: "03",
    icon: RefreshCcw,
    title: "Payments, Cancellations & Refunds",
    intro:
      "All online payments are processed securely via Razorpay. Booking confirmation is issued once payment verification succeeds:",
    bullets: [
      {
        label: "Advance & Balance Payments",
        text: "Where a trek batch allows advance booking with remaining cash/UPI collection at departure, the remaining balance must be settled prior to boarding.",
      },
      {
        label: "Organizer Cancellation",
        text: "If Visit Kokan cancels a trek batch due to extreme weather or operational reasons, you may choose a full refund or a free transfer to an upcoming batch.",
      },
      {
        label: "Participant Cancellation & Refund Timeline",
        text: "Refund eligibility depends on notice period prior to departure and non-refundable transport/permit commitments. Approved refunds are credited via Razorpay within 5–7 business days.",
      },
    ],
  },
  {
    id: "vendors-homestays",
    number: "04",
    icon: Home,
    title: "Homestays, Listings & Vendor Terms",
    intro:
      "Visit Kokan provides a discovery and booking platform connecting travelers with independent Konkan homestays, resorts, and experience hosts:",
    bullets: [
      {
        label: "Host Accuracy",
        text: "Hosts must provide truthful photos, amenities, availability, and pricing. Misleading listings or repeated guest complaints may result in suspension or removal.",
      },
      {
        label: "Property Rules",
        text: "Guests agree to respect check-in/check-out timings and house rules set by the respective homestay or resort partner.",
      },
    ],
  },
  {
    id: "products",
    number: "05",
    icon: ShoppingBag,
    title: "Konkan Products & Seasonal Orders",
    intro:
      "Authentic regional goods (such as Alphonso/Hapus mangoes, kokum, cashews, and Malvani spices) are sourced from regional producers:",
    bullets: [
      {
        label: "Seasonal Availability",
        text: "Fresh agricultural produce is subject to harvest cycles and weather. Dispatch timelines are shared as estimates.",
      },
      {
        label: "Damaged or Incorrect Items",
        text: "Please report damaged or incorrect deliveries with photos within 24 hours of receipt via our Contact page so we can arrange a replacement or resolution.",
      },
    ],
  },
  {
    id: "ai-and-guides",
    number: "06",
    icon: Sparkles,
    title: "Konkan Mitra AI & Travel Guides",
    intro:
      "Destination guides, interactive maps, ferry timetables, and Konkan Mitra AI suggestions are provided to help plan your journey. Because coastal ferry schedules, roadworks, and weather evolve, travelers should double-check critical timings locally before departure.",
  },
  {
    id: "prohibited-use",
    number: "07",
    icon: AlertTriangle,
    title: "Prohibited Conduct",
    intro: "When using Visit Kokan, you agree not to:",
    bullets: [
      {
        label: "Platform Integrity",
        text: "Attempt to tamper with prices, bypass payment verification, scrape content in bulk, or probe non-public admin APIs.",
      },
      {
        label: "Respectful Community",
        text: "Harass hosts, trek leaders, support staff, or fellow travelers on the platform or in batch WhatsApp groups.",
      },
    ],
  },
  {
    id: "liability-law",
    number: "08",
    icon: Scale,
    title: "Limitation of Liability & Governing Law",
    intro:
      "To the maximum extent permitted by law, Visit Kokan shall not be liable for indirect, incidental, or consequential damages, or events beyond reasonable control (force majeure including severe weather, road closures, or strikes). These Terms are governed by the laws of India, with jurisdiction in Ratnagiri, Maharashtra.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#0d2a19] via-[#113822] to-[#1a4d2e] text-white">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#b8dc26]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 relative">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/80 hover:text-[#b8dc26] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Visit Kokan</span>
            </Link>

            <Link
              href="/privacy"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#b8dc26]" />
              <span>Read Privacy Policy →</span>
            </Link>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b8dc26]/15 border border-[#b8dc26]/30 text-[#b8dc26] text-[11px] font-bold uppercase tracking-wider mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Platform &amp; Expedition Agreement</span>
          </div>

          <h1 className="font-playfair text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Terms of Service
          </h1>
          <p className="text-white/75 text-sm sm:text-base max-w-2xl leading-relaxed">
            Clear guidelines for booking Visit Kokan trek batches, reserving coastal homestays,
            ordering regional products, and participating safely in outdoor expeditions.
          </p>
          <p className="text-white/50 text-xs mt-4 font-medium">
            Last updated: November 2026 · Governed by Laws of India
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Quick Highlights */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-5 border border-kokan-sand/30 shadow-xs flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center flex-shrink-0 text-kokan-green">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-kokan-earth text-sm">{title}</h2>
                <p className="text-kokan-earth/65 text-xs leading-relaxed mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Two-column layout: Sticky TOC + Terms Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">
          {/* Table of Contents */}
          <aside className="bg-white rounded-2xl p-4 border border-kokan-sand/30 shadow-xs lg:sticky lg:top-20">
            <p className="text-[11px] font-bold uppercase tracking-widest text-kokan-earth/50 mb-3 px-2">
              On This Page
            </p>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-kokan-earth/75 hover:text-kokan-green hover:bg-emerald-50/70 transition-colors whitespace-nowrap"
                >
                  <span className="font-mono text-[10px] font-bold text-kokan-green/70">
                    {s.number}
                  </span>
                  <span className="truncate">{s.title}</span>
                </a>
              ))}
              <a
                href="#contact-legal"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-kokan-earth/75 hover:text-kokan-green hover:bg-emerald-50/70 transition-colors whitespace-nowrap"
              >
                <span className="font-mono text-[10px] font-bold text-kokan-green/70">09</span>
                <span>Legal Contact</span>
              </a>
            </nav>
          </aside>

          {/* Terms Body */}
          <div className="space-y-5">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 bg-white rounded-3xl p-6 sm:p-8 border border-kokan-sand/30 shadow-xs space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#113822] text-[#b8dc26] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-kokan-green block">
                        Section {section.number}
                      </span>
                      <h2 className="font-playfair text-xl font-bold text-kokan-earth">
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm text-kokan-earth/75 leading-relaxed">{section.intro}</p>

                  {section.bullets && (
                    <ul className="space-y-3 pt-1">
                      {section.bullets.map((b) => (
                        <li
                          key={b.label}
                          className="rounded-2xl bg-[#faf7f2] border border-kokan-sand/25 px-4 py-3 text-sm text-kokan-earth/75 leading-relaxed"
                        >
                          <span className="font-semibold text-kokan-earth">{b.label}: </span>
                          {b.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}

            {/* Contact / Legal Card */}
            <section
              id="contact-legal"
              className="scroll-mt-24 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#113822] to-[#1a4d2e] text-white shadow-sm space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#b8dc26]/20 border border-[#b8dc26]/30 text-[#b8dc26] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#b8dc26] block">
                    Section 09 · Legal &amp; Booking Queries
                  </span>
                  <h2 className="font-playfair text-xl font-bold text-white">
                    Need Clarification on These Terms?
                  </h2>
                </div>
              </div>

              <p className="text-sm text-white/80 leading-relaxed">
                For questions regarding trek policies, host agreements, refunds, or legal notices,
                contact our team in Ratnagiri, Maharashtra:
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="mailto:legal@visitkokan.in"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#b8dc26] hover:bg-[#c8eb34] text-[#113822] text-xs font-black transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>legal@visitkokan.in</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-colors"
                >
                  <span>Visit Contact Page →</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
