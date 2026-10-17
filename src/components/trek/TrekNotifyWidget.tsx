"use client";

import { Bell, Users, MessageCircle } from "lucide-react";

interface TrekNotifyWidgetProps {
  trekName: string;
  pricePerPerson: number;
  whatsappGroupLink?: string;
}

const ENQUIRY_WHATSAPP_NUMBER = "918432587706"; // ← REPLACE with your number, country code no + or spaces

export default function TrekNotifyWidget({
  trekName, pricePerPerson, whatsappGroupLink,
}: TrekNotifyWidgetProps) {
  const enquiryMessage = encodeURIComponent(
    `Hi! I have a group of 8+ people interested in the "${trekName}" trek. Can you help us arrange a date for this?`
  );
  const enquiryLink = `https://wa.me/${ENQUIRY_WHATSAPP_NUMBER}?text=${enquiryMessage}`;

  const Content = (
    <>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-2xl font-bold text-kokan-earth">₹{pricePerPerson.toLocaleString("en-IN")}</span>
        <span className="text-sm text-kokan-earth/40">/ person</span>
      </div>
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
        <span className="text-xl">⏳</span>
        <p className="text-xs text-amber-700 leading-relaxed">
          No date scheduled yet for this trek. Get notified when one opens, or enquire if you have a group.
        </p>
      </div>

      <div className="space-y-2.5">
        {whatsappGroupLink && (
          <a
            href={whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-kokan-green text-kokan-green rounded-xl font-bold text-sm hover:bg-kokan-green/5 transition-colors"
          >
            <Bell className="w-4 h-4" /> Notify Me (Join WhatsApp Group)
          </a>
        )}
        <a
          href={enquiryLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-kokan-green text-white rounded-xl font-bold text-sm hover:bg-kokan-green/90 transition-colors shadow-lg shadow-kokan-green/20"
        >
          <Users className="w-4 h-4" /> Enquire for Group (8+)
        </a>
      </div>
      <p className="text-center text-[11px] text-kokan-earth/30 mt-3 flex items-center justify-center gap-1">
        <MessageCircle className="w-3 h-3" /> Opens WhatsApp
      </p>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block bg-white rounded-2xl border border-kokan-sand/30 shadow-sm overflow-hidden p-5">
        {Content}
      </div>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-kokan-sand/30 px-4 py-3 shadow-2xl space-y-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-kokan-earth">₹{pricePerPerson.toLocaleString("en-IN")}<span className="text-xs text-kokan-earth/40 font-normal">/person</span></span>
          <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-full">⏳ Coming Soon</span>
        </div>
        <div className="flex gap-2">
          {whatsappGroupLink && (
            <a
              href={whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 border-kokan-green text-kokan-green rounded-xl font-bold text-xs"
            >
              <Bell className="w-3.5 h-3.5" /> Notify Me
            </a>
          )}
          <a
            href={enquiryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-kokan-green text-white rounded-xl font-bold text-xs"
          >
            <Users className="w-3.5 h-3.5" /> Enquire
          </a>
        </div>
      </div>
    </>
  );
}