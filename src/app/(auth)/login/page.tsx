"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthError } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import {
  Eye, EyeOff, Waves, Star, MapPin,
  Mail, KeyRound, ArrowRight, RefreshCw,
} from "lucide-react";

// ─── Rate limit helpers (localStorage) ───────────────────────────────────────
const RL_KEY = "vk_login_otp_rl";
interface RLState { attempts: number; windowStart: number; blockedUntil: number }

function getRLState(): RLState {
  try {
    const raw = localStorage.getItem(RL_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { attempts: 0, windowStart: Date.now(), blockedUntil: 0 };
}

function saveRLState(state: RLState) {
  localStorage.setItem(RL_KEY, JSON.stringify(state));
}

function checkRateLimit(): { allowed: boolean; waitSeconds: number } {
  const state = getRLState();
  const now   = Date.now();

  if (state.blockedUntil > now) {
    return { allowed: false, waitSeconds: Math.ceil((state.blockedUntil - now) / 1000) };
  }

  // Reset window after 15 min
  if (now - state.windowStart > 15 * 60 * 1000) {
    saveRLState({ attempts: 0, windowStart: now, blockedUntil: 0 });
    return { allowed: true, waitSeconds: 0 };
  }

  if (state.attempts >= 3) {
    const blocked = { ...state, blockedUntil: now + 15 * 60 * 1000 };
    saveRLState(blocked);
    return { allowed: false, waitSeconds: 15 * 60 };
  }

  return { allowed: true, waitSeconds: 0 };
}

function incrementAttempts() {
  const state = getRLState();
  saveRLState({ ...state, attempts: state.attempts + 1 });
}

// ─── OTP input component ──────────────────────────────────────────────────────
function OTPInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits  = value.padEnd(6, "").split("").slice(0, 6);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const next = digits.map((d, idx) => idx === i ? "" : d).join("").trim();
      onChange(next.padEnd(i === 0 ? 0 : i, next).slice(0, i === 0 ? 0 : i) + next.slice(i));
      // simpler: just remove last char
      if (digits[i] === "" && i > 0) inputs.current[i - 1]?.focus();
      const arr = [...digits]; arr[i] = ""; onChange(arr.join(""));
      if (i > 0) inputs.current[i - 1]?.focus();
    }
  };

  const handleChange = (i: number, val: string) => {
    const char = val.replace(/\D/g, "").slice(-1);
    const arr  = [...digits]; arr[i] = char;
    onChange(arr.join(""));
    if (char && i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 bg-white text-kokan-earth focus:outline-none transition-all ${
            d
              ? "border-kokan-green bg-kokan-green/5 text-kokan-green"
              : "border-kokan-sand/60 focus:border-kokan-green"
          }`}
          style={{ height: "52px" }}
        />
      ))}
    </div>
  );
}

// ─── Countdown timer ──────────────────────────────────────────────────────────
function Countdown({ seconds, onEnd }: { seconds: number; onEnd: () => void }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    setLeft(seconds);
    if (seconds <= 0) return;
    const id = setInterval(() => {
      setLeft((p) => { if (p <= 1) { clearInterval(id); onEnd(); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(id);
  }, [seconds]); // eslint-disable-line
  if (left <= 0) return null;
  const m = Math.floor(left / 60), s = left % 60;
  return <span className="text-kokan-earth/50">{m > 0 ? `${m}m ` : ""}{s}s</span>;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
type LoginTab = "password" | "otp";
type OTPStep  = "email" | "verify";

export default function LoginPage() {
  const { signInWithEmail, signInWithGoogle, loading: authLoading, profile } = useAuth();
  const router = useRouter();

  const [tab, setTab]               = useState<LoginTab>("password");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  // OTP flow
  const [otpStep, setOtpStep]       = useState<OTPStep>("email");
  const [otp, setOtp]               = useState("");
  const [otpSent, setOtpSent]       = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpVerifying, setOtpVerifying]     = useState(false);

  // Google
  const [googleLoading, setGoogleLoading] = useState(false);

  if (!authLoading && profile) return null;

  // ── Password login ─────────────────────────────────────────────────────────
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      const code = (err as AuthError).code;
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later or use OTP login.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Send OTP ───────────────────────────────────────────────────────────────
  const handleSendOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");

    const rl = checkRateLimit();
    if (!rl.allowed) {
      const m = Math.floor(rl.waitSeconds / 60);
      const s = rl.waitSeconds % 60;
      setError(`Too many attempts. Try again in ${m > 0 ? `${m}m ` : ""}${s}s.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), purpose: "login" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to send OTP"); return; }

      incrementAttempts();
      setOtpSent(true);
      setOtpStep("verify");
      setResendCooldown(60);
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP & login ─────────────────────────────────────────────────────
  const handleVerifyOTP = async () => {
    if (otp.replace(/\D/g, "").length < 6) {
      setError("Enter all 6 digits.");
      return;
    }
    setError("");
    setOtpVerifying(true);
    try {
      // 1. Verify OTP
      const verifyRes = await fetch("/api/auth/verify-otp", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), otp: otp.trim(), purpose: "login" }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) { setError(verifyData.error ?? "Invalid OTP"); return; }

      // 2. Get password from custom claim / use a magic-login approach
      //    Since Firebase doesn't support passwordless email OTP natively,
      //    we use our admin API to sign the user in via custom token
      const tokenRes = await fetch("/api/auth/custom-token", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim() }),
      });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) { setError("Login failed after verification."); return; }

      // 3. Sign in with custom token
      const { signInWithCustomToken } = await import("firebase/auth");
      const { auth }                  = await import("@/lib/firebase");
      await signInWithCustomToken(auth, tokenData.token);

      // AuthContext onAuthStateChanged will handle redirect
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  // ── Google ─────────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ──────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-kokan-green/80 via-kokan-green/60 to-kokan-earth/70" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-playfair text-2xl font-bold text-white">Visit Kokan</span>
          </Link>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full">
              <Waves className="w-4 h-4 text-white" />
              <span className="text-white/90 text-sm font-medium">The Konkan Coast Awaits</span>
            </div>
            <h2 className="font-playfair text-4xl xl:text-5xl font-bold text-white leading-tight">
              Pristine Beaches,<br />
              <span className="text-kokan-sand">Timeless Villages</span>
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              Discover hidden gems along 720km of India's most beautiful coastline.
            </p>
            <div className="flex gap-6 pt-2">
              {[{ value: "120+", label: "Destinations" }, { value: "4.8★", label: "Avg Rating" }, { value: "5k+", label: "Travellers" }].map((s) => (
                <div key={s.label}>
                  <p className="text-white font-bold text-xl">{s.value}</p>
                  <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-white/85 text-sm leading-relaxed italic">
              "Visit Kokan showed me places I never knew existed. The Malvan homestay was unforgettable."
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-7 h-7 rounded-full bg-kokan-sand flex items-center justify-center text-xs font-bold text-kokan-earth">P</div>
              <div>
                <p className="text-white text-xs font-medium">Priya Desai</p>
                <p className="text-white/40 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> Mumbai</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-kokan-cream/30 px-5 py-10 overflow-y-auto">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="font-playfair text-xl font-bold text-kokan-earth">Visit Kokan</span>
            </Link>
          </div>

          <h1 className="font-playfair text-3xl font-bold text-kokan-earth mb-1">Welcome back</h1>
          <p className="text-kokan-earth/50 text-sm mb-6">Sign in to continue your journey</p>

          {/* ── Tab switcher ── */}
          <div className="flex bg-kokan-sand/20 rounded-xl p-1 mb-6 gap-1">
            <button
              onClick={() => { setTab("password"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === "password" ? "bg-white text-kokan-green shadow-sm" : "text-kokan-earth/50 hover:text-kokan-earth"
              }`}
            >
              <KeyRound size={14} /> Password
            </button>
            <button
              onClick={() => { setTab("otp"); setError(""); setOtpStep("email"); setOtp(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === "otp" ? "bg-white text-kokan-green shadow-sm" : "text-kokan-earth/50 hover:text-kokan-earth"
              }`}
            >
              <Mail size={14} /> OTP
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          {/* ── PASSWORD TAB ── */}
          {tab === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-semibold text-kokan-earth/60 mb-1.5 uppercase tracking-wide">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-kokan-earth/30" />
                  <input
                    type="email" autoComplete="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-kokan-sand rounded-xl pl-10 pr-4 py-3 text-sm text-kokan-earth bg-white focus:outline-none focus:ring-2 focus:ring-kokan-green/30 placeholder:text-kokan-earth/30"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-kokan-earth/60 uppercase tracking-wide">Password</label>
                  <Link href="/forgot-password" className="text-xs text-kokan-green hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-kokan-earth/30" />
                  <input
                    type={showPassword ? "text" : "password"} autoComplete="current-password" required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-kokan-sand rounded-xl pl-10 pr-11 py-3 text-sm text-kokan-earth bg-white focus:outline-none focus:ring-2 focus:ring-kokan-green/30 placeholder:text-kokan-earth/30"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-kokan-earth/30 hover:text-kokan-earth/60">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-kokan-green text-white py-3 rounded-xl font-bold text-sm hover:bg-kokan-green/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm shadow-kokan-green/20 mt-1"
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><span>Sign in</span> <ArrowRight size={15} /></>}
              </button>
            </form>
          )}

          {/* ── OTP TAB ── */}
          {tab === "otp" && (
            <>
              {otpStep === "email" && (
                <form onSubmit={handleSendOTP} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-xs font-semibold text-kokan-earth/60 mb-1.5 uppercase tracking-wide">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-kokan-earth/30" />
                      <input
                        type="email" required
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full border border-kokan-sand rounded-xl pl-10 pr-4 py-3 text-sm text-kokan-earth bg-white focus:outline-none focus:ring-2 focus:ring-kokan-green/30 placeholder:text-kokan-earth/30"
                      />
                    </div>
                  </div>
                  <button
                    type="submit" disabled={loading || !email.trim()}
                    className="w-full bg-kokan-green text-white py-3 rounded-xl font-bold text-sm hover:bg-kokan-green/90 disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm shadow-kokan-green/20"
                  >
                    {loading
                      ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <><Mail size={15} /> Send OTP</>}
                  </button>
                </form>
              )}

              {otpStep === "verify" && (
                <div className="space-y-5">
                  {/* Email shown */}
                  <div className="flex items-center gap-2 bg-kokan-green/5 border border-kokan-green/20 rounded-xl px-4 py-3">
                    <Mail size={14} className="text-kokan-green flex-shrink-0" />
                    <span className="text-sm text-kokan-earth font-medium truncate">{email}</span>
                    <button
                      onClick={() => { setOtpStep("email"); setOtp(""); setError(""); }}
                      className="ml-auto text-xs text-kokan-green hover:underline flex-shrink-0"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <p className="text-sm text-kokan-earth/60 text-center mb-4">
                      Enter the 6-digit code sent to your email
                    </p>
                    <OTPInput value={otp} onChange={setOtp} />
                  </div>

                  <button
                    onClick={handleVerifyOTP}
                    disabled={otpVerifying || otp.replace(/\D/g, "").length < 6}
                    className="w-full bg-kokan-green text-white py-3 rounded-xl font-bold text-sm hover:bg-kokan-green/90 disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm shadow-kokan-green/20"
                  >
                    {otpVerifying
                      ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <><KeyRound size={15} /> Verify & Sign in</>}
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
                        onClick={() => { setOtp(""); handleSendOTP(); }}
                        className="text-kokan-green font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <RefreshCw size={12} /> Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-kokan-sand/50" />
            <span className="text-xs text-kokan-earth/30 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-kokan-sand/50" />
          </div>

          {/* ── Google button ── */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border-2 border-kokan-sand bg-white text-kokan-earth py-3 rounded-xl font-semibold text-sm hover:bg-kokan-sand/10 hover:border-kokan-earth/30 transition-all disabled:opacity-60"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-kokan-earth/30 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Guest link */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full border border-kokan-sand/60 rounded-xl py-3 text-sm text-kokan-earth/50 hover:bg-kokan-sand/10 transition-colors mt-3"
          >
            <Waves className="w-4 h-4" /> Continue as guest
          </Link>

          <p className="text-center text-sm text-kokan-earth/50 mt-5">
            Don't have an account?{" "}
            <Link href="/register" className="text-kokan-green font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}