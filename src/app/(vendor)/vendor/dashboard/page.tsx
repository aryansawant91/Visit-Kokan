"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  MapPin,
  Package,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function VendorDashboardPage() {
  const { user, profile } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const hostName =
    profile?.businessName ||
    profile?.displayName ||
    user?.displayName ||
    "Host Partner";

  useEffect(() => {
    if (!user?.uid) return;
    fetchHostData();
  }, [user?.uid]);

  const fetchHostData = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const [listingsRes, productsRes] = await Promise.all([
        fetch(`/api/listings?vendorId=${user.uid}`).then((r) =>
          r.ok ? r.json() : []
        ),
        fetch(`/api/products?vendorId=${user.uid}`).then((r) =>
          r.ok ? r.json() : []
        ),
      ]);
      setListings(Array.isArray(listingsRes) ? listingsRes : []);
      setProducts(Array.isArray(productsRes) ? productsRes : []);
    } catch (err) {
      console.error("Error fetching vendor data:", err);
    } finally {
      setLoading(false);
    }
  };

  const approvedListings = listings.filter((l) => l.approved || l.status === "approved");
  const pendingListings = listings.filter((l) => !l.approved && l.status !== "rejected");

  return (
    <div className="space-y-7 pb-10">
      {/* ── 1. Host Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#122e1b] via-[#1a4427] to-[#14321d] p-6 sm:p-8 border border-white/10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2ecc71]/20 border border-[#2ecc71]/40 text-[#2ecc71] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={14} /> Official Kokan Host Partner
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {hostName}!
            </h1>
            <p className="text-white/70 text-sm max-w-xl leading-relaxed">
              Manage your homestays, villas, regional specialties, and traveler inquiries from Sindhudurg, Ratnagiri, and Raigad.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/vendor/listings/new"
              className="px-4 py-2.5 bg-[#2ecc71] hover:bg-[#27ae60] text-black font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add New Stay</span>
            </Link>
            <Link
              href="/vendor/products/new"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-all border border-white/15 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#2ecc71]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ── 2. Performance Metrics Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Stays */}
        <div className="bg-[#141414] rounded-2xl p-4 sm:p-5 border border-white/5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-white/50 text-xs font-medium">
            <span>My Properties</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-[#2ecc71]">
              <MapPin size={16} />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {loading ? "…" : listings.length}
          </div>
          <p className="text-[11px] text-white/40 flex items-center gap-1">
            <span className="text-[#2ecc71] font-bold">{approvedListings.length} Live</span>
            {pendingListings.length > 0 && (
              <span>• {pendingListings.length} Under Review</span>
            )}
          </p>
        </div>

        {/* Metric 2: Products */}
        <div className="bg-[#141414] rounded-2xl p-4 sm:p-5 border border-white/5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-white/50 text-xs font-medium">
            <span>Local Products</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Package size={16} />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {loading ? "…" : products.length}
          </div>
          <p className="text-[11px] text-white/40">
            Regional spices, cashews &amp; mangoes
          </p>
        </div>

        {/* Metric 3: Host Status */}
        <div className="bg-[#141414] rounded-2xl p-4 sm:p-5 border border-white/5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-white/50 text-xs font-medium">
            <span>Partner Status</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <ShieldCheck size={16} />
            </span>
          </div>
          <div className="text-sm sm:text-base font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
            <CheckCircle2 size={16} />
            <span>Active Partner</span>
          </div>
          <p className="text-[11px] text-white/40">
            0% Commission (First 3 Months)
          </p>
        </div>

        {/* Metric 4: Inquiries */}
        <div className="bg-[#141414] rounded-2xl p-4 sm:p-5 border border-white/5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-white/50 text-xs font-medium">
            <span>Traveler Inquiries</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Calendar size={16} />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            Direct
          </div>
          <p className="text-[11px] text-purple-300 font-medium">
            Via Verified WhatsApp &amp; Phone
          </p>
        </div>
      </div>

      {/* ── 3. Quick Action Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Link
          href="/vendor/listings/new"
          className="bg-[#141414] hover:bg-[#1a1a1a] p-4.5 rounded-2xl border border-white/5 hover:border-[#2ecc71]/40 transition-all flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-[#2ecc71]/10 text-[#2ecc71] flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
            🏡
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-white group-hover:text-[#2ecc71] transition-colors">
              Add New Property
            </h3>
            <p className="text-xs text-white/50 truncate">
              List homestay, beach cottage or villa
            </p>
          </div>
        </Link>

        <Link
          href="/vendor/products/new"
          className="bg-[#141414] hover:bg-[#1a1a1a] p-4.5 rounded-2xl border border-white/5 hover:border-amber-500/40 transition-all flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
            🥭
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
              Add Regional Product
            </h3>
            <p className="text-xs text-white/50 truncate">
              Sell Alphonso, spices &amp; Kokan treats
            </p>
          </div>
        </Link>

        <Link
          href="/vendor/profile"
          className="bg-[#141414] hover:bg-[#1a1a1a] p-4.5 rounded-2xl border border-white/5 hover:border-blue-500/40 transition-all flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
            ⚙️
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
              Host Profile &amp; Payouts
            </h3>
            <p className="text-xs text-white/50 truncate">
              Update phone, GST &amp; bank details
            </p>
          </div>
        </Link>
      </div>

      {/* ── 4. My Properties Section ── */}
      <div className="bg-[#141414] rounded-3xl p-5 sm:p-7 border border-white/5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin size={18} className="text-[#2ecc71]" />
              <span>My Properties &amp; Stays</span>
            </h2>
            <p className="text-xs text-white/40 mt-0.5">
              Live homestays, cottages, and listings on Visit Kokan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchHostData}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <Link
              href="/vendor/listings"
              className="text-xs font-bold text-[#2ecc71] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-white/40 text-sm">
            Loading your property listings…
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#2ecc71]/10 text-[#2ecc71] flex items-center justify-center mx-auto text-2xl">
              🏡
            </div>
            <h3 className="text-sm font-bold text-white">
              No Properties Listed Yet
            </h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
              List your authentic Konkan homestay, beachfront villa, or heritage wada to start receiving bookings from verified travelers.
            </p>
            <Link
              href="/vendor/listings/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2ecc71] text-black font-bold text-xs rounded-xl hover:bg-[#27ae60] transition-colors"
            >
              <Plus size={14} /> Add Your First Homestay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.slice(0, 6).map((listing) => {
              const isLive = listing.approved || listing.status === "approved";
              return (
                <div
                  key={listing.id}
                  className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 transition-all flex flex-col group"
                >
                  <div className="relative h-40 w-full bg-black/40">
                    {listing.images?.[0] ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🏡
                      </div>
                    )}
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs ${isLive
                            ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-950/90 text-amber-300 border-amber-500/30"
                          }`}
                      >
                        {isLive ? "🟢 Live" : "🟡 In Review"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#2ecc71] tracking-wider">
                        {listing.category || "Homestay"} • {listing.region}
                      </div>
                      <h4 className="font-bold text-sm text-white truncate mt-0.5">
                        {listing.name}
                      </h4>
                      {listing.price && (
                        <p className="text-xs text-white/70 font-semibold mt-1">
                          ₹{listing.price.toLocaleString("en-IN")}{" "}
                          <span className="text-[10px] text-white/40 font-normal">
                            /{listing.priceUnit || "night"}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-white/40 text-[11px]">
                        {listing.address || listing.region}
                      </span>
                      {listing.slug && isLive && (
                        <Link
                          href={`/listings/${listing.slug}`}
                          target="_blank"
                          className="text-[#2ecc71] hover:underline flex items-center gap-1 font-semibold text-[11px]"
                        >
                          <span>View</span>
                          <ExternalLink size={11} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 5. Host Concierge & Tips ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Support Card */}
        <div className="bg-[#141414] rounded-3xl p-6 border border-white/5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-[#2ecc71] flex items-center justify-center">
              <MessageCircle size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                Host Concierge &amp; Support
              </h3>
              <p className="text-xs text-white/40">
                Direct assistance from our local team
              </p>
            </div>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Need help updating room photos, adjusting seasonal rates, or optimizing your listing? Our Konkan destination team is ready to assist you.
          </p>
          <a
            href="https://wa.me/918432587706?text=Hi%20Visit%20Kokan%20Host%20Team!%20I%20am%20a%20registered%20host%20and%20need%20assistance%20with%20my%20listing."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <MessageCircle size={15} />
            <span>Chat on WhatsApp (+91 84325 87706)</span>
          </a>
        </div>

        {/* Tips Card */}
        <div className="bg-[#141414] rounded-3xl p-6 border border-white/5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                Tips to Maximize Bookings
              </h3>
              <p className="text-xs text-white/40">
                Recommended by top Konkan hosts
              </p>
            </div>
          </div>
          <ul className="space-y-1.5 text-xs text-white/60">
            <li className="flex items-start gap-2">
              <span className="text-[#2ecc71] font-bold">•</span>
              <span>Upload bright photos of bedrooms, washrooms, and outdoor dining.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2ecc71] font-bold">•</span>
              <span>Highlight homecooked Ukadiche Modak, Solkadhi, and seafood feasts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2ecc71] font-bold">•</span>
              <span>Respond to guest WhatsApp inquiries within 15 minutes for 3x bookings.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
