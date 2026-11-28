import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import {
  ShieldCheck,
  Lock,
  Database,
  Share2,
  Cookie,
  UserCheck,
  Baby,
  Mail,
  ArrowLeft,
  FileText,
  CreditCard,
  Compass,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Visit Kokan",
  description:
    "Learn how Visit Kokan collects, protects, and uses your personal information across trek bookings, homestay reservations, local products, and Konkan Mitra AI.",
};

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "No Data Selling",
    desc: "We never sell or rent your personal details to third-party marketers or brokers.",
  },
  {
    icon: CreditCard,
    title: "Zero Card Storage",
    desc: "Payments run through Razorpay. We never store your card numbers, CVV, or UPI PINs.",
  },
  {
    icon: UserCheck,
    title: "DPDP Act Aligned",
    desc: "Request access, correction, or deletion of your data anytime via email.",
  },
];

const SECTIONS = [
  {
    id: "information-we-collect",
    number: "01",
    icon: Database,
    title: "Information We Collect",
    intro:
      "We collect only the information necessary to deliver safe trek expeditions, authentic Konkan stays, local product deliveries, and personalized trip planning:",
    bullets: [
      {
        label: "Account & Profile Details",
        text: "Name, email address, phone number, and authentication identifiers when you sign in using Google, Email, or Mobile OTP.",
      },
      {
        label: "Trek & Batch Booking Data",
        text: "Traveler names, seat count, preferred pickup point, food preference (Veg / Non-Veg), and emergency contact details required for batch manifests and safety.",
      },
      {
        label: "Product & Delivery Information",
        text: "Shipping address, pin code, and order history when you purchase authentic Konkan products such as kokum, spices, or seasonal Alphonso mangoes.",
      },
      {
        label: "Konkan Mitra AI & Usage Insights",
        text: "Questions you ask our Konkan Mitra AI assistant and aggregated page/feature interactions (via Google Analytics 4) to improve route guides and service quality.",
      },
    ],
  },
  {
    id: "how-we-use",
    number: "02",
    icon: Compass,
    title: "How We Use Your Information",
    intro: "Your information is used strictly for operating and improving Visit Kokan services:",
    bullets: [
      {
        label: "Booking & Batch Coordination",
        text: "Confirming trek seats, preparing trekker manifests, sharing departure schedules, and coordinating WhatsApp batch groups.",
      },
      {
        label: "Order Fulfillment & Support",
        text: "Dispatching local Konkan products, sending booking receipts, and responding to customer support or host inquiries.",
      },
      {
        label: "Safety & Fraud Prevention",
        text: "Verifying Razorpay payment signatures, preventing unauthorized access, and protecting accounts against abuse or rate-limit violations.",
      },
    ],
  },
  {
    id: "payment-security",
    number: "03",
    icon: Lock,
    title: "Payments & Data Security",
    intro:
      "We take security seriously across every layer of the Visit Kokan platform:",
    bullets: [
      {
        label: "Razorpay PCI-DSS Processing",
        text: "All online payments are processed securely through Razorpay. Visit Kokan never collects, processes, or stores your raw debit/credit card numbers, CVV, or banking passwords.",
      },
      {
        label: "Infrastructure & Access Controls",
        text: "Application data is hosted on Google Cloud / Firebase with signed session cookies, role-based access controls, and encrypted HTTPS transport.",
      },
    ],
  },
  {
    id: "information-sharing",
    number: "04",
    icon: Share2,
    title: "Information Sharing & Third Parties",
    intro:
      "We do not sell, trade, or rent your personal information. We share limited details only when strictly required to fulfill your experience:",
    bullets: [
      {
        label: "Trek Leaders & Homestay Hosts",
        text: "Relevant booking details (name, phone number, pickup point, food preference) are shared with assigned trek coordinators or your booked homestay host.",
      },
      {
        label: "Essential Service Providers",
        text: "Trusted infrastructure and payment partners (Firebase/Google Cloud, Razorpay, and email/OTP providers) bound by confidentiality and security obligations.",
      },
      {
        label: "Legal Compliance",
        text: "When required by applicable Indian law, court order, or government authority for public safety.",
      },
    ],
  },
  {
    id: "cookies",
    number: "05",
    icon: Cookie,
    title: "Cookies & Analytics",
    intro:
      "We use essential cookies and privacy-conscious analytics to keep the website fast and reliable:",
    bullets: [
      {
        label: "Essential Session Cookies",
        text: "Signed authentication cookies keep you logged in securely and preserve your cart or trip-planner state.",
      },
      {
        label: "Analytics & Browser Control",
        text: "Google Analytics helps us understand popular destinations and trek demand. You may disable non-essential cookies through your browser settings at any time.",
      },
    ],
  },
  {
    id: "your-rights",
    number: "06",
    icon: UserCheck,
    title: "Data Retention & Your Rights",
    intro:
      "In alignment with India's Digital Personal Data Protection (DPDP) Act, you retain full control over your personal data:",
    bullets: [
      {
        label: "Access & Correction",
        text: "You can review your orders and profile details in your account dashboard or request corrections if any information is inaccurate.",
      },
      {
        label: "Account & Data Deletion",
        text: "You may request deletion of your personal data by emailing us, subject to statutory financial/tax record retention requirements for completed transactions.",
      },
    ],
  },
  {
    id: "childrens-privacy",
    number: "07",
    icon: Baby,
    title: "Children & Minor Travelers",
    intro:
      "Visit Kokan services are intended for adults aged 18 and above. Bookings for minors joining family or group treks must be made and supervised by a parent or legal guardian.",
  },
];

export default function PrivacyPage() {
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
              href="/terms"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#b8dc26]" />
              <span>Read Terms of Service →</span>
            </Link>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b8dc26]/15 border border-[#b8dc26]/30 text-[#b8dc26] text-[11px] font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Trust &amp; Data Protection</span>
          </div>

          <h1 className="font-playfair text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-white/75 text-sm sm:text-base max-w-2xl leading-relaxed">
            How Visit Kokan collects, safeguards, and uses your data across Sahyadri treks,
            coastal homestays, local Konkan products, and Konkan Mitra AI.
          </p>
          <p className="text-white/50 text-xs mt-4 font-medium">
            Last updated: November 2026 · Applicable across India
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

        {/* Two-column layout: Sticky TOC + Policy Sections */}
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
                href="#contact-privacy"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-kokan-earth/75 hover:text-kokan-green hover:bg-emerald-50/70 transition-colors whitespace-nowrap"
              >
                <span className="font-mono text-[10px] font-bold text-kokan-green/70">08</span>
                <span>Contact &amp; Grievance</span>
              </a>
            </nav>
          </aside>

          {/* Policy Body */}
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

            {/* Contact / Grievance Card */}
            <section
              id="contact-privacy"
              className="scroll-mt-24 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#113822] to-[#1a4d2e] text-white shadow-sm space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#b8dc26]/20 border border-[#b8dc26]/30 text-[#b8dc26] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#b8dc26] block">
                    Section 08 · Grievance &amp; Privacy Support
                  </span>
                  <h2 className="font-playfair text-xl font-bold text-white">
                    Questions or Data Requests?
                  </h2>
                </div>
              </div>

              <p className="text-sm text-white/80 leading-relaxed">
                For privacy questions, data access, or account deletion requests, reach out to our
                team in Ratnagiri, Maharashtra:
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="mailto:privacy@visitkokan.in"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#b8dc26] hover:bg-[#c8eb34] text-[#113822] text-xs font-black transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>privacy@visitkokan.in</span>
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
