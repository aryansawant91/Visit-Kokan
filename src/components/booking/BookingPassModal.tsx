"use client";

import { useEffect, useRef } from "react";
import { Order } from "@/types/order";
import {
  Printer,
  Download,
  X,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Users,
  Bus,
  AlertTriangle,
  Phone,
  QrCode,
} from "lucide-react";

interface Props {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingPassModal({ order, isOpen, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isTrek = order.orderType === "trek";
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    `VISIT-KOKAN|PASS|${order.id}|${order.orderType}|${order.totalAmount}`
  )}`;

  const whatsappShareText = encodeURIComponent(
    `🎟️ My Visit Kokan Booking Pass:\n\n• Order ID: ${order.id}\n• Trip: ${
      order.trekName || "Kokan Expedition"
    }\n• Date: ${order.trekDate || formattedDate}\n• Status: ${
      order.status === "confirmed" ? "Confirmed" : "Verified"
    }\n\nView official pass: https://visitkokan.in/order-confirmation/${order.id}`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      {/* Container */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-900/10 overflow-hidden my-auto"
      >
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-[#0f2a1a] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Official E-Pass &amp; Boarding Ticket
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer size={13} />
              <span>Print / Save PDF</span>
            </button>

            <a
              href={`https://wa.me/?text=${whatsappShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all cursor-pointer"
              title="Share on WhatsApp"
            >
              <Share2 size={13} />
              <span className="hidden sm:inline">Share</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            PRINTABLE TICKET SECTION (Visible on screen and in print)
           ══════════════════════════════════════════════════════════════ */}
        <div id="printable-ticket" className="p-6 sm:p-8 bg-[#fafcf9] text-[#12261a] space-y-6">
          {/* Ticket Header & Seal */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b-2 border-emerald-800/15 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl sm:text-2xl font-black font-playfair tracking-tight text-[#113822]">
                  Visit<span className="text-[#c18c47]">Kokan</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                  Verified Pass
                </span>
              </div>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-900/70">
                Official Expedition Boarding Ticket &amp; Travel Voucher
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">
                Booking Reference ID
              </span>
              <span className="font-mono text-sm sm:text-base font-black text-[#113822] tracking-wider">
                {order.id}
              </span>
              <span className="text-[10px] text-gray-500 block">Issued: {formattedDate}</span>
            </div>
          </div>

          {/* Trip Hero Capsule */}
          <div className="bg-gradient-to-br from-[#122c1b] via-[#1a442a] to-[#255e39] text-white p-5 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                {isTrek ? "1D 1N Weekend Expedition" : "Kokan E-Commerce Order"}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  order.status === "confirmed"
                    ? "bg-emerald-400 text-emerald-950 font-black"
                    : "bg-amber-400 text-amber-950 font-black"
                }`}
              >
                {order.status === "confirmed" ? "STATUS: SEAT CONFIRMED" : "STATUS: PENDING PICKUP VERIFICATION"}
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white">
                {isTrek ? order.trekName || "Sahyadri Fort Expedition" : "Authentic Konkan Products"}
              </h2>
              {isTrek && (
                <p className="text-xs text-emerald-100/80 mt-1 flex items-center gap-1.5">
                  <Clock size={13} className="text-emerald-300 shrink-0" />
                  <span>
                    Batch Departure: <strong>{order.trekDate || "Every Saturday 10:00 PM"}</strong>
                  </span>
                </p>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="pt-2 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-white/60 block uppercase font-medium">Guest Email</span>
                <span className="font-bold text-white truncate block">{order.userEmail}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/60 block uppercase font-medium">Reserved Slots</span>
                <span className="font-bold text-white">
                  {isTrek ? `${order.persons?.length || 1} Trekker(s)` : `${order.items?.length || 1} Item(s)`}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-white/60 block uppercase font-medium">Paid Amount</span>
                <span className="font-bold text-[#b8dc26]">₹{order.totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/60 block uppercase font-medium">Payment ID</span>
                <span className="font-mono font-bold text-white truncate block">
                  {order.razorpayPaymentId || "CASH-OFFLINE"}
                </span>
              </div>
            </div>
          </div>

          {/* Mumbai Pickups & Boarding Details (Trek Only) */}
          {isTrek && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#123822] flex items-center gap-1.5">
                  <Bus size={14} className="text-emerald-700" /> Mumbai 10:00 PM Saturday Pickup Schedule
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  AC Push-back Coach
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-[#253f2c]">
                <div className="p-2 bg-[#f6f9f5] rounded-xl border border-[#e1ece0]">
                  <span className="font-bold text-[#113822] block">10:00 PM</span>
                  <span className="text-[11px] text-gray-600">Borivali (National Park Gate)</span>
                </div>
                <div className="p-2 bg-[#f6f9f5] rounded-xl border border-[#e1ece0]">
                  <span className="font-bold text-[#113822] block">10:25 PM</span>
                  <span className="text-[11px] text-gray-600">Andheri (Bisleri WEH)</span>
                </div>
                <div className="p-2 bg-[#f6f9f5] rounded-xl border border-[#e1ece0]">
                  <span className="font-bold text-[#113822] block">10:50 PM</span>
                  <span className="text-[11px] text-gray-600">Sion Circle (Cineplanet)</span>
                </div>
                <div className="p-2 bg-[#f6f9f5] rounded-xl border border-[#e1ece0]">
                  <span className="font-bold text-[#113822] block">11:10 PM</span>
                  <span className="text-[11px] text-gray-600">Chembur (Kalaniketan)</span>
                </div>
                <div className="p-2 bg-[#f6f9f5] rounded-xl border border-[#e1ece0]">
                  <span className="font-bold text-[#113822] block">11:35 PM</span>
                  <span className="text-[11px] text-gray-600">Vashi (Toll Plaza)</span>
                </div>
                <div className="p-2 bg-[#f6f9f5] rounded-xl border border-[#e1ece0]">
                  <span className="font-bold text-[#113822] block">11:55 PM</span>
                  <span className="text-[11px] text-gray-600">Panvel (Kalamboli Circle)</span>
                </div>
              </div>
            </div>
          )}

          {/* Verification QR Code & Inclusions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 items-center">
            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border-2 border-dashed border-gray-300 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Verification QR"
                className="w-28 h-28 object-contain rounded-lg"
              />
              <span className="text-[9px] font-mono text-gray-400 mt-1 uppercase tracking-wider">
                Scan for Boarding
              </span>
            </div>

            {/* Inclusions & Rules */}
            <div className="sm:col-span-2 space-y-2 text-xs">
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-[#173a24]">
                <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-900 mb-1 flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-700" /> Inclusions Covered
                </p>
                <p className="text-[11px] leading-relaxed text-emerald-950/80">
                  {isTrek
                    ? "Private AC bus transit (Mumbai ⇄ Base ⇄ Mumbai), morning breakfast, hot masala chai, traditional Maharashtrian feast lunch, certified first-aid trek leaders, and forest/fort entry permits."
                    : "Authentic, cold-processed Konkan coastal products securely packaged with transit tracking."}
                </p>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-[#422d0d]">
                <p className="font-bold text-[11px] uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1">
                  <AlertTriangle size={13} className="text-amber-700" /> Mandatory Checklist
                </p>
                <p className="text-[11px] leading-relaxed text-amber-950/80">
                  Carry Government Photo ID (Aadhaar / Driving License), sturdy trekking shoes with lug grip, minimum 2L water, and personal medications.
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Helpline & Footer */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-500 gap-2">
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-emerald-700" />
              <span>
                Emergency Desk / Trek Lead: <strong>+91 84325 87706</strong>
              </span>
            </div>
            <div className="text-[11px] text-gray-400">
              visitkokan.in · Official Tourism &amp; Trekking Gateway
            </div>
          </div>
        </div>

        {/* Modal Bottom Buttons (Hidden on Print) */}
        <div className="no-print bg-gray-50 border-t border-gray-200 px-5 py-3.5 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500 hidden sm:block">
            Tip: Select &quot;Save as PDF&quot; in the print dialog to store this ticket on your device.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 bg-kokan-green hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-kokan-green/20 transition-all cursor-pointer"
            >
              <Download size={13} />
              <span>Download PDF Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          CSS FOR PRINTING / SAVE AS PDF
         ══════════════════════════════════════════════════════════════ */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-ticket,
          #printable-ticket * {
            visibility: visible !important;
          }
          #printable-ticket {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background: #ffffff !important;
            color: #000000 !important;
            border: 2px solid #123822 !important;
            border-radius: 16px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

