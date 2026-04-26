"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, Mail, Phone, User, Shield, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");

  const initials = profile?.displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

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
      <div>
        <h1 className="font-playfair text-2xl font-bold text-kokan-earth">My Profile</h1>
        <p className="text-kokan-earth/50 text-sm mt-1">Manage your personal information</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-kokan-green/10 border border-kokan-green/30 text-kokan-green rounded-xl px-4 py-3 text-sm font-medium">
          <CheckCircle className="w-4 h-4" /> Profile updated successfully!
        </div>
      )}

      {/* Avatar + basic info */}
      <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-full bg-kokan-green flex items-center justify-center text-white font-bold text-2xl">
            {initials}
          </div>
          <div>
            <h2 className="font-semibold text-kokan-earth text-lg">{profile?.displayName}</h2>
            <p className="text-kokan-earth/50 text-sm">{profile?.email}</p>
            <span className="inline-block mt-1.5 text-xs bg-kokan-green/10 text-kokan-green px-2.5 py-0.5 rounded-full font-medium capitalize">
              {profile?.role}
            </span>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-kokan-earth/50 mb-1.5">
              <User className="w-3.5 h-3.5" /> Full Name
            </label>
            {editing ? (
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm text-kokan-earth focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            ) : (
              <p className="text-sm text-kokan-earth font-medium px-1">{profile?.displayName}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-kokan-earth/50 mb-1.5">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </label>
            <p className="text-sm text-kokan-earth/60 px-1">{profile?.email}</p>
            <p className="text-xs text-kokan-earth/30 px-1 mt-0.5">Email cannot be changed</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-kokan-earth/50 mb-1.5">
              <Phone className="w-3.5 h-3.5" /> Phone Number
            </label>
            {editing ? (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm text-kokan-earth focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            ) : (
              <p className="text-sm text-kokan-earth font-medium px-1">
                {profile?.phone || <span className="text-kokan-earth/30 font-normal italic">Not provided</span>}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-5 border-t border-kokan-sand/30">
          {editing ? (
            <>
              <button
                onClick={() => { setEditing(false); setDisplayName(profile?.displayName ?? ""); setPhone(profile?.phone ?? ""); }}
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
                  <><Save className="w-4 h-4" /> Save Changes</>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-2.5 bg-kokan-green text-white rounded-xl text-sm font-semibold hover:bg-kokan-green/90 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30 space-y-4">
        <h3 className="font-semibold text-kokan-earth flex items-center gap-2">
          <Shield className="w-4 h-4 text-kokan-sand" />
          Account Details
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-kokan-earth/40 text-xs mb-1">Account Type</p>
            <p className="text-kokan-earth font-medium capitalize">{profile?.role}</p>
          </div>
          <div>
            <p className="text-kokan-earth/40 text-xs mb-1">Email Verified</p>
            <p className={`font-medium ${profile?.emailVerified ? "text-kokan-green" : "text-amber-500"}`}>
              {profile?.emailVerified ? "Verified ✓" : "Not Verified"}
            </p>
          </div>
          <div>
            <p className="text-kokan-earth/40 text-xs mb-1">Account Status</p>
            <p className="text-kokan-green font-medium">Active</p>
          </div>
          <div>
            <p className="text-kokan-earth/40 text-xs mb-1">Member Since</p>
            <p className="text-kokan-earth font-medium">
              {profile?.createdAt
                ? new Date((profile.createdAt as any)?.seconds * 1000).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}