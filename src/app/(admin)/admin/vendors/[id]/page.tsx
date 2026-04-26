"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, serverTimestamp, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, CheckCircle, XCircle, Store, MapPin, Clock } from "lucide-react";

type VendorStatus = "pending" | "approved" | "rejected";

interface Vendor {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  businessName?: string;
  businessAddress?: string;
  gstNumber?: string;
  vendorStatus: VendorStatus;
}

const statusBadge: Record<VendorStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  approved: "bg-[#2ecc71]/10 text-[#2ecc71]",
  rejected: "bg-red-500/10 text-red-400",
};

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | VendorStatus>("pending");
  const [selected, setSelected] = useState<Vendor | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { fetchVendors(); }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
        const snap = await getDocs(collection(db, "users"));
        const data = snap.docs
        .map((d) => ({ uid: d.id, ...d.data() } as Vendor))
        .filter((u: any) => u.role === "vendor");
        setVendors(data);
    } catch (err) {
        console.error("Failed to fetch vendors:", err);
    } finally {
        setLoading(false);
    }
    };

  const updateStatus = async (uid: string, status: VendorStatus) => {
    setActionLoading(uid);
    try {
      await updateDoc(doc(db, "users", uid), {
        vendorStatus: status,
        updatedAt: serverTimestamp(),
      });
      setVendors((prev) =>
        prev.map((v) => (v.uid === uid ? { ...v, vendorStatus: status } : v))
      );
      if (selected?.uid === uid) {
        setSelected((s) => s ? { ...s, vendorStatus: status } : null);
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = vendors.filter((v) => {
    const matchSearch =
      (v.businessName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      v.displayName.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "all" || v.vendorStatus === tab;
    return matchSearch && matchTab;
  });

  const counts = {
    pending: vendors.filter((v) => v.vendorStatus === "pending").length,
    approved: vendors.filter((v) => v.vendorStatus === "approved").length,
    rejected: vendors.filter((v) => v.vendorStatus === "rejected").length,
  };

  const tabs = [
    { label: "All", value: "all" as const },
    { label: "Pending", value: "pending" as const },
    { label: "Approved", value: "approved" as const },
    { label: "Rejected", value: "rejected" as const },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-white text-xl font-semibold">Vendors</h1>
        <p className="text-white/30 text-sm mt-0.5">
          {vendors.length} total · {counts.pending > 0 && (
            <span className="text-yellow-400">{counts.pending} pending review</span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-[#141414] border border-white/5 rounded-lg p-0.5">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                tab === t.value ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
              }`}
            >
              {t.label}
              {t.value !== "all" && (
                <span className="ml-1.5 text-xs bg-white/5 text-white/40 px-1.5 py-0.5 rounded-full">
                  {counts[t.value]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#141414] border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[#2ecc71]/30"
          />
        </div>

        <button
          onClick={fetchVendors}
          className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/50 text-sm rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#141414] border border-white/5 rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-2">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-white/25 text-sm bg-[#141414] border border-white/5 rounded-xl">
                <Clock className="w-10 h-10 mx-auto mb-3 text-white/10" />
                No {tab === "all" ? "" : tab} vendors found.
              </div>
            ) : (
              filtered.map((vendor) => (
                <div
                  key={vendor.uid}
                  onClick={() => setSelected(vendor)}
                  className={`bg-[#141414] border rounded-xl p-4 cursor-pointer transition-all hover:border-white/10 ${
                    selected?.uid === vendor.uid ? "border-[#2ecc71]/30" : "border-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#e67e22]/10 flex items-center justify-center shrink-0">
                        <Store size={16} className="text-[#e67e22]" />
                      </div>
                      <div>
                        <div className="text-white/80 font-medium text-sm">
                          {vendor.businessName ?? vendor.displayName}
                        </div>
                        <div className="text-white/35 text-xs mt-0.5">
                          {vendor.displayName} · {vendor.email}
                        </div>
                        {vendor.businessAddress && (
                          <div className="flex items-center gap-1 mt-1 text-white/25 text-xs">
                            <MapPin size={10} /> {vendor.businessAddress}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[vendor.vendorStatus]}`}>
                        {vendor.vendorStatus}
                      </span>
                      {vendor.vendorStatus === "pending" && (
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); updateStatus(vendor.uid, "approved"); }}
                            disabled={actionLoading === vendor.uid}
                            className="w-7 h-7 bg-[#2ecc71]/10 hover:bg-[#2ecc71]/20 text-[#2ecc71] rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                          >
                            {actionLoading === vendor.uid
                              ? <div className="w-3 h-3 border border-[#2ecc71] border-t-transparent rounded-full animate-spin" />
                              : <CheckCircle size={13} />}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateStatus(vendor.uid, "rejected"); }}
                            disabled={actionLoading === vendor.uid}
                            className="w-7 h-7 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                          >
                            <XCircle size={13} />
                          </button>
                        </div>
                      )}
                      {vendor.vendorStatus === "approved" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(vendor.uid, "rejected"); }}
                          className="text-xs px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                      {vendor.vendorStatus === "rejected" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(vendor.uid, "approved"); }}
                          className="text-xs px-2 py-1 bg-[#2ecc71]/10 hover:bg-[#2ecc71]/20 text-[#2ecc71] rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detail panel */}
          <div className="bg-[#141414] border border-white/5 rounded-xl p-5 h-fit sticky top-0">
            {selected ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#e67e22]/10 flex items-center justify-center">
                    <Store size={18} className="text-[#e67e22]" />
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {selected.businessName ?? selected.displayName}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[selected.vendorStatus]}`}>
                      {selected.vendorStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-sm">
                  {[
                    ["Owner", selected.displayName],
                    ["Email", selected.email],
                    ["Phone", selected.phone ?? "—"],
                    ["Business", selected.businessName ?? "—"],
                    ["Address", selected.businessAddress ?? "—"],
                    ["GST", selected.gstNumber ?? "Not provided"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="text-white/30 shrink-0">{k}</span>
                      <span className="text-white/70 text-right truncate">{v}</span>
                    </div>
                  ))}
                </div>

                {selected.vendorStatus === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => updateStatus(selected.uid, "approved")}
                      disabled={actionLoading === selected.uid}
                      className="flex-1 py-2 bg-[#2ecc71]/10 hover:bg-[#2ecc71]/20 text-[#2ecc71] text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      onClick={() => updateStatus(selected.uid, "rejected")}
                      disabled={actionLoading === selected.uid}
                      className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                )}
                {selected.vendorStatus === "approved" && (
                  <button
                    onClick={() => updateStatus(selected.uid, "rejected")}
                    className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-lg transition-colors"
                  >
                    Revoke Approval
                  </button>
                )}
                {selected.vendorStatus === "rejected" && (
                  <button
                    onClick={() => updateStatus(selected.uid, "approved")}
                    className="w-full py-2 bg-[#2ecc71]/10 hover:bg-[#2ecc71]/20 text-[#2ecc71] text-sm rounded-lg transition-colors"
                  >
                    Approve Vendor
                  </button>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-white/25 text-sm">
                Select a vendor to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}