"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, Shield, ShieldOff, Eye, Users, Store, User } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  role: "user" | "vendor" | "admin";
  vendorStatus?: "pending" | "approved" | "rejected";
  businessName?: string;
  createdAt: string;
  phone?: string;
}

const ROLE_STYLES: Record<string, string> = {
  admin:  "bg-red-100 text-red-700",
  vendor: "bg-blue-100 text-blue-700",
  user:   "bg-gray-100 text-gray-600",
};

export default function AdminUsersPage() {
  const [users, setUsers]       = useState<UserProfile[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "vendor" | "admin">("all");

  const fetchUsers = async () => {
    setLoading(true);
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setUsers(
      snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserProfile))
    );
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.businessName?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const counts = {
    all:    users.length,
    user:   users.filter((u) => u.role === "user").length,
    vendor: users.filter((u) => u.role === "vendor").length,
    admin:  users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="min-h-screen bg-kokan-cream/30 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-kokan-earth flex items-center gap-2">
              <Users size={22} /> Users
            </h1>
            <p className="text-sm text-kokan-earth/50 mt-0.5">
              {users.length} total users
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["all", "user", "vendor", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                roleFilter === r
                  ? "bg-kokan-earth text-white border-kokan-earth"
                  : "bg-white border-gray-200 hover:border-kokan-earth/30"
              }`}
            >
              <p className={`text-2xl font-bold ${roleFilter === r ? "text-white" : "text-kokan-earth"}`}>
                {counts[r]}
              </p>
              <p className={`text-xs font-semibold mt-0.5 capitalize ${roleFilter === r ? "text-white/70" : "text-gray-400"}`}>
                {r === "all" ? "Total Users" : `${r}s`}
              </p>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or business..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Users size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-400 font-medium">No users found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Joined</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Phone</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="w-9 h-9 rounded-full bg-kokan-earth/10 flex items-center justify-center flex-shrink-0">
                            {u.role === "vendor"
                              ? <Store size={16} className="text-blue-500" />
                              : u.role === "admin"
                              ? <Shield size={16} className="text-red-500" />
                              : <User size={16} className="text-gray-400" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-kokan-earth truncate">
                              {u.displayName || "—"}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{u.email}</p>
                            {u.businessName && (
                              <p className="text-xs text-blue-500 font-medium truncate">{u.businessName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${ROLE_STYLES[u.role] ?? "bg-gray-100 text-gray-600"}`}>
                          {u.role}
                        </span>
                        {u.role === "vendor" && u.vendorStatus && (
                          <p className={`text-[10px] mt-0.5 font-semibold ${
                            u.vendorStatus === "approved" ? "text-green-500" :
                            u.vendorStatus === "rejected" ? "text-red-500" : "text-amber-500"
                          }`}>
                            {u.vendorStatus}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                        {u.phone || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/users/${u.id}`}
                          className="flex items-center gap-1 text-xs font-semibold text-kokan-green hover:underline"
                        >
                          <Eye size={13} /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}