"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag, Compass } from "lucide-react";
import ProductsTab from "./ProductsTab";
import TravelTab from "./TravelTab";

const TABS = [
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "travel",   label: "Travel",   icon: Compass },
] as const;

type TabId = typeof TABS[number]["id"];

// Inner component reads searchParams — must be inside <Suspense>
function HomeTabsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabId>(() => {
    const param = searchParams.get("tab");
    return param === "travel" ? "travel" : "products";
  });

  function switchTab(id: TabId) {
    setActiveTab(id);
    // Write tab to URL so Back button restores it correctly
    const url = id === "travel" ? "/?tab=travel" : "/";
    router.replace(url, { scroll: false });
  }

  return (
    <div className="bg-white">
      {/* Tab bar — sticks below the green HomeTopBar (height ≈ 52px) */}
      <div className="sticky top-[52px] z-40 bg-white border-b border-kokan-sand/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => switchTab(id)}
                className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-all border-b-2 ${
                  activeTab === id
                    ? "border-kokan-green text-kokan-green"
                    : "border-transparent text-kokan-earth/50 hover:text-kokan-earth"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "travel"   && <TravelTab />}
      </div>
    </div>
  );
}

// Outer component provides the Suspense boundary required by useSearchParams
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