"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Store, CheckCircle, ArrowRight, ShieldCheck, Sparkles, Building2 } from "lucide-react";

export default function VendorRegisterPage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (profile?.role === "vendor") router.replace("/vendor/dashboard");
    if (profile?.role === "admin") router.replace("/admin/dashboard");
  }, [profile, router]);

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
                  To list a homestay or business, register a dedicated host account with the Host/Vendor option selected.
                </p>
                <Link
                  href="/register?tab=vendor"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-kokan-green text-white rounded-full font-bold text-sm hover:bg-emerald-800 transition-all shadow-xs"
                >
                  Register as Homestay Host / Vendor <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <Link
              href="/register?tab=vendor"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-kokan-green text-white rounded-full font-bold text-sm hover:bg-emerald-800 transition-all shadow-xs active:scale-95 text-center"
            >
              <span>Register as Homestay Host / Vendor</span>
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
