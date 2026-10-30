"use client";

import { Suspense } from "react";
import PublicTopBar from "@/components/layout/PublicTopBar";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import AIPlanTripView from "@/components/ai/AIPlanTripView";
import { Loader2 } from "lucide-react";

export default function TripPlannerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5]">
      {/* ── Top Navigation Bar ── */}
      <PublicTopBar />

      {/* ── Main AI Trip Planner Canvas ── */}
      <main className="flex-1 pb-20 md:pb-0">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
              <Loader2 className="animate-spin text-[#2D6A4F] mb-3" size={32} />
              <p className="font-semibold text-gray-700 text-sm">
                Loading Kokan Mitra AI Planner...
              </p>
            </div>
          }
        >
          <AIPlanTripView />
        </Suspense>
      </main>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Mobile Bottom Navigation ── */}
      <MobileNav />
    </div>
  );
}
