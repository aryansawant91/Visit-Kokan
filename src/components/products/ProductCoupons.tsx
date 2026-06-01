"use client";

import { useState } from "react";
import { Tag, Copy, Check, Zap } from "lucide-react";
import { ProductCoupon } from "@/types/product";

interface Props {
  coupons: ProductCoupon[];
  price: number;
  onApply: (coupon: ProductCoupon | null) => void;
}

export default function ProductCoupons({ coupons, price, onApply }: Props) {
  const [applied, setApplied] = useState<ProductCoupon | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  if (!coupons || coupons.length === 0) return null;

  const handleApply = (coupon: ProductCoupon) => {
    if (applied?.code === coupon.code) {
      setApplied(null);
      onApply(null);
    } else {
      setApplied(coupon);
      onApply(coupon);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const getSavings = (coupon: ProductCoupon) => {
    if (coupon.type === "percent") return Math.round(price * coupon.discount / 100);
    return coupon.discount;
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-kokan-earth flex items-center gap-2 text-sm">
        <Tag className="w-4 h-4 text-kokan-green" /> Available Offers
      </h3>
      <div className="space-y-2">
        {coupons.map((coupon) => {
          const savings = getSavings(coupon);
          const isApplied = applied?.code === coupon.code;
          const eligible = !coupon.minOrder || price >= coupon.minOrder;

          return (
            <div
              key={coupon.code}
              className={`border rounded-xl p-3 transition-all ${
                isApplied
                  ? "border-kokan-green/50 bg-kokan-green/5"
                  : eligible
                  ? "border-kokan-sand/40 bg-white"
                  : "border-kokan-sand/20 bg-kokan-sand/5 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono font-bold text-kokan-green text-sm bg-kokan-green/10 px-2 py-0.5 rounded">
                      {coupon.code}
                    </span>
                    {isApplied && (
                      <span className="text-xs text-kokan-green font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> Applied
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-kokan-earth/60">{coupon.label}</p>
                  <p className="text-xs text-kokan-green font-medium mt-0.5">
                    Save ₹{savings.toLocaleString("en-IN")}
                    {coupon.type === "percent" && ` (${coupon.discount}% off)`}
                  </p>
                  {coupon.minOrder && (
                    <p className="text-xs text-kokan-earth/40">Min. order ₹{coupon.minOrder}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="p-1.5 rounded-lg border border-kokan-sand/40 hover:bg-kokan-sand/10 transition-colors"
                    title="Copy code"
                  >
                    {copied === coupon.code
                      ? <Check className="w-3.5 h-3.5 text-kokan-green" />
                      : <Copy className="w-3.5 h-3.5 text-kokan-earth/40" />}
                  </button>
                  {eligible && (
                    <button
                      onClick={() => handleApply(coupon)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isApplied
                          ? "bg-red-50 text-red-500 hover:bg-red-100"
                          : "bg-kokan-green text-white hover:bg-kokan-green/90"
                      }`}
                    >
                      {isApplied ? "Remove" : "Apply"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {applied && (
        <div className="flex items-center gap-2 bg-kokan-green/10 border border-kokan-green/30 rounded-xl px-4 py-2.5">
          <Zap className="w-4 h-4 text-kokan-green" />
          <p className="text-sm text-kokan-green font-medium">
            Coupon {applied.code} applied! You save ₹{getSavings(applied).toLocaleString("en-IN")}
          </p>
        </div>
      )}
    </div>
  );
}