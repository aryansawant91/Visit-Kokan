"use client";

import { useEffect, useState } from "react";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Trash2, Eye, EyeOff, ToggleLeft, ToggleRight, Tag } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountType: "flat" | "percent";
  description: string;
  minAmount: number;
  isActive: boolean;
  showOnWidget: boolean;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: string;
}

const blank = (): Omit<Coupon, "id"> => ({
  code: "", discount: 0, discountType: "flat", description: "",
  minAmount: 0, isActive: true, showOnWidget: false,
  usageLimit: null, usedCount: 0, expiresAt: "",
});

export default function AdminProductCouponsPage() {
  const [coupons, setCoupons]   = useState<Coupon[]>([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(blank());
  const [saving, setSaving]     = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "productCoupons"), (snap) => {
      setCoupons(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            code: data.code ?? "",
            discount: data.discount ?? 0,
            discountType: data.discountType ?? "flat",
            description: data.description ?? "",
            minAmount: data.minAmount ?? 0,
            isActive: data.isActive ?? true,
            showOnWidget: data.showOnWidget ?? false,
            usageLimit: data.usageLimit ?? null,
            usedCount: data.usedCount ?? 0,
            expiresAt: data.expiresAt
              ? (data.expiresAt as Timestamp).toDate().toISOString().split("T")[0]
              : "",
          };
        })
      );
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const visibleCount = coupons.filter((c) => c.showOnWidget && c.isActive).length;

  const handleSave = async () => {
    if (!form.code.trim() || form.discount <= 0) return;
    if (form.showOnWidget && visibleCount >= 2) {
      alert("Only 2 coupons can be shown on the product page at a time.");
      return;
    }
    setSaving(true);
    await addDoc(collection(db, "productCoupons"), {
      ...form,
      code: form.code.trim().toUpperCase(),
      expiresAt: form.expiresAt ? Timestamp.fromDate(new Date(form.expiresAt)) : null,
      createdAt: serverTimestamp(),
    });
    setForm(blank());
    setShowForm(false);
    setSaving(false);
  };

  const toggleField = async (id: string, field: "isActive" | "showOnWidget", current: boolean) => {
    if (field === "showOnWidget" && !current && visibleCount >= 2) {
      alert("Only 2 coupons can be shown on the product page.");
      return;
    }
    await updateDoc(doc(db, "productCoupons", id), { [field]: !current });
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await deleteDoc(doc(db, "productCoupons", id));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-kokan-earth flex items-center gap-2">
            <Tag size={22} /> Product Coupons
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {visibleCount}/2 coupons showing on product pages
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-kokan-green text-white rounded-xl font-semibold text-sm hover:bg-kokan-green/90"
        >
          <Plus size={16} /> New Coupon
        </button>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <strong>Widget visibility:</strong> Toggle the eye icon to show/hide a coupon on product pages.
        Maximum 2 visible at once. This is separate from trek coupons.
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-kokan-earth">New Product Coupon</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Code *</label>
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="MANGO50"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Discount Type</label>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value as "flat" | "percent" })}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              >
                <option value="flat">₹ Flat</option>
                <option value="percent">% Percent</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Discount {form.discountType === "percent" ? "(%)" : "(₹)"} *
              </label>
              <input
                type="number" min="1"
                value={form.discount || ""}
                onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                placeholder={form.discountType === "percent" ? "10" : "50"}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            </div>
            <div className="col-span-2 sm:col-span-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="₹50 off on Kokan products"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Min. Order (₹)</label>
              <input
                type="number" min="0"
                value={form.minAmount || ""}
                onChange={(e) => setForm({ ...form, minAmount: Number(e.target.value) })}
                placeholder="0"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Usage Limit</label>
              <input
                type="number" min="1"
                value={form.usageLimit ?? ""}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value ? Number(e.target.value) : null })}
                placeholder="Unlimited"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Expires</label>
              <input
                type="date"
                value={form.expiresAt}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => {
                if (!form.showOnWidget && visibleCount >= 2) {
                  alert("Only 2 coupons can be shown on the product page.");
                  return;
                }
                setForm({ ...form, showOnWidget: !form.showOnWidget });
              }}
              className={`w-11 h-6 rounded-full transition-colors relative ${form.showOnWidget ? "bg-kokan-green" : "bg-gray-300"}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.showOnWidget ? "left-6" : "left-1"}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-kokan-earth">Show on product pages</p>
              <p className="text-xs text-gray-400">Customers will see this coupon on every product detail page</p>
            </div>
          </label>

          <div className="flex gap-3">
            <button
              onClick={handleSave} disabled={saving}
              className="px-5 py-2.5 bg-kokan-green text-white rounded-xl font-semibold text-sm disabled:opacity-50"
            >
              {saving ? "Saving…" : "Create Coupon"}
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(blank()); }}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Tag size={32} className="mx-auto mb-3 opacity-30" />
          <p>No product coupons yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Code</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Discount</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Description</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Active</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Widget</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c) => (
                <tr key={c.id} className={`hover:bg-gray-50 transition-colors ${!c.isActive ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold text-kokan-earth">{c.code}</span>
                    {c.expiresAt && <p className="text-[10px] text-gray-400 mt-0.5">Expires {c.expiresAt}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-kokan-green">
                      {c.discountType === "percent" ? `${c.discount}%` : `₹${c.discount}`}
                    </span>
                    {c.minAmount > 0 && <p className="text-[10px] text-gray-400">min ₹{c.minAmount}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell max-w-[200px] truncate">{c.description}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleField(c.id, "isActive", c.isActive)}>
                      {c.isActive
                        ? <ToggleRight size={22} className="text-kokan-green mx-auto" />
                        : <ToggleLeft size={22} className="text-gray-300 mx-auto" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleField(c.id, "showOnWidget", c.showOnWidget)}>
                      {c.showOnWidget
                        ? <Eye size={18} className="text-kokan-green mx-auto" />
                        : <EyeOff size={18} className="text-gray-300 mx-auto" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteCoupon(c.id)}>
                      <Trash2 size={15} className="text-gray-300 hover:text-red-500 transition-colors" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}