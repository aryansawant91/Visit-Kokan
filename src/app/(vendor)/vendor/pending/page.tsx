"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  Pencil,
  Save,
  X,
  Waves,
  Phone,
  MapPin,
  Building2,
  FileText,
} from "lucide-react";

export default function VendorPendingPage() {
  const { profile, logout, refreshProfile } = useAuth();
  const router = useRouter();

  const status = profile?.vendorStatus ?? "pending";

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable fields
  const [businessName, setBusinessName] = useState(profile?.businessName ?? "");
  const [businessAddress, setBusinessAddress] = useState(profile?.businessAddress ?? "");
  const [gstNumber, setGstNumber] = useState(profile?.gstNumber ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");

  // Redirect approved vendors to their dashboard
  if (status === "approved") {
    router.replace("/vendor/dashboard");
    return null;
  }

  async function handleSave() {
    if (!profile?.uid) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", profile.uid), {
        businessName: businessName.trim(),
        businessAddress: businessAddress.trim(),
        gstNumber: gstNumber.trim(),
        phone: phone.trim(),
        updatedAt: serverTimestamp(),
      });
      await refreshProfile();
      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setBusinessName(profile?.businessName ?? "");
    setBusinessAddress(profile?.businessAddress ?? "");
    setGstNumber(profile?.gstNumber ?? "");
    setPhone(profile?.phone ?? "");
    setEditing(false);
  }

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  const statusConfig = {
    pending: {
      icon: <Clock className="w-6 h-6 text-amber-500" />,
      bg: "bg-amber-50",
      border: "border-amber-200",
      badge: "bg-amber-100 text-amber-700 border-amber-200",
      title: "Under Review",
      message:
        "Your vendor application is being reviewed by our team. This usually takes 1–2 business days. We'll notify you by email once a decision is made.",
    },
    rejected: {
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      bg: "bg-red-50",
      border: "border-red-200",
      badge: "bg-red-100 text-red-700 border-red-200",
      title: "Application Rejected",
      message:
        "Unfortunately your application was not approved at this time. You can update your business details below and contact us to reapply.",
    },
  };

  const cfg = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.pending;

  return (
    <div className="min-h-screen bg-kokan-cream/30">
      {/* ── Top bar ── */}
      <header className="border-b border-kokan-sand/40 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <span className="font-playfair text-lg font-bold text-kokan-earth">
              Visit Kokan
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-kokan-earth/50 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-6">
        {/* ── Greeting ── */}
        <div>
          <h1 className="font-playfair text-2xl font-bold text-kokan-earth">
            Hey, {profile?.displayName?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-kokan-earth/50 text-sm mt-0.5">
            Here's the status of your vendor application.
          </p>
        </div>

        {/* ── Status card ── */}
        <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-6 flex gap-4`}>
          <div className="flex-shrink-0 mt-0.5">{cfg.icon}</div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-semibold text-kokan-earth text-base">
                {cfg.title}
              </h2>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.badge}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-kokan-earth/60 leading-relaxed">
              {cfg.message}
            </p>

            {status === "pending" && (
              <div className="pt-1">
                {/* Progress steps */}
                <div className="flex items-center gap-0 mt-3">
                  {[
                    { label: "Submitted", done: true },
                    { label: "Under review", done: false, active: true },
                    { label: "Decision", done: false },
                  ].map((step, i) => (
                    <div key={step.label} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                            step.done
                              ? "bg-kokan-green border-kokan-green"
                              : step.active
                              ? "bg-white border-amber-400"
                              : "bg-white border-kokan-sand/50"
                          }`}
                        >
                          {step.done ? (
                            <CheckCircle className="w-3 h-3 text-white" />
                          ) : step.active ? (
                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          ) : null}
                        </div>
                        <span
                          className={`text-xs mt-1 whitespace-nowrap ${
                            step.done
                              ? "text-kokan-green font-medium"
                              : step.active
                              ? "text-amber-600 font-medium"
                              : "text-kokan-earth/30"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {i < 2 && (
                        <div
                          className={`h-0.5 w-12 mx-1 mb-4 rounded ${
                            step.done ? "bg-kokan-green" : "bg-kokan-sand/30"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {status === "rejected" && (
              <a
                href="mailto:support@visitkokan.in"
                className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium mt-1 transition-colors"
              >
                Contact support →
              </a>
            )}
          </div>
        </div>

        {/* ── Save success toast ── */}
        {saveSuccess && (
          <div className="flex items-center gap-2 bg-kokan-green/10 border border-kokan-green/30 text-kokan-green rounded-xl px-4 py-3 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Business details updated successfully.
          </div>
        )}

        {/* ── Business details card ── */}
        <div className="bg-white border border-kokan-sand/40 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-kokan-sand/30">
            <h3 className="font-semibold text-kokan-earth text-sm">
              Business Details
            </h3>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs text-kokan-green font-medium hover:text-kokan-green/70 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-1 text-xs text-kokan-earth/40 hover:text-kokan-earth/60 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-xs bg-kokan-green text-white px-3 py-1.5 rounded-lg font-medium hover:bg-kokan-green/90 transition-colors disabled:opacity-60"
                >
                  {saving ? (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  Save changes
                </button>
              </div>
            )}
          </div>

          <div className="p-6 space-y-4">
            {/* Business name */}
            <Field
              icon={<Building2 className="w-4 h-4" />}
              label="Business name"
              value={businessName}
              editing={editing}
              onChange={setBusinessName}
              placeholder="Kokan Stays & Spices"
            />

            {/* Business address */}
            <Field
              icon={<MapPin className="w-4 h-4" />}
              label="Business address"
              value={businessAddress}
              editing={editing}
              onChange={setBusinessAddress}
              placeholder="Ratnagiri, Maharashtra"
            />

            {/* Phone */}
            <Field
              icon={<Phone className="w-4 h-4" />}
              label="Phone number"
              value={phone}
              editing={editing}
              onChange={setPhone}
              placeholder="+91 98765 43210"
              type="tel"
            />

            {/* GST */}
            <Field
              icon={<FileText className="w-4 h-4" />}
              label="GST number"
              value={gstNumber}
              editing={editing}
              onChange={setGstNumber}
              placeholder="22AAAAA0000A1Z5 (optional)"
            />
          </div>
        </div>

        {/* ── While waiting ── */}
        <div className="bg-white border border-kokan-sand/40 rounded-2xl p-6">
          <h3 className="font-semibold text-kokan-earth text-sm mb-3">
            While you wait, explore Kokan
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/destinations"
              className="flex items-center gap-2.5 p-3 rounded-xl border border-kokan-sand/40 hover:border-kokan-green/40 hover:bg-kokan-green/5 transition-all group"
            >
              <span className="text-xl">🏖️</span>
              <span className="text-sm text-kokan-earth/70 group-hover:text-kokan-earth transition-colors">
                Destinations
              </span>
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2.5 p-3 rounded-xl border border-kokan-sand/40 hover:border-kokan-green/40 hover:bg-kokan-green/5 transition-all group"
            >
              <span className="text-xl">🥭</span>
              <span className="text-sm text-kokan-earth/70 group-hover:text-kokan-earth transition-colors">
                Local products
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Reusable field component ── */
function Field({
  icon,
  label,
  value,
  editing,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-kokan-sand/20 flex items-center justify-center text-kokan-earth/40 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-kokan-earth/40 mb-0.5">{label}</p>
        {editing ? (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full border border-kokan-sand rounded-lg px-3 py-1.5 text-sm text-kokan-earth bg-white focus:outline-none focus:ring-2 focus:ring-kokan-green/30 focus:border-kokan-green/50 transition-all placeholder:text-kokan-earth/25"
          />
        ) : (
          <p className="text-sm text-kokan-earth font-medium truncate">
            {value || <span className="text-kokan-earth/30 font-normal italic">Not provided</span>}
          </p>
        )}
      </div>
    </div>
  );
}