"use client";

import { useEffect, useRef, useState } from "react";
import { Order } from "@/types/order";
import QRCode from "qrcode";
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
  Mail,
  Check,
  ExternalLink,
} from "lucide-react";

interface Props {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onDownloaded?: () => void;
}

export default function BookingPassModal({ order, isOpen, onClose, onDownloaded }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isPrinting, setIsPrinting] = useState(false);

  // Generate high-resolution scannable QR code on mount
  useEffect(() => {
    if (!order?.id) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://visitkokan.in";
    const verificationUrl = `${origin}/order-confirmation/${order.id}`;

    QRCode.toDataURL(verificationUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: "#0f2d19",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => {
        console.error("QR generation error:", err);
        // Fallback to basic QR data URL
        setQrDataUrl(
          `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
            verificationUrl
          )}`
        );
      });
  }, [order.id]);

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
    setIsPrinting(true);
    // Unset body overflow hidden so print engine can lay out the full document
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "visible";

    // Allow DOM to settle then trigger print
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.style.overflow = prevOverflow;
        setIsPrinting(false);
        if (onDownloaded) onDownloaded();
      }, 500);
    }, 150);
  };

  const isTrek = order.orderType === "trek";
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const originUrl = typeof window !== "undefined" ? window.location.origin : "https://visitkokan.in";
  const verificationLink = `${originUrl}/order-confirmation/${order.id}`;

  const whatsappShareText = encodeURIComponent(
    `🎟️ *My Visit Kokan Official Booking Pass*\n\n` +
      `• *Order ID:* ${order.id}\n` +
      `• *Trip:* ${order.trekName || "Kokan Expedition"}\n` +
      `• *Batch Date:* ${order.trekDate || formattedDate}\n` +
      `• *Status:* ${order.status === "confirmed" ? "Confirmed ✅" : "Verified"}\n` +
      `• *Amount Paid:* ₹${order.totalAmount.toLocaleString("en-IN")}\n\n` +
      `👉 View & Verify Official Pass:\n${verificationLink}`
  );

  return (
    <div className="booking-pass-backdrop fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-5">
      {/* Container */}
      <div
        ref={modalRef}
        className="booking-pass-card relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-900/10 overflow-hidden my-auto"
      >
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-[#0f2a1a] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Official Boarding Ticket &amp; Voucher
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-95 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
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
        <div id="printable-ticket" className="p-5 sm:p-8 bg-[#fafcf9] text-[#12261a] space-y-5">
          {/* Ticket Header & Brand Seal */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b-2 border-emerald-800/20 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl sm:text-3xl font-black font-playfair tracking-tight text-[#113822]">
                  Visit<span className="text-[#c18c47]">Kokan</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider border border-emerald-300">
                  Verified Pass
                </span>
              </div>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-900/70">
                Official Tourism &amp; Sahyadri Expedition Gateway
              </p>
            </div>

            <div className="text-left sm:text-right bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">
                Booking Reference ID
              </span>
              <span className="font-mono text-sm sm:text-base font-black text-[#113822] tracking-wider block">
                {order.id}
              </span>
              <span className="text-[10px] text-gray-500 block">Booked: {formattedDate}</span>
            </div>
          </div>

          {/* Trip Hero Capsule */}
          <div className="bg-gradient-to-br from-[#122c1b] via-[#1a442a] to-[#255e39] text-white p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                {isTrek ? "Sahyadri Fort Weekend Expedition" : "Authentic Konkan Products"}
              </span>
              <span
                className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                  order.status === "confirmed"
                    ? "bg-emerald-400 text-emerald-950 font-black"
                    : "bg-amber-400 text-amber-950 font-black"
                }`}
              >
                {order.status === "confirmed"
                  ? "STATUS: SEAT CONFIRMED ✅"
                  : "STATUS: PENDING PICKUP VERIFICATION ⏳"}
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {isTrek ? order.trekName || "Sahyadri Fort Expedition" : "Authentic Konkan Products Order"}
              </h2>
              {isTrek && (
                <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 flex items-center gap-1.5">
                  <Clock size={14} className="text-emerald-300 shrink-0" />
                  <span>
                    Scheduled Batch Departure:{" "}
                    <strong className="text-white underline decoration-emerald-400 underline-offset-2">
                      {order.trekDate || "Every Saturday 10:00 PM"}
                    </strong>
                  </span>
                </p>
              )}
            </div>

            {/* Quick Summary Grid */}
            <div className="pt-2.5 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div>
                <span className="text-[10px] text-white/60 block uppercase font-medium">Lead Guest</span>
                <span className="font-bold text-white truncate block">
                  {order.userName || order.userEmail.split("@")[0]}
                </span>
                <span className="text-[10px] text-white/70 truncate block">{order.userEmail}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/60 block uppercase font-medium">Reserved Slots</span>
                <span className="font-bold text-white">
                  {isTrek
                    ? `${order.persons?.length || 1} Trekker Slot(s)`
                    : `${order.items?.length || 1} Item(s)`}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-white/60 block uppercase font-medium">Paid Online</span>
                <span className="font-bold text-[#b8dc26] text-sm">
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-white/60 block uppercase font-medium">Payment Reference</span>
                <span className="font-mono font-bold text-white text-[11px] truncate block">
                  {order.razorpayPaymentId || "CASH-ON-MEETUP"}
                </span>
              </div>
            </div>
          </div>

          {/* Registered Trekkers Roster (Trek Only) */}
          {isTrek && order.persons && order.persons.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                <span className="text-xs font-black uppercase tracking-wider text-[#123822] flex items-center gap-1.5">
                  <Users size={14} className="text-emerald-700" /> Registered Passenger Roster (
                  {order.persons.length})
                </span>
                <span className="text-[10px] text-gray-500">Official Roster</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {order.persons.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-[#f7faf6] rounded-xl border border-emerald-100 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-kokan-earth block">
                        {idx + 1}. {p.name}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {p.gender ? `${p.gender.toUpperCase()} · ` : ""}
                        {p.age ? `${p.age} yrs` : ""}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        p.foodPreference === "non-veg"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {p.foodPreference === "non-veg" ? "Non-Veg Meal" : "Veg Meal"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Balance Payment Notice if applicable */}
          {order.remainingCash && order.remainingCash > 0 ? (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
              <div>
                <span className="font-bold block">💵 Balance Due at Pickup</span>
                <span className="text-[11px] text-amber-900/80">
                  Please keep this exact amount ready in cash for your trek leader at the bus boarding point.
                </span>
              </div>
              <span className="font-black text-amber-900 text-sm ml-2">
                ₹{order.remainingCash.toLocaleString("en-IN")}
              </span>
            </div>
          ) : null}

          {/* Mumbai Pickups & Boarding Details (Trek Only) */}
          {isTrek && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-2.5">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 items-stretch">
            {/* Real Scannable QR Code */}
            <div className="flex flex-col items-center justify-center p-3.5 bg-white rounded-2xl border-2 border-emerald-900/20 text-center shadow-xs">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt={`Booking QR Code - ${order.id}`}
                  className="w-32 h-32 object-contain rounded-lg shadow-2xs"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                  Generating QR...
                </div>
              )}
              <span className="text-[10px] font-black uppercase tracking-wider text-[#113822] mt-1.5 block">
                Official Boarding QR
              </span>
              <span className="text-[9px] text-gray-500 block leading-tight">
                Scan with any phone camera to verify booking
              </span>
              <span className="text-[8px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                VK-PASS-{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>

            {/* Inclusions & Rules */}
            <div className="sm:col-span-2 space-y-2 text-xs flex flex-col justify-between">
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-[#173a24]">
                <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-900 mb-1 flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-700" /> Inclusions Covered
                </p>
                <p className="text-[11px] leading-relaxed text-emerald-950/80">
                  {isTrek
                    ? "Private AC bus transit (Mumbai ⇄ Base ⇄ Mumbai), morning hot breakfast, herbal masala chai, traditional Konkani feast lunch, certified first-aid trek leaders, and forest/fort entry permits."
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
          <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-600 gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[#113822] font-semibold">
                <Phone size={12} className="text-emerald-700" /> +91 84325 87706
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <Mail size={12} className="text-gray-400" /> konkanvisit@gmail.com
              </span>
            </div>
            <div className="text-[10px] text-gray-400">
              visitkokan.in · Official Tourism &amp; Trekking Gateway
            </div>
          </div>
        </div>

        {/* Modal Bottom Buttons (Hidden on Print) */}
        <div className="no-print bg-gray-50 border-t border-gray-200 px-5 py-3.5 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500 hidden sm:block">
            Tip: In the print dialog, choose &quot;Save as PDF&quot; to download your digital ticket.
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
          CSS FOR PRINTING / SAVE AS PDF — 100% RELIABLE NO BLANK PAGES
         ══════════════════════════════════════════════════════════════ */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            overflow: visible !important;
            height: auto !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body > * {
            visibility: hidden !important;
          }
          .booking-pass-backdrop {
            position: static !important;
            display: block !important;
            overflow: visible !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            visibility: visible !important;
            inset: auto !important;
            width: 100% !important;
            height: auto !important;
          }
          .booking-pass-card {
            position: static !important;
            display: block !important;
            overflow: visible !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            visibility: visible !important;
          }
          #printable-ticket,
          #printable-ticket * {
            visibility: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #printable-ticket {
            display: block !important;
            position: relative !important;
            width: 100% !important;
            max-width: 100% !important;
            background: #ffffff !important;
            color: #12261a !important;
            border: 2px solid #113822 !important;
            border-radius: 12px !important;
            box-shadow: none !important;
            padding: 24px !important;
            margin: 0 auto !important;
          }
          .no-print,
          .no-print * {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>
    </div>
  );
}
