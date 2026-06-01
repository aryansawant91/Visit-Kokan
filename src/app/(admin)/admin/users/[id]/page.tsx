"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs, orderBy, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Shield, Store, User, Package,
  ShoppingBag, MapPin, Phone, Mail, Calendar,
  CheckCircle, XCircle, Clock, Loader2,
} from "lucide-react";

interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  role: "user" | "vendor" | "admin";
  vendorStatus?: "pending" | "approved" | "rejected";
  businessName?: string;
  businessType?: string;
  businessDescription?: string;
  region?: string;
  phone?: string;
  createdAt: string;
}

interface Order {
  id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  orderType?: string;
  items?: { name: string; quantity: number }[];
  trekName?: string;
}

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const [user, setUser]       = useState<UserProfile | null>(null);
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      // Fetch user profile
      const userSnap = await getDoc(doc(db, "users", id));
      if (!userSnap.exists()) { setLoading(false); return; }
      setUser({ id: userSnap.id, ...userSnap.data() } as UserProfile);

      // Fetch their orders
      try {
        const oq = query(
          collection(db, "orders"),
          where("userId", "==", id),
          orderBy("createdAt", "desc")
        );
        const oSnap = await getDocs(oq);
        setOrders(oSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
      } catch {
        // orders index may not exist yet — fail silently
      }

      setLoading(false);
    };
    load();
  }, [id]);

  const updateVendorStatus = async (status: "approved" | "rejected") => {
    if (!user) return;
    setSaving(true);
    await updateDoc(doc(db, "users", id), {
      vendorStatus: status,
      role: status === "approved" ? "vendor" : "user",
    });
    setUser((u) => u ? { ...u, vendorStatus: status, role: status === "approved" ? "vendor" : "user" } : u);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-kokan-cream/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-kokan-green" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-kokan-cream/30 flex flex-col items-center justify-center gap-4">
        <p className="text-kokan-earth font-semibold">User not found</p>
        <Link href="/admin/users" className="text-sm text-kokan-green hover:underline">← Back to Users</Link>
      </div>
    );
  }

  const statusColor = {
    approved: "text-green-600 bg-green-50 border-green-200",
    rejected: "text-red-600 bg-red-50 border-red-200",
    pending:  "text-amber-600 bg-amber-50 border-amber-200",
  };

  return (
    <div className="min-h-screen bg-kokan-cream/30 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Back */}
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-kokan-earth transition-colors"
        >
          <ArrowLeft size={15} /> All Users
        </Link>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-kokan-earth/10 flex items-center justify-center flex-shrink-0">
              {user.role === "vendor"
                ? <Store size={28} className="text-blue-500" />
                : user.role === "admin"
                ? <Shield size={28} className="text-red-500" />
                : <User size={28} className="text-gray-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-kokan-earth">
                  {user.displayName || "No name"}
                </h1>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                  user.role === "admin"  ? "bg-red-100 text-red-700"  :
                  user.role === "vendor" ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {user.role}
                </span>
                {user.vendorStatus && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${statusColor[user.vendorStatus]}`}>
                    {user.vendorStatus}
                  </span>
                )}
              </div>

              <div className="mt-3 space-y-1.5">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Mail size={13} className="flex-shrink-0" /> {user.email}
                </p>
                {user.phone && (
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Phone size={13} className="flex-shrink-0" /> {user.phone}
                  </p>
                )}
                {user.region && (
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <MapPin size={13} className="flex-shrink-0" /> {user.region}
                  </p>
                )}
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar size={13} className="flex-shrink-0" />
                  Joined {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Vendor details */}
          {user.role === "vendor" && (
            <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vendor Info</p>
              {user.businessName && (
                <p className="text-sm text-kokan-earth font-semibold">{user.businessName}</p>
              )}
              {user.businessType && (
                <p className="text-xs text-gray-500 capitalize">{user.businessType}</p>
              )}
              {user.businessDescription && (
                <p className="text-sm text-gray-500 leading-relaxed">{user.businessDescription}</p>
              )}
            </div>
          )}

          {/* Vendor approval actions */}
          {user.role === "vendor" && user.vendorStatus === "pending" && (
            <div className="mt-5 pt-5 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => updateVendorStatus("approved")}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-kokan-green text-white rounded-xl font-semibold text-sm hover:bg-kokan-green/90 disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                Approve Vendor
              </button>
              <button
                onClick={() => updateVendorStatus("rejected")}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-semibold text-sm hover:bg-red-100 disabled:opacity-50"
              >
                <XCircle size={14} /> Reject
              </button>
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-kokan-earth flex items-center gap-2">
              <ShoppingBag size={16} /> Order History
              <span className="text-xs font-normal text-gray-400 ml-1">({orders.length})</span>
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Package size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-kokan-earth truncate">
                      {order.trekName ?? order.items?.map((i) => i.name).join(", ") ?? "Order"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                      {order.orderType && <span className="ml-2 capitalize">· {order.orderType}</span>}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-kokan-earth">
                      ₹{order.totalAmount?.toLocaleString("en-IN") ?? "—"}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      order.status === "delivered"  ? "bg-green-100 text-green-700"  :
                      order.status === "cancelled"  ? "bg-red-100 text-red-700"    :
                      order.status === "confirmed"  ? "bg-blue-100 text-blue-700"  :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {order.status ?? "pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}