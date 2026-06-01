"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Store, CheckCircle, ArrowRight } from "lucide-react";

export default function VendorRegisterPage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (profile?.role === "vendor") router.replace("/vendor/dashboard");
    if (profile?.role === "admin") router.replace("/admin/dashboard");
  }, [profile]);

  return (
    <div className="min-h-screen bg-kokan-cream/30 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-kokan-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-kokan-green" />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-kokan-earth mb-2">
            List Your Business
          </h1>
          <p className="text-kokan-earth/60 text-sm">
            Join 120+ vendors on Visit Kokan and reach thousands of travellers
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30 space-y-3">
          <h2 className="font-semibold text-kokan-earth mb-4">Why list on Visit Kokan?</h2>
          {[
            "Reach 5,000+ monthly travellers planning Kokan trips",
            "List homestays, food, activities, products and more",
            "Simple vendor dashboard to manage bookings",
            "Zero commission for the first 3 months",
            "Dedicated support to set up your profile",
          ].map((benefit) => (
            <div key={benefit} className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-kokan-green flex-shrink-0 mt-0.5" />
              <span className="text-sm text-kokan-earth/70">{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        {user ? (
          <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30 text-center space-y-3">
            <p className="text-sm text-kokan-earth/60">
              You're logged in as <span className="font-medium text-kokan-earth">{profile?.email}</span>
            </p>
            <p className="text-xs text-kokan-earth/40">
              To become a vendor, register a new account with the Vendor option selected
            </p>
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 w-full py-3 bg-kokan-green text-white rounded-xl font-semibold text-sm hover:bg-kokan-green/90 transition-colors"
            >
              Register as Vendor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link
              href="/register"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-kokan-green text-white rounded-xl font-semibold text-sm hover:bg-kokan-green/90 transition-colors"
            >
              Register as Vendor
            </Link>
            <Link
              href="/login"
              className="flex-1 flex items-center justify-center py-3 border border-kokan-sand rounded-xl text-sm text-kokan-earth/60 hover:bg-kokan-sand/10 transition-colors"
            >
              Already have account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}