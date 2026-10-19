"use client";

import { CreditCard, Bell, Users, MessageCircle } from "lucide-react";

interface Props {
  price?: number;
  scheduledDate?: string | null;
  whatsappGroupLink?: string;
  trekName: string;
}

export default function TrekStickyBar({
  price,
  scheduledDate,
  whatsappGroupLink,
  trekName,
}: Props) {
  const enquiryMessage = encodeURIComponent(
    `Hi! I have a group interested in the "${trekName}" trek. Can you help us arrange a date for this?`
  );
  const enquiryLink = `https://wa.me/918432587706?text=${enquiryMessage}`;

  const handleBookClick = () => {
    // Open booking modal
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-trek-booking"));
      const el = document.getElementById("booking-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#edf3eb]/95 backdrop-blur-md border-t border-[#d6e2d4] py-3.5 px-5">
      <div className="max-w-md sm:max-w-lg mx-auto flex items-center justify-between gap-4">
        {/* Left: Price / Season Info */}
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#526b58]">
            {scheduledDate ? "Trip Fare" : "Per Person"}
          </span>
          <span className="text-[16px] sm:text-lg font-black text-[#0f2416] leading-tight flex items-baseline gap-1">
            ₹{price?.toLocaleString("en-IN") ?? "—"}
            <span className="text-xs font-normal text-[#526b58]">/person</span>
          </span>
        </div>

        {/* Right: Primary Action Button */}
        <button
          onClick={handleBookClick}
          className="px-7 py-3.5 bg-[#b8dc26] hover:bg-[#aed422] active:scale-95 text-[#142607] font-black text-sm rounded-full shadow-md shadow-[#b8dc26]/30 transition-all flex items-center gap-1.5 shrink-0"
        >
          Book Trek 🥾
        </button>
      </div>
    </div>
  );
}
