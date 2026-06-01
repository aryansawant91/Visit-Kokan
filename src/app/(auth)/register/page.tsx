"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AuthError } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Waves, MapPin, Star, Mail, RefreshCw } from "lucide-react";

type Tab = "user" | "vendor";

function getPasswordStrength(pw: string): { level: string; label: string; color: string } {
  if (!pw) return { level: "", label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: "w-1/4", label: "Weak",   color: "bg-red-400" };
  if (score === 2) return { level: "w-2/4", label: "Fair",   color: "bg-yellow-400" };
  if (score === 3) return { level: "w-3/4", label: "Good",   color: "bg-kokan-green" };
  return             { level: "w-full", label: "Strong", color: "bg-emerald-500" };
}

/* ── Countdown helper ── */
function Countdown({ seconds, onEnd }: { seconds: number; onEnd: () => void }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    setLeft(seconds);
  }, [seconds]);
  useEffect(() => {
    if (left <= 0) { onEnd(); return; }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, onEnd]);
  return <span className="font-semibold text-kokan-earth/70">{left}s</span>;
}

/* ── OTP Input ── */
function OTPInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const digits = value.replace(/\D/g, "").slice(0, 6).split("");
  while (digits.length < 6) digits.push("");

  const refs = Array.from({ length: 6 }, () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useState<HTMLInputElement | null>(null)
  );
  const inputRefs = refs.map(([el]) => el);
  const setRefs   = refs.map(([, set]) => set);

  function handleChange(i: number, char: string) {
    const d = char.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = d;
    onChange(next.join(""));
    if (d && i < 5) (inputRefs[i + 1] as HTMLInputElement | null)?.focus();
  }

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0)
      (inputRefs[i - 1] as HTMLInputElement | null)?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    (inputRefs[focusIdx] as HTMLInputElement | null)?.focus();
    e.preventDefault();
  }

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => setRefs[i](el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className="w-11 h-13 text-center text-lg font-bold border-2 rounded-xl focus:outline-none focus:border-kokan-green transition-colors border-kokan-sand text-kokan-earth bg-white"
        />
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const { signUpWithEmail, signUpVendor } = useAuth();

  /* ── Form state ── */
  const [tab,             setTab]             = useState<Tab>("user");
  const [displayName,     setDisplayName]     = useState("");
  const [email,           setEmail]           = useState("");
  const [phone,           setPhone]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirm,         setConfirm]         = useState("");
  const [businessName,    setBusinessName]    = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [gstNumber,       setGstNumber]       = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [error,           setError]           = useState("");
  const [loading,         setLoading]         = useState(false);

  /* ── OTP state ── */
  const [regStep,         setRegStep]         = useState<"form" | "verify">("form");
  const [regOtp,          setRegOtp]          = useState("");
  const [regOtpSending,   setRegOtpSending]   = useState(false);
  const [regOtpVerifying, setRegOtpVerifying] = useState(false);
  const [resendCooldown,  setResendCooldown]  = useState(0);
  const [regError,        setRegError]        = useState("");

  const strength = getPasswordStrength(password);

  /* ── Step 1: validate form → send OTP ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm)                     { setError("Passwords do not match."); return; }
    if (password.length < 8)                      { setError("Password must be at least 8 characters."); return; }
    if (tab === "vendor" && !businessName.trim()) { setError("Business name is required."); return; }

    setRegOtpSending(true);
    try {
      const res  = await fetch("/api/auth/send-otp", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), purpose: "register" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to send OTP"); return; }
      setRegStep("verify");
      setResendCooldown(60);
    } catch {
      setError("Failed to send verification code.");
    } finally {
      setRegOtpSending(false);
    }
  }

  /* ── Step 2: verify OTP → create account ── */
  async function handleVerifyAndCreate() {
    if (regOtp.replace(/\D/g, "").length < 6) { setRegError("Enter all 6 digits."); return; }
    setRegError("");
    setRegOtpVerifying(true);
    try {
      const verifyRes = await fetch("/api/auth/verify-otp", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), otp: regOtp.trim(), purpose: "register" }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) { setRegError(verifyData.error ?? "Invalid OTP"); return; }

      if (tab === "vendor") {
        await signUpVendor({
          email, password,
          displayName:     displayName.trim(),
          phone,
          businessName:    businessName.trim(),
          businessAddress: businessAddress.trim(),
          gstNumber:       gstNumber.trim(),
        });
      } else {
        await signUpWithEmail({ email, password, displayName: displayName.trim(), phone });
      }
    } catch (err) {
      const code = (err as AuthError).code;
      if (code === "auth/email-already-in-use") setRegError("This email is already registered.");
      else setRegError("Registration failed. Please try again.");
    } finally {
      setRegOtpVerifying(false);
    }
  }

  /* ── OTP verification screen ── */
  if (regStep === "verify") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kokan-cream/30 px-5 py-10">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="font-playfair text-xl font-bold text-kokan-earth">Visit Kokan</span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-kokan-sand/30 shadow-sm p-7 space-y-5">

            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-kokan-green/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-kokan-green" />
              </div>
            </div>

            <div className="text-center">
              <h1 className="font-playfair text-2xl font-bold text-kokan-earth mb-1">
                Verify your email
              </h1>
              <p className="text-kokan-earth/50 text-sm">
                We sent a 6-digit code to<br />
                <span className="font-semibold text-kokan-earth">{email}</span>
              </p>
            </div>

            {/* OTP input */}
            <OTPInput value={regOtp} onChange={setRegOtp} />

            {/* Error */}
            {regError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-xs flex items-center gap-2">
                <span>⚠</span> {regError}
              </div>
            )}

            {/* Verify button */}
            <button
              onClick={handleVerifyAndCreate}
              disabled={regOtpVerifying || regOtp.replace(/\D/g, "").length < 6}
              className="w-full bg-kokan-green text-white py-3.5 rounded-xl font-bold text-sm hover:bg-kokan-green/90 disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm shadow-kokan-green/20"
            >
              {regOtpVerifying
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : "Verify & Create Account"}
            </button>

            {/* Resend */}
            <div className="text-center text-sm text-kokan-earth/50">
              Didn't receive it?{" "}
              {resendCooldown > 0 ? (
                <span className="inline-flex items-center gap-1">
                  Resend in <Countdown seconds={resendCooldown} onEnd={() => setResendCooldown(0)} />
                </span>
              ) : (
                <button
                  onClick={async () => {
                    setRegOtp("");
                    setRegError("");
                    await fetch("/api/auth/send-otp", {
                      method:  "POST",
                      headers: { "Content-Type": "application/json" },
                      body:    JSON.stringify({ email: email.trim(), purpose: "register" }),
                    });
                    setResendCooldown(60);
                  }}
                  className="text-kokan-green font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Resend code
                </button>
              )}
            </div>

            {/* Back */}
            <button
              onClick={() => { setRegStep("form"); setRegOtp(""); setRegError(""); }}
              className="w-full text-xs text-kokan-earth/40 hover:text-kokan-earth/70 transition-colors"
            >
              ← Change email or details
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Registration form ── */
  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-kokan-green">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-kokan-green/85 via-kokan-green/65 to-kokan-earth/70" />

        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-playfair text-xl font-bold text-white">Visit Kokan</span>
          </Link>

          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Waves className="w-3.5 h-3.5 text-white" />
              <span className="text-white/90 text-xs font-medium">Join 5,000+ Travellers</span>
            </div>
            <h2 className="font-playfair text-3xl xl:text-4xl font-bold text-white leading-tight">
              Your Kokan<br />
              <span className="text-kokan-sand">Adventure Starts Here</span>
            </h2>
            <p className="text-white/65 text-sm leading-relaxed max-w-xs">
              Create your free account and unlock exclusive homestay deals, trek bookings, and authentic local products.
            </p>

            {[
              { icon: "🏡", text: "Book verified homestays & hotels" },
              { icon: "🥭", text: "Order authentic Kokan products" },
              { icon: "🧭", text: "Plan custom treks & activities" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-white/75 text-sm">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-white/80 text-xs leading-relaxed italic">
              "Signed up in 30 seconds, booked a trek to Harishchandragad the same day. Incredible platform!"
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-6 h-6 rounded-full bg-kokan-sand flex items-center justify-center text-xs font-bold text-kokan-earth">A</div>
              <div>
                <p className="text-white text-xs font-medium">Amit Kulkarni</p>
                <p className="text-white/40 text-xs flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" /> Pune
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-7/12 flex items-center justify-center bg-kokan-cream/30 px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <span className="font-playfair text-lg font-bold text-kokan-earth">Visit Kokan</span>
            </Link>
          </div>

          <h1 className="font-playfair text-2xl font-bold text-kokan-earth mb-1">Create your account</h1>
          <p className="text-kokan-earth/50 text-sm mb-6">Join the Kokan coastal community</p>

          {/* Role toggle */}
          <div className="flex bg-kokan-sand/20 rounded-xl p-1 mb-5 gap-1">
            <button
              type="button"
              onClick={() => setTab("user")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === "user" ? "bg-white text-kokan-green shadow-sm" : "text-kokan-earth/50 hover:text-kokan-earth"
              }`}
            >
              🧳 Traveller
            </button>
            <button
              type="button"
              onClick={() => setTab("vendor")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === "vendor" ? "bg-white text-kokan-green shadow-sm" : "text-kokan-earth/50 hover:text-kokan-earth"
              }`}
            >
              🏪 Vendor
            </button>
          </div>

          {tab === "vendor" && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-xs mb-4 leading-relaxed">
              ⏳ Vendor accounts need admin approval before accessing the dashboard.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4 flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>

            {/* Full name */}
            <div>
              <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Full name</label>
              <input
                type="text" autoComplete="name" required
                value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Rohan Sawant"
                className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm text-kokan-earth bg-white focus:outline-none focus:ring-2 focus:ring-kokan-green/30 placeholder:text-kokan-earth/30"
              />
            </div>

            {/* Vendor fields */}
            {tab === "vendor" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Business name</label>
                  <input
                    type="text" required
                    value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Kokan Stays & Spices"
                    className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm text-kokan-earth bg-white focus:outline-none focus:ring-2 focus:ring-kokan-green/30 placeholder:text-kokan-earth/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Business address</label>
                  <input
                    type="text" required
                    value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="Ratnagiri, Maharashtra"
                    className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm text-kokan-earth bg-white focus:outline-none focus:ring-2 focus:ring-kokan-green/30 placeholder:text-kokan-earth/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">
                    GST number <span className="text-kokan-earth/30 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={gstNumber} onChange={(e) => setGstNumber(e.target.value)}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm text-kokan-earth bg-white focus:outline-none focus:ring-2 focus:ring-kokan-green/30 placeholder:text-kokan-earth/30"
                  />
                </div>
              </>
            )}

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Email</label>
                <input
                  type="email" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-kokan-sand rounded-xl px-3 py-2.5 text-sm text-kokan-earth bg-white focus:outline-none focus:ring-2 focus:ring-kokan-green/30 placeholder:text-kokan-earth/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">
                  Phone <span className="text-kokan-earth/30">(opt)</span>
                </label>
                <input
                  type="tel" autoComplete="tel"
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765..."
                  className="w-full border border-kokan-sand rounded-xl px-3 py-2.5 text-sm text-kokan-earth bg-white focus:outline-none focus:ring-2 focus:ring-kokan-green/30 placeholder:text-kokan-earth/30"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} autoComplete="new-password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 pr-10 text-sm text-kokan-earth bg-white focus:outline-none focus:ring-2 focus:ring-kokan-green/30 placeholder:text-kokan-earth/30"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-kokan-earth/30 hover:text-kokan-earth/60">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1 bg-kokan-sand/30 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.level} ${strength.color}`} />
                  </div>
                  <span className="text-xs text-kokan-earth/40">{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"} autoComplete="new-password" required
                  value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className={`w-full border rounded-xl px-4 py-2.5 pr-10 text-sm text-kokan-earth bg-white focus:outline-none focus:ring-2 placeholder:text-kokan-earth/30 ${
                    confirm && confirm !== password
                      ? "border-red-300 focus:ring-red-200"
                      : "border-kokan-sand focus:ring-kokan-green/30"
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-kokan-earth/30 hover:text-kokan-earth/60">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirm && confirm !== password && (
                <p className="text-xs text-red-400 mt-1">Passwords don't match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || regOtpSending}
              className="w-full bg-kokan-green text-white py-3 rounded-xl font-semibold text-sm hover:bg-kokan-green/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm shadow-kokan-green/30 mt-1"
            >
              {regOtpSending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : "Continue"}
            </button>
          </form>

          <p className="text-center text-sm text-kokan-earth/50 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-kokan-green font-medium hover:text-kokan-green/70 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}