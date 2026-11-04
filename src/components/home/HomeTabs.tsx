"use client";

import { Suspense } from "react";
import TravelTab from "./TravelTab";

function HomeTabsInner() {
  return (
    <div className="bg-white">
      <TravelTab />
    </div>
  );
}

export default function HomeTabs() {
  return (
    <Suspense
      fallback={
        <div className="bg-white">
          <div className="sticky top-[52px] z-40 bg-white border-b border-kokan-sand/30 h-[52px]" />
        </div>
      }
    >
      <HomeTabsInner />
    </Suspense>
  );
}
