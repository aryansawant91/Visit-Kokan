"use client";

import { useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  Building2,
  Phone,
  MapPin,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  CreditCard,
  User,
  Sparkles,
} from "lucide-react";

export default function VendorProfilePage() {
  const { profile, refreshProfile } = useAuth();

  const [businessName, setBusinessName] = useState(profile?.businessName ?? "");
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp ?? "");
  const [businessAddress, setBusinessAddress] = useState(profile?.businessAddress ?? "");
  const [district, setDistrict] = useState(profile?.district ?? "Ratnagiri");
  const [gstNumber, setGstNumber] = useState(profile?.gstNumber ?? "");
  const [upiId, setUpiId] = useState(profile?.upiId ?? "");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.uid) return;
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      await updateDoc(doc(db, "users", profile.uid), {
        businessName: businessName.trim(),
        displayName: displayName.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        businessAddress: businessAddress.trim(),
        district,
        gstNumber: gstNumber.trim(),
        upiId: upiId.trim(),
        updatedAt: serverTimestamp(),
      });

      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      console.error("Failed to update vendor profile:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Building2 className="text-[#2ecc71]" size={24} />
          <span>Host Profile &amp; Business Details</span>
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Manage your verified business info, guest contact details, and direct payout UPI ID
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>Profile changes successfully saved and updated across Visit Kokan!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Business Identity */}
        <div className="bg-[#141414] rounded-3xl p-6 sm:p-7 border border-white/5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Building2 size={16} className="text-[#2ecc71]" />
            <span>Property &amp; Business Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Business / Homestay Brand Name *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Malvan Sea Breeze Homestay"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Host / Owner Name *
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Ramesh Samant"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div className="bg-[#141414] rounded-3xl p-6 sm:p-7 border border-white/5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Phone size={16} className="text-[#2ecc71]" />
            <span>Guest Communication &amp; Location</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Primary Calling Phone *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                WhatsApp Phone
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="WhatsApp number for guest chats"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Primary District
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
              >
                <option value="Sindhudurg">Sindhudurg (Malvan, Tarkarli, Vengurla)</option>
                <option value="Ratnagiri">Ratnagiri (Ganpatipule, Guhagar, Dapoli)</option>
                <option value="Raigad">Raigad (Alibaug, Kashid, Murud)</option>
                <option value="Thane">Thane</option>
                <option value="Palghar">Palghar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Full Physical Address
            </label>
            <textarea
              rows={3}
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              placeholder="House/Plot No., Landmark, Base Village/Taluka, Pincode"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
            />
          </div>
        </div>

        {/* Section 3: Tax & Payout */}
        <div className="bg-[#141414] rounded-3xl p-6 sm:p-7 border border-white/5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <CreditCard size={16} className="text-[#2ecc71]" />
            <span>Tax &amp; Direct Payout Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                UPI ID (For Guest Advances &amp; Direct Settlements)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. host@okaxis or 9876543210@paytm"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                GST Number (Optional)
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="27XXXXXXXXXXXZX"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#2ecc71] hover:bg-[#27ae60] text-black font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Saving Changes…</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Host Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
