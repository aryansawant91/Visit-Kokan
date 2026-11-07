"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CartPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/checkout");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-kokan-cream">
      <div className="flex items-center gap-2 text-kokan-earth font-medium">
        <Loader2 className="w-5 h-5 animate-spin text-kokan-green" />
        <span>Loading your cart...</span>
      </div>
    </div>
  );
}
