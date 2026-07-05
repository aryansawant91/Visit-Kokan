"use client";

import { useEffect, useState } from "react";
import { Tag, X, Copy, Check } from "lucide-react";

interface VisibleCoupon {
  code: string;
  discount: number;
  discountType: "flat" | "percent";
  description: string;
  minAmount: number;
  label: string;
}

interface AppliedCoupon {
  code: string;
  discount: number;
  discountType: "flat" | "percent";
  description: string;
}

interface Props {
  price: number;
  onApply: (coupon: AppliedCoupon | null) => void;
}

export default function ProductCouponWidget({ price, onApply }: Props) {
  const [visible, setVisible]     = useState<VisibleCoupon[]>([]);
  const [input, setInput]         = useState("");
  const [applied, setApplied]     = useState<AppliedCoupon | null>(null);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [open, setOpen]           = useState(false);

  useEffect(() => {
    fetch("/api/coupons/product")
      .then(r => r.json())
      .then(data => setVisible(data.visible ?? []))
      .catch(() => {});
  }, []);

  const applyCoupon = async () => {
    const code = input.trim().toUpperCase();
    if (!code) { setError("Enter a coupon code"); return; }
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/coupons/product/validate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ code, amount: price }),
      });
      const data = await res.json();
      if (data.valid) {
        const result: AppliedCoupon = {
          code: data.code, discount: data.discount,
          discountType: data.discountType, description: data.description,
        };
        setApplied(result);
        onApply(result);
        setInput("");
      } else {
        setError(data.error ?? "Invalid coupon");
      }
    } catch {
      setError("Could not validate. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setApplied(null);
    onApply(null);
    setError("");
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  if (visible.length === 0 && !applied) return null;

  return (
    <div className="border border-dashed border-kokan-sand/60 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-kokan-cream/30 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-kokan-green">
          <Tag size={14} />
          {applied
            ? <span>Applied: <span className="font-bold">{applied.code}</span></span>
            : "Have a coupon?"}
        </div>
        {applied && (
          <span onClick={(e) => { e.stopPropagation(); removeCoupon(); }}>
            <X size={15} className="text-gray-400 hover:text-red-500" />
          </span>
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-3">
          {!applied && visible.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {visible.map(c => (
                <div key={c.code} className="p-2.5 bg-kokan-green/5 border border-kokan-green/15 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-kokan-earth text-xs">{c.code}</span>
                    <button
                      onClick={() => copyCode(c.code)}
                      className="flex items-center gap-0.5 text-[10px] font-semibold text-kokan-green"
                    >
                      {copiedCode === c.code
                        ? <><Check size={11} /> Copied</>
                        : <><Copy size={11} /> Copy</>}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight">{c.description}</p>
                  {c.minAmount > 0 && (
                    <p className="text-[9px] text-gray-400 mt-0.5">Min ₹{c.minAmount}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {!applied ? (
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => { setInput(e.target.value.toUpperCase()); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                placeholder="Enter coupon code"
                className="flex-1 px-3 py-2 rounded-lg border border-kokan-sand text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
              <button
                onClick={applyCoupon} disabled={loading}
                className="px-4 py-2 bg-kokan-green text-white rounded-lg text-sm font-bold hover:bg-kokan-green/90 disabled:opacity-60"
              >
                {loading ? "…" : "Apply"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2.5 bg-kokan-green/10 rounded-xl">
              <Check size={15} className="text-kokan-green flex-shrink-0" />
              <p className="text-xs font-bold text-kokan-green">{applied.description}</p>
            </div>
          )}

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
      )}
    </div>
  );
}