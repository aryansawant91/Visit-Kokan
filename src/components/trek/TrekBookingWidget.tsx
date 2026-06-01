"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import {
  Plus, CreditCard, Loader2,
  Upload, Shield, Check, X, ChevronDown,
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
}

// ── Disclaimer ────────────────────────────────────────────────────────────────

const DISCLAIMER_SECTIONS = [
  {
    title: "Cancellation Policy",
    body: "Cancellations more than 30 days before the trek receive a 50% credit. Within 30 days — non-refundable.",
  },
  {
    title: "Physical Fitness",
    body: "Ensure you are physically fit. Declare any medical conditions at the time of booking.",
  },
  {
    title: "Code of Conduct",
    body: "Be respectful to the local culture, environment, and other trekkers.",
  },
  {
    title: "Liability Waiver",
    body: "Trekking involves inherent risks including injury, illness, or property damage. By participating, you voluntarily assume all risks and release our company and guides from any liability.",
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

declare global { interface Window { Razorpay: any; } }

// ── Pill selector ─────────────────────────────────────────────────────────────

function Pills<T extends string>({
  options, value, onChange,
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((o) => (
        <button
          key={o.value} type="button" onClick={() => onChange(o.value)}
          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
            value === o.value
              ? "bg-kokan-green text-white border-kokan-green"
              : "bg-white text-kokan-earth/50 border-kokan-sand/60 hover:border-kokan-green/40"
          }`}
        >{o.label}</button>
      ))}
    </div>
  );
}

// ── Countdown badge ───────────────────────────────────────────────────────────

function CountdownBadge({ expiresAt }: { expiresAt: string | null }) {
  const [label, setLabel] = useState(() => formatTimeLeft(expiresAt));

  useEffect(() => {
    if (!expiresAt) return;
    const id = setInterval(() => setLabel(formatTimeLeft(expiresAt)), 60_000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (!label) return null;

  const isUrgent = (() => {
    if (!expiresAt) return false;
    const diff = new Date(expiresAt).getTime() - Date.now();
    return diff < 24 * 60 * 60 * 1000; // less than 1 day
  })();

  return (
    <span className={`flex items-center gap-0.5 text-[9px] font-semibold mt-0.5 ${
      isUrgent ? "text-red-500" : "text-amber-500"
    }`}>
      <Clock className="w-2.5 h-2.5" />
      {label}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TrekBookingWidget({
  trekId, trekName, trekSlug, pricePerPerson, maxCapacity = 20,
}: TrekBookingWidgetProps) {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [open, setOpen]                     = useState(false);
  const [persons, setPersons]               = useState<Person[]>([emptyPerson()]);
  const [activePerson, setActivePerson]     = useState(0);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [agreed, setAgreed]                 = useState(false);
  const [loading, setLoading]               = useState(false);
  const [errors, setErrors]                 = useState<string[]>([]);

  // ── Coupon state ──────────────────────────────────────────────────────────
  const [visibleCoupons, setVisibleCoupons] = useState<VisibleCoupon[]>([]);
  const [couponInput, setCouponInput]       = useState("");
  const [appliedCoupon, setAppliedCoupon]   = useState<{
    code: string; discount: number; description: string;
  } | null>(null);
  const [couponError, setCouponError]       = useState("");
  const [couponLoading, setCouponLoading]   = useState(false);

  // ── Fetch visible coupons on mount ────────────────────────────────────────
  useEffect(() => {
    fetch("/api/coupons/trek")
      .then((r) => r.json())
      .then((data) => setVisibleCoupons(data.visible ?? []))
      .catch(() => {});
  }, []);

  // ── Derived amounts ───────────────────────────────────────────────────────
  const subtotal       = persons.length * pricePerPerson;
  const couponDiscount = appliedCoupon
    ? Math.min(appliedCoupon.discount, subtotal)
    : 0;
  const totalAmount    = Math.max(0, subtotal - couponDiscount);

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

  // ── ID upload ─────────────────────────────────────────────────────────────

  const handleIdUpload = async (index: number, file: File) => {
    if (!file || !user) return;
    update(index, "idProofUploading", true);
    try {
      const path = `trek-id-proofs/${user.uid}/${trekId}/p${index}-${Date.now()}-${file.name}`;
      const r = storageRef(storage, path);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      setPersons((prev) =>
        prev.map((p, i) => i === index ? { ...p, idProofUrl: url, idProofUploading: false } : p)
      );
    } catch {
      update(index, "idProofUploading", false);
      alert("Upload failed. Try again.");
    }
  };

  // ── Validate ──────────────────────────────────────────────────────────────

  const validate = () => {
    const errs: string[] = [];
    persons.forEach((p, i) => {
      const lbl = `Person ${i + 1}`;
      if (!p.name.trim()) errs.push(`${lbl}: Name required`);
      if (!p.birthDate) { errs.push(`${lbl}: DOB required`); }
      else {
        const age = calculateAge(p.birthDate);
        if (age < 6)  errs.push(`${lbl}: Min age is 6`);
        if (age > 80) errs.push(`${lbl}: Max age is 80`);
      }
      if (!p.idProofUrl) errs.push(`${lbl}: ID proof required`);
    });
    if (!agreed) errs.push("Please agree to the terms");
    setErrors(errs);
    return errs.length === 0;
  };

  // ── Coupon handlers ───────────────────────────────────────────────────────

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
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

  // ── Book ──────────────────────────────────────────────────────────────────

  const handleBooking = async () => {
    if (!user) { router.push(`/login?redirect=/treks/${trekSlug}`); return; }
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
          amount: totalAmount, orderType: "trek",
          userId: user.uid, userEmail: user.email,
          userName: profile?.displayName ?? user.email ?? "Guest",
          trekId, trekName, trekSlug,
          couponCode: appliedCoupon?.code ?? null,
          couponDiscount,
          finalAmount: totalAmount,
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
        prefill: { name: profile?.displayName, email: user.email, contact: profile?.phone },
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

  const p = persons[activePerson];
  const age = p?.birthDate ? calculateAge(p.birthDate) : null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Desktop sidebar card ── */}
      <div className="hidden lg:block bg-white rounded-2xl border border-kokan-sand/30 shadow-sm overflow-hidden">
        <div className="p-5">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-bold text-kokan-earth">₹{pricePerPerson.toLocaleString("en-IN")}</span>
            <span className="text-sm text-kokan-earth/40">/ person</span>
          </div>
          <p className="text-xs text-kokan-earth/40 mb-4">Includes guide, equipment &amp; meals</p>

          {/* Person counter */}
          <div className="flex items-center justify-between bg-kokan-cream/50 rounded-xl px-4 py-3 mb-4">
            <div className="flex items-center gap-2 text-sm font-medium text-kokan-earth">
              <Users className="w-4 h-4 text-kokan-green" />
              {persons.length} {persons.length === 1 ? "Person" : "Persons"}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => persons.length > 1 && removePerson(persons.length - 1)}
                disabled={persons.length <= 1}
                className="w-7 h-7 rounded-lg bg-white border border-kokan-sand/50 flex items-center justify-center text-kokan-earth/60 hover:border-kokan-green/40 disabled:opacity-30 font-bold transition-all"
              >−</button>
              <span className="w-6 text-center text-sm font-bold text-kokan-earth">{persons.length}</span>
              <button
                onClick={addPerson}
                disabled={persons.length >= maxCapacity}
                className="w-7 h-7 rounded-lg bg-white border border-kokan-sand/50 flex items-center justify-center text-kokan-earth/60 hover:border-kokan-green/40 disabled:opacity-30 font-bold transition-all"
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
            {couponDiscount > 0 && (
              <div className="flex justify-between text-sm font-bold text-kokan-earth border-t border-kokan-sand/30 pt-1 mt-1">
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setOpen(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 bg-kokan-green text-white rounded-xl font-bold text-sm hover:bg-kokan-green/90 transition-colors shadow-lg shadow-kokan-green/20"
          >
            <CreditCard className="w-4 h-4" /> Book Now
          </button>
          <p className="text-center text-[11px] text-kokan-earth/30 mt-2">🔒 Secured by Razorpay</p>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-kokan-sand/30 px-4 py-3 flex items-center gap-3 shadow-2xl">
        <div className="flex-1">
          <p className="text-xs text-kokan-earth/40">Total for {persons.length} person{persons.length > 1 ? "s" : ""}</p>
          <p className="text-lg font-bold text-kokan-earth leading-tight">₹{totalAmount.toLocaleString("en-IN")}</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-kokan-green text-white rounded-xl font-bold text-sm shadow-lg shadow-kokan-green/20 hover:bg-kokan-green/90 transition-colors"
        >
          Book Now <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Booking drawer / modal ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !loading && setOpen(false)}
          />

          {/* Sheet */}
          <div className="relative w-full lg:max-w-lg bg-white lg:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] flex flex-col">

            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-kokan-sand/20 flex-shrink-0">
              <div>
                <h2 className="font-bold text-kokan-earth text-base">{trekName}</h2>
                <p className="text-xs text-kokan-earth/40 mt-0.5">
                  ₹{pricePerPerson.toLocaleString("en-IN")} × {persons.length} person{persons.length > 1 ? "s" : ""} = <span className="font-bold text-kokan-green">₹{totalAmount.toLocaleString("en-IN")}</span>
                </p>
              </div>
              <button
                onClick={() => !loading && setOpen(false)}
                className="w-8 h-8 rounded-full bg-kokan-cream/60 flex items-center justify-center hover:bg-kokan-cream transition-colors"
              >
                <X className="w-4 h-4 text-kokan-earth/60" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

              {/* ── Person tabs ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1.5 flex-1 overflow-x-auto scrollbar-hide">
                    {persons.map((person, i) => {
                      const done = person.name && person.birthDate && person.idProofUrl;
                      return (
                        <button
                          key={i}
                          onClick={() => setActivePerson(i)}
                          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            activePerson === i
                              ? "bg-kokan-green text-white border-kokan-green"
                              : "bg-white text-kokan-earth/50 border-kokan-sand/50 hover:border-kokan-green/30"
                          }`}
                        >
                          {done
                            ? <Check className="w-3 h-3" />
                            : <span className="w-3 h-3 rounded-full border border-current flex items-center justify-center text-[9px]">{i + 1}</span>
                          }
                          {person.name ? person.name.split(" ")[0] : `P${i + 1}`}
                          {persons.length > 1 && activePerson === i && (
                            <span
                              role="button"
                              onClick={(e) => { e.stopPropagation(); removePerson(i); }}
                              className="ml-0.5 opacity-70 hover:opacity-100"
                            >
                              <X className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {persons.length < maxCapacity && (
                    <button
                      onClick={addPerson}
                      className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-kokan-green border border-kokan-green/30 hover:bg-kokan-green/5 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  )}
                </div>

                {/* Active person form */}
                {p && (
                  <div className="bg-kokan-cream/30 rounded-xl p-4 space-y-4">

                    {/* Name + DOB */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-kokan-earth/40 uppercase tracking-widest mb-1">Full Name *</label>
                        <input
                          value={p.name}
                          onChange={(e) => update(activePerson, "name", e.target.value)}
                          placeholder="Rohan Sawant"
                          className="w-full border border-kokan-sand bg-white rounded-lg px-3 py-2 text-sm text-kokan-earth focus:outline-none focus:ring-2 focus:ring-kokan-green/30 placeholder:text-kokan-earth/25"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-kokan-earth/40 uppercase tracking-widest mb-1">Date of Birth *</label>
                        <input
                          type="date"
                          min={minDOB()} max={maxDOB()}
                          value={p.birthDate}
                          onChange={(e) => update(activePerson, "birthDate", e.target.value)}
                          className="w-full border border-kokan-sand bg-white rounded-lg px-3 py-2 text-sm text-kokan-earth focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                        />
                        {age !== null && p.birthDate && (
                          <p className="text-[10px] text-kokan-green font-semibold mt-1">Age: {age} yrs</p>
                        )}
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-[10px] font-bold text-kokan-earth/40 uppercase tracking-widest mb-1.5">Gender</label>
                      <Pills
                        options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }]}
                        value={p.gender}
                        onChange={(v) => update(activePerson, "gender", v)}
                      />
                    </div>

                    {/* Food */}
                    <div>
                      <label className="block text-[10px] font-bold text-kokan-earth/40 uppercase tracking-widest mb-1.5">Food</label>
                      <Pills
                        options={[{ value: "veg", label: "🥦 Veg" }, { value: "non-veg", label: "🍗 Non-Veg" }, { value: "vegan", label: "🌱 Vegan" }]}
                        value={p.foodPreference}
                        onChange={(v) => update(activePerson, "foodPreference", v)}
                      />
                    </div>

                    {/* Medical + ID side by side */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-kokan-earth/40 uppercase tracking-widest mb-1">Medical <span className="normal-case font-normal">(optional)</span></label>
                        <input
                          value={p.medicalConditions}
                          onChange={(e) => update(activePerson, "medicalConditions", e.target.value)}
                          placeholder="e.g. Asthma…"
                          className="w-full border border-kokan-sand bg-white rounded-lg px-3 py-2 text-sm text-kokan-earth focus:outline-none focus:ring-2 focus:ring-kokan-green/30 placeholder:text-kokan-earth/25"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-kokan-earth/40 uppercase tracking-widest mb-1">ID Proof *</label>
                        {p.idProofUrl ? (
                          <div className="flex items-center gap-1.5 bg-kokan-green/5 border border-kokan-green/20 rounded-lg px-3 py-2 h-[38px]">
                            <Check className="w-3.5 h-3.5 text-kokan-green flex-shrink-0" />
                            <span className="text-xs text-kokan-green font-semibold flex-1 truncate">Uploaded</span>
                            <button onClick={() => update(activePerson, "idProofUrl", "")} className="text-[10px] text-red-400 font-medium flex-shrink-0">✕</button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center gap-1.5 border-2 border-dashed border-kokan-sand rounded-lg cursor-pointer hover:border-kokan-green/40 hover:bg-white transition-colors h-[38px] px-2">
                            {p.idProofUploading
                              ? <><Loader2 className="w-3.5 h-3.5 animate-spin text-kokan-green" /><span className="text-[11px] text-kokan-earth/40">Uploading…</span></>
                              : <><Upload className="w-3.5 h-3.5 text-kokan-earth/30" /><span className="text-[11px] text-kokan-earth/40 font-medium">Upload ID</span></>
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

              {/* ── Terms ── */}
              <div className="border border-amber-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setDisclaimerOpen(!disclaimerOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">Terms &amp; Disclaimer</span>
                    {agreed && <span className="text-[10px] font-bold bg-kokan-green text-white px-2 py-0.5 rounded-full">Agreed ✓</span>}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-amber-500 transition-transform ${disclaimerOpen ? "rotate-180" : ""}`} />
                </button>

                {disclaimerOpen && (
                  <div className="bg-white">
                    <div className="px-4 pt-3 pb-2 space-y-3 max-h-40 overflow-y-auto">
                      {DISCLAIMER_SECTIONS.map((s, i) => (
                        <div key={i}>
                          <p className="text-xs font-bold text-kokan-earth mb-0.5">{i + 1}. {s.title}</p>
                          <p className="text-xs text-kokan-earth/55 leading-relaxed">{s.body}</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-amber-100 bg-amber-50/40">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <div
                          onClick={() => setAgreed((v) => !v)}
                          className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            agreed ? "bg-kokan-green border-kokan-green" : "bg-white border-kokan-sand"
                          }`}
                        >
                          {agreed && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs text-kokan-earth/70 leading-relaxed">
                          I agree to the cancellation policy, fitness requirements, code of conduct, and liability waiver.
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Coupon section ── */}
              <div className="border border-dashed border-kokan-sand/60 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-kokan-cream/30">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-kokan-green">
                    <Tag className="w-3.5 h-3.5" />
                    {appliedCoupon
                      ? <span>Applied: <span className="font-bold">{appliedCoupon.code}</span></span>
                      : "Have a coupon?"}
                  </div>
                  {appliedCoupon && (
                    <button onClick={removeCoupon}>
                      <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  )}
                </div>

                <div className="px-4 pb-4 pt-3 space-y-3">

                  {/* Admin-curated visible coupons */}
                  {!appliedCoupon && visibleCoupons.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {visibleCoupons.map((c) => (
                        <div key={c.code} className="p-2.5 bg-kokan-green/5 border border-kokan-green/15 rounded-xl">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold text-kokan-earth text-xs">{c.code}</span>
                            <button
                              onClick={() => { setCouponInput(c.code); setCouponError(""); }}
                              className="text-[10px] font-semibold text-kokan-green hover:underline"
                            >
                              Apply
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-500 leading-tight">{c.description}</p>
                          {c.minAmount > 0 && (
                            <p className="text-[9px] text-gray-400 mt-0.5">Min ₹{c.minAmount}</p>
                          )}
                          <CountdownBadge expiresAt={c.expiresAt} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <input
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 rounded-lg border border-kokan-sand bg-white text-sm text-kokan-earth font-mono uppercase focus:outline-none focus:ring-2 focus:ring-kokan-green/30 placeholder:normal-case placeholder:font-sans"
                      />
                      <button
                        onClick={applyCoupon} disabled={couponLoading}
                        className="px-4 py-2 bg-kokan-green text-white rounded-lg text-sm font-bold hover:bg-kokan-green/90 disabled:opacity-60 min-w-[70px]"
                      >
                        {couponLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Apply"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2.5 bg-kokan-green/10 rounded-xl">
                      <Check className="w-4 h-4 text-kokan-green flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-kokan-green">
                          {appliedCoupon.code} — saving ₹{couponDiscount.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[10px] text-gray-500">{appliedCoupon.description}</p>
                      </div>
                    </div>
                  )}

                  {couponError && <p className="text-xs text-red-500 font-medium">{couponError}</p>}
                </div>
              </div>

              {/* ── Price breakdown ── */}
              <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1.5">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹{pricePerPerson.toLocaleString("en-IN")} × {persons.length} person{persons.length > 1 ? "s" : ""}</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-xs text-kokan-green font-semibold">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>− ₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-kokan-earth pt-1 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* ── Errors ── */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-1">
                  {errors.map((e, i) => (
                    <p key={i} className="text-xs text-red-600 flex items-start gap-1.5">
                      <span className="flex-shrink-0">•</span> {e}
                    </p>
                  ))}
                </div>
              )}

            </div>

            {/* ── Sheet footer ── */}
            <div className="px-5 py-4 border-t border-kokan-sand/20 flex-shrink-0 bg-white">
              {!agreed && (
                <p className="text-center text-[11px] text-amber-600 mb-3">
                  Open Terms above and tick the checkbox to continue
                </p>
              )}
              <button
                onClick={handleBooking}
                disabled={loading || !agreed}
                className="w-full flex items-center justify-center gap-2 py-4 bg-kokan-green text-white rounded-xl font-bold text-sm hover:bg-kokan-green/90 active:bg-kokan-green/80 transition-colors disabled:opacity-50 shadow-lg shadow-kokan-green/20"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                  : <><CreditCard className="w-4 h-4" /> Pay ₹{totalAmount.toLocaleString("en-IN")}</>
                }
              </button>
              <p className="text-center text-[11px] text-kokan-earth/30 mt-2">🔒 Secured by Razorpay</p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}