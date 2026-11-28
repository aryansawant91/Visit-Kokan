import Link from "next/link";
import type { Metadata } from "next";
import { adminDb } from "@/lib/firebaseAdmin";
import {
  Compass,
  Mountain,
  Home,
  ShoppingBag,
  Sparkles,
  Ship,
  ShieldCheck,
  HeartHandshake,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Users,
  CheckCircle2,
  Percent,
} from "lucide-react";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About Visit Kokan | Coastal Stays, Sahyadri Treks & Local Experiences",
  description:
    "Discover Visit Kokan — connecting travelers with verified Sahyadri treks, authentic Konkan homestays, Ro-Ro ferry guides, regional produce, and AI trip planning.",
};

async function getAboutStats() {
  try {
    const [destSnap, trekSnap, userSnap, orderSnap, listingSnap] = await Promise.all([
      adminDb.collection("destinations").count().get(),
      adminDb.collection("treks").count().get(),
      adminDb.collection("users").count().get(),
      adminDb.collection("orders").count().get(),
      adminDb.collection("listings").count().get(),
    ]);

    const destinationsCount = destSnap.data().count;
    const treksCount = trekSnap.data().count;
    const usersCount = userSnap.data().count;
    const ordersCount = orderSnap.data().count;
    const listingsCount = listingSnap.data().count;

    return {
      guidesCount: destinationsCount + treksCount,
      destinationsCount,
      treksCount,
      customersCount: Math.max(usersCount, ordersCount),
      listingsCount,
    };
  } catch {
    return {
      guidesCount: 0,
      destinationsCount: 0,
      treksCount: 0,
      customersCount: 0,
      listingsCount: 0,
    };
  }
}

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Verified & Safety-First",
    desc: "Every trek batch includes dedicated coordinators, emergency tracking, and transparent Razorpay checkout.",
  },
  {
    icon: HeartHandshake,
    title: "Empowering Local Hosts",
    desc: "Homestays and regional producers connect with guests directly with 0% platform commission.",
  },
  {
    icon: CheckCircle2,
    title: "Rooted in Maharashtra",
    desc: "Built by travelers who know Konkan's seasons, monsoon trails, ferries, and local hospitality firsthand.",
  },
];

export default async function AboutPage() {
  const stats = await getAboutStats();

  const statCards = [
    {
      value: "720 km",
      label: "Konkan Coastline Covered",
      icon: MapPin,
    },
    {
      value: stats.guidesCount >= 25 ? `${stats.guidesCount}+` : "Curated",
      label: "Beaches, Forts & Sahyadri Treks",
      icon: Compass,
    },
    {
      value: stats.customersCount >= 100 ? `${stats.customersCount.toLocaleString("en-IN")}+` : "Verified",
      label: "Local Hosts & Trek Batches",
      icon: Users,
    },
    {
      value: "0%",
      label: "Host Commission · Direct Booking",
      icon: Percent,
    },
  ];

  const offerings = [
    {
      icon: Compass,
      title: "Curated Destinations",
      desc: "Handpicked guides to Konkan's pristine beaches, sea forts, hidden waterfalls, and heritage temples.",
      href: "/destinations",
      cta: "Explore Places",
    },
    {
      icon: Mountain,
      title: "Guided Sahyadri Treks",
      desc: "Safety-first group trek batches with verified leaders, pickup coordination, and live manifests.",
      href: "/treks",
      cta: "View Treks",
    },
    {
      icon: Home,
      title: "Authentic Homestays",
      desc: "Verified coastal wadas, cottages, and village stays hosted by local families with 0% commission.",
      href: "/listings?category=homestay",
      cta: "Browse Stays",
    },
    {
      icon: ShoppingBag,
      title: "Konkan Pantry & Produce",
      desc: "Direct-from-orchard Alphonso mangoes, kokum, cashews, and traditional Malvani masalas.",
      href: "/products",
      cta: "Shop Local",
    },
    {
      icon: Ship,
      title: "Ferry & Interactive Map",
      desc: "Live coastal route planning, Ro-Ro ferry timetables, and district-wise exploration tools.",
      href: "/ferry",
      cta: "Check Timings",
    },
    {
      icon: Sparkles,
      title: "Konkan Mitra AI Planner",
      desc: "Instant day-by-day coastal itineraries tailored to your dates, budget, and travel style.",
      href: "/trip-planner",
      cta: "Plan My Trip",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#0d2a19] via-[#113822] to-[#1a4d2e] text-white">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2a19] via-[#113822]/75 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20 sm:pt-12 sm:pb-24 text-center">
          <div className="flex justify-start mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/80 hover:text-[#b8dc26] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b8dc26]/15 border border-[#b8dc26]/30 text-[#b8dc26] text-[11px] font-bold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Our Story &amp; Mission</span>
          </div>

          <h1 className="font-playfair text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Bringing the Real Konkan Closer to You
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-7">
            From misty Sahyadri forts and golden Sindhudurg beaches to family-run wadas and
            Ratnagiri orchards — Visit Kokan is your all-in-one companion for authentic coastal travel.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/treks"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#b8dc26] hover:bg-[#c8eb34] text-[#113822] text-xs sm:text-sm font-black transition-all shadow-md"
            >
              <span>Explore Upcoming Treks</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/trip-planner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-xs transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#b8dc26]" />
              <span>Try Konkan Mitra AI</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Floating Stats Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-kokan-sand/30 shadow-md grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center space-y-1">
              <div className="w-8 h-8 mx-auto rounded-xl bg-emerald-50 text-kokan-green flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-kokan-earth">{value}</p>
              <p className="text-kokan-earth/60 text-xs font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Mission & Pillars */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-kokan-sand/30 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-kokan-green">
                Why We Started
              </span>
              <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-kokan-earth mt-1 mb-4">
                Built with Love for the Konkan Coast
              </h2>
              <p className="text-sm text-kokan-earth/75 leading-relaxed mb-4">
                Traveling through Konkan often meant scattered information — outdated ferry timings,
                hard-to-find local homestays, and unverified trek operators.
              </p>
              <p className="text-sm text-kokan-earth/75 leading-relaxed">
                We built Visit Kokan to unite verified destinations, organized Sahyadri trek batches,
                direct-to-host homestay discovery, and authentic regional produce into one trusted
                platform.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-kokan-sand/25 flex items-center gap-2 text-xs font-semibold text-kokan-green">
              <MapPin className="w-4 h-4" />
              <span>Headquartered in Ratnagiri &amp; Sindhudurg, Maharashtra</span>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 gap-4">
            {PILLARS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-kokan-sand/30 shadow-xs flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#113822] text-[#b8dc26] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-kokan-earth text-base mb-1">{title}</h3>
                  <p className="text-sm text-kokan-earth/70 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What We Offer */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-kokan-green">
                Everything in One Place
              </span>
              <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-kokan-earth mt-1">
                What Visit Kokan Offers
              </h2>
            </div>
            <Link
              href="/destinations"
              className="text-xs font-bold text-kokan-green hover:underline inline-flex items-center gap-1"
            >
              <span>Browse All Experiences</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {offerings.map(({ icon: Icon, title, desc, href, cta }) => (
              <Link
                key={title}
                href={href}
                className="group bg-white rounded-2xl p-5 border border-kokan-sand/30 hover:border-kokan-green/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-kokan-green flex items-center justify-center mb-3 group-hover:bg-[#113822] group-hover:text-[#b8dc26] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-kokan-earth text-base mb-1.5">{title}</h3>
                  <p className="text-xs sm:text-sm text-kokan-earth/65 leading-relaxed">{desc}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-kokan-green group-hover:translate-x-0.5 transition-transform">
                  <span>{cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#113822] to-[#1a4d2e] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="max-w-xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#b8dc26]/20 text-[#b8dc26] text-[11px] font-bold uppercase tracking-wider">
              Partner or Travel With Us
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold">
              Ready to Explore or Host in Konkan?
            </h2>
            <p className="text-white/75 text-sm leading-relaxed">
              List your homestay with 0% commission or message our local team to plan a custom
              group trek or family coastal getaway.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link
              href="/vendor/register"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#b8dc26] hover:bg-[#c8eb34] text-[#113822] text-xs font-black transition-colors"
            >
              <span>List Your Stay Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-colors"
            >
              <span>Contact Our Team</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
