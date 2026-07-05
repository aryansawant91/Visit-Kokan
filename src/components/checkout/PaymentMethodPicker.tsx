"use client";

import { Wallet, CreditCard } from "lucide-react";

interface Props {
  selected: "online" | "cod";
  onSelect: (method: "online" | "cod") => void;
  codAvailable: boolean;
}

export default function PaymentMethodPicker({ selected, onSelect, codAvailable }: Props) {
  return (
    <div className="space-y-2.5">
      <button
        onClick={() => onSelect("online")}
        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
          selected === "online"
            ? "border-kokan-green bg-kokan-green/5"
            : "border-kokan-sand/40 bg-white hover:border-kokan-green/30"
        }`}
      >
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          selected === "online" ? "border-kokan-green" : "border-gray-300"
        }`}>
          {selected === "online" && <div className="w-2 h-2 rounded-full bg-kokan-green" />}
        </div>
        <CreditCard size={18} className="text-kokan-green flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-kokan-earth">Pay Online</p>
          <p className="text-xs text-kokan-earth/50">UPI, Cards, Net Banking via Razorpay</p>
        </div>
      </button>

      <button
        onClick={() => codAvailable && onSelect("cod")}
        disabled={!codAvailable}
        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
          !codAvailable
            ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
            : selected === "cod"
            ? "border-kokan-green bg-kokan-green/5"
            : "border-kokan-sand/40 bg-white hover:border-kokan-green/30"
        }`}
      >
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          selected === "cod" && codAvailable ? "border-kokan-green" : "border-gray-300"
        }`}>
          {selected === "cod" && codAvailable && <div className="w-2 h-2 rounded-full bg-kokan-green" />}
        </div>
        <Wallet size={18} className="text-amber-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-kokan-earth">Cash on Delivery</p>
          <p className="text-xs text-kokan-earth/50">
            {codAvailable ? "Pay cash when your order arrives" : "Not available for items in your cart"}
          </p>
        </div>
      </button>
    </div>
  );
}