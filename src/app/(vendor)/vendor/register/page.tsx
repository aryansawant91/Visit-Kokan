"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export default function VendorRegisterPage() {
  const { user, profile, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile?.role === "vendor") router.replace("/vendor/dashboard");
    if (profile?.role === "admin") router.replace("/admin/dashboard");
  }, [profile, router]);

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle({ asVendor: true });
    } catch (err: any) {
      console.error("Google vendor sign in error:", err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100/70 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-xs">
            🏡
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-kokan-green/10 text-kokan-green font-bold text-xs rounded-full mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Official Host & Vendor Partner Network
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-kokan-earth mb-2">
            Host Your Homestay & Business on Visit Kokan
          </h1>
          <p className="text-kokan-earth/60 text-sm max-w-md mx-auto">
            Connect directly with verified families and travellers visiting Sindhudurg, Ratnagiri, and Raigad.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm flex items-center gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Benefits Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-kokan-sand/30 shadow-xs space-y-4">
          <h2 className="font-display font-bold text-base sm:text-lg text-kokan-earth">
            Why Host or Sell with Visit Kokan?
          </h2>
          <div className="space-y-3">
            {[
              {
                title: "0% Commission (First 3 Months)",
                desc: "Keep 100% of your earnings while you establish your property on Visit Kokan.",
              },
              {
                title: "Reach 5,000+ Travellers Every Month",
                desc: "High-intent tourists actively searching for authentic stays, cottages, and regional delicacies.",
              },
              {
                title: "Dedicated Host & Vendor Dashboard",
                desc: "Easily update room availability, photo galleries, nightly rates, and booking requests.",
              },
              {
                title: "100% Verified Guests",
                desc: "Safe, respectful families and trekking groups verified with OTP and identity confirmation.",
              },
              {
                title: "Local Kokan Concierge Support",
                desc: "Our team helps you create an attractive profile and assists with traveler communications.",
              },
            ].map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-kokan-green flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-kokan-earth">{benefit.title}</h3>
                  <p className="text-xs text-kokan-earth/60 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        {user ? (
          <div className="bg-white rounded-3xl p-6 border border-kokan-sand/30 text-center space-y-3 shadow-xs">
            <p className="text-sm text-kokan-earth/70">
              You&apos;re currently signed in as{" "}
              <span className="font-bold text-kokan-earth">{profile?.email || user.email}</span>
            </p>
            {profile?.role === "vendor" ? (
              <Link
                href="/vendor/dashboard"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-kokan-green text-white rounded-full font-bold text-sm hover:bg-emerald-800 transition-all shadow-xs"
              >
                Go to Vendor Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <p className="text-xs text-kokan-earth/50">
                  You are signed in as a traveler. Click below to upgrade to a Host / Vendor account with Google or register your business details.
                </p>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border-2 border-kokan-sand/80 rounded-full font-bold text-sm text-kokan-earth hover:bg-gray-50 hover:border-kokan-earth/40 transition-all shadow-2xs active:scale-95 disabled:opacity-60"
                >
                  {googleLoading ? (
                    <div className="w-5 h-5 border-2 border-kokan-green border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 18 18">
                        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                        <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/>
                      </svg>
                      <span>Upgrade to Vendor with Google</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Direct Google Sign In for Vendors */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border-2 border-kokan-sand/80 rounded-full font-bold text-sm text-kokan-earth hover:bg-gray-50 hover:border-kokan-earth/40 transition-all shadow-2xs active:scale-95 disabled:opacity-60"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-kokan-green border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/>
                  </svg>
                  <span>Sign in with Google (Host / Vendor)</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-kokan-sand/50" />
              <span className="text-xs text-kokan-earth/40 font-medium">or register with email</span>
              <div className="flex-1 h-px bg-kokan-sand/50" />
            </div>

            <Link
              href="/register?tab=vendor"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-kokan-green text-white rounded-full font-bold text-sm hover:bg-emerald-800 transition-all shadow-xs active:scale-95 text-center"
            >
              <span>Register with Email & Phone</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login?redirect=/vendor/dashboard"
              className="flex items-center justify-center py-3 bg-white border border-kokan-sand/60 rounded-full text-xs sm:text-sm font-bold text-kokan-earth hover:bg-gray-50 transition-all text-center"
            >
              Already Registered? Sign in to Host Dashboard
            </Link>
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="text-xs text-kokan-earth/50 hover:text-kokan-green transition-colors">
            ← Return to Visit Kokan Home
          </Link>
        </div>
      </div>
    </div>
  );
}
