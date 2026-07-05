"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Check, Trash2, Star } from "lucide-react";

interface Address {
  id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

interface Props {
  uid: string;
  selected: Address;
  onSelect: (addr: Address) => void;
}

const STATES = ["Maharashtra", "Goa", "Karnataka", "Gujarat", "Delhi", "Other"];

const blank = (): Address => ({
  fullName: "", phone: "", street: "",
  city: "", state: "Maharashtra", pincode: "",
});

export default function AddressPicker({ uid, selected, onSelect }: Props) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState<Address>(blank());
  const [saving, setSaving]       = useState(false);

  const fetchAddresses = async () => {
    const res  = await fetch(`/api/addresses?uid=${uid}`);
    const data = await res.json();
    setAddresses(Array.isArray(data) ? data : []);
    // Auto-select default
    const def = data.find((a: Address) => a.isDefault);
    if (def && !selected.street) onSelect(def);
    setLoading(false);
  };

  useEffect(() => { fetchAddresses(); }, [uid]); // eslint-disable-line

  const handleSave = async () => {
    if (!form.fullName || !form.phone || !form.street || !form.city || !form.pincode) return;
    setSaving(true);
    const res  = await fetch("/api/addresses", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ uid, address: form }),
    });
    const saved = await res.json();
    setAddresses(prev => [saved, ...prev]);
    onSelect(saved);
    setShowForm(false);
    setForm(blank());
    setSaving(false);
  };

  const setDefault = async (addressId: string) => {
    await fetch("/api/addresses", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ uid, addressId, updates: { isDefault: true } }),
    });
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === addressId })));
  };

  const deleteAddress = async (addressId: string) => {
    await fetch("/api/addresses", {
      method:  "DELETE",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ uid, addressId }),
    });
    const updated = addresses.filter(a => a.id !== addressId);
    setAddresses(updated);
    if (selected.id === addressId) onSelect(blank());
  };

  const setF = (k: keyof Address, v: string) => setForm(f => ({ ...f, [k]: v }));

  if (loading) return (
    <div className="space-y-3">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="space-y-3">

      {/* Saved addresses */}
      {addresses.map(addr => (
        <div
          key={addr.id}
          onClick={() => onSelect(addr)}
          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
            selected.id === addr.id
              ? "border-kokan-green bg-kokan-green/5"
              : "border-kokan-sand/40 bg-white hover:border-kokan-green/30"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              {/* Radio */}
              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selected.id === addr.id ? "border-kokan-green" : "border-gray-300"
              }`}>
                {selected.id === addr.id && (
                  <div className="w-2 h-2 rounded-full bg-kokan-green" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-kokan-earth">{addr.fullName}</p>
                  <p className="text-xs text-kokan-earth/50">{addr.phone}</p>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-kokan-green/10 text-kokan-green rounded-full border border-kokan-green/20">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-kokan-earth/60 mt-0.5 leading-relaxed">
                  {addr.street}, {addr.city}, {addr.state} — {addr.pincode}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
              {!addr.isDefault && (
                <button
                  onClick={() => setDefault(addr.id!)}
                  title="Set as default"
                  className="p-1.5 rounded-lg text-gray-300 hover:text-kokan-green hover:bg-kokan-green/5 transition-colors"
                >
                  <Star size={13} />
                </button>
              )}
              <button
                onClick={() => deleteAddress(addr.id!)}
                className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add new address */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-kokan-sand/50 rounded-xl text-sm font-semibold text-kokan-earth/50 hover:border-kokan-green/40 hover:text-kokan-green hover:bg-kokan-green/5 transition-all"
        >
          <Plus size={15} /> Add New Address
        </button>
      ) : (
        <div className="bg-kokan-cream/30 rounded-xl border border-kokan-sand/40 p-4 space-y-3">
          <p className="text-sm font-bold text-kokan-earth">New Address</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-kokan-earth/50 mb-1">Full Name *</label>
              <input
                value={form.fullName}
                onChange={e => setF("fullName", e.target.value)}
                placeholder="Rohan Sawant"
                className="w-full border border-kokan-sand rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 bg-white"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-kokan-earth/50 mb-1">Phone *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setF("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full border border-kokan-sand rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 bg-white"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-kokan-earth/50 mb-1">Street *</label>
              <input
                value={form.street}
                onChange={e => setF("street", e.target.value)}
                placeholder="House no., Street, Area"
                className="w-full border border-kokan-sand rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-kokan-earth/50 mb-1">City *</label>
              <input
                value={form.city}
                onChange={e => setF("city", e.target.value)}
                placeholder="Mumbai"
                className="w-full border border-kokan-sand rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-kokan-earth/50 mb-1">Pincode *</label>
              <input
                value={form.pincode}
                onChange={e => setF("pincode", e.target.value)}
                placeholder="400001"
                className="w-full border border-kokan-sand rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 bg-white"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-kokan-earth/50 mb-1">State</label>
              <select
                value={form.state}
                onChange={e => setF("state", e.target.value)}
                className="w-full border border-kokan-sand rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 bg-white"
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 bg-kokan-green text-white rounded-xl font-semibold text-sm hover:bg-kokan-green/90 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Address"}
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(blank()); }}
              className="flex-1 py-2.5 border border-kokan-sand rounded-xl text-sm text-kokan-earth/60 hover:bg-kokan-sand/10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}   