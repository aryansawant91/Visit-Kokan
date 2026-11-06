"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, CreditCard, Loader2,
  Upload, Shield, Check, X,
  Users, ChevronRight, Tag, Clock,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Person {
  name: string;
  birthDate: string;
  gender: "male" | "female" | "other";
  foodPreference: "veg" | "non-veg" | "vegan";
  medicalConditions: string;
  idProofUrl: string;
  idProofUploading: boolean;
}

interface VisibleCoupon {
  code: string;
  discount: number;
  description: string;
  minAmount: number;
  label: string;
  expiresAt: string | null;
}

interface TrekBookingWidgetProps {
  trekId: string;
  trekName: string;
  trekSlug: string;
  pricePerPerson: number;
  maxCapacity?: number;
  advanceAmount?: number;
  whatsappGroupLink?: string;
  scheduledDate?: string;
  hideStickyBar?: boolean;
  modalOnly?: boolean;
}

// ── Disclaimer ────────────────────────────────────────────────────────────────

const DISCLAIMER_SECTIONS = [
  {
    title: "Cancellation Policy",
    body: "Cancellations more than 30 days before the trek receive a 50% credit. Cancellations within 30 days, no-shows, or voluntary withdrawal are non-refundable.",
  },
  {
    title: "Fitness & Medical Responsibility",
    body: "You are responsible for ensuring you are physically and medically fit to participate. Any relevant medical condition, injury, or medication must be disclosed before the trek.",
  },
  {
    title: "Personal Safety",
    body: "You are responsible for your own safety and conduct. Follow trek leader instructions, stay with the group, and avoid reckless or unsafe behaviour.",
  },
  {
    title: "Risk Acknowledgement",
    body: "Trekking involves serious risks, including falls, injury, illness, extreme weather, permanent disability, and, in rare cases, death. By participating, you knowingly and voluntarily accept these risks.",
  },
  {
    title: "Route & Safety Decisions",
    body: "Routes, schedules, or activities may be changed or cancelled due to weather, safety concerns, government restrictions, or circumstances beyond our control.",
  },
  {
    title: "Liability & Emergency Costs",
    body: "To the extent permitted by law, organizers are not liable for losses caused by inherent trekking risks, participant actions, or events beyond reasonable control. Rescue, evacuation, and medical expenses are the participant's responsibility.",
  },
  {
    title: "Participant Agreement",
    body: "By booking and participating, you confirm that you understand the risks, accept personal responsibility, agree to follow safety instructions, and accept these terms.",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const emptyPerson = (): Person => ({
  name: "", birthDate: "", gender: "male",
  foodPreference: "veg", medicalConditions: "",
  idProofUrl: "", idProofUploading: false,
});

function calculateAge(dob: string) {
  if (!dob) return 0;
  const today = new Date(), birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const maxDOB = () => { const d = new Date(); d.setFullYear(d.getFullYear() - 6);  return d.toISOString().split("T")[0]; };
const minDOB = () => { const d = new Date(); d.setFullYear(d.getFullYear() - 80); return d.toISOString().split("T")[0]; };

function formatTimeLeft(expiresAt: string | null): string | null {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const totalMinutes = Math.floor(diff / 1000 / 60);
  const days    = Math.floor(totalMinutes / (60 * 24));
  const hours   = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0)  return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

function makeGuestId() {
  return `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone: string) {
  return /^\d{10}$/.test(phone.replace(/\D/g, ""));
}

declare global { interface Window { Razorpay: any; } }

// ── Pill selector ─────────────────────────────────────────────────────────────

function Pills<T extends string>({
  options, value, onChange,
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            value === o.value
              ? "bg-kokan-green text-white border-kokan-green shadow-xs"
              : "bg-white text-kokan-earth/60 border-kokan-sand/60 hover:border-kokan-green/40"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Countdown badge for coupons ───────────────────────────────────────────────

function CountdownBadge({ expiresAt }: { expiresAt: string | null }) {
  const [timeLeft, setTimeLeft] = useState(() => formatTimeLeft(expiresAt));

  useEffect(() => {
    if (!expiresAt) return;
    const t = setInterval(() => setTimeLeft(formatTimeLeft(expiresAt)), 60000);
    return () => clearInterval(t);
  }, [expiresAt]);

  if (!timeLeft) return null;
  const isUrgent = timeLeft.includes("m left") || timeLeft.includes("h left");

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
      isUrgent
        ? "bg-rose-100 text-rose-700 animate-pulse"
        : "bg-amber-100 text-amber-800"
    }`}>
      <Clock className="w-2.5 h-2.5" />
      {timeLeft}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TrekBookingWidget({
  trekId, trekName, trekSlug, pricePerPerson, maxCapacity = 20, advanceAmount = 0, whatsappGroupLink, scheduledDate, hideStickyBar = false, modalOnly = false,
}: TrekBookingWidgetProps) {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [open, setOpen]                     = useState(false);
  const [persons, setPersons]               = useState<Person[]>([emptyPerson()]);

  // Listen to open-trek-booking event from external triggers
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-trek-booking", handler);
    return () => window.removeEventListener("open-trek-booking", handler);
  }, []);

  const [activePerson, setActivePerson]         = useState(0);
  const [disclaimerModalOpen, setDisclaimerModalOpen] = useState(false);
  const [agreed, setAgreed]                     = useState(false);
  const [errors, setErrors]                     = useState<string[]>([]);
  const [loading, setLoading]                   = useState(false);

  // ── Guest details state ────────────────────────────────────────────────────
  const [guestId]    = useState(() => makeGuestId());
  const [guestName, setGuestName]   = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const effectiveUserId = user?.uid ?? guestId;
  const effectiveEmail  = user ? (user.email ?? "") : guestEmail;
  const effectiveName   = user ? (profile?.displayName ?? user.email ?? "Guest") : guestName;
  const effectivePhone  = user ? (profile?.phone ?? "") : guestPhone;

  // ── Payment choice (full vs advance) ───────────────────────────────────────
  const [paymentChoice, setPaymentChoice] = useState<"full" | "half">(
    advanceAmount > 0 ? "half" : "full"
  );

  const [paymentMethod, setPaymentMethod] = useState<"online" | "offline">("online");

  // ── Coupon state ──────────────────────────────────────────────────────────
  const [visibleCoupons, setVisibleCoupons] = useState<VisibleCoupon[]>([]);
  const [couponInput, setCouponInput]       = useState("");
  const [appliedCoupon, setAppliedCoupon]   = useState<{
    code: string; discount: number; description: string;
  } | null>(null);
  const [couponError, setCouponError]       = useState("");
  const [couponLoading, setCouponLoading]   = useState(false);

  useEffect(() => {
    fetch("/api/coupons/trek")
      .then((r) => r.json())
      .then((data) => setVisibleCoupons(data.visible ?? []))
      .catch(() => {});
  }, []);

  // ── Derived amounts ───────────────────────────────────────────────────────
  const subtotal       = persons.length * pricePerPerson;
  const couponDiscount = appliedCoupon ? Math.min(appliedCoupon.discount, subtotal) : 0;
  const totalAmount    = Math.max(0, subtotal - couponDiscount);

  const hasAdvanceOption   = advanceAmount > 0;
  const showSplitBreakdown = hasAdvanceOption && paymentChoice === "half" && paymentMethod === "online";
  const amountToPayOnline  = showSplitBreakdown ? advanceAmount : totalAmount;
  const remainingCash      = showSplitBreakdown ? Math.max(0, totalAmount - advanceAmount) : 0;

  // ── Persons ───────────────────────────────────────────────────────────────

  const addPerson = () => {
    if (persons.length >= maxCapacity) return;
    const next = persons.length;
    setPersons((p) => [...p, emptyPerson()]);
    setActivePerson(next);
  };

  const removePerson = (i: number) => {
    if (persons.length === 1) return;
    setPersons((p) => p.filter((_, idx) => idx !== i));
    setActivePerson(Math.max(0, activePerson - 1));
  };

  const update = (i: number, key: keyof Person, val: string | boolean) =>
    setPersons((p) => p.map((x, idx) => idx === i ? { ...x, [key]: val } : x));

  // ── ID upload (optional; server-side, works for guests and logged-in users) ─

  const handleIdUpload = async (index: number, file: File) => {
    if (!file) return;
    update(index, "idProofUploading", true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ownerId", effectiveUserId);
      formData.append("trekId", trekId);
      formData.append("personIndex", String(index));

      const res = await fetch("/api/upload/trek-id-proof", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.url) throw new Error("Upload failed");

      setPersons((prev) =>
        prev.map((p, i) => i === index ? { ...p, idProofUrl: data.url, idProofUploading: false } : p)
      );
    } catch {
      update(index, "idProofUploading", false);
      alert("Upload failed. Try again.");
    }
  };

  // ── Validate ──────────────────────────────────────────────────────────────

  const validate = () => {
    const errs: string[] = [];

    if (!user) {
      if (!guestName.trim())            errs.push("Your name is required");
      if (!isValidEmail(guestEmail))    errs.push("A valid email address is required");
      if (!isValidPhone(guestPhone))    errs.push("A valid 10-digit phone number is required");
    }

    persons.forEach((p, i) => {
      const lbl = `Person ${i + 1}`;
      if (!p.name.trim()) errs.push(`${lbl}: Name required`);
      if (!p.birthDate) { errs.push(`${lbl}: DOB required`); }
      else {
        const age = calculateAge(p.birthDate);
        if (age < 6)  errs.push(`${lbl}: Min age is 6`);
        if (age > 80) errs.push(`${lbl}: Max age is 80`);
      }
      if (p.idProofUploading) errs.push(`${lbl}: ID proof is still uploading, please wait`);
    });
    if (!agreed) errs.push("Please tick the terms and conditions checkbox to proceed");
    setErrors(errs);
    return errs.length === 0;
  };

  // ── Coupon handlers ───────────────────────────────────────────────────────

  const applyCoupon = async (codeOverride?: string) => {
    const code = (codeOverride ?? couponInput).trim().toUpperCase();
    if (!code) { setCouponError("Enter a coupon code"); return; }
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, amount: subtotal, type: "trek" }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({ code: data.code, discount: data.discount, description: data.description });
        setCouponInput("");
      } else {
        setCouponError(data.error ?? "Invalid coupon");
      }
    } catch {
      setCouponError("Could not validate. Try again.");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => { setAppliedCoupon(null); setCouponError(""); };

  // ── Book (online) ────────────────────────────────────────────────────────

  const handleBooking = async () => {
    if (!validate()) return;
    setLoading(true);

    if (!window.Razorpay) {
      await new Promise<void>((res) => {
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = () => res();
        document.body.appendChild(s);
      });
    }

    try {
      const orderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountToPayOnline,
          orderType: "trek",
          userId: effectiveUserId,
          userEmail: effectiveEmail,
          userName: effectiveName,
          userPhone: effectivePhone,
          isGuest: !user,
          trekId, trekName, trekSlug,
          whatsappGroupLink: whatsappGroupLink ?? null,
          couponCode: appliedCoupon?.code ?? null,
          couponDiscount,
          finalAmount: totalAmount,
          totalAmount,
          advancePaid: amountToPayOnline,
          remainingCash,
          paymentType: showSplitBreakdown ? "advance" : "full",
          persons: persons.map((p) => ({
            name: p.name, birthDate: p.birthDate,
            age: calculateAge(p.birthDate), gender: p.gender,
            foodPreference: p.foodPreference,
            medicalConditions: p.medicalConditions,
            idProofUrl: p.idProofUrl,
          })),
        }),
      });
      const orderData = await orderRes.json();
      if (!orderData.razorpayOrderId) throw new Error("Order creation failed");

      new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount, currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        name: "Visit Kokan",
        description: `${trekName} — ${persons.length} person(s)`,
        image: "/icons/icon-192.png",
        prefill: { name: effectiveName, email: effectiveEmail, contact: effectivePhone },
        theme: { color: "#2d7a4f" },
        handler: async (response: any) => {
          const v = await fetch("/api/checkout/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: orderData.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const vd = await v.json();
          if (vd.success) router.replace(`/order-confirmation/${orderData.orderId}`);
          else alert("Verification failed. Contact support.");
        },
        modal: { ondismiss: () => setLoading(false) },
      }).open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  // ── Book (offline / pay-at-trek) ─────────────────────────────────────────

  const handleOfflineBooking = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout/create-offline-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType: "trek",
          userId: effectiveUserId,
          userEmail: effectiveEmail,
          userName: effectiveName,
          userPhone: effectivePhone,
          isGuest: !user,
          trekId, trekName, trekSlug,
          whatsappGroupLink: whatsappGroupLink ?? null,
          couponCode: appliedCoupon?.code ?? null,
          couponDiscount,
          totalAmount,
          persons: persons.map((p) => ({
            name: p.name, birthDate: p.birthDate,
            age: calculateAge(p.birthDate), gender: p.gender,
            foodPreference: p.foodPreference,
            medicalConditions: p.medicalConditions,
            idProofUrl: p.idProofUrl,
          })),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error("Booking failed");
      router.replace(`/order-confirmation/${data.orderId}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  const p = persons[activePerson];
  const age = p?.birthDate ? calculateAge(p.birthDate) : null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Booking card ── */}
      {!modalOnly && (
        <div className={`${hideStickyBar ? "block" : "hidden lg:block"} bg-white rounded-3xl border border-[#d6e2d4] shadow-sm overflow-hidden`}>
          <div className="p-5">
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-2xl font-bold text-kokan-earth">₹{pricePerPerson.toLocaleString("en-IN")}</span>
              <span className="text-sm text-kokan-earth/40">/ person</span>
            </div>
            <p className="text-xs text-kokan-earth/40 mb-4">Includes guide, equipment &amp; meals</p>

            <div className="flex items-center justify-between bg-kokan-cream/50 rounded-xl px-4 py-3 mb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-kokan-earth">
                <Users className="w-4 h-4 text-kokan-green" />
                {persons.length} {persons.length === 1 ? "Person" : "Persons"}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => persons.length > 1 && removePerson(persons.length - 1)}
                  disabled={persons.length <= 1}
                  className="w-7 h-7 rounded-lg bg-white border border-kokan-sand/50 flex items-center justify-center text-kokan-earth/60 hover:border-kokan-green/40 disabled:opacity-30 font-bold transition-all cursor-pointer"
                >−</button>
                <span className="w-6 text-center text-sm font-bold text-kokan-earth">{persons.length}</span>
                <button
                  type="button"
                  onClick={addPerson}
                  disabled={persons.length >= maxCapacity}
                  className="w-7 h-7 rounded-lg bg-white border border-kokan-sand/50 flex items-center justify-center text-kokan-earth/60 hover:border-kokan-green/40 disabled:opacity-30 font-bold transition-all cursor-pointer"
                >+</button>
              </div>
            </div>

            {/* Desktop price breakdown */}
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-kokan-earth/50">₹{pricePerPerson.toLocaleString("en-IN")} × {persons.length}</span>
                <span className="font-bold text-kokan-earth">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-xs text-kokan-green font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>− ₹{couponDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-kokan-earth border-t border-kokan-sand/30 pt-1 mt-1">
                <span>Total Trek Cost</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              {showSplitBreakdown && (
                <>
                  <div className="flex justify-between text-sm font-bold text-kokan-green pt-1 border-t border-dashed border-gray-200 mt-1">
                    <span>💳 Pay Online Now</span>
                    <span>₹{amountToPayOnline.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-amber-600">
                    <span>💵 Pay Cash at Trek</span>
                    <span>₹{remainingCash.toLocaleString("en-IN")}</span>
                  </div>
                </>
              )}
            </div>

            {showSplitBreakdown && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 mb-4">
                <p className="text-xs text-amber-700 leading-relaxed">
                  💡 Pay <strong>₹{amountToPayOnline.toLocaleString("en-IN")}</strong> now to confirm your slot. The remaining{" "}
                  <strong>₹{remainingCash.toLocaleString("en-IN")}</strong> is collected in cash on the day of the trek.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 bg-kokan-green text-white rounded-xl font-bold text-sm hover:bg-kokan-green/90 transition-colors shadow-lg shadow-kokan-green/20 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" /> Book Now
            </button>
            <p className="text-center text-[11px] text-kokan-earth/30 mt-2">🔒 Secured by Razorpay</p>
          </div>
        </div>
      )}

      {/* ── Mobile sticky bottom bar ── */}
      {!hideStickyBar && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-kokan-sand/30 px-4 py-3 flex items-center gap-3 shadow-2xl">
          <div className="flex-1">
            <p className="text-xs text-kokan-earth/40">
              {showSplitBreakdown ? "Advance for" : "Total for"} {persons.length} person{persons.length > 1 ? "s" : ""}
            </p>
            <p className="text-lg font-bold text-kokan-earth leading-tight">
              ₹{amountToPayOnline.toLocaleString("en-IN")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-kokan-green text-white rounded-xl font-bold text-sm shadow-lg shadow-kokan-green/20 hover:bg-kokan-green/90 transition-colors cursor-pointer"
          >
            Book Now <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Booking drawer / modal ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => !loading && setOpen(false)}
          />

          <div className="relative w-full lg:max-w-lg bg-white lg:rounded-3xl rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0 bg-gray-50/70">
              <div>
                <h2 className="font-bold text-kokan-earth text-base line-clamp-1">{trekName}</h2>
                <p className="text-xs text-kokan-earth/60 mt-0.5">
                  ₹{pricePerPerson.toLocaleString("en-IN")} × {persons.length} person{persons.length > 1 ? "s" : ""} ={" "}
                  <span className="font-bold text-kokan-green">₹{totalAmount.toLocaleString("en-IN")}</span>
                  {showSplitBreakdown && (
                    <span className="text-amber-600 font-bold"> · ₹{amountToPayOnline.toLocaleString("en-IN")} due now</span>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => !loading && setOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-kokan-earth/70" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

              {/* 1. Guest contact details (only when not logged in) */}
              {!user && (
                <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-kokan-earth uppercase tracking-wider">Your Contact Details</p>
                    <Link
                      href={`/login?redirect=/treks/${trekSlug}`}
                      className="text-xs font-bold text-kokan-green hover:underline"
                    >
                      Log in instead
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-kokan-earth/60 uppercase tracking-widest mb-1">Full Name *</label>
                      <input
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs text-kokan-earth focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-kokan-earth/60 uppercase tracking-widest mb-1">Email *</label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs text-kokan-earth focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-kokan-earth/60 uppercase tracking-widest mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="10-digit number"
                        className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs text-kokan-earth focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-kokan-earth/50">We will send your booking confirmation & trek itinerary to these details.</p>
                </div>
              )}

              {/* 2. Person tabs & inputs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
                    {persons.map((person, i) => {
                      const done = person.name && person.birthDate;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActivePerson(i)}
                          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            activePerson === i
                              ? "bg-kokan-green text-white border-kokan-green shadow-xs"
                              : "bg-white text-kokan-earth/60 border-gray-200 hover:border-kokan-green/40"
                          }`}
                        >
                          {done
                            ? <Check className="w-3 h-3 text-white" />
                            : <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9px]">{i + 1}</span>
                          }
                          <span>{person.name ? person.name.split(" ")[0] : `P${i + 1}`}</span>
                          {persons.length > 1 && activePerson === i && (
                            <span
                              role="button"
                              onClick={(e) => { e.stopPropagation(); removePerson(i); }}
                              className="ml-1 opacity-70 hover:opacity-100 hover:text-red-200"
                            >
                              ✕
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {persons.length < maxCapacity && (
                    <button
                      type="button"
                      onClick={addPerson}
                      className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-kokan-green bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  )}
                </div>

                {p && (
                  <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-kokan-earth/60 uppercase tracking-widest mb-1">Full Name *</label>
                        <input
                          value={p.name}
                          onChange={(e) => update(activePerson, "name", e.target.value)}
                          placeholder="e.g. Rohan Sawant"
                          className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs text-kokan-earth focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-kokan-earth/60 uppercase tracking-widest mb-1">Date of Birth *</label>
                        <input
                          type="date"
                          min={minDOB()} max={maxDOB()}
                          value={p.birthDate}
                          onChange={(e) => update(activePerson, "birthDate", e.target.value)}
                          className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs text-kokan-earth focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                        />
                        {age !== null && p.birthDate && (
                          <p className="text-[10px] text-kokan-green font-bold mt-0.5">Age: {age} yrs</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-kokan-earth/60 uppercase tracking-widest mb-1">Gender</label>
                      <Pills
                        options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }]}
                        value={p.gender}
                        onChange={(v) => update(activePerson, "gender", v)}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-kokan-earth/60 uppercase tracking-widest mb-1">Food Preference</label>
                      <Pills
                        options={[{ value: "veg", label: "🥦 Veg" }, { value: "non-veg", label: "🍗 Non-Veg" }, { value: "vegan", label: "🌱 Vegan" }]}
                        value={p.foodPreference}
                        onChange={(v) => update(activePerson, "foodPreference", v)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-kokan-earth/60 uppercase tracking-widest mb-1">Medical Conditions <span className="normal-case font-normal">(optional)</span></label>
                        <input
                          value={p.medicalConditions}
                          onChange={(e) => update(activePerson, "medicalConditions", e.target.value)}
                          placeholder="e.g. Asthma, allergies"
                          className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs text-kokan-earth focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-kokan-earth/60 uppercase tracking-widest mb-1">Govt ID Proof <span className="normal-case font-normal">(optional)</span></label>
                        {p.idProofUrl ? (
                          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-xl px-2.5 py-1.5 h-[34px]">
                            <Check className="w-3.5 h-3.5 text-kokan-green flex-shrink-0" />
                            <span className="text-[11px] text-kokan-green font-bold flex-1 truncate">ID Uploaded</span>
                            <button type="button" onClick={() => update(activePerson, "idProofUrl", "")} className="text-[10px] text-red-500 font-bold">✕</button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center gap-1.5 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-kokan-green hover:bg-white transition-colors h-[34px] px-2">
                            {p.idProofUploading
                              ? <><Loader2 className="w-3 h-3 animate-spin text-kokan-green" /><span className="text-[11px] text-gray-500">Uploading…</span></>
                              : <><Upload className="w-3 h-3 text-gray-400" /><span className="text-[11px] text-gray-600 font-medium">Upload ID</span></>
                            }
                            <input
                              type="file" accept="image/jpeg,image/png,application/pdf" className="hidden"
                              disabled={p.idProofUploading}
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleIdUpload(activePerson, f); }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. COUPON BOX (Prominent, always visible) */}
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-kokan-green flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Have a Coupon Code?</span>
                  </span>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-100/80 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-950">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-kokan-green shrink-0" />
                      <span>Coupon &ldquo;{appliedCoupon.code}&rdquo; applied! Saving ₹{couponDiscount.toLocaleString("en-IN")}</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-red-600 font-bold hover:underline ml-2 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    {visibleCoupons.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-kokan-earth/60 uppercase tracking-wider block">
                          Available Coupons (Tap to Apply):
                        </span>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                          {visibleCoupons.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => applyCoupon(c.code)}
                              className="flex-shrink-0 px-3 py-1.5 bg-white border border-emerald-400 rounded-xl text-xs font-bold text-kokan-green hover:bg-emerald-50 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 active:scale-95"
                            >
                              <span>🏷️</span>
                              <span>{c.code}</span>
                              <span className="text-[10px] text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded-full font-semibold">
                                ₹{c.discount} off
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCoupon())}
                        placeholder="Enter coupon code (e.g. TREK100)"
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                      />
                      <button
                        type="button"
                        onClick={() => applyCoupon()}
                        disabled={couponLoading}
                        className="px-4 py-2 bg-kokan-green text-white rounded-xl text-xs font-bold hover:bg-emerald-800 disabled:opacity-60 transition-colors cursor-pointer"
                      >
                        {couponLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : "Apply"}
                      </button>
                    </div>
                    {couponError && <p className="text-xs text-red-500 font-medium">{couponError}</p>}
                  </>
                )}
              </div>

              {/* 4. Payment Method & Choice (Moved inside scrollable body so footer doesn't bloat) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-kokan-earth">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("online")}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMethod === "online"
                        ? "bg-kokan-green text-white border-kokan-green shadow-xs"
                        : "bg-white text-kokan-earth/70 border-gray-200 hover:border-kokan-green/40"
                    }`}
                  >
                    <span>💳 Pay Online</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("offline")}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMethod === "offline"
                        ? "bg-kokan-green text-white border-kokan-green shadow-xs"
                        : "bg-white text-kokan-earth/70 border-gray-200 hover:border-kokan-green/40"
                    }`}
                  >
                    <span>💵 Pay Offline (Cash)</span>
                  </button>
                </div>
                {paymentMethod === "offline" && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 leading-relaxed">
                    Your slot will be reserved as <strong>pending</strong>. You pay ₹{totalAmount.toLocaleString("en-IN")} in cash to the trek leader on departure.
                  </p>
                )}
              </div>

              {/* Advance vs Full Option (if online) */}
              {hasAdvanceOption && paymentMethod === "online" && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-kokan-earth">
                    Payment Option
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentChoice("half")}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                        paymentChoice === "half"
                          ? "bg-kokan-green text-white border-kokan-green shadow-xs"
                          : "bg-white text-kokan-earth/70 border-gray-200 hover:border-kokan-green/40"
                      }`}
                    >
                      <span className="block text-[10px] opacity-80 uppercase tracking-wider">Advance</span>
                      <span className="block font-black text-sm">₹{advanceAmount.toLocaleString("en-IN")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentChoice("full")}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                        paymentChoice === "full"
                          ? "bg-kokan-green text-white border-kokan-green shadow-xs"
                          : "bg-white text-kokan-earth/70 border-gray-200 hover:border-kokan-green/40"
                      }`}
                    >
                      <span className="block text-[10px] opacity-80 uppercase tracking-wider">Full Fare</span>
                      <span className="block font-black text-sm">₹{totalAmount.toLocaleString("en-IN")}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 5. Price Breakdown Summary */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 space-y-1.5">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹{pricePerPerson.toLocaleString("en-IN")} × {persons.length} person{persons.length > 1 ? "s" : ""}</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-xs text-kokan-green font-bold">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>− ₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-kokan-earth pt-1 border-t border-gray-200">
                  <span>Total Trek Cost</span>
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
                {showSplitBreakdown && (
                  <>
                    <div className="flex justify-between text-xs font-bold text-kokan-green pt-1.5 border-t border-dashed border-gray-300">
                      <span>💳 Due Online Now</span>
                      <span>₹{amountToPayOnline.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-amber-700">
                      <span>💵 Cash at Departure</span>
                      <span>₹{remainingCash.toLocaleString("en-IN")}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Errors list */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-3 space-y-1">
                  {errors.map((e, i) => (
                    <p key={i} className="text-xs text-red-600 flex items-start gap-1.5">
                      <span className="flex-shrink-0">•</span> {e}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Pinned Sticky Footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex-shrink-0 bg-white/98 backdrop-blur-md shadow-lg space-y-2.5">
              {/* Pinned Terms & Disclaimer Checkbox */}
              <div className="p-2.5 bg-amber-50/90 border border-amber-200/90 rounded-xl flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="trek-agree-terms-checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-amber-400 text-kokan-green focus:ring-kokan-green cursor-pointer shrink-0 accent-[#2D6A4F]"
                />
                <label htmlFor="trek-agree-terms-checkbox" className="text-[11px] text-kokan-earth/85 leading-tight cursor-pointer select-none">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setDisclaimerModalOpen(true)}
                    className="font-bold text-kokan-green underline hover:text-emerald-800 cursor-pointer"
                  >
                    Trek Terms, Cancellation Policy &amp; Liability Waiver
                  </button>
                  .
                </label>
              </div>

              <button
                type="button"
                onClick={paymentMethod === "offline" ? handleOfflineBooking : handleBooking}
                disabled={loading || !agreed}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-kokan-green text-white rounded-full font-bold text-sm hover:bg-emerald-800 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-kokan-green/20 cursor-pointer"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                ) : paymentMethod === "offline" ? (
                  <>Confirm Booking — Pay ₹{totalAmount.toLocaleString("en-IN")} at Trek</>
                ) : (
                  <><CreditCard className="w-4 h-4" /> Pay ₹{amountToPayOnline.toLocaleString("en-IN")}{showSplitBreakdown ? " to Confirm" : ""}</>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-kokan-earth/50">
                <span>🔒 100% Secure Razorpay</span>
                <span>•</span>
                <span>⚡ Instant Batch Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Terms & Disclaimer Full Modal ── */}
      {disclaimerModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#122e1b] to-[#1e4a2d] text-white p-4.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">Terms &amp; Disclaimer</h3>
              </div>
              <button
                type="button"
                onClick={() => setDisclaimerModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3.5 text-xs text-kokan-earth/80 leading-relaxed">
              {DISCLAIMER_SECTIONS.map((s, i) => (
                <div key={i} className="space-y-0.5">
                  <h4 className="font-bold text-kokan-earth text-xs">{i + 1}. {s.title}</h4>
                  <p className="text-gray-600 text-[11px] leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setAgreed(true);
                  setDisclaimerModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-full text-xs font-bold bg-kokan-green text-white hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer text-center"
              >
                I Understand &amp; Agree
              </button>
              <button
                type="button"
                onClick={() => setDisclaimerModalOpen(false)}
                className="px-4 py-2.5 rounded-full text-xs font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
