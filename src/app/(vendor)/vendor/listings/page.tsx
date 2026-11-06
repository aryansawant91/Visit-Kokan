"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Eye,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Tab = "all" | "approved" | "pending";

export default function VendorListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?.uid) return;
    fetchListings();
  }, [user?.uid]);

  const fetchListings = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/listings?vendorId=${user.uid}`);
      if (res.ok) {
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load vendor listings:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = listings.filter((l) => {
    const isLive = l.approved || l.status === "approved";
    if (tab === "approved" && !isLive) return false;
    if (tab === "pending" && isLive) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        l.name?.toLowerCase().includes(q) ||
        l.region?.toLowerCase().includes(q) ||
        l.category?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    all: listings.length,
    approved: listings.filter((l) => l.approved || l.status === "approved").length,
    pending: listings.filter((l) => !l.approved && l.status !== "rejected").length,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <MapPin className="text-[#2ecc71]" size={24} />
            <span>My Properties &amp; Homestays</span>
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Manage your accommodations, pricing, photos, and live status on Visit Kokan
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchListings}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            title="Refresh listings"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <Link
            href="/vendor/listings/new"
            className="px-4 py-2.5 bg-[#2ecc71] hover:bg-[#27ae60] text-black font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Property</span>
          </Link>
        </div>
      </div>

      {/* ── Filters & Search Bar ── */}
      <div className="bg-[#141414] p-3 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === "all"
                ? "bg-[#2ecc71] text-black shadow-xs"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setTab("approved")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === "approved"
                ? "bg-emerald-500/20 text-[#2ecc71] border border-[#2ecc71]/40"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            🟢 Live ({counts.approved})
          </button>
          <button
            type="button"
            onClick={() => setTab("pending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === "pending"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            🟡 In Review ({counts.pending})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or region…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#2ecc71]"
          />
        </div>
      </div>

      {/* ── Content Grid ── */}
      {loading ? (
        <div className="py-20 text-center text-white/40 text-sm">
          Loading your listings…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#141414] border border-white/5 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#2ecc71]/10 text-[#2ecc71] flex items-center justify-center mx-auto text-3xl">
            🏡
          </div>
          <h3 className="text-base font-bold text-white">
            {search ? "No properties match your search" : "No properties found in this tab"}
          </h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            {search
              ? "Try clearing your search query or check spelling."
              : "Get started by adding your homestay or holiday villa to the platform."}
          </p>
          {!search && (
            <Link
              href="/vendor/listings/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2ecc71] text-black font-bold text-xs rounded-xl hover:bg-[#27ae60] transition-colors"
            >
              <Plus size={15} /> Add New Property
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((listing) => {
            const isLive = listing.approved || listing.status === "approved";
            return (
              <div
                key={listing.id}
                className="bg-[#141414] rounded-3xl overflow-hidden border border-white/5 hover:border-white/15 transition-all flex flex-col group shadow-lg"
              >
                {/* Photo Strip */}
                <div className="relative h-48 w-full bg-black/40">
                  {listing.images?.[0] ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🏡
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-md backdrop-blur-md ${
                        isLive
                          ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/40"
                          : "bg-amber-950/90 text-amber-300 border-amber-500/40"
                      }`}
                    >
                      {isLive ? "🟢 Live on Site" : "🟡 Under Admin Review"}
                    </span>
                  </div>

                  {listing.images?.length > 1 && (
                    <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 text-white/80 text-[10px] font-semibold backdrop-blur-xs">
                      📷 {listing.images.length} Photos
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#2ecc71] font-bold uppercase tracking-wider mb-1">
                      <span>{listing.category || "Homestay"}</span>
                      <span>📍 {listing.region}</span>
                    </div>

                    <h3 className="font-extrabold text-base text-white tracking-tight leading-snug line-clamp-1">
                      {listing.name}
                    </h3>

                    {listing.description && (
                      <p className="text-xs text-white/50 line-clamp-2 mt-1 leading-relaxed">
                        {listing.description}
                      </p>
                    )}

                    {listing.price && (
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-lg font-black text-white">
                          ₹{listing.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-white/50 font-medium">
                          /{listing.priceUnit || "night"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-white/40 truncate max-w-[150px]">
                      {listing.address || listing.region}
                    </span>

                    {listing.slug && isLive ? (
                      <Link
                        href={`/listings/${listing.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#2ecc71]/20 text-[#2ecc71] text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Eye size={13} />
                        <span>View Live</span>
                        <ExternalLink size={11} />
                      </Link>
                    ) : (
                      <span className="text-[11px] text-amber-400/80 font-medium flex items-center gap-1">
                        <Clock size={12} /> Pending Approval
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
