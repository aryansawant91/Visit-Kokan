"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, Eye, MapPin, Star, ToggleLeft, ToggleRight } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";

type ListingStatus = "pending" | "approved" | "rejected";

interface Listing {
  id: string;
  title: string;
  vendor: string;
  category: string;
  region: string;
  status: ListingStatus;
  submittedAt: string;
  rating: number;
  reviews: number;
  featured: boolean;
  price: string;
}

const MOCK_LISTINGS: Listing[] = [
  { id: "1", title: "Beachside Cottage — Tarkarli", vendor: "Sindhudurg Homestays", category: "Accommodation", region: "Tarkarli", status: "pending", submittedAt: "Apr 21, 2025", rating: 0, reviews: 0, featured: false, price: "₹2,500/night" },
  { id: "2", title: "Scuba Diving Package", vendor: "Ratnagiri Trek Club", category: "Adventure", region: "Malvan", status: "approved", submittedAt: "Mar 10, 2025", rating: 4.7, reviews: 23, featured: true, price: "₹3,200/person" },
  { id: "3", title: "Alphonso Mango Farm Tour", vendor: "Khed Agro Tours", category: "Farm Experience", region: "Ratnagiri", status: "approved", submittedAt: "Feb 28, 2025", rating: 4.9, reviews: 47, featured: false, price: "₹800/person" },
  { id: "4", title: "Sindhudurg Fort Guided Walk", vendor: "Heritage Kokan", category: "Heritage", region: "Sindhudurg", status: "pending", submittedAt: "Apr 22, 2025", rating: 0, reviews: 0, featured: false, price: "₹500/person" },
  { id: "5", title: "Kokan Food Trail", vendor: "Malvan Kitchen", category: "Food & Dining", region: "Malvan", status: "rejected", submittedAt: "Jan 15, 2025", rating: 0, reviews: 0, featured: false, price: "₹1,200/person" },
  { id: "6", title: "Jet Ski at Alibaug Beach", vendor: "Alibaug Adventures", category: "Water Sports", region: "Alibaug", status: "approved", submittedAt: "Mar 22, 2025", rating: 4.3, reviews: 12, featured: false, price: "₹1,800/session" },
];

const statusBadge: Record<ListingStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  approved: "bg-[#2ecc71]/10 text-[#2ecc71]",
  rejected: "bg-red-500/10 text-red-400",
};

const tabs = ["all", "pending", "approved", "rejected"] as const;

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");

  const filtered = listings.filter((l) => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.vendor.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "all" || l.status === tab;
    return matchSearch && matchTab;
  });

  function updateStatus(id: string, status: ListingStatus) {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }

  function toggleFeatured(id: string) {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, featured: !l.featured } : l)));
  }

  const pendingCount = listings.filter((l) => l.status === "pending").length;

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-white text-xl font-semibold">Listings</h1>
          <p className="text-white/30 text-sm mt-0.5">
            {listings.length} total listings
            {pendingCount > 0 && <span className="ml-2 text-yellow-400">{pendingCount} pending</span>}
          </p>
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-[#141414] border border-white/5 rounded-lg p-0.5">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-md text-sm capitalize transition-all ${
                  tab === t ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
                }`}
              >
                {t}
                {t === "pending" && pendingCount > 0 && (
                  <span className="ml-1.5 text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search listings..."
              className="w-full bg-[#141414] border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[#2ecc71]/30"
            />
          </div>
        </div>

        {/* Listings table */}
        <div className="bg-[#141414] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/30 font-normal px-5 py-3">Listing</th>
                <th className="text-left text-white/30 font-normal px-4 py-3 hidden md:table-cell">Vendor</th>
                <th className="text-left text-white/30 font-normal px-4 py-3 hidden lg:table-cell">Region</th>
                <th className="text-left text-white/30 font-normal px-4 py-3 hidden lg:table-cell">Price</th>
                <th className="text-left text-white/30 font-normal px-4 py-3 hidden xl:table-cell">Rating</th>
                <th className="text-left text-white/30 font-normal px-4 py-3">Status</th>
                <th className="text-left text-white/30 font-normal px-4 py-3 hidden xl:table-cell">Featured</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((listing) => (
                <tr key={listing.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="text-white/80 font-medium">{listing.title}</div>
                    <div className="text-white/30 text-xs mt-0.5 flex items-center gap-1">
                      <MapPin size={10} /> {listing.region} · {listing.category}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-white/40 hidden md:table-cell">{listing.vendor}</td>
                  <td className="px-4 py-3.5 text-white/40 hidden lg:table-cell">{listing.region}</td>
                  <td className="px-4 py-3.5 text-white/60 hidden lg:table-cell">{listing.price}</td>
                  <td className="px-4 py-3.5 hidden xl:table-cell">
                    {listing.rating > 0 ? (
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        <Star size={11} fill="currentColor" /> {listing.rating} ({listing.reviews})
                      </div>
                    ) : (
                      <span className="text-white/20 text-xs">No reviews</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[listing.status]}`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden xl:table-cell">
                    {listing.status === "approved" && (
                      <button
                        onClick={() => toggleFeatured(listing.id)}
                        className={`transition-colors ${listing.featured ? "text-[#2ecc71]" : "text-white/20 hover:text-white/50"}`}
                      >
                        {listing.featured ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {listing.status === "pending" && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => updateStatus(listing.id, "approved")}
                          className="w-7 h-7 bg-[#2ecc71]/10 hover:bg-[#2ecc71]/20 text-[#2ecc71] rounded-lg flex items-center justify-center transition-colors"
                        >
                          <CheckCircle size={13} />
                        </button>
                        <button
                          onClick={() => updateStatus(listing.id, "rejected")}
                          className="w-7 h-7 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <XCircle size={13} />
                        </button>
                      </div>
                    )}
                    {listing.status === "approved" && (
                      <button
                        onClick={() => updateStatus(listing.id, "rejected")}
                        className="text-white/20 hover:text-red-400 text-xs transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-white/25 text-sm">No listings found.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}