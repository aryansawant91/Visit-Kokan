"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Building2,
  Mountain,
  CreditCard,
  MessageCircle,
  Share2,
  ShieldCheck,
  Save,
  RotateCcw,
  CheckCircle2,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Globe,
  IndianRupee,
  Calendar,
  AlertTriangle,
  Lock,
  ExternalLink,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  whatsappHelpline: string;
  businessAddress: string;
  websiteUrl: string;
  currency: string;
  defaultAdvancePercent: number;
  defaultMaxBatchSize: number;
  batchCutoffHours: number;
  cancellationPolicy: string;
  enableOfflinePayments: boolean;
  enableCashOnArrival: boolean;
  upiId: string;
  bankDetails: string;
  autoSendWhatsAppConfirmations: boolean;
  bookingAlertEmails: string;
  instagramHandle: string;
  facebookUrl: string;
  youtubeUrl: string;
  metaDescription: string;
  updatedAt?: string;
}

type TabType = "general" | "treks" | "payments" | "whatsapp" | "social" | "security";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to load settings");
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
        if (data.settings.updatedAt) {
          setLastSaved(new Date(data.settings.updatedAt).toLocaleString("en-IN"));
        }
      }
    } catch (err) {
      console.error("Error loading settings:", err);
      toast.error("Could not fetch platform settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: keyof PlatformSettings, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [key]: value,
    });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save settings");
      const data = await res.json();
      toast.success("Platform settings saved successfully! 💾");
      setLastSaved(new Date().toLocaleString("en-IN"));
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSendPasswordReset = async () => {
    if (!user?.email) {
      toast.error("No active user email detected");
      return;
    }
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      if (res.ok) {
        toast.success(`Password reset link dispatched to ${user.email} ✉️`);
      } else {
        toast.error("Failed to dispatch reset email.");
      }
    } catch (err) {
      toast.error("Error sending password reset request.");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <Toaster position="top-right" />

      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#2ecc71]/10 text-[#2ecc71]">
              <Settings size={20} />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Platform Settings</h1>
          </div>
          <p className="text-white/40 text-xs mt-1">
            Configure global business rules, expedition policies, payment gateways, and communication channels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {lastSaved && (
            <span className="text-[11px] text-white/40 font-mono hidden md:inline">
              Last saved: {lastSaved}
            </span>
          )}

          <button
            type="button"
            onClick={fetchSettings}
            disabled={loading || saving}
            className="p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Reload settings"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Reload</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={loading || saving}
            className="px-4 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-black font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#2ecc71]/20 disabled:opacity-50"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
          </button>
        </div>
      </div>

      {/* ── Tab Navigation ─────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === "general"
              ? "bg-[#2ecc71] text-black shadow-sm"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Building2 size={14} />
          <span>General &amp; Brand</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("treks")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === "treks"
              ? "bg-[#2ecc71] text-black shadow-sm"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Mountain size={14} />
          <span>Treks &amp; Expeditions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payments")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === "payments"
              ? "bg-[#2ecc71] text-black shadow-sm"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <CreditCard size={14} />
          <span>Payments &amp; Checkout</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("whatsapp")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === "whatsapp"
              ? "bg-[#2ecc71] text-black shadow-sm"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <MessageCircle size={14} />
          <span>WhatsApp &amp; Alerts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === "social"
              ? "bg-[#2ecc71] text-black shadow-sm"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <Share2 size={14} />
          <span>Social Media &amp; SEO</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === "security"
              ? "bg-[#2ecc71] text-black shadow-sm"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <ShieldCheck size={14} />
          <span>Admin &amp; Security</span>
        </button>
      </div>

      {/* ── Tab Content Panels ─────────────────────────────────── */}
      {loading || !settings ? (
        <div className="p-16 text-center bg-[#141414] border border-white/5 rounded-2xl space-y-2">
          <RefreshCw size={24} className="animate-spin text-[#2ecc71] mx-auto" />
          <p className="text-white/60 text-sm font-semibold">Loading platform configuration...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* TAB 1: General & Brand */}
          {activeTab === "general" && (
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <Building2 size={16} className="text-[#2ecc71]" />
                  <span>General Brand &amp; Contact Details</span>
                </h3>
                <p className="text-white/40 text-xs mt-0.5">
                  Official company identity displayed on invoices, footer, and emails.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-white/60 uppercase block mb-1">
                    Platform / Brand Name
                  </label>
                  <input
                    type="text"
                    value={settings.platformName}
                    onChange={(e) => handleChange("platformName", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-white/60 uppercase block mb-1">
                    Official Website URL
                  </label>
                  <input
                    type="url"
                    value={settings.websiteUrl}
                    onChange={(e) => handleChange("websiteUrl", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-white/60 uppercase block mb-1 flex items-center gap-1.5">
                    <Mail size={12} className="text-[#2ecc71]" />
                    <span>Customer Support Email</span>
                  </label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleChange("supportEmail", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-white/60 uppercase block mb-1 flex items-center gap-1.5">
                    <Phone size={12} className="text-[#2ecc71]" />
                    <span>Support Phone Helpline</span>
                  </label>
                  <input
                    type="text"
                    value={settings.supportPhone}
                    onChange={(e) => handleChange("supportPhone", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-white/60 uppercase block mb-1 flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#2ecc71]" />
                    <span>Physical Headquarters / Base Village Hub Address</span>
                  </label>
                  <textarea
                    rows={2}
                    value={settings.businessAddress}
                    onChange={(e) => handleChange("businessAddress", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Treks & Expeditions */}
          {activeTab === "treks" && (
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <Mountain size={16} className="text-[#2ecc71]" />
                  <span>Expedition &amp; Trip Batch Rules</span>
                </h3>
                <p className="text-white/40 text-xs mt-0.5">
                  Set default booking deposit thresholds, maximum seats per batch, and cancellation policies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-white/60 uppercase block mb-1">
                    Advance Deposit (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={settings.defaultAdvancePercent}
                      onChange={(e) =>
                        handleChange("defaultAdvancePercent", parseInt(e.target.value) || 50)
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                    />
                    <span className="absolute right-3.5 top-2.5 text-white/40 text-xs font-bold">%</span>
                  </div>
                  <p className="text-[10px] text-white/30 mt-1">Default advance paid at checkout</p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-white/60 uppercase block mb-1">
                    Default Max Trekkers per Batch
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={settings.defaultMaxBatchSize}
                    onChange={(e) =>
                      handleChange("defaultMaxBatchSize", parseInt(e.target.value) || 30)
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                  />
                  <p className="text-[10px] text-white/30 mt-1">Target bus capacity per departure</p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-white/60 uppercase block mb-1">
                    Batch Cutoff Time Before Departure
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={72}
                      value={settings.batchCutoffHours}
                      onChange={(e) =>
                        handleChange("batchCutoffHours", parseInt(e.target.value) || 12)
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                    />
                    <span className="absolute right-3.5 top-2.5 text-white/40 text-xs font-bold">Hours</span>
                  </div>
                  <p className="text-[10px] text-white/30 mt-1">Hours before bus leaves to freeze bookings</p>
                </div>

                <div className="md:col-span-3">
                  <label className="text-[11px] font-bold text-white/60 uppercase block mb-1">
                    Standard Cancellation &amp; Refund Policy (Shown on Trek Page)
                  </label>
                  <textarea
                    rows={3}
                    value={settings.cancellationPolicy}
                    onChange={(e) => handleChange("cancellationPolicy", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71] leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Payments & Checkout */}
          {activeTab === "payments" && (
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <CreditCard size={16} className="text-[#2ecc71]" />
                  <span>Payment Gateway &amp; Collection Methods</span>
                </h3>
                <p className="text-white/40 text-xs mt-0.5">
                  Configure Razorpay, Direct UPI payments, and Cash Collection at base village.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">Offline / Direct UPI Payments</h4>
                      <p className="text-[10px] text-white/40">
                        Allow users to pay via UPI QR and upload UTR reference
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableOfflinePayments}
                      onChange={(e) => handleChange("enableOfflinePayments", e.target.checked)}
                      className="w-4 h-4 rounded text-[#2ecc71] focus:ring-0 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-white/60 uppercase block mb-1">
                      Business UPI ID
                    </label>
                    <input
                      type="text"
                      value={settings.upiId}
                      onChange={(e) => handleChange("upiId", e.target.value)}
                      placeholder="visitkokan@upi"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#2ecc71]"
                    />
                  </div>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">Cash on Base Village Arrival</h4>
                      <p className="text-[10px] text-white/40">
                        Allow trekkers to pay remaining balance in cash to trek leads
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableCashOnArrival}
                      onChange={(e) => handleChange("enableCashOnArrival", e.target.checked)}
                      className="w-4 h-4 rounded text-[#2ecc71] focus:ring-0 cursor-pointer"
                    />
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 inline-flex items-center gap-1">
                      <CheckCircle2 size={12} /> Razorpay Online Gateway Active
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-white/60 uppercase block mb-1">
                    Bank Transfer Details (Instructions for manual bookings)
                  </label>
                  <textarea
                    rows={4}
                    value={settings.bankDetails}
                    onChange={(e) => handleChange("bankDetails", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#2ecc71]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WhatsApp & Alerts */}
          {activeTab === "whatsapp" && (
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <MessageCircle size={16} className="text-[#25D366]" />
                  <span>WhatsApp Communication &amp; Admin Alerts</span>
                </h3>
                <p className="text-white/40 text-xs mt-0.5">
                  Helpline number and dispatch preferences for participant communication.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-white/60 uppercase block mb-1">
                    Official WhatsApp Helpline Number
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappHelpline}
                    onChange={(e) => handleChange("whatsappHelpline", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#2ecc71]"
                  />
                  <p className="text-[10px] text-white/30 mt-1">Shown in trekker chat buttons and footer</p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-white/60 uppercase block mb-1">
                    Admin Booking Alert Email(s)
                  </label>
                  <input
                    type="text"
                    value={settings.bookingAlertEmails}
                    onChange={(e) => handleChange("bookingAlertEmails", e.target.value)}
                    placeholder="bookings@visitkokan.com, leads@visitkokan.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                  />
                  <p className="text-[10px] text-white/30 mt-1">Comma-separated emails to notify on new orders</p>
                </div>

                <div className="md:col-span-2 p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-xs">Auto-Send WhatsApp Confirmations</h4>
                    <p className="text-[10px] text-white/40">
                      Generate direct WhatsApp link on the Order Confirmation page for fast customer support
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoSendWhatsAppConfirmations}
                    onChange={(e) =>
                      handleChange("autoSendWhatsAppConfirmations", e.target.checked)
                    }
                    className="w-4 h-4 rounded text-[#2ecc71] focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Social Media & SEO */}
          {activeTab === "social" && (
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <Share2 size={16} className="text-[#2ecc71]" />
                  <span>Social Channels &amp; Meta SEO</span>
                </h3>
                <p className="text-white/40 text-xs mt-0.5">
                  Connect official social profiles and platform meta tags for Google indexing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-white/60 uppercase block mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={settings.instagramHandle}
                    onChange={(e) => handleChange("instagramHandle", e.target.value)}
                    placeholder="@visitkokan"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-white/60 uppercase block mb-1">
                    Facebook Page URL
                  </label>
                  <input
                    type="url"
                    value={settings.facebookUrl}
                    onChange={(e) => handleChange("facebookUrl", e.target.value)}
                    placeholder="https://facebook.com/visitkokan"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-white/60 uppercase block mb-1">
                    YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    value={settings.youtubeUrl}
                    onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                    placeholder="https://youtube.com/@visitkokan"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="text-[11px] font-bold text-white/60 uppercase block mb-1">
                    Meta Description (SEO)
                  </label>
                  <textarea
                    rows={3}
                    value={settings.metaDescription}
                    onChange={(e) => handleChange("metaDescription", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                  />
                  <p className="text-[10px] text-white/30 mt-1">
                    Displayed in Google Search snippet and social link cards.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Admin & Security */}
          {activeTab === "security" && (
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#2ecc71]" />
                  <span>Admin Identity &amp; Platform Security</span>
                </h3>
                <p className="text-white/40 text-xs mt-0.5">
                  Verified session credentials, privileged role management, and password recovery.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase block">
                    Active Session Account
                  </span>
                  <div className="font-bold text-white text-sm">{user?.email || "Admin User"}</div>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Role: ADMIN (Full Access Privileges)</span>
                  </div>
                  <p className="text-[10px] text-white/30 pt-1">
                    Signed cookie signature verification active (`vk_session`).
                  </p>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2.5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-xs">Admin Password Recovery</h4>
                    <p className="text-[10px] text-white/40">
                      Dispatch a secure, verified password reset token directly to your admin email address.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendPasswordReset}
                    className="py-2 px-3.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer w-fit"
                  >
                    <Mail size={13} />
                    <span>Send Password Reset Email</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-white/30 text-xs">
              Changes apply across client booking flows and admin management consoles.
            </span>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#2ecc71] hover:bg-[#27ae60] text-black font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#2ecc71]/20 disabled:opacity-50"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{saving ? "Saving Changes..." : "Save All Settings"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
