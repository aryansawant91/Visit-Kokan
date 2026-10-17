"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Save,
  Mail,
  Phone,
  User,
  Shield,
  CheckCircle,
  Camera,
  Compass,
  MapPin,
  BadgeCheck,
  Pencil,
  X,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// NOTE ON TAILWIND TOKENS
// This file assumes your existing kokan-earth / kokan-green / kokan-sand
// tokens, plus two new ones for the coastal accent. Add these to
// tailwind.config.js if they're not already there:
//
//   colors: {
//     'kokan-teal':  '#0F6E6A',   // backwater / ocean accent
//     'kokan-coral': '#E8703C',   // sunset stamp accent
//   }
// ─────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");

  const initials =
    profile?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  // A little "boarding pass" reference code derived from the uid —
  // purely cosmetic, ties the passport motif to a real value.
  const passCode = profile?.uid
    ? `VK-${profile.uid.slice(0, 4).toUpperCase()}-KKN`
    : "VK-0000-KKN";

  const memberSince = profile?.createdAt
    ? new Date((profile.createdAt as any)?.seconds * 1000).toLocaleDateString(
        "en-IN",
        { month: "short", year: "numeric" }
      )
    : "—";

  const handleSave = async () => {
    if (!profile?.uid) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", profile.uid), {
        displayName: displayName.trim(),
        phone: phone.trim(),
        updatedAt: serverTimestamp(),
      });
      await refreshProfile();
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {success && (
        <div className="flex items-center gap-2 bg-kokan-green/10 border border-kokan-green/30 text-kokan-green rounded-xl px-4 py-3 text-sm font-medium">
          <CheckCircle className="w-4 h-4" /> Profile updated successfully!
        </div>
      )}

      {/* ── Hero / cover ─────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* cover */}
        <div className="h-32 sm:h-40 bg-gradient-to-br from-kokan-teal via-kokan-green to-kokan-earth relative">
          <svg
            className="absolute bottom-0 left-0 w-full text-white/10"
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
          >
            <path
              d="M0,30 C150,60 350,0 600,30 C850,60 1050,0 1200,30 L1200,60 L0,60 Z"
              fill="currentColor"
            />
          </svg>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur text-kokan-earth text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-white transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit profile
            </button>
          )}
        </div>

        {/* avatar + identity, overlapping the cover */}
        <div className="bg-white px-5 sm:px-8 pb-6 pt-0">
          <div className="flex items-end gap-4 -mt-10 sm:-mt-12">
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-kokan-sand border-4 border-white shadow-sm flex items-center justify-center text-kokan-earth font-bold text-2xl sm:text-3xl font-playfair">
                {initials}
              </div>
              <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-kokan-earth text-white flex items-center justify-center border-2 border-white hover:bg-kokan-earth/90 transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="pb-1 min-w-0">
              <h1 className="font-playfair text-xl sm:text-2xl font-bold text-kokan-earth truncate">
                {profile?.displayName || "Traveller"}
              </h1>
              <p className="text-kokan-earth/50 text-xs sm:text-sm truncate">
                {profile?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="inline-flex items-center gap-1 text-xs bg-kokan-green/10 text-kokan-green px-2.5 py-1 rounded-full font-medium capitalize">
              <Compass className="w-3 h-3" /> {profile?.role}
            </span>
            {profile?.emailVerified && (
              <span className="inline-flex items-center gap-1 text-xs bg-kokan-teal/10 text-kokan-teal px-2.5 py-1 rounded-full font-medium">
                <BadgeCheck className="w-3 h-3" /> Verified traveller
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Boarding-pass stat strip (signature element) ────── */}
      <div className="relative bg-kokan-earth text-white rounded-2xl overflow-hidden">
        <div className="flex divide-x divide-white/15">
          <StatCell label="Member since" value={memberSince} />
          <StatCell label="Trips booked" value={String(profile?.tripsBooked ?? 0)} />
          <StatCell
            label="Status"
            value={profile?.emailVerified ? "Active" : "Pending"}
          />
        </div>

        {/* perforation row, ticket-stub style */}
        <div className="relative h-4 bg-kokan-earth">
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.35) 1.5px, transparent 1.5px)",
              backgroundSize: "10px 10px",
              backgroundPosition: "0 -3px",
            }}
          />
        </div>

        <div className="flex items-center justify-between px-5 py-3 bg-kokan-earth/95">
          <div className="flex items-center gap-1.5 text-white/70 text-xs">
            <MapPin className="w-3.5 h-3.5" /> Konkan Coast, Maharashtra
          </div>
          <span className="font-mono text-xs tracking-widest text-white/80">
            {passCode}
          </span>
        </div>
      </div>

      {/* ── Personal info card ───────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-kokan-earth">Personal details</h3>
          {editing && (
            <button
              onClick={() => {
                setEditing(false);
                setDisplayName(profile?.displayName ?? "");
                setPhone(profile?.phone ?? "");
              }}
              className="text-kokan-earth/40 hover:text-kokan-earth transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <Field
            icon={<User className="w-3.5 h-3.5" />}
            label="Full name"
            editing={editing}
            value={displayName}
            onChange={setDisplayName}
            display={profile?.displayName}
          />

          <div>
            <FieldLabel icon={<Mail className="w-3.5 h-3.5" />} label="Email address" />
            <p className="text-sm text-kokan-earth/60 px-1">{profile?.email}</p>
            <p className="text-xs text-kokan-earth/30 px-1 mt-0.5">
              Email can't be changed here
            </p>
          </div>

          <Field
            icon={<Phone className="w-3.5 h-3.5" />}
            label="Phone number"
            editing={editing}
            value={phone}
            onChange={setPhone}
            display={profile?.phone}
            placeholder="+91 98765 43210"
            type="tel"
            emptyText="Not provided"
          />
        </div>

        {editing && (
          <div className="flex gap-3 mt-6 pt-5 border-t border-kokan-sand/30">
            <button
              onClick={() => {
                setEditing(false);
                setDisplayName(profile?.displayName ?? "");
                setPhone(profile?.phone ?? "");
              }}
              className="flex-1 py-2.5 border border-kokan-sand rounded-xl text-sm text-kokan-earth/60 hover:bg-kokan-sand/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-kokan-green text-white rounded-xl text-sm font-semibold hover:bg-kokan-green/90 transition-colors disabled:opacity-60"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ── Account details with passport-stamp badge ───────── */}
      <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30 relative overflow-hidden">
        <h3 className="font-semibold text-kokan-earth flex items-center gap-2 mb-5">
          <Shield className="w-4 h-4 text-kokan-sand" />
          Account details
        </h3>

        <div className="grid grid-cols-2 gap-5 text-sm">
          <div>
            <p className="text-kokan-earth/40 text-xs mb-1">Account type</p>
            <p className="text-kokan-earth font-medium capitalize">{profile?.role}</p>
          </div>
          <div>
            <p className="text-kokan-earth/40 text-xs mb-1">Account status</p>
            <p className="text-kokan-green font-medium">Active</p>
          </div>
          <div>
            <p className="text-kokan-earth/40 text-xs mb-1">Member since</p>
            <p className="text-kokan-earth font-medium">{memberSince}</p>
          </div>
          <div>
            <p className="text-kokan-earth/40 text-xs mb-1">Email verification</p>
            <p
              className={`font-medium ${
                profile?.emailVerified ? "text-kokan-teal" : "text-amber-500"
              }`}
            >
              {profile?.emailVerified ? "Verified" : "Not verified"}
            </p>
          </div>
        </div>

        {/* ink-stamp badge, rotated visa-stamp style */}
        {profile?.emailVerified && (
          <div
            className="hidden sm:flex absolute -right-4 -top-2 w-24 h-24 rounded-full border-[3px] border-kokan-coral/70 text-kokan-coral items-center justify-center text-center pointer-events-none select-none"
            style={{ transform: "rotate(-12deg)" }}
          >
            <div className="border-[3px] border-kokan-coral/70 rounded-full w-[76px] h-[76px] flex items-center justify-center">
              <span className="text-[10px] font-bold tracking-widest leading-tight">
                KONKAN
                <br />
                VERIFIED
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── small helpers ──────────────────────────────────────────────

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 px-4 sm:px-5 py-4 text-center">
      <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">
        {label}
      </p>
      <p className="font-playfair text-lg sm:text-xl font-bold">{value}</p>
    </div>
  );
}

function FieldLabel({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-kokan-earth/50 mb-1.5">
      {icon} {label}
    </label>
  );
}

function Field({
  icon,
  label,
  editing,
  value,
  onChange,
  display,
  placeholder,
  type = "text",
  emptyText,
}: {
  icon: React.ReactNode;
  label: string;
  editing: boolean;
  value: string;
  onChange: (v: string) => void;
  display?: string;
  placeholder?: string;
  type?: string;
  emptyText?: string;
}) {
  return (
    <div>
      <FieldLabel icon={icon} label={label} />
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm text-kokan-earth focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
        />
      ) : (
        <p className="text-sm text-kokan-earth font-medium px-1">
          {display || (
            <span className="text-kokan-earth/30 font-normal italic">
              {emptyText ?? "—"}
            </span>
          )}
        </p>
      )}
    </div>
  );
}