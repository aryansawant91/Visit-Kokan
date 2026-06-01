"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Waves, ArrowLeft, Mail, CheckCircle } from "lucide-react";

type State = "idle" | "loading" | "success" | "error";

interface FPState { attempts: number; windowStart: number; blockedUntil: number }

const FP_RL_KEY = "vk_fp_rl";

function getFPState(): FPState {
  try { const r = localStorage.getItem(FP_RL_KEY); if (r) return JSON.parse(r); } catch {}
  return { attempts: 0, windowStart: Date.now(), blockedUntil: 0 };
}
function saveFPState(s: FPState) { localStorage.setItem(FP_RL_KEY, JSON.stringify(s)); }

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [email,         setEmail]         = useState("");
  const [state,         setState]         = useState<State>("idle");
  const [error,         setError]         = useState("");
  const [attemptCount,  setAttemptCount]  = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Check rate limit
    const fp  = getFPState();
    const now = Date.now();

    if (fp.blockedUntil > now) {
      const wait = Math.ceil((fp.blockedUntil - now) / 1000);
      const m    = Math.floor(wait / 60), s = wait % 60;
      setError(`Too many attempts. Try again in ${m > 0 ? `${m}m ` : ""}${s}s.`);
      return;
    }

    // Reset window after 15 min
    const inWindow = now - fp.windowStart < 15 * 60 * 1000;
    const attempts = inWindow ? fp.attempts : 0;

    if (attempts >= 3) {
      saveFPState({ attempts, windowStart: inWindow ? fp.windowStart : now, blockedUntil: now + 15 * 60 * 1000 });
      setError("Too many attempts. Please wait 15 minutes before trying again.");
      return;
    }

    // Increment before sending
    saveFPState({
      attempts:    attempts + 1,
      windowStart: inWindow ? fp.windowStart : now,
      blockedUntil: 0,
    });
    setAttemptCount(attempts + 1);

    setState("loading");
    try {
      await sendPasswordReset(email.trim());
      setState("success");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/user-not-found" || code === "auth/invalid-email") {
        setState("success"); // don't reveal if email exists
      } else {
        setError("Something went wrong. Please try again.");
        setState("error");
      }
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-kokan-green/85 via-kokan-green/65 to-kokan-earth/70" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-playfair text-2xl font-bold text-white">Visit Kokan</span>
          </Link>

          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full">
              <Waves className="w-4 h-4 text-white" />
              <span className="text-white/90 text-sm font-medium">We've got you covered</span>
            </div>
            <h2 className="font-playfair text-4xl font-bold text-white leading-tight">
              Happens to<br />
              <span className="text-kokan-sand">everyone.</span>
            </h2>
            <p className="text-white/65 text-sm leading-relaxed max-w-xs">
              Just enter your registered email and we'll send you a secure link
              to reset your password. Takes less than a minute.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { step: "1", text: "Enter your email address below" },
                { step: "2", text: "Check your inbox for the reset link" },
                { step: "3", text: "Set a new password and sign back in" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-kokan-sand/30 border border-kokan-sand/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-kokan-sand text-xs font-bold">{item.step}</span>
                  </div>
                  <span className="text-white/70 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-sm text-white/60 leading-relaxed">
            💡 <span className="text-white/80 font-medium">Tip:</span> Check
            your spam folder if you don't see the email within a few minutes.
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-kokan-cream/30 px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="font-playfair text-xl font-bold text-kokan-earth">Visit Kokan</span>
            </Link>
          </div>

          {state === "success" ? (
            /* Success state */
            <div className="text-center space-y-5">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-kokan-green/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-kokan-green" />
                </div>
              </div>
              <div>
                <h1 className="font-playfair text-2xl font-bold text-kokan-earth mb-2">
                  Check your inbox
                </h1>
                <p className="text-kokan-earth/50 text-sm leading-relaxed">
                  If <span className="text-kokan-earth font-medium">{email}</span> is
                  registered with us, you'll receive a password reset link shortly.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 text-left leading-relaxed">
                📬 Don't see it? Check your spam or junk folder. The link expires in 1 hour.
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => { setState("idle"); setEmail(""); setAttemptCount(0); }}
                  className="w-full border border-kokan-sand text-kokan-earth/60 py-2.5 rounded-xl text-sm hover:bg-kokan-sand/10 transition-colors"
                >
                  Try a different email
                </button>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full bg-kokan-green text-white py-2.5 rounded-xl text-sm font-medium hover:bg-kokan-green/90 transition-colors"
                >
                  Back to sign in
                </Link>
              </div>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="mb-8">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-kokan-earth/40 hover:text-kokan-earth/70 transition-colors mb-6"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to sign in
                </Link>

                <h1 className="font-playfair text-3xl font-bold text-kokan-earth mb-1">
                  Forgot password?
                </h1>
                <p className="text-kokan-earth/50 text-sm">
                  No worries — we'll send you a reset link.
                </p>
              </div>

              {state === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
                  <span>⚠</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-kokan-earth/30" />
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full border border-kokan-sand rounded-xl pl-10 pr-4 py-3 text-sm text-kokan-earth bg-white focus:outline-none focus:ring-2 focus:ring-kokan-green/30 focus:border-kokan-green/50 transition-all placeholder:text-kokan-earth/30"
                    />
                  </div>
                </div>

                {/* Attempts remaining indicator */}
                {attemptCount > 0 && attemptCount < 3 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700 flex items-center gap-2">
                    ⚠ {3 - attemptCount} attempt{3 - attemptCount !== 1 ? "s" : ""} remaining before 15 min cooldown
                  </div>
                )}

                <button
                  type="submit"
                  disabled={state === "loading" || !email.trim()}
                  className="w-full bg-kokan-green text-white py-3 rounded-xl font-semibold text-sm hover:bg-kokan-green/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm shadow-kokan-green/30"
                >
                  {state === "loading" ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : "Send reset link"}
                </button>
              </form>

              <p className="text-center text-sm text-kokan-earth/40 mt-6">
                Remember your password?{" "}
                <Link href="/login" className="text-kokan-green font-medium hover:text-kokan-green/70 transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}